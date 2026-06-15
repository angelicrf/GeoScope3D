
"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Selection } from '@/lib/geo-data';
import { RADIUS, getCellFromIntersection } from './GlobeUtils';
import { WorldLayer } from './WorldLayer';
import { ConstellationLayer } from './ConstellationLayer';

interface GlobeProps {
  onSelect: (item: Selection | null) => void;
  onHover: (item: any | null, mousePos: { x: number; y: number } | null) => void;
  controlsRef: React.MutableRefObject<{
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
    center: () => void;
  } | null>;
}

export function Globe({ onSelect, onHover, controlsRef }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsInstanceRef = useRef<OrbitControls | null>(null);
  const registry = useRef({
    labels: [] as THREE.Sprite[],
    popMarkers: [] as THREE.Mesh[],
    satelliteMeshes: [] as THREE.Mesh[],
    satLookup: new Map<string, THREE.Mesh>(),
    orbitShells: [] as any[],
    satUplinks: new THREE.Group(),
    neighborLines: new THREE.Group(),
  }).current;

  const clockRef = useRef(new THREE.Clock());
  const [sceneState, setSceneState] = React.useState<THREE.Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio); renderer.setSize(window.innerWidth, window.innerHeight);
    let selectedSat: THREE.Mesh | null = null;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    setSceneState(scene);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 110;
    controls.maxDistance = 400;
    controlsInstanceRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(100, 100, 100); scene.add(mainLight);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = () => {};

    const updateSelectionLines = (satMesh: THREE.Mesh) => {
      if (!registry.neighborLines) return [];
      
      registry.neighborLines.children.forEach(child => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      registry.neighborLines.clear();

      const { shellIndex, planeIndex, orbitIndex, orbitCount, activePlanesCount } = satMesh.userData;

      // Grid neighbor logic: Wrap around planes and orbits
      const neighborsCoords = [
        { p: planeIndex, o: (orbitIndex + 1) % orbitCount, label: 'Top' },
        { p: planeIndex, o: (orbitIndex - 1 + orbitCount) % orbitCount, label: 'Bottom' },
        { p: (planeIndex + 1) % activePlanesCount, o: orbitIndex, label: 'Right' },
        { p: (planeIndex - 1 + activePlanesCount) % activePlanesCount, o: orbitIndex, label: 'Left' },
      ];

      const startWp = new THREE.Vector3();
      satMesh.getWorldPosition(startWp);

      const neighborData: any[] = [];

      neighborsCoords.forEach(n => {
        const neighborMesh = registry.satLookup.get(`${shellIndex}_${n.p}_${n.o}`);
        if (neighborMesh && neighborMesh !== satMesh) {
          neighborData.push({ ...neighborMesh.userData.data, direction: n.label });
          const endWp = new THREE.Vector3();
          neighborMesh.getWorldPosition(endWp);

          const lineGeom = new THREE.BufferGeometry().setFromPoints([startWp, endWp]);
          const lineMat = new THREE.LineBasicMaterial({ 
            color: 0xff0000, 
            transparent: true, 
            opacity: 0.8,
            depthTest: false 
          });
          const line = new THREE.Line(lineGeom, lineMat);
          registry.neighborLines.add(line);
        }
      });

      return neighborData;
    };

    const onMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      const allIntersects = raycaster.intersectObjects([...scene.children, ...registry.satelliteMeshes], true);
      
      const hit = allIntersects.find(i => ['pop', 'gateway', 'satellite'].includes(i.object.userData.type));
      
      if (hit) {
        const hitObj = hit.object.userData.type === 'satellite' ? hit.object : hit.object.parent;
        if (hitObj && hitObj.userData.type === 'satellite') {
          selectedSat = hitObj as THREE.Mesh;
          const neighbors = updateSelectionLines(selectedSat);
          onSelect({ ...hitObj.userData.data, neighbors });
        } else {
          selectedSat = null;
          registry.neighborLines.clear();
          onSelect(hit.object.userData.data);
        }
        return;
      }

      const globeIntersects = raycaster.intersectObjects(scene.children.filter(o => o.type === 'Mesh'));
      if (globeIntersects.length > 0) {
        const hitPoint = globeIntersects[0].point;
        const cellInfo = getCellFromIntersection(hitPoint);
        selectedSat = null;
        registry.neighborLines.clear();
        onSelect(cellInfo);
      }
    };

    window.addEventListener('click', onMouseClick);

    controlsRef.current = {
      zoomIn: () => {
        const newPos = camera.position.clone().multiplyScalar(0.9);
        if (newPos.length() > controls.minDistance) camera.position.copy(newPos);
      },
      zoomOut: () => {
        const newPos = camera.position.clone().multiplyScalar(1.1);
        if (newPos.length() < controls.maxDistance) camera.position.copy(newPos);
      },
      reset: () => {
        camera.position.set(0, 0, 250);
        controls.reset();
      },
      center: () => {
        camera.position.set(0, 0, camera.position.length());
        controls.target.set(0, 0, 0);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clockRef.current.getDelta();
      const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      const cameraNorm = camera.position.clone().normalize();
      const worldPos = new THREE.Vector3();
      
      registry.labels.forEach(label => {
        label.getWorldPosition(worldPos);
        const dot = worldPos.clone().normalize().dot(cameraNorm);
        label.visible = dot > 0.15; 
        const scaleFactor = distance / 250;
        const baseScaleX = label.scale.x === 8 ? 8 : 12; 
        const baseScaleY = label.scale.y === 2 ? 2 : 3;
        label.scale.set(baseScaleX * scaleFactor, baseScaleY * scaleFactor, 1);
      });
      
      if (registry.orbitShells.length > 0) {
        // Each satellite makes a full orbit in 90 minutes (5400 seconds)
        const satOrbitalSpeed = (Math.PI * 2) / 5400;

        registry.orbitShells.forEach((shell, shellIndex) => {
          shell.planeGroups.forEach((plane: any) => {
            plane.satelliteGroup.rotation.y -= satOrbitalSpeed * delta * (1 + shellIndex * 0.02);
          });
        });

        if (selectedSat) {
          updateSelectionLines(selectedSat);
        }

        controls.update();
        const popWps = registry.popMarkers.map(p => { const wp = new THREE.Vector3(); p.getWorldPosition(wp); return wp; });

        registry.satelliteMeshes.forEach((sat, i) => {
          const satWp = new THREE.Vector3(); sat.getWorldPosition(satWp);
          let minDist = Infinity;
          let closest = popWps[0];
          popWps.forEach(p => {
            const d = satWp.distanceToSquared(p);
            if (d < minDist) { minDist = d; closest = p; }
          });

          const uplink = registry.satUplinks.children[i] as THREE.Line;
          const array = uplink.geometry.attributes.position.array as Float32Array;
          array[0] = satWp.x; array[1] = satWp.y; array[2] = satWp.z;
          array[3] = closest.x; array[4] = closest.y; array[5] = closest.z;
          uplink.geometry.attributes.position.needsUpdate = true;
          uplink.geometry.computeBoundingSphere();
        });
      }

      renderer.render(sceneRef.current!, cameraRef.current!);
    };
    animate();

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); window.removeEventListener('click', onMouseClick);
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, [onSelect, onHover, controlsRef, registry]);

  return (
    <div ref={containerRef} className="globe-container">
      {sceneState && (
        <>
          <WorldLayer scene={sceneState} popMarkers={registry.popMarkers} labels={registry.labels} />
          <ConstellationLayer scene={sceneState} satelliteMeshes={registry.satelliteMeshes} satLookup={registry.satLookup} orbitShells={registry.orbitShells} satUplinks={registry.satUplinks} neighborLines={registry.neighborLines} />
        </>
      )}
    </div>
  );
}

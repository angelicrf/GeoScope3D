
"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  COUNTRIES, 
  POPS, 
  POP_CONNECTIONS, 
  GATEWAYS, 
  GATEWAY_CONNECTIONS, 
  SATELLITES,
  Selection, 
  GlobeCell 
} from '@/lib/geo-data';

interface GlobeProps {
  onSelect: (item: Selection | null) => void;
  controlsRef: React.MutableRefObject<{
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
    center: () => void;
  } | null>;
}

export function Globe({ onSelect, controlsRef }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsInstanceRef = useRef<OrbitControls | null>(null);
  const markersRef = useRef<THREE.Group | null>(null);
  const connectionsRef = useRef<THREE.Group | null>(null);
  const orbitsRef = useRef<THREE.Group | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const cellGridRef = useRef<THREE.Mesh | null>(null);
  const satGroupRef = useRef<THREE.Group | null>(null);
  const satUplinksRef = useRef<THREE.Group | null>(null);
  const clockRef = useRef(new THREE.Clock());

  const CELL_STEP = 2; 
  const RADIUS = 100;

  const latLngToVector3 = (lat: number, lng: number, r: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  };

  const createTextLabel = (text: string, color: string = '#0f172a', scale: number = 1) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;
    
    canvas.width = 512;
    canvas.height = 128;
    context.font = 'Bold 48px Space Grotesk, sans-serif';
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 256, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ 
      map: texture, 
      transparent: true,
      depthTest: true,
      depthWrite: false, 
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(12 * scale, 3 * scale, 1);
    return sprite;
  };

  const createArc = (start: THREE.Vector3, end: THREE.Vector3, color: number = 0xfacc15, opacity: number = 0.6) => {
    const midPoint = start.clone().lerp(end, 0.5);
    const distance = start.distanceTo(end);
    const midPointHeight = RADIUS + (distance * 0.15); 
    midPoint.normalize().multiplyScalar(midPointHeight);

    const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color,
      transparent: true,
      opacity,
    });
    
    return new THREE.Line(geometry, material);
  };

  const getCellFromIntersection = (point: THREE.Vector3): GlobeCell => {
    const r = point.length();
    const lat = Math.asin(point.y / r) * (180 / Math.PI);
    const lng = Math.atan2(point.z, -point.x) * (180 / Math.PI);

    const cols = 360 / CELL_STEP;
    const col = Math.floor((lng + 180) / CELL_STEP);
    const row = Math.floor((lat + 90) / CELL_STEP);
    
    const cellId = row * cols + col;
    
    const minLat = row * CELL_STEP - 90;
    const maxLat = minLat + CELL_STEP;
    const minLng = col * CELL_STEP - 180;
    const maxLng = minLng + CELL_STEP;

    return {
      type: 'cell',
      id: cellId,
      lat,
      lng,
      minLat,
      maxLat,
      minLng,
      maxLng
    };
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 110;
    controls.maxDistance = 400;
    controlsInstanceRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(100, 100, 100);
    scene.add(mainLight);

    const geometry = new THREE.SphereGeometry(RADIUS, 128, 128);
    const textureLoader = new THREE.TextureLoader();
    const worldMapTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-day.jpg');
    const bumpMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');
    
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: worldMapTexture,
      bumpMap: bumpMap,
      bumpScale: 1.2,
      roughness: 0.8,
      metalness: 0.1,
    });
    
    const globe = new THREE.Mesh(geometry, globeMaterial);
    scene.add(globe);
    globeRef.current = globe;

    const gridGeom = new THREE.SphereGeometry(RADIUS + 0.1, 180 / CELL_STEP, 360 / CELL_STEP);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const cellGrid = new THREE.Mesh(gridGeom, gridMat);
    scene.add(cellGrid);
    cellGridRef.current = cellGrid;

    const markers = new THREE.Group();
    scene.add(markers);
    markersRef.current = markers;

    const connections = new THREE.Group();
    scene.add(connections);
    connectionsRef.current = connections;

    const orbits = new THREE.Group();
    scene.add(orbits);
    orbitsRef.current = orbits;

    const satGroup = new THREE.Group();
    scene.add(satGroup);
    satGroupRef.current = satGroup;

    const satUplinks = new THREE.Group();
    scene.add(satUplinks);
    satUplinksRef.current = satUplinks;

    const orbitSteps = 15; 
    for (let lat = -75; lat <= 75; lat += orbitSteps) {
      const rad = (lat * Math.PI) / 180;
      const y = RADIUS * Math.sin(rad);
      const orbitRadius = RADIUS * Math.cos(rad) + 0.5;

      const points = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(theta) * orbitRadius,
          0,
          Math.sin(theta) * orbitRadius
        ));
      }
      const orbitGeom = new THREE.BufferGeometry().setFromPoints(points);
      const orbitMat = new THREE.LineBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.3 
      });
      const orbitLine = new THREE.Line(orbitGeom, orbitMat);
      orbitLine.position.y = y;
      orbits.add(orbitLine);
    }

    const labels: THREE.Sprite[] = [];
    const satLabels: THREE.Sprite[] = [];
    const nodePosMap: Map<string, THREE.Vector3> = new Map();
    const popMarkers: THREE.Mesh[] = [];

    COUNTRIES.forEach(country => {
      const pos = latLngToVector3(country.lat, country.lng, RADIUS + 0.5);
      const label = createTextLabel(country.name, '#0f172a');
      if (label) {
        label.position.copy(pos.clone().multiplyScalar(1.001)); 
        label.userData = { type: 'label', basePos: pos.clone().normalize() };
        markers.add(label);
        labels.push(label);
      }
    });

    POPS.forEach(pop => {
      const pos = latLngToVector3(pop.lat, pop.lng, RADIUS + 0.5);
      nodePosMap.set(pop.name, pos.clone());

      const markerGeom = new THREE.CircleGeometry(1.5, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, side: THREE.DoubleSide });
      const marker = new THREE.Mesh(markerGeom, markerMat);
      marker.position.copy(pos);
      marker.lookAt(new THREE.Vector3(0, 0, 0));
      marker.userData = { type: 'pop', data: pop };
      markers.add(marker);
      popMarkers.push(marker);

      const label = createTextLabel(pop.name, '#2563eb');
      if (label) {
        label.position.copy(pos.clone().multiplyScalar(1.01)); 
        label.userData = { type: 'label', basePos: pos.clone().normalize() };
        markers.add(label);
        labels.push(label);
      }
    });

    GATEWAYS.forEach(gw => {
      const pos = latLngToVector3(gw.lat, gw.lng, RADIUS + 0.5);
      nodePosMap.set(gw.name, pos.clone());
      
      const gwGeom = new THREE.OctahedronGeometry(0.8);
      const gwMat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); 
      const gwMarker = new THREE.Mesh(gwGeom, gwMat);
      gwMarker.position.copy(pos);
      gwMarker.userData = { type: 'gateway', data: gw };
      markers.add(gwMarker);
    });

    const satelliteMeshes: THREE.Mesh[] = [];
    SATELLITES.forEach(sat => {
      const pos = latLngToVector3(sat.lat, sat.lng, RADIUS + sat.altitude / 10);
      
      const satGeom = new THREE.BoxGeometry(1.2, 0.4, 0.4);
      const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const satMesh = new THREE.Mesh(satGeom, satMat);
      
      const wingGeom = new THREE.PlaneGeometry(3, 0.8);
      const wingMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const wing = new THREE.Mesh(wingGeom, wingMat);
      satMesh.add(wing);
      
      satMesh.position.copy(pos);
      satMesh.lookAt(new THREE.Vector3(0, 0, 0));
      satMesh.userData = { type: 'satellite', data: sat };
      satGroup.add(satMesh);
      satelliteMeshes.push(satMesh);

      const label = createTextLabel(sat.name, '#ffffff', 0.6);
      if (label) {
        label.position.copy(pos.clone().multiplyScalar(1.05));
        label.visible = false;
        label.userData = { type: 'satLabel', satName: sat.name };
        satGroup.add(label);
        satLabels.push(label);
      }

      const uplinkGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const uplinkMat = new THREE.LineBasicMaterial({ 
        color: 0x5d4037, // Dark Brown
        transparent: true, 
        opacity: 0.8 
      });
      const uplink = new THREE.Line(uplinkGeom, uplinkMat);
      uplink.frustumCulled = false; // Ensure line is always rendered regardless of distance
      satUplinks.add(uplink);
    });

    POP_CONNECTIONS.forEach(conn => {
      const startPos = nodePosMap.get(conn.start);
      const endPos = nodePosMap.get(conn.end);
      if (startPos && endPos) {
        const arc = createArc(startPos, endPos, 0xfacc15, 0.6);
        connections.add(arc);
      }
    });

    GATEWAY_CONNECTIONS.forEach(conn => {
      const startPos = nodePosMap.get(conn.start);
      const endPos = nodePosMap.get(conn.end);
      if (startPos && endPos) {
        const color = conn.type === 'to-pop' ? 0x10b981 : 0x34d399;
        const arc = createArc(startPos, endPos, color, 0.5);
        connections.add(arc);
      }
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (_event: MouseEvent) => {
      // Hover interactions are disabled. This handler remains to avoid pointer issues.
    };

    const onMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      const allIntersects = raycaster.intersectObjects([
        ...markers.children,
        ...satGroup.children
      ]);
      
      const hit = allIntersects.find(i => 
        i.object.userData.type === 'pop' || 
        i.object.userData.type === 'gateway' ||
        i.object.userData.type === 'satellite'
      );
      
      if (hit) {
        onSelect(hit.object.userData.data);
        return;
      }

      const globeIntersects = raycaster.intersectObject(globe);
      if (globeIntersects.length > 0) {
        const hitPoint = globeIntersects[0].point;
        const cellInfo = getCellFromIntersection(hitPoint);
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
      
      labels.forEach(label => {
        label.getWorldPosition(worldPos);
        const dot = worldPos.clone().normalize().dot(cameraNorm);
        label.visible = dot > 0.15; 
        const scaleFactor = distance / 250;
        const baseScaleX = label.scale.x === 8 ? 8 : 12; 
        const baseScaleY = label.scale.y === 2 ? 2 : 3;
        label.scale.set(baseScaleX * scaleFactor, baseScaleY * scaleFactor, 1);
      });

      if (globe && markers && cellGrid && connections && orbits && satGroup && satUplinks) {
        const satOrbitalSpeed = (Math.PI * 2) / 90;

        satGroup.rotation.y -= satOrbitalSpeed * delta;

        controls.update();

        const popWorldPositions = popMarkers.map(p => {
          const wp = new THREE.Vector3();
          p.getWorldPosition(wp);
          return wp;
        });

        satelliteMeshes.forEach((sat, i) => {
          const satWp = new THREE.Vector3();
          sat.getWorldPosition(satWp);
          
          let minDist = Infinity;
          let closestPopPos = popWorldPositions[0];
          
          popWorldPositions.forEach(pPos => {
            const d = satWp.distanceToSquared(pPos);
            if (d < minDist) {
              minDist = d;
              closestPopPos = pPos;
            }
          });

          const uplink = satUplinks.children[i] as THREE.Line;
          const posAttr = uplink.geometry.attributes.position;
          const array = posAttr.array as Float32Array;
          
          array[0] = satWp.x;
          array[1] = satWp.y;
          array[2] = satWp.z;
          array[3] = closestPopPos.x;
          array[4] = closestPopPos.y;
          array[5] = closestPopPos.z;
          
          posAttr.needsUpdate = true;
          // Recompute bounding sphere for each update to ensure line remains continuous and visible
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
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', onMouseClick);
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, [onSelect, controlsRef]);

  return <div ref={containerRef} className="globe-container" />;
}

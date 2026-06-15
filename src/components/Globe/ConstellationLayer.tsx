"use client";

import { useEffect } from 'react';
import * as THREE from 'three';
import { SATELLITES } from '@/lib/geo-data';
import { RADIUS, createTextLabel } from './GlobeUtils';

interface ConstellationProps {
  scene: THREE.Scene;
  satelliteMeshes: THREE.Mesh[];
  satLookup: Map<string, THREE.Mesh>;
  orbitShells: any[];
  satUplinks: THREE.Group;
  neighborLines: THREE.Group;
}

export function ConstellationLayer({ scene, satelliteMeshes, satLookup, orbitShells, satUplinks, neighborLines }: ConstellationProps) {
  useEffect(() => {
    const orbitsGroup = new THREE.Group();
    const orbitInclination = THREE.MathUtils.degToRad(53);
    const altitude = 8.63; // 550km scaled
    const orbitRadius = RADIUS + altitude;
    
    const planesCount = 84;
    const satsPerPlane = 84;
    const phaseFactor = 11 / 84;

    const shellGroup = new THREE.Group();
    const currentShell = { orbitRadius, planeGroups: [] as any[] };

    for (let p = 0; p < planesCount; p++) {
      const planeGroup = new THREE.Group();
      planeGroup.rotation.y = (p / planesCount) * Math.PI * 2;
      planeGroup.rotation.z = orbitInclination;

      const points = [];
      for (let i = 0; i <= 128; i++) {
        const theta = (i / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * orbitRadius, 0, Math.sin(theta) * orbitRadius));
      }
      const orbitLine = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.4 }));
      planeGroup.add(orbitLine);

      const satGroup = new THREE.Group();
      for (let s = 0; s < satsPerPlane; s++) {
        const angle = (s / satsPerPlane) * Math.PI * 2 + (p * phaseFactor * Math.PI * 2 / satsPerPlane);
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        m.position.set(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius);
        satGroup.add(m);
      }
      planeGroup.add(satGroup);
      shellGroup.add(planeGroup);
      currentShell.planeGroups.push({ planeGroup, satelliteGroup: satGroup });
    }
    
    orbitsGroup.add(shellGroup);
    orbitShells.push(currentShell);
    scene.add(orbitsGroup, satUplinks, neighborLines);

    const activePlanes = 6;
    const orbitCount = Math.ceil(SATELLITES.length / activePlanes);

    SATELLITES.forEach((sat, index) => {
      const planeIdx = index % activePlanes;
      const orbIdx = Math.floor(index / activePlanes);
      const angle = (orbIdx / orbitCount) * Math.PI * 2 + (planeIdx * phaseFactor * Math.PI * 2 / orbitCount);

      const pos = new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius);
      const satMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 0.4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      const wing = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.8), new THREE.MeshBasicMaterial({ color: 0x3b82f6, side: THREE.DoubleSide, transparent: true, opacity: 0.7 }));
      satMesh.add(wing);
      satMesh.position.copy(pos);
      satMesh.lookAt(new THREE.Vector3(0, 0, 0));
      
      satMesh.userData = { type: 'satellite', data: sat, shellIndex: 0, planeIndex: planeIdx, orbitIndex: orbIdx, orbitCount, activePlanesCount: activePlanes };
      satLookup.set(`0_${planeIdx}_${orbIdx}`, satMesh);
      currentShell.planeGroups[planeIdx].satelliteGroup.add(satMesh);
      satelliteMeshes.push(satMesh);

      const label = createTextLabel(sat.name, '#ffffff', 0.6);
      if (label) {
        label.position.copy(pos.clone().multiplyScalar(1.05));
        label.visible = false;
        currentShell.planeGroups[planeIdx].satelliteGroup.add(label);
      }

      const uplink = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
        new THREE.LineBasicMaterial({ color: 0x5d4037, transparent: true, opacity: 0.8 })
      );
      uplink.frustumCulled = false;
      satUplinks.add(uplink);
    });

    return () => {
      scene.remove(orbitsGroup, satUplinks, neighborLines);
      satelliteMeshes.length = 0;
      satLookup.clear();
      orbitShells.length = 0;
    };
  }, [scene, satelliteMeshes, satLookup, orbitShells, satUplinks, neighborLines]);

  return null;
}
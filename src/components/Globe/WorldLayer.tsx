"use client";

import { useEffect } from 'react';
import * as THREE from 'three';
import { COUNTRIES, POPS, GATEWAYS, POP_CONNECTIONS, GATEWAY_CONNECTIONS } from '@/lib/geo-data';
import { RADIUS, CELL_STEP, latLngToVector3, createTextLabel, createArc } from './GlobeUtils';

interface WorldLayerProps {
  scene: THREE.Scene;
  popMarkers: THREE.Mesh[];
  labels: THREE.Sprite[];
}

export function WorldLayer({ scene, popMarkers, labels }: WorldLayerProps) {
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const worldMapTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-day.jpg');
    const bumpMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');
    
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 128, 128),
      new THREE.MeshStandardMaterial({ map: worldMapTexture, bumpMap, bumpScale: 1.2, roughness: 0.8, metalness: 0.1 })
    );
    scene.add(globe);

    const cellGrid = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS + 0.1, 180 / CELL_STEP, 360 / CELL_STEP),
      new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true, opacity: 0.15 })
    );
    scene.add(cellGrid);

    const markers = new THREE.Group();
    const connections = new THREE.Group();
    const nodePosMap = new Map<string, THREE.Vector3>();

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
      const marker = new THREE.Mesh(new THREE.CircleGeometry(1.5, 16), new THREE.MeshBasicMaterial({ color: 0x2563eb, side: THREE.DoubleSide }));
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
      const gwMarker = new THREE.Mesh(new THREE.OctahedronGeometry(0.8), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
      gwMarker.position.copy(pos);
      gwMarker.userData = { type: 'gateway', data: gw };
      markers.add(gwMarker);
    });

    POP_CONNECTIONS.forEach(conn => {
      const start = nodePosMap.get(conn.start);
      const end = nodePosMap.get(conn.end);
      if (start && end) connections.add(createArc(start, end, 0xfacc15, 0.6));
    });

    GATEWAY_CONNECTIONS.forEach(conn => {
      const start = nodePosMap.get(conn.start);
      const end = nodePosMap.get(conn.end);
      if (start && end) connections.add(createArc(start, end, conn.type === 'to-pop' ? 0x10b981 : 0x34d399, 0.5));
    });

    scene.add(markers, connections);
    return () => {
      scene.remove(globe, cellGrid, markers, connections);
    };
  }, [scene, popMarkers, labels]);
  return null;
}
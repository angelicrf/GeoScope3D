import * as THREE from 'three';
import { GlobeCell } from '@/lib/geo-data';

export const RADIUS = 100;
export const CELL_STEP = 2;

export const latLngToVector3 = (lat: number, lng: number, r: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
};

export const createTextLabel = (text: string, color: string = '#0f172a', scale: number = 1) => {
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

export const createArc = (start: THREE.Vector3, end: THREE.Vector3, color: number = 0xfacc15, opacity: number = 0.6) => {
  const midPoint = start.clone().lerp(end, 0.5);
  const distance = start.distanceTo(end);
  const midPointHeight = RADIUS + (distance * 0.15); 
  midPoint.normalize().multiplyScalar(midPointHeight);

  const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  
  return new THREE.Line(geometry, material);
};

export const getCellFromIntersection = (point: THREE.Vector3): GlobeCell => {
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
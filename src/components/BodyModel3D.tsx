"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import type { BodyRegion } from "@/types";

interface BodyRegion3D {
  id: BodyRegion;
  name: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
}

const bodyRegions: BodyRegion3D[] = [
  // Front view regions
  { id: "cabeca", name: "Cabeca", position: [0, 3.2, 0.1], scale: [0.55, 0.65, 0.55], color: "#E63946" },
  { id: "pescoco", name: "Pescoco", position: [0, 2.55, 0.05], scale: [0.25, 0.25, 0.25], color: "#E63946" },
  { id: "ombro", name: "Ombro", position: [0.85, 2.2, 0], scale: [0.35, 0.25, 0.3], color: "#2A9D8F" },
  { id: "torax", name: "Torax", position: [0, 1.6, 0.15], scale: [0.75, 0.55, 0.35], color: "#457B9D" },
  { id: "braco", name: "Braco", position: [1.15, 1.5, 0], scale: [0.2, 0.45, 0.2], color: "#2A9D8F" },
  { id: "antebraco", name: "Antebraco", position: [1.3, 0.7, 0.05], scale: [0.17, 0.4, 0.17], color: "#E63946" },
  { id: "mao", name: "Mao", position: [1.4, 0.15, 0.1], scale: [0.15, 0.2, 0.1], color: "#457B9D" },
  { id: "abdomen", name: "Abdomen", position: [0, 0.85, 0.15], scale: [0.6, 0.4, 0.3], color: "#457B9D" },
  { id: "quadril", name: "Quadril", position: [0, 0.2, 0.1], scale: [0.7, 0.35, 0.35], color: "#E63946" },
  { id: "coxa", name: "Coxa", position: [0.35, -0.55, 0.05], scale: [0.25, 0.55, 0.25], color: "#2A9D8F" },
  { id: "joelho", name: "Joelho", position: [0.35, -1.15, 0.1], scale: [0.2, 0.2, 0.2], color: "#2A9D8F" },
  { id: "perna", name: "Perna", position: [0.35, -1.75, 0.05], scale: [0.18, 0.45, 0.18], color: "#2A9D8F" },
  { id: "pe", name: "Pe", position: [0.35, -2.3, 0.15], scale: [0.2, 0.12, 0.3], color: "#457B9D" },
  // Back view regions
  { id: "costas_superior", name: "Costas Sup.", position: [0, 2.0, -0.15], scale: [0.7, 0.4, 0.3], color: "#E63946" },
  { id: "costas_media", name: "Costas Med.", position: [0, 1.35, -0.15], scale: [0.65, 0.35, 0.3], color: "#E63946" },
  { id: "costas_inferior", name: "Costas Inf.", position: [0, 0.85, -0.15], scale: [0.6, 0.3, 0.3], color: "#E63946" },
  { id: "lombar", name: "Lombar", position: [0, 0.45, -0.12], scale: [0.55, 0.3, 0.3], color: "#E63946" },
];

// Mirror left-side regions
const mirroredRegions = bodyRegions.flatMap((r) => {
  if (["ombro", "braco", "antebraco", "mao", "coxa", "joelho", "perna", "pe"].includes(r.id)) {
    return [
      r,
      { ...r, position: [-r.position[0], r.position[1], r.position[2]] as [number, number, number] },
    ];
  }
  return [r];
});

function BodyPart({
  region,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  muscleCount,
}: {
  region: BodyRegion3D;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (h: boolean) => void;
  muscleCount: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const target = isSelected ? 1.1 : isHovered ? 1.05 : 1.0;
      meshRef.current.scale.lerp(
        new THREE.Vector3(
          region.scale[0] * target,
          region.scale[1] * target,
          region.scale[2] * target
        ),
        0.1
      );
    }
  });

  const color = useMemo(() => {
    if (isSelected) return "#E63946";
    if (isHovered) return "#ff6b6b";
    return region.color;
  }, [isSelected, isHovered, region.color]);

  return (
    <group position={region.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.9 : 0.7}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {(isHovered || isSelected) && (
        <Html center style={{ pointerEvents: "none" }}>
          <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
            {region.name} ({muscleCount})
          </div>
        </Html>
      )}
    </group>
  );
}

function BodySkeleton() {
  const geometries = useMemo(() => {
    const torso = new THREE.BufferGeometry();
    torso.setAttribute("position", new THREE.Float32BufferAttribute([0, 3.5, 0, 0, -0.1, 0], 3));

    const arms = new THREE.BufferGeometry();
    arms.setAttribute("position", new THREE.Float32BufferAttribute([-1.5, 1.5, 0, 1.5, 1.5, 0], 3));

    const legL = new THREE.BufferGeometry();
    legL.setAttribute("position", new THREE.Float32BufferAttribute([0, -0.1, 0, -0.4, -2.5, 0], 3));

    const legR = new THREE.BufferGeometry();
    legR.setAttribute("position", new THREE.Float32BufferAttribute([0, -0.1, 0, 0.4, -2.5, 0], 3));

    return { torso, arms, legL, legR };
  }, []);

  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: "#ddd" }), []);

  return (
    <group>
      <primitive object={new THREE.Line(geometries.torso, mat)} />
      <primitive object={new THREE.Line(geometries.arms, mat)} />
      <primitive object={new THREE.Line(geometries.legL, mat)} />
      <primitive object={new THREE.Line(geometries.legR, mat)} />
    </group>
  );
}

interface BodyModel3DProps {
  selectedRegion: BodyRegion | null;
  onRegionSelect: (region: BodyRegion) => void;
  muscleCountByRegion: Record<string, number>;
}

export default function BodyModel3D({
  selectedRegion,
  onRegionSelect,
  muscleCountByRegion,
}: BodyModel3DProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <div className="w-full h-[500px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200">
      <Canvas
        camera={{ position: [0, 1, 6], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} />

        <BodySkeleton />

        {mirroredRegions.map((region, i) => (
          <BodyPart
            key={`${region.id}-${i}`}
            region={region}
            isSelected={selectedRegion === region.id}
            isHovered={hoveredRegion === `${region.id}-${i}`}
            onSelect={() => onRegionSelect(region.id)}
            onHover={(h) => setHoveredRegion(h ? `${region.id}-${i}` : null)}
            muscleCount={muscleCountByRegion[region.id] || 0}
          />
        ))}

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI * 5 / 6}
        />
      </Canvas>

      <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur rounded-lg px-3 py-1.5 text-xs text-gray-500">
        Arraste para rotacionar | Scroll para zoom
      </div>
    </div>
  );
}

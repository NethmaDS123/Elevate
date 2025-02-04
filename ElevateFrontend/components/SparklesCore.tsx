"use client";
import { useFrame } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";
import * as random from "maath/random";
import { useRef } from "react";
import { BufferGeometry, Material, Points as ThreePoints } from "three";

export function SparklesCore(props: {
  background?: string;
  particleColor?: string;
  particleDensity?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}) {
  const {
    background = "transparent",
    particleColor = "#FFFFFF",
    particleDensity = 100,
    minSize = 0.6,
    maxSize = 1.4,
    className,
  } = props;

  const points = useRef<ThreePoints<BufferGeometry, Material | Material[]>>(
    null!
  );
  const sphere = random.inSphere(new Float32Array(particleDensity), {
    radius: 1.5,
  }) as Float32Array;

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x -= delta / 10;
      points.current.rotation.y -= delta / 15;
    }
  });

  return (
    <div
      className={`w-full h-full absolute ${className}`}
      style={{ background }}
    >
      <points ref={points} scale={1.5}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <Points positions={sphere} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color={particleColor}
            size={0.005 * Math.random() * (maxSize - minSize) + minSize}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </Points>
      </points>
    </div>
  );
}

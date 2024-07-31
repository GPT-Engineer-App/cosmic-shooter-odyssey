import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Sky, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

const Bullet = ({ position, direction }) => {
  const ref = useRef();
  useFrame(() => {
    ref.current.position.add(direction.multiplyScalar(0.2));
  });
  return <mesh ref={ref} position={position}>
    <sphereGeometry args={[0.1, 32, 32]} />
    <meshBasicMaterial color="yellow" />
  </mesh>;
};

const Target = ({ position, onHit }) => {
  return (
    <Box position={position} args={[1, 1, 1]} onClick={onHit}>
      <meshStandardMaterial color="red" />
    </Box>
  );
};

const Player = ({ onShoot }) => {
  const { camera } = useThree();
  const [bullets, setBullets] = useState([]);

  const shoot = () => {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    const newBullet = { id: Date.now(), position: camera.position.clone(), direction };
    setBullets([...bullets, newBullet]);
    onShoot();
  };

  useFrame(() => {
    setBullets(bullets.filter(bullet => bullet.position.length() < 100));
  });

  return (
    <>
      <PointerLockControls />
      <mesh position={[0, 0, -1]} onClick={shoot}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" />
      </mesh>
      {bullets.map(bullet => (
        <Bullet key={bullet.id} position={bullet.position} direction={bullet.direction} />
      ))}
    </>
  );
};

const Game = () => {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState([
    { id: 1, position: [5, 0, -5] },
    { id: 2, position: [-5, 0, -5] },
    { id: 3, position: [0, 5, -5] },
  ]);

  const handleHit = (id) => {
    setTargets(targets.filter(target => target.id !== id));
    setScore(score + 1);
  };

  const handleShoot = () => {
    // You could add sound effects or other logic here
  };

  return (
    <div className="w-full h-screen">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Sky />
        <Player onShoot={handleShoot} />
        {targets.map(target => (
          <Target key={target.id} position={target.position} onHit={() => handleHit(target.id)} />
        ))}
      </Canvas>
      <div className="absolute top-0 left-0 text-white p-4">
        <h2 className="text-2xl font-bold">Score: {score}</h2>
      </div>
      <div className="absolute bottom-0 left-0 text-white p-4">
        <p>Click to shoot. Hit the red cubes to score points.</p>
      </div>
    </div>
  );
};

export default Game;

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

const GRID_SIZE = 5;
const MAX_MOVES = 20;
const SHOW_TIME = 3000;
const TILE_SIZE = 1;
const RUN_DELAY = 500;

const generateFaultyTiles = (gridSize, count = 5) => {
  const tiles = new Set();
  while (tiles.size < count) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if (!(x === 0 && y === 0) && !(x === gridSize - 1 && y === gridSize - 1)) {
      tiles.add(`${x},${y}`);
    }
  }
  return tiles;
};

const Tile = ({ x, y, isPlayer, isGoal, isFaulty, showFaulty, isPath, isError }) => {
  let color = 'white';
  if (isError) color = 'red';
  else if (isPlayer) color = 'blue';
  else if (isGoal) color = 'green';
  else if (showFaulty && isFaulty) color = 'red';
  else if (!showFaulty && isPath) color = '#ccccff';

  return (
    <mesh position={[x * TILE_SIZE, 0, y * TILE_SIZE]}>
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

function App() {
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState([]);
  const [path, setPath] = useState([{ x: 0, y: 0 }]);
  const [status, setStatus] = useState('');
  const [faultyTiles, setFaultyTiles] = useState(new Set());
  const [showFaulty, setShowFaulty] = useState(true);
  const [running, setRunning] = useState(false);
  const [errorTile, setErrorTile] = useState(null);

  useEffect(() => {
    const newFaulty = generateFaultyTiles(GRID_SIZE);
    setFaultyTiles(newFaulty);
    const timer = setTimeout(() => setShowFaulty(false), SHOW_TIME);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (running) return;
      const keyMap = {
        w: 'up',
        a: 'left',
        s: 'down',
        d: 'right',
        ArrowUp: 'up',
        ArrowLeft: 'left',
        ArrowDown: 'down',
        ArrowRight: 'right',
      };
      const dir = keyMap[e.key];
      if (dir) handleMove(dir);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [moves, player, path, running]);

  const handleMove = (dir) => {
    if (moves.length >= MAX_MOVES) return;

    let newX = player.x;
    let newY = player.y;

    switch (dir) {
      case 'up':
        newY = Math.max(0, player.y - 1);
        break;
      case 'down':
        newY = Math.min(GRID_SIZE - 1, player.y + 1);
        break;
      case 'left':
        newX = Math.max(0, player.x - 1);
        break;
      case 'right':
        newX = Math.min(GRID_SIZE - 1, player.x + 1);
        break;
      default:
        break;
    }

    const newPos = { x: newX, y: newY };
    setMoves([...moves, dir]);
    setPlayer(newPos);
    setPath([...path, newPos]);
  };

  const resetGame = () => {
    setPlayer({ x: 0, y: 0 });
    setMoves([]);
    setPath([{ x: 0, y: 0 }]);
    setStatus('');
    setShowFaulty(true);
    setRunning(false);
    setErrorTile(null);
    const newFaulty = generateFaultyTiles(GRID_SIZE);
    setFaultyTiles(newFaulty);
    setTimeout(() => setShowFaulty(false), SHOW_TIME);
  };

  const runMoves = async () => {
    setRunning(true);
    let current = { x: 0, y: 0 };
    const trace = [{ x: 0, y: 0 }];

    for (let i = 0; i < moves.length; i++) {
      await new Promise((res) => setTimeout(res, RUN_DELAY));

      switch (moves[i]) {
        case 'up':
          current.y = Math.max(0, current.y - 1);
          break;
        case 'down':
          current.y = Math.min(GRID_SIZE - 1, current.y + 1);
          break;
        case 'left':
          current.x = Math.max(0, current.x - 1);
          break;
        case 'right':
          current.x = Math.min(GRID_SIZE - 1, current.x + 1);
          break;
        default:
          break;
      }

      trace.push({ x: current.x, y: current.y });
      setPlayer({ ...current });
      setPath([...trace]);

      const key = `${current.x},${current.y}`;
      if (faultyTiles.has(key)) {
        setErrorTile(key);
        setStatus('❌ You stepped on a faulty tile!');
        setRunning(false);
        return;
      }
    }

    if (current.x === GRID_SIZE - 1 && current.y === GRID_SIZE - 1) {
      setStatus('✅ Success!');
    } else {
      setStatus('🟨 Did not reach the goal.');
    }

    setRunning(false);
  };

  return (
    <div className="app">
      <h1>🧠 PathMemo 3D</h1>
      <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1rem', color: '#444' }}>
        🎯 Your goal is to help the character reach the green tile at the top-right corner (goal).
        First, memorize where the red (faulty) tiles are. Then use the W/A/S/D keys or arrow keys to plan your path without stepping on a faulty tile.
        When you're ready, click "Run" to simulate the steps and see if you survive!
      </p>
      <Canvas camera={{ position: [5, 8, 10], fov: 50 }} style={{ height: '400px' }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        {Array.from({ length: GRID_SIZE }).flatMap((_, y) =>
          Array.from({ length: GRID_SIZE }).map((_, x) => {
            const tileKey = `${x},${y}`;
            return (
              <Tile
                key={tileKey}
                x={x}
                y={y}
                isPlayer={player.x === x && player.y === y}
                isGoal={x === GRID_SIZE - 1 && y === GRID_SIZE - 1}
                isFaulty={faultyTiles.has(tileKey)}
                showFaulty={showFaulty}
                isPath={path.some((p) => p.x === x && p.y === y)}
                isError={tileKey === errorTile}
              />
            );
          })
        )}
      </Canvas>

      <div className="controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
        <div className="buttons" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button onClick={() => handleMove('up')}>⬆️</button>
          <div className="horizontal-buttons" style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <button onClick={() => handleMove('left')}>⬅️</button>
            <button onClick={() => handleMove('down')}>⬇️</button>
            <button onClick={() => handleMove('right')}>➡️</button>
          </div>
        </div>
        <div className="move-sequence" style={{ marginTop: '10px' }}>Moves: {moves.join(', ')}</div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={runMoves} disabled={running}>▶️ Run</button>
          <button onClick={resetGame}>🔄 Reset</button>
        </div>
        <div className="status" style={{ marginTop: '10px' }}>{status}</div>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>💡 Use W/A/S/D or arrow keys to enter moves</p>
      </div>
    </div>
  );
}

export default App;

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { getDistance, checkCollision, getRandomSpawnPos } from '../lib/gameUtils';
import HUD from './HUD';
import UpgradeModal from './UpgradeModal';

export default function SurvivorGame({ onGameOver }) {
  const canvasRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [stats, setStats] = useState({
    hp: 100, maxHp: 100, exp: 0, nextExp: 100, level: 1, kills: 0, time: 0
  });

  // Mutable game state
  const gameState = useRef({
    player: { x: 400, y: 300, radius: 15, speed: 3.5, color: '#fbbf24' },
    enemies: [],
    bullets: [],
    gems: [],
    keys: {},
    lastShot: 0,
    fireRate: 600,
    damage: 25,
    pickupRange: 80,
    frame: 0
  });

  const handleKeyDown = useCallback((e) => { gameState.current.keys[e.key.toLowerCase()] = true; }, []);
  const handleKeyUp = useCallback((e) => { gameState.current.keys[e.key.toLowerCase()] = false; }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const applyUpgrade = (id) => {
    const s = gameState.current;
    if (id === 'dmg') s.damage *= 1.2;
    if (id === 'spd') s.player.speed *= 1.15;
    if (id === 'fire_rate') s.fireRate *= 0.85;
    if (id === 'hp') {
      setStats(prev => ({ ...prev, maxHp: prev.maxHp + 20, hp: prev.maxHp + 20 }));
    }
    if (id === 'range') s.pickupRange *= 1.5;
    
    setShowUpgrade(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const loop = (time) => {
      if (isPaused) return;

      const { player, enemies, bullets, gems, keys, lastShot, fireRate, damage, pickupRange, frame } = gameState.current;
      
      // Update Player Movement
      if (keys['w'] || keys['arrowup']) player.y -= player.speed;
      if (keys['s'] || keys['arrowdown']) player.y += player.speed;
      if (keys['a'] || keys['arrowleft']) player.x -= player.speed;
      if (keys['d'] || keys['arrowright']) player.x += player.speed;

      // Bound player
      player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
      player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

      // Auto Shooting (Closest Enemy)
      if (time - lastShot > fireRate && enemies.length > 0) {
        let closest = null;
        let minDist = Infinity;
        enemies.forEach(e => {
          const d = getDistance(player.x, player.y, e.x, e.y);
          if (d < minDist) { minDist = d; closest = e; }
        });

        if (closest) {
          const angle = Math.atan2(closest.y - player.y, closest.x - player.x);
          bullets.push({ x: player.x, y: player.y, vx: Math.cos(angle) * 7, vy: Math.sin(angle) * 7, radius: 5 });
          gameState.current.lastShot = time;
        }
      }

      // Update Enemies
      if (frame % 60 === 0) {
        const pos = getRandomSpawnPos(canvas.width, canvas.height, player.x, player.y);
        enemies.push({ ...pos, radius: 12, hp: 50, speed: 1.5 + (stats.level * 0.1) });
      }

      enemies.forEach((en, i) => {
        const angle = Math.atan2(player.y - en.y, player.x - en.x);
        en.x += Math.cos(angle) * en.speed;
        en.y += Math.sin(angle) * en.speed;

        if (checkCollision(player, en)) {
          setStats(prev => {
            const newHp = prev.hp - 0.2;
            if (newHp <= 0) onGameOver(prev.kills);
            return { ...prev, hp: newHp };
          });
        }
      });

      // Update Bullets
      bullets.forEach((b, bi) => {
        b.x += b.vx;
        b.y += b.vy;
        enemies.forEach((en, ei) => {
          if (checkCollision(b, en)) {
            en.hp -= damage;
            bullets.splice(bi, 1);
            if (en.hp <= 0) {
              gems.push({ x: en.x, y: en.y, radius: 4, exp: 20 });
              enemies.splice(ei, 1);
              setStats(prev => ({ ...prev, kills: prev.kills + 1 }));
            }
          }
        });
      });

      // Update Gems
      gems.forEach((g, gi) => {
        const dist = getDistance(player.x, player.y, g.x, g.y);
        if (dist < pickupRange) {
          const angle = Math.atan2(player.y - g.y, player.x - g.x);
          g.x += Math.cos(angle) * 8;
          g.y += Math.sin(angle) * 8;
        }
        if (checkCollision(player, g)) {
          gems.splice(gi, 1);
          setStats(prev => {
            const newExp = prev.exp + g.exp;
            if (newExp >= prev.nextExp) {
              setIsPaused(true);
              setShowUpgrade(true);
              return { ...prev, exp: newExp - prev.nextExp, nextExp: prev.nextExp * 1.2, level: prev.level + 1 };
            }
            return { ...prev, exp: newExp };
          });
        }
      });

      // Cleanup
      if (bullets.length > 50) bullets.shift();
      gameState.current.frame++;
      if (frame % 60 === 0) setStats(prev => ({ ...prev, time: prev.time + 1 }));

      // Rendering
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Gems
      ctx.fillStyle = '#60a5fa';
      gems.forEach(g => {
        ctx.beginPath(); ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2); ctx.fill();
      });

      // Draw Enemies
      ctx.fillStyle = '#ef4444';
      enemies.forEach(en => {
        ctx.beginPath(); ctx.arc(en.x, en.y, en.radius, 0, Math.PI * 2); ctx.fill();
      });

      // Draw Bullets
      ctx.fillStyle = '#fbbf24';
      bullets.forEach(b => {
        ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fill();
      });

      // Draw Player
      ctx.fillStyle = player.color;
      ctx.shadowBlur = 15; ctx.shadowColor = player.color;
      ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, stats.level, onGameOver]);

  return (
    <div className="relative w-full h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="rounded-lg shadow-2xl border border-slate-800"
      />
      <HUD stats={stats} />
      {showUpgrade && <UpgradeModal onSelect={applyUpgrade} />}
    </div>
  );
}
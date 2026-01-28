export const getDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

export const checkCollision = (obj1, obj2) => {
  const dist = getDistance(obj1.x, obj1.y, obj2.x, obj2.y);
  return dist < (obj1.radius + obj2.radius);
};

export const getRandomSpawnPos = (canvasWidth, canvasHeight, playerX, playerY, margin = 100) => {
  let x, y;
  const side = Math.floor(Math.random() * 4);
  
  if (side === 0) { // Top
    x = Math.random() * canvasWidth;
    y = -margin;
  } else if (side === 1) { // Right
    x = canvasWidth + margin;
    y = Math.random() * canvasHeight;
  } else if (side === 2) { // Bottom
    x = Math.random() * canvasWidth;
    y = canvasHeight + margin;
  } else { // Left
    x = -margin;
    y = Math.random() * canvasHeight;
  }
  
  return { x, y };
};

export const UPGRADES = [
  { id: 'dmg', name: '공격력 강화', desc: '투사체의 피해량이 20% 증가합니다.', icon: '⚔️' },
  { id: 'spd', name: '이동 속도', desc: '플레이어의 이동 속도가 15% 빨라집니다.', icon: '👟' },
  { id: 'fire_rate', name: '연사 속도', desc: '공격 주기가 15% 단축됩니다.', icon: '🏹' },
  { id: 'hp', name: '체력 회복', desc: '최대 체력이 20 증가하고 모두 회복합니다.', icon: '❤️' },
  { id: 'range', name: '수집 범위', desc: '경험치 구슬을 끌어당기는 범위가 넓어집니다.', icon: '🧲' }
];
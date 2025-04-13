Here's a comprehensive guide in Markdown format that outlines how to generate a dungeon map using **dungrain** in Node.js and populate it with enemies, including controlled distribution of rare, magic, and normal mobs, as well as strategic boss placement.

---

# 🗺️ Procedural Dungeon Generation and Enemy Placement with Node.js

This guide demonstrates how to:

- Generate a dungeon map using `dungrain`
- Classify rooms and calculate distances
- Distribute mobs with controlled rarity
- Place a boss mob beyond the midpoint of the dungeon

---

## 📦 Setup

Install the necessary packages:

```bash
npm install dungrain chance
```

---

## 🔧 Dungeon Generation with `dungrain`

```javascript
const Dungrain = require('dungrain');

const dungeon = new Dungrain({
  seed: 'shores-001',
  iterationCount: 4,
  column: 80,
  row: 40,
  indexMap: {
    Empty: 0,
    Room: 1,
    Path: 2,
    Wall: 3,
    Beach: 4,
    Dune: 5,
    Cliff: 6,
  },
  minimumWHRatio: 1.2,
  maximumWHRatio: 2.0,
  minimumChunkWidth: 10,
  minimumChunkHeight: 8,
});

const map = dungeon.getMap();
```

---

## 🧱 Identifying Rooms and Starting Point

```javascript
const rooms = [];
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    if (map[y][x] === 1) {
      // Assuming '1' represents a room
      rooms.push({ x, y });
    }
  }
}

// Define the starting room (e.g., top-left most room)
const startRoom = rooms.reduce((prev, curr) => {
  return curr.x + curr.y < prev.x + prev.y ? curr : prev;
});
```

---

## 📏 Calculating Distances Using BFS

```javascript
function bfs(start, map) {
  const distances = {};
  const visited = new Set();
  const queue = [{ x: start.x, y: start.y, distance: 0 }];

  while (queue.length > 0) {
    const { x, y, distance } = queue.shift();
    const key = `${x},${y}`;

    if (visited.has(key)) continue;
    visited.add(key);
    distances[key] = distance;

    const directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ];

    for (const { dx, dy } of directions) {
      const nx = x + dx;
      const ny = y + dy;
      const nKey = `${nx},${ny}`;

      if (
        ny >= 0 &&
        ny < map.length &&
        nx >= 0 &&
        nx < map[0].length &&
        (map[ny][nx] === 1 || map[ny][nx] === 2) && // Room or Path
        !visited.has(nKey)
      ) {
        queue.push({ x: nx, y: ny, distance: distance + 1 });
      }
    }
  }

  return distances;
}

const distances = bfs(startRoom, map);
```

---

## 🧙‍♂️ Mob Distribution with Controlled Rarity

```javascript
const Chance = require('chance');
const chance = new Chance();

const mobLimits = {
  rare: 5,
  magic: 10,
  normal: 50,
};

const mobTypes = {
  rare: ['dragon', 'lich'],
  magic: ['sorcerer', 'elemental'],
  normal: ['goblin', 'orc', 'skeleton'],
};

function distributeMobs(rooms, mobTypes, mobLimits) {
  const shuffledRooms = chance.shuffle(rooms);
  const mobCounts = { rare: 0, magic: 0, normal: 0 };

  for (const room of shuffledRooms) {
    const availableCategories = Object.keys(mobLimits).filter((category) => mobCounts[category] < mobLimits[category]);

    if (availableCategories.length === 0) break;

    const selectedCategory = chance.pickone(availableCategories);
    const selectedMob = chance.pickone(mobTypes[selectedCategory]);

    room.mob = selectedMob;
    mobCounts[selectedCategory]++;
  }
}

distributeMobs(rooms, mobTypes, mobLimits);
```

---

## 🐉 Boss Placement Beyond Midpoint

```javascript
// Calculate distances for all rooms
const roomDistances = rooms.map((room) => {
  const key = `${room.x},${room.y}`;
  return { ...room, distance: distances[key] };
});

// Determine maximum distance
const maxDistance = Math.max(...roomDistances.map((r) => r.distance));

// Define minimum distance threshold (e.g., 60% of max distance)
const minDistance = Math.floor(maxDistance * 0.6);

// Filter rooms beyond the minimum distance
const candidateRooms = roomDistances.filter((r) => r.distance >= minDistance);

// Randomly select a room for the boss
const bossRoom = chance.pickone(candidateRooms);

// Assign the boss to the selected room
if (bossRoom) {
  map[bossRoom.y][bossRoom.x] = 99; // Assuming '99' represents the boss
}
```

---

## 🧩 Integration Tips

- **Tile Codes**: Ensure that your tile codes (e.g., `Room: 1`, `Path: 2`, `Boss: 99`) are consistently defined and used throughout your codebase.
- **Mob Placement**: After assigning mobs to rooms, integrate this data into your game logic to handle encounters appropriately.
- **Boss Mechanics**: Implement additional logic to handle boss-specific behaviors, triggers, and rewards.

---

Feel free to customize the parameters and logic to better fit the specific needs and mechanics of your game. If you have further questions or need assistance with additional features, don't hesitate to ask!

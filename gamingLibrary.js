// === Game Library ===
let games = [
  { name: "Counter Strike", version: 1.2 },
  { name: "Dota 2", version: 2.3 }
];

function launchGame(name) {
  alert(`Launching ${name} (mock demo)`);
}

function updateGame(name) {
  const g = games.find(x => x.name === name);
  g.version += 0.1;
  alert(`${name} updated to v${g.version.toFixed(1)}`);
}

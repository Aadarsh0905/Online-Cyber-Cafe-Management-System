// datastore.js - simple in-memory data store
const { v4: uuidv4 } = require('uuid');

const users = []; // { id, name, email, phone, passwordHash, webauthn?: {} , membership }
const workstations = []; // { id, name, status: 'free'|'booked'|'in-use', currentSessionId }
const bookings = []; // { id, userId, workstationId, start, end, status }
const sessions = []; // active sessions { id, userId, workstationId, start, end, timerStarted }
const transactions = []; // bills/payments
const games = [ // sample
  { id: 'g1', title: 'Space Shooter', version: '1.0.0', sizeMB: 200, cloudSave: true }
];

// initialize some workstations
for (let i=1;i<=10;i++) workstations.push({ id: `pc${i}`, name: `PC-${i}`, status: 'free', currentSessionId: null });

module.exports = {
  users, workstations, bookings, sessions, transactions, games, uuidv4
};

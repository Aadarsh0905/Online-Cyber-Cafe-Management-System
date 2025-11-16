// frontend/api.js
// Shared API helper. Use as: import { api, setToken, getToken } from './api.js';

const BASE = 'http://localhost:4000/api';

export function getToken() {
  return localStorage.getItem('token');
}
export function setToken(t) {
  if (t) localStorage.setItem('token', t);
  else localStorage.removeItem('token');
}
export function getUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch(e){ return null; }
}
export function setUser(u) { if (u) localStorage.setItem('user', JSON.stringify(u)); else localStorage.removeItem('user'); }

async function request(path, opts = {}) {
  const headers = opts.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(BASE + path, { ...opts, headers });
  const data = await res.json().catch(()=> ({}));
  if (!res.ok) throw new Error(data.error || JSON.stringify(data));
  return data;
}

export const api = {
  register: body => request('/register', { method: 'POST', body }),
  login: body => request('/login', { method: 'POST', body }),
  workstations: () => request('/workstations'),
  book: body => request('/book', { method: 'POST', body }),
  startSession: body => request('/session/start', { method: 'POST', body }),
  endSession: body => request('/session/end', { method: 'POST', body }),
  payBill: body => request('/bill/pay', { method: 'POST', body }),
  membership: body => request('/membership/subscribe', { method: 'POST', body }),
  adminStats: () => request('/admin/stats'),
  bookings: () => request('/bookings'),
  remoteAction: body => request('/remote/action', { method: 'POST', body }),
  games: () => request('/games'),
  chatbot: body => request('/chatbot', { method: 'POST', body })
};

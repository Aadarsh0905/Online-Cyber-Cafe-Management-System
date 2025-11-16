// backend/server.js
// Node/Express backend (JavaScript)
// Run: npm init -y
// npm install express mongoose jsonwebtoken bcryptjs cors socket.io dotenv
// create .env with MONGODB_URI, JWT_SECRET, PORT (optional)

require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// ---------- DB ----------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cybersphere';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('MongoDB connected'))
  .catch(err=>console.error('MongoDB error', err));

// ---------- Schemas ----------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  passwordHash: String,
  role: { type: String, enum: ['customer','staff','admin'], default: 'customer' },
  membership: {
    plan: String,
    expiresAt: Date,
    loyaltyPoints: { type: Number, default: 0 }
  }
});
const User = mongoose.model('User', userSchema);

const workstationSchema = new mongoose.Schema({
  name: String,
  status: { type: String, enum: ['available','occupied','maintenance'], default: 'available' },
  currentSession: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', default: null }
});
const Workstation = mongoose.model('Workstation', workstationSchema);

const sessionSchema = new mongoose.Schema({
  workstation: { type: mongoose.Schema.Types.ObjectId, ref: 'Workstation' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startTime: Date,
  endTime: Date,
  billedMinutes: { type: Number, default: 0 },
  status: { type: String, enum: ['active','ended'], default: 'active' }
});
const Session = mongoose.model('Session', sessionSchema);

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workstation: { type: mongoose.Schema.Types.ObjectId, ref: 'Workstation' },
  startTime: Date,
  endTime: Date,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['confirmed','cancelled','completed'], default: 'confirmed' }
});
const Booking = mongoose.model('Booking', bookingSchema);

const billSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  createdAt: { type: Date, default: Date.now },
  paid: { type: Boolean, default: false },
  paymentMethod: String,
  items: Array
});
const Bill = mongoose.model('Bill', billSchema);

// ---------- Utils ----------
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
function genToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}
async function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'No auth header' });
  const token = h.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(data.id);
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch(err){
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ---------- Auth ----------
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!password || (!email && !phone)) return res.status(400).json({ error: 'email/phone & password required' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, passwordHash: hash });
    await user.save();
    res.json({ token: genToken(user), user: { id: user._id, name: user.name, role: user.role } });
  } catch(err) {
    console.error(err);
    res.status(400).json({ error: 'Registration failed', details: err.message });
  }
});

app.post('/api/login', async (req,res)=>{
  const { email, password, phone } = req.body;
  const user = await User.findOne(email ? { email } : { phone });
  if (!user) return res.status(400).json({ error: 'User not found' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid password' });
  res.json({ token: genToken(user), user: { id: user._id, name: user.name, role: user.role } });
});

// ---------- Workstations & Bookings ----------
app.get('/api/workstations', authMiddleware, async (req,res)=>{
  const list = await Workstation.find().lean();
  res.json(list);
});

app.post('/api/book', authMiddleware, async (req,res)=>{
  const { workstationId, startTime, endTime } = req.body;
  const ws = await Workstation.findById(workstationId);
  if (!ws) return res.status(404).json({ error: 'Workstation not found' });
  const conflict = await Booking.findOne({
    workstation: ws._id,
    status: 'confirmed',
    $or: [
      { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } }
    ]
  });
  if (conflict) return res.status(400).json({ error: 'Time slot unavailable' });
  const booking = new Booking({
    user: req.user._id,
    workstation: ws._id,
    startTime: new Date(startTime),
    endTime: new Date(endTime)
  });
  await booking.save();
  io.emit('booking_created', { bookingId: booking._id });
  res.json({ booking });
});

app.post('/api/session/start', authMiddleware, async (req,res)=>{
  const { workstationId } = req.body;
  const ws = await Workstation.findById(workstationId);
  if (!ws) return res.status(404).json({ error: 'Workstation not found' });
  if (ws.status === 'occupied') return res.status(400).json({ error: 'Workstation occupied' });

  const session = new Session({ workstation: ws._id, user: req.user._id, startTime: new Date() });
  await session.save();
  ws.status = 'occupied';
  ws.currentSession = session._id;
  await ws.save();

  io.emit('session_started', { sessionId: session._id, workstation: ws.name, user: req.user.name });
  res.json({ session });
});

app.post('/api/session/end', authMiddleware, async (req,res)=>{
  const { sessionId } = req.body;
  const session = await Session.findById(sessionId).populate('workstation user');
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (String(session.user._id) !== String(req.user._id) && req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Not permitted' });
  }
  session.endTime = new Date();
  session.status = 'ended';
  const ms = session.endTime - session.startTime;
  const mins = Math.ceil(ms / 60000);
  session.billedMinutes = mins;
  await session.save();

  const ws = await Workstation.findById(session.workstation._id);
  ws.status = 'available';
  ws.currentSession = null;
  await ws.save();

  const ratePerMinute = 0.333333;
  const amount = +(mins * ratePerMinute).toFixed(2);
  const bill = new Bill({ session: session._id, user: session.user._id, amount, items: [{ label: 'Seat charge', qty: mins, unit: 'min' }], paid: false });
  await bill.save();

  io.emit('session_ended', { sessionId: session._id, billId: bill._id, amount });
  res.json({ session, bill });
});

// ---------- Billing ----------
app.post('/api/bill/pay', authMiddleware, async (req,res)=>{
  const { billId, paymentMethod='mock' } = req.body;
  const bill = await Bill.findById(billId);
  if (!bill) return res.status(404).json({ error: 'Bill not found' });
  bill.paid = true;
  bill.paymentMethod = paymentMethod;
  await bill.save();
  io.emit('bill_paid', { billId: bill._id });
  res.json({ ok: true, bill });
});

// ---------- Membership ----------
app.post('/api/membership/subscribe', authMiddleware, async (req,res)=>{
  const { plan } = req.body;
  const user = req.user;
  const now = new Date();
  let expires;
  if (plan === 'monthly') expires = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  else if (plan === 'yearly') expires = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  else return res.status(400).json({ error: 'Unknown plan' });

  user.membership.plan = plan;
  user.membership.expiresAt = expires;
  user.membership.loyaltyPoints = (user.membership.loyaltyPoints || 0) + 100;
  await user.save();
  res.json({ user });
});

// ---------- Admin ----------
app.get('/api/admin/stats', authMiddleware, async (req,res)=>{
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'admin only' });
  const totalUsers = await User.countDocuments();
  const activeSessions = await Session.countDocuments({ status: 'active' });
  const openWorkstations = await Workstation.countDocuments({ status: 'available' });
  const revenue = await Bill.aggregate([{ $match: { paid: true } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
  res.json({
    totalUsers, activeSessions, openWorkstations, revenue: (revenue[0] ? revenue[0].total : 0)
  });
});

app.get('/api/bookings', authMiddleware, async (req,res)=>{
  if (req.user.role !== 'admin' && req.user.role !== 'staff') return res.status(403).json({ error: 'staff/admin only' });
  const bookings = await Booking.find().populate('user workstation').sort({ createdAt: -1 }).limit(200);
  res.json(bookings);
});

app.post('/api/remote/action', authMiddleware, async (req,res)=>{
  if (req.user.role !== 'admin' && req.user.role !== 'staff') return res.status(403).json({ error: 'staff/admin only' });
  const { workstationId, action } = req.body;
  io.emit('remote_action', { workstationId, action, requestedBy: req.user.na_

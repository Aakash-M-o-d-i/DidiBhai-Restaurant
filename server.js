import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent JSON File Fallback DB Config
const DATA_DIR = path.join(__dirname, 'server', 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'menu.json');

// Ensure localized directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default menu data used if database is empty or falls back
const INITIAL_MENU = [
  // Beverages
  {
    id: 'black-tea',
    title: 'Black/Milk Tea',
    description: 'Cardamom and ginger brewed traditional tea cup.',
    price: 20,
    category: 'Beverages',
    image: '/images/black_milk_tea.png',
    rating: 4.9,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Ginger', price: 10 },
      { name: 'Extra Sugar', price: 5 },
      { name: 'Extra Milk Portion', price: 10 }
    ]),
    ingredients: JSON.stringify(["Premium Tea Leaves", "Cardamom & Ginger", "Fresh Milk", "Sugar"])
  },
  {
    id: 'hot-coffee',
    title: 'Coffee',
    description: 'Frothy hot coffee served in a traditional cup.',
    price: 40,
    category: 'Beverages',
    image: '/images/hot_coffee.png',
    rating: 4.5,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Whipped Cream', price: 15 },
      { name: 'Extra Espresso Shot', price: 20 }
    ]),
    ingredients: JSON.stringify(["Rich Coffee Beans", "Whipped Cream", "Steamed Milk", "Sugar"])
  },
  // Momos
  {
    id: 'veg-momos',
    title: 'Veg Momo (8 pcs)',
    description: '8 Pcs of steamed cabbage & carrot dumplings with spicy red chutney.',
    price: 80,
    category: 'Momos',
    image: '/images/veg_momos.png',
    rating: 4.6,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Spicy Schezwan Chutney', price: 15 },
      { name: 'Cheese Dip Cup', price: 20 }
    ]),
    ingredients: JSON.stringify(["Steamed Cabbage & Carrot", "Thin Wrapper", "Local Garlic & Ginger"])
  },
  {
    id: 'chicken-momos',
    title: 'Chicken Momo (8 pcs)',
    description: '8 Pcs of juicy minced chicken dumplings served with spicy red chutney.',
    price: 120,
    category: 'Momos',
    image: '/images/chicken_momos.png',
    rating: 4.8,
    isVeg: false,
    isPopular: true,
    available: true,
    addOns: JSON.stringify([
      { name: 'Spicy Schezwan Chutney', price: 15 },
      { name: 'Cheese Dip Cup', price: 20 }
    ]),
    ingredients: JSON.stringify(["Juicy Minced Chicken", "Thin Wrapper", "Fresh Coriander & Spices"])
  },
  // Maggi Specials
  {
    id: 'plain-maggi',
    title: 'Plain Maggi',
    description: 'Classic bowl of plain masala noodles cooked in our secret spice blend.',
    price: 50,
    category: 'Maggi',
    image: '/images/plain_maggi.png',
    rating: 4.4,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Cheese Slice', price: 20 },
      { name: 'Fried Egg', price: 15 }
    ]),
    ingredients: JSON.stringify(["Springy Noodles", "Didi-Bhai Special Maggi Masala", "Skillet Butter"])
  },
  {
    id: 'egg-maggi',
    title: 'Egg Maggi',
    description: 'Springy masala noodles tossed with soft-boiled scrambled eggs and seasoning.',
    price: 80,
    category: 'Maggi',
    image: '/images/egg_maggi.png',
    rating: 4.7,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Cheese Slice', price: 20 },
      { name: 'Extra Egg', price: 15 }
    ]),
    ingredients: JSON.stringify(["Double Egg", "Springy Noodles", "Signature Masala", "Coriander"])
  },
  {
    id: 'aloo-thukpa',
    title: 'Aloo thukpa',
    description: 'Warm and comforting Himalayan noodle soup served with potatoes and fresh herbs.',
    price: 120,
    category: 'Maggi',
    image: '/images/aloo_thukpa.png',
    rating: 4.6,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Aloo Cubes', price: 20 },
      { name: 'Spicy Schezwan Sauce', price: 15 }
    ]),
    ingredients: JSON.stringify(["Himalayan Noodles", "Spiced Aloo Cubes", "Warm Vegetable Broth", "Ginger-Garlic"])
  },
  // Thalis
  {
    id: 'veg-thali',
    title: 'Veg Thali',
    description: 'Complete traditional platter with Paneer Gravy, Yellow Dal Tadka, Sabzi, Roti, Rice & Sweet.',
    price: 130,
    category: 'Thalis',
    image: '/images/veg_thali.png',
    rating: 4.5,
    isVeg: true,
    isPopular: true,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Rice Portion', price: 30 },
      { name: 'Extra Paneer Gravy', price: 40 },
      { name: 'Sweet Gulab Jamun', price: 25 }
    ]),
    ingredients: JSON.stringify(["Paneer Masala", "Dal Tadka", "Jeera Rice", "4 Tawa Rotis", "Sweet Gulab Jamun"])
  },
  {
    id: 'chicken-thali',
    title: 'Chicken Thali',
    description: 'A hearty traditional platter of basmati rice, warm butter chicken curry, chicken dry stir-fry, and roti.',
    price: 230,
    category: 'Thalis',
    image: '/images/chicken_thali.png',
    rating: 4.7,
    isVeg: false,
    isPopular: true,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Rice Portion', price: 30 },
      { name: 'Extra Butter Chicken', price: 60 },
      { name: 'Sweet Gulab Jamun', price: 25 }
    ]),
    ingredients: JSON.stringify(["Butter Chicken Curry", "Chicken Dry Stir-Fry", "Basmati Rice", "Tawa Roti", "Sweet Gulab Jamun"])
  },
  {
    id: 'pork-thali',
    title: 'Pork thali',
    description: 'Traditional Naga-style smoked pork slow-cooked with bamboo shoots, served with rice, dal, and local greens.',
    price: 350,
    category: 'Thalis',
    image: '/images/pork_thali.png',
    rating: 4.8,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Rice Portion', price: 30 },
      { name: 'Extra Smoked Pork', price: 80 }
    ]),
    ingredients: JSON.stringify(["Smoked Pork", "Bamboo Shoots", "Basmati Rice", "Local Boiled Greens", "Dal"])
  },
  // Pastries & Snacks
  {
    id: 'roti-sabzi',
    title: 'Roti Sabzi (4 pcs)',
    description: '4 soft whole wheat tawa rotis served with seasonal mixed vegetables curry.',
    price: 80,
    category: 'Maggi',
    image: '/images/roti_sabzi.png',
    rating: 4.3,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Rotis (2 pcs)', price: 20 },
      { name: 'Extra Sabzi Bowl', price: 30 }
    ]),
    ingredients: JSON.stringify(["4 Whole Wheat Rotis", "Seasonal Mixed Veg", "Traditional Masala"])
  },
  {
    id: 'puri-sabzi',
    title: 'Puri Sabzi (4 pcs)',
    description: '4 fluffy deep fried golden puris served with spicy dry aloo bhaji masala.',
    price: 80,
    category: 'Maggi',
    image: '/images/puri_sabzi.png',
    rating: 4.5,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Puris (2 pcs)', price: 25 },
      { name: 'Extra Aloo Bhaji', price: 30 }
    ]),
    ingredients: JSON.stringify(["4 Deep Fried Puris", "Spicy Dry Aloo Bhaji", "Aromatic Spices"])
  },
  // Omelettes
  {
    id: 'bread-omelette',
    title: 'Bread Omelette',
    description: 'Soft white bread slices toasted on skillet with a double masala egg omelette.',
    price: 70,
    category: 'Beverages',
    image: '/images/bread_omelette.png',
    rating: 4.4,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Cheese Slice', price: 20 },
      { name: 'Double Butter Toast', price: 15 }
    ]),
    ingredients: JSON.stringify(["2 Farm Eggs", "2 Slices Toast Bread", "Chopped Onion & Chillies"])
  },
  {
    id: 'single-omelette',
    title: 'Single Omelette',
    description: 'Fluffy single egg omelette cooked on skillet with fresh onion and coriander.',
    price: 30,
    category: 'Beverages',
    image: '/images/double_omelette.png',
    rating: 4.1,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Cheese Slice', price: 20 },
      { name: 'Extra Toast Slices (2)', price: 15 }
    ]),
    ingredients: JSON.stringify(["1 Farm Egg", "Fresh Coriander & Onion", "Skillet Butter"])
  },
  {
    id: 'double-omelette',
    title: 'Double Omelette',
    description: 'Skillet double egg omelette cooked with chopped onions, tomatoes, and spicy green chilies.',
    price: 50,
    category: 'Beverages',
    image: '/images/double_omelette.png',
    rating: 4.2,
    isVeg: false,
    isPopular: true,
    available: true,
    addOns: JSON.stringify([
      { name: 'Cheese Slice', price: 20 },
      { name: 'Toast Slices (2)', price: 15 }
    ]),
    ingredients: JSON.stringify(["2 Farm Eggs", "Fresh Green Chillies", "Onions & Tomatoes"])
  },
  // Chowmein
  {
    id: 'veg-chowmein',
    title: 'Veg Chowmein',
    description: 'Wok stir-fried noodles tossed with crisp local market greens, shredded carrots, cabbage, and soy sauce.',
    price: 100,
    category: 'Momos',
    image: '/images/veg_chowmein.png',
    rating: 4.4,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Veggies', price: 20 },
      { name: 'Spicy Schezwan Sauce', price: 15 }
    ]),
    ingredients: JSON.stringify(["Wok Tossed Noodles", "Shredded Cabbage", "Julienne Carrots", "Bell Peppers", "Soy Sauce"])
  },
  {
    id: 'chicken-chowmein',
    title: 'Chicken Chowmein',
    description: 'Wok stir-fried noodles tossed with tender chicken slivers, garlic, local vegetables, and savory sauces.',
    price: 120,
    category: 'Momos',
    image: '/images/chicken_chowmein.png',
    rating: 4.7,
    isVeg: false,
    isPopular: true,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Chicken', price: 40 },
      { name: 'Spicy Schezwan Sauce', price: 15 }
    ]),
    ingredients: JSON.stringify(["Tossed Noodles", "Tender Chicken", "Shredded Cabbage", "Garlic & Ginger Soy"])
  },
  {
    id: 'aloo-waiwai',
    title: 'Aloo waiwai',
    description: 'Dry Wai Wai instant noodles tossed with spicy boiled potato cubes, onion, mustard oil, and lime.',
    price: 80,
    category: 'Momos',
    image: '/images/aloo_waiwai.png',
    rating: 4.5,
    isVeg: true,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Potato Cubes', price: 15 },
      { name: 'Extra Lime & Onion', price: 10 }
    ]),
    ingredients: JSON.stringify(["Crispy Wai Wai Noodles", "Spiced Potato Cubes", "Fresh Lime Juice", "Chopped Onion", "Mustard Oil"])
  },
  // Specials
  {
    id: 'ramen-pouch-egg',
    title: 'Ramen with Pouch Egg',
    description: 'Korean style spicy instant ramen soup topped with a perfectly poached egg and fresh green onions.',
    price: 250,
    category: 'Thalis',
    image: '/images/ramen_pouch_egg.png',
    rating: 4.8,
    isVeg: false,
    isPopular: true,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Poached Egg', price: 20 },
      { name: 'Cheese Slice', price: 20 }
    ]),
    ingredients: JSON.stringify(["Spicy Ramen Broth", "Perfect Poached Egg", "Green Onion Garnish", "Nori strips"])
  },
  {
    id: 'chicken-chilli',
    title: 'Chicken chilli (8 pieces)',
    description: '8 pieces of crispy batter-fried chicken cubes tossed with bell peppers and onion in a spicy soy-chilli glaze.',
    price: 250,
    category: 'Thalis',
    image: '/images/chicken_chilli.png',
    rating: 4.7,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Chilli Soy Glaze', price: 15 },
      { name: 'Extra Peppers & Onion', price: 15 }
    ]),
    ingredients: JSON.stringify(["8 batter-fried Chicken", "Green Bell Peppers", "Sliced Onion", "Chilli Soy Glaze"])
  },
  {
    id: 'chicken-karchi-marchi',
    title: 'Chicken Karchi marchi',
    description: 'Crispy skillet local dry stir-fry chicken nuggets flavored with fresh local bird\'s eye green chillies and curry leaves.',
    price: 150,
    category: 'Thalis',
    image: '/images/chicken_karchi_marchi.png',
    rating: 4.6,
    isVeg: false,
    isPopular: false,
    available: true,
    addOns: JSON.stringify([
      { name: 'Extra Green Chillies', price: 10 },
      { name: 'Extra Chicken Nuggets', price: 40 }
    ]),
    ingredients: JSON.stringify(["Skillet Fried Chicken Nuggets", "Bird's Eye Green Chillies", "Curry Leaves", "Ginger-Garlic"])
  }
];

// Initialize JSON database fallback file if not present
if (!fs.existsSync(JSON_DB_PATH)) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(INITIAL_MENU, null, 2), 'utf-8');
}

// MySQL Connection Configuration
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1111',
  database: process.env.DB_NAME || 'shree_ganesh',
  connectTimeout: 5000
};

let useMySQL = false;
let connectionPool = null;

// Attempt database connection pool initialization
async function initDatabase() {
  try {
    // Attempt standard connection to provision DB
    const rootConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      connectTimeout: 3000
    });

    console.log('✔ MySQL Server reachable. Provisioning database...');
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await rootConnection.end();

    // Create pool for port active requests
    connectionPool = mysql.createPool(dbConfig);
    
    // Provision table
    const db = await connectionPool.getConnection();
    await db.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        price INT NOT NULL,
        category VARCHAR(100) NOT NULL,
        image VARCHAR(255),
        rating DECIMAL(3,2) DEFAULT 4.5,
        isVeg BOOLEAN DEFAULT TRUE,
        isPopular BOOLEAN DEFAULT FALSE,
        available BOOLEAN DEFAULT TRUE,
        addOns JSON,
        ingredients JSON
      );
    `);

    // Dynamically migrate if column missing
    try {
      await db.query(`ALTER TABLE menu_items ADD COLUMN ingredients JSON;`);
      console.log('✔ Migrated table: Added ingredients column.');
    } catch(err) {
      // Column exists
    }
    
    // Seed initial values if empty
    const [rows] = await db.query('SELECT COUNT(*) as count FROM menu_items');
    if (rows[0].count === 0) {
      console.log('🌱 Seeding initial dishes assets into MySQL table...');
      for (const item of INITIAL_MENU) {
        await db.query(
          `INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id, item.title, item.description, item.price, item.category, 
            item.image, item.rating, item.isVeg, item.isPopular, item.available, 
            item.addOns, item.ingredients
          ]
        );
      }
    }
    
    db.release();
    useMySQL = true;
    console.log('🚀 MySQL Active: Database connected and provisioned.');
  } catch (error) {
    console.warn('\n⚠ MySQL connection failed/unavailable:', error.message);
    console.warn('⚡ FALLBACK ACTIVATED: Operating on local persistent JSON File Database.');
    useMySQL = false;
  }
}

// Initialise DB engine selection
await initDatabase();

// Helper to write JSON DB updates
function saveToJSONFile(data) {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save JSON local db updates:', err.message);
  }
}

// Helper to read JSON DB
function readFromJSONFile() {
  try {
    const raw = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_MENU;
  }
}

// Helper to parse db items addOns safely
function formatItemRow(item) {
  return {
    ...item,
    isVeg: !!item.isVeg,
    isPopular: !!item.isPopular,
    available: !!item.available,
    addOns: typeof item.addOns === 'string' ? JSON.parse(item.addOns) : (item.addOns || []),
    ingredients: typeof item.ingredients === 'string' ? JSON.parse(item.ingredients) : (item.ingredients || [])
  };
}

// ==========================================================
// AUTHENTICATION & IP BLOCKING SYSTEM
// ==========================================================

const AUTH_DB_PATH = path.join(DATA_DIR, 'auth.json');
const MAX_LOGIN_ATTEMPTS = 8;

// Admin credentials (in production, use hashed passwords and env vars)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USER || 'PriyaGanesh',
  password: process.env.ADMIN_PASS || 'GaneshAakash'
};

// Active session tokens (in-memory, cleared on server restart)
const activeSessions = new Map();

// Load auth state from file
function loadAuthState() {
  try {
    if (fs.existsSync(AUTH_DB_PATH)) {
      const raw = fs.readFileSync(AUTH_DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load auth state:', err.message);
  }
  return { blockedIPs: {}, loginAttempts: {} };
}

// Save auth state to file
function saveAuthState(state) {
  try {
    fs.writeFileSync(AUTH_DB_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save auth state:', err.message);
  }
}

// Extract client IP from request
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         'unknown';
}

// Generate secure session token
function generateToken() {
  return crypto.randomBytes(48).toString('hex');
}

// AUTH ENDPOINT: Check if current IP is blocked
app.get('/g/a/n/e/s/h/ganeshdidibhai/status', (req, res) => {
  const ip = getClientIP(req);
  const state = loadAuthState();
  const isBlocked = !!state.blockedIPs[ip];
  const attempts = state.loginAttempts[ip]?.count || 0;
  
  res.json({ 
    blocked: isBlocked, 
    attempts,
    maxAttempts: MAX_LOGIN_ATTEMPTS
  });
});

// AUTH ENDPOINT: Login
app.post('/g/a/n/e/s/h/ganeshdidibhai/login', (req, res) => {
  const ip = getClientIP(req);
  const state = loadAuthState();

  // Check if IP is blocked
  if (state.blockedIPs[ip]) {
    return res.status(403).json({
      success: false,
      blocked: true,
      message: 'Your IP has been blocked. Contact administrator to unblock.'
    });
  }

  const { username, password } = req.body;

  // Validate credentials
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Successful login - reset attempts counter
    delete state.loginAttempts[ip];
    saveAuthState(state);

    // Generate session token
    const token = generateToken();
    activeSessions.set(token, {
      ip,
      loginTime: Date.now(),
      username
    });

    console.log(`✔ Admin login successful from IP: ${ip}`);

    return res.json({
      success: true,
      token,
      message: 'Login successful'
    });
  }

  // Failed login - increment attempt counter
  if (!state.loginAttempts[ip]) {
    state.loginAttempts[ip] = { count: 0, firstAttempt: Date.now() };
  }
  state.loginAttempts[ip].count += 1;
  state.loginAttempts[ip].lastAttempt = Date.now();

  const attemptsUsed = state.loginAttempts[ip].count;
  const attemptsLeft = MAX_LOGIN_ATTEMPTS - attemptsUsed;

  console.warn(`⚠ Failed login attempt ${attemptsUsed}/${MAX_LOGIN_ATTEMPTS} from IP: ${ip}`);

  // Block IP if max attempts reached
  if (attemptsUsed >= MAX_LOGIN_ATTEMPTS) {
    state.blockedIPs[ip] = {
      blockedAt: Date.now(),
      reason: `Exceeded ${MAX_LOGIN_ATTEMPTS} failed login attempts`,
      totalAttempts: attemptsUsed
    };
    saveAuthState(state);
    console.error(`🚫 IP BLOCKED: ${ip} after ${attemptsUsed} failed attempts`);

    return res.status(403).json({
      success: false,
      blocked: true,
      message: 'Too many failed attempts. Your IP has been blocked.',
      attemptsLeft: 0
    });
  }

  saveAuthState(state);

  return res.status(401).json({
    success: false,
    blocked: false,
    message: 'Invalid username or password',
    attemptsLeft
  });
});

// AUTH ENDPOINT: Validate session token
app.post('/g/a/n/e/s/h/ganeshdidibhai/validate', (req, res) => {
  const { token } = req.body;
  
  if (!token || !activeSessions.has(token)) {
    return res.json({ valid: false });
  }

  const session = activeSessions.get(token);
  // Session expires after 24 hours
  if (Date.now() - session.loginTime > 24 * 60 * 60 * 1000) {
    activeSessions.delete(token);
    return res.json({ valid: false, reason: 'expired' });
  }

  return res.json({ valid: true, username: session.username });
});

// AUTH ENDPOINT: Logout
app.post('/g/a/n/e/s/h/ganeshdidibhai/logout', (req, res) => {
  const { token } = req.body;
  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// AUTH ENDPOINT: Admin-only unblock IP
app.post('/g/a/n/e/s/h/ganeshdidibhai/unblock', (req, res) => {
  const { token, ipToUnblock } = req.body;

  // Verify the requester is a valid admin session
  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const state = loadAuthState();

  if (ipToUnblock === '__all__') {
    // Unblock all IPs
    state.blockedIPs = {};
    state.loginAttempts = {};
    saveAuthState(state);
    console.log('✔ Admin unblocked ALL IPs');
    return res.json({ success: true, message: 'All IPs unblocked' });
  }

  if (!state.blockedIPs[ipToUnblock]) {
    return res.status(404).json({ success: false, message: 'IP not found in blocked list' });
  }

  delete state.blockedIPs[ipToUnblock];
  delete state.loginAttempts[ipToUnblock];
  saveAuthState(state);

  console.log(`✔ Admin unblocked IP: ${ipToUnblock}`);
  return res.json({ success: true, message: `IP ${ipToUnblock} unblocked` });
});

// AUTH ENDPOINT: Admin-only list blocked IPs
app.get('/g/a/n/e/s/h/ganeshdidibhai/blocked', (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  
  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const state = loadAuthState();
  res.json({ 
    blockedIPs: state.blockedIPs,
    loginAttempts: state.loginAttempts 
  });
});

// ==========================================================
// REST API ENDPOINTS
// ==========================================================

// 1. GET ALL ITEMS
app.get('/api/menu', async (req, res) => {
  try {
    if (useMySQL) {
      const [rows] = await connectionPool.query('SELECT * FROM menu_items');
      return res.json(rows.map(formatItemRow));
    } else {
      const data = readFromJSONFile();
      return res.json(data.map(formatItemRow));
    }
  } catch (err) {
    console.error('GET /api/menu failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
});

// 2. CREATE A NEW DISH
app.post('/api/menu', async (req, res) => {
  try {
    const { id, title, description, price, category, image, isVeg, isPopular, available, addOns, ingredients } = req.body;
    const newItem = {
      id: id || `custom-${Date.now()}`,
      title,
      description: description || '',
      price: Number(price) || 0,
      category: category || 'Main Course',
      image: image || '/images/plain_maggi.png',
      rating: 4.5,
      isVeg: isVeg === undefined ? true : !!isVeg,
      isPopular: !!isPopular,
      available: available === undefined ? true : !!available,
      addOns: addOns ? (typeof addOns === 'string' ? addOns : JSON.stringify(addOns)) : '[]',
      ingredients: ingredients ? (typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients)) : '[]'
    };

    if (useMySQL) {
      await connectionPool.query(
        `INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newItem.id, newItem.title, newItem.description, newItem.price, newItem.category,
          newItem.image, newItem.rating, newItem.isVeg, newItem.isPopular, newItem.available,
          newItem.addOns, newItem.ingredients
        ]
      );
    } else {
      const items = readFromJSONFile();
      items.push(newItem);
      saveToJSONFile(items);
    }

    res.status(201).json(formatItemRow(newItem));
  } catch (err) {
    console.error('POST /api/menu failed:', err.message);
    res.status(500).json({ error: 'Failed to create menu item.' });
  }
});

// 3. EDIT A DISH DETAILS
app.put('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, image, isVeg, isPopular, available, addOns, ingredients } = req.body;
    
    const updatedFields = {
      title,
      description: description || '',
      price: Number(price) || 0,
      category: category || 'Main Course',
      image: image || '/images/plain_maggi.png',
      isVeg: isVeg === undefined ? true : !!isVeg,
      isPopular: !!isPopular,
      available: available === undefined ? true : !!available,
      addOns: addOns ? (typeof addOns === 'string' ? addOns : JSON.stringify(addOns)) : '[]',
      ingredients: ingredients ? (typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients)) : '[]'
    };

    if (useMySQL) {
      const [result] = await connectionPool.query(
        `UPDATE menu_items SET 
           title = ?, description = ?, price = ?, category = ?, 
           image = ?, isVeg = ?, isPopular = ?, available = ?, addOns = ?, ingredients = ? 
         WHERE id = ?`,
        [
          updatedFields.title, updatedFields.description, updatedFields.price, updatedFields.category,
          updatedFields.image, updatedFields.isVeg, updatedFields.isPopular, updatedFields.available, 
          updatedFields.addOns, updatedFields.ingredients, id
        ]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Item not found.' });
      }
    } else {
      let items = readFromJSONFile();
      const exists = items.some(item => item.id === id);
      if (!exists) return res.status(404).json({ error: 'Item not found.' });
      
      items = items.map(item => 
        item.id === id ? { ...item, ...updatedFields, id } : item
      );
      saveToJSONFile(items);
    }

    res.json(formatItemRow({ ...updatedFields, id }));
  } catch (err) {
    console.error('PUT /api/menu/:id failed:', err.message);
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

// 4. TOGGLE DISH STOCK INLINE (PATCH)
app.patch('/api/menu/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    let newStatus = true;

    if (useMySQL) {
      const [rows] = await connectionPool.query('SELECT available FROM menu_items WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Item not found.' });
      newStatus = !rows[0].available;
      await connectionPool.query('UPDATE menu_items SET available = ? WHERE id = ?', [newStatus, id]);
    } else {
      const items = readFromJSONFile();
      const item = items.find(item => item.id === id);
      if (!item) return res.status(404).json({ error: 'Item not found.' });
      newStatus = !item.available;
      item.available = newStatus;
      saveToJSONFile(items);
    }

    res.json({ id, available: newStatus });
  } catch (err) {
    console.error('PATCH /api/menu/:id/toggle failed:', err.message);
    res.status(500).json({ error: 'Failed to toggle availability status.' });
  }
});

// 5. DELETE A DISH
app.delete('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (useMySQL) {
      const [result] = await connectionPool.query('DELETE FROM menu_items WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Item not found.' });
    } else {
      const items = readFromJSONFile();
      const exists = items.some(item => item.id === id);
      if (!exists) return res.status(404).json({ error: 'Item not found.' });
      
      const filtered = items.filter(item => item.id !== id);
      saveToJSONFile(filtered);
    }

    res.json({ success: true, id });
  } catch (err) {
    console.error('DELETE /api/menu/:id failed:', err.message);
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});

// START EXPRESS LISTENER
app.listen(PORT, '0.0.0.0', () => {
  console.log(`📡 Express API Server running on http://0.0.0.0:${PORT}`);
});

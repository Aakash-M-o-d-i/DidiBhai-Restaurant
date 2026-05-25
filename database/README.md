# 📦 Didi-Bhai Restaurant — Production Database

This folder contains all the seed data required to initialize the application in production.

## Files

| File | Purpose | Used By |
|---|---|---|
| `menu.json` | Complete menu with all 21 dishes, addOns, ingredients | JSON fallback DB (`server/data/menu.json`) |
| `auth.json` | Clean authentication state (no blocked IPs) | Auth system (`server/data/auth.json`) |
| `seed.sql` | MySQL seed script for `shree_ganesh` database | MySQL mode (if available) |

## How It Works

The Express server (`server.js`) operates in **dual-mode**:

1. **MySQL Mode** — If MySQL is available at `127.0.0.1:3306`, it auto-provisions the `shree_ganesh` database and `menu_items` table.
2. **JSON Fallback Mode** — If MySQL is unavailable, it reads/writes to `server/data/menu.json`.

On first startup, if `server/data/menu.json` doesn't exist, the server auto-creates it from its built-in `INITIAL_MENU` array.

## Production Setup

### Option 1: JSON Mode (No MySQL Required)

```bash
# Copy seed data to the server's runtime data directory
mkdir -p server/data
cp database/menu.json server/data/menu.json
cp database/auth.json server/data/auth.json
```

### Option 2: MySQL Mode

```bash
# Import the seed SQL directly
mysql -u root -p < database/seed.sql

# Verify
mysql -u root -p -e "SELECT COUNT(*) AS total_items FROM shree_ganesh.menu_items;"
```

## Menu Summary (21 Items)

| # | Item | Price | Category | Type |
|---|---|---|---|---|
| 1 | Black/Milk Tea | ₹20 | Beverages | 🟢 Veg |
| 2 | Coffee | ₹40 | Beverages | 🟢 Veg |
| 3 | Bread Omelette | ₹70 | Beverages | 🔴 Non-Veg |
| 4 | Single Omelette | ₹30 | Beverages | 🔴 Non-Veg |
| 5 | Double Omelette | ₹50 | Beverages | 🔴 Non-Veg ⭐ |
| 6 | Veg Momo (8 pcs) | ₹80 | Momos | 🟢 Veg |
| 7 | Chicken Momo (8 pcs) | ₹120 | Momos | 🔴 Non-Veg ⭐ |
| 8 | Veg Chowmein | ₹100 | Momos | 🟢 Veg |
| 9 | Chicken Chowmein | ₹120 | Momos | 🔴 Non-Veg ⭐ |
| 10 | Aloo Waiwai | ₹80 | Momos | 🟢 Veg |
| 11 | Plain Maggi | ₹50 | Maggi | 🟢 Veg |
| 12 | Egg Maggi | ₹80 | Maggi | 🔴 Non-Veg |
| 13 | Aloo Thukpa | ₹120 | Maggi | 🟢 Veg |
| 14 | Roti Sabzi (4 pcs) | ₹80 | Maggi | 🟢 Veg |
| 15 | Puri Sabzi (4 pcs) | ₹80 | Maggi | 🟢 Veg |
| 16 | Veg Thali | ₹130 | Thalis | 🟢 Veg ⭐ |
| 17 | Chicken Thali | ₹230 | Thalis | 🔴 Non-Veg ⭐ |
| 18 | Pork Thali | ₹350 | Thalis | 🔴 Non-Veg |
| 19 | Ramen with Pouch Egg | ₹250 | Thalis | 🔴 Non-Veg ⭐ |
| 20 | Chicken Chilli (8 pcs) | ₹250 | Thalis | 🔴 Non-Veg |
| 21 | Chicken Karchi Marchi | ₹150 | Thalis | 🔴 Non-Veg |

> ⭐ = Popular items shown with badge on the menu

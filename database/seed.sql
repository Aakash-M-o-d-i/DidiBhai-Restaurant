-- ==========================================================
-- Didi-Bhai Restaurant — MySQL Production Seed Script
-- Database: shree_ganesh
-- Run: mysql -u root -p < database/seed.sql
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `shree_ganesh`;
USE `shree_ganesh`;

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  price INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  image VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 4.50,
  isVeg BOOLEAN DEFAULT TRUE,
  isPopular BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  addOns JSON,
  ingredients JSON
);

-- Clear existing data before seeding
TRUNCATE TABLE menu_items;

-- ==========================================================
-- SEED ALL 21 MENU ITEMS
-- ==========================================================

-- Beverages
INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('black-tea', 'Black/Milk Tea', 'Cardamom and ginger brewed traditional tea cup.', 20, 'Beverages', '/images/black_milk_tea.png', 4.90, TRUE, FALSE, TRUE,
  '[{"name":"Extra Ginger","price":10},{"name":"Extra Sugar","price":5},{"name":"Extra Milk Portion","price":10}]',
  '["Premium Tea Leaves","Cardamom & Ginger","Fresh Milk","Sugar"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('hot-coffee', 'Coffee', 'Frothy hot coffee served in a traditional cup.', 40, 'Beverages', '/images/hot_coffee.png', 4.50, TRUE, FALSE, TRUE,
  '[{"name":"Extra Whipped Cream","price":15},{"name":"Extra Espresso Shot","price":20}]',
  '["Rich Coffee Beans","Whipped Cream","Steamed Milk","Sugar"]');

-- Omelettes (under Beverages category)
INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('bread-omelette', 'Bread Omelette', 'Soft white bread slices toasted on skillet with a double masala egg omelette.', 70, 'Beverages', '/images/bread_omelette.png', 4.40, FALSE, FALSE, TRUE,
  '[{"name":"Extra Cheese Slice","price":20},{"name":"Double Butter Toast","price":15}]',
  '["2 Farm Eggs","2 Slices Toast Bread","Chopped Onion & Chillies"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('single-omelette', 'Single Omelette', 'Fluffy single egg omelette cooked on skillet with fresh onion and coriander.', 30, 'Beverages', '/images/double_omelette.png', 4.10, FALSE, FALSE, TRUE,
  '[{"name":"Cheese Slice","price":20},{"name":"Extra Toast Slices (2)","price":15}]',
  '["1 Farm Egg","Fresh Coriander & Onion","Skillet Butter"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('double-omelette', 'Double Omelette', 'Skillet double egg omelette cooked with chopped onions, tomatoes, and spicy green chilies.', 50, 'Beverages', '/images/double_omelette.png', 4.20, FALSE, TRUE, TRUE,
  '[{"name":"Cheese Slice","price":20},{"name":"Toast Slices (2)","price":15}]',
  '["2 Farm Eggs","Fresh Green Chillies","Onions & Tomatoes"]');

-- Momos & Chowmein
INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('veg-momos', 'Veg Momo (8 pcs)', '8 Pcs of steamed cabbage & carrot dumplings with spicy red chutney.', 80, 'Momos', '/images/veg_momos.png', 4.60, TRUE, FALSE, TRUE,
  '[{"name":"Spicy Schezwan Chutney","price":15},{"name":"Cheese Dip Cup","price":20}]',
  '["Steamed Cabbage & Carrot","Thin Wrapper","Local Garlic & Ginger"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('chicken-momos', 'Chicken Momo (8 pcs)', '8 Pcs of juicy minced chicken dumplings served with spicy red chutney.', 120, 'Momos', '/images/chicken_momos.png', 4.80, FALSE, TRUE, TRUE,
  '[{"name":"Spicy Schezwan Chutney","price":15},{"name":"Cheese Dip Cup","price":20}]',
  '["Juicy Minced Chicken","Thin Wrapper","Fresh Coriander & Spices"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('veg-chowmein', 'Veg Chowmein', 'Wok stir-fried noodles tossed with crisp local market greens, shredded carrots, cabbage, and soy sauce.', 100, 'Momos', '/images/veg_chowmein.png', 4.40, TRUE, FALSE, TRUE,
  '[{"name":"Extra Veggies","price":20},{"name":"Spicy Schezwan Sauce","price":15}]',
  '["Wok Tossed Noodles","Shredded Cabbage","Julienne Carrots","Bell Peppers","Soy Sauce"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('chicken-chowmein', 'Chicken Chowmein', 'Wok stir-fried noodles tossed with tender chicken slivers, garlic, local vegetables, and savory sauces.', 120, 'Momos', '/images/chicken_chowmein.png', 4.70, FALSE, TRUE, TRUE,
  '[{"name":"Extra Chicken","price":40},{"name":"Spicy Schezwan Sauce","price":15}]',
  '["Tossed Noodles","Tender Chicken","Shredded Cabbage","Garlic & Ginger Soy"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('aloo-waiwai', 'Aloo waiwai', 'Dry Wai Wai instant noodles tossed with spicy boiled potato cubes, onion, mustard oil, and lime.', 80, 'Momos', '/images/aloo_waiwai.png', 4.50, TRUE, FALSE, TRUE,
  '[{"name":"Extra Potato Cubes","price":15},{"name":"Extra Lime & Onion","price":10}]',
  '["Crispy Wai Wai Noodles","Spiced Potato Cubes","Fresh Lime Juice","Chopped Onion","Mustard Oil"]');

-- Maggi & Snacks
INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('plain-maggi', 'Plain Maggi', 'Classic bowl of plain masala noodles cooked in our secret spice blend.', 50, 'Maggi', '/images/plain_maggi.png', 4.40, TRUE, FALSE, TRUE,
  '[{"name":"Extra Cheese Slice","price":20},{"name":"Fried Egg","price":15}]',
  '["Springy Noodles","Didi-Bhai Special Maggi Masala","Skillet Butter"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('egg-maggi', 'Egg Maggi', 'Springy masala noodles tossed with soft-boiled scrambled eggs and seasoning.', 80, 'Maggi', '/images/egg_maggi.png', 4.70, FALSE, FALSE, TRUE,
  '[{"name":"Extra Cheese Slice","price":20},{"name":"Extra Egg","price":15}]',
  '["Double Egg","Springy Noodles","Signature Masala","Coriander"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('aloo-thukpa', 'Aloo thukpa', 'Warm and comforting Himalayan noodle soup served with potatoes and fresh herbs.', 120, 'Maggi', '/images/aloo_thukpa.png', 4.60, TRUE, FALSE, TRUE,
  '[{"name":"Extra Aloo Cubes","price":20},{"name":"Spicy Schezwan Sauce","price":15}]',
  '["Himalayan Noodles","Spiced Aloo Cubes","Warm Vegetable Broth","Ginger-Garlic"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('roti-sabzi', 'Roti Sabzi (4 pcs)', '4 soft whole wheat tawa rotis served with seasonal mixed vegetables curry.', 80, 'Maggi', '/images/roti_sabzi.png', 4.30, TRUE, FALSE, TRUE,
  '[{"name":"Extra Rotis (2 pcs)","price":20},{"name":"Extra Sabzi Bowl","price":30}]',
  '["4 Whole Wheat Rotis","Seasonal Mixed Veg","Traditional Masala"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('puri-sabzi', 'Puri Sabzi (4 pcs)', '4 fluffy deep fried golden puris served with spicy dry aloo bhaji masala.', 80, 'Maggi', '/images/puri_sabzi.png', 4.50, TRUE, FALSE, TRUE,
  '[{"name":"Extra Puris (2 pcs)","price":25},{"name":"Extra Aloo Bhaji","price":30}]',
  '["4 Deep Fried Puris","Spicy Dry Aloo Bhaji","Aromatic Spices"]');

-- Thalis & Specials
INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('veg-thali', 'Veg Thali', 'Complete traditional platter with Paneer Gravy, Yellow Dal Tadka, Sabzi, Roti, Rice & Sweet.', 130, 'Thalis', '/images/veg_thali.png', 4.50, TRUE, TRUE, TRUE,
  '[{"name":"Extra Rice Portion","price":30},{"name":"Extra Paneer Gravy","price":40},{"name":"Sweet Gulab Jamun","price":25}]',
  '["Paneer Masala","Dal Tadka","Jeera Rice","4 Tawa Rotis","Sweet Gulab Jamun"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('chicken-thali', 'Chicken Thali', 'A hearty traditional platter of basmati rice, warm butter chicken curry, chicken dry stir-fry, and roti.', 230, 'Thalis', '/images/chicken_thali.png', 4.70, FALSE, TRUE, TRUE,
  '[{"name":"Extra Rice Portion","price":30},{"name":"Extra Butter Chicken","price":60},{"name":"Sweet Gulab Jamun","price":25}]',
  '["Butter Chicken Curry","Chicken Dry Stir-Fry","Basmati Rice","Tawa Roti","Sweet Gulab Jamun"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('pork-thali', 'Pork thali', 'Traditional Naga-style smoked pork slow-cooked with bamboo shoots, served with rice, dal, and local greens.', 350, 'Thalis', '/images/pork_thali.png', 4.80, FALSE, FALSE, TRUE,
  '[{"name":"Extra Rice Portion","price":30},{"name":"Extra Smoked Pork","price":80}]',
  '["Smoked Pork","Bamboo Shoots","Basmati Rice","Local Boiled Greens","Dal"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('ramen-pouch-egg', 'Ramen with Pouch Egg', 'Korean style spicy instant ramen soup topped with a perfectly poached egg and fresh green onions.', 250, 'Thalis', '/images/ramen_pouch_egg.png', 4.80, FALSE, TRUE, TRUE,
  '[{"name":"Extra Poached Egg","price":20},{"name":"Cheese Slice","price":20}]',
  '["Spicy Ramen Broth","Perfect Poached Egg","Green Onion Garnish","Nori strips"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('chicken-chilli', 'Chicken chilli (8 pieces)', '8 pieces of crispy batter-fried chicken cubes tossed with bell peppers and onion in a spicy soy-chilli glaze.', 250, 'Thalis', '/images/chicken_chilli.png', 4.70, FALSE, FALSE, TRUE,
  '[{"name":"Extra Chilli Soy Glaze","price":15},{"name":"Extra Peppers & Onion","price":15}]',
  '["8 batter-fried Chicken","Green Bell Peppers","Sliced Onion","Chilli Soy Glaze"]');

INSERT INTO menu_items (id, title, description, price, category, image, rating, isVeg, isPopular, available, addOns, ingredients) VALUES
('chicken-karchi-marchi', 'Chicken Karchi marchi', 'Crispy skillet local dry stir-fry chicken nuggets flavored with fresh local bird''s eye green chillies and curry leaves.', 150, 'Thalis', '/images/chicken_karchi_marchi.png', 4.60, FALSE, FALSE, TRUE,
  '[{"name":"Extra Green Chillies","price":10},{"name":"Extra Chicken Nuggets","price":40}]',
  '["Skillet Fried Chicken Nuggets","Bird''s Eye Green Chillies","Curry Leaves","Ginger-Garlic"]');

-- ==========================================================
-- VERIFY SEED
-- ==========================================================
SELECT CONCAT('✅ Seeded ', COUNT(*), ' menu items successfully.') AS status FROM menu_items;

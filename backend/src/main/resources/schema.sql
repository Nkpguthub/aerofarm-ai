-- ============================================================
-- AeroFarm AI — MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS aeroponic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aeroponic_db;

-- Users (auth)
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('FARMER','ADMIN') NOT NULL DEFAULT 'FARMER',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Farmer profiles
CREATE TABLE farmers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  farm_name VARCHAR(255) NOT NULL,
  location VARCHAR(500),
  phone VARCHAR(20),
  subscription ENUM('STARTER','PRO','ENTERPRISE') DEFAULT 'STARTER',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Towers
CREATE TABLE towers (
  id VARCHAR(20) PRIMARY KEY,
  farmer_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  status ENUM('active','offline','maintenance') DEFAULT 'active',
  total_slots INT DEFAULT 48,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- Tower spray cycles
CREATE TABLE tower_cycles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tower_id VARCHAR(20) NOT NULL,
  on_seconds INT DEFAULT 30,
  off_minutes INT DEFAULT 5,
  start_time TIME DEFAULT '06:00:00',
  end_time TIME DEFAULT '22:00:00',
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tower_id) REFERENCES towers(id) ON DELETE CASCADE
);

-- Plant master / intelligence database
CREATE TABLE plants_master (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  scientific_name VARCHAR(200),
  temp_min DECIMAL(4,1),
  temp_max DECIMAL(4,1),
  humidity_min DECIMAL(5,1),
  humidity_max DECIMAL(5,1),
  ph_min DECIMAL(3,1),
  ph_max DECIMAL(3,1),
  ec_min DECIMAL(4,2),
  ec_max DECIMAL(4,2),
  growth_days INT,
  expected_yield_kg_per_slot DECIMAL(5,2),
  spray_on_sec INT DEFAULT 30,
  spray_off_min INT DEFAULT 5,
  disease_risk ENUM('LOW','MEDIUM','HIGH') DEFAULT 'LOW'
);

-- Actual planted instances
CREATE TABLE plants (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tower_id VARCHAR(20) NOT NULL,
  plant_master_id BIGINT NOT NULL,
  planted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expected_harvest_at TIMESTAMP,
  actual_harvest_at TIMESTAMP,
  stage ENUM('early','growth','flowering','mature','harvest','harvested') DEFAULT 'early',
  health_score INT DEFAULT 100,
  notes TEXT,
  FOREIGN KEY (tower_id) REFERENCES towers(id),
  FOREIGN KEY (plant_master_id) REFERENCES plants_master(id)
);

-- Sensor data (time-series)
CREATE TABLE sensor_data (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tower_id VARCHAR(20) NOT NULL,
  ph DECIMAL(4,2),
  temperature DECIMAL(4,1),
  humidity DECIMAL(5,1),
  water_level DECIMAL(5,1),
  ec DECIMAL(4,2),
  light_intensity INT,
  pump_status BOOLEAN DEFAULT FALSE,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tower_time (tower_id, recorded_at),
  FOREIGN KEY (tower_id) REFERENCES towers(id)
);

-- Automation rules
CREATE TABLE automation_rules (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tower_id VARCHAR(20) NOT NULL,
  water_spray BOOLEAN DEFAULT TRUE,
  ph_control BOOLEAN DEFAULT TRUE,
  nutrient_dosing BOOLEAN DEFAULT TRUE,
  cooling_fan BOOLEAN DEFAULT FALSE,
  led_lighting BOOLEAN DEFAULT TRUE,
  water_refill BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tower_id) REFERENCES towers(id)
);

-- Notifications
CREATE TABLE notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  type ENUM('alert','success','info','warning') DEFAULT 'info',
  severity ENUM('info','success','warning','danger') DEFAULT 'info',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Yield reports
CREATE TABLE yield_reports (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tower_id VARCHAR(20) NOT NULL,
  plant_id BIGINT NOT NULL,
  weight_kg DECIMAL(6,2),
  revenue DECIMAL(10,2),
  harvested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  quality ENUM('EXCELLENT','GOOD','AVERAGE','POOR') DEFAULT 'GOOD',
  FOREIGN KEY (tower_id) REFERENCES towers(id),
  FOREIGN KEY (plant_id) REFERENCES plants(id)
);

-- Products (e-commerce)
CREATE TABLE products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  shipping_address TEXT,
  payment_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items
CREATE TABLE order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Blogs
CREATE TABLE blogs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content LONGTEXT,
  author_id BIGINT NOT NULL,
  tags VARCHAR(255),
  status ENUM('draft','published') DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Payments
CREATE TABLE payments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT,
  user_id BIGINT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  gateway VARCHAR(50),
  gateway_transaction_id VARCHAR(255),
  status ENUM('pending','success','failed','refunded') DEFAULT 'pending',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO plants_master (name, scientific_name, temp_min, temp_max, humidity_min, humidity_max, ph_min, ph_max, ec_min, ec_max, growth_days, expected_yield_kg_per_slot, spray_on_sec, spray_off_min) VALUES
('Basil', 'Ocimum basilicum', 20.0, 25.0, 60.0, 80.0, 5.5, 6.5, 1.6, 2.2, 45, 0.06, 30, 5),
('Lettuce', 'Lactuca sativa', 18.0, 22.0, 65.0, 80.0, 6.0, 7.0, 1.4, 1.8, 35, 0.10, 30, 8),
('Mint', 'Mentha piperita', 18.0, 26.0, 65.0, 85.0, 6.0, 7.0, 1.8, 2.4, 60, 0.04, 30, 6),
('Spinach', 'Spinacia oleracea', 15.0, 20.0, 60.0, 75.0, 6.0, 7.0, 1.8, 2.3, 40, 0.08, 30, 7),
('Kale', 'Brassica oleracea', 16.0, 22.0, 60.0, 80.0, 6.0, 7.0, 2.0, 2.5, 50, 0.09, 30, 6),
('Coriander', 'Coriandrum sativum', 17.0, 27.0, 60.0, 80.0, 6.0, 7.0, 1.6, 2.0, 40, 0.05, 30, 7);

INSERT INTO products (name, description, category, price, stock_quantity) VALUES
('AeroTower Pro 48-Slot', 'Professional 48-slot aeroponic tower with integrated pump and timer', 'Towers', 24999.00, 45),
('pH Sensor Module v2', 'High-precision industrial pH sensor with ESP32 integration', 'Sensors', 1499.00, 120),
('Nutrient Starter Kit', 'Complete 3-part nutrient solution kit for 60-day supply', 'Nutrients', 899.00, 200),
('ESP32 IoT Control Board', 'Pre-flashed AeroFarm ESP32 board with MQTT and WebSocket support', 'Electronics', 599.00, 80),
('EC Meter Pro', 'Electrical conductivity meter for precise nutrient monitoring', 'Sensors', 2199.00, 0),
('DHT22 Temperature Sensor', 'High-accuracy temperature and humidity sensor', 'Sensors', 349.00, 150);

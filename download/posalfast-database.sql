-- ===========================================================================
-- Posalfast Logistics — production database
-- Generated 2026-10-27 · MySQL 5.7+ / 8.x / MariaDB 10.3+
--
-- Import in phpMyAdmin (select your database -> Import) or:
--   mysql -u USER -p DATABASE_NAME < posalfast-database.sql
--
-- Ships with NO sample shipments and TWO portal accounts:
--   admin      / Posalfast#Admin2026
--   superadmin / Posalfast#Super2026
-- Change both passwords after the first login (README-UPLOAD.txt).
-- ===========================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Portal accounts — bcrypt hashes, compatible with PHP password_verify()
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','superadmin') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id VARCHAR(16) PRIMARY KEY,
  tracking_number VARCHAR(20) NOT NULL UNIQUE,
  sender_name VARCHAR(120) NOT NULL,
  sender_address VARCHAR(255) NOT NULL,
  sender_phone VARCHAR(40) NOT NULL,
  receiver_name VARCHAR(120) NOT NULL,
  receiver_address VARCHAR(255) NOT NULL,
  receiver_phone VARCHAR(40) NOT NULL,
  sender_email VARCHAR(190) NOT NULL DEFAULT '',
  receiver_email VARCHAR(190) NOT NULL DEFAULT '',
  item_description VARCHAR(255) NOT NULL,
  weight DECIMAL(10,2) NOT NULL DEFAULT 0,
  origin VARCHAR(120) NOT NULL,
  destination VARCHAR(120) NOT NULL,
  status ENUM('pending','picked_up','in_transit','out_for_delivery','delivered','returned','cancelled') NOT NULL DEFAULT 'pending',
  estimated_delivery DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_shipments_tracking (tracking_number),
  KEY idx_shipments_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tracking events (scan history) — deleting a shipment removes its events
CREATE TABLE IF NOT EXISTS tracking_events (
  id VARCHAR(16) PRIMARY KEY,
  shipment_id VARCHAR(16) NOT NULL,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(120) NOT NULL,
  timestamp DATETIME NOT NULL,
  description VARCHAR(255) NOT NULL,
  KEY idx_events_shipment (shipment_id),
  CONSTRAINT fk_events_shipment FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site content edited in the super-admin portal (single JSON row)
CREATE TABLE IF NOT EXISTS settings (
  id TINYINT PRIMARY KEY,
  data LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Seed: live site content (branding, contact details, hero and about copy)
INSERT INTO settings (id, data) VALUES (1, '{"siteName": "Posalfast", "siteNameAccent": "P", "logoIcon": "truck", "logoImage": "", "tagline": "Freight cleared, tracked and delivered", "address": "14 Adeola Odeku Street, Victoria Island, Lagos", "phone": "+234 700 555 0199", "phoneSecondary": "+234 812 555 0123", "email": "support@posalfast.com", "emailSales": "sales@posalfast.com", "emailSupport": "info@posalfast.com", "facebook": "https://facebook.com/posalfast", "twitter": "https://twitter.com/posalfast", "instagram": "https://instagram.com/posalfast", "hoursWeekday": "9:00 AM - 6:00 PM", "hoursSaturday": "10:00 AM - 4:00 PM", "hoursSunday": "Closed", "heroTitle": "Freight that lands when we said it would.", "heroSubtitle": "One contract covers collection, clearance, linehaul and final mile. Track every leg from your phone — and get a human on the line the moment something changes.", "heroCTA": "Track your freight", "aboutTitle": "We answer the phone at 6am and again at 11pm.", "aboutDescription": "Posalfast clears and moves commercial freight for importers, exporters and distributors. Our coordinators run dedicated lanes between West Africa, Europe and North America — and every consignment is scanned, insured and visible from pickup to signature.", "yearsExperience": "12+", "statClients": "4,800+", "statCountries": "150+", "statDeliveries": "320K+", "statYears": "12+", "footerAbout": "Posalfast moves commercial freight by road, ocean and air — customs cleared before arrival, covered in full and tracked scan by scan, with one coordinator accountable for the outcome.", "copyrightText": "Posalfast Logistics. All rights reserved.", "primaryColor": "red"}')
  ON DUPLICATE KEY UPDATE data = VALUES(data);

-- Seed: portal accounts
--   admin      -> Posalfast#Admin2026
--   superadmin -> Posalfast#Super2026
INSERT INTO users (username, password_hash, role) VALUES
  ('admin',      '$2y$10$VyHZxJDvTcVe6raz1zkom.F6KeNJQl6CXCAtLz9eqKTeJQ1bLMtFG', 'admin'),
  ('superadmin', '$2y$10$.9fgb0BBt9.nIz52QuaV7uALeHvh5AjM1RMn3ZFQbvG1mtzq0jmrS', 'superadmin')
  ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role);

-- No sample shipments are inserted. Add your first consignment from
-- /#/admin/login once the API is connected to this database.

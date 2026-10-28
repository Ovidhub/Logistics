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
INSERT INTO settings (id, data) VALUES (1, '{"siteName": "Posalfast", "siteNameAccent": "P", "logoIcon": "truck", "logoImage": "", "tagline": "Freight cleared, tracked and delivered", "address": "12 Fenchurch Avenue, London EC3M 5AD", "phone": "+44 20 7946 0199", "phoneSecondary": "+44 7700 900123", "email": "hello@posalfast.com", "emailSales": "sales@posalfast.com", "emailSupport": "support@posalfast.com", "facebook": "https://facebook.com/posalfast", "twitter": "https://twitter.com/posalfast", "instagram": "https://instagram.com/posalfast", "hoursWeekday": "08:00 - 18:00", "hoursSaturday": "09:00 - 13:00", "hoursSunday": "Closed", "heroTitle": "Freight that lands when we said it would.", "heroSubtitle": "One contract covers collection at your supplier, HMRC clearance and delivery to your door. CDS entries are filed before the vessel berths at Felixstowe, Southampton or London Gateway — and a coordinator in London answers their own phone when something changes.", "heroCTA": "Track your freight", "aboutTitle": "We answer the phone at 8am and again at 8pm.", "aboutDescription": "Posalfast is a UK freight forwarder clearing and moving commercial freight for importers, exporters and distributors. Our coordinators run dedicated lanes between the UK, Europe and North America — filing CDS entries at Felixstowe, Southampton and Heathrow, and keeping every consignment scanned, insured and visible from collection to signature.", "yearsExperience": "13+", "statClients": "2,400+", "statCountries": "150+", "statDeliveries": "320K+", "statYears": "13+", "footerAbout": "Posalfast Logistics Ltd moves commercial freight by road, ocean and air from our London head office — UK customs cleared before arrival, covered in full and tracked scan by scan, with one coordinator accountable for the outcome.", "copyrightText": "Posalfast Logistics Ltd. All rights reserved.", "primaryColor": "red"}')
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

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','superadmin') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tracking_events (
  id VARCHAR(16) PRIMARY KEY,
  shipment_id VARCHAR(16) NOT NULL,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(120) NOT NULL,
  timestamp DATETIME NOT NULL,
  description VARCHAR(255) NOT NULL,
  CONSTRAINT fk_events_shipment FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS settings (
  id TINYINT PRIMARY KEY,
  data LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Site settings (empty object; the frontend merges with its defaults).
INSERT INTO settings (id, data) VALUES (1, '{}')
  ON DUPLICATE KEY UPDATE data = data;

-- Seed admin accounts. REPLACE the hashes below using:
--   php api/tools/make_hash.php "your-password"
-- (The two placeholders correspond to the admin and superadmin accounts.)
INSERT INTO users (username, password_hash, role) VALUES
  ('admin',      '$2y$10$REPLACE_THIS_ADMIN_HASH______________________________', 'admin'),
  ('superadmin', '$2y$10$REPLACE_THIS_SUPERADMIN_HASH_________________________', 'superadmin')
  ON DUPLICATE KEY UPDATE username = username;

-- Demo shipments so the deployed site is populated. Safe to delete later.
INSERT INTO shipments (id, tracking_number, sender_name, sender_address, sender_phone, receiver_name, receiver_address, receiver_phone, item_description, weight, origin, destination, status, estimated_delivery, created_at) VALUES
 ('DEMO0001', 'STX7B9K2M4P1', 'Acme Electronics Ltd', '123 Industrial Way, Portland, OR 97201', '+1 (503) 555-0123', 'Sarah Johnson', '456 Maple Avenue, Seattle, WA 98101', '+1 (206) 555-0456', 'Laptop Computer - Dell XPS 15', 3.20, 'Portland, OR', 'Seattle, WA', 'in_transit', '2026-06-06', '2026-06-01 09:00:00'),
 ('DEMO0002', 'STQ3W8N5R7T2', 'Global Furniture Co', '789 Warehouse Blvd, Chicago, IL 60601', '+1 (312) 555-0789', 'Michael Chen', '321 Oak Street, San Francisco, CA 94102', '+1 (415) 555-0321', 'Dining Table Set - 6 Chairs', 45.00, 'Chicago, IL', 'San Francisco, CA', 'out_for_delivery', '2026-06-04', '2026-06-02 09:00:00'),
 ('DEMO0003', 'STY6P2L9K3M8', 'Fresh Foods Market', '555 Farm Road, Austin, TX 78701', '+1 (512) 555-0555', 'Emily Rodriguez', '888 Sunset Drive, Miami, FL 33101', '+1 (305) 555-0888', 'Organic Produce Box - 20 lbs', 20.50, 'Austin, TX', 'Miami, FL', 'delivered', '2026-06-03', '2026-06-01 09:00:00')
 ON DUPLICATE KEY UPDATE tracking_number = tracking_number;

INSERT INTO tracking_events (id, shipment_id, status, location, timestamp, description) VALUES
 ('DEVT0001', 'DEMO0001', 'Order Placed', 'Portland, OR', '2026-06-01 09:00:00', 'Shipment has been registered in our system'),
 ('DEVT0002', 'DEMO0001', 'In Transit', 'Tacoma, WA', '2026-06-03 14:00:00', 'Package is on its way to the destination'),
 ('DEVT0003', 'DEMO0002', 'Order Placed', 'Chicago, IL', '2026-06-02 09:00:00', 'Shipment has been registered in our system'),
 ('DEVT0004', 'DEMO0002', 'Out for Delivery', 'San Francisco, CA', '2026-06-04 08:00:00', 'Package is out for delivery today'),
 ('DEVT0005', 'DEMO0003', 'Order Placed', 'Austin, TX', '2026-06-01 09:00:00', 'Shipment has been registered in our system'),
 ('DEVT0006', 'DEMO0003', 'Delivered', 'Miami, FL', '2026-06-03 16:00:00', 'Package has been delivered successfully')
 ON DUPLICATE KEY UPDATE shipment_id = shipment_id;

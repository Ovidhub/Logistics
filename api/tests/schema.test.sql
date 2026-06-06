CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shipments (
  id TEXT PRIMARY KEY,
  tracking_number TEXT NOT NULL UNIQUE,
  sender_name TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_phone TEXT NOT NULL,
  sender_email TEXT NOT NULL DEFAULT '',
  receiver_email TEXT NOT NULL DEFAULT '',
  item_description TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 0,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  estimated_delivery TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE tracking_events (
  id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL,
  status TEXT NOT NULL,
  location TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE settings (
  id INTEGER PRIMARY KEY,
  data TEXT NOT NULL
);

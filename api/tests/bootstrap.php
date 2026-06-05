<?php
require __DIR__ . '/../src/Auth.php';
require __DIR__ . '/../src/Router.php';
require __DIR__ . '/../src/Response.php';
require __DIR__ . '/../src/Helpers.php';
require __DIR__ . '/../src/Db.php';
require __DIR__ . '/../src/Shipments.php';
require __DIR__ . '/../src/Settings.php';
require __DIR__ . '/../src/handlers.php';

$GLOBALS['test_config'] = ['jwt_secret' => 'test-secret', 'jwt_ttl' => 3600];

function test_db(): PDO
{
  $pdo = new PDO('sqlite::memory:');
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  $pdo->exec(file_get_contents(__DIR__ . '/schema.test.sql'));

  $pdo->prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')
      ->execute(['admin', password_hash('testpass', PASSWORD_BCRYPT), 'admin']);
  $pdo->prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')
      ->execute(['superadmin', password_hash('testpass', PASSWORD_BCRYPT), 'superadmin']);

  $pdo->prepare('INSERT INTO shipments (id, tracking_number, sender_name, sender_address, sender_phone, receiver_name, receiver_address, receiver_phone, item_description, weight, origin, destination, status, estimated_delivery, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
      ->execute(['SHIP0001', 'STTEST000001', 'Acme', '1 A St', '111', 'Bob', '2 B St', '222', 'Box', 2.5, 'Portland, OR', 'Seattle, WA', 'in_transit', '2026-06-10', '2026-06-01 10:00:00']);
  $pdo->prepare('INSERT INTO tracking_events (id, shipment_id, status, location, timestamp, description) VALUES (?,?,?,?,?,?)')
      ->execute(['EVT00001', 'SHIP0001', 'Order Placed', 'Portland, OR', '2026-06-01 10:00:00', 'Registered']);

  $pdo->exec("INSERT INTO settings (id, data) VALUES (1, '{}')");
  return $pdo;
}

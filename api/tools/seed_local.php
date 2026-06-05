<?php
// Seed admin accounts (and, for SQLite, the schema + demo shipments) for LOCAL DEV.
//
// Usage:
//   php api/tools/seed_local.php [adminPassword] [superadminPassword]
//
// - With a SQLite dsn in config.php it (re)builds the whole local database.
// - With a MySQL dsn it assumes you already imported api/schema.sql, and just
//   sets the admin/superadmin passwords (replacing the placeholder seed hashes).
//
// Defaults: admin / admin123 and superadmin / super123.

$config = require __DIR__ . '/../config.php';
$dsn = $config['db']['dsn'];
$pdo = new PDO($dsn, $config['db']['user'] ?? '', $config['db']['pass'] ?? '', [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

$adminPass = $argv[1] ?? 'admin123';
$superPass = $argv[2] ?? 'super123';
$isSqlite = str_starts_with($dsn, 'sqlite:');

if ($isSqlite) {
  foreach (['tracking_events', 'shipments', 'users', 'settings'] as $t) {
    $pdo->exec("DROP TABLE IF EXISTS $t");
  }
  $pdo->exec(file_get_contents(__DIR__ . '/../tests/schema.test.sql'));
  $pdo->exec("INSERT INTO settings (id, data) VALUES (1, '{}')");

  $shipments = [
    ['DEMO0001', 'STX7B9K2M4P1', 'Acme Electronics Ltd', '123 Industrial Way, Portland, OR 97201', '+1 (503) 555-0123', 'Sarah Johnson', '456 Maple Avenue, Seattle, WA 98101', '+1 (206) 555-0456', 'Laptop Computer - Dell XPS 15', 3.20, 'Portland, OR', 'Seattle, WA', 'in_transit', '2026-06-06', '2026-06-01 09:00:00'],
    ['DEMO0002', 'STQ3W8N5R7T2', 'Global Furniture Co', '789 Warehouse Blvd, Chicago, IL 60601', '+1 (312) 555-0789', 'Michael Chen', '321 Oak Street, San Francisco, CA 94102', '+1 (415) 555-0321', 'Dining Table Set - 6 Chairs', 45.00, 'Chicago, IL', 'San Francisco, CA', 'out_for_delivery', '2026-06-04', '2026-06-02 09:00:00'],
    ['DEMO0003', 'STY6P2L9K3M8', 'Fresh Foods Market', '555 Farm Road, Austin, TX 78701', '+1 (512) 555-0555', 'Emily Rodriguez', '888 Sunset Drive, Miami, FL 33101', '+1 (305) 555-0888', 'Organic Produce Box - 20 lbs', 20.50, 'Austin, TX', 'Miami, FL', 'delivered', '2026-06-03', '2026-06-01 09:00:00'],
  ];
  $ins = $pdo->prepare('INSERT INTO shipments (id, tracking_number, sender_name, sender_address, sender_phone, receiver_name, receiver_address, receiver_phone, item_description, weight, origin, destination, status, estimated_delivery, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  foreach ($shipments as $s) $ins->execute($s);

  $events = [
    ['DEVT0001', 'DEMO0001', 'Order Placed', 'Portland, OR', '2026-06-01 09:00:00', 'Shipment has been registered in our system'],
    ['DEVT0002', 'DEMO0001', 'In Transit', 'Tacoma, WA', '2026-06-03 14:00:00', 'Package is on its way to the destination'],
    ['DEVT0003', 'DEMO0002', 'Order Placed', 'Chicago, IL', '2026-06-02 09:00:00', 'Shipment has been registered in our system'],
    ['DEVT0004', 'DEMO0002', 'Out for Delivery', 'San Francisco, CA', '2026-06-04 08:00:00', 'Package is out for delivery today'],
    ['DEVT0005', 'DEMO0003', 'Order Placed', 'Austin, TX', '2026-06-01 09:00:00', 'Shipment has been registered in our system'],
    ['DEVT0006', 'DEMO0003', 'Delivered', 'Miami, FL', '2026-06-03 16:00:00', 'Package has been delivered successfully'],
  ];
  $ie = $pdo->prepare('INSERT INTO tracking_events (id, shipment_id, status, location, timestamp, description) VALUES (?,?,?,?,?,?)');
  foreach ($events as $e) $ie->execute($e);
}

function upsert_user(PDO $pdo, string $username, string $password, string $role): void
{
  $hash = password_hash($password, PASSWORD_BCRYPT);
  $stmt = $pdo->prepare('SELECT 1 FROM users WHERE username = ?');
  $stmt->execute([$username]);
  if ($stmt->fetch()) {
    $pdo->prepare('UPDATE users SET password_hash = ?, role = ? WHERE username = ?')->execute([$hash, $role, $username]);
  } else {
    $pdo->prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')->execute([$username, $hash, $role]);
  }
}

upsert_user($pdo, 'admin', $adminPass, 'admin');
upsert_user($pdo, 'superadmin', $superPass, 'superadmin');

echo "Seeded database (" . ($isSqlite ? 'sqlite' : 'mysql') . ").\n";
echo "  admin / $adminPass\n";
echo "  superadmin / $superPass\n";

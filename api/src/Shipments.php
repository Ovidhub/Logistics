<?php

class Shipments
{
  const FIELD_MAP = [
    'senderName' => 'sender_name',
    'senderAddress' => 'sender_address',
    'senderPhone' => 'sender_phone',
    'receiverName' => 'receiver_name',
    'receiverAddress' => 'receiver_address',
    'receiverPhone' => 'receiver_phone',
    'itemDescription' => 'item_description',
    'weight' => 'weight',
    'origin' => 'origin',
    'destination' => 'destination',
    'estimatedDelivery' => 'estimated_delivery',
  ];

  public static function eventToApi(array $e): array
  {
    return [
      'id' => $e['id'],
      'status' => $e['status'],
      'location' => $e['location'],
      'timestamp' => $e['timestamp'],
      'description' => $e['description'],
    ];
  }

  public static function rowToApi(array $r, array $events): array
  {
    return [
      'id' => $r['id'],
      'trackingNumber' => $r['tracking_number'],
      'senderName' => $r['sender_name'],
      'senderAddress' => $r['sender_address'],
      'senderPhone' => $r['sender_phone'],
      'receiverName' => $r['receiver_name'],
      'receiverAddress' => $r['receiver_address'],
      'receiverPhone' => $r['receiver_phone'],
      'itemDescription' => $r['item_description'],
      'weight' => (float) $r['weight'],
      'origin' => $r['origin'],
      'destination' => $r['destination'],
      'status' => $r['status'],
      'estimatedDelivery' => $r['estimated_delivery'],
      'createdAt' => $r['created_at'],
      'events' => array_map([self::class, 'eventToApi'], $events),
    ];
  }

  public static function eventsFor(PDO $db, string $shipmentId): array
  {
    $stmt = $db->prepare('SELECT * FROM tracking_events WHERE shipment_id = ? ORDER BY timestamp ASC, id ASC');
    $stmt->execute([$shipmentId]);
    return $stmt->fetchAll();
  }

  public static function findRow(PDO $db, string $id): ?array
  {
    $stmt = $db->prepare('SELECT * FROM shipments WHERE id = ?');
    $stmt->execute([$id]);
    $r = $stmt->fetch();
    return $r ?: null;
  }

  public static function findApi(PDO $db, string $id): ?array
  {
    $row = self::findRow($db, $id);
    return $row ? self::rowToApi($row, self::eventsFor($db, $id)) : null;
  }

  public static function findByTracking(PDO $db, string $tn): ?array
  {
    $stmt = $db->prepare('SELECT * FROM shipments WHERE tracking_number = ?');
    $stmt->execute([$tn]);
    $r = $stmt->fetch();
    return $r ? self::rowToApi($r, self::eventsFor($db, $r['id'])) : null;
  }

  public static function all(PDO $db): array
  {
    $rows = $db->query('SELECT * FROM shipments ORDER BY created_at DESC, id DESC')->fetchAll();
    return array_map(fn($r) => self::rowToApi($r, self::eventsFor($db, $r['id'])), $rows);
  }

  public static function addEvent(PDO $db, string $shipmentId, string $status, string $location, string $description, ?string $ts = null): void
  {
    $ts = $ts ?? gmdate('Y-m-d H:i:s');
    $db->prepare('INSERT INTO tracking_events (id, shipment_id, status, location, timestamp, description) VALUES (?,?,?,?,?,?)')
       ->execute([Ids::generate(), $shipmentId, $status, $location, $ts, $description]);
  }

  public static function create(PDO $db, array $input, string $status): array
  {
    $id = Ids::generate();
    $tn = Ids::trackingNumber();
    $now = gmdate('Y-m-d H:i:s');
    $db->prepare('INSERT INTO shipments (id, tracking_number, sender_name, sender_address, sender_phone, receiver_name, receiver_address, receiver_phone, item_description, weight, origin, destination, status, estimated_delivery, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
       ->execute([
         $id, $tn,
         $input['senderName'], $input['senderAddress'], $input['senderPhone'],
         $input['receiverName'], $input['receiverAddress'], $input['receiverPhone'],
         $input['itemDescription'], (float) ($input['weight'] ?? 0),
         $input['origin'], $input['destination'], $status, $input['estimatedDelivery'], $now,
       ]);
    self::addEvent($db, $id, 'Order Placed', $input['origin'], 'Shipment has been registered in our system', $now);
    return self::findApi($db, $id);
  }

  public static function update(PDO $db, string $id, array $input): void
  {
    $sets = [];
    $vals = [];
    foreach (self::FIELD_MAP as $camel => $col) {
      if (array_key_exists($camel, $input)) {
        $sets[] = "$col = ?";
        $vals[] = $camel === 'weight' ? (float) $input[$camel] : $input[$camel];
      }
    }
    if (!$sets) return;
    $vals[] = $id;
    $db->prepare('UPDATE shipments SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($vals);
  }

  public static function updateStatus(PDO $db, string $id, string $status, string $location, string $description): void
  {
    $db->prepare('UPDATE shipments SET status = ? WHERE id = ?')->execute([$status, $id]);
    self::addEvent($db, $id, Validation::STATUS_LABELS[$status], $location, $description);
  }

  public static function delete(PDO $db, string $id): void
  {
    $db->prepare('DELETE FROM tracking_events WHERE shipment_id = ?')->execute([$id]);
    $db->prepare('DELETE FROM shipments WHERE id = ?')->execute([$id]);
  }
}

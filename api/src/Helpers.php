<?php

class Validation
{
  const STATUSES = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'cancelled'];

  const STATUS_LABELS = [
    'pending' => 'Pending',
    'picked_up' => 'Picked Up',
    'in_transit' => 'In Transit',
    'out_for_delivery' => 'Out for Delivery',
    'delivered' => 'Delivered',
    'returned' => 'Returned',
    'cancelled' => 'Cancelled',
  ];

  public static function isStatus($v): bool
  {
    return is_string($v) && in_array($v, self::STATUSES, true);
  }

  /** @return string[] names of fields that are absent or blank */
  public static function requireFields(array $data, array $fields): array
  {
    $missing = [];
    foreach ($fields as $f) {
      if (!isset($data[$f]) || (is_string($data[$f]) && trim($data[$f]) === '')) {
        $missing[] = $f;
      }
    }
    return $missing;
  }
}

class Ids
{
  public static function generate(int $len = 8): string
  {
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $s = '';
    for ($i = 0; $i < $len; $i++) {
      $s .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $s;
  }

  public static function trackingNumber(): string
  {
    return 'ST' . self::generate(10);
  }
}

/**
 * Returns a Response error array if the auth payload is missing or lacks an
 * allowed role; returns null when access is permitted.
 */
function require_role(?array $auth, array $roles): ?array
{
  if ($auth === null) return Response::error(401, 'Authentication required');
  if (!in_array($auth['role'] ?? '', $roles, true)) return Response::error(403, 'Forbidden');
  return null;
}

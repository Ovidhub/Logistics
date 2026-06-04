<?php

class Settings
{
  /** @return mixed decoded settings (object), or empty object */
  public static function get(PDO $db)
  {
    $row = $db->query('SELECT data FROM settings WHERE id = 1')->fetch();
    $json = $row ? $row['data'] : '{}';
    $decoded = json_decode($json);
    return $decoded === null ? new stdClass() : $decoded;
  }

  public static function save(PDO $db, $data): void
  {
    $json = json_encode($data);
    $exists = $db->query('SELECT 1 FROM settings WHERE id = 1')->fetch();
    if ($exists) {
      $db->prepare('UPDATE settings SET data = ? WHERE id = 1')->execute([$json]);
    } else {
      $db->prepare('INSERT INTO settings (id, data) VALUES (1, ?)')->execute([$json]);
    }
  }
}

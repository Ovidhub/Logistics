<?php

class Db
{
  private static ?PDO $pdo = null;

  public static function init(array $config): void
  {
    self::$pdo = new PDO(
      $config['db']['dsn'],
      $config['db']['user'],
      $config['db']['pass'],
      [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      ]
    );
  }

  public static function set(PDO $pdo): void
  {
    self::$pdo = $pdo;
  }

  public static function get(): PDO
  {
    if (self::$pdo === null) {
      throw new RuntimeException('Database not initialized');
    }
    return self::$pdo;
  }

  public static function reset(): void
  {
    self::$pdo = null;
  }
}

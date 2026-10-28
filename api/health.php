<?php
/**
 * Deployment health check.
 *
 * Visit:  https://api.posalfast.com/health.php?key=posalfast
 *
 * Reports the PHP version, whether config.php and the database are working,
 * whether the tables exist, and the last lines of this folder's error_log — so
 * a broken deployment can be diagnosed from a browser without shell access.
 *
 * It never prints database credentials. Delete this file once the site is live
 * if you would rather not expose the log tail.
 */

const HEALTH_KEY = 'posalfast';

if (($_GET['key'] ?? '') !== HEALTH_KEY) {
  http_response_code(403);
  header('Content-Type: text/plain');
  echo "Forbidden: add ?key=" . HEALTH_KEY . " to the URL.\n";
  exit;
}

header('Content-Type: application/json');

$out = [
  'php_version'        => PHP_VERSION,
  'php_ok_for_api'     => version_compare(PHP_VERSION, '8.0.0', '>='),
  'config_php_exists'  => is_file(__DIR__ . '/config.php'),
  'index_php_exists'   => is_file(__DIR__ . '/index.php'),
  'htaccess_exists'    => is_file(__DIR__ . '/.htaccess'),
  'vendor_exists'      => is_dir(__DIR__ . '/vendor'),
  'pdo_drivers'        => class_exists('PDO') ? PDO::getAvailableDrivers() : [],
  'document_root'      => __DIR__,
];

// Try the database.
if (is_file(__DIR__ . '/config.php')) {
  try {
    $config = require __DIR__ . '/config.php';
    $db = $config['db'] ?? [];
    $out['db_dsn_dbname'] = isset($db['dsn']) && preg_match('/dbname=([^;]+)/', $db['dsn'], $m) ? $m[1] : null;
    $out['db_user'] = $db['user'] ?? null;
    $out['cors_origin'] = $config['cors_origin'] ?? '(not set)';
    $out['jwt_secret_set'] = !empty($config['jwt_secret']) && $config['jwt_secret'] !== 'CHANGE_ME_to_a_long_random_secret';

    $pdo = new PDO($db['dsn'], $db['user'], $db['pass'], [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_TIMEOUT => 5,
    ]);
    $out['db_connected'] = true;

    $tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    $out['tables'] = $tables;
    foreach (['users', 'shipments', 'tracking_events', 'settings'] as $t) {
      $out['table_' . $t] = in_array($t, $tables, true);
    }
    if (in_array('users', $tables, true)) {
      $out['user_count'] = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
      $out['usernames'] = $pdo->query('SELECT username, role FROM users')->fetchAll(PDO::FETCH_ASSOC);
    }
    if (in_array('settings', $tables, true)) {
      $out['settings_rows'] = (int) $pdo->query('SELECT COUNT(*) FROM settings')->fetchColumn();
    }
  } catch (Throwable $e) {
    $out['db_connected'] = false;
    $out['db_error'] = $e->getMessage();
  }
}

// Tail of the error log, where PHP records whatever is 500-ing.
$log = __DIR__ . '/error_log';
if (is_file($log) && is_readable($log)) {
  $lines = @file($log);
  if ($lines !== false) {
    $out['error_log_tail'] = array_slice($lines, -25);
  }
} else {
  $out['error_log_tail'] = 'not readable at ' . $log;
}

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

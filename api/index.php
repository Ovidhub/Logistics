<?php

$config = require __DIR__ . '/config.php';

require __DIR__ . '/src/Db.php';
require __DIR__ . '/src/Response.php';
require __DIR__ . '/src/Auth.php';
require __DIR__ . '/src/Router.php';
require __DIR__ . '/src/Helpers.php';
require __DIR__ . '/src/Shipments.php';
require __DIR__ . '/src/Settings.php';
require __DIR__ . '/src/handlers.php';

Db::init($config);

$method = $_SERVER['REQUEST_METHOD'];

$uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (php_sapi_name() === 'cli-server') {
  // PHP built-in dev server (php -S): the router script handles every request,
  // and REQUEST_URI is already the route path (optionally prefixed with /api).
  $path = $uriPath;
  if (str_starts_with($path, '/api/')) {
    $path = substr($path, 4);
  } elseif ($path === '/api') {
    $path = '/';
  }
} else {
  // Apache (production): strip this script's directory (e.g. /api) from the URI.
  $base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
  if ($base !== '' && str_starts_with($uriPath, $base)) {
    $path = substr($uriPath, strlen($base));
  } else {
    $path = $uriPath;
  }
}
if ($path === '') $path = '/';

$routes = require __DIR__ . '/src/routes.php';
$match = Router::match($routes, $method, $path);
if ($match === null) {
  Response::send(404, ['error' => 'Not found']);
  exit;
}
[$handler, $params] = $match;

$raw = file_get_contents('php://input');
$input = $raw ? (json_decode($raw, true) ?? []) : [];

$auth = null;
$header = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
if (preg_match('/Bearer\s+(.+)/i', $header, $m)) {
  $auth = Auth::decode(trim($m[1]), $config['jwt_secret']);
}

try {
  $result = $handler(Db::get(), $input, $auth, $params, $config);
} catch (Throwable $e) {
  $result = Response::error(500, 'Server error');
}

Response::send($result['status'], $result['body']);

<?php

class Response
{
  public static function ok($body): array
  {
    return ['status' => 200, 'body' => $body];
  }

  public static function created($body): array
  {
    return ['status' => 201, 'body' => $body];
  }

  public static function error(int $status, string $message): array
  {
    return ['status' => $status, 'body' => ['error' => $message]];
  }

  /**
   * Emit the CORS headers.
   *
   * The site is served from a static host (e.g. posalfast.com on Vercel) while
   * this API runs on PHP hosting (e.g. api.posalfast.com on cPanel). That is a
   * cross-origin setup, so the browser preflights every non-simple request —
   * including the JSON login POST — with an OPTIONS request. Without these
   * headers the login fails in the browser before PHP ever sees it.
   *
   * Authentication uses a Bearer token rather than cookies, so a wildcard
   * origin does not expose credentials. Set 'cors_origin' in config.php to lock
   * this down to your own site if you prefer.
   */
  public static function cors(?string $allowOrigin = '*'): void
  {
    $origin = $allowOrigin ?: '*';
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');
    // Caches/CDNs must key on Origin if the origin is ever restricted.
    header('Vary: Origin');
  }

  /** Emit an HTTP JSON response (used only by the front controller). */
  public static function send(int $status, $body, ?string $allowOrigin = '*'): void
  {
    http_response_code($status);
    self::cors($allowOrigin);
    header('Content-Type: application/json');
    // Dynamic API responses must never be cached (Hostinger/LiteSpeed caches GETs by URL).
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    echo json_encode($body);
  }
}

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

  /** Emit an HTTP JSON response (used only by the front controller). */
  public static function send(int $status, $body): void
  {
    http_response_code($status);
    header('Content-Type: application/json');
    // Dynamic API responses must never be cached (Hostinger/LiteSpeed caches GETs by URL).
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    echo json_encode($body);
  }
}

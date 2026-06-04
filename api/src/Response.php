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
    echo json_encode($body);
  }
}

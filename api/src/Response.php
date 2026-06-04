<?php

class Response
{
  public static function error(int $status, string $message): array
  {
    return ['status' => $status, 'body' => ['error' => $message]];
  }
}

<?php

class Auth
{
  public static function base64urlEncode(string $data): string
  {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
  }

  public static function base64urlDecode(string $data): string
  {
    return base64_decode(strtr($data, '-_', '+/'));
  }

  public static function encode(array $payload, string $secret): string
  {
    $h = self::base64urlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $p = self::base64urlEncode(json_encode($payload));
    $sig = self::base64urlEncode(hash_hmac('sha256', "$h.$p", $secret, true));
    return "$h.$p.$sig";
  }

  public static function decode(string $jwt, string $secret): ?array
  {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) return null;
    [$h, $p, $sig] = $parts;
    $expected = self::base64urlEncode(hash_hmac('sha256', "$h.$p", $secret, true));
    if (!hash_equals($expected, $sig)) return null;
    $payload = json_decode(self::base64urlDecode($p), true);
    if (!is_array($payload)) return null;
    if (isset($payload['exp']) && time() >= (int) $payload['exp']) return null;
    return $payload;
  }

  public static function makeToken(string $username, string $role, string $secret, int $ttl): string
  {
    return self::encode([
      'sub' => $username,
      'role' => $role,
      'iat' => time(),
      'exp' => time() + $ttl,
    ], $secret);
  }
}

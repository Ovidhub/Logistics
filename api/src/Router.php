<?php

class Router
{
  /**
   * @param array $routes list of [method, pattern, handlerName]
   * @return array|null [handlerName, params] or null
   */
  public static function match(array $routes, string $method, string $path): ?array
  {
    $path = '/' . trim($path, '/');
    foreach ($routes as [$m, $pattern, $handler]) {
      if ($m !== $method) continue;
      $params = self::matchPattern($pattern, $path);
      if ($params !== null) return [$handler, $params];
    }
    return null;
  }

  private static function matchPattern(string $pattern, string $path): ?array
  {
    $pattern = '/' . trim($pattern, '/');
    $pSeg = explode('/', $pattern);
    $sSeg = explode('/', $path);
    if (count($pSeg) !== count($sSeg)) return null;

    $params = [];
    for ($i = 0; $i < count($pSeg); $i++) {
      $seg = $pSeg[$i];
      if (strlen($seg) >= 2 && $seg[0] === '{' && substr($seg, -1) === '}') {
        $params[trim($seg, '{}')] = urldecode($sSeg[$i]);
      } elseif ($seg !== $sSeg[$i]) {
        return null;
      }
    }
    return $params;
  }
}

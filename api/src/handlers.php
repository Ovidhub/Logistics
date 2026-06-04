<?php

function handle_login(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  $username = $input['username'] ?? '';
  $password = $input['password'] ?? '';
  if ($username === '' || $password === '') {
    return Response::error(400, 'Username and password are required');
  }
  $stmt = $db->prepare('SELECT * FROM users WHERE username = ?');
  $stmt->execute([$username]);
  $user = $stmt->fetch();
  if (!$user || !password_verify($password, $user['password_hash'])) {
    return Response::error(401, 'Invalid username or password');
  }
  $token = Auth::makeToken($user['username'], $user['role'], $config['jwt_secret'], $config['jwt_ttl']);
  return Response::ok(['token' => $token, 'role' => $user['role']]);
}

function handle_track(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  $shipment = Shipments::findByTracking($db, $params['trackingNumber']);
  if (!$shipment) {
    return Response::error(404, 'No shipment found with this tracking number');
  }
  return Response::ok($shipment);
}

function handle_get_settings(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  return Response::ok(Settings::get($db));
}

function handle_update_settings(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['superadmin'])) return $err;
  Settings::save($db, $input);
  return Response::ok(Settings::get($db));
}

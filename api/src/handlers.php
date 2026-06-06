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
  // Don't expose customer emails on the public tracking endpoint.
  unset($shipment['senderEmail'], $shipment['receiverEmail']);
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

function handle_list_shipments(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['admin', 'superadmin'])) return $err;
  return Response::ok(Shipments::all($db));
}

function handle_create_shipment(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['admin', 'superadmin'])) return $err;
  $required = ['senderName', 'senderAddress', 'senderPhone', 'receiverName', 'receiverAddress', 'receiverPhone', 'senderEmail', 'receiverEmail', 'itemDescription', 'origin', 'destination', 'estimatedDelivery'];
  $missing = Validation::requireFields($input, $required);
  if ($missing) return Response::error(400, 'Missing fields: ' . implode(', ', $missing));
  if (!filter_var($input['senderEmail'], FILTER_VALIDATE_EMAIL)) return Response::error(400, 'Invalid sender email');
  if (!filter_var($input['receiverEmail'], FILTER_VALIDATE_EMAIL)) return Response::error(400, 'Invalid receiver email');
  $status = $input['status'] ?? 'pending';
  if (!Validation::isStatus($status)) return Response::error(400, 'Invalid status');
  $shipment = Shipments::create($db, $input, $status);
  if (!empty($config['mail'])) {
    try { send_shipment_notifications($shipment, $config); }
    catch (\Throwable $e) { error_log('Shipment notify failed: ' . $e->getMessage()); }
  }
  return Response::created($shipment);
}

function handle_update_shipment(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['admin', 'superadmin'])) return $err;
  if (!Shipments::findRow($db, $params['id'])) return Response::error(404, 'Shipment not found');
  if (isset($input['status']) && !Validation::isStatus($input['status'])) return Response::error(400, 'Invalid status');
  Shipments::update($db, $params['id'], $input);
  return Response::ok(Shipments::findApi($db, $params['id']));
}

function handle_delete_shipment(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['admin', 'superadmin'])) return $err;
  if (!Shipments::findRow($db, $params['id'])) return Response::error(404, 'Shipment not found');
  Shipments::delete($db, $params['id']);
  return Response::ok(['deleted' => true]);
}

function handle_update_status(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['admin', 'superadmin'])) return $err;
  if (!Shipments::findRow($db, $params['id'])) return Response::error(404, 'Shipment not found');
  $status = $input['status'] ?? '';
  if (!Validation::isStatus($status)) return Response::error(400, 'Invalid status');
  Shipments::updateStatus($db, $params['id'], $status, $input['location'] ?? '', $input['description'] ?? '');
  return Response::ok(Shipments::findApi($db, $params['id']));
}

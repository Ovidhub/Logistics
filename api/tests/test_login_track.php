<?php
test('login succeeds with valid credentials', function () {
  $db = test_db();
  $res = handle_login($db, ['username' => 'admin', 'password' => 'testpass'], null, [], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_true(!empty($res['body']['token']), 'token present');
  assert_eq('admin', $res['body']['role']);
});

test('login rejects wrong password', function () {
  $db = test_db();
  $res = handle_login($db, ['username' => 'admin', 'password' => 'nope'], null, [], $GLOBALS['test_config']);
  assert_eq(401, $res['status']);
});

test('login rejects missing fields', function () {
  $db = test_db();
  $res = handle_login($db, ['username' => 'admin'], null, [], $GLOBALS['test_config']);
  assert_eq(400, $res['status']);
});

test('issued token decodes with the configured secret', function () {
  $db = test_db();
  $res = handle_login($db, ['username' => 'superadmin', 'password' => 'testpass'], null, [], $GLOBALS['test_config']);
  $payload = Auth::decode($res['body']['token'], $GLOBALS['test_config']['jwt_secret']);
  assert_eq('superadmin', $payload['role']);
});

test('track returns a shipment with camelCase fields and events', function () {
  $db = test_db();
  $res = handle_track($db, [], null, ['trackingNumber' => 'STTEST000001'], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_eq('STTEST000001', $res['body']['trackingNumber']);
  assert_eq('Seattle, WA', $res['body']['destination']);
  assert_eq(2.5, $res['body']['weight']);
  assert_eq(1, count($res['body']['events']));
  assert_eq('Order Placed', $res['body']['events'][0]['status']);
});

test('track returns 404 for unknown number', function () {
  $db = test_db();
  $res = handle_track($db, [], null, ['trackingNumber' => 'NOPE'], $GLOBALS['test_config']);
  assert_eq(404, $res['status']);
});

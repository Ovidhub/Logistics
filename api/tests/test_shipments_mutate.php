<?php
test('update changes fields and requires auth', function () {
  $db = test_db();
  assert_eq(401, handle_update_shipment($db, ['origin' => 'X'], null, ['id' => 'SHIP0001'], $GLOBALS['test_config'])['status']);

  $res = handle_update_shipment($db, ['origin' => 'Denver, CO'], ['role' => 'admin'], ['id' => 'SHIP0001'], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_eq('Denver, CO', $res['body']['origin']);
});

test('update returns 404 for unknown id', function () {
  $db = test_db();
  $res = handle_update_shipment($db, ['origin' => 'X'], ['role' => 'admin'], ['id' => 'NOPE'], $GLOBALS['test_config']);
  assert_eq(404, $res['status']);
});

test('update rejects invalid status', function () {
  $db = test_db();
  $res = handle_update_shipment($db, ['status' => 'flying'], ['role' => 'admin'], ['id' => 'SHIP0001'], $GLOBALS['test_config']);
  assert_eq(400, $res['status']);
});

test('status update appends an event and sets status', function () {
  $db = test_db();
  $res = handle_update_status($db, ['status' => 'delivered', 'location' => 'Seattle, WA', 'description' => 'Done'], ['role' => 'admin'], ['id' => 'SHIP0001'], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_eq('delivered', $res['body']['status']);
  assert_eq(2, count($res['body']['events']));
  assert_eq('Delivered', $res['body']['events'][1]['status']);
});

test('status update rejects invalid status', function () {
  $db = test_db();
  $res = handle_update_status($db, ['status' => 'nope', 'location' => '', 'description' => ''], ['role' => 'admin'], ['id' => 'SHIP0001'], $GLOBALS['test_config']);
  assert_eq(400, $res['status']);
});

test('delete removes the shipment and its events', function () {
  $db = test_db();
  assert_eq(401, handle_delete_shipment($db, [], null, ['id' => 'SHIP0001'], $GLOBALS['test_config'])['status']);

  $res = handle_delete_shipment($db, [], ['role' => 'admin'], ['id' => 'SHIP0001'], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_eq(null, Shipments::findApi($db, 'SHIP0001'));
  assert_eq(0, (int) $db->query('SELECT COUNT(*) AS c FROM tracking_events')->fetch()['c']);
});

test('delete returns 404 for unknown id', function () {
  $db = test_db();
  $res = handle_delete_shipment($db, [], ['role' => 'admin'], ['id' => 'NOPE'], $GLOBALS['test_config']);
  assert_eq(404, $res['status']);
});

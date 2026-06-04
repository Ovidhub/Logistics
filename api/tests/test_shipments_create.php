<?php
function _valid_shipment_input(): array
{
  return [
    'senderName' => 'S', 'senderAddress' => 'A', 'senderPhone' => '1',
    'receiverName' => 'R', 'receiverAddress' => 'B', 'receiverPhone' => '2',
    'itemDescription' => 'Item', 'weight' => 3.5,
    'origin' => 'Portland, OR', 'destination' => 'Seattle, WA',
    'estimatedDelivery' => '2026-07-01',
  ];
}

test('list shipments requires auth', function () {
  $db = test_db();
  assert_eq(401, handle_list_shipments($db, [], null, [], $GLOBALS['test_config'])['status']);
});

test('admin lists seeded shipments', function () {
  $db = test_db();
  $res = handle_list_shipments($db, [], ['role' => 'admin'], [], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_eq(1, count($res['body']));
});

test('create requires auth', function () {
  $db = test_db();
  assert_eq(401, handle_create_shipment($db, _valid_shipment_input(), null, [], $GLOBALS['test_config'])['status']);
});

test('create rejects missing fields with 400', function () {
  $db = test_db();
  $res = handle_create_shipment($db, ['senderName' => 'S'], ['role' => 'admin'], [], $GLOBALS['test_config']);
  assert_eq(400, $res['status']);
});

test('create returns 201 with generated tracking number and first event', function () {
  $db = test_db();
  $res = handle_create_shipment($db, _valid_shipment_input(), ['role' => 'admin'], [], $GLOBALS['test_config']);
  assert_eq(201, $res['status']);
  assert_eq('ST', substr($res['body']['trackingNumber'], 0, 2));
  assert_eq('pending', $res['body']['status']);
  assert_eq(1, count($res['body']['events']));
  assert_eq('Order Placed', $res['body']['events'][0]['status']);
});

test('created shipment appears in the list', function () {
  $db = test_db();
  handle_create_shipment($db, _valid_shipment_input(), ['role' => 'admin'], [], $GLOBALS['test_config']);
  $list = handle_list_shipments($db, [], ['role' => 'admin'], [], $GLOBALS['test_config']);
  assert_eq(2, count($list['body']));
});

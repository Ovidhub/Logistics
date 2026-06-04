<?php
test('test_db seeds two users', function () {
  $db = test_db();
  $n = (int) $db->query('SELECT COUNT(*) AS c FROM users')->fetch()['c'];
  assert_eq(2, $n);
});

test('test_db seeds one shipment with one event', function () {
  $db = test_db();
  assert_eq(1, (int) $db->query('SELECT COUNT(*) AS c FROM shipments')->fetch()['c']);
  assert_eq(1, (int) $db->query('SELECT COUNT(*) AS c FROM tracking_events')->fetch()['c']);
});

test('test_db seeds a settings row', function () {
  $db = test_db();
  $row = $db->query('SELECT data FROM settings WHERE id = 1')->fetch();
  assert_eq('{}', $row['data']);
});

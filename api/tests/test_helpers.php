<?php
test('isStatus accepts valid statuses', function () {
  assert_true(Validation::isStatus('in_transit'));
  assert_true(Validation::isStatus('delivered'));
});

test('isStatus rejects invalid', function () {
  assert_true(!Validation::isStatus('flying'));
  assert_true(!Validation::isStatus(''));
  assert_true(!Validation::isStatus(123));
});

test('requireFields reports missing and blank', function () {
  $missing = Validation::requireFields(['a' => 'x', 'b' => '  '], ['a', 'b', 'c']);
  assert_eq(['b', 'c'], $missing);
});

test('status labels map exists', function () {
  assert_eq('In Transit', Validation::STATUS_LABELS['in_transit']);
});

test('Ids generate produces uppercase of requested length', function () {
  $id = Ids::generate(8);
  assert_eq(8, strlen($id));
  assert_eq($id, strtoupper($id));
});

test('tracking number has ST prefix and length 12', function () {
  $tn = Ids::trackingNumber();
  assert_eq('ST', substr($tn, 0, 2));
  assert_eq(12, strlen($tn));
});

test('require_role allows matching role', function () {
  assert_eq(null, require_role(['role' => 'admin'], ['admin', 'superadmin']));
});

test('require_role rejects missing auth with 401', function () {
  $r = require_role(null, ['admin']);
  assert_eq(401, $r['status']);
});

test('require_role rejects wrong role with 403', function () {
  $r = require_role(['role' => 'admin'], ['superadmin']);
  assert_eq(403, $r['status']);
});

<?php
test('get settings returns an object', function () {
  $db = test_db();
  $res = handle_get_settings($db, [], null, [], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
});

test('update settings requires superadmin (admin gets 403)', function () {
  $db = test_db();
  $res = handle_update_settings($db, ['siteName' => 'X'], ['role' => 'admin'], [], $GLOBALS['test_config']);
  assert_eq(403, $res['status']);
});

test('update settings rejects anonymous with 401', function () {
  $db = test_db();
  $res = handle_update_settings($db, ['siteName' => 'X'], null, [], $GLOBALS['test_config']);
  assert_eq(401, $res['status']);
});

test('superadmin can update and changes persist', function () {
  $db = test_db();
  $res = handle_update_settings($db, ['siteName' => 'NewName'], ['role' => 'superadmin'], [], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  $got = handle_get_settings($db, [], null, [], $GLOBALS['test_config']);
  assert_eq('NewName', $got['body']->siteName);
});

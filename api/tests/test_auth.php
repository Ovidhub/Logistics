<?php
test('jwt round trips', function () {
  $t = Auth::makeToken('admin', 'admin', 'secret', 3600);
  $p = Auth::decode($t, 'secret');
  assert_eq('admin', $p['sub'], 'sub');
  assert_eq('admin', $p['role'], 'role');
});

test('jwt rejects wrong secret', function () {
  $t = Auth::makeToken('admin', 'admin', 'secret', 3600);
  assert_eq(null, Auth::decode($t, 'other-secret'), 'tampered/wrong secret');
});

test('jwt rejects malformed token', function () {
  assert_eq(null, Auth::decode('not.a.jwt.token', 'secret'));
  assert_eq(null, Auth::decode('garbage', 'secret'));
});

test('jwt rejects expired token', function () {
  $t = Auth::encode(['sub' => 'a', 'exp' => time() - 1], 'secret');
  assert_eq(null, Auth::decode($t, 'secret'));
});

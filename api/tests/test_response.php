<?php
test('Response::ok wraps body with 200', function () {
  $r = Response::ok(['x' => 1]);
  assert_eq(200, $r['status']);
  assert_eq(['x' => 1], $r['body']);
});

test('Response::created uses 201', function () {
  assert_eq(201, Response::created(['id' => 'A'])['status']);
});

test('Response::error shapes an error body', function () {
  $r = Response::error(404, 'nope');
  assert_eq(404, $r['status']);
  assert_eq(['error' => 'nope'], $r['body']);
});

test('Db::get throws before init', function () {
  Db::reset();
  $threw = false;
  try { Db::get(); } catch (Throwable $e) { $threw = true; }
  assert_true($threw, 'expected exception when DB not initialized');
});

test('Db::set then get returns the PDO', function () {
  $pdo = new PDO('sqlite::memory:');
  Db::set($pdo);
  assert_true(Db::get() === $pdo);
  Db::reset();
});

<?php
test('router matches a literal route', function () {
  $routes = [['GET', '/settings', 'handle_get_settings']];
  $m = Router::match($routes, 'GET', '/settings');
  assert_eq('handle_get_settings', $m[0]);
  assert_eq([], $m[1]);
});

test('router extracts a path param', function () {
  $routes = [['GET', '/track/{trackingNumber}', 'handle_track']];
  $m = Router::match($routes, 'GET', '/track/STX7B9K2M4P1');
  assert_eq('handle_track', $m[0]);
  assert_eq('STX7B9K2M4P1', $m[1]['trackingNumber']);
});

test('router respects method', function () {
  $routes = [['GET', '/shipments', 'list'], ['POST', '/shipments', 'create']];
  assert_eq('create', Router::match($routes, 'POST', '/shipments')[0]);
});

test('router returns null when nothing matches', function () {
  $routes = [['GET', '/x', 'h']];
  assert_eq(null, Router::match($routes, 'POST', '/x'));
  assert_eq(null, Router::match($routes, 'GET', '/y'));
});

test('router does not match different segment counts', function () {
  $routes = [['GET', '/shipments/{id}', 'h']];
  assert_eq(null, Router::match($routes, 'GET', '/shipments/1/status'));
});

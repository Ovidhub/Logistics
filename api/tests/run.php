<?php
require __DIR__ . '/bootstrap.php';

$GLOBALS['__tests'] = [];
function test(string $name, callable $fn): void { $GLOBALS['__tests'][] = [$name, $fn]; }
function assert_eq($expected, $actual, string $msg = ''): void {
  if ($expected !== $actual) {
    throw new Exception("Assertion failed: $msg\n  expected: " . var_export($expected, true) . "\n  actual:   " . var_export($actual, true));
  }
}
function assert_true($cond, string $msg = ''): void {
  if (!$cond) throw new Exception("Assertion failed: $msg");
}

foreach (glob(__DIR__ . '/test_*.php') as $f) require $f;

$pass = 0; $fail = 0;
foreach ($GLOBALS['__tests'] as [$name, $fn]) {
  try { $fn(); echo "PASS  $name\n"; $pass++; }
  catch (Throwable $e) { echo "FAIL  $name\n      " . $e->getMessage() . "\n"; $fail++; }
}
echo "\n$pass passed, $fail failed\n";
exit($fail === 0 ? 0 : 1);

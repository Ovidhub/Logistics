<?php
// Usage: php api/tools/make_hash.php "your-password"
// Prints a bcrypt hash suitable for the users.password_hash column.
$pw = $argv[1] ?? '';
if ($pw === '') {
  fwrite(STDERR, "Usage: php make_hash.php \"your-password\"\n");
  exit(1);
}
echo password_hash($pw, PASSWORD_BCRYPT), PHP_EOL;

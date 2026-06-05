<?php
return [
  'db' => [
    'dsn'  => 'mysql:host=localhost;dbname=YOUR_DB_NAME;charset=utf8mb4',
    'user' => 'YOUR_DB_USER',
    'pass' => 'YOUR_DB_PASSWORD',
  ],
  // Generate a long random string, e.g. with: php -r "echo bin2hex(random_bytes(32));"
  'jwt_secret' => 'CHANGE_ME_to_a_long_random_secret',
  'jwt_ttl'    => 43200, // token lifetime in seconds (12 hours)
];

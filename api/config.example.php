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

  // CORS. The website is on a different host from this API (for example
  // posalfast.com on Vercel, api.posalfast.com on cPanel), so browsers
  // preflight every login. '*' is safe here because auth uses a Bearer token,
  // not cookies. To lock it to your own site, use e.g.
  //   'cors_origin' => 'https://posalfast.com',
  'cors_origin' => '*',

  // Email notifications (optional). Leave 'host' empty to disable sending.
  'mail' => [
    'host'      => 'mail.posalfast.com',
    'port'      => 465,
    'secure'    => 'ssl', // 'ssl' (port 465) or 'tls' (port 587)
    'user'      => 'no-reply@posalfast.com',
    'pass'      => 'YOUR_MAILBOX_PASSWORD',
    'from_name' => 'Posalfast Logistics',
    'site_url'  => 'https://posalfast.com',
  ],
];

<?php
require __DIR__ . '/../src/Auth.php';
require __DIR__ . '/../src/Router.php';
require __DIR__ . '/../src/Response.php';
require __DIR__ . '/../src/Helpers.php';

$GLOBALS['test_config'] = ['jwt_secret' => 'test-secret', 'jwt_ttl' => 3600];

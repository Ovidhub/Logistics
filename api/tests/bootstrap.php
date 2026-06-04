<?php
require __DIR__ . '/../src/Auth.php';

$GLOBALS['test_config'] = ['jwt_secret' => 'test-secret', 'jwt_ttl' => 3600];

# PHP + MySQL Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the front-end-only prototype (localStorage + hardcoded client credentials) with a real PHP REST API backed by MySQL, with token (JWT) authentication, deployable to Hostinger shared hosting.

**Architecture:** A PHP front controller (`api/index.php`) routes `/api/*` requests to handler functions. Handlers are pure functions `(PDO, input, auth, params, config) -> ['status', 'body']`, so they are fully testable with an injected PDO. Production uses MySQL; tests run against an in-memory SQLite database using portable SQL. The React frontend calls `/api/*` (same origin, no CORS) via a small `api.ts` client, storing the JWT in `localStorage`.

**Tech Stack:** PHP 8.3 (PDO, `password_hash`, `hash_hmac`), MySQL 8 (InnoDB, utf8mb4), SQLite (tests only), React 19 + TypeScript + Vite.

---

## File Structure

**Backend (new):**
- `api/config.example.php` — config template (committed)
- `api/config.php` — real config (gitignored)
- `api/schema.sql` — MySQL production schema + seed
- `api/index.php` — front controller (HTTP glue only)
- `api/.htaccess` — rewrite all requests to index.php + pass Authorization header
- `api/src/Db.php` — PDO provider (init/set/get)
- `api/src/Response.php` — response builders + emitter
- `api/src/Auth.php` — JWT encode/decode, token creation
- `api/src/Router.php` — pure path matcher
- `api/src/Helpers.php` — `Validation`, `Ids`, `require_role()`
- `api/src/Shipments.php` — shipment + event repository and DB↔API mapping
- `api/src/Settings.php` — settings repository
- `api/src/handlers.php` — request handler functions
- `api/src/routes.php` — routes table (data)
- `api/tools/make_hash.php` — CLI to generate a bcrypt hash for seeding users
- `api/tests/run.php` — test runner
- `api/tests/bootstrap.php` — loads src, builds seeded in-memory SQLite DB
- `api/tests/schema.test.sql` — SQLite schema (portable mirror of schema.sql)
- `api/tests/test_*.php` — test files

**Frontend (modified):**
- `src/utils/api.ts` — NEW: fetch client + token storage
- `src/hooks/useShipments.ts` — rewritten to call the API
- `src/hooks/useSettings.tsx` — rewritten to call the API
- `src/pages/AdminLogin.tsx` — calls `/auth/login`, stores token, demo box removed
- `src/pages/SuperAdminLogin.tsx` — same, requires superadmin role
- `src/pages/AdminPage.tsx` — async handlers, loads list on mount
- `src/pages/SuperAdminPage.tsx` — async save/reset
- `src/pages/TrackPage.tsx` — async tracking lookup
- `src/App.tsx` — auth state derived from stored token
- `vite.config.ts` — drop single-file plugin (standard build)
- `.env.example` — NEW: documents `VITE_API_URL`

**Root (modified):**
- `.gitignore` — ignore `api/config.php`, `*.sqlite`
- `DEPLOY.md` — NEW: Hostinger deployment steps
- `README.md` — update to describe the backend

---

## Task 1: Test harness + JWT auth

**Files:**
- Create: `api/src/Auth.php`
- Create: `api/tests/bootstrap.php`
- Create: `api/tests/run.php`
- Create: `api/tests/test_auth.php`

- [ ] **Step 1: Write the failing test**

Create `api/tests/run.php`:

```php
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
```

Create `api/tests/bootstrap.php`:

```php
<?php
require __DIR__ . '/../src/Auth.php';

$GLOBALS['test_config'] = ['jwt_secret' => 'test-secret', 'jwt_ttl' => 3600];
```

Create `api/tests/test_auth.php`:

```php
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php api/tests/run.php`
Expected: FAIL — `Class "Auth" not found` (and the run exits non-zero).

- [ ] **Step 3: Write minimal implementation**

Create `api/src/Auth.php`:

```php
<?php

class Auth
{
  public static function base64urlEncode(string $data): string
  {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
  }

  public static function base64urlDecode(string $data): string
  {
    return base64_decode(strtr($data, '-_', '+/'));
  }

  public static function encode(array $payload, string $secret): string
  {
    $h = self::base64urlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $p = self::base64urlEncode(json_encode($payload));
    $sig = self::base64urlEncode(hash_hmac('sha256', "$h.$p", $secret, true));
    return "$h.$p.$sig";
  }

  public static function decode(string $jwt, string $secret): ?array
  {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) return null;
    [$h, $p, $sig] = $parts;
    $expected = self::base64urlEncode(hash_hmac('sha256', "$h.$p", $secret, true));
    if (!hash_equals($expected, $sig)) return null;
    $payload = json_decode(self::base64urlDecode($p), true);
    if (!is_array($payload)) return null;
    if (isset($payload['exp']) && time() >= (int) $payload['exp']) return null;
    return $payload;
  }

  public static function makeToken(string $username, string $role, string $secret, int $ttl): string
  {
    return self::encode([
      'sub' => $username,
      'role' => $role,
      'iat' => time(),
      'exp' => time() + $ttl,
    ], $secret);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php api/tests/run.php`
Expected: PASS — `4 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add api/src/Auth.php api/tests/
git commit -m "feat(api): JWT auth + PHP test harness"
```

---

## Task 2: Router

**Files:**
- Create: `api/src/Router.php`
- Modify: `api/tests/bootstrap.php`
- Create: `api/tests/test_router.php`

- [ ] **Step 1: Write the failing test**

Add to `api/tests/bootstrap.php` (after the `Auth.php` require):

```php
require __DIR__ . '/../src/Router.php';
```

Create `api/tests/test_router.php`:

```php
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php api/tests/run.php`
Expected: FAIL — `Class "Router" not found`.

- [ ] **Step 3: Write minimal implementation**

Create `api/src/Router.php`:

```php
<?php

class Router
{
  /**
   * @param array $routes list of [method, pattern, handlerName]
   * @return array|null [handlerName, params] or null
   */
  public static function match(array $routes, string $method, string $path): ?array
  {
    $path = '/' . trim($path, '/');
    foreach ($routes as [$m, $pattern, $handler]) {
      if ($m !== $method) continue;
      $params = self::matchPattern($pattern, $path);
      if ($params !== null) return [$handler, $params];
    }
    return null;
  }

  private static function matchPattern(string $pattern, string $path): ?array
  {
    $pattern = '/' . trim($pattern, '/');
    $pSeg = explode('/', $pattern);
    $sSeg = explode('/', $path);
    if (count($pSeg) !== count($sSeg)) return null;

    $params = [];
    for ($i = 0; $i < count($pSeg); $i++) {
      $seg = $pSeg[$i];
      if (strlen($seg) >= 2 && $seg[0] === '{' && substr($seg, -1) === '}') {
        $params[trim($seg, '{}')] = urldecode($sSeg[$i]);
      } elseif ($seg !== $sSeg[$i]) {
        return null;
      }
    }
    return $params;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php api/tests/run.php`
Expected: PASS — `9 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add api/src/Router.php api/tests/bootstrap.php api/tests/test_router.php
git commit -m "feat(api): pure path router"
```

---

## Task 3: Helpers (validation, ids, role guard)

**Files:**
- Create: `api/src/Helpers.php`
- Modify: `api/tests/bootstrap.php`
- Create: `api/tests/test_helpers.php`

- [ ] **Step 1: Write the failing test**

Add to `api/tests/bootstrap.php`:

```php
require __DIR__ . '/../src/Response.php';
require __DIR__ . '/../src/Helpers.php';
```

> Note: `Helpers.php` uses `Response`, so `Response.php` must be required first. `Response.php` is created in Task 4; create the require line now and add the file in Task 4. To keep this task runnable, also create a minimal `api/src/Response.php` stub here that Task 4 will flesh out:

Create `api/src/Response.php` (minimal, expanded in Task 4):

```php
<?php

class Response
{
  public static function error(int $status, string $message): array
  {
    return ['status' => $status, 'body' => ['error' => $message]];
  }
}
```

Create `api/tests/test_helpers.php`:

```php
<?php
test('isStatus accepts valid statuses', function () {
  assert_true(Validation::isStatus('in_transit'));
  assert_true(Validation::isStatus('delivered'));
});

test('isStatus rejects invalid', function () {
  assert_true(!Validation::isStatus('flying'));
  assert_true(!Validation::isStatus(''));
  assert_true(!Validation::isStatus(123));
});

test('requireFields reports missing and blank', function () {
  $missing = Validation::requireFields(['a' => 'x', 'b' => '  '], ['a', 'b', 'c']);
  assert_eq(['b', 'c'], $missing);
});

test('status labels map exists', function () {
  assert_eq('In Transit', Validation::STATUS_LABELS['in_transit']);
});

test('Ids generate produces uppercase of requested length', function () {
  $id = Ids::generate(8);
  assert_eq(8, strlen($id));
  assert_eq($id, strtoupper($id));
});

test('tracking number has ST prefix and length 12', function () {
  $tn = Ids::trackingNumber();
  assert_eq('ST', substr($tn, 0, 2));
  assert_eq(12, strlen($tn));
});

test('require_role allows matching role', function () {
  assert_eq(null, require_role(['role' => 'admin'], ['admin', 'superadmin']));
});

test('require_role rejects missing auth with 401', function () {
  $r = require_role(null, ['admin']);
  assert_eq(401, $r['status']);
});

test('require_role rejects wrong role with 403', function () {
  $r = require_role(['role' => 'admin'], ['superadmin']);
  assert_eq(403, $r['status']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php api/tests/run.php`
Expected: FAIL — `Class "Validation" not found`.

- [ ] **Step 3: Write minimal implementation**

Create `api/src/Helpers.php`:

```php
<?php

class Validation
{
  const STATUSES = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'cancelled'];

  const STATUS_LABELS = [
    'pending' => 'Pending',
    'picked_up' => 'Picked Up',
    'in_transit' => 'In Transit',
    'out_for_delivery' => 'Out for Delivery',
    'delivered' => 'Delivered',
    'returned' => 'Returned',
    'cancelled' => 'Cancelled',
  ];

  public static function isStatus($v): bool
  {
    return is_string($v) && in_array($v, self::STATUSES, true);
  }

  /** @return string[] names of fields that are absent or blank */
  public static function requireFields(array $data, array $fields): array
  {
    $missing = [];
    foreach ($fields as $f) {
      if (!isset($data[$f]) || (is_string($data[$f]) && trim($data[$f]) === '')) {
        $missing[] = $f;
      }
    }
    return $missing;
  }
}

class Ids
{
  public static function generate(int $len = 8): string
  {
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $s = '';
    for ($i = 0; $i < $len; $i++) {
      $s .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $s;
  }

  public static function trackingNumber(): string
  {
    return 'ST' . self::generate(10);
  }
}

/**
 * Returns a Response error array if the auth payload is missing or lacks an
 * allowed role; returns null when access is permitted.
 */
function require_role(?array $auth, array $roles): ?array
{
  if ($auth === null) return Response::error(401, 'Authentication required');
  if (!in_array($auth['role'] ?? '', $roles, true)) return Response::error(403, 'Forbidden');
  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php api/tests/run.php`
Expected: PASS — `18 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add api/src/Helpers.php api/src/Response.php api/tests/
git commit -m "feat(api): validation, id generation, role guard"
```

---

## Task 4: Response builders + Db provider

**Files:**
- Modify: `api/src/Response.php`
- Create: `api/src/Db.php`
- Modify: `api/tests/bootstrap.php`
- Create: `api/tests/test_response.php`

- [ ] **Step 1: Write the failing test**

Add to `api/tests/bootstrap.php`:

```php
require __DIR__ . '/../src/Db.php';
```

Create `api/tests/test_response.php`:

```php
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php api/tests/run.php`
Expected: FAIL — `Call to undefined method Response::ok()` / `Class "Db" not found`.

- [ ] **Step 3: Write minimal implementation**

Replace `api/src/Response.php` with:

```php
<?php

class Response
{
  public static function ok($body): array
  {
    return ['status' => 200, 'body' => $body];
  }

  public static function created($body): array
  {
    return ['status' => 201, 'body' => $body];
  }

  public static function error(int $status, string $message): array
  {
    return ['status' => $status, 'body' => ['error' => $message]];
  }

  /** Emit an HTTP JSON response (used only by the front controller). */
  public static function send(int $status, $body): void
  {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($body);
  }
}
```

Create `api/src/Db.php`:

```php
<?php

class Db
{
  private static ?PDO $pdo = null;

  public static function init(array $config): void
  {
    self::$pdo = new PDO(
      $config['db']['dsn'],
      $config['db']['user'],
      $config['db']['pass'],
      [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      ]
    );
  }

  public static function set(PDO $pdo): void
  {
    self::$pdo = $pdo;
  }

  public static function get(): PDO
  {
    if (self::$pdo === null) {
      throw new RuntimeException('Database not initialized');
    }
    return self::$pdo;
  }

  public static function reset(): void
  {
    self::$pdo = null;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php api/tests/run.php`
Expected: PASS — `23 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add api/src/Response.php api/src/Db.php api/tests/
git commit -m "feat(api): response builders and PDO provider"
```

---

## Task 5: Database schema + seeded test DB

**Files:**
- Create: `api/schema.sql` (MySQL, production)
- Create: `api/tests/schema.test.sql` (SQLite, tests)
- Modify: `api/tests/bootstrap.php` (add `test_db()`)
- Create: `api/tests/test_schema.php`

- [ ] **Step 1: Write the failing test**

Add to `api/tests/bootstrap.php`, at the end:

```php
function test_db(): PDO
{
  $pdo = new PDO('sqlite::memory:');
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  $pdo->exec(file_get_contents(__DIR__ . '/schema.test.sql'));

  $pdo->prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')
      ->execute(['admin', password_hash('testpass', PASSWORD_BCRYPT), 'admin']);
  $pdo->prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')
      ->execute(['superadmin', password_hash('testpass', PASSWORD_BCRYPT), 'superadmin']);

  $pdo->prepare('INSERT INTO shipments (id, tracking_number, sender_name, sender_address, sender_phone, receiver_name, receiver_address, receiver_phone, item_description, weight, origin, destination, status, estimated_delivery, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
      ->execute(['SHIP0001', 'STTEST000001', 'Acme', '1 A St', '111', 'Bob', '2 B St', '222', 'Box', 2.5, 'Portland, OR', 'Seattle, WA', 'in_transit', '2026-06-10', '2026-06-01 10:00:00']);
  $pdo->prepare('INSERT INTO tracking_events (id, shipment_id, status, location, timestamp, description) VALUES (?,?,?,?,?,?)')
      ->execute(['EVT00001', 'SHIP0001', 'Order Placed', 'Portland, OR', '2026-06-01 10:00:00', 'Registered']);

  $pdo->exec("INSERT INTO settings (id, data) VALUES (1, '{}')");
  return $pdo;
}
```

Create `api/tests/test_schema.php`:

```php
<?php
test('test_db seeds two users', function () {
  $db = test_db();
  $n = (int) $db->query('SELECT COUNT(*) AS c FROM users')->fetch()['c'];
  assert_eq(2, $n);
});

test('test_db seeds one shipment with one event', function () {
  $db = test_db();
  assert_eq(1, (int) $db->query('SELECT COUNT(*) AS c FROM shipments')->fetch()['c']);
  assert_eq(1, (int) $db->query('SELECT COUNT(*) AS c FROM tracking_events')->fetch()['c']);
});

test('test_db seeds a settings row', function () {
  $db = test_db();
  $row = $db->query('SELECT data FROM settings WHERE id = 1')->fetch();
  assert_eq('{}', $row['data']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php api/tests/run.php`
Expected: FAIL — `failed to open stream` / no such file `schema.test.sql`.

- [ ] **Step 3: Write minimal implementation**

Create `api/tests/schema.test.sql` (SQLite — portable types):

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shipments (
  id TEXT PRIMARY KEY,
  tracking_number TEXT NOT NULL UNIQUE,
  sender_name TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_phone TEXT NOT NULL,
  item_description TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 0,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  estimated_delivery TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE tracking_events (
  id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL,
  status TEXT NOT NULL,
  location TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE settings (
  id INTEGER PRIMARY KEY,
  data TEXT NOT NULL
);
```

Create `api/schema.sql` (MySQL — production). The seeded user password hashes are placeholders; `DEPLOY.md` explains generating real ones with `api/tools/make_hash.php`:

```sql
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','superadmin') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS shipments (
  id VARCHAR(16) PRIMARY KEY,
  tracking_number VARCHAR(20) NOT NULL UNIQUE,
  sender_name VARCHAR(120) NOT NULL,
  sender_address VARCHAR(255) NOT NULL,
  sender_phone VARCHAR(40) NOT NULL,
  receiver_name VARCHAR(120) NOT NULL,
  receiver_address VARCHAR(255) NOT NULL,
  receiver_phone VARCHAR(40) NOT NULL,
  item_description VARCHAR(255) NOT NULL,
  weight DECIMAL(10,2) NOT NULL DEFAULT 0,
  origin VARCHAR(120) NOT NULL,
  destination VARCHAR(120) NOT NULL,
  status ENUM('pending','picked_up','in_transit','out_for_delivery','delivered','returned','cancelled') NOT NULL DEFAULT 'pending',
  estimated_delivery DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tracking_events (
  id VARCHAR(16) PRIMARY KEY,
  shipment_id VARCHAR(16) NOT NULL,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(120) NOT NULL,
  timestamp DATETIME NOT NULL,
  description VARCHAR(255) NOT NULL,
  CONSTRAINT fk_events_shipment FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS settings (
  id TINYINT PRIMARY KEY,
  data LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Site settings (empty object; the frontend merges with its defaults).
INSERT INTO settings (id, data) VALUES (1, '{}')
  ON DUPLICATE KEY UPDATE data = data;

-- Seed admin accounts. REPLACE the hashes below using:
--   php api/tools/make_hash.php "your-password"
-- (The two placeholders correspond to the admin and superadmin accounts.)
INSERT INTO users (username, password_hash, role) VALUES
  ('admin',      '$2y$10$REPLACE_THIS_ADMIN_HASH______________________________', 'admin'),
  ('superadmin', '$2y$10$REPLACE_THIS_SUPERADMIN_HASH_________________________', 'superadmin')
  ON DUPLICATE KEY UPDATE username = username;

-- Demo shipments so the deployed site is populated. Safe to delete later.
INSERT INTO shipments (id, tracking_number, sender_name, sender_address, sender_phone, receiver_name, receiver_address, receiver_phone, item_description, weight, origin, destination, status, estimated_delivery, created_at) VALUES
 ('DEMO0001', 'STX7B9K2M4P1', 'Acme Electronics Ltd', '123 Industrial Way, Portland, OR 97201', '+1 (503) 555-0123', 'Sarah Johnson', '456 Maple Avenue, Seattle, WA 98101', '+1 (206) 555-0456', 'Laptop Computer - Dell XPS 15', 3.20, 'Portland, OR', 'Seattle, WA', 'in_transit', '2026-06-06', '2026-06-01 09:00:00'),
 ('DEMO0002', 'STQ3W8N5R7T2', 'Global Furniture Co', '789 Warehouse Blvd, Chicago, IL 60601', '+1 (312) 555-0789', 'Michael Chen', '321 Oak Street, San Francisco, CA 94102', '+1 (415) 555-0321', 'Dining Table Set - 6 Chairs', 45.00, 'Chicago, IL', 'San Francisco, CA', 'out_for_delivery', '2026-06-04', '2026-06-02 09:00:00'),
 ('DEMO0003', 'STY6P2L9K3M8', 'Fresh Foods Market', '555 Farm Road, Austin, TX 78701', '+1 (512) 555-0555', 'Emily Rodriguez', '888 Sunset Drive, Miami, FL 33101', '+1 (305) 555-0888', 'Organic Produce Box - 20 lbs', 20.50, 'Austin, TX', 'Miami, FL', 'delivered', '2026-06-03', '2026-06-01 09:00:00')
 ON DUPLICATE KEY UPDATE tracking_number = tracking_number;

INSERT INTO tracking_events (id, shipment_id, status, location, timestamp, description) VALUES
 ('DEVT0001', 'DEMO0001', 'Order Placed', 'Portland, OR', '2026-06-01 09:00:00', 'Shipment has been registered in our system'),
 ('DEVT0002', 'DEMO0001', 'In Transit', 'Tacoma, WA', '2026-06-03 14:00:00', 'Package is on its way to the destination'),
 ('DEVT0003', 'DEMO0002', 'Order Placed', 'Chicago, IL', '2026-06-02 09:00:00', 'Shipment has been registered in our system'),
 ('DEVT0004', 'DEMO0002', 'Out for Delivery', 'San Francisco, CA', '2026-06-04 08:00:00', 'Package is out for delivery today'),
 ('DEVT0005', 'DEMO0003', 'Order Placed', 'Austin, TX', '2026-06-01 09:00:00', 'Shipment has been registered in our system'),
 ('DEVT0006', 'DEMO0003', 'Delivered', 'Miami, FL', '2026-06-03 16:00:00', 'Package has been delivered successfully')
 ON DUPLICATE KEY UPDATE shipment_id = shipment_id;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php api/tests/run.php`
Expected: PASS — `26 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add api/schema.sql api/tests/schema.test.sql api/tests/bootstrap.php api/tests/test_schema.php
git commit -m "feat(api): MySQL schema, portable test schema, seeded test DB"
```

---

## Task 6: Repositories + login & track handlers

**Files:**
- Create: `api/src/Shipments.php`
- Create: `api/src/Settings.php`
- Create: `api/src/handlers.php`
- Modify: `api/tests/bootstrap.php`
- Create: `api/tests/test_login_track.php`

- [ ] **Step 1: Write the failing test**

Add to `api/tests/bootstrap.php`:

```php
require __DIR__ . '/../src/Shipments.php';
require __DIR__ . '/../src/Settings.php';
require __DIR__ . '/../src/handlers.php';
```

Create `api/tests/test_login_track.php`:

```php
<?php
test('login succeeds with valid credentials', function () {
  $db = test_db();
  $res = handle_login($db, ['username' => 'admin', 'password' => 'testpass'], null, [], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_true(!empty($res['body']['token']), 'token present');
  assert_eq('admin', $res['body']['role']);
});

test('login rejects wrong password', function () {
  $db = test_db();
  $res = handle_login($db, ['username' => 'admin', 'password' => 'nope'], null, [], $GLOBALS['test_config']);
  assert_eq(401, $res['status']);
});

test('login rejects missing fields', function () {
  $db = test_db();
  $res = handle_login($db, ['username' => 'admin'], null, [], $GLOBALS['test_config']);
  assert_eq(400, $res['status']);
});

test('issued token decodes with the configured secret', function () {
  $db = test_db();
  $res = handle_login($db, ['username' => 'superadmin', 'password' => 'testpass'], null, [], $GLOBALS['test_config']);
  $payload = Auth::decode($res['body']['token'], $GLOBALS['test_config']['jwt_secret']);
  assert_eq('superadmin', $payload['role']);
});

test('track returns a shipment with camelCase fields and events', function () {
  $db = test_db();
  $res = handle_track($db, [], null, ['trackingNumber' => 'STTEST000001'], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_eq('STTEST000001', $res['body']['trackingNumber']);
  assert_eq('Seattle, WA', $res['body']['destination']);
  assert_eq(2.5, $res['body']['weight']);
  assert_eq(1, count($res['body']['events']));
  assert_eq('Order Placed', $res['body']['events'][0]['status']);
});

test('track returns 404 for unknown number', function () {
  $db = test_db();
  $res = handle_track($db, [], null, ['trackingNumber' => 'NOPE'], $GLOBALS['test_config']);
  assert_eq(404, $res['status']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php api/tests/run.php`
Expected: FAIL — `Call to undefined function handle_login()`.

- [ ] **Step 3: Write minimal implementation**

Create `api/src/Shipments.php`:

```php
<?php

class Shipments
{
  const FIELD_MAP = [
    'senderName' => 'sender_name',
    'senderAddress' => 'sender_address',
    'senderPhone' => 'sender_phone',
    'receiverName' => 'receiver_name',
    'receiverAddress' => 'receiver_address',
    'receiverPhone' => 'receiver_phone',
    'itemDescription' => 'item_description',
    'weight' => 'weight',
    'origin' => 'origin',
    'destination' => 'destination',
    'status' => 'status',
    'estimatedDelivery' => 'estimated_delivery',
  ];

  public static function eventToApi(array $e): array
  {
    return [
      'id' => $e['id'],
      'status' => $e['status'],
      'location' => $e['location'],
      'timestamp' => $e['timestamp'],
      'description' => $e['description'],
    ];
  }

  public static function rowToApi(array $r, array $events): array
  {
    return [
      'id' => $r['id'],
      'trackingNumber' => $r['tracking_number'],
      'senderName' => $r['sender_name'],
      'senderAddress' => $r['sender_address'],
      'senderPhone' => $r['sender_phone'],
      'receiverName' => $r['receiver_name'],
      'receiverAddress' => $r['receiver_address'],
      'receiverPhone' => $r['receiver_phone'],
      'itemDescription' => $r['item_description'],
      'weight' => (float) $r['weight'],
      'origin' => $r['origin'],
      'destination' => $r['destination'],
      'status' => $r['status'],
      'estimatedDelivery' => $r['estimated_delivery'],
      'createdAt' => $r['created_at'],
      'events' => array_map([self::class, 'eventToApi'], $events),
    ];
  }

  public static function eventsFor(PDO $db, string $shipmentId): array
  {
    $stmt = $db->prepare('SELECT * FROM tracking_events WHERE shipment_id = ? ORDER BY timestamp ASC, id ASC');
    $stmt->execute([$shipmentId]);
    return $stmt->fetchAll();
  }

  public static function findRow(PDO $db, string $id): ?array
  {
    $stmt = $db->prepare('SELECT * FROM shipments WHERE id = ?');
    $stmt->execute([$id]);
    $r = $stmt->fetch();
    return $r ?: null;
  }

  public static function findApi(PDO $db, string $id): ?array
  {
    $row = self::findRow($db, $id);
    return $row ? self::rowToApi($row, self::eventsFor($db, $id)) : null;
  }

  public static function findByTracking(PDO $db, string $tn): ?array
  {
    $stmt = $db->prepare('SELECT * FROM shipments WHERE tracking_number = ?');
    $stmt->execute([$tn]);
    $r = $stmt->fetch();
    return $r ? self::rowToApi($r, self::eventsFor($db, $r['id'])) : null;
  }

  public static function all(PDO $db): array
  {
    $rows = $db->query('SELECT * FROM shipments ORDER BY created_at DESC, id DESC')->fetchAll();
    return array_map(fn($r) => self::rowToApi($r, self::eventsFor($db, $r['id'])), $rows);
  }

  public static function addEvent(PDO $db, string $shipmentId, string $status, string $location, string $description, ?string $ts = null): void
  {
    $ts = $ts ?? gmdate('Y-m-d H:i:s');
    $db->prepare('INSERT INTO tracking_events (id, shipment_id, status, location, timestamp, description) VALUES (?,?,?,?,?,?)')
       ->execute([Ids::generate(), $shipmentId, $status, $location, $ts, $description]);
  }

  public static function create(PDO $db, array $input, string $status): array
  {
    $id = Ids::generate();
    $tn = Ids::trackingNumber();
    $now = gmdate('Y-m-d H:i:s');
    $db->prepare('INSERT INTO shipments (id, tracking_number, sender_name, sender_address, sender_phone, receiver_name, receiver_address, receiver_phone, item_description, weight, origin, destination, status, estimated_delivery, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
       ->execute([
         $id, $tn,
         $input['senderName'], $input['senderAddress'], $input['senderPhone'],
         $input['receiverName'], $input['receiverAddress'], $input['receiverPhone'],
         $input['itemDescription'], (float) ($input['weight'] ?? 0),
         $input['origin'], $input['destination'], $status, $input['estimatedDelivery'], $now,
       ]);
    self::addEvent($db, $id, 'Order Placed', $input['origin'], 'Shipment has been registered in our system', $now);
    return self::findApi($db, $id);
  }

  public static function update(PDO $db, string $id, array $input): void
  {
    $sets = [];
    $vals = [];
    foreach (self::FIELD_MAP as $camel => $col) {
      if (array_key_exists($camel, $input)) {
        $sets[] = "$col = ?";
        $vals[] = $camel === 'weight' ? (float) $input[$camel] : $input[$camel];
      }
    }
    if (!$sets) return;
    $vals[] = $id;
    $db->prepare('UPDATE shipments SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($vals);
  }

  public static function updateStatus(PDO $db, string $id, string $status, string $location, string $description): void
  {
    $db->prepare('UPDATE shipments SET status = ? WHERE id = ?')->execute([$status, $id]);
    self::addEvent($db, $id, Validation::STATUS_LABELS[$status], $location, $description);
  }

  public static function delete(PDO $db, string $id): void
  {
    $db->prepare('DELETE FROM tracking_events WHERE shipment_id = ?')->execute([$id]);
    $db->prepare('DELETE FROM shipments WHERE id = ?')->execute([$id]);
  }
}
```

Create `api/src/Settings.php`:

```php
<?php

class Settings
{
  /** @return mixed decoded settings (object), or empty object */
  public static function get(PDO $db)
  {
    $row = $db->query('SELECT data FROM settings WHERE id = 1')->fetch();
    $json = $row ? $row['data'] : '{}';
    $decoded = json_decode($json);
    return $decoded === null ? new stdClass() : $decoded;
  }

  public static function save(PDO $db, $data): void
  {
    $json = json_encode($data);
    $exists = $db->query('SELECT 1 FROM settings WHERE id = 1')->fetch();
    if ($exists) {
      $db->prepare('UPDATE settings SET data = ? WHERE id = 1')->execute([$json]);
    } else {
      $db->prepare('INSERT INTO settings (id, data) VALUES (1, ?)')->execute([$json]);
    }
  }
}
```

Create `api/src/handlers.php` (login + track now; remaining handlers added in later tasks):

```php
<?php

function handle_login(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  $username = $input['username'] ?? '';
  $password = $input['password'] ?? '';
  if ($username === '' || $password === '') {
    return Response::error(400, 'Username and password are required');
  }
  $stmt = $db->prepare('SELECT * FROM users WHERE username = ?');
  $stmt->execute([$username]);
  $user = $stmt->fetch();
  if (!$user || !password_verify($password, $user['password_hash'])) {
    return Response::error(401, 'Invalid username or password');
  }
  $token = Auth::makeToken($user['username'], $user['role'], $config['jwt_secret'], $config['jwt_ttl']);
  return Response::ok(['token' => $token, 'role' => $user['role']]);
}

function handle_track(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  $shipment = Shipments::findByTracking($db, $params['trackingNumber']);
  if (!$shipment) {
    return Response::error(404, 'No shipment found with this tracking number');
  }
  return Response::ok($shipment);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php api/tests/run.php`
Expected: PASS — `32 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add api/src/Shipments.php api/src/Settings.php api/src/handlers.php api/tests/
git commit -m "feat(api): repositories + login and track handlers"
```

---

## Task 7: Settings handlers

**Files:**
- Modify: `api/src/handlers.php`
- Create: `api/tests/test_settings.php`

- [ ] **Step 1: Write the failing test**

Create `api/tests/test_settings.php`:

```php
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php api/tests/run.php`
Expected: FAIL — `Call to undefined function handle_get_settings()`.

- [ ] **Step 3: Write minimal implementation**

Append to `api/src/handlers.php`:

```php
function handle_get_settings(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  return Response::ok(Settings::get($db));
}

function handle_update_settings(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['superadmin'])) return $err;
  Settings::save($db, $input);
  return Response::ok(Settings::get($db));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php api/tests/run.php`
Expected: PASS — `36 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add api/src/handlers.php api/tests/test_settings.php
git commit -m "feat(api): settings get/update handlers"
```

---

## Task 8: Shipment list + create handlers

**Files:**
- Modify: `api/src/handlers.php`
- Create: `api/tests/test_shipments_create.php`

- [ ] **Step 1: Write the failing test**

Create `api/tests/test_shipments_create.php`:

```php
<?php
function _valid_shipment_input(): array
{
  return [
    'senderName' => 'S', 'senderAddress' => 'A', 'senderPhone' => '1',
    'receiverName' => 'R', 'receiverAddress' => 'B', 'receiverPhone' => '2',
    'itemDescription' => 'Item', 'weight' => 3.5,
    'origin' => 'Portland, OR', 'destination' => 'Seattle, WA',
    'estimatedDelivery' => '2026-07-01',
  ];
}

test('list shipments requires auth', function () {
  $db = test_db();
  assert_eq(401, handle_list_shipments($db, [], null, [], $GLOBALS['test_config'])['status']);
});

test('admin lists seeded shipments', function () {
  $db = test_db();
  $res = handle_list_shipments($db, [], ['role' => 'admin'], [], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_eq(1, count($res['body']));
});

test('create requires auth', function () {
  $db = test_db();
  assert_eq(401, handle_create_shipment($db, _valid_shipment_input(), null, [], $GLOBALS['test_config'])['status']);
});

test('create rejects missing fields with 400', function () {
  $db = test_db();
  $res = handle_create_shipment($db, ['senderName' => 'S'], ['role' => 'admin'], [], $GLOBALS['test_config']);
  assert_eq(400, $res['status']);
});

test('create returns 201 with generated tracking number and first event', function () {
  $db = test_db();
  $res = handle_create_shipment($db, _valid_shipment_input(), ['role' => 'admin'], [], $GLOBALS['test_config']);
  assert_eq(201, $res['status']);
  assert_eq('ST', substr($res['body']['trackingNumber'], 0, 2));
  assert_eq('pending', $res['body']['status']);
  assert_eq(1, count($res['body']['events']));
  assert_eq('Order Placed', $res['body']['events'][0]['status']);
});

test('created shipment appears in the list', function () {
  $db = test_db();
  handle_create_shipment($db, _valid_shipment_input(), ['role' => 'admin'], [], $GLOBALS['test_config']);
  $list = handle_list_shipments($db, [], ['role' => 'admin'], [], $GLOBALS['test_config']);
  assert_eq(2, count($list['body']));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php api/tests/run.php`
Expected: FAIL — `Call to undefined function handle_list_shipments()`.

- [ ] **Step 3: Write minimal implementation**

Append to `api/src/handlers.php`:

```php
function handle_list_shipments(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['admin', 'superadmin'])) return $err;
  return Response::ok(Shipments::all($db));
}

function handle_create_shipment(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['admin', 'superadmin'])) return $err;
  $required = ['senderName', 'senderAddress', 'senderPhone', 'receiverName', 'receiverAddress', 'receiverPhone', 'itemDescription', 'origin', 'destination', 'estimatedDelivery'];
  $missing = Validation::requireFields($input, $required);
  if ($missing) return Response::error(400, 'Missing fields: ' . implode(', ', $missing));
  $status = $input['status'] ?? 'pending';
  if (!Validation::isStatus($status)) return Response::error(400, 'Invalid status');
  return Response::created(Shipments::create($db, $input, $status));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php api/tests/run.php`
Expected: PASS — `42 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add api/src/handlers.php api/tests/test_shipments_create.php
git commit -m "feat(api): shipment list and create handlers"
```

---

## Task 9: Shipment update, delete, status handlers

**Files:**
- Modify: `api/src/handlers.php`
- Create: `api/tests/test_shipments_mutate.php`

- [ ] **Step 1: Write the failing test**

Create `api/tests/test_shipments_mutate.php`:

```php
<?php
test('update changes fields and requires auth', function () {
  $db = test_db();
  assert_eq(401, handle_update_shipment($db, ['origin' => 'X'], null, ['id' => 'SHIP0001'], $GLOBALS['test_config'])['status']);

  $res = handle_update_shipment($db, ['origin' => 'Denver, CO'], ['role' => 'admin'], ['id' => 'SHIP0001'], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_eq('Denver, CO', $res['body']['origin']);
});

test('update returns 404 for unknown id', function () {
  $db = test_db();
  $res = handle_update_shipment($db, ['origin' => 'X'], ['role' => 'admin'], ['id' => 'NOPE'], $GLOBALS['test_config']);
  assert_eq(404, $res['status']);
});

test('update rejects invalid status', function () {
  $db = test_db();
  $res = handle_update_shipment($db, ['status' => 'flying'], ['role' => 'admin'], ['id' => 'SHIP0001'], $GLOBALS['test_config']);
  assert_eq(400, $res['status']);
});

test('status update appends an event and sets status', function () {
  $db = test_db();
  $res = handle_update_status($db, ['status' => 'delivered', 'location' => 'Seattle, WA', 'description' => 'Done'], ['role' => 'admin'], ['id' => 'SHIP0001'], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_eq('delivered', $res['body']['status']);
  assert_eq(2, count($res['body']['events']));
  assert_eq('Delivered', $res['body']['events'][1]['status']);
});

test('status update rejects invalid status', function () {
  $db = test_db();
  $res = handle_update_status($db, ['status' => 'nope', 'location' => '', 'description' => ''], ['role' => 'admin'], ['id' => 'SHIP0001'], $GLOBALS['test_config']);
  assert_eq(400, $res['status']);
});

test('delete removes the shipment and its events', function () {
  $db = test_db();
  assert_eq(401, handle_delete_shipment($db, [], null, ['id' => 'SHIP0001'], $GLOBALS['test_config'])['status']);

  $res = handle_delete_shipment($db, [], ['role' => 'admin'], ['id' => 'SHIP0001'], $GLOBALS['test_config']);
  assert_eq(200, $res['status']);
  assert_eq(null, Shipments::findApi($db, 'SHIP0001'));
  assert_eq(0, (int) $db->query('SELECT COUNT(*) AS c FROM tracking_events')->fetch()['c']);
});

test('delete returns 404 for unknown id', function () {
  $db = test_db();
  $res = handle_delete_shipment($db, [], ['role' => 'admin'], ['id' => 'NOPE'], $GLOBALS['test_config']);
  assert_eq(404, $res['status']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php api/tests/run.php`
Expected: FAIL — `Call to undefined function handle_update_shipment()`.

- [ ] **Step 3: Write minimal implementation**

Append to `api/src/handlers.php`:

```php
function handle_update_shipment(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['admin', 'superadmin'])) return $err;
  if (!Shipments::findRow($db, $params['id'])) return Response::error(404, 'Shipment not found');
  if (isset($input['status']) && !Validation::isStatus($input['status'])) return Response::error(400, 'Invalid status');
  Shipments::update($db, $params['id'], $input);
  return Response::ok(Shipments::findApi($db, $params['id']));
}

function handle_delete_shipment(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['admin', 'superadmin'])) return $err;
  if (!Shipments::findRow($db, $params['id'])) return Response::error(404, 'Shipment not found');
  Shipments::delete($db, $params['id']);
  return Response::ok(['deleted' => true]);
}

function handle_update_status(PDO $db, array $input, ?array $auth, array $params, array $config): array
{
  if ($err = require_role($auth, ['admin', 'superadmin'])) return $err;
  if (!Shipments::findRow($db, $params['id'])) return Response::error(404, 'Shipment not found');
  $status = $input['status'] ?? '';
  if (!Validation::isStatus($status)) return Response::error(400, 'Invalid status');
  Shipments::updateStatus($db, $params['id'], $status, $input['location'] ?? '', $input['description'] ?? '');
  return Response::ok(Shipments::findApi($db, $params['id']));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php api/tests/run.php`
Expected: PASS — `49 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add api/src/handlers.php api/tests/test_shipments_mutate.php
git commit -m "feat(api): shipment update, delete, and status handlers"
```

---

## Task 10: Front controller, routes, config, htaccess, hash tool

**Files:**
- Create: `api/src/routes.php`
- Create: `api/index.php`
- Create: `api/.htaccess`
- Create: `api/config.example.php`
- Create: `api/tools/make_hash.php`

- [ ] **Step 1: Create the routes table**

Create `api/src/routes.php`:

```php
<?php
return [
  ['POST',   '/auth/login',              'handle_login'],
  ['GET',    '/track/{trackingNumber}',  'handle_track'],
  ['GET',    '/settings',                'handle_get_settings'],
  ['PUT',    '/settings',                'handle_update_settings'],
  ['GET',    '/shipments',               'handle_list_shipments'],
  ['POST',   '/shipments',               'handle_create_shipment'],
  ['PUT',    '/shipments/{id}',          'handle_update_shipment'],
  ['DELETE', '/shipments/{id}',          'handle_delete_shipment'],
  ['POST',   '/shipments/{id}/status',   'handle_update_status'],
];
```

- [ ] **Step 2: Create the config template and hash tool**

Create `api/config.example.php`:

```php
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
```

Create `api/tools/make_hash.php`:

```php
<?php
// Usage: php api/tools/make_hash.php "your-password"
// Prints a bcrypt hash suitable for the users.password_hash column.
$pw = $argv[1] ?? '';
if ($pw === '') {
  fwrite(STDERR, "Usage: php make_hash.php \"your-password\"\n");
  exit(1);
}
echo password_hash($pw, PASSWORD_BCRYPT), PHP_EOL;
```

- [ ] **Step 3: Create the front controller**

Create `api/index.php`:

```php
<?php

$config = require __DIR__ . '/config.php';

require __DIR__ . '/src/Db.php';
require __DIR__ . '/src/Response.php';
require __DIR__ . '/src/Auth.php';
require __DIR__ . '/src/Router.php';
require __DIR__ . '/src/Helpers.php';
require __DIR__ . '/src/Shipments.php';
require __DIR__ . '/src/Settings.php';
require __DIR__ . '/src/handlers.php';

Db::init($config);

$method = $_SERVER['REQUEST_METHOD'];

// Derive the route path relative to this script's directory (e.g. /api).
$base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
$uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($base !== '' && str_starts_with($uriPath, $base)) {
  $path = substr($uriPath, strlen($base));
} else {
  $path = $uriPath;
}
if ($path === '') $path = '/';

$routes = require __DIR__ . '/src/routes.php';
$match = Router::match($routes, $method, $path);
if ($match === null) {
  Response::send(404, ['error' => 'Not found']);
  exit;
}
[$handler, $params] = $match;

$raw = file_get_contents('php://input');
$input = $raw ? (json_decode($raw, true) ?? []) : [];

$auth = null;
$header = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
if (preg_match('/Bearer\s+(.+)/i', $header, $m)) {
  $auth = Auth::decode(trim($m[1]), $config['jwt_secret']);
}

try {
  $result = $handler(Db::get(), $input, $auth, $params, $config);
} catch (Throwable $e) {
  $result = Response::error(500, 'Server error');
}

Response::send($result['status'], $result['body']);
```

- [ ] **Step 4: Create the .htaccess**

Create `api/.htaccess`:

```apache
RewriteEngine On

# Make the Authorization header available to PHP (some hosts strip it).
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

# Route everything that is not a real file/dir to the front controller.
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]
```

- [ ] **Step 5: Smoke-test the router wiring and confirm tests still pass**

The handlers are already covered by unit tests. Verify the full PHP suite still passes and that `index.php` has no syntax errors:

Run: `php -l api/index.php`
Expected: `No syntax errors detected in api/index.php`

Run: `php api/tests/run.php`
Expected: PASS — `49 passed, 0 failed`.

- [ ] **Step 6: Commit**

```bash
git add api/index.php api/.htaccess api/config.example.php api/src/routes.php api/tools/
git commit -m "feat(api): front controller, routes, config template, hash tool"
```

---

## Task 11: Frontend API client

**Files:**
- Create: `src/utils/api.ts`
- Create: `.env.example`

- [ ] **Step 1: Create the API client**

Create `src/utils/api.ts`:

```ts
const API_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'swiftrack_token';
const ROLE_KEY = 'swiftrack_role';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole(): string | null {
  return localStorage.getItem(ROLE_KEY);
}

export function setAuth(token: string, role: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

interface ApiOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401 && options.auth) {
    clearAuth();
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}
```

Create `.env.example`:

```
# Base URL for the backend API. Defaults to "/api" (same domain as the site).
# Override only if the API lives on a different host, e.g. https://api.example.com
VITE_API_URL=/api
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/utils/api.ts .env.example
git commit -m "feat(web): API client with token storage"
```

---

## Task 12: Rewrite useShipments to call the API

**Files:**
- Modify: `src/hooks/useShipments.ts` (full rewrite)

- [ ] **Step 1: Replace the hook implementation**

Replace the entire contents of `src/hooks/useShipments.ts` with:

```ts
import { useState, useEffect, useCallback } from 'react';
import type { Shipment, ShipmentStatus } from '../types';
import { api, getToken } from '../utils/api';

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!getToken()) return;
    setLoading(true);
    setError(null);
    try {
      setShipments(await api<Shipment[]>('/shipments', { auth: true }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load shipments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addShipment = useCallback(
    async (
      data: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'events'>
    ): Promise<Shipment> => {
      const created = await api<Shipment>('/shipments', { method: 'POST', body: data, auth: true });
      await refresh();
      return created;
    },
    [refresh]
  );

  const updateShipment = useCallback(
    async (id: string, updates: Partial<Shipment>): Promise<void> => {
      await api<Shipment>(`/shipments/${id}`, { method: 'PUT', body: updates, auth: true });
      await refresh();
    },
    [refresh]
  );

  const deleteShipment = useCallback(
    async (id: string): Promise<void> => {
      await api(`/shipments/${id}`, { method: 'DELETE', auth: true });
      await refresh();
    },
    [refresh]
  );

  const getShipmentByTracking = useCallback(
    async (trackingNumber: string): Promise<Shipment | null> => {
      try {
        return await api<Shipment>(`/track/${encodeURIComponent(trackingNumber)}`);
      } catch {
        return null;
      }
    },
    []
  );

  const updateShipmentStatus = useCallback(
    async (id: string, status: ShipmentStatus, location: string, description: string): Promise<void> => {
      await api(`/shipments/${id}/status`, {
        method: 'POST',
        body: { status, location, description },
        auth: true,
      });
      await refresh();
    },
    [refresh]
  );

  return {
    shipments,
    loading,
    error,
    refresh,
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentByTracking,
    updateShipmentStatus,
  };
};
```

- [ ] **Step 2: Verify type-check status**

Run: `npx tsc --noEmit`
Expected: errors ONLY in files that consume the changed signatures — `src/App.tsx`, `src/pages/AdminPage.tsx`, `src/pages/TrackPage.tsx` (these are fixed in Tasks 14, 15, 16). No errors inside `useShipments.ts` itself.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useShipments.ts
git commit -m "feat(web): useShipments calls the API"
```

---

## Task 13: Rewrite useSettings to call the API

**Files:**
- Modify: `src/hooks/useSettings.tsx` (full rewrite)

- [ ] **Step 1: Replace the hook implementation**

Replace the entire contents of `src/hooks/useSettings.tsx` with:

```tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { type SiteSettings, DEFAULT_SETTINGS } from '../types/settings';
import { api } from '../utils/api';

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api<Partial<SiteSettings>>('/settings');
        if (active) setSettings({ ...DEFAULT_SETTINGS, ...data });
      } catch {
        // keep defaults if the API is unreachable
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateSettings = useCallback(
    async (updates: Partial<SiteSettings>) => {
      const merged = { ...DEFAULT_SETTINGS, ...settings, ...updates };
      const saved = await api<Partial<SiteSettings>>('/settings', {
        method: 'PUT',
        body: merged,
        auth: true,
      });
      setSettings({ ...DEFAULT_SETTINGS, ...saved });
    },
    [settings]
  );

  const resetSettings = useCallback(async () => {
    const saved = await api<Partial<SiteSettings>>('/settings', {
      method: 'PUT',
      body: DEFAULT_SETTINGS,
      auth: true,
    });
    setSettings({ ...DEFAULT_SETTINGS, ...saved });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
```

- [ ] **Step 2: Verify type-check status**

Run: `npx tsc --noEmit`
Expected: `SuperAdminPage.tsx` may show "await has no effect" only if handlers are not yet async — it is fixed in Task 16. No errors inside `useSettings.tsx` itself. (Errors from Task 12 consumers may still be present until their tasks run.)

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useSettings.tsx
git commit -m "feat(web): useSettings calls the API"
```

---

## Task 14: Update App.tsx auth state

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add the auth imports**

In `src/App.tsx`, change the hooks import line and add the api import. Replace:

```tsx
import { useState, useEffect } from 'react';
```

with:

```tsx
import { useState, useEffect } from 'react';
import { getToken, getRole, clearAuth } from './utils/api';
```

- [ ] **Step 2: Initialize auth state from the stored token**

Replace these two lines:

```tsx
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isSuperAdminLoggedIn, setIsSuperAdminLoggedIn] = useState(false);
```

with:

```tsx
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const role = getRole();
    return getToken() !== null && (role === 'admin' || role === 'superadmin');
  });
  const [isSuperAdminLoggedIn, setIsSuperAdminLoggedIn] = useState(
    () => getToken() !== null && getRole() === 'superadmin'
  );
```

- [ ] **Step 3: Pass refresh to AdminPage and clear token on logout**

Replace the destructured hook usage:

```tsx
  const {
    shipments,
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentByTracking,
    updateShipmentStatus,
  } = useShipments();
```

with (adds `refresh`):

```tsx
  const {
    shipments,
    refresh,
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentByTracking,
    updateShipmentStatus,
  } = useShipments();
```

In the `/admin` route's `AdminPage` element, add the `refresh` prop and change the logout handler. Replace:

```tsx
                    <AdminPage
                      shipments={shipments}
                      addShipment={addShipment}
                      updateShipment={updateShipment}
                      deleteShipment={deleteShipment}
                      updateShipmentStatus={updateShipmentStatus}
                      onLogout={() => setIsAdminLoggedIn(false)}
                    />
```

with:

```tsx
                    <AdminPage
                      shipments={shipments}
                      refresh={refresh}
                      addShipment={addShipment}
                      updateShipment={updateShipment}
                      deleteShipment={deleteShipment}
                      updateShipmentStatus={updateShipmentStatus}
                      onLogout={() => {
                        clearAuth();
                        setIsAdminLoggedIn(false);
                      }}
                    />
```

In the `/super-admin` route, replace:

```tsx
                    <SuperAdminPage onLogout={() => setIsSuperAdminLoggedIn(false)} />
```

with:

```tsx
                    <SuperAdminPage
                      onLogout={() => {
                        clearAuth();
                        setIsSuperAdminLoggedIn(false);
                      }}
                    />
```

- [ ] **Step 4: Verify type-check status**

Run: `npx tsc --noEmit`
Expected: remaining errors only in `AdminPage.tsx` (needs `refresh` prop + async handlers — Task 15) and `TrackPage.tsx` (async prop — Task 16). No new errors in `App.tsx`.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat(web): derive auth state from stored token"
```

---

## Task 15: Update AdminPage for async API

**Files:**
- Modify: `src/pages/AdminPage.tsx`

- [ ] **Step 1: Ensure useEffect is imported**

At the top of `src/pages/AdminPage.tsx`, confirm the React import includes `useEffect`. If the existing import is `import { useState } from 'react';`, change it to:

```tsx
import { useState, useEffect } from 'react';
```

(If `useEffect` is already imported, leave it as-is.)

- [ ] **Step 2: Update the props interface**

Replace the prop type lines:

```tsx
  addShipment: (data: any) => Shipment;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  deleteShipment: (id: string) => void;
  updateShipmentStatus: (id: string, status: ShipmentStatus, location: string, description: string) => void;
```

with:

```tsx
  refresh: () => Promise<void>;
  addShipment: (data: any) => Promise<Shipment>;
  updateShipment: (id: string, updates: Partial<Shipment>) => Promise<void>;
  deleteShipment: (id: string) => Promise<void>;
  updateShipmentStatus: (id: string, status: ShipmentStatus, location: string, description: string) => Promise<void>;
```

- [ ] **Step 3: Destructure refresh and load on mount**

In the component's destructured props (the block starting near `addShipment,`), add `refresh,`:

```tsx
  refresh,
  addShipment,
  updateShipment,
  deleteShipment,
  updateShipmentStatus,
```

Immediately after the props are destructured and any `useState` declarations at the top of the component body, add a mount effect that loads the list (the list is empty until this runs because the hook only fetches when a token exists). Add:

```tsx
  useEffect(() => {
    refresh();
  }, [refresh]);
```

- [ ] **Step 4: Make the handlers async**

Replace `handleAdd`:

```tsx
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newShipment = addShipment({
      ...formData,
      weight: parseFloat(formData.weight) || 0,
      status: 'pending',
    });
    resetForm();
    setShowAddModal(false);
    setExpandedRow(newShipment.id);
  };
```

with:

```tsx
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const newShipment = await addShipment({
      ...formData,
      weight: parseFloat(formData.weight) || 0,
      status: 'pending',
    });
    resetForm();
    setShowAddModal(false);
    setExpandedRow(newShipment.id);
  };
```

Replace `handleEdit`:

```tsx
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    updateShipment(selectedShipment.id, {
      ...formData,
      weight: parseFloat(formData.weight) || 0,
    });
    setShowEditModal(false);
    setSelectedShipment(null);
  };
```

with:

```tsx
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    await updateShipment(selectedShipment.id, {
      ...formData,
      weight: parseFloat(formData.weight) || 0,
    });
    setShowEditModal(false);
    setSelectedShipment(null);
  };
```

Replace `handleDelete`:

```tsx
  const handleDelete = () => {
    if (!selectedShipment) return;
    deleteShipment(selectedShipment.id);
    setShowDeleteModal(false);
    setSelectedShipment(null);
  };
```

with:

```tsx
  const handleDelete = async () => {
    if (!selectedShipment) return;
    await deleteShipment(selectedShipment.id);
    setShowDeleteModal(false);
    setSelectedShipment(null);
  };
```

Replace `handleStatusUpdate`:

```tsx
  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    updateShipmentStatus(
      selectedShipment.id,
      statusUpdate.status,
      statusUpdate.location,
      statusUpdate.description
    );
    setShowStatusModal(false);
    setSelectedShipment(null);
    setStatusUpdate({ status: 'in_transit', location: '', description: '' });
  };
```

with:

```tsx
  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    await updateShipmentStatus(
      selectedShipment.id,
      statusUpdate.status,
      statusUpdate.location,
      statusUpdate.description
    );
    setShowStatusModal(false);
    setSelectedShipment(null);
    setStatusUpdate({ status: 'in_transit', location: '', description: '' });
  };
```

- [ ] **Step 4: Verify type-check status**

Run: `npx tsc --noEmit`
Expected: no errors in `AdminPage.tsx`. Remaining error only in `TrackPage.tsx` (Task 16).

- [ ] **Step 5: Commit**

```bash
git add src/pages/AdminPage.tsx
git commit -m "feat(web): AdminPage async handlers + load on mount"
```

---

## Task 16: Update TrackPage and SuperAdminPage for async

**Files:**
- Modify: `src/pages/TrackPage.tsx`
- Modify: `src/pages/SuperAdminPage.tsx`

- [ ] **Step 1: Update the TrackPage prop type**

In `src/pages/TrackPage.tsx`, replace:

```tsx
interface TrackPageProps {
  getShipmentByTracking: (trackingNumber: string) => Shipment | undefined;
}
```

with:

```tsx
interface TrackPageProps {
  getShipmentByTracking: (trackingNumber: string) => Promise<Shipment | null>;
}
```

- [ ] **Step 2: Make the search handler async**

Replace `handleSearch`:

```tsx
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShipment(null);

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const found = getShipmentByTracking(trackingNumber.trim());
      if (found) {
        setShipment(found);
      } else {
        setError('No shipment found with this tracking number. Please check and try again.');
      }
      setLoading(false);
    }, 600);
  };
```

with:

```tsx
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShipment(null);

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    try {
      const found = await getShipmentByTracking(trackingNumber.trim());
      if (found) {
        setShipment(found);
      } else {
        setError('No shipment found with this tracking number. Please check and try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
```

- [ ] **Step 3: Make SuperAdminPage save/reset async**

In `src/pages/SuperAdminPage.tsx`, replace `handleSave`:

```tsx
  const handleSave = () => {
    updateSettings(formData);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
```

with:

```tsx
  const handleSave = async () => {
    await updateSettings(formData);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
```

Replace `handleReset`:

```tsx
  const handleReset = () => {
    resetSettings();
    setShowResetConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
```

with:

```tsx
  const handleReset = async () => {
    await resetSettings();
    setShowResetConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
```

- [ ] **Step 4: Verify the whole project type-checks**

Run: `npx tsc --noEmit`
Expected: no errors anywhere.

- [ ] **Step 5: Commit**

```bash
git add src/pages/TrackPage.tsx src/pages/SuperAdminPage.tsx
git commit -m "feat(web): async tracking lookup and settings save"
```

---

## Task 17: Update login pages to call the API

**Files:**
- Modify: `src/pages/AdminLogin.tsx`
- Modify: `src/pages/SuperAdminLogin.tsx`

- [ ] **Step 1: Update AdminLogin**

In `src/pages/AdminLogin.tsx`, add the api import after the existing imports (below the `lucide-react` import line):

```tsx
import { api, setAuth } from '../utils/api';
```

Replace `handleSubmit`:

```tsx
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'admin' && password === 'admin123') {
      onLogin();
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };
```

with:

```tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api<{ token: string; role: string }>('/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      setAuth(res.token, res.role);
      onLogin();
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };
```

Remove the demo-credentials block (the `<div>` containing "Demo Credentials"):

```tsx
          <div className="mt-6 p-3 bg-slate-50 rounded text-xs text-slate-500 text-center border border-slate-200">
            <p className="font-bold text-slate-600 mb-1">Demo Credentials</p>
            <p>Username: <span className="font-mono text-slate-700">admin</span></p>
            <p>Password: <span className="font-mono text-slate-700">admin123</span></p>
          </div>
```

Delete those lines entirely. Also change the password input `placeholder="admin123"` to `placeholder="Enter your password"` and the username input `placeholder="admin"` to `placeholder="Enter your username"`.

- [ ] **Step 2: Update SuperAdminLogin**

In `src/pages/SuperAdminLogin.tsx`, add after the `lucide-react` import:

```tsx
import { api, setAuth, clearAuth } from '../utils/api';
```

Replace `handleSubmit`:

```tsx
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'superadmin' && password === 'super123') {
      onLogin();
      navigate('/super-admin');
    } else {
      setError('Invalid super admin credentials');
    }
  };
```

with:

```tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api<{ token: string; role: string }>('/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      if (res.role !== 'superadmin') {
        clearAuth();
        setError('This account does not have super admin access');
        return;
      }
      setAuth(res.token, res.role);
      onLogin();
      navigate('/super-admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };
```

Remove the demo-credentials block:

```tsx
          <div className="mt-6 p-3 bg-slate-50 rounded text-xs text-slate-500 text-center border border-slate-200">
            <p className="font-bold text-slate-600 mb-1">Demo Credentials</p>
            <p>Username: <span className="font-mono text-slate-700">superadmin</span></p>
            <p>Password: <span className="font-mono text-slate-700">super123</span></p>
          </div>
```

Delete those lines entirely. Change `placeholder="superadmin"` to `placeholder="Enter your username"` and `placeholder="super123"` to `placeholder="Enter your password"`.

- [ ] **Step 3: Verify type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/AdminLogin.tsx src/pages/SuperAdminLogin.tsx
git commit -m "feat(web): login pages call the API, remove demo credentials"
```

---

## Task 18: Standard build config + build verification

**Files:**
- Modify: `vite.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Remove the single-file plugin**

Replace the contents of `vite.config.ts` with:

```ts
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

- [ ] **Step 2: Remove the now-unused dependency**

Remove the `vite-plugin-singlefile` line from `devDependencies` in `package.json`, then refresh the lockfile:

Run: `npm install`
Expected: completes; `vite-plugin-singlefile` removed from `node_modules`.

- [ ] **Step 3: Verify the production build**

Run: `npm run build`
Expected: build succeeds; output is `dist/index.html` plus a `dist/assets/` directory (NOT a single inlined HTML file).

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts package.json package-lock.json
git commit -m "build(web): standard multi-file Vite build"
```

---

## Task 19: Secrets, deploy docs, README

**Files:**
- Modify: `.gitignore`
- Create: `DEPLOY.md`
- Modify: `README.md`

- [ ] **Step 1: Ignore secrets and local databases**

Add to `.gitignore` (under the Environment section):

```
# Backend secrets and local databases
api/config.php
*.sqlite
```

- [ ] **Step 2: Write the deployment guide**

Create `DEPLOY.md`:

````markdown
# Deploying SwiftTrack to Hostinger

The app has two parts that both live under one domain:

- **Frontend** — the built React site (static files) in `public_html/`
- **Backend** — the PHP API in `public_html/api/`, using a MySQL database

## 1. Create the MySQL database (hPanel)

1. hPanel → **Databases → MySQL Databases**.
2. Create a database and a user, and assign the user to the database.
3. Note the **database name**, **username**, **password**, and **host** (usually `localhost`).

## 2. Import the schema

1. hPanel → **phpMyAdmin**, open your database.
2. **Import** tab → upload `api/schema.sql` → **Go**.
3. This creates the tables and seeds demo shipments, a settings row, and two
   placeholder admin accounts.

## 3. Set the admin passwords

The seeded password hashes in `schema.sql` are placeholders. Generate real ones:

```bash
php api/tools/make_hash.php "your-admin-password"
php api/tools/make_hash.php "your-superadmin-password"
```

In phpMyAdmin, edit the `users` table and paste each hash into the
`password_hash` column for `admin` and `superadmin` respectively.

## 4. Configure the API

1. Copy `api/config.example.php` to `api/config.php`.
2. Fill in the DB name/user/password from step 1.
3. Set `jwt_secret` to a long random string:
   ```bash
   php -r "echo bin2hex(random_bytes(32));"
   ```

> `api/config.php` is gitignored — it is never committed.

## 5. Build the frontend

```bash
npm install
npm run build
```

This produces `dist/index.html` and `dist/assets/`. Because the app uses
`HashRouter`, no SPA rewrite rules are needed.

## 6. Upload

Using hPanel **File Manager** or FTP:

- Upload the **contents** of `dist/` into `public_html/`.
- Upload the `api/` folder (including `.htaccess`, `config.php`, `schema.sql`
  is optional to keep) into `public_html/api/`.

Final layout:

```
public_html/
├── index.html
├── assets/
└── api/
    ├── .htaccess
    ├── index.php
    ├── config.php
    ├── src/...
    └── tools/...
```

## 7. Verify

- Visit `https://yourdomain.com/` — the site loads with demo shipments.
- Track `STX7B9K2M4P1` on the Track page.
- `https://yourdomain.com/#/admin/login` — log in with your admin password,
  create/edit/delete a shipment.
- `https://yourdomain.com/#/super-admin/login` — log in with your superadmin
  password, change site settings, confirm they persist after refresh.

### Troubleshooting

- **401 on every admin action / login fails immediately after success:** the
  `Authorization` header may be stripped. Confirm `api/.htaccess` was uploaded.
- **404 on all `/api/...` calls:** confirm `mod_rewrite` is active (default on
  Hostinger) and `api/.htaccess` is present.
- **500 errors:** check the DB credentials in `api/config.php` and that the
  schema imported without errors.
````

- [ ] **Step 3: Update the README**

In `README.md`, replace the status/blocker sections to reflect the backend. Replace the line:

```markdown
> ⚠️ **Status: front-end prototype / demo.** All data lives in the browser's `localStorage` and authentication uses hard-coded demo credentials. It deploys cleanly as a static site, but is **not** production-ready as a real tracking system without a backend. See [Production checklist](#production-checklist).
```

with:

```markdown
> **Status:** full-stack app. The React frontend talks to a PHP + MySQL REST API (in `api/`) with JWT authentication. See [DEPLOY.md](DEPLOY.md) for Hostinger deployment.
```

Replace the entire `## Production checklist` section with:

```markdown
## Backend

The API lives in [`api/`](api/) — plain PHP (no framework) with PDO + MySQL.

- Run the API test suite: `php api/tests/run.php`
- Endpoints: `POST /api/auth/login`, `GET /api/track/{n}`, `GET|PUT /api/settings`,
  `GET|POST /api/shipments`, `PUT|DELETE /api/shipments/{id}`,
  `POST /api/shipments/{id}/status`.
- Deployment: see [DEPLOY.md](DEPLOY.md).

## Remaining known limitations

- **Geocoding** (`src/utils/geocode.ts`) is still an approximate hard-coded
  table; integrate a real geocoding API for accurate maps.
- No automated frontend test suite (the API has one).
```

- [ ] **Step 4: Final verification**

Run: `php api/tests/run.php`
Expected: PASS — `49 passed, 0 failed`.

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add .gitignore DEPLOY.md README.md
git commit -m "docs: deployment guide, README update, ignore secrets"
```

---

## Plan self-review notes

- **Spec coverage:** architecture/layout (Tasks 5, 10, 19), schema incl. users/shipments/tracking_events/settings (Task 5), all 9 endpoints (Tasks 6–9 handlers, Task 10 routes), JWT auth incl. refresh persistence + demo-box removal (Tasks 1, 14, 17), frontend `api.ts`/`useShipments`/`useSettings`/`App`/login pages/TrackPage (Tasks 11–17), standard build (Task 18), gitignored secrets + `config.example.php` + DEPLOY.md (Tasks 10, 19), testing strategy (PHP suite throughout + `tsc`/build for frontend). All covered.
- **Type consistency:** handler signature `(PDO, array, ?array, array, array): array` is uniform across Tasks 6–9; `Router::match($routes, $method, $path)` matches its test and `index.php`; hook function names/signatures match the consumer edits in Tasks 14–16; `api<T>()` option shape matches every call site.
- **Portability:** repository SQL avoids MySQL-only syntax so the same code runs on the SQLite test DB; status ENUM is enforced in PHP (`Validation::isStatus`), settings stored as JSON text in both engines.

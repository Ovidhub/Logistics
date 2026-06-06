<?php

// Sends shipment notification emails via SMTP (PHPMailer). No-ops when mail is
// not configured (e.g. local dev / tests), so the rest of the app works without it.

function mailer_recipients(array $shipment): array
{
  $r = [];
  if (!empty($shipment['senderEmail'])) {
    $r[] = [$shipment['senderEmail'], $shipment['senderName'], 'sender'];
  }
  if (!empty($shipment['receiverEmail'])) {
    $r[] = [$shipment['receiverEmail'], $shipment['receiverName'], 'receiver'];
  }
  return $r;
}

// Sent when a shipment is first created.
function send_shipment_notifications(array $shipment, array $config): void
{
  $mail = $config['mail'] ?? null;
  if (empty($mail) || empty($mail['host'])) return;
  require_once __DIR__ . '/../vendor/autoload.php';

  $tn = $shipment['trackingNumber'];
  $rows = [
    ['Tracking number', $tn],
    ['From', $shipment['origin']],
    ['To', $shipment['destination']],
    ['Item', $shipment['itemDescription']],
    ['Estimated delivery', $shipment['estimatedDelivery']],
  ];
  foreach (mailer_recipients($shipment) as [$email, $name, $role]) {
    $intro = $role === 'sender'
      ? 'Your shipment has been registered. Here are the tracking details:'
      : 'A shipment is on its way to you. Track it any time with the details below:';
    try {
      mailer_send($mail, $email, $name, "Shipment $tn registered", $intro, $rows, $tn);
    } catch (\Throwable $e) {
      error_log('Shipment email to ' . $email . ' failed: ' . $e->getMessage());
    }
  }
}

// Sent when a shipment's status changes (expects the updated shipment, with the
// new status and the latest event appended to events).
function send_status_notifications(array $shipment, array $config): void
{
  $mail = $config['mail'] ?? null;
  if (empty($mail) || empty($mail['host'])) return;
  require_once __DIR__ . '/../vendor/autoload.php';

  $tn = $shipment['trackingNumber'];
  $label = Validation::STATUS_LABELS[$shipment['status']] ?? $shipment['status'];
  $events = $shipment['events'] ?? [];
  $last = $events ? end($events) : null;
  $rows = [
    ['Tracking number', $tn],
    ['Status', $label],
    ['Update', $last['description'] ?? ''],
    ['Location', $last['location'] ?? ''],
    ['Route', $shipment['origin'] . ' to ' . $shipment['destination']],
  ];
  $intro = "Your shipment status has been updated to \"$label\".";
  foreach (mailer_recipients($shipment) as [$email, $name]) {
    try {
      mailer_send($mail, $email, $name, "Shipment $tn update: $label", $intro, $rows, $tn);
    } catch (\Throwable $e) {
      error_log('Status email to ' . $email . ' failed: ' . $e->getMessage());
    }
  }
}

function mailer_send(array $mail, string $to, string $name, string $subject, string $intro, array $rows, string $tn): void
{
  $m = new \PHPMailer\PHPMailer\PHPMailer(true);
  $m->isSMTP();
  $m->Host = $mail['host'];
  $m->SMTPAuth = true;
  $m->Username = $mail['user'];
  $m->Password = $mail['pass'];
  $m->SMTPSecure = $mail['secure'] ?? 'ssl';
  $m->Port = (int) ($mail['port'] ?? 465);
  $m->CharSet = 'UTF-8';

  $fromName = $mail['from_name'] ?? 'Hilcris Express';
  $m->setFrom($mail['user'], $fromName);
  $m->addAddress($to, $name);

  $site = rtrim($mail['site_url'] ?? '', '/');
  $trackUrl = $site . '/#/track';

  $m->Subject = $subject . ' — ' . $fromName;
  $m->isHTML(true);

  $rowsHtml = '';
  $rowsText = '';
  foreach ($rows as [$label, $value]) {
    $v = htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
    $rowsHtml .= "<tr><td style=\"padding:6px 12px;color:#64748b;\">$label</td>"
      . "<td style=\"padding:6px 12px;color:#0f172a;font-weight:600;\">$v</td></tr>";
    $rowsText .= "$label: $value\n";
  }

  $safeIntro = htmlspecialchars($intro, ENT_QUOTES, 'UTF-8');
  $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
  $m->Body = <<<HTML
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;">
  <h2 style="color:#dc2626;margin:0 0 8px;">$fromName</h2>
  <p style="color:#334155;">Hi $safeName,</p>
  <p style="color:#334155;">$safeIntro</p>
  <table style="border-collapse:collapse;width:100%;background:#f8fafc;border-radius:8px;margin:12px 0;">
    $rowsHtml
  </table>
  <p style="margin:18px 0;">
    <a href="$trackUrl" style="background:#dc2626;color:#fff;text-decoration:none;padding:10px 18px;border-radius:6px;font-weight:600;">Track your shipment</a>
  </p>
  <p style="color:#94a3b8;font-size:12px;">Enter tracking number <strong>$tn</strong> at $trackUrl</p>
</div>
HTML;

  $m->AltBody = "$fromName\n\nHi $name,\n$intro\n\n$rowsText\nTrack at: $trackUrl (tracking number $tn)\n";

  $m->send();
}

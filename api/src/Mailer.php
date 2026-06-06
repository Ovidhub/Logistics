<?php

// Sends shipment notification emails via SMTP (PHPMailer). No-ops when mail is
// not configured (e.g. local dev), so the rest of the app works without it.

function send_shipment_notifications(array $shipment, array $config): void
{
  $mail = $config['mail'] ?? null;
  if (empty($mail) || empty($mail['host'])) {
    return; // mail not configured — skip silently
  }

  require_once __DIR__ . '/../vendor/autoload.php';

  $recipients = [];
  if (!empty($shipment['senderEmail'])) {
    $recipients[] = [$shipment['senderEmail'], $shipment['senderName'], 'sender'];
  }
  if (!empty($shipment['receiverEmail'])) {
    $recipients[] = [$shipment['receiverEmail'], $shipment['receiverName'], 'receiver'];
  }

  foreach ($recipients as [$email, $name, $role]) {
    try {
      send_one_notification($mail, $email, $name, $role, $shipment);
    } catch (\Throwable $e) {
      // Best-effort: never let an email failure break shipment creation.
      error_log('Shipment email to ' . $email . ' failed: ' . $e->getMessage());
    }
  }
}

function send_one_notification(array $mail, string $to, string $name, string $role, array $s): void
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

  $tn = $s['trackingNumber'];
  $site = rtrim($mail['site_url'] ?? '', '/');
  $trackUrl = $site . '/#/track';

  $intro = $role === 'sender'
    ? 'Your shipment has been registered. Here are the tracking details:'
    : 'A shipment is on its way to you. Track it any time with the details below:';

  $m->Subject = "Shipment $tn — $fromName";
  $m->isHTML(true);

  $rows = [
    ['Tracking number', $tn],
    ['From', $s['origin']],
    ['To', $s['destination']],
    ['Item', $s['itemDescription']],
    ['Estimated delivery', $s['estimatedDelivery']],
  ];
  $rowsHtml = '';
  $rowsText = '';
  foreach ($rows as [$label, $value]) {
    $v = htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
    $rowsHtml .= "<tr><td style=\"padding:6px 12px;color:#64748b;\">$label</td>"
      . "<td style=\"padding:6px 12px;color:#0f172a;font-weight:600;\">$v</td></tr>";
    $rowsText .= "$label: $value\n";
  }

  $safeIntro = htmlspecialchars($intro, ENT_QUOTES, 'UTF-8');
  $m->Body = <<<HTML
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;">
  <h2 style="color:#dc2626;margin:0 0 8px;">$fromName</h2>
  <p style="color:#334155;">Hi {$name},</p>
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

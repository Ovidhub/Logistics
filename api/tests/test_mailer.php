<?php
test('mailer functions no-op without mail config', function () {
  $shipment = [
    'trackingNumber' => 'STTEST', 'status' => 'in_transit',
    'origin' => 'A', 'destination' => 'B', 'itemDescription' => 'I',
    'estimatedDelivery' => '2026-01-01', 'senderName' => 'S', 'receiverName' => 'R',
    'senderEmail' => 'a@b.com', 'receiverEmail' => 'c@d.com', 'events' => [],
  ];
  // No 'mail' key, and empty mail config — both must return without sending/throwing.
  send_shipment_notifications($shipment, []);
  send_status_notifications($shipment, ['mail' => []]);
  assert_true(true, 'no exception thrown');
});

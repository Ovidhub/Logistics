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

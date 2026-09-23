# Vector Utilities

## QR Codes

```php
// Pure PHP vector QR code SVG
$qrSvg = pdf_qr_code('https://jengophp.com', size: 140);

// Base64 PNG data URI for <img> tags
$qrUri = pdf_qr_data_uri('https://jengophp.com');
```

## Barcodes (Code 128)

```php
// Pure PHP vector Barcode
$barcodeSvg = pdf_barcode('INV-2026-9901', height: 45);

// Base64 PNG data URI
$barcodeUri = pdf_barcode_data_uri('INV-2026-9901');
```

## Watermarks

```php
// Custom view watermark tag
echo pdf_watermark('CONFIDENTIAL', opacity: 0.08, color: '#dc2626', angle: -35);
```

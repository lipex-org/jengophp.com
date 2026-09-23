# Global Helper

```php
// Start document builder fluently
return pdf()->invoice('INV-001')->download();

// Render view
return pdf('invoices/receipt', $data)->inline();
```

# Filter Types & Factory

Use `Jengo\Pdf\Filtering\Filter` (or `Jengo\Pdf\Support\Filter`) to define filter controls:

```php
use Jengo\Pdf\Support\Filter;

$filters = [
    // Free text input
    Filter::text('customer', 'Customer Name', placeholder: 'Filter by client...'),

    // Search input
    Filter::search('search', 'Search Records', placeholder: 'Type keywords...'),

    // Single date picker
    Filter::date('start_date', 'Effective Date', default: '2026-01-01'),

    // Date range picker (from / to)
    Filter::dateRange('date_range', 'Date Range', default: [
        'from' => '2026-01-01',
        'to'   => '2026-03-31',
    ]),

    // Dropdown select (single or multi-select)
    Filter::select('status', 'Status', [
        'all'     => 'All Statuses',
        'paid'    => 'Paid',
        'pending' => 'Pending',
        'void'    => 'Void',
    ], default: 'all'),

    // Toggle switch
    Filter::toggle('include_archived', 'Include Archived', default: false),

    // Numeric bounds range (min / max)
    Filter::numberRange('amount_range', 'Amount Range', default: [
        'min' => 100,
        'max' => 5000,
    ], min: 0, max: 10000, step: 50),
];
```

## Fluent Setters

All filter fields support fluent configuration:

```php
Filter::select('tier', 'Customer Tier', ['bronze' => 'Bronze', 'silver' => 'Silver', 'gold' => 'Gold'])
    ->placeholder('Select tier')
    ->default('gold')
    ->multiple(true);

Filter::numberRange('price', 'Price Bounds')
    ->min(10.0)
    ->max(500.0)
    ->step(5.0);
```

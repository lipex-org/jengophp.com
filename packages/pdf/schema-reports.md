# Schema-Driven Data Reports

Transform database queries, CI4 models, entity collections, or arrays into formatted multi-page business reports.

## Basic Report

```php
use Jengo\Pdf\Pdf;
use Jengo\Pdf\Schema\Column;
use Jengo\Pdf\Schema\ReportTheme;

$usersQuery = model('UserModel')->where('status', 'active');

return Pdf::fromSchema($usersQuery)
    ->title('Active System Users Report')
    ->subtitle('Generated for Q1 Audit')
    ->theme('emerald') // 'modern-blue', 'emerald', 'crimson', 'amber', 'indigo', 'slate', 'minimal-dark'
    ->columns([
        Column::make('id', '#')->width('8%')->align('center'),
        Column::make('name', 'Full Name')->width('32%'),
        Column::make('email', 'Email Address')->width('30%'),
        Column::make('created_at', 'Registered')->date('M d, Y')->width('15%'),
        Column::make('balance', 'Balance')->currency('USD')->sum()->align('right')->width('15%'),
    ])
    ->watermark('CONFIDENTIAL')
    ->preview();
```

## Custom Report Themes

```php
$customTheme = ReportTheme::make('Corporate')
    ->primary('#0f172a')
    ->secondary('#3b82f6')
    ->zebra('#f8fafc')
    ->font('Plus Jakarta Sans');

return Pdf::fromSchema($data)->theme($customTheme)->preview();
```

## Auto-Filters

Schema reports can automatically generate interactive filter controls. See [Preview Filtering](./filtering/schema-auto-filters).

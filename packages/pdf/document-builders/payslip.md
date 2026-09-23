# Employee Payslip

```php
use Jengo\Pdf\Pdf;

return Pdf::payslip('March 2026')
    ->employee([
        'id'         => 'EMP-042',
        'name'       => 'Ian Ochieng',
        'department' => 'Engineering',
        'designation'=> 'Lead Architect',
    ])
    ->addEarning('Basic Salary', 6500.00)
    ->addEarning('House Allowance', 1200.00)
    ->addDeduction('PAYE Tax', 1450.00)
    ->addDeduction('Health Insurance (SHIF)', 220.00)
    ->download();
```

# Certificate of Excellence & Achievement

The `Certificate` document builder generates formal certificates in landscape orientation with custom signatory blocks, seal styling, and achievement narratives.

```php
use Jengo\Pdf\Pdf;

return Pdf::certificate('Certificate of Completion')
    ->subtitle('Full-Stack Web Development Bootcamp')
    ->recipient('Jane Doe')
    ->presentationLine('This certificate is proudly awarded to')
    ->achievement('For exemplary completion of 120 hours of advanced architectural training with distinction.')
    ->number('CERT-2026-0891')
    ->issueDate('2026-09-29')
    ->addSignatory('Dr. Alan Turing', 'Program Director')
    ->addSignatory('Ada Lovelace', 'Lead Instructor')
    ->primaryColor('#1e40af')
    ->watermark('VERIFIED', opacity: 0.05)
    ->download('certificate-jane-doe.pdf');
```

---

## Fluent Configuration Options

| Method | Description |
| :--- | :--- |
| `->title(string $title)` | Main certificate headline (e.g. `Certificate of Excellence`). |
| `->subtitle(string $subtitle)` | Specialization or course track subtitle. |
| `->recipient(string $name)` | Name of the recipient. |
| `->presentationLine(string $line)` | Text preceding the recipient name (defaults to `This is proudly presented to`). |
| `->achievement(string $text)` | Paragraph describing the achievement or award details. |
| `->number(string $certNumber)` | Unique certificate serial / verification number. |
| `->issueDate(string $date)` | Date of issuance. |
| `->addSignatory(string $name, string $title)` | Append an authorized signatory with signature line. |
| `->signatories(array $signatories)` | Bulk override for signatories list. |

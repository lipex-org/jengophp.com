# Parameterized Prompt Templates

Create reusable, type-safe prompt templates with `{variable}` placeholders:

```php
use Jengo\Ai\Support\PromptTemplate;

$template = PromptTemplate::make('Summarize the following customer ticket for {agent_name} in {language}:\n\n"{ticket_body}"');

$prompt = $template->render([
    'agent_name'  => 'Sarah',
    'language'    => 'Spanish',
    'ticket_body' => 'Customer is having trouble syncing invoices with QuickBooks.',
]);

$response = ai($prompt)->text();
```

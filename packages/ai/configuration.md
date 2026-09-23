# Configuration

`jengo/ai` integrates natively with CodeIgniter 4's configuration engine. You can configure defaults in `app/Config/Ai.php` and override any setting via your `.env` file using standard CI4 dot-notation.

## Configuration File (`app/Config/Ai.php`)

```php
namespace Config;

use Jengo\Ai\Config\Ai as BaseAi;

class Ai extends BaseAi
{
    /**
     * Default AI Provider Driver
     * Options: 'openai', 'anthropic', 'gemini', 'deepseek', 'groq', 'openrouter', 'ollama'
     */
    public string $default = 'openai';

    /**
     * Provider API Credentials and Options
     */
    public array $providers = [
        'openai' => [
            'key'          => '',
            'organization' => null,
            'model'        => 'gpt-4o-mini',
            'base_url'     => 'https://api.openai.com/v1',
            'timeout'      => 30,
            'retry'        => 3,
        ],
        'anthropic' => [
            'key'      => '',
            'model'    => 'claude-3-5-sonnet-20241022',
            'base_url' => 'https://api.anthropic.com/v1',
            'timeout'  => 30,
            'retry'    => 2,
        ],
        'gemini' => [
            'key'      => '',
            'model'    => 'gemini-2.0-flash',
            'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
            'timeout'  => 30,
            'retry'    => 2,
        ],
        'deepseek' => [
            'key'      => '',
            'model'    => 'deepseek-chat',
            'base_url' => 'https://api.deepseek.com/v1',
            'timeout'  => 60,
            'retry'    => 2,
        ],
        'groq' => [
            'key'      => '',
            'model'    => 'llama-3.3-70b-versatile',
            'base_url' => 'https://api.groq.com/openai/v1',
            'timeout'  => 15,
            'retry'    => 2,
        ],
        'openrouter' => [
            'key'       => '',
            'model'     => 'openai/gpt-4o-mini',
            'base_url'  => 'https://openrouter.ai/api/v1',
            'site_url'  => '',
            'site_name' => 'Jengo AI',
            'timeout'   => 60,
            'retry'     => 2,
        ],
        'ollama' => [
            'base_url' => 'http://localhost:11434',
            'model'    => 'llama3.2',
            'timeout'  => 120,
            'retry'    => 1,
        ],
    ];

    /**
     * Global Generation Defaults
     */
    public array $defaults = [
        'temperature' => 0.7,
        'max_tokens'  => 2048,
        'max_steps'   => 5, // Maximum recursive tool-call steps in agentic mode
    ];
}
```

## Environment Variables (`.env`)

Leverage CodeIgniter 4's native dot-notation to populate credentials without custom environment variables:

```ini
# Default Provider
ai.default = 'openrouter'

# Provider API Keys & Defaults
ai.providers.openrouter.key = 'sk-or-v1-xxxxxxxxxxxxxxxxxxxx'
ai.providers.openrouter.model = 'anthropic/claude-3.5-sonnet'

ai.providers.openai.key = 'sk-proj-xxxxxxxxxxxxxxxxxxxx'
ai.providers.openai.model = 'gpt-4o-mini'

ai.providers.anthropic.key = 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxx'
ai.providers.gemini.key = 'AIzaSyxxxxxxxxxxxxxxxxxxxx'
ai.providers.deepseek.key = 'sk-xxxxxxxxxxxxxxxxxxxx'
ai.providers.groq.key = 'gsk_xxxxxxxxxxxxxxxxxxxx'

# Global Settings
ai.defaults.temperature = 0.7
ai.defaults.max_tokens = 2048
```

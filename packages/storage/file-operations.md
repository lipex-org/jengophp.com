# Basic File Operations

## Writing Files

```php
use Jengo\Storage\Storage;

// Write to default disk
Storage::put('documents/notes.txt', 'Contents here');

// Write to specific disk with visibility
Storage::disk('s3')->put('reports/2026.pdf', $pdfBinary, 'private');

// Memory-efficient stream writing
$stream = fopen('/path/to/large/file.zip', 'rb');
Storage::disk('s3')->writeStream('archives/backup.zip', $stream);
if (is_resource($stream)) {
    fclose($stream);
}

// Prepend or append text
Storage::prepend('logs/audit.log', "Timestamp: " . time() . "\n");
Storage::append('logs/audit.log', "Finished.\n");
```

## Reading Files

```php
// Read full content into memory
$content = Storage::get('documents/notes.txt');

// Stream reading for large assets
$resource = Storage::readStream('videos/clip.mp4');
```

## Existence and Metadata

```php
if (Storage::exists('avatars/user.jpg')) {
    $size      = Storage::size('avatars/user.jpg');         // Bytes
    $mimeType  = Storage::mimeType('avatars/user.jpg');     // image/jpeg
    $timestamp = Storage::lastModified('avatars/user.jpg'); // Timestamp
    $checksum  = Storage::checksum('avatars/user.jpg');     // SHA256 checksum
}

if (Storage::missing('drafts/document.docx')) {
    // Handle missing file
}
```

## Copying, Moving, and Deleting

```php
// Copy a file
Storage::copy('drafts/post.md', 'published/post.md');

// Move or rename a file
Storage::move('temp/invoice.pdf', 'invoices/INV-2026.pdf');

// Delete a single file or array of files
Storage::delete('invoices/INV-2026.pdf');
Storage::delete(['temp/1.tmp', 'temp/2.tmp']);
```

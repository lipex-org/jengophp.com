# Vue 3 Composition Adapter (`@jengo/storage/vue`)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useChunkedUpload } from '@jengo/storage/vue';

const selectedFile = ref<File | null>(null);

const {
    status,
    progress,
    result,
    error,
    isUploading,
    isPaused,
    start,
    pause,
    resume,
    abort,
} = useChunkedUpload({
    disk: 'public',
    folder: 'documents',
});

function onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    selectedFile.value = input.files?.[0] || null;
}
</script>

<template>
    <div>
        <input type="file" @change="onFileSelect" />
        <button :disabled="!selectedFile || isUploading" @click="selectedFile && start(selectedFile)">
            Start Upload
        </button>
        <button v-if="isUploading" @click="pause">Pause</button>
        <button v-if="isPaused" @click="resume">Resume</button>
        <button v-if="isUploading || isPaused" @click="abort">Abort</button>

        <div v-if="isUploading || isPaused">
            <progress :value="progress.percent" max="100"></progress>
            <p>{{ progress.percent }}% - {{ progress.speed }} - ETA: {{ progress.remainingSeconds }}s</p>
        </div>

        <p v-if="result">Uploaded: <a :href="result.url">{{ result.filename }}</a></p>
    </div>
</template>
```

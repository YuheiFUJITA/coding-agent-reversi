<template>
  <div class="control-panel flex flex-col sm:flex-row gap-4 items-center justify-center p-4">
    <button
      @click="$emit('newGame')"
      class="btn btn-primary px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg"
    >
      新規ゲーム
    </button>
    
    <button
      v-if="hasSavedGame"
      @click="$emit('resumeGame')"
      class="btn btn-secondary px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-lg"
    >
      続きから再開
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hasSavedGame: boolean;
}

interface Emits {
  (e: 'newGame'): void;
  (e: 'resumeGame'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.btn {
  min-width: 120px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.btn:active {
  transform: translateY(1px);
}

@media (max-width: 640px) {
  .control-panel {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>
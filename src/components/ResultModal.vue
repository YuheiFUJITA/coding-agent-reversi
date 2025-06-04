<template>
  <Teleport to="body">
    <div 
      v-if="isOpen"
      class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="handleOverlayClick"
    >
      <div 
        class="modal-content bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl"
        @click.stop
      >
        <h2 class="text-2xl font-bold text-center mb-6">ゲーム終了</h2>
        
        <div class="score-section mb-6">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-700"></div>
              <span class="font-semibold">黒</span>
            </div>
            <span class="text-2xl font-bold">{{ blackCount }}</span>
          </div>
          
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-white rounded-full border-2 border-gray-300"></div>
              <span class="font-semibold">白</span>
            </div>
            <span class="text-2xl font-bold">{{ whiteCount }}</span>
          </div>
        </div>
        
        <div class="result-section text-center mb-6">
          <div 
            :class="[
              'text-3xl font-bold mb-2',
              winner === 'black' ? 'text-gray-800' : 
              winner === 'white' ? 'text-gray-600' : 
              'text-gray-500'
            ]"
          >
            {{ winnerText }}
          </div>
          <div v-if="winner !== 'tie'" class="flex items-center justify-center gap-2">
            <div 
              :class="[
                'w-6 h-6 rounded-full border-2',
                winner === 'black' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              ]"
            ></div>
            <span class="text-lg">の勝利！</span>
          </div>
        </div>
        
        <div class="button-section flex flex-col gap-3">
          <button
            @click="$emit('newGame')"
            class="btn-primary w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            もう一度プレイ
          </button>
          
          <button
            @click="$emit('close')"
            class="btn-secondary w-full py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  isOpen: boolean;
  blackCount: number;
  whiteCount: number;
  winner: 'black' | 'white' | 'tie';
}

interface Emits {
  (e: 'close'): void;
  (e: 'newGame'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const winnerText = computed(() => {
  switch (props.winner) {
    case 'black':
      return '黒の勝利';
    case 'white':
      return '白の勝利';
    case 'tie':
      return '引き分け';
    default:
      return '';
  }
});

const handleOverlayClick = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  backdrop-filter: blur(2px);
}

.modal-content {
  animation: modal-appear 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes modal-appear {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.btn-primary:active,
.btn-secondary:active {
  transform: translateY(1px);
}

@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
}
</style>
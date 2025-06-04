<template>
  <div 
    class="stone-container w-full h-full flex items-center justify-center cursor-pointer"
    @click="$emit('click')"
  >
    <div 
      v-if="stone !== 0"
      :class="[
        'stone rounded-full transition-all duration-300',
        stoneClasses,
        animationClass
      ]"
    >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import type { Stone } from '../utils/ReversiLogic';

interface Props {
  stone: Stone;
  isValidMove?: boolean;
  animate?: 'appear' | 'flip' | null;
}

interface Emits {
  (e: 'click'): void;
}

const props = withDefaults(defineProps<Props>(), {
  isValidMove: false,
  animate: null
});

defineEmits<Emits>();

const animationClass = ref('');

const stoneClasses = computed(() => {
  const baseClasses = 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2';
  
  if (props.stone === 1) {
    // 黒石
    return `${baseClasses} bg-gray-800 border-gray-700 shadow-lg`;
  } else if (props.stone === 2) {
    // 白石
    return `${baseClasses} bg-white border-gray-300 shadow-lg`;
  }
  
  return baseClasses;
});

// アニメーション処理
watch(() => props.animate, (newAnimate) => {
  if (newAnimate === 'appear') {
    animationClass.value = 'stone-appear';
    setTimeout(() => {
      animationClass.value = '';
    }, 300);
  } else if (newAnimate === 'flip') {
    animationClass.value = 'stone-flip';
    setTimeout(() => {
      animationClass.value = '';
    }, 600);
  }
});
</script>

<style scoped>
.stone-container {
  position: relative;
}

.stone-container:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.stone-container.valid-move::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  border: 2px dashed rgba(0, 0, 0, 0.5);
}
</style>
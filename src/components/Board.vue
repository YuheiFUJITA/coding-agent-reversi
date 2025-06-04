<template>
  <div class="board-container flex flex-col items-center justify-center p-4">
    <div 
      class="board grid grid-cols-8 gap-1 bg-green-700 p-2 rounded-lg shadow-2xl"
      :style="{ width: boardSize + 'px', height: boardSize + 'px' }"
    >
      <div
        v-for="(row, rowIndex) in board"
        :key="`row-${rowIndex}`"
        class="contents"
      >
        <div
          v-for="(stone, colIndex) in row"
          :key="`cell-${rowIndex}-${colIndex}`"
          :class="[
            'board-cell bg-green-600 border border-green-800 flex items-center justify-center',
            isValidMove(rowIndex, colIndex) ? 'valid-move cursor-pointer hover:bg-green-500' : ''
          ]"
          @click="handleCellClick(rowIndex, colIndex)"
        >
          <Stone 
            :stone="stone"
            :animate="getStoneAnimation(rowIndex, colIndex)"
            @click="handleCellClick(rowIndex, colIndex)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Stone from './Stone.vue';
import type { Board, Stone as StoneType, Position } from '../utils/ReversiLogic';

interface Props {
  board: Board;
  currentTurn: StoneType;
  validMoves: Position[];
  lastMove?: Position | null;
  flippedStones?: Position[];
}

interface Emits {
  (e: 'move', position: Position): void;
}

const props = withDefaults(defineProps<Props>(), {
  lastMove: null,
  flippedStones: () => []
});

const emit = defineEmits<Emits>();

const boardSize = ref(320);

// レスポンシブなボードサイズ計算
const calculateBoardSize = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const maxSize = Math.min(windowWidth * 0.9, windowHeight * 0.6);
  boardSize.value = Math.max(280, Math.min(480, maxSize));
};

onMounted(() => {
  calculateBoardSize();
  window.addEventListener('resize', calculateBoardSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateBoardSize);
});

// 有効な手かチェック
const isValidMove = (row: number, col: number): boolean => {
  return props.validMoves.some(move => move.row === row && move.col === col);
};

// セルクリック処理
const handleCellClick = (row: number, col: number) => {
  if (isValidMove(row, col)) {
    emit('move', { row, col });
  }
};

// 石のアニメーション状態を取得
const getStoneAnimation = (row: number, col: number): 'appear' | 'flip' | null => {
  // 最後に置いた石
  if (props.lastMove && props.lastMove.row === row && props.lastMove.col === col) {
    return 'appear';
  }
  
  // ひっくり返った石
  if (props.flippedStones?.some(pos => pos.row === row && pos.col === col)) {
    return 'flip';
  }
  
  return null;
};
</script>

<style scoped>
.board-cell {
  aspect-ratio: 1;
  min-height: 30px;
  position: relative;
}

.valid-move {
  position: relative;
}

.valid-move::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  border: 2px dashed rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

@media (max-width: 640px) {
  .board-cell {
    min-height: 25px;
  }
  
  .valid-move::after {
    width: 12px;
    height: 12px;
  }
}
</style>
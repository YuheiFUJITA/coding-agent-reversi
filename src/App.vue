<template>
  <div class="app min-h-screen bg-gradient-to-br from-green-400 to-green-600 flex flex-col">
    <!-- ヘッダー -->
    <header class="app-header text-center py-4 px-4">
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
        黒白リバーシ
      </h1>
      
      <!-- ターン表示 -->
      <div v-if="!gameState.gameOver" class="turn-indicator">
        <div class="flex items-center justify-center gap-3 bg-white bg-opacity-20 rounded-lg px-4 py-2 inline-flex">
          <div 
            :class="[
              'w-6 h-6 rounded-full border-2',
              gameState.turn === BLACK ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
            ]"
          ></div>
          <span class="text-white font-semibold">
            {{ gameState.turn === BLACK ? '黒' : '白' }}の手番
          </span>
        </div>
        
        <!-- パス表示 -->
        <div v-if="showPassMessage" class="mt-2">
          <div class="bg-yellow-500 bg-opacity-90 text-yellow-900 px-3 py-1 rounded-lg text-sm font-semibold">
            有効な手がありません - パスしました
          </div>
        </div>
      </div>
      
      <!-- スコア表示 -->
      <div class="score-display flex justify-center gap-6 mt-3">
        <div class="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-1">
          <div class="w-4 h-4 bg-gray-800 rounded-full border border-gray-700"></div>
          <span class="text-white font-semibold">{{ stones.black }}</span>
        </div>
        <div class="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-1">
          <div class="w-4 h-4 bg-white rounded-full border border-gray-300"></div>
          <span class="text-white font-semibold">{{ stones.white }}</span>
        </div>
      </div>
    </header>
    
    <!-- メインコンテンツ -->
    <main class="flex-1 flex flex-col items-center justify-center">
      <Board
        :board="gameState.board"
        :current-turn="gameState.turn"
        :valid-moves="validMoves"
        :last-move="lastMove"
        :flipped-stones="flippedStones"
        @move="handleMove"
      />
    </main>
    
    <!-- コントロールパネル -->
    <footer class="app-footer pb-4">
      <ControlPanel
        :has-saved-game="hasSavedGame"
        @new-game="startNewGame"
        @resume-game="resumeGame"
      />
    </footer>
    
    <!-- 結果モーダル -->
    <ResultModal
      :is-open="showResultModal"
      :black-count="stones.black"
      :white-count="stones.white"
      :winner="winner"
      @close="showResultModal = false"
      @new-game="startNewGame"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Board from './components/Board.vue';
import ControlPanel from './components/ControlPanel.vue';
import ResultModal from './components/ResultModal.vue';
import {
  createInitialBoard,
  getValidMoves,
  makeMove,
  isGameOver,
  getWinner,
  countStones,
  getOpponentColor,
  BLACK,
  type GameState,
  type Position
} from './utils/ReversiLogic';
import {
  saveGameState,
  loadGameState,
  clearSavedGameState
} from './utils/CookieUtil';

// ゲーム状態
const gameState = ref<GameState>({
  board: createInitialBoard(),
  turn: BLACK,
  gameOver: false,
  timestamp: Date.now()
});

// UI状態
const showResultModal = ref(false);
const showPassMessage = ref(false);
const lastMove = ref<Position | null>(null);
const flippedStones = ref<Position[]>([]);
const hasSavedGame = ref(false);

// 計算プロパティ
const validMoves = computed(() => {
  if (gameState.value.gameOver) return [];
  return getValidMoves(gameState.value.board, gameState.value.turn);
});

const stones = computed(() => countStones(gameState.value.board));

const winner = computed(() => {
  if (!gameState.value.gameOver) return 'tie';
  return getWinner(gameState.value.board);
});

// 手を打つ
const handleMove = async (position: Position) => {
  if (gameState.value.gameOver) return;
  
  try {
    const result = makeMove(gameState.value.board, position.row, position.col, gameState.value.turn);
    
    // 状態更新
    gameState.value.board = result.board;
    gameState.value.timestamp = Date.now();
    lastMove.value = position;
    flippedStones.value = result.flipped;
    
    // アニメーション用の少し待つ
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // ターン交代
    changeTurn();
    
  } catch (error) {
    console.error('Invalid move:', error);
  }
};

// ターン交代とパス処理
const changeTurn = async () => {
  const nextTurn = getOpponentColor(gameState.value.turn);
  gameState.value.turn = nextTurn;
  
  // 次のプレイヤーの有効な手をチェック
  const nextValidMoves = getValidMoves(gameState.value.board, nextTurn);
  
  if (nextValidMoves.length === 0) {
    // パス処理
    showPassMessage.value = true;
    setTimeout(() => {
      showPassMessage.value = false;
    }, 2000);
    
    // さらにターン交代
    const afterPassTurn = getOpponentColor(nextTurn);
    const afterPassValidMoves = getValidMoves(gameState.value.board, afterPassTurn);
    
    if (afterPassValidMoves.length === 0) {
      // 両者とも手が無い場合、ゲーム終了
      endGame();
    } else {
      // 元のプレイヤーのターンに戻る
      gameState.value.turn = afterPassTurn;
    }
  }
  
  // ゲーム終了チェック
  if (isGameOver(gameState.value.board)) {
    endGame();
  } else {
    // ゲーム状態を保存
    saveGameState(gameState.value);
  }
};

// ゲーム終了処理
const endGame = () => {
  gameState.value.gameOver = true;
  clearSavedGameState();
  
  // 少し待ってからモーダル表示
  setTimeout(() => {
    showResultModal.value = true;
  }, 500);
};

// 新規ゲーム開始
const startNewGame = () => {
  gameState.value = {
    board: createInitialBoard(),
    turn: BLACK,
    gameOver: false,
    timestamp: Date.now()
  };
  
  showResultModal.value = false;
  lastMove.value = null;
  flippedStones.value = [];
  clearSavedGameState();
  checkSavedGame();
};

// ゲーム再開
const resumeGame = () => {
  const savedState = loadGameState();
  if (savedState) {
    gameState.value = savedState;
    lastMove.value = null;
    flippedStones.value = [];
  }
};

// 保存されたゲームの存在チェック
const checkSavedGame = () => {
  hasSavedGame.value = loadGameState() !== null;
};

// 初期化
onMounted(() => {
  checkSavedGame();
});

// ゲーム状態が変わったら保存状態をチェック
watch(() => gameState.value.timestamp, () => {
  checkSavedGame();
});
</script>

<style scoped>
.app {
  touch-action: none;
  overscroll-behavior: none;
}

.app-header {
  padding-top: env(safe-area-inset-top, 1rem);
  padding-left: env(safe-area-inset-left, 1rem);
  padding-right: env(safe-area-inset-right, 1rem);
}

.app-footer {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
  padding-left: env(safe-area-inset-left, 1rem);
  padding-right: env(safe-area-inset-right, 1rem);
}

@media (max-width: 640px) {
  .app-header h1 {
    font-size: 1.875rem;
  }
  
  .score-display {
    gap: 1rem;
  }
}
</style>
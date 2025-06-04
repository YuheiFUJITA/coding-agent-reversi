// リバーシのゲームロジック

export type Stone = 0 | 1 | 2; // 0: 空, 1: 黒, 2: 白
export type Board = Stone[][];
export type Position = { row: number; col: number };

export interface GameState {
  board: Board;
  turn: Stone;
  gameOver: boolean;
  timestamp: number;
}

export const BOARD_SIZE = 8;
export const EMPTY = 0;
export const BLACK = 1;
export const WHITE = 2;

// 8方向の移動ベクトル
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

/**
 * 初期盤面を作成
 */
export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: BOARD_SIZE }, () => 
    Array.from({ length: BOARD_SIZE }, () => EMPTY)
  );
  
  // 中央4マスに初期配置
  const mid = BOARD_SIZE / 2;
  board[mid - 1][mid - 1] = WHITE;
  board[mid - 1][mid] = BLACK;
  board[mid][mid - 1] = BLACK;
  board[mid][mid] = WHITE;
  
  return board;
}

/**
 * 指定位置が盤面内かチェック
 */
function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

/**
 * 指定位置・方向で石を挟めるかチェック
 */
function canFlipInDirection(
  board: Board, 
  row: number, 
  col: number, 
  dRow: number, 
  dCol: number, 
  color: Stone
): Position[] {
  const opponent = color === BLACK ? WHITE : BLACK;
  const toFlip: Position[] = [];
  
  let r = row + dRow;
  let c = col + dCol;
  
  // 最初は相手の石でなければならない
  if (!isValidPosition(r, c) || board[r][c] !== opponent) {
    return [];
  }
  
  // 相手の石を収集
  while (isValidPosition(r, c) && board[r][c] === opponent) {
    toFlip.push({ row: r, col: c });
    r += dRow;
    c += dCol;
  }
  
  // 最後に自分の石があるかチェック
  if (isValidPosition(r, c) && board[r][c] === color) {
    return toFlip;
  }
  
  return [];
}

/**
 * 指定位置に石を置けるかチェック
 */
export function isValidMove(board: Board, row: number, col: number, color: Stone): boolean {
  if (!isValidPosition(row, col) || board[row][col] !== EMPTY) {
    return false;
  }
  
  return DIRECTIONS.some(([dRow, dCol]) => 
    canFlipInDirection(board, row, col, dRow, dCol, color).length > 0
  );
}

/**
 * 有効な手をすべて取得
 */
export function getValidMoves(board: Board, color: Stone): Position[] {
  const validMoves: Position[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isValidMove(board, row, col, color)) {
        validMoves.push({ row, col });
      }
    }
  }
  
  return validMoves;
}

/**
 * 石を置いて、ひっくり返す
 */
export function makeMove(board: Board, row: number, col: number, color: Stone): { board: Board, flipped: Position[] } {
  if (!isValidMove(board, row, col, color)) {
    throw new Error('Invalid move');
  }
  
  const newBoard = board.map(row => [...row]);
  const allFlipped: Position[] = [];
  
  newBoard[row][col] = color;
  
  DIRECTIONS.forEach(([dRow, dCol]) => {
    const toFlip = canFlipInDirection(board, row, col, dRow, dCol, color);
    toFlip.forEach(pos => {
      newBoard[pos.row][pos.col] = color;
      allFlipped.push(pos);
    });
  });
  
  return { board: newBoard, flipped: allFlipped };
}

/**
 * 石の数を数える
 */
export function countStones(board: Board): { black: number, white: number } {
  let black = 0;
  let white = 0;
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === BLACK) black++;
      else if (board[row][col] === WHITE) white++;
    }
  }
  
  return { black, white };
}

/**
 * ゲーム終了判定
 */
export function isGameOver(board: Board): boolean {
  return getValidMoves(board, BLACK).length === 0 && 
         getValidMoves(board, WHITE).length === 0;
}

/**
 * 勝者判定
 */
export function getWinner(board: Board): 'black' | 'white' | 'tie' {
  const { black, white } = countStones(board);
  if (black > white) return 'black';
  if (white > black) return 'white';
  return 'tie';
}

/**
 * 相手の色を取得
 */
export function getOpponentColor(color: Stone): Stone {
  return color === BLACK ? WHITE : BLACK;
}
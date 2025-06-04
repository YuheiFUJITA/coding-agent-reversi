// Cookie管理ユーティリティ

import type { GameState } from './ReversiLogic';

const COOKIE_NAME = 'reversi_state';
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Cookieを設定
 */
export function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Cookieを取得
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Cookieを削除
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

/**
 * ゲーム状態をCookieに保存
 */
export function saveGameState(gameState: GameState): void {
  try {
    const jsonString = JSON.stringify(gameState);
    setCookie(COOKIE_NAME, jsonString, COOKIE_EXPIRY_DAYS);
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/**
 * Cookieからゲーム状態を復元
 */
export function loadGameState(): GameState | null {
  try {
    const cookieValue = getCookie(COOKIE_NAME);
    if (!cookieValue) return null;
    
    const gameState = JSON.parse(cookieValue) as GameState;
    
    // 基本的な構造チェック
    if (!gameState.board || 
        !Array.isArray(gameState.board) || 
        gameState.board.length !== 8 ||
        typeof gameState.turn !== 'number' ||
        typeof gameState.gameOver !== 'boolean' ||
        typeof gameState.timestamp !== 'number') {
      return null;
    }
    
    // 盤面の構造チェック
    for (const row of gameState.board) {
      if (!Array.isArray(row) || row.length !== 8) {
        return null;
      }
      for (const cell of row) {
        if (typeof cell !== 'number' || ![0, 1, 2].includes(cell)) {
          return null;
        }
      }
    }
    
    return gameState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/**
 * 保存されたゲーム状態を削除
 */
export function clearSavedGameState(): void {
  deleteCookie(COOKIE_NAME);
}
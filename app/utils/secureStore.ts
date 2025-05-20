// app/utils/secureStore.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userToken';
const PIN_KEY = 'userPIN';

/**
 * Stocke une valeur sous une clé donnée
 */
async function saveItem(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
  });
}

/**
 * Récupère une valeur stockée
 */
async function getItem(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

/**
 * Supprime une valeur stockée
 */
async function deleteItem(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}

// Fonctions dédiées :
export const saveToken = (token: string) => saveItem(TOKEN_KEY, token);
export const getToken = () => getItem(TOKEN_KEY);
export const deleteToken = () => deleteItem(TOKEN_KEY);

export const savePin = (pin: string) => saveItem(PIN_KEY, pin);
export const getPin = () => getItem(PIN_KEY);
export const deletePin = () => deleteItem(PIN_KEY);

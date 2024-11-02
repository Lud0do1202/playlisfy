import { LocalStorageKeys } from '../enums/local-storage-keys';

/**
 * A utility function to manage local storage entries with type safety.
 * It provides a getter and setter for accessing and modifying
 * the stored values associated with a specific key.
 *
 * @param key - The key under which the value is stored in local storage.
 * @returns An object with a getter and setter for the value.
 */
export const stored = <T = string>(key: LocalStorageKeys) => ({
  /**
   * Gets the stored value associated with the key from local storage.
   * Returns the value parsed as the specified type T, or null if not found.
   */
  get value(): T | null {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  },

  /**
   * Sets the stored value associated with the key in local storage.
   * If the provided value is null, the key is removed from local storage.
   * Otherwise, the value is stringified and stored.
   *
   * @param value - The value to be stored. Can be a string or null.
   */
  set value(value: string | null) {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
});

/**
 * Lưu dữ liệu vào localStorage với khóa xác định
 * @param key Tên khóa
 * @param data Dữ liệu cần lưu
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Đọc dữ liệu từ localStorage với khóa xác định
 * @param key Tên khóa
 * @param defaultValue Giá trị mặc định nếu không tìm thấy dữ liệu
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Xóa một mục khỏi localStorage
 * @param key Tên khóa
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Kiểm tra localStorage có sẵn hay không
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (_) {
    return false;
  }
}; 
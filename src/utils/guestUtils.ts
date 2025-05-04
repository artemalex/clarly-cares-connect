
/**
 * Utilities for handling guest user functionality
 */

// Generate and store a guest ID in localStorage if not already present
export const ensureGuestId = (): string => {
  const existingGuestId = localStorage.getItem('guest_id');
  
  if (existingGuestId) {
    return existingGuestId;
  }
  
  // Generate a new guest ID using crypto.randomUUID()
  const newGuestId = crypto.randomUUID();
  localStorage.setItem('guest_id', newGuestId);
  return newGuestId;
};

// Get the current guest ID from localStorage
export const getGuestId = (): string | null => {
  return localStorage.getItem('guest_id');
};

// Clear guest ID from localStorage (after migration)
export const clearGuestId = (): void => {
  localStorage.removeItem('guest_id');
};

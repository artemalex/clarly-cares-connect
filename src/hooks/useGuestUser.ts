
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

export function useGuestUser() {
  const [guestId, setGuestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initGuestUser = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is already logged in
        const { data: sessionData } = await supabase.auth.getSession();
        
        // If user is authenticated, don't use guest mode
        if (sessionData.session) {
          setIsLoading(false);
          return;
        }
        
        // Check for existing guest ID in localStorage
        let currentGuestId = localStorage.getItem('guest_id');
        
        // If no guest ID exists, create a new one
        if (!currentGuestId) {
          currentGuestId = `guest-${uuidv4()}`;
          localStorage.setItem('guest_id', currentGuestId);
        }
        
        // Register the guest with the backend to set up limits
        try {
          const { data, error } = await supabase.functions.invoke('guest-auth', {
            body: { guest_id: currentGuestId }
          });
          
          if (error) {
            console.error("Error authenticating guest:", error);
          }
        } catch (err) {
          console.error("Failed to authenticate guest:", err);
        }
        
        setGuestId(currentGuestId);
      } catch (error) {
        console.error("Error initializing guest user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initGuestUser();
  }, []);
  
  // Function to migrate guest data to a user account
  const migrateGuestData = async () => {
    try {
      if (!guestId) return false;
      
      const { data, error } = await supabase.functions.invoke('migrate-guest-data', {
        body: { guest_id: guestId }
      });
      
      if (error) {
        console.error("Error migrating guest data:", error);
        return false;
      }
      
      // Clear guest ID from localStorage after successful migration
      localStorage.removeItem('guest_id');
      setGuestId(null);
      
      return true;
    } catch (error) {
      console.error("Failed to migrate guest data:", error);
      return false;
    }
  };
  
  return {
    guestId,
    isGuest: !!guestId,
    isLoading,
    migrateGuestData
  };
}

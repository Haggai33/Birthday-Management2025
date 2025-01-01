import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Birthday, NewBirthday } from '../types/birthday';
import { 
  getBirthdays, 
  addBirthday as addBirthdayToFirebase, 
  updateBirthday as updateBirthdayInFirebase, 
  deleteBirthdays as deleteBirthdaysFromFirebase,
  archiveBirthday as archiveBirthdayInFirebase
} from '../services/firebase/birthdays';
import { useAuth } from './AuthContext';

interface BirthdayState {
  birthdays: Birthday[];
  isLoading: boolean;
  error: Error | null;
}

interface BirthdayContextType extends BirthdayState {
  addBirthday: (data: NewBirthday) => Promise<void>;
  updateBirthday: (id: string, data: Partial<NewBirthday>) => Promise<void>;
  deleteBirthdays: (ids: string[]) => Promise<void>;
  archiveBirthday: (id: string) => Promise<void>;
  refreshBirthdays: () => Promise<void>;
  clearError: () => void;
}

const BirthdayContext = createContext<BirthdayContextType | undefined>(undefined);

export function BirthdayProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<BirthdayState>({
    birthdays: [],
    isLoading: true, // Start with loading state
    error: null
  });

  const refreshBirthdays = useCallback(async () => {
    console.log('Refreshing birthdays list');
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const fetchedBirthdays = await getBirthdays();
      setState(prev => ({
        ...prev,
        birthdays: fetchedBirthdays,
        isLoading: false
      }));
      console.log('Successfully refreshed birthdays');
    } catch (error) {
      console.error('Error refreshing birthdays:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to fetch birthdays'),
        isLoading: false
      }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (user) {
      refreshBirthdays();
    }
  }, [user, refreshBirthdays]);

  const handleAddBirthday = useCallback(async (data: NewBirthday) => {
    console.log('Adding new birthday');
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await addBirthdayToFirebase(data);
      await refreshBirthdays();
      console.log('Successfully added birthday');
    } catch (error) {
      console.error('Error adding birthday:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to add birthday'),
        isLoading: false
      }));
      throw error;
    }
  }, [refreshBirthdays]);

  const handleUpdateBirthday = useCallback(async (id: string, data: Partial<NewBirthday>) => {
    console.log(`Updating birthday: ${id}`);
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await updateBirthdayInFirebase(id, data);
      await refreshBirthdays();
      console.log('Successfully updated birthday');
    } catch (error) {
      console.error('Error updating birthday:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to update birthday'),
        isLoading: false
      }));
      throw error;
    }
  }, [refreshBirthdays]);

  const handleDeleteBirthdays = useCallback(async (ids: string[]) => {
    console.log('Deleting birthdays:', ids);
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await deleteBirthdaysFromFirebase(ids);
      await refreshBirthdays();
      console.log('Successfully deleted birthdays');
    } catch (error) {
      console.error('Error deleting birthdays:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to delete birthdays'),
        isLoading: false
      }));
      throw error;
    }
  }, [refreshBirthdays]);

  const handleArchiveBirthday = useCallback(async (id: string) => {
    console.log(`Archiving birthday: ${id}`);
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await archiveBirthdayInFirebase(id);
      await refreshBirthdays();
      console.log('Successfully archived birthday');
    } catch (error) {
      console.error('Error archiving birthday:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to archive birthday'),
        isLoading: false
      }));
      throw error;
    }
  }, [refreshBirthdays]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <BirthdayContext.Provider
      value={{
        ...state,
        addBirthday: handleAddBirthday,
        updateBirthday: handleUpdateBirthday,
        deleteBirthdays: handleDeleteBirthdays,
        archiveBirthday: handleArchiveBirthday,
        refreshBirthdays,
        clearError
      }}
    >
      {children}
    </BirthdayContext.Provider>
  );
}

export function useBirthdays() {
  const context = useContext(BirthdayContext);
  if (context === undefined) {
    throw new Error('useBirthdays must be used within a BirthdayProvider');
  }
  return context;
}
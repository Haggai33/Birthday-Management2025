import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { BirthdayList } from '../components/birthdays/BirthdayList';
import { BirthdayStats } from '../components/birthdays/BirthdayStats';
import { BirthdayFilters } from '../components/birthdays/BirthdayFilters';
import { CSVImport } from '../components/birthdays/CSVImport';
import { CSVExport } from '../components/birthdays/CSVExport';
import { useBirthdays } from '../context/BirthdayContext';
import { useAuth } from '../context/AuthContext';
import { filterBirthdays } from '../utils/filterUtils';
import type { Birthday, BirthdayFilters as FilterType } from '../types/birthday';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    birthdays, 
    isLoading, 
    error,
    addBirthday,
    deleteBirthdays,
    archiveBirthday,
    updateBirthday,
    refreshBirthdays,
    clearError
  } = useBirthdays();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterType>({
    searchTerm: '',
    sortBy: 'nextBirthday',
    sortOrder: 'asc',
    timeframe: 'all'
  });

  useEffect(() => {
    refreshBirthdays();
  }, [refreshBirthdays]);

  const handleFilterChange = (newFilters: Partial<FilterType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleGenderUpdate = async (birthday: Birthday, gender: 'male' | 'female') => {
    try {
      await updateBirthday(birthday.id, { ...birthday, gender, needsGenderVerification: false });
    } catch (error) {
      console.error('Failed to update gender:', error);
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      console.log('Dashboard: Starting delete operation for IDs:', ids);
      await deleteBirthdays(ids);
      setSelectedIds(new Set());
      await refreshBirthdays();
      console.log('Dashboard: Delete operation completed successfully');
    } catch (error) {
      console.error('Dashboard: Delete operation failed:', error);
      if (error instanceof Error) {
        alert(`Failed to delete birthdays: ${error.message}`);
      }
    }
  };

  const handleArchive = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => archiveBirthday(id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to archive birthdays:', error);
    }
  };

  const handleImport = async (data: any[]) => {
    try {
      await Promise.all(data.map(birthday => addBirthday(birthday)));
    } catch (error) {
      console.error('Failed to import birthdays:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const filteredBirthdays = filterBirthdays(birthdays, filters);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
          <button
            onClick={clearError}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Birthday Dashboard</h1>
        <div className="flex space-x-4">
          <CSVImport onImport={handleImport} />
          <CSVExport birthdays={birthdays} />
          <button
            onClick={() => navigate('/add')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Birthday
          </button>
        </div>
      </div>

      <BirthdayStats birthdays={filteredBirthdays} />
      
      <BirthdayFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      <div className="bg-white rounded-lg shadow-md">
        <BirthdayList
          birthdays={filteredBirthdays}
          onEdit={(birthday) => navigate(`/edit/${birthday.id}`)}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onGenderUpdate={handleGenderUpdate}
          selectedIds={selectedIds}
          onSelect={(id, selected) => {
            const newIds = new Set(selectedIds);
            if (selected) {
              newIds.add(id);
            } else {
              newIds.delete(id);
            }
            setSelectedIds(newIds);
          }}
          onSelectAll={(selected) => {
            setSelectedIds(selected ? new Set(filteredBirthdays.map(b => b.id)) : new Set());
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;
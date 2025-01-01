import React, { useState } from 'react';
import { Upload, X, AlertTriangle } from 'lucide-react';
import { useGelt } from '../../context/GeltContext';
import Papa from 'papaparse';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CSVImportModal({ isOpen, onClose }: CSVImportModalProps) {
  const { setChildren } = useGelt();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      encoding: 'UTF-8',
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const children = results.data.map((row: any) => {
            // Try to parse full name if provided
            if (row['Full Name']) {
              const [firstName, ...lastNameParts] = row['Full Name'].trim().split(' ');
              return {
                id: crypto.randomUUID(),
                firstName,
                lastName: lastNameParts.join(' '),
                age: parseInt(row['Age'], 10)
              };
            }
            
            // Otherwise use separate first/last name fields
            return {
              id: crypto.randomUUID(),
              firstName: row['First Name']?.trim() || '',
              lastName: row['Last Name']?.trim() || '',
              age: parseInt(row['Age'], 10)
            };
          }).filter(child => 
            child.firstName && 
            child.age && 
            !isNaN(child.age) && 
            child.age >= 0
          );

          if (children.length === 0) {
            setError('No valid data found in CSV file');
            return;
          }

          setChildren(children);
          onClose();
        } catch (err) {
          setError('Failed to parse CSV file. Please check the format.');
        }
      },
      error: (error) => {
        setError(`Error reading file: ${error.message}`);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Import Children from CSV</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload a CSV file with the following columns:
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md text-sm">
            <p className="font-medium mb-2">Option 1:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>First Name</li>
              <li>Last Name</li>
              <li>Age</li>
            </ul>
            
            <p className="font-medium mt-4 mb-2">Option 2:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Full Name</li>
              <li>Age</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="block w-full">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
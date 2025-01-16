// src/components/birthdays/CSVImport.tsx

import React, { useState } from 'react';
import { Upload, X, AlertTriangle } from 'lucide-react';
import Papa from 'papaparse';
import { validateCSVHeaders, validateCSVRow } from '../../utils/validationUtils';
import type { NewBirthday } from '../../types/birthday';

interface CSVImportProps {
  onImport: (data: NewBirthday[]) => Promise<void>;
}

export function CSVImport({ onImport }: CSVImportProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      encoding: 'UTF-8',
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Validate headers
          const missingHeaders = validateCSVHeaders(results.meta.fields || []);
          if (missingHeaders.length > 0) {
            setError(`Missing required columns: ${missingHeaders.join(', ')}`);
            setIsProcessing(false);
            return;
          }

          // Validate and transform data
          const validData: NewBirthday[] = [];
          const errors: string[] = [];

          results.data.forEach((row: any, index) => {
            const validation = validateCSVRow(row, index);
            if (!validation.isValid) {
              errors.push(validation.error!);
              return;
            }

            validData.push({
              firstName: row['First Name'].trim(),
              lastName: row['Last Name'].trim(),
              birthDate: row['Birthday'],
              afterSunset: row['After Sunset']?.toLowerCase() === 'yes',
              gender: row['Gender']?.toLowerCase() || 'unknown',
              createdBy: "IMPORTED_VIA_CSV" // ✅ הוספת createdBy כדי שהמחיקה תעבוד
            });
          });

          if (errors.length > 0) {
            setError(`Validation errors:\n${errors.join('\n')}`);
            setIsProcessing(false);
            return;
          }

          // Import valid data
          onImport(validData)
            .then(() => {
              setIsModalOpen(false);
            })
            .catch((err) => {
              setError('Failed to import data: ' + (err.message || 'Unknown error'));
            })
            .finally(() => {
              setIsProcessing(false);
            });

        } catch (err) {
          setError('Failed to process CSV file: ' + (err instanceof Error ? err.message : 'Unknown error'));
          setIsProcessing(false);
        }
      },
      error: (error) => {
        setError('Error reading CSV file: ' + error.message);
        setIsProcessing(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
      >
        <Upload className="h-5 w-5 mr-2" />
        Import CSV
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Import from CSV</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Upload a CSV file with the following columns:
              </p>

              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>First Name (required)</li>
                  <li>Last Name (required)</li>
                  <li>Birthday (required, DD/MM/YYYY)</li>
                  <li>After Sunset (optional, Yes/No)</li>
                  <li>Gender (optional, Male/Female)</li>
                </ul>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <pre className="ml-3 text-sm text-red-600 whitespace-pre-wrap">{error}</pre>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="block w-full">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-yellow-50 file:text-yellow-700
                      hover:file:bg-yellow-100
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

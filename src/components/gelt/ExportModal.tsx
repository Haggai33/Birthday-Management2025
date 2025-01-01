import React from 'react';
import { FileJson, FileSpreadsheet, X } from 'lucide-react';
import { exportToJson, exportToExcel } from '../../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Export Data</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose your preferred export format:
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                exportToJson(data);
                onClose();
              }}
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
            >
              <FileJson className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">JSON Format</span>
              <span className="text-xs text-gray-500">Raw data format</span>
            </button>

            <button
              onClick={() => {
                exportToExcel(data);
                onClose();
              }}
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
            >
              <FileSpreadsheet className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">Excel Format</span>
              <span className="text-xs text-gray-500">Spreadsheet format</span>
            </button>
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
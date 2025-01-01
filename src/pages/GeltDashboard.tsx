import React, { useState } from 'react';
import { useGelt } from '../context/GeltContext';
import { Download, Upload, Save, List, RotateCcw } from 'lucide-react';
import { ImportFromListModal } from '../components/gelt/ImportFromListModal';
import { CSVImportModal } from '../components/gelt/CSVImportModal';
import { ExportModal } from '../components/gelt/ExportModal';
import { AgeGroups } from '../components/gelt/AgeGroups';
import { BudgetConfiguration } from '../components/gelt/budget/BudgetConfiguration';
import { ClearConfirmationModal } from '../components/gelt/ClearConfirmationModal';

export default function GeltDashboard() {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const { children, ageGroups, budgetConfig, calculation } = useGelt();

  const handleDownloadTemplate = () => {
    const template = [
      ['First Name', 'Last Name', 'Age'],
      ['ישראל', 'ישראלי', '25'],
      ['שרה', 'כהן', '18'],
      ['', '', ''],
      ['Full Name', 'Age', ''],
      ['ישראל ישראלי', '25', ''],
      ['שרה כהן', '18', '']
    ];

    const csv = template.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gelt-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getExportData = () => ({
    budget: {
      total: calculation.totalRequired,
      perParticipant: calculation.amountPerParticipant,
      participants: budgetConfig.participants,
      allowedOverflow: budgetConfig.allowedOverflowPercentage
    },
    ageGroups: ageGroups.map(group => ({
      ...group,
      childCount: calculation.groupTotals[group.id]?.childrenCount || 0,
      total: calculation.groupTotals[group.id]?.total || 0
    })),
    children: children.map(child => ({
      name: `${child.firstName} ${child.lastName}`,
      age: child.age,
      ageModified: child.originalAge !== undefined,
      originalAge: child.originalAge
    }))
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button 
          onClick={() => setShowImportModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <List className="h-5 w-5 mr-2" />
          Import From Dashboard
        </button>

        <button 
          onClick={() => setShowCSVModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <Upload className="h-5 w-5 mr-2" />
          Import CSV
        </button>

        <button 
          onClick={handleDownloadTemplate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Template
        </button>

        <button 
          onClick={() => setShowExportModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Save className="h-5 w-5 mr-2" />
          Export Data
        </button>

        <button
          onClick={() => setShowClearModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Clear All
        </button>
      </div>

      {/* Budget Configuration */}
      <BudgetConfiguration />

      {/* Age Groups */}
      <AgeGroups />

      <ImportFromListModal 
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <CSVImportModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={getExportData()}
      />

      <ClearConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
      />
    </div>
  );
}
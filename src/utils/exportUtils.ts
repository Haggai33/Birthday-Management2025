import * as XLSX from 'xlsx';
import type { AgeGroup, Child, BudgetConfig, BudgetCalculation } from '../types/gelt';

interface ExportData {
  budget: {
    total: number;
    perParticipant: number;
    participants: number;
    allowedOverflow: number;
  };
  ageGroups: (AgeGroup & {
    childCount: number;
    total: number;
  })[];
  children: {
    name: string;
    age: number;
    ageModified: boolean;
    originalAge?: number;
  }[];
}

export const exportToJson = (data: ExportData): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadFile(blob, 'gelt-distribution-export.json');
};

export const exportToExcel = (data: ExportData): void => {
  const workbook = XLSX.utils.book_new();

  // Budget Summary Sheet
  const budgetSheet = [
    ['Budget Summary'],
    ['Total Required', `₪${data.budget.total}`],
    ['Amount per Participant', `₪${data.budget.perParticipant}`],
    ['Number of Participants', data.budget.participants],
    ['Allowed Overflow', `${data.budget.allowedOverflow}%`],
    [],
    ['Age Groups'],
    ['Age Range', 'Amount per Child', 'Children Count', 'Total Amount', 'Included']
  ];

  data.ageGroups.forEach(group => {
    budgetSheet.push([
      `${group.minAge}-${group.maxAge}`,
      `₪${group.amountPerChild}`,
      group.childCount,
      `₪${group.total}`,
      group.isIncluded ? 'Yes' : 'No'
    ]);
  });

  // Children Sheet
  const childrenSheet = [
    ['Name', 'Age', 'Modified Age', 'Original Age']
  ];

  data.children.forEach(child => {
    childrenSheet.push([
      child.name,
      child.age,
      child.ageModified ? 'Yes' : 'No',
      child.originalAge || ''
    ]);
  });

  XLSX.utils.book_append_sheet(
    workbook, 
    XLSX.utils.aoa_to_sheet(budgetSheet), 
    'Budget Summary'
  );
  
  XLSX.utils.book_append_sheet(
    workbook, 
    XLSX.utils.aoa_to_sheet(childrenSheet), 
    'Children'
  );

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadFile(blob, 'gelt-distribution-export.xlsx');
};

const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
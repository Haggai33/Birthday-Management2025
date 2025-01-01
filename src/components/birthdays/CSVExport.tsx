import React from 'react';
import { Download, Mail } from 'lucide-react';
import { Birthday } from '../../types/birthday';
import Papa from 'papaparse';
import { format } from 'date-fns';

interface CSVExportProps {
  birthdays: Birthday[];
  filename?: string;
}

export function CSVExport({ birthdays, filename = 'birthdays' }: CSVExportProps) {
  const handleExport = () => {
    const data = birthdays.map(birthday => {
      const nextBirthdays = birthday.nextBirthdays || [];
      return {
        'ID': birthday.id,
        'First Name': birthday.firstName,
        'Last Name': birthday.lastName,
        'Birthday': format(new Date(birthday.birthDate), 'dd/MM/yyyy'),
        'After Sunset': birthday.afterSunset ? 'Yes' : 'No',
        'Gender': birthday.gender,
        'Hebrew Date': birthday.hebrewDate,
        'Next Birthday': birthday.nextBirthday ? format(new Date(birthday.nextBirthday), 'dd/MM/yyyy') : '',
        'Age': birthday.age,
        '+2 years': nextBirthdays[1] ? format(new Date(nextBirthdays[1]), 'dd/MM/yyyy') : '',
        '+3 years': nextBirthdays[2] ? format(new Date(nextBirthdays[2]), 'dd/MM/yyyy') : '',
        '+4 years': nextBirthdays[3] ? format(new Date(nextBirthdays[3]), 'dd/MM/yyyy') : '',
        '+5 years': nextBirthdays[4] ? format(new Date(nextBirthdays[4]), 'dd/MM/yyyy') : '',
        'Archived': birthday.archived ? 'Yes' : 'No',
        'Export Date': format(new Date(), 'dd/MM/yyyy HH:mm:ss')
      };
    });

    const csv = Papa.unparse(data, {
      encoding: 'UTF-8'
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleEmailBackup = () => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const totalBirthdays = birthdays.length;
    const activeBirthdays = birthdays.filter(b => !b.archived).length;
    const archivedBirthdays = birthdays.filter(b => b.archived).length;

    const mailtoLink = `mailto:?subject=Birthday Backup List - ${currentDate}&body=Birthday System Backup Summary:%0D%0A%0D%0A` +
      `Total Records: ${totalBirthdays}%0D%0A` +
      `Active Records: ${activeBirthdays}%0D%0A` +
      `Archived Records: ${archivedBirthdays}%0D%0A%0D%0A` +
      `Please download and save the birthday list using the Export CSV button, then attach it to this email.%0D%0A%0D%0A` +
      `Backup Date: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}%0D%0A%0D%0A` +
      `Developed by:%0D%0A` +
      `Chagai Yechiel%0D%0A` +
      `LinkedIn:%0D%0A` +
      `https://www.linkedin.com/in/chagai-yechiel/`;
    
    window.location.href = mailtoLink;
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleExport}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        <Download className="h-5 w-5 mr-2" />
        Export CSV
      </button>
      <button
        onClick={handleEmailBackup}
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        <Mail className="h-5 w-5 mr-2" />
        Email Backup
      </button>
    </div>
  );
}
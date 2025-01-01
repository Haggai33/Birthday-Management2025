import React, { useState } from 'react';
import { Users, Trash2, Edit, Search, Download, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBirthdays } from '../context/BirthdayContext';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { GenderVerificationModal } from '../components/birthdays/GenderVerificationModal';
import type { Birthday } from '../types/birthday';

function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { birthdays, deleteBirthdays, updateBirthday } = useBirthdays();
  const navigate = useNavigate();
  const [genderVerificationBirthday, setGenderVerificationBirthday] = useState<Birthday | null>(null);

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-600">You need administrator privileges to view this page.</p>
      </div>
    );
  }

  const filteredBirthdays = birthdays.filter(birthday =>
    Object.values(birthday).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this birthday?')) {
      try {
        await deleteBirthdays([id]);
      } catch (error) {
        console.error('Failed to delete birthday:', error);
      }
    }
  };

  const handleGenderUpdate = async (birthday: Birthday, gender: 'male' | 'female') => {
    try {
      await updateBirthday(birthday.id, { ...birthday, gender, needsGenderVerification: false });
      setGenderVerificationBirthday(null);
    } catch (error) {
      console.error('Failed to update gender:', error);
    }
  };

  const exportData = () => {
    const csvContent = [
      ['ID', 'First Name', 'Last Name', 'Birth Date', 'After Sunset', 'Gender'],
      ...filteredBirthdays.map(birthday => [
        birthday.id,
        birthday.firstName,
        birthday.lastName,
        birthday.birthDate,
        birthday.afterSunset ? 'Yes' : 'No',
        birthday.gender === 'unknown' ? '' : birthday.gender
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `birthdays-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
        </div>
        <button
          onClick={exportData}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Download className="h-5 w-5 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search database..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Birth Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  After Sunset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBirthdays.map((birthday) => (
                <tr key={birthday.id} className={`hover:bg-gray-50 ${
                  birthday.needsGenderVerification ? 'bg-yellow-50' : ''
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{birthday.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {birthday.firstName} {birthday.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(birthday.birthDate), 'dd/MM/yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {birthday.afterSunset ? 'Yes' : 'No'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {birthday.needsGenderVerification ? (
                        <button
                          onClick={() => setGenderVerificationBirthday(birthday)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800"
                        >
                          <UserCircle2 className="h-4 w-4 mr-1" />
                          Needs Verification
                        </button>
                      ) : (
                        <span className="text-sm text-gray-900 capitalize">
                          {birthday.gender}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleEdit(birthday.id)}
                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(birthday.id)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {genderVerificationBirthday && (
        <GenderVerificationModal
          birthday={genderVerificationBirthday}
          onClose={() => setGenderVerificationBirthday(null)}
          onUpdate={(gender) => handleGenderUpdate(genderVerificationBirthday, gender)}
        />
      )}
    </div>
  );
}

export default AdminPanel;
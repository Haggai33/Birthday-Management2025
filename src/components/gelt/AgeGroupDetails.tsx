// AgeGroupDetails.tsx
import React, { useState } from 'react';
import type { Child } from '../../types/gelt';
import { useGelt } from '../../context/GeltContext';
import { RefreshCw, X, Edit2 } from 'lucide-react';

interface AgeGroupDetailsProps {
  children: Child[];
  groupId: string;
  minAge: number;
  maxAge: number;
}

export function AgeGroupDetails({
  children,
  groupId,
  minAge,
  maxAge,
}: AgeGroupDetailsProps) {
  const { calculation, ageGroups, updateChildAge, resetChildAge, excludeChild, includedChildren } = useGelt();
  
  // Get group info
  const group = ageGroups.find((g) => g.id === groupId);
  const groupData = calculation.groupTotals[groupId];
  const amountPerChild = group?.amountPerChild || 0;
  const isIncluded = group?.isIncluded || false;
  const total = groupData?.total || 0;

  // Format currency
  const formatCurrency = (amount: number) => `₪${amount.toLocaleString()}`;

  // Sort children by age and then name
  const sortedChildren = [...children].sort((a, b) => {
    if (a.age === b.age) {
      return `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`
      );
    }
    return b.age - a.age;
  });

  return (
    <div className="border-t border-gray-200 bg-white rounded-b-lg">
      {/* Group summary */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900">
            Ages {minAge}-{maxAge}
            <span className="ml-2 text-sm text-gray-500">
              ({children.length} {children.length === 1 ? 'child' : 'children'})
            </span>
          </h3>
        </div>
        {isIncluded && amountPerChild > 0 && (
          <div className="mt-1 space-y-1">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Amount per child:</p>
              <p className="text-sm font-medium">
                {formatCurrency(amountPerChild)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Group total:</p>
              <p className="text-sm font-medium">{formatCurrency(total)}</p>
            </div>
            {calculation.totalRequired > 0 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Of total budget:</p>
                <p className="text-sm text-gray-600">
                  {((total / calculation.totalRequired) * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Children list */}
      <div className="px-4 py-2 max-h-60 overflow-y-auto">
        {children.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                {isIncluded && amountPerChild > 0 && (
                  <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                )}
                <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedChildren.map((child) => {
                const isExcluded = !includedChildren.has(child.id);
                const isModified = child.originalAge !== undefined;
                
                return (
                  <tr 
                    key={child.id} 
                    className={`hover:bg-gray-50 ${isModified ? 'bg-red-50' : ''} ${isExcluded ? 'opacity-50' : ''}`}
                  >
                    <td className="py-2 text-sm text-gray-900">
                      {child.firstName} {child.lastName}
                    </td>
                    <td className="py-2 text-sm text-gray-600 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span>{child.age}</span>
                        {isModified && (
                          <button
                            onClick={() => resetChildAge(child.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Reset age"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    {isIncluded && amountPerChild > 0 && (
                      <td className="py-2 text-sm text-gray-900 text-right">
                        {!isExcluded && formatCurrency(amountPerChild)}
                      </td>
                    )}
                    <td className="py-2 text-sm text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            const newAge = prompt('Enter new age:', child.age.toString());
                            if (newAge !== null) {
                              const age = parseInt(newAge, 10);
                              if (!isNaN(age) && age >= 0) {
                                updateChildAge(child.id, age);
                              }
                            }
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Edit age"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excludeChild(child.id, !isExcluded)}
                          className="text-gray-400 hover:text-gray-600"
                          title={isExcluded ? "Include child" : "Exclude child"}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {isIncluded && amountPerChild > 0 && (
              <tfoot className="border-t border-gray-200 font-medium">
                <tr>
                  <td colSpan={2} className="py-2 text-sm text-gray-900">
                    Total
                  </td>
                  <td className="py-2 text-sm text-gray-900 text-right">
                    {formatCurrency(total)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        ) : (
          <p className="text-sm text-gray-500 py-4 text-center">
            No children in this age group
          </p>
        )}
      </div>
    </div>
  );
}
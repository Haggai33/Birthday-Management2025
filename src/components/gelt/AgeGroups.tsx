// AgeGroups.tsx
import React, { useState } from 'react';
import {
  Settings2,
  ChevronDown,
  ChevronRight,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useGelt } from '../../context/GeltContext';
import { AgeGroupDetails } from './AgeGroupDetails';
import { AgeGroupSettingsModal } from './AgeGroupSettingsModal';
import type { AgeGroup } from '../../types/gelt';

export function AgeGroups() {
  const {
    children,
    ageGroups,
    calculation,
    customGroupSettings,
    saveCustomSettings,
    clearCustomSettings,
  } = useGelt();

  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<AgeGroup | null>(null);

  // Format currency helper
  const formatCurrency = (amount: number) => `₪${amount.toLocaleString()}`;

  return (
    <div className="mt-8">
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Age Groups Settings
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={saveCustomSettings}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Save className="h-4 w-4 mr-1" />
            Save Settings
          </button>
          {customGroupSettings && (
            <button
              onClick={clearCustomSettings}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset to Default
            </button>
          )}
        </div>
      </div>

      {/* Groups grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ageGroups.map((group) => {
          const groupData = calculation.groupTotals[group.id];
          const childrenCount = groupData?.childrenCount || 0;
          const groupTotal = groupData?.total || 0;
          const isActive = group.isIncluded && group.amountPerChild > 0;

          return (
            <div
              key={group.id}
              className={`relative rounded-lg shadow-sm ${
                isActive ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="px-4 py-3">
                {/* Group header */}
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`font-medium ${
                      isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    Ages {group.minAge}-{group.maxAge}
                    <span
                      className={`ml-2 text-sm ${
                        isActive ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      ({childrenCount})
                    </span>
                  </h3>
                  <button
                    onClick={() => setEditingGroup(group)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    title="Edit Group Settings"
                  >
                    <Settings2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                {/* Group stats */}
                <div className="space-y-1">
                  {isActive && (
                    <>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(group.amountPerChild)} per child
                      </p>
                      {childrenCount > 0 && (
                        <p className="text-sm font-medium text-gray-900">
                          Total: {formatCurrency(groupTotal)}
                        </p>
                      )}
                    </>
                  )}
                  {!isActive && (
                    <p className="text-sm text-gray-500">
                      {group.isIncluded ? 'Amount not set' : 'Not included'}
                    </p>
                  )}
                </div>

                {/* Children toggle */}
                {childrenCount > 0 && (
                  <button
                    onClick={() =>
                      setExpandedGroup(
                        expandedGroup === group.id ? null : group.id
                      )
                    }
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 inline-flex items-center"
                  >
                    {expandedGroup === group.id ? (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Hide Children
                      </>
                    ) : (
                      <>
                        <ChevronRight className="h-4 w-4 mr-1" />
                        Show Children
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Children details */}
              {expandedGroup === group.id && (
                <div className="border-t">
                  <AgeGroupDetails
                    children={children.filter(
                      (child) =>
                        child.age >= group.minAge && child.age <= group.maxAge
                    )}
                    groupId={group.id}
                    minAge={group.minAge}
                    maxAge={group.maxAge}
                  />
                </div>
              )}

              {/* Budget indicator */}
              {isActive && groupTotal > 0 && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 opacity-60"
                  style={{
                    width: `${(groupTotal / calculation.totalRequired) * 100}%`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Settings modal */}
      {editingGroup && (
        <AgeGroupSettingsModal
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
        />
      )}
    </div>
  );
}

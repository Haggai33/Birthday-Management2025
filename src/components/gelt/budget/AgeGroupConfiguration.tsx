// AgeGroupSettingsModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { useGelt } from '../../context/GeltContext';
import { BudgetInput } from './budget/BudgetInput';
import type { AgeGroup } from '../../types/gelt';

interface AgeGroupSettingsModalProps {
  group: AgeGroup;
  onClose: () => void;
}

export function AgeGroupSettingsModal({ group, onClose }: AgeGroupSettingsModalProps) {
  const { ageGroups, updateAgeGroup, calculation } = useGelt();
  const [tempGroup, setTempGroup] = useState(group);
  const [error, setError] = useState<string | null>(null);

  // Reset error when group changes
  useEffect(() => {
    setError(null);
  }, [tempGroup]);

  const groupData = calculation.groupTotals[group.id];
  const childrenCount = groupData?.childrenCount || 0;

  const handleAmountChange = (value: number) => {
    // Round to nearest 5
    const roundedAmount = Math.round(value / 5) * 5;
    setTempGroup(prev => ({
      ...prev,
      amountPerChild: roundedAmount
    }));
  };

  // Calculate impact of changes
  const calculateImpact = () => {
    if (!tempGroup.isIncluded || !group.isIncluded) return null;
    
    const currentTotal = childrenCount * group.amountPerChild;
    const newTotal = childrenCount * tempGroup.amountPerChild;
    const difference = newTotal - currentTotal;
    
    return {
      difference,
      percentageChange: currentTotal > 0 ? (difference / currentTotal) * 100 : 0
    };
  };

  const impact = calculateImpact();

  // Validate age range against other groups
  const validateAgeRange = (minAge: number, maxAge: number): boolean => {
    if (minAge >= maxAge) {
      setError('Minimum age must be less than maximum age');
      return false;
    }

    const hasOverlap = ageGroups.some(otherGroup => {
      if (otherGroup.id === group.id) return false;
      return (
        (minAge >= otherGroup.minAge && minAge <= otherGroup.maxAge) ||
        (maxAge >= otherGroup.minAge && maxAge <= otherGroup.maxAge) ||
        (minAge <= otherGroup.minAge && maxAge >= otherGroup.maxAge)
      );
    });

    if (hasOverlap) {
      setError('Age ranges cannot overlap with other groups');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateAgeRange(tempGroup.minAge, tempGroup.maxAge)) return;

    updateAgeGroup({
      ...tempGroup,
      name: `${tempGroup.minAge}-${tempGroup.maxAge}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Edit Age Group {group.minAge}-{group.maxAge}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Include toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Include in Budget</label>
            <input
              type="checkbox"
              checked={tempGroup.isIncluded}
              onChange={(e) => {
                setTempGroup(prev => ({
                  ...prev,
                  isIncluded: e.target.checked,
                  amountPerChild: e.target.checked ? prev.amountPerChild : 0
                }));
              }}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          {/* Age range inputs */}
          <div className="grid grid-cols-2 gap-4">
            <BudgetInput
              label="Min Age"
              value={tempGroup.minAge}
              onChange={(value) => {
                setTempGroup(prev => ({ ...prev, minAge: value }));
                validateAgeRange(value, tempGroup.maxAge);
              }}
              min={0}
              max={tempGroup.maxAge - 1}
              error={error?.includes('minimum') ? error : undefined}
            />
            <BudgetInput
              label="Max Age"
              value={tempGroup.maxAge}
              onChange={(value) => {
                setTempGroup(prev => ({ ...prev, maxAge: value }));
                validateAgeRange(tempGroup.minAge, value);
              }}
              min={tempGroup.minAge + 1}
              error={error?.includes('maximum') ? error : undefined}
            />
          </div>

          {/* Amount per child input */}
          <BudgetInput
            label="Amount per Child (₪)"
            value={tempGroup.amountPerChild}
            onChange={handleAmountChange}
            min={0}
            disabled={!tempGroup.isIncluded}
            roundToFive={true}
            description="Amount will be rounded to nearest ₪5"
          />

          {/* Current allocation info */}
          {childrenCount > 0 && (
            <div className="bg-gray-50 rounded-md p-3">
              <h4 className="text-sm font-medium text-gray-900">Current Statistics</h4>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  Children in group: {childrenCount}
                </p>
                {impact && (
                  <p className={`text-sm ${impact.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Total change: {impact.difference > 0 ? '+' : ''}
                    ₪{impact.difference.toLocaleString()} 
                    ({impact.percentageChange > 0 ? '+' : ''}
                    {impact.percentageChange.toFixed(1)}%)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!!error}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X, TrendingUp, AlertTriangle, Settings2 } from 'lucide-react';
import { useGelt } from '../../../context/GeltContext';
import { BudgetInput } from './BudgetInput';
import type { AgeGroup } from '../../../types/gelt';

interface BudgetUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  previousBudget: {
    total: number;
    perParticipant: number;
  };
  currentBudget: {
    total: number;
    perParticipant: number;
  };
  adjustedGroups: Array<{
    group: AgeGroup;
    currentAmount: number;
    newAmount: number;
  }>;
}

export function BudgetUpdateModal({
  isOpen,
  onClose,
  onConfirm,
  previousBudget,
  currentBudget,
  adjustedGroups
}: BudgetUpdateModalProps) {
  const { budgetConfig, updateBudgetConfig } = useGelt();
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
  const [tempConfig, setTempConfig] = useState(budgetConfig);

  if (!isOpen) return null;

  // Calculate change details
  const totalDiff = currentBudget.total - previousBudget.total;
  const percentageChange = ((currentBudget.total - previousBudget.total) / previousBudget.total) * 100;
  const isIncrease = totalDiff > 0;

  // Format currency
  const formatCurrency = (amount: number) => `₪${amount.toLocaleString()}`;

  // Handle budget config changes
  const handleConfigChange = (key: keyof typeof budgetConfig, value: number) => {
    setTempConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle final save
  const handleSave = () => {
    updateBudgetConfig(tempConfig);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className={`h-6 w-6 ${isIncrease ? 'text-green-600' : 'text-red-600'}`} />
            <h2 className="text-xl font-semibold text-gray-900">
              Budget {isIncrease ? 'Increase' : 'Decrease'} Detected
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Budget settings toggle */}
          <button
            onClick={() => setShowBudgetSettings(!showBudgetSettings)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Settings2 className="h-4 w-4" />
            <span>
              {showBudgetSettings ? 'Hide Budget Settings' : 'Show Budget Settings'}
            </span>
          </button>

          {/* Budget settings form */}
          {showBudgetSettings && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Budget Settings</h3>
              <div className="grid grid-cols-1 gap-4">
                <BudgetInput
                  label="Number of Participants"
                  value={tempConfig.participants}
                  onChange={(value) => handleConfigChange('participants', value)}
                  min={1}
                  description="Total number of people contributing to the budget"
                />
                
                <BudgetInput
                  label="Amount per Participant (₪)"
                  value={tempConfig.amountPerParticipant}
                  onChange={(value) => handleConfigChange('amountPerParticipant', value)}
                  min={0}
                  roundToFive={true}
                  description="Will be rounded to nearest ₪5"
                />
                
                <BudgetInput
                  label="Allowed Overflow (%)"
                  value={tempConfig.allowedOverflowPercentage}
                  onChange={(value) => handleConfigChange('allowedOverflowPercentage', value)}
                  min={0}
                  max={100}
                  description="Maximum allowed budget overrun"
                />
              </div>
            </div>
          )}

          {/* Budget change summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">
              The budget will {isIncrease ? 'increase' : 'decrease'} by{' '}
              {Math.abs(percentageChange).toFixed(1)}%
            </p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-gray-500">Per participant:</span>{' '}
                <span className="font-medium">
                  {formatCurrency(previousBudget.perParticipant)} →{' '}
                  {formatCurrency(currentBudget.perParticipant)}
                </span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Total budget:</span>{' '}
                <span className="font-medium">
                  {formatCurrency(previousBudget.total)} →{' '}
                  {formatCurrency(currentBudget.total)}
                </span>
              </p>
            </div>
          </div>

          {/* Group adjustments */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Proposed adjustments for age groups:
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg divide-y">
              {adjustedGroups.map(({ group, currentAmount, newAmount }) => {
                const amountDiff = newAmount - currentAmount;
                const amountChangePercent = ((newAmount - currentAmount) / currentAmount) * 100;

                return (
                  <div key={group.id} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Ages {group.minAge}-{group.maxAge}
                      </p>
                      <p className="text-xs text-gray-500">Per child amount</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        amountDiff > 0 ? 'text-green-600' : 
                        amountDiff < 0 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {formatCurrency(currentAmount)} → {formatCurrency(newAmount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {amountDiff > 0 ? '+' : ''}{formatCurrency(amountDiff)}{' '}
                        ({amountChangePercent > 0 ? '+' : ''}
                        {amountChangePercent.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`
                px-4 py-2 text-white rounded-md flex items-center
                ${isIncrease ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
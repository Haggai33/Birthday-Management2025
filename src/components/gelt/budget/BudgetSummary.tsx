// BudgetSummary.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { BudgetCalculation } from '../../../types/gelt';
import { useGelt } from '../../../context/GeltContext';

interface BudgetSummaryProps {
  calculation: BudgetCalculation;
}

export function BudgetSummary({ calculation }: BudgetSummaryProps) {
  const { ageGroups } = useGelt();
  
  // Format currency
  const formatCurrency = (amount: number) => `₪${amount.toLocaleString()}`;
  
  // Format percentage
  const formatPercentage = (amount: number, total: number) => 
    `${((amount / total) * 100).toFixed(1)}%`;

  // Get active groups (groups with children)
  const activeGroups = ageGroups.filter(group => 
    group.isIncluded && calculation.groupTotals[group.id]?.childrenCount > 0
  );

  const isOverBudget = calculation.totalRequired > calculation.maxAllowed;

  return (
    <div className="space-y-4">
      {/* Budget breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Required</p>
          <p className="text-lg font-medium">
            {formatCurrency(calculation.totalRequired)}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Per Participant</p>
          <p className="text-lg font-medium">
            {formatCurrency(calculation.amountPerParticipant)}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">With Max Overflow</p>
          <p className="text-lg font-medium">
            {formatCurrency(calculation.maxAllowed)}
          </p>
        </div>
      </div>

      {/* Group distributions */}
      <div className="mt-6 hidden">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Distribution by Age Group</h3>
        <div className="space-y-2">
          {activeGroups.map(group => {
            const groupData = calculation.groupTotals[group.id];
            const percentage = (groupData.total / calculation.totalRequired) * 100;
            
            return (
              <div key={group.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Ages {group.minAge}-{group.maxAge}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({groupData.childrenCount} children)
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatCurrency(groupData.total)}
                  </p>
                  <p className="text-xs text-gray-500">
                    ({percentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Distribution bar */}
        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
          {activeGroups.map(group => {
            const groupData = calculation.groupTotals[group.id];
            const percentage = (groupData.total / calculation.totalRequired) * 100;
            
            return (
              <div
                key={group.id}
                className={`h-full float-left ${
                  isOverBudget ? 'bg-red-500/60' : 'bg-green-500/60'
                }`}
                style={{ width: `${percentage}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Warnings */}
      {isOverBudget && (
        <div className="mt-4 p-3 bg-red-50 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 ml-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Budget Warning</h3>
            <p className="text-sm text-red-700 mt-1">
              Required budget exceeds maximum allowed amount by{' '}
              {formatCurrency(calculation.totalRequired - calculation.maxAllowed)}
            </p>
            <ul className="mt-2 list-disc list-inside text-sm text-red-600">
              <li>Add more participants</li>
              <li>Increase allowed overflow percentage</li>
              <li>Adjust amounts per child in some groups</li>
            </ul>
          </div>
        </div>
      )}

      {activeGroups.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-700">
            No active age groups with children. Add children or adjust group settings.
          </p>
        </div>
      )}
    </div>
  );
}
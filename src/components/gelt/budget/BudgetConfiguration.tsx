// BudgetConfiguration.tsx
import React from 'react';
import { useGelt } from '../../../context/GeltContext';
import { BudgetInput } from './BudgetInput';
import { BudgetSummary } from './BudgetSummary';

export function BudgetConfiguration() {
  const { budgetConfig, updateBudgetConfig, calculation } = useGelt();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Budget Configuration
      </h2>

      {/* Required budget info - Compact version */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">Total Required Budget:</p>
        <p className="text-lg font-medium">
          ₪{calculation.totalRequired.toLocaleString()}
        </p>
      </div>

      {/* Configuration inputs - Single row grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <BudgetInput
            label="Number of Participants"
            value={budgetConfig.participants}
            onChange={(value) => updateBudgetConfig({ participants: value })}
            min={1}
            description="Number of people sharing the budget"
          />
        </div>
        <div>
          <BudgetInput
            label="Allowed Overflow (%)"
            value={budgetConfig.allowedOverflowPercentage}
            onChange={(value) =>
              updateBudgetConfig({ allowedOverflowPercentage: value })
            }
            min={0}
            max={100}
            description="Maximum allowed budget flexibility"
          />
        </div>
      </div>

      {/* Amount per participant result - More compact design */}
      <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-blue-900">
            Required Amount per Participant
          </p>
          <p className="text-xs text-blue-700">
            (Total budget divided by {budgetConfig.participants} participant
            {budgetConfig.participants !== 1 ? 's' : ''})
          </p>
        </div>
        <p className="text-xl font-medium text-blue-900">
          ₪{calculation.amountPerParticipant.toLocaleString()}
        </p>
      </div>

      {/* Budget summary */}
      <div className="mt-4">
        <BudgetSummary calculation={calculation} />
      </div>
    </div>
  );
}

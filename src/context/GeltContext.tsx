// GeltContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type {
  AgeGroup,
  Child,
  BudgetConfig,
  BudgetCalculation,
} from '../types/gelt';

// Default values
export const DEFAULT_AGE_GROUPS: AgeGroup[] = [
  {
    id: '1',
    name: '18-21',
    minAge: 18,
    maxAge: 21,
    amountPerChild: 40,
    isIncluded: true,
  },
  {
    id: '2',
    name: '13-17',
    minAge: 13,
    maxAge: 17,
    amountPerChild: 30,
    isIncluded: true,
  },
  {
    id: '3',
    name: '10-12',
    minAge: 10,
    maxAge: 12,
    amountPerChild: 20,
    isIncluded: true,
  },
  {
    id: '4',
    name: '7-9',
    minAge: 7,
    maxAge: 9,
    amountPerChild: 10,
    isIncluded: true,
  },
  {
    id: '5',
    name: '3-6',
    minAge: 3,
    maxAge: 6,
    amountPerChild: 5,
    isIncluded: true,
  },
  {
    id: '6',
    name: '0-2',
    minAge: 0,
    maxAge: 2,
    amountPerChild: 0,
    isIncluded: true,
  },
];

export const DEFAULT_BUDGET_CONFIG: BudgetConfig = {
  participants: 10,
  allowedOverflowPercentage: 10,
};

interface GeltContextType {
  children: Child[];
  ageGroups: AgeGroup[];
  budgetConfig: BudgetConfig;
  calculation: BudgetCalculation;
  customGroupSettings: AgeGroup[] | null;
  includedChildren: Set<string>;
  setChildren: (children: Child[]) => void;
  updateAgeGroup: (group: AgeGroup) => void;
  updateBudgetConfig: (config: Partial<BudgetConfig>) => void;
  updateChildAge: (childId: string, newAge: number) => void;
  resetChildAge: (childId: string) => void;
  excludeChild: (childId: string, exclude: boolean) => void;
  calculateBudget: () => void;
  resetToDefaults: () => void;
  saveCustomSettings: () => void;
  clearCustomSettings: () => void;
}

const GeltContext = createContext<GeltContextType | undefined>(undefined);

export function GeltProvider({
  children: childrenProp,
}: {
  children: React.ReactNode;
}) {
  const [childList, setChildList] = useState<Child[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>(DEFAULT_AGE_GROUPS);
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(DEFAULT_BUDGET_CONFIG);
  const [customGroupSettings, setCustomGroupSettings] = useState<AgeGroup[] | null>(null);
  const [includedChildren, setIncludedChildren] = useState<Set<string>>(new Set());
  const [calculation, setCalculation] = useState<BudgetCalculation>({
    totalRequired: 0,
    amountPerParticipant: 0,
    maxAllowed: 0,
    groupTotals: {},
  });

  // Initialize includedChildren with all child IDs
  useEffect(() => {
    setIncludedChildren(new Set(childList.map(child => child.id)));
  }, [childList]);

  const updateChildAge = useCallback((childId: string, newAge: number) => {
    setChildList(prev => prev.map(child => {
      if (child.id === childId) {
        return {
          ...child,
          originalAge: child.originalAge === undefined ? child.age : child.originalAge,
          age: newAge
        };
      }
      return child;
    }));
  }, []);

  const resetChildAge = useCallback((childId: string) => {
    setChildList(prev => prev.map(child => {
      if (child.id === childId && child.originalAge !== undefined) {
        const { originalAge, ...rest } = child;
        return {
          ...rest,
          age: originalAge
        };
      }
      return child;
    }));
  }, []);

  const excludeChild = useCallback((childId: string, exclude: boolean) => {
    setIncludedChildren(prev => {
      const next = new Set(prev);
      if (exclude) {
        next.delete(childId);
      } else {
        next.add(childId);
      }
      return next;
    });
  }, []);

  const calculateBudget = useCallback(() => {
    const groupTotals: Record<string, { childrenCount: number; total: number }> = {};
    let totalRequired = 0;

    ageGroups.forEach((group) => {
      if (group.isIncluded) {
        const groupChildren = childList.filter(
          (child) => 
            includedChildren.has(child.id) &&
            child.age >= group.minAge && 
            child.age <= group.maxAge
        );

        const groupTotal = group.amountPerChild * groupChildren.length;
        groupTotals[group.id] = {
          childrenCount: groupChildren.length,
          total: groupTotal,
        };

        totalRequired += groupTotal;
      }
    });

    const amountPerParticipant =
      budgetConfig.participants > 0
        ? Math.ceil(totalRequired / budgetConfig.participants)
        : 0;

    const maxAllowed =
      totalRequired * (1 + budgetConfig.allowedOverflowPercentage / 100);

    setCalculation({
      totalRequired,
      amountPerParticipant,
      maxAllowed,
      groupTotals,
    });
  }, [ageGroups, childList, budgetConfig, includedChildren]);

  const updateAgeGroup = useCallback((updatedGroup: AgeGroup) => {
    setAgeGroups(prev => 
      prev.map(group => group.id === updatedGroup.id ? updatedGroup : group)
    );
  }, []);

  const updateBudgetConfig = useCallback((config: Partial<BudgetConfig>) => {
    setBudgetConfig(prev => ({ ...prev, ...config }));
  }, []);

  const saveCustomSettings = useCallback(() => {
    setCustomGroupSettings([...ageGroups]);
  }, [ageGroups]);

  const clearCustomSettings = useCallback(() => {
    setCustomGroupSettings(null);
    setAgeGroups(DEFAULT_AGE_GROUPS);
  }, []);

  const resetToDefaults = useCallback(() => {
    setChildList([]);
    setAgeGroups(DEFAULT_AGE_GROUPS);
    setBudgetConfig(DEFAULT_BUDGET_CONFIG);
    setCustomGroupSettings(null);
    setIncludedChildren(new Set());
  }, []);

  // Recalculate budget when relevant data changes
  useEffect(() => {
    calculateBudget();
  }, [calculateBudget]);

  return (
    <GeltContext.Provider
      value={{
        children: childList,
        ageGroups,
        budgetConfig,
        calculation,
        customGroupSettings,
        includedChildren,
        setChildren: setChildList,
        updateAgeGroup,
        updateBudgetConfig,
        updateChildAge,
        resetChildAge,
        excludeChild,
        calculateBudget,
        resetToDefaults,
        saveCustomSettings,
        clearCustomSettings,
      }}
    >
      {childrenProp}
    </GeltContext.Provider>
  );
}

export function useGelt() {
  const context = useContext(GeltContext);
  if (context === undefined) {
    throw new Error('useGelt must be used within a GeltProvider');
  }
  return context;
}
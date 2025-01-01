export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}

export interface AgeGroup {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  amountPerChild: number;
  isIncluded: boolean;
}

export interface BudgetConfig {
  participants: number;
  allowedOverflowPercentage: number;
}

export interface BudgetCalculation {
  totalRequired: number;          // התקציב הכולל הדרוש
  amountPerParticipant: number;   // הסכום לכל משתתף
  maxAllowed: number;             // כולל חריגה מותרת
  groupTotals: Record<string, {   // סיכום לכל קבוצה
    childrenCount: number;
    total: number;
  }>;
}
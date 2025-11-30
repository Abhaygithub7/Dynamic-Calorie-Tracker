export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum Goal {
  CUT = 'Cut (Lose Fat)',
  MAINTAIN = 'Maintain',
  BULK = 'Bulk (Gain Muscle)'
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary',
  LIGHTLY_ACTIVE = 'Lightly Active',
  MODERATELY_ACTIVE = 'Moderately Active',
  VERY_ACTIVE = 'Very Active',
  EXTRA_ACTIVE = 'Extra Active'
}

export interface UserProfile {
  age: number;
  gender: Gender;
  weight: number; // kg
  height: number; // cm
  activityLevel: ActivityLevel;
  goal: Goal;
  bodyTypeDescription?: string; // e.g., Ectomorph, Endomorph
}

export interface DietPlan {
  targetCalories: number;
  targetProtein: number;
  advice: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
}

export interface DailyLog {
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
}

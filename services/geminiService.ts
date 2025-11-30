import { Type } from "@google/genai";
import { UserProfile } from "../types";

// Helper to strip code fences if Gemini returns markdown
const cleanText = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

const callGeminiApi = async (prompt: string, schema?: any) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, schema }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(cleanText(data.text));
  } catch (error) {
    console.error("Failed to call Gemini API:", error);
    throw error;
  }
};

export const generateDietPlan = async (profile: UserProfile): Promise<
  { targetCalories: number; targetProtein: number; advice: string }
> => {
  const prompt = `
    Calculate the daily calorie and protein target for a user with the following stats:
    Age: ${profile.age}
    Gender: ${profile.gender}
    Weight: ${profile.weight}kg
    Height: ${profile.height}cm
    Activity Level: ${profile.activityLevel}
    Goal: ${profile.goal}
    Body Type/Notes: ${profile.bodyTypeDescription || 'Standard'}

    Return a JSON object with targetCalories (integer), targetProtein (integer in grams), and a short advice string (max 20 words).
    The advice should be motivational and specific to their goal.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      targetCalories: { type: Type.NUMBER },
      targetProtein: { type: Type.NUMBER },
      advice: { type: Type.STRING }
    },
    required: ["targetCalories", "targetProtein", "advice"]
  };

  return callGeminiApi(prompt, schema);
};

import { indianFoodDB } from "../data/indianFoodDB";

export const estimateFood = async (description: string): Promise<{ name: string; calories: number; protein: number }> => {
  // 1. Check Local DB
  const normalizedInput = description.toLowerCase().trim();

  // Simple keyword matching
  // We look for the food item where the input contains one of its keywords
  // OR one of the keywords is contained in the input (for partial matches like "2 roti")
  const localMatch = indianFoodDB.find(item =>
    item.keywords.some(keyword => normalizedInput.includes(keyword))
  );

  if (localMatch) {


    // Simple multiplier logic (very basic)
    // If input contains numbers like "2", "3", multiply the stats
    const numberMatch = normalizedInput.match(/(\d+)/);
    let multiplier = 1;
    if (numberMatch) {
      multiplier = parseInt(numberMatch[0]);
    }

    return {
      name: `${localMatch.name} (${multiplier > 1 ? multiplier + 'x' : localMatch.servingSize})`,
      calories: localMatch.calories * multiplier,
      protein: localMatch.protein * multiplier
    };
  }

  // 2. Fallback to Gemini API
  const prompt = `
    Estimate the calories and protein for: "${description}".
    Return a JSON object with name (short display name), calories (number), and protein (number in grams).
    Be conservative but realistic.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      calories: { type: Type.NUMBER },
      protein: { type: Type.NUMBER }
    },
    required: ["name", "calories", "protein"]
  };

  return callGeminiApi(prompt, schema);
};
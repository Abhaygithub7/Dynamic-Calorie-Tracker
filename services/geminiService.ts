import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";

const getAi = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("API Key missing. Please set VITE_API_KEY in .env.local");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to strip code fences if Gemini returns markdown
const cleanText = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const generateDietPlan = async (profile: UserProfile): Promise<
  { targetCalories: number; targetProtein: number; advice: string }
> => {
  const ai = getAi();

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

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          targetCalories: { type: Type.NUMBER },
          targetProtein: { type: Type.NUMBER },
          advice: { type: Type.STRING }
        },
        required: ["targetCalories", "targetProtein", "advice"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(cleanText(text));
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
    console.log(`Using local DB for: ${description} -> ${localMatch.name}`);

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
  const ai = getAi();

  const prompt = `
    Estimate the calories and protein for: "${description}".
    Return a JSON object with name (short display name), calories (number), and protein (number in grams).
    Be conservative but realistic.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER }
        },
        required: ["name", "calories", "protein"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(cleanText(text));
};
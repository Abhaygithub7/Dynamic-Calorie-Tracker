import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { UserProfile } from "../types";
import { indianFoodDB } from "../data/indianFoodDB";

// Initialize Gemini API
// Note: In a production app, you should proxy this through a backend to hide the key.
// For this local demo/MVP, client-side is acceptable.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || '');

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// Helper to strip code fences if Gemini returns markdown
const cleanText = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const generateDietPlan = async (profile: UserProfile): Promise<
  { targetCalories: number; targetProtein: number; advice: string }
> => {
  if (!API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY. Please check your .env.local file.");
  }

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
    type: SchemaType.OBJECT,
    properties: {
      targetCalories: { type: SchemaType.NUMBER },
      targetProtein: { type: SchemaType.NUMBER },
      advice: { type: SchemaType.STRING }
    },
    required: ["targetCalories", "targetProtein", "advice"]
  } as any;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const response = result.response;
    const text = response.text();
    return JSON.parse(cleanText(text));
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate diet plan.");
  }
};

export const estimateFood = async (description: string): Promise<{ name: string; calories: number; protein: number }> => {
  // 1. Check Local DB
  const normalizedInput = description.toLowerCase().trim();

  // Simple keyword matching
  const localMatch = indianFoodDB.find(item =>
    item.keywords.some(keyword => normalizedInput.includes(keyword))
  );

  if (localMatch) {
    // Simple multiplier logic
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
  if (!API_KEY) {
    // Fallback if no key is present, just to prevent crashing if they haven't set it up yet for food
    console.warn("No API Key for food estimation, returning placeholder.");
    return { name: description, calories: 0, protein: 0 };
  }

  const prompt = `
    Estimate the calories and protein for: "${description}".
    Return a JSON object with name (short display name), calories (number), and protein (number in grams).
    Be conservative but realistic.
  `;

  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      name: { type: SchemaType.STRING },
      calories: { type: SchemaType.NUMBER },
      protein: { type: SchemaType.NUMBER }
    },
    required: ["name", "calories", "protein"]
  } as any;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const response = result.response;
    const text = response.text();
    return JSON.parse(cleanText(text));
  } catch (error) {
    console.error("Gemini API Error (Food):", error);
    throw new Error("Failed to estimate food.");
  }
};
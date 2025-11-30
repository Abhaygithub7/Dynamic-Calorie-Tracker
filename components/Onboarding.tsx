import React, { useState } from 'react';
import { UserProfile, Gender, Goal, ActivityLevel } from '../types';
import { generateDietPlan } from '../services/geminiService';

interface OnboardingProps {
  onComplete: (profile: UserProfile, plan: { targetCalories: number; targetProtein: number; advice: string }) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<UserProfile>({
    age: 25,
    gender: Gender.MALE,
    weight: 70,
    height: 175,
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    goal: Goal.MAINTAIN,
    bodyTypeDescription: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const plan = await generateDietPlan(formData);
      onComplete(formData, plan);
    } catch (e) {
      setError('Failed to generate plan. Please check your API key and try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const InputClass = "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition placeholder-gray-400";
  const LabelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="max-w-md mx-auto glass-card p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Build Your Avatar
      </h2>

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
          <h3 className="text-lg font-semibold text-primary">Basic Stats</h3>
          <div>
            <label className={LabelClass}>Gender</label>
            <select
              className={InputClass}
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
            >
              {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LabelClass}>Age</label>
              <input type="number" className={InputClass} value={formData.age} onChange={e => setFormData({ ...formData, age: Number(e.target.value) })} />
            </div>
            <div>
              <label className={LabelClass}>Height (cm)</label>
              <input type="number" className={InputClass} value={formData.height} onChange={e => setFormData({ ...formData, height: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className={LabelClass}>Current Weight (kg)</label>
            <input type="number" className={InputClass} value={formData.weight} onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })} />
          </div>
          <button onClick={handleNext} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover transition mt-4">Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
          <h3 className="text-lg font-semibold text-primary">Lifestyle & Goals</h3>
          <div>
            <label className={LabelClass}>Activity Level</label>
            <select
              className={InputClass}
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
            >
              {Object.values(ActivityLevel).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className={LabelClass}>Your Goal</label>
            <select
              className={InputClass}
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value as Goal })}
            >
              {Object.values(Goal).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className={LabelClass}>Body Type / Notes</label>
            <textarea
              className={InputClass}
              placeholder="e.g., I build muscle easily, I have a slow metabolism..."
              value={formData.bodyTypeDescription}
              onChange={(e) => setFormData({ ...formData, bodyTypeDescription: e.target.value })}
              rows={3}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button onClick={handleBack} className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-600 transition">Back</button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex justify-center items-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Generate Plan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;

import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { UserProfile, DietPlan } from './types';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  const handleOnboardingComplete = (profile: UserProfile, plan: DietPlan) => {
    setUserProfile(profile);
    setDietPlan(plan);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your profile and plan?")) {
        setUserProfile(null);
        setDietPlan(null);
    }
  };

  return (
    <div className="min-h-screen w-full text-gray-100 bg-gray-900">
      {!userProfile || !dietPlan ? (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      ) : (
        <Dashboard 
            userProfile={userProfile} 
            dietPlan={dietPlan} 
            onReset={handleReset} 
        />
      )}
    </div>
  );
};

export default App;

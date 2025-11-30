import React, { useState, useEffect, useRef } from 'react';
import StickFigure from './StickFigure';
import { DailyLog, DietPlan, UserProfile, FoodItem } from '../types';
import { estimateFood } from '../services/geminiService';

interface DashboardProps {
    userProfile: UserProfile;
    dietPlan: DietPlan;
    onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, dietPlan, onReset }) => {
    const [log, setLog] = useState<DailyLog>({
        foods: [],
        totalCalories: 0,
        totalProtein: 0
    });

    const [foodInput, setFoodInput] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');

    // Percentage of goal
    const caloriePercentage = log.totalCalories / dietPlan.targetCalories;
    const proteinPercentage = log.totalProtein / dietPlan.targetProtein;

    // Scroll to bottom on new food
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [log.foods]);

    const handleAddFood = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!foodInput.trim()) return;

        setIsAdding(true);
        setError('');
        try {
            const estimated = await estimateFood(foodInput);
            const newFood: FoodItem = {
                id: Date.now().toString(),
                ...estimated
            };

            setLog(prev => ({
                foods: [...prev.foods, newFood],
                totalCalories: prev.totalCalories + newFood.calories,
                totalProtein: prev.totalProtein + newFood.protein
            }));
            setFoodInput('');
        } catch (err) {
            setError('Could not identify food. Try being more specific.');
        } finally {
            setIsAdding(false);
        }
    };

    const removeFood = (id: string) => {
        setLog(prev => {
            const foodToRemove = prev.foods.find(f => f.id === id);
            if (!foodToRemove) return prev;
            return {
                foods: prev.foods.filter(f => f.id !== id),
                totalCalories: prev.totalCalories - foodToRemove.calories,
                totalProtein: prev.totalProtein - foodToRemove.protein
            };
        });
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 shadow-sm p-4 z-10 flex justify-between items-center border-b border-gray-700">
                <div>
                    <h1 className="text-xl font-black text-white tracking-tighter">BEEF<span className="text-red-600">UP</span></h1>
                    <p className="text-xs text-gray-400">{userProfile.goal} Plan</p>
                </div>
                <button onClick={onReset} className="text-xs text-gray-400 hover:text-gray-600 underline">
                    Reset Data
                </button>
            </header>

            <main className="flex-1 overflow-hidden flex flex-col md:flex-row">

                {/* Visual Area */}
                <div className="flex-1 flex flex-col justify-center items-center p-4 bg-gradient-to-b from-gray-800 to-gray-900 relative">
                    <div className="absolute top-4 right-4 text-right">
                        <p className="text-sm font-bold text-gray-500">TARGET</p>
                        <p className="text-2xl font-bold text-white">{dietPlan.targetCalories} <span className="text-sm font-normal text-gray-400">kcal</span></p>
                        <p className="text-sm text-primary font-medium">{dietPlan.targetProtein}g Protein</p>
                    </div>

                    <StickFigure percentage={caloriePercentage} />

                    <div className="w-full max-w-md mt-8 space-y-2">
                        <div className="flex justify-between text-sm font-medium mb-1">
                            <span className="text-gray-300">Calories ({Math.round(caloriePercentage * 100)}%)</span>
                            <span className={caloriePercentage > 1.1 ? "text-red-500" : "text-gray-300"}>
                                {Math.round(log.totalCalories)} / {dietPlan.targetCalories}
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${caloriePercentage > 1.1 ? 'bg-red-500' : caloriePercentage > 0.9 ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                style={{ width: `${Math.min(caloriePercentage * 100, 100)}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Protein</span>
                            <span>{Math.round(log.totalProtein)} / {dietPlan.targetProtein}g</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-blue-400 transition-all duration-500"
                                style={{ width: `${Math.min(proteinPercentage * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 max-w-md text-center italic">
                        "{dietPlan.advice}"
                    </div>
                </div>

                {/* Interaction Area */}
                <div className="md:w-96 bg-gray-800 border-l border-gray-700 flex flex-col h-1/2 md:h-full shadow-2xl rounded-t-3xl md:rounded-none">

                    {/* Food List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={logContainerRef}>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Today's Log</h3>
                        {log.foods.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                <p>Empty stomach, skinny frame.</p>
                                <p className="text-sm">Add a meal to grow!</p>
                            </div>
                        )}
                        {log.foods.map(food => (
                            <div key={food.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg group hover:bg-gray-600 transition">
                                <div>
                                    <p className="font-semibold text-gray-200">{food.name}</p>
                                    <p className="text-xs text-gray-400">{food.protein}g Protein</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-300">{food.calories}</span>
                                    <button
                                        onClick={() => removeFood(food.id)}
                                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-gray-800 border-t border-gray-700">
                        <form onSubmit={handleAddFood} className="relative">
                            <input
                                type="text"
                                className="w-full pl-4 pr-12 py-4 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-primary focus:bg-gray-700 transition outline-none shadow-sm border border-gray-600 placeholder-gray-400"
                                placeholder="What did you eat? (e.g. 2 eggs)"
                                value={foodInput}
                                onChange={(e) => setFoodInput(e.target.value)}
                                disabled={isAdding}
                            />
                            <button
                                type="submit"
                                disabled={isAdding || !foodInput.trim()}
                                className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-white rounded-lg hover:bg-primary-hover disabled:bg-gray-600 transition flex items-center justify-center"
                            >
                                {isAdding ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                )}
                            </button>
                        </form>
                        {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;

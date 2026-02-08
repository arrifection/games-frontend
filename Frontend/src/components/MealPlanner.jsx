import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import Card from "./ui/Card";
import { getPlan, savePlan } from "../services/api";

const MealPlanner = forwardRef(({ macroTargets, patientId, onError, onSuccess }, ref) => {
    const emptyDay = { breakfast: [], snack: [], lunch: [], dinner: [] };

    const [weekPlan, setWeekPlan] = useState({
        "Monday": { ...emptyDay },
        "Tuesday": { ...emptyDay },
        "Wednesday": { ...emptyDay },
        "Thursday": { ...emptyDay },
        "Friday": { ...emptyDay },
        "Saturday": { ...emptyDay },
        "Sunday": { ...emptyDay }
    });

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [currentDay, setCurrentDay] = useState("Monday");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Load plan on mount or when patientId changes
    useEffect(() => {
        if (patientId) {
            const load = async () => {
                setLoading(true);
                const response = await getPlan(patientId);
                if (response.success && response.data.days) {
                    setWeekPlan(prev => ({ ...prev, ...response.data.days }));
                }
                setLoading(false);
            };
            load();
        }
    }, [patientId]);

    // Current Day Data
    const meals = weekPlan[currentDay] || emptyDay;

    // Default targets
    const targets = macroTargets || {
        carbs: 200, protein: 150, fat: 65, calories: 2000
    };

    const mealConfig = [
        { key: "breakfast", label: "Breakfast", icon: "🌅", color: "bg-orange-100 border-orange-900 text-orange-900" },
        { key: "snack", label: "Snack", icon: "🍎", color: "bg-green-100 border-green-900 text-green-900" },
        { key: "lunch", label: "Lunch", icon: "☀️", color: "bg-yellow-100 border-yellow-900 text-yellow-900" },
        { key: "dinner", label: "Dinner", icon: "🌙", color: "bg-indigo-100 border-indigo-900 text-indigo-900" }
    ];

    // --- Calculations ---

    const getMealTotals = (mealKey) => {
        const list = meals[mealKey] || [];
        return list.reduce((acc, food) => ({
            carbs: acc.carbs + food.carbohydrates,
            protein: acc.protein + food.protein,
            fat: acc.fat + food.fat,
            calories: acc.calories + food.calories
        }), { carbs: 0, protein: 0, fat: 0, calories: 0 });
    };

    const totalConsumed = useMemo(() => {
        return Object.keys(meals).reduce((acc, mealKey) => {
            const mealTotals = getMealTotals(mealKey);
            return {
                carbs: acc.carbs + mealTotals.carbs,
                protein: acc.protein + mealTotals.protein,
                fat: acc.fat + mealTotals.fat,
                calories: acc.calories + mealTotals.calories
            };
        }, { carbs: 0, protein: 0, fat: 0, calories: 0 });
    }, [meals]);

    const remaining = useMemo(() => ({
        carbs: Math.max(0, targets.carbs - totalConsumed.carbs),
        protein: Math.max(0, targets.protein - totalConsumed.protein),
        fat: Math.max(0, targets.fat - totalConsumed.fat),
        calories: Math.max(0, targets.calories - totalConsumed.calories)
    }), [targets, totalConsumed]);

    // --- Logic & Suggestions ---

    const percentageRemaining = useMemo(() => ({
        carbs: (remaining.carbs / targets.carbs) * 100,
        protein: (remaining.protein / targets.protein) * 100,
        fat: (remaining.fat / targets.fat) * 100,
        calories: (remaining.calories / targets.calories) * 100
    }), [remaining, targets]);

    const suggestions = useMemo(() => {
        const tips = [];
        if (percentageRemaining.carbs > 40) tips.push({ icon: "🍞", type: "carb", message: `${Math.round(remaining.carbs)}g carbs remaining. Add grains/fruits.`, category: "Carb Focus" });
        if (percentageRemaining.protein > 40) tips.push({ icon: "🍗", type: "protein", message: `${Math.round(remaining.protein)}g protein needed. Add lean meats/eggs.`, category: "Protein Focus" });
        if (percentageRemaining.fat > 40) tips.push({ icon: "🥑", type: "fat", message: `${Math.round(remaining.fat)}g fats left. Add nuts/oils.`, category: "Healthy Fats" });

        // Warnings
        if (percentageRemaining.fat <= 0) tips.push({ icon: "⚠️", type: "warning", message: "Fat limit reached!", category: "Limit Fat" });
        if (percentageRemaining.carbs <= 0) tips.push({ icon: "⚠️", type: "warning", message: "Carb limit reached!", category: "Limit Carbs" });

        return tips;
    }, [percentageRemaining]);


    // --- Actions ---

    const addFood = (mealKey, food) => {
        // Validation handled by parent usually, but good to check totals here if needed
        // For simplicity allow adding, visual warnings show excess.

        setWeekPlan(prev => ({
            ...prev,
            [currentDay]: {
                ...prev[currentDay],
                [mealKey]: [...(prev[currentDay][mealKey] || []), { ...food, id: Date.now() }]
            }
        }));
    };

    const removeFood = (mealKey, foodId) => {
        setWeekPlan(prev => ({
            ...prev,
            [currentDay]: {
                ...prev[currentDay],
                [mealKey]: prev[currentDay][mealKey].filter(f => f.id !== foodId)
            }
        }));
    };

    const saveWeeklyPlan = async () => {
        if (!patientId) return onError?.("Create a profile to save meal plans.");
        setSaving(true);
        const response = await savePlan(patientId, { days: weekPlan });
        if (!response.success) {
            onError?.(response.error);
        } else {
            onSuccess?.("Weekly meal plan saved successfully!");
        }
        setSaving(false);
    };

    const handlePrint = () => {
        window.print();
    };

    useImperativeHandle(ref, () => ({ addFood }));

    const getWarningLevel = (consumed, target) => {
        const p = (consumed / target) * 100;
        if (p >= 100) return 'full';
        if (p >= 90) return 'warning';
        return 'normal';
    };

    const getWarningColor = (level) => {
        if (level === 'full') return 'bg-red-500 text-white';
        if (level === 'warning') return 'bg-yellow-400 text-primary-900';
        return 'bg-primary-900 text-white';
    };

    return (
        <Card
            title="Weekly Meal Planner"
            description="Plan your meals for the entire week"
            className="w-full relative"
        >
            {/* Week Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-primary-200 pb-4">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setCurrentDay(day)}
                        className={`px-4 py-2 font-black uppercase tracking-widest text-xs transition-all border-2 ${currentDay === day
                            ? "bg-primary-900 text-white border-primary-900 transform -translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                            : "bg-white text-primary-900 border-primary-900 hover:bg-beige-100"
                            }`}
                    >
                        {day}
                    </button>
                ))}

                {/* Action Buttons */}
                <div className="ml-auto flex gap-2 no-print">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-white text-primary-900 font-black uppercase tracking-widest border-2 border-primary-900 hover:bg-beige-50 flex items-center gap-2"
                    >
                        <span>🖨️</span> Print
                    </button>
                    <button
                        onClick={saveWeeklyPlan}
                        disabled={saving || !patientId}
                        className="px-6 py-2 bg-green-500 text-white font-black uppercase tracking-widest border-2 border-green-700 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? "Saving..." : "💾 Save Plan"}
                    </button>
                </div>
            </div>

            {/* Print Only Header */}
            <div className="print-only mb-8 text-center border-b-4 border-primary-900 pb-4">
                <h1 className="text-4xl font-black uppercase">Sarah's Health Hub</h1>
                <p className="font-bold text-xl uppercase tracking-widest">Client Meal Plan: {currentDay}</p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p>Loading your plan...</p>
                </div>
            ) : (
                <>
                    {/* Day Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-black text-primary-900 uppercase tracking-tighter">
                            {currentDay}
                        </h2>
                        <span className="bg-primary-900 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                            {Object.values(meals).flat().length} items planned
                        </span>
                    </div>

                    {/* Macro Overview */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {['carbs', 'protein', 'fat', 'calories'].map(macro => (
                            <div key={macro} className={`p-3 border-2 text-center transition-all ${getWarningColor(getWarningLevel(totalConsumed[macro], targets[macro]))}`}>
                                <p className="text-[10px] uppercase opacity-70 mb-1">{macro}</p>
                                <p className="text-xl font-black">
                                    {Math.round(totalConsumed[macro])}
                                    {macro !== 'calories' && 'g'}
                                </p>
                                <p className="text-[9px] opacity-60">
                                    of {targets[macro]}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Meal Configuration */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {mealConfig.map((meal) => {
                            const list = meals[meal.key] || [];
                            const mealTotals = getMealTotals(meal.key);

                            return (
                                <div key={meal.key} className="space-y-3">
                                    <div className={`flex items-center gap-3 p-3 border-2 ${meal.color} font-black`}>
                                        <span className="text-xl">{meal.icon}</span>
                                        <h3 className="text-sm uppercase tracking-widest">{meal.label}</h3>
                                        <span className="ml-auto text-xs opacity-70">({list.length})</span>
                                    </div>

                                    <div className="border-2 border-primary-900/10 bg-beige-50 min-h-[150px] p-2 space-y-2">
                                        {list.length > 0 ? list.map(food => (
                                            <div key={food.id} className="bg-white border-2 border-primary-900 p-2 flex justify-between items-center group">
                                                <div>
                                                    <p className="text-xs font-bold text-primary-900">{food.name}</p>
                                                    <p className="text-[9px] text-primary-500">{food.portion}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-[9px] font-mono text-primary-600">
                                                        {food.calories}kcal
                                                    </div>
                                                    <button
                                                        onClick={() => removeFood(meal.key, food.id)}
                                                        className="text-red-500 font-bold hover:bg-red-50 p-1 rounded"
                                                    >✕</button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="h-full flex items-center justify-center opacity-30 text-xs font-bold uppercase tracking-widest">
                                                Add Food
                                            </div>
                                        )}
                                    </div>

                                    {/* Mini Totals */}
                                    <div className="flex justify-between text-[10px] font-bold text-primary-600 px-1">
                                        <span>C: {Math.round(mealTotals.carbs)}g</span>
                                        <span>P: {Math.round(mealTotals.protein)}g</span>
                                        <span>F: {Math.round(mealTotals.fat)}g</span>
                                        <span>{Math.round(mealTotals.calories)} kcal</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="mt-8 p-4 bg-white border-l-4 border-primary-900 shadow-sm">
                            <h4 className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span>💡</span> Smart Tips for {currentDay}
                            </h4>
                            <div className="space-y-1">
                                {suggestions.slice(0, 3).map((s, i) => (
                                    <p key={i} className="text-xs text-primary-700">
                                        {s.message}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </Card>
    );
});

MealPlanner.displayName = "MealPlanner";
export default MealPlanner;

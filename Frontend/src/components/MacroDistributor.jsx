import { useState, useEffect } from "react";
import Card from "./ui/Card";

export default function MacroDistributor({ tdee, onMacroUpdate }) {
    const [calories, setCalories] = useState(2000);
    const [ratios, setRatios] = useState({ carbs: 40, protein: 30, fat: 30 });
    const [grams, setGrams] = useState({ carbs: 0, protein: 0, fat: 0 });

    // Sync with incoming TDEE if provided (and if user hasn't manually overridden yet? 
    // actually, if TDEE changes from profile, we likely want to update the base).
    useEffect(() => {
        if (tdee) {
            setCalories(tdee);
        }
    }, [tdee]);

    // Recalculate grams whenever calories or ratios change
    useEffect(() => {
        const cGrams = Math.round((calories * (ratios.carbs / 100)) / 4);
        const pGrams = Math.round((calories * (ratios.protein / 100)) / 4);
        const fGrams = Math.round((calories * (ratios.fat / 100)) / 9);

        setGrams({ carbs: cGrams, protein: pGrams, fat: fGrams });

        // Auto-update parent (Meal Planner) or require button click?
        // User said "i can edit...". Real-time is nice, but button is safer for "committing".
        // Let's do real-time or debounced. Since it's client side, real-time is fine but let's send full object.
        onMacroUpdate({
            calories: parseInt(calories),
            carbs: cGrams,
            protein: pGrams,
            fat: fGrams
        });
    }, [calories, ratios]);

    const handleRatioChange = (key, value) => {
        const val = parseInt(value) || 0;
        setRatios(prev => ({ ...prev, [key]: val }));
    };

    const totalPercentage = ratios.carbs + ratios.protein + ratios.fat;
    const isTotalValid = totalPercentage === 100;

    return (
        <Card
            title="Macro Distribution (Dietitian Control)"
            description="Fine-tune calories and macronutrient ratios"
            className="w-full"
        >
            <div className="space-y-6">
                {/* Calorie Input */}
                <div className="bg-primary-900/5 p-4 rounded-sm border-2 border-primary-900/10">
                    <label className="block text-xs font-black text-primary-900 uppercase tracking-widest mb-2">
                        Daily Calorie Target (kcal)
                    </label>
                    <input
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                        className="w-full text-3xl font-black text-primary-900 bg-transparent border-b-2 border-primary-900 focus:outline-none placeholder-primary-300"
                    />
                </div>

                {/* Percentage Sliders/Inputs */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Carbs */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-black text-blue-900 uppercase tracking-widest">Carbs %</label>
                            <span className="text-xl font-black text-blue-900">{grams.carbs}g</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={ratios.carbs}
                                onChange={(e) => handleRatioChange('carbs', e.target.value)}
                                className="w-16 p-1 border-2 border-primary-900 font-bold text-center"
                            />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={ratios.carbs}
                                onChange={(e) => handleRatioChange('carbs', e.target.value)}
                                className="flex-1 accent-blue-900 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Protein */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-black text-emerald-900 uppercase tracking-widest">Protein %</label>
                            <span className="text-xl font-black text-emerald-900">{grams.protein}g</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={ratios.protein}
                                onChange={(e) => handleRatioChange('protein', e.target.value)}
                                className="w-16 p-1 border-2 border-primary-900 font-bold text-center"
                            />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={ratios.protein}
                                onChange={(e) => handleRatioChange('protein', e.target.value)}
                                className="flex-1 accent-emerald-900 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Fat */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-black text-amber-900 uppercase tracking-widest">Fat %</label>
                            <span className="text-xl font-black text-amber-900">{grams.fat}g</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={ratios.fat}
                                onChange={(e) => handleRatioChange('fat', e.target.value)}
                                className="w-16 p-1 border-2 border-primary-900 font-bold text-center"
                            />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={ratios.fat}
                                onChange={(e) => handleRatioChange('fat', e.target.value)}
                                className="flex-1 accent-amber-900 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Validation Message */}
                <div className={`p-2 text-center text-xs font-bold uppercase tracking-widest rounded transition-colors ${isTotalValid ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"
                    }`}>
                    Total Percentage: {totalPercentage}% {isTotalValid ? "✅" : "❌ (Must equal 100%)"}
                </div>
            </div>
        </Card>
    );
}

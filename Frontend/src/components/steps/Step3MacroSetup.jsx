import { useState, useEffect } from "react";

export default function Step3MacroSetup({ tdee, initialMacros, onConfirm, onBack }) {
    const [calories, setCalories] = useState(initialMacros?.calories || tdee || 2000);
    const [ratios, setRatios] = useState({
        carbs: initialMacros ? Math.round((initialMacros.carbs * 4 / initialMacros.calories) * 100) : 40,
        protein: initialMacros ? Math.round((initialMacros.protein * 4 / initialMacros.calories) * 100) : 30,
        fat: initialMacros ? Math.round((initialMacros.fat * 9 / initialMacros.calories) * 100) : 30,
    });
    const [grams, setGrams] = useState({ carbs: 0, protein: 0, fat: 0 });

    // Sync with TDEE if provided and no initial macros
    useEffect(() => {
        if (tdee && !initialMacros) {
            setCalories(tdee);
        }
    }, [tdee, initialMacros]);

    // Recalculate grams whenever calories or ratios change
    useEffect(() => {
        const cGrams = Math.round((calories * (ratios.carbs / 100)) / 4);
        const pGrams = Math.round((calories * (ratios.protein / 100)) / 4);
        const fGrams = Math.round((calories * (ratios.fat / 100)) / 9);
        setGrams({ carbs: cGrams, protein: pGrams, fat: fGrams });
    }, [calories, ratios]);

    // Fixed: properly handle empty input
    const handleRatioChange = (key, value) => {
        // Allow empty string for clearing the field
        if (value === "") {
            setRatios((prev) => ({ ...prev, [key]: "" }));
            return;
        }
        const val = parseInt(value);
        if (!isNaN(val)) {
            setRatios((prev) => ({ ...prev, [key]: val }));
        }
    };

    // Fixed: properly handle calories input
    const handleCaloriesChange = (value) => {
        if (value === "") {
            setCalories("");
            return;
        }
        const val = parseInt(value);
        if (!isNaN(val)) {
            setCalories(val);
        }
    };

    // Calculate total, treating empty as 0
    const getNumericValue = (val) => (val === "" ? 0 : val);
    const totalPercentage = getNumericValue(ratios.carbs) + getNumericValue(ratios.protein) + getNumericValue(ratios.fat);
    const isValid = totalPercentage === 100;

    const handleConfirm = () => {
        if (!isValid) return;
        onConfirm({
            calories: parseInt(calories) || 0,
            carbs: grams.carbs,
            protein: grams.protein,
            fat: grams.fat,
        });
    };

    return (
        <div className="section">
            <div className="mb-6">
                <h2 className="section-title">Macro Targets Setup</h2>
                <p className="text-sm text-gray-500">
                    Step 3 of 5 — Set calorie and macronutrient targets
                </p>
            </div>

            {/* Calorie Input */}
            <div className="mb-8 pb-6 border-b border-emerald-100">
                <label className="form-label">Daily Calorie Target</label>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={calories}
                        onChange={(e) => handleCaloriesChange(e.target.value)}
                        className="form-input w-40 text-lg font-semibold"
                    />
                    <span className="text-gray-500">kcal/day</span>
                    {tdee && (
                        <button
                            type="button"
                            onClick={() => setCalories(tdee)}
                            className="text-sm text-emerald-600 hover:text-emerald-700 underline"
                        >
                            Reset to TDEE ({tdee})
                        </button>
                    )}
                </div>
            </div>

            {/* Macro Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Percentage Inputs */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                        Distribution (%)
                    </h3>
                    <div className="space-y-4">
                        {/* Carbs */}
                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm text-gray-600">Carbs</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={ratios.carbs}
                                onChange={(e) => handleRatioChange("carbs", e.target.value)}
                                className="form-input w-20 text-center"
                            />
                            <span className="text-gray-400">%</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={getNumericValue(ratios.carbs)}
                                onChange={(e) => handleRatioChange("carbs", e.target.value)}
                                className="flex-1 accent-emerald-600"
                            />
                        </div>

                        {/* Protein */}
                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm text-gray-600">Protein</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={ratios.protein}
                                onChange={(e) => handleRatioChange("protein", e.target.value)}
                                className="form-input w-20 text-center"
                            />
                            <span className="text-gray-400">%</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={getNumericValue(ratios.protein)}
                                onChange={(e) => handleRatioChange("protein", e.target.value)}
                                className="flex-1 accent-emerald-600"
                            />
                        </div>

                        {/* Fat */}
                        <div className="flex items-center gap-4">
                            <label className="w-20 text-sm text-gray-600">Fat</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={ratios.fat}
                                onChange={(e) => handleRatioChange("fat", e.target.value)}
                                className="form-input w-20 text-center"
                            />
                            <span className="text-gray-400">%</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={getNumericValue(ratios.fat)}
                                onChange={(e) => handleRatioChange("fat", e.target.value)}
                                className="flex-1 accent-emerald-600"
                            />
                        </div>
                    </div>

                    {/* Validation */}
                    <div
                        className={`mt-6 p-3 rounded-sm text-sm font-medium ${isValid
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                    >
                        Total: {totalPercentage}%{" "}
                        {isValid ? "✓" : "(must equal 100%)"}
                    </div>
                </div>

                {/* Right: Grams Output (read-only) */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                        Daily Grams (calculated)
                    </h3>
                    <div className="space-y-4">
                        <div className="data-box">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Carbohydrates</span>
                                <span className="text-xl font-semibold text-gray-800">
                                    {grams.carbs}g
                                </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {Math.round(grams.carbs * 4)} kcal from carbs
                            </div>
                        </div>

                        <div className="data-box">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Protein</span>
                                <span className="text-xl font-semibold text-gray-800">
                                    {grams.protein}g
                                </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {Math.round(grams.protein * 4)} kcal from protein
                            </div>
                        </div>

                        <div className="data-box">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Fat</span>
                                <span className="text-xl font-semibold text-gray-800">
                                    {grams.fat}g
                                </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {Math.round(grams.fat * 9)} kcal from fat
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-emerald-100 mt-8">
                <button onClick={onBack} className="btn-secondary">
                    ← Back
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={!isValid}
                    className="btn-primary"
                >
                    Confirm Macros →
                </button>
            </div>
        </div>
    );
}

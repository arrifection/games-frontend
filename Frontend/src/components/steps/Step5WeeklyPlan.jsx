import { useState, useMemo } from "react";
import { savePlan } from "../../services/api";
import { generateDietPlanPDF } from "../../utils/pdfGenerator";
import { useAuth } from "../../context/AuthContext";

export default function Step5WeeklyPlan({
    weekPlan,
    macroTargets,
    patientId,
    patientData,
    onError,
    onSuccess,
    onBack,
    onStartOver,
}) {
    const { saveHistory, user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [dietaryFocus, setDietaryFocus] = useState("");

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const targets = macroTargets || {
        carbs: 200,
        protein: 150,
        fat: 65,
        calories: 2000,
    };

    // Calculate day totals
    const getDayTotals = (day) => {
        const dayMeals = weekPlan[day] || {};
        return Object.values(dayMeals)
            .flat()
            .reduce(
                (acc, food) => ({
                    carbs: acc.carbs + (food.carbohydrates || 0),
                    protein: acc.protein + (food.protein || 0),
                    fat: acc.fat + (food.fat || 0),
                    calories: acc.calories + (food.calories || 0),
                    count: acc.count + 1,
                }),
                { carbs: 0, protein: 0, fat: 0, calories: 0, count: 0 }
            );
    };

    // Weekly summary
    const weeklyStats = useMemo(() => {
        let totalItems = 0;
        let daysWithMeals = 0;

        days.forEach((day) => {
            const totals = getDayTotals(day);
            if (totals.count > 0) {
                totalItems += totals.count;
                daysWithMeals++;
            }
        });

        return { totalItems, daysWithMeals };
    }, [weekPlan]);

    const handleSave = async () => {
        if (!patientId) {
            onError?.("No patient selected. Please go back and create a patient first.");
            return;
        }

        setSaving(true);
        const response = await savePlan(patientId, { days: weekPlan });
        if (response.success) {
            onSuccess?.("Weekly meal plan saved successfully!");

            // Save to history if logged in
            if (user) {
                saveHistory("Diet Plan Saved", { patient: patientData?.name }, { days: Object.keys(weekPlan).length });
            }
        } else {
            onError?.(response.error);
        }
        setSaving(false);
    };

    const handleGeneratePDF = () => {
        generateDietPlanPDF({
            patientData,
            macroTargets: targets,
            weekPlan,
            dietaryFocus,
            selectedDay: null, // null = all days
        });
    };

    const selectedDayMeals = weekPlan[selectedDay] || {};
    const selectedDayTotals = getDayTotals(selectedDay);

    return (
        <div className="section">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="section-title">Weekly Plan Review</h2>
                    <p className="text-sm text-gray-500">
                        Step 5 of 5 — Review and export your plan
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleGeneratePDF} className="btn-secondary">
                        Download PDF
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !patientId}
                        className="btn-success"
                    >
                        {saving ? "Saving..." : "Save Plan"}
                    </button>
                </div>
            </div>

            {/* Dietary Focus Input */}
            <div className="mb-6 pb-6 border-b border-emerald-100">
                <label className="form-label">Dietary Focus / Approach (optional - for PDF)</label>
                <textarea
                    value={dietaryFocus}
                    onChange={(e) => setDietaryFocus(e.target.value)}
                    placeholder="e.g. Weight loss with moderate carb restriction, focus on high protein breakfast..."
                    rows={2}
                    className="form-textarea"
                />
            </div>

            {/* Weekly Overview Table */}
            <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Weekly Overview
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-emerald-200">
                        <thead>
                            <tr className="bg-emerald-50">
                                <th className="text-left text-xs font-medium text-gray-600 uppercase py-3 px-4 border-b border-emerald-200">
                                    Day
                                </th>
                                <th className="text-center text-xs font-medium text-gray-600 uppercase py-3 px-4 border-b border-emerald-200">
                                    Items
                                </th>
                                <th className="text-center text-xs font-medium text-gray-600 uppercase py-3 px-4 border-b border-emerald-200">
                                    Calories
                                </th>
                                <th className="text-center text-xs font-medium text-gray-600 uppercase py-3 px-4 border-b border-emerald-200">
                                    Carbs
                                </th>
                                <th className="text-center text-xs font-medium text-gray-600 uppercase py-3 px-4 border-b border-emerald-200">
                                    Protein
                                </th>
                                <th className="text-center text-xs font-medium text-gray-600 uppercase py-3 px-4 border-b border-emerald-200">
                                    Fat
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((day) => {
                                const totals = getDayTotals(day);
                                const isSelected = selectedDay === day;
                                const hasItems = totals.count > 0;

                                return (
                                    <tr
                                        key={day}
                                        onClick={() => setSelectedDay(day)}
                                        className={`cursor-pointer transition-colors border-b border-emerald-100 ${isSelected ? "bg-emerald-100" : "hover:bg-emerald-50"
                                            }`}
                                    >
                                        <td className="py-3 px-4 text-sm font-medium text-gray-800">
                                            {day}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center text-gray-600">
                                            {totals.count}
                                        </td>
                                        <td
                                            className={`py-3 px-4 text-sm text-center font-medium ${hasItems
                                                ? totals.calories > targets.calories
                                                    ? "text-red-600"
                                                    : "text-gray-800"
                                                : "text-gray-300"
                                                }`}
                                        >
                                            {hasItems ? Math.round(totals.calories) : "—"}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center text-gray-600">
                                            {hasItems ? `${Math.round(totals.carbs)}g` : "—"}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center text-gray-600">
                                            {hasItems ? `${Math.round(totals.protein)}g` : "—"}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center text-gray-600">
                                            {hasItems ? `${Math.round(totals.fat)}g` : "—"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Selected Day Detail */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                        {selectedDay} Details
                    </h3>
                    <div className="text-sm text-gray-500">
                        {selectedDayTotals.count} items •{" "}
                        {Math.round(selectedDayTotals.calories)} kcal
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {["breakfast", "snack", "lunch", "dinner"].map((mealKey) => {
                        const mealLabels = {
                            breakfast: "Breakfast",
                            snack: "Snack",
                            lunch: "Lunch",
                            dinner: "Dinner",
                        };
                        const items = selectedDayMeals[mealKey] || [];

                        return (
                            <div
                                key={mealKey}
                                className="bg-white border border-emerald-200 rounded-sm p-4"
                            >
                                <h4 className="text-sm font-medium text-gray-700 mb-3 pb-2 border-b border-emerald-100">
                                    {mealLabels[mealKey]}
                                </h4>
                                {items.length > 0 ? (
                                    <ul className="space-y-2">
                                        {items.map((food) => (
                                            <li
                                                key={food.id}
                                                className="text-sm text-gray-600 flex justify-between"
                                            >
                                                <span className="truncate">{food.name}</span>
                                                <span className="text-gray-400 ml-2">
                                                    {food.calories}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-300">No items</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="data-box">
                    <div className="data-label">Days Planned</div>
                    <div className="data-value">{weeklyStats.daysWithMeals}</div>
                </div>
                <div className="data-box">
                    <div className="data-label">Total Items</div>
                    <div className="data-value">{weeklyStats.totalItems}</div>
                </div>
                <div className="data-box">
                    <div className="data-label">Daily Target</div>
                    <div className="data-value">{targets.calories}</div>
                    <span className="text-xs text-gray-500">kcal</span>
                </div>
                <div className="data-box">
                    <div className="data-label">Patient</div>
                    <div className="text-lg font-semibold text-gray-800 truncate">
                        {patientData?.name || "Not set"}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-emerald-100">
                <button onClick={onBack} className="btn-secondary">
                    ← Back to Planner
                </button>
                <button onClick={onStartOver} className="btn-secondary">
                    Start New Plan
                </button>
            </div>
        </div>
    );
}

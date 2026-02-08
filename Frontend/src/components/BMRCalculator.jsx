import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Select from "./ui/Select"; // I need to check if Select exists or use native select
import { calculateBMR, calculateMacros } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function BMRCalculator({ onError, onMacroResult }) {
    const { saveHistory, user } = useAuth();
    const [weight, setWeight] = useState("");
    const [heightType, setHeightType] = useState("cm");
    const [height, setHeight] = useState("");
    const [feet, setFeet] = useState("");
    const [inches, setInches] = useState("");

    const [age, setAge] = useState("");
    const [gender, setGender] = useState("male");
    const [activityLevel, setActivityLevel] = useState("sedentary");
    const [goal, setGoal] = useState("maintenance");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Macro State
    const [carbs, setCarbs] = useState(40);
    const [protein, setProtein] = useState(30);
    const [fat, setFat] = useState(30);
    const [macroResult, setMacroResult] = useState(null);
    const [macroLoading, setMacroLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setMacroResult(null);

        let heightInCm = 0;
        if (heightType === "cm") {
            heightInCm = parseFloat(height);
        } else {
            // Convert Feet/Inches to CM
            const heightInInches = (parseInt(feet) * 12) + (parseFloat(inches) || 0);
            heightInCm = heightInInches * 2.54;
        }

        const data = {
            weight: parseFloat(weight),
            height: heightInCm,
            age: parseInt(age),
            gender: gender,
            activity_level: activityLevel,
            goal: goal
        };

        const response = await calculateBMR(data);
        setLoading(false);

        if (response.success) {
            setResult(response.data);

            // Save to history if logged in
            if (user) {
                saveHistory("Health Calculation (BMR/TDEE)", data, response.data);
            }
        } else {
            onError?.(response.error);
        }
    };

    const handleMacroSubmit = async () => {
        if (!result || !result.tdee) return;

        setMacroLoading(true);
        const total = parseFloat(carbs) + parseFloat(protein) + parseFloat(fat);
        if (Math.abs(total - 100) > 0.1) {
            onError?.(`Percentages must add up to 100%. Current: ${total}%`);
            setMacroLoading(false);
            return;
        }

        // Use goal calories for macros if available, otherwise TDEE
        const targetCalories = result.goal_calories || result.tdee;

        const data = {
            tdee: targetCalories,
            carbs_percent: parseFloat(carbs),
            protein_percent: parseFloat(protein),
            fat_percent: parseFloat(fat)
        };

        const response = await calculateMacros(data);
        setMacroLoading(false);

        if (response.success) {
            setMacroResult(response.data);
            // Pass macro data to parent component
            onMacroResult?.(response.data);

            // Save to history if logged in
            if (user) {
                saveHistory("Macros Configuration", data, response.data);
            }
        } else {
            onError?.(response.error);
        }
    };

    const applyPreset = (c, p, f) => {
        setCarbs(c);
        setProtein(p);
        setFat(f);

        // Directly calculate with the new values to avoid stale state
        if (!result || !result.tdee) return;

        setMacroLoading(true);
        const targetCalories = result.goal_calories || result.tdee;

        const data = {
            tdee: targetCalories,
            carbs_percent: parseFloat(c),
            protein_percent: parseFloat(p),
            fat_percent: parseFloat(f)
        };

        calculateMacros(data).then(response => {
            setMacroLoading(false);
            if (response.success) {
                setMacroResult(response.data);
                onMacroResult?.(response.data);
            } else {
                onError?.(response.error);
            }
        });
    };

    return (
        <Card
            title="BMR, TDEE & Goal Calculator"
            description="Complete Nutrition Planning"
            className="w-full"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Weight (kg)"
                    type="number"
                    step="0.1"
                    placeholder="70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                />

                <div className="flex bg-beige-100 p-1 border-2 border-primary-900 mb-2 font-black">
                    <button
                        type="button"
                        onClick={() => setHeightType("cm")}
                        className={`flex-1 py-3 text-sm uppercase tracking-widest transition-all ${heightType === "cm"
                            ? "bg-primary-600 text-white"
                            : "text-primary-900 hover:bg-beige-200"
                            }`}
                    >
                        CM
                    </button>
                    <button
                        type="button"
                        onClick={() => setHeightType("feet")}
                        className={`flex-1 py-3 text-sm uppercase tracking-widest transition-all ${heightType === "feet"
                            ? "bg-primary-600 text-white"
                            : "text-primary-900 hover:bg-beige-200"
                            }`}
                    >
                        Feet / In
                    </button>
                </div>

                {heightType === "cm" ? (
                    <Input
                        label="Height (cm)"
                        type="number"
                        step="1"
                        placeholder="175"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                    />
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Feet"
                            type="number"
                            placeholder="5"
                            value={feet}
                            onChange={(e) => setFeet(e.target.value)}
                            required
                        />
                        <Input
                            label="Inches"
                            type="number"
                            step="0.5"
                            placeholder="10"
                            value={inches}
                            onChange={(e) => setInches(e.target.value)}
                        />
                    </div>
                )}

                <Input
                    label="Age"
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />

                <div className="space-y-1">
                    <label className="block text-xs font-black text-primary-900 uppercase tracking-widest">Activity Level</label>
                    <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className="w-full bg-white border-2 border-primary-900 p-3 font-bold text-primary-900 focus:outline-none focus:ring-4 focus:ring-primary-200"
                    >
                        <option value="sedentary">Sedentary (No exercise, Desk job)</option>
                        <option value="lightly active">Lightly Active (Exercise 1-3x/week)</option>
                        <option value="moderately active">Moderately Active (Exercise 3-5x/week)</option>
                        <option value="very active">Very Active (Exercise 6-7x/week)</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-black text-primary-900 uppercase tracking-widest">Goal</label>
                    <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full bg-white border-2 border-primary-900 p-3 font-bold text-primary-900 focus:outline-none focus:ring-4 focus:ring-primary-200"
                    >
                        <option value="weight loss">Weight Loss (Deficit -300 kcal)</option>
                        <option value="maintenance">Maintenance (No Change)</option>
                        <option value="weight gain">Weight Gain (Surplus +300 kcal)</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-xs font-black text-primary-900 uppercase tracking-widest">Gender</label>
                    <div className="flex bg-beige-100 p-1 border-2 border-primary-900 font-black">
                        <button
                            type="button"
                            onClick={() => setGender("male")}
                            className={`flex-1 py-3 text-sm uppercase tracking-widest transition-all ${gender === "male"
                                ? "bg-primary-600 text-white"
                                : "text-primary-900 hover:bg-beige-200"
                                }`}
                        >
                            Male
                        </button>
                        <button
                            type="button"
                            onClick={() => setGender("female")}
                            className={`flex-1 py-3 text-sm uppercase tracking-widest transition-all ${gender === "female"
                                ? "bg-primary-600 text-white"
                                : "text-primary-900 hover:bg-beige-200"
                                }`}
                        >
                            Female
                        </button>
                    </div>
                </div>

                <Button type="submit" className="w-full mt-8 py-5 text-xl" disabled={loading}>
                    {loading ? "CALCULATING..." : "CALCULATE PLAN"}
                </Button>
            </form>

            {result && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-10 p-8 bg-beige-200 border-4 border-primary-900 shadow-[4px_4px_0px_0px_#881337]"
                    onAnimationComplete={() => {
                        handleMacroSubmit();
                    }}
                >
                    <div className="flex flex-col gap-6 mb-8">
                        {/* Top: Goal Calories (Main Focus) */}
                        <div className="text-center bg-white p-6 border-2 border-primary-900 shadow-[4px_4px_0px_0px_#1e293b]">
                            <p className="text-sm font-black text-primary-800 uppercase tracking-widest mb-1">
                                Daily Goal ({result.goal})
                            </p>
                            <p className="text-6xl font-black text-primary-900">{Math.round(result.goal_calories)}</p>
                            <p className="text-xs text-primary-600 font-bold uppercase mt-1">Calories / Day</p>
                        </div>

                        {/* Bottom: BMR & TDEE Details */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-2 border-2 border-primary-900/10">
                                <p className="text-xs font-black text-primary-800 uppercase tracking-widest mb-1">BMR</p>
                                <p className="text-2xl font-black text-primary-950">{Math.round(result.bmr)}</p>
                                <p className="text-[9px] text-primary-600 uppercase">Resting</p>
                            </div>
                            <div className="p-2 border-2 border-primary-900/10">
                                <p className="text-xs font-black text-primary-800 uppercase tracking-widest mb-1">TDEE</p>
                                <p className="text-2xl font-black text-primary-950">{Math.round(result.tdee)}</p>
                                <p className="text-[9px] text-primary-600 uppercase">
                                    Base (x{result.activity_multiplier})
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Macro Section */}
                    <div className="border-t-2 border-primary-900/20 pt-6">
                        <h3 className="text-sm font-black text-primary-800 uppercase tracking-widest mb-4 text-center">MACRONUTRIENT SPLIT</h3>

                        {/* Presets */}
                        <div className="flex gap-2 justify-center mb-4">
                            <button
                                onClick={() => applyPreset(50, 20, 30)}
                                className="px-3 py-1 text-[10px] font-bold uppercase border-2 border-primary-900 bg-white hover:bg-beige-100"
                            >
                                Balanced
                            </button>
                            <button
                                onClick={() => applyPreset(40, 30, 30)}
                                className="px-3 py-1 text-[10px] font-bold uppercase border-2 border-primary-900 bg-white hover:bg-beige-100"
                            >
                                High Protein
                            </button>
                            <button
                                onClick={() => applyPreset(30, 30, 40)}
                                className="px-3 py-1 text-[10px] font-bold uppercase border-2 border-primary-900 bg-white hover:bg-beige-100"
                            >
                                Low Carb
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div>
                                <label className="block text-[10px] text-primary-700 font-bold mb-1 text-center">CARBS %</label>
                                <input
                                    type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)}
                                    className="w-full p-2 text-center font-bold border-2 border-primary-900 outline-none focus:bg-white bg-beige-50"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-primary-700 font-bold mb-1 text-center">PROTEIN %</label>
                                <input
                                    type="number" value={protein} onChange={(e) => setProtein(e.target.value)}
                                    className="w-full p-2 text-center font-bold border-2 border-primary-900 outline-none focus:bg-white bg-beige-50"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-primary-700 font-bold mb-1 text-center">FAT %</label>
                                <input
                                    type="number" value={fat} onChange={(e) => setFat(e.target.value)}
                                    className="w-full p-2 text-center font-bold border-2 border-primary-900 outline-none focus:bg-white bg-beige-50"
                                />
                            </div>
                        </div>

                        <Button onClick={handleMacroSubmit} className="w-full py-2 text-sm mb-6" disabled={macroLoading}>
                            {macroLoading ? "UPDATING SPLIT..." : "UPDATE MACROS"}
                        </Button>

                        {macroResult && (
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-blue-100 p-2 border-2 border-blue-900 rounded-sm">
                                    <p className="text-xs font-black text-blue-900 uppercase">Carbs</p>
                                    <p className="text-xl font-black text-blue-950">{Math.round(macroResult.grams.carbs)}g</p>
                                    <p className="text-[10px] text-blue-800">{Math.round(macroResult.calories.carbs)} kcal</p>
                                </div>
                                <div className="bg-emerald-100 p-2 border-2 border-emerald-900 rounded-sm">
                                    <p className="text-xs font-black text-emerald-900 uppercase">Protein</p>
                                    <p className="text-xl font-black text-emerald-950">{Math.round(macroResult.grams.protein)}g</p>
                                    <p className="text-[10px] text-emerald-800">{Math.round(macroResult.calories.protein)} kcal</p>
                                </div>
                                <div className="bg-amber-100 p-2 border-2 border-amber-900 rounded-sm">
                                    <p className="text-xs font-black text-amber-900 uppercase">Fat</p>
                                    <p className="text-xl font-black text-amber-950">{Math.round(macroResult.grams.fat)}g</p>
                                    <p className="text-[10px] text-amber-800">{Math.round(macroResult.calories.fat)} kcal</p>
                                </div>
                            </div>
                        )}
                    </div>

                </motion.div>
            )}
        </Card>
    );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Loader2 } from "lucide-react";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { calculateBMI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function BMICalculator({ onResult, onError }) {
    const { saveHistory, user } = useAuth();
    const [weight, setWeight] = useState("");
    const [heightType, setHeightType] = useState("cm"); // default to cm
    const [height, setHeight] = useState("");
    const [feet, setFeet] = useState("");
    const [inches, setInches] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        const data = { weight: parseFloat(weight) };

        if (heightType === "meters") {
            data.height = parseFloat(height);
        } else if (heightType === "cm") {
            data.height = parseFloat(height) / 100; // convert cm to meters for the API
        } else {
            data.feet = parseInt(feet);
            data.inches = parseFloat(inches) || 0;
        }

        const response = await calculateBMI(data);
        setLoading(false);

        if (response.success) {
            setResult(response.data);
            onResult?.(response.data);

            // Save to history if logged in
            if (user) {
                saveHistory("BMI Calculation", data, response.data);
            }
        } else {
            onError?.(response.error);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            "Underweight": "text-amber-600 bg-amber-50",
            "Normal weight": "text-emerald-600 bg-emerald-50",
            "Overweight": "text-orange-600 bg-orange-50",
            "Obese": "text-red-600 bg-red-50",
        };
        return colors[category] || "text-slate-600 bg-slate-50";
    };

    return (
        <Card
            title="BMI Calculator"
            description="Calculate your Body Mass Index"
            className="w-full"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Weight (kg)"
                    type="number"
                    step="0.1"
                    placeholder="Enter your weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                />

                <div className="flex bg-beige-100 p-1 border-2 border-primary-900 mb-6 font-black">
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
                        onClick={() => setHeightType("meters")}
                        className={`flex-1 py-3 text-sm uppercase tracking-widest transition-all ${heightType === "meters"
                            ? "bg-primary-600 text-white"
                            : "text-primary-900 hover:bg-beige-200"
                            }`}
                    >
                        Meters
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
                        label="HEIGHT (CM)"
                        type="number"
                        placeholder="175"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                    />
                ) : heightType === "meters" ? (
                    <Input
                        label="HEIGHT (METERS)"
                        type="number"
                        step="0.01"
                        placeholder="1.75"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                    />
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="FEET"
                            type="number"
                            placeholder="5"
                            value={feet}
                            onChange={(e) => setFeet(e.target.value)}
                            required
                        />
                        <Input
                            label="INCHES"
                            type="number"
                            step="0.5"
                            placeholder="10"
                            value={inches}
                            onChange={(e) => setInches(e.target.value)}
                        />
                    </div>
                )}

                <Button type="submit" className="w-full mt-8 py-5 text-xl" disabled={loading}>
                    {loading ? "CALCULATING..." : "RUN BMI CALC"}
                </Button>
            </form>

            {result && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-10 p-8 bg-beige-200 border-4 border-primary-900 shadow-[4px_4px_0px_0px_#881337]"
                >
                    <div className="text-center">
                        <p className="text-sm font-black text-primary-800 uppercase tracking-widest mb-2">SCORE</p>
                        <p className="text-6xl font-black text-primary-950">{result.bmi}</p>
                        <div className="mt-4 px-6 py-2 bg-primary-900 text-white inline-block font-black uppercase text-lg italic">
                            {result.category}
                        </div>
                    </div>
                </motion.div>
            )}
        </Card>
    );
}

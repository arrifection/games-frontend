import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import Card from "./ui/Card";
import Select from "./ui/Select";
import Button from "./ui/Button";
import { getAdvice } from "../services/api";

const CATEGORIES = [
    { value: "", label: "Select a category..." },
    { value: "Underweight", label: "Underweight" },
    { value: "Normal weight", label: "Normal Weight" },
    { value: "Overweight", label: "Overweight" },
    { value: "Obese", label: "Obese" },
];

export default function AdvicePanel({ preSelectedCategory, onError }) {
    const [category, setCategory] = useState(preSelectedCategory || "");
    const [loading, setLoading] = useState(false);
    const [advice, setAdvice] = useState(null);

    const handleGetAdvice = async () => {
        if (!category) {
            onError?.("Please select a category first");
            return;
        }

        setLoading(true);
        setAdvice(null);

        const response = await getAdvice(category);
        setLoading(false);

        if (response.success) {
            setAdvice(response.data);
        } else {
            onError?.(response.error);
        }
    };

    // Sync category when BMI result changes
    useEffect(() => {
        if (preSelectedCategory) {
            setCategory(preSelectedCategory);
        }
    }, [preSelectedCategory]);

    const getCategoryIcon = (cat) => {
        const icons = {
            "Underweight": "🍎",
            "Normal weight": "💪",
            "Overweight": "🏃",
            "Obese": "❤️",
        };
        return icons[cat] || "💡";
    };

    return (
        <Card
            title="Health Advice"
            description="Get personalized health recommendations"
            className="w-full"
        >
            <div className="space-y-4">
                <Select
                    label="BMI Category"
                    options={CATEGORIES}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <Button onClick={handleGetAdvice} className="w-full" disabled={loading || !category}>
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Getting Advice...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            Get Advice
                        </>
                    )}
                </Button>
            </div>

            {advice && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-beige-50 to-beige-200 border-2 border-primary-900 shadow-[4px_4px_0px_0px_rgba(180,148,99,0.2)]"
                >
                    <div className="flex items-start gap-4">
                        <span className="text-3xl">{getCategoryIcon(advice.category)}</span>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-2">{advice.category}</h3>
                            <p className="text-slate-600 leading-relaxed">{advice.advice}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </Card>
    );
}

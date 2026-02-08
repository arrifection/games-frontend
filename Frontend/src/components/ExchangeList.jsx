import { useState, useEffect, useMemo } from "react";
import Card from "./ui/Card";
import { getExchangeList } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

export default function ExchangeList({ onError, onAddFood }) {
    const [allFoods, setAllFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMeal, setSelectedMeal] = useState("breakfast");
    const [searchTerm, setSearchTerm] = useState("");
    // Track which sections are open (default to Starches usually, or none)
    const [openSections, setOpenSections] = useState({});

    useEffect(() => {
        fetchExchangeList();
    }, []);

    const fetchExchangeList = async () => {
        setLoading(true);
        // Fetch ALL items at once
        const response = await getExchangeList(null);

        if (response.success) {
            setAllFoods(response.data.items);
            // Default open "Starches" if present, or just the first group found
            if (response.data.items.length > 0) {
                setOpenSections({ "Starches": true });
            }
        } else {
            onError?.(response.error);
        }
        setLoading(false);
    };

    const meals = [
        { value: "breakfast", label: "Breakfast", icon: "🌅" },
        { value: "snack", label: "Snack", icon: "🍎" },
        { value: "lunch", label: "Lunch", icon: "☀️" },
        { value: "dinner", label: "Dinner", icon: "🌙" }
    ];

    const getGroupColor = (group) => {
        const colors = {
            "Starches": "bg-orange-50 border-orange-200 text-orange-900",
            "Fruits": "bg-pink-50 border-pink-200 text-pink-900",
            "Milk": "bg-blue-50 border-blue-200 text-blue-900",
            "Vegetables": "bg-green-50 border-green-200 text-green-900",
            "Meat": "bg-red-50 border-red-200 text-red-900",
            "Fats": "bg-yellow-50 border-yellow-200 text-yellow-900",
            "Sweets": "bg-purple-50 border-purple-200 text-purple-900"
        };
        return colors[group] || "bg-gray-50 border-primary-200 text-primary-900";
    };

    const getGroupIcon = (group) => {
        const icons = {
            "Starches": "🍞",
            "Fruits": "🍇",
            "Milk": "🥛",
            "Vegetables": "🥦",
            "Meat": "🥩",
            "Fats": "🥑",
            "Sweets": "🍰"
        };
        return icons[group] || "🍽️";
    };

    const handleAddFood = (food) => {
        if (onAddFood) {
            onAddFood(selectedMeal, food);
        }
    };

    const toggleSection = (group) => {
        setOpenSections(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    // Filter and Group Data
    const groupedFoods = useMemo(() => {
        if (!allFoods) return {};

        const filtered = allFoods.filter(f =>
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (f.group && f.group.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (f.subgroup && f.subgroup.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // Sort Groups Order
        const groupOrder = ["Starches", "Fruits", "Milk", "Vegetables", "Meat", "Fats", "Sweets"];

        const groups = {};
        // Initialize order
        groupOrder.forEach(g => groups[g] = []);

        filtered.forEach(item => {
            const g = item.group || "Other";
            if (!groups[g]) groups[g] = [];
            groups[g].push(item);
        });

        // Remove empty groups
        Object.keys(groups).forEach(key => {
            if (groups[key].length === 0) delete groups[key];
        });

        return groups;
    }, [allFoods, searchTerm]);

    return (
        <Card
            title="Food Exchange List"
            description="Comprehensive food database sorted by groups"
            className="w-full"
        >
            {/* Controls Header */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-end justify-between bg-beige-50 p-4 border-2 border-primary-900/10">
                {/* Meal Selector */}
                <div className="flex-1">
                    <label className="block text-xs font-black text-primary-900 uppercase tracking-widest mb-2">
                        Adding items to:
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {meals.map(meal => (
                            <button
                                key={meal.value}
                                onClick={() => setSelectedMeal(meal.value)}
                                className={`px-4 py-2 text-sm font-bold uppercase border-2 transition-all flex items-center gap-2 ${selectedMeal === meal.value
                                        ? "bg-primary-600 text-white border-primary-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                        : "bg-white text-primary-900 border-primary-900 hover:bg-beige-100 hover:translate-y-[-1px]"
                                    }`}
                            >
                                <span>{meal.icon}</span>
                                {meal.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="w-full md:w-64">
                    <label className="block text-xs font-black text-primary-900 uppercase tracking-widest mb-2">
                        Search Foods
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="e.g. Apple, Rice, Steak..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border-2 border-primary-900 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:font-normal"
                        />
                        <span className="absolute right-3 top-2.5 opacity-50">🔍</span>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-primary-700 font-bold uppercase tracking-widest">Loading database...</p>
                </div>
            )}

            {/* Food Groups Accordion */}
            {!loading && (
                <div className="space-y-4">
                    {Object.keys(groupedFoods).map((group) => (
                        <div key={group} className="border-2 border-primary-900 bg-white">
                            {/* Group Header */}
                            <button
                                onClick={() => toggleSection(group)}
                                className={`w-full flex items-center justify-between p-4 ${getGroupColor(group)} hover:brightness-95 transition-all text-left group`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{getGroupIcon(group)}</span>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">{group}</h3>
                                        <p className="text-xs font-bold opacity-70 uppercase tracking-widest">
                                            {groupedFoods[group].length} items
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-2xl transition-transform duration-300 ${openSections[group] ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {/* Group Content */}
                            <AnimatePresence>
                                {openSections[group] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 overflow-x-auto">
                                            <table className="w-full min-w-[600px]">
                                                <thead className="text-xs uppercase tracking-widest text-primary-500 border-b-2 border-primary-100">
                                                    <tr>
                                                        <th className="pb-2 text-left w-1/3">Food Name</th>
                                                        <th className="pb-2 text-left">Portion</th>
                                                        <th className="pb-2 text-center">Carbs</th>
                                                        <th className="pb-2 text-center">Protein</th>
                                                        <th className="pb-2 text-center">Fat</th>
                                                        <th className="pb-2 text-center">Cals</th>
                                                        <th className="pb-2 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-primary-100">
                                                    {groupedFoods[group].map((food, idx) => (
                                                        <tr key={idx} className="group/row hover:bg-beige-50 transition-colors">
                                                            <td className="py-3 font-bold text-primary-900">
                                                                {food.name}
                                                                {food.subgroup && (
                                                                    <span className="block text-[10px] text-primary-400 font-normal uppercase tracking-wider">
                                                                        {food.subgroup}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 text-sm text-primary-600">{food.portion}</td>
                                                            <td className="py-3 text-center font-bold text-blue-900/70">{food.carbohydrates}</td>
                                                            <td className="py-3 text-center font-bold text-emerald-900/70">{food.protein}</td>
                                                            <td className="py-3 text-center font-bold text-amber-900/70">{food.fat}</td>
                                                            <td className="py-3 text-center font-black text-primary-900">{food.calories}</td>
                                                            <td className="py-3 text-right">
                                                                <button
                                                                    onClick={() => handleAddFood(food)}
                                                                    className="px-4 py-1.5 bg-primary-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-700 transition-all opacity-0 group-hover/row:opacity-100 transform translate-x-2 group-hover/row:translate-x-0"
                                                                >
                                                                    Add +
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    {/* Empty State for Search */}
                    {Object.keys(groupedFoods).length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-primary-200">
                            <p className="text-lg font-bold text-primary-400">No foods found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

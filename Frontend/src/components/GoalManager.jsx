import { useState } from "react";
import {
    Target,
    RefreshCcw,
    History,
    CheckCircle2,
    Clock,
    Plus,
    X,
    MessageSquare,
    RotateCcw
} from "lucide-react";

export default function GoalManager() {
    const [goals, setGoals] = useState([
        {
            id: 1,
            category: "Weight & Body Comp",
            title: "Target Weight Loss",
            currentValue: "64.2kg",
            targetValue: "62.0kg",
            status: "Maintained",
            lastUpdated: "Jan 15, 2024",
            history: [
                { date: "Oct 2023", value: "68kg", rationale: "Initial assessment." },
                { date: "Dec 2023", value: "65kg", rationale: "Patient responded well to calorie deficit." }
            ]
        },
        {
            id: 2,
            category: "Habit",
            title: "Morning Hydration",
            currentValue: "Pending",
            targetValue: "500ml water upon waking",
            status: "Foundational",
            lastUpdated: "Jan 28, 2024",
            history: [
                { date: "Dec 2023", value: "250ml", rationale: "Starting with a manageable amount to build consistency." }
            ]
        }
    ]);

    const [isAddingGoal, setIsAddingGoal] = useState(false);
    const [isEvolvingGoal, setIsEvolvingGoal] = useState(null); // id of goal being evolved

    const categories = ["Weight & Body Comp", "Habit", "Metabolic", "Clinical"];
    const statuses = ["Maintained", "Evolved", "Foundational", "Paused"];

    const getStatusStyles = (status) => {
        switch (status) {
            case "Foundational": return "bg-emerald-100 text-emerald-700";
            case "Evolved": return "bg-blue-100 text-blue-700";
            case "Paused": return "bg-gray-100 text-gray-500";
            default: return "bg-amber-100 text-amber-700";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-50 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Goal Evolution Tracking</h2>
                    <p className="text-sm text-gray-500">Long-term clinical milestones and behavioral changes.</p>
                </div>
                <button
                    onClick={() => setIsAddingGoal(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-sm text-xs font-bold transition-all shadow-sm"
                >
                    <Plus size={14} /> NEW GOAL TRACK
                </button>
            </div>

            {/* Goals List */}
            <div className="grid grid-cols-1 gap-6">
                {goals.map(goal => (
                    <div key={goal.id} className="bg-white border border-emerald-100 rounded-sm shadow-sm overflow-hidden flex flex-col md:flex-row">
                        {/* Status Sidebar */}
                        <div className="w-1 md:w-2 bg-emerald-500 shrink-0"></div>

                        <div className="flex-1 p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                <div>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 mb-1 block">
                                        {goal.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-800">{goal.title}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Target size={14} />
                                            <span className="font-semibold text-gray-700">{goal.targetValue}</span>
                                        </div>
                                        <div className="w-px h-3 bg-gray-200"></div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusStyles(goal.status)}`}>
                                            {goal.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEvolvingGoal(goal.id)}
                                        className="flex items-center gap-2 border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-sm text-[11px] font-bold transition-all"
                                    >
                                        <RefreshCcw size={14} /> EVOLVE GOAL
                                    </button>
                                </div>
                            </div>

                            {/* Evolution History Timeline */}
                            <div className="mt-8 relative pl-6 border-l border-emerald-50 space-y-6">
                                {/* Current Node */}
                                <div className="relative">
                                    <div className="absolute -left-[31px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 border-4 border-white ring-1 ring-emerald-500"></div>
                                    <div className="bg-emerald-50/30 p-3 rounded-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[11px] font-bold text-emerald-800">Current Phase · {goal.lastUpdated}</span>
                                            <span className="text-xs font-bold text-gray-800">{goal.targetValue}</span>
                                        </div>
                                        <p className="text-xs text-emerald-700 italic">"Active clinical target based on latest metabolic response."</p>
                                    </div>
                                </div>

                                {/* History Nodes */}
                                {goal.history.map((entry, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[29px] top-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 border-2 border-white"></div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-50 pb-2">
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{entry.date} History</span>
                                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                    <span className="font-bold text-gray-500 mr-2">{entry.value}</span>
                                                    {entry.rationale}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Evolution Modal (Conceptual Interface) */}
            {isEvolvingGoal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white max-w-lg w-full rounded-sm shadow-xl p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Evolve Clinical Goal</h3>
                                <p className="text-xs text-gray-500">Updating targets for: {goals.find(g => g.id === isEvolvingGoal)?.title}</p>
                            </div>
                            <button onClick={() => setIsEvolvingGoal(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400 mb-1.5 block tracking-widest">New Target Value</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:border-blue-500 outline-none transition-all font-medium"
                                    placeholder="e.g. 62.0kg or 500ml water"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400 mb-1.5 block tracking-widest">Clinical Status</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {statuses.map(s => (
                                        <button key={s} className="border border-gray-100 p-2 text-[11px] font-bold text-gray-600 hover:bg-gray-50 text-center transition-all rounded-sm uppercase tracking-wide">
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400 mb-1.5 block tracking-widest">Clinical Rationale (Internal Note)</label>
                                <textarea
                                    className="w-full border border-gray-200 p-3 rounded-sm text-sm focus:border-blue-500 outline-none transition-all font-medium min-h-[100px]"
                                    placeholder="Explain why this goal is being adjusted (e.g., metabolic plateaus, life stress, improved stamina)..."
                                />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-sm flex gap-3">
                                <History className="text-blue-500 mt-0.5 shrink-0" size={16} />
                                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                    <span className="font-bold underline">Commit Evolution:</span> The previous target will be archived in the evolution history. It will not be deleted, ensuring clinical continuity and pressure-free tracking.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setIsEvolvingGoal(null)}
                                    className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-sm transition-all uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        // Update logic would go here
                                        setIsEvolvingGoal(null);
                                    }}
                                    className="flex-1 py-3 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-sm transition-all uppercase tracking-widest shadow-sm"
                                >
                                    Confirm Evolution
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

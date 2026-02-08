import { useState } from "react";
import {
    Activity,
    Calendar,
    Heart,
    CheckCircle2,
    Flame,
    Zap,
    TrendingUp
} from "lucide-react";

export default function ConsistencyPulse({ role = "client", data = null }) {
    // Mock data if none provided
    const rhythmData = [
        { day: "Mon", status: "completed" },
        { day: "Tue", status: "completed" },
        { day: "Wed", status: "partial" },
        { day: "Thu", status: "completed" },
        { day: "Fri", status: "completed" },
        { day: "Sat", status: "pending" },
        { day: "Sun", status: "pending" },
    ];

    const heatmapData = Array.from({ length: 28 }, (_, i) => ({
        day: i + 1,
        intensity: Math.floor(Math.random() * 4) // 0 to 3
    }));

    const getIntensityClass = (lvl) => {
        switch (lvl) {
            case 3: return "bg-emerald-600";
            case 2: return "bg-emerald-400";
            case 1: return "bg-emerald-200";
            default: return "bg-gray-100";
        }
    };

    if (role === "dietitian") {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-emerald-800">
                        <Calendar size={18} />
                        <h3 className="font-bold text-sm uppercase tracking-tight">Consistency Heatmap (Last 28 Days)</h3>
                    </div>
                    <div className="flex gap-1 items-center">
                        <span className="text-[9px] text-gray-400 font-bold mr-1">LOW</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-100"></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[9px] text-gray-400 font-bold ml-1">HIGH</span>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {heatmapData.map((d) => (
                        <div
                            key={d.day}
                            title={`Day ${d.day}: ${d.intensity}/3 progress`}
                            className={`aspect-square rounded-sm ${getIntensityClass(d.intensity)} transition-all hover:ring-2 hover:ring-offset-1 hover:ring-emerald-200 cursor-help`}
                        ></div>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-sm border border-gray-100">
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                        "Visualizing the client’s adherence rhythm helps identify barriers during weekends or specific weeks, allowing for personalized strategy adjustments."
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity size={18} className="text-emerald-500 animate-pulse" />
                    <h3 className="font-bold text-gray-800">Weekly Harmony</h3>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-emerald-600">5</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Days in Flow</span>
                </div>
            </div>

            {/* Subtle Pulse Tracker */}
            <div className="flex justify-between items-center gap-2 py-2">
                {rhythmData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <div
                            className={`w-full h-1.5 rounded-full transition-all duration-700 ${d.status === 'completed' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.3)]' :
                                    d.status === 'partial' ? 'bg-emerald-200' : 'bg-gray-100'
                                }`}
                        ></div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{d.day}</span>
                    </div>
                ))}
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-sm border border-emerald-100 flex gap-4 items-center">
                <div className="bg-white p-2 rounded-full shadow-sm text-emerald-500">
                    <Heart size={16} />
                </div>
                <div>
                    <p className="text-xs text-emerald-800 font-medium">Your rhythm is steady! ✨</p>
                    <p className="text-[10px] text-emerald-600/70">Consistency isn't about being perfect, it's about staying connected to your goals.</p>
                </div>
            </div>

            {/* Soft Milestone (Small Text) */}
            <div className="flex justify-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
                    <Zap size={10} className="text-amber-500" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Clinical Commitment: 4 Weeks</span>
                </div>
            </div>
        </div>
    );
}

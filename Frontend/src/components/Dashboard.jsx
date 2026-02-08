import { useState, useMemo, useEffect } from "react";
import {
    Users,
    Calendar,
    FileText,
    Bell,
    Plus,
    Activity,
    ChevronRight,
    MessageCircle,
    Utensils,
    Target,
    TrendingUp
} from "lucide-react";
import ReminderManager from "./ReminderManager";
import ReflectionLog from "./ReflectionLog";
import ConsistencyPulse from "./ConsistencyPulse";
import { getPatients } from "../services/api";

export default function Dashboard({ onCreatePlan, onSelectClient }) {
    const [role, setRole] = useState("dietitian");
    const [activeClients, setActiveClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await getPatients();
            if (response.success && Array.isArray(response.data)) {
                setActiveClients(response.data);
            }

            setLoading(false);
        };
        fetchPatients();
    }, []);

    const todayFollowUps = [
        { time: "09:30 AM", client: "Maria Garcia", objective: "Weekly Review" },
        { time: "11:00 AM", client: "David Smith", objective: "Initial Assessment" },
    ];

    const todayMeals = [
        { time: "08:00 AM", meal: "Breakfast", icon: "🍳", items: "Oatmeal with berries, 2 egg whites" },
        { time: "01:30 PM", meal: "Lunch", icon: "🥗", items: "Grilled chicken salad with quinoa" },
        { time: "07:00 PM", meal: "Dinner", icon: "🍲", items: "Baked salmon with steamed broccoli" },
    ];

    const progressStats = [
        { label: "Calories", current: 1250, target: 1800, unit: "kcal", color: "bg-emerald-500" },
        { label: "Water", current: 1.5, target: 2.5, unit: "L", color: "bg-blue-500" },
        { label: "Steps", current: 6400, target: 10000, unit: "steps", color: "bg-amber-500" },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-6 font-sans">
            {/* Role Switcher */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-sm flex">
                    <button
                        onClick={() => setRole("dietitian")}
                        className={`px-4 py-1.5 text-sm font-bold rounded-sm transition-all ${role === "dietitian" ? "bg-white shadow-sm text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Dietitian View
                    </button>
                    <button
                        onClick={() => setRole("client")}
                        className={`px-4 py-1.5 text-sm font-bold rounded-sm transition-all ${role === "client" ? "bg-white shadow-sm text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Client View
                    </button>
                </div>
            </div>

            {role === "dietitian" ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Center: Main Management */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase">Dietitian Dashboard</h1>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Clinic Operations Feed</p>
                            </div>
                            <button
                                onClick={onCreatePlan}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-sm font-bold text-sm transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
                            >
                                <Plus size={18} />
                                CREATE NEW PLAN
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">
                                Indexing Clinical Data...
                            </div>
                        )}

                        {!loading && (
                            <>
                                {/* Stats Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white border-2 border-emerald-900/10 p-5 rounded-sm shadow-sm flex items-center gap-4">
                                        <div className="bg-emerald-50 p-3 rounded-sm text-emerald-600">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Clients</p>
                                            <p className="text-2xl font-black text-emerald-900">{activeClients.length}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white border-2 border-blue-900/10 p-5 rounded-sm shadow-sm flex items-center gap-4">
                                        <div className="bg-blue-50 p-3 rounded-sm text-blue-600">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plans Pending</p>
                                            <p className="text-2xl font-black text-blue-900">3</p>
                                        </div>
                                    </div>
                                    <div className="bg-white border-2 border-amber-900/10 p-5 rounded-sm shadow-sm flex items-center gap-4">
                                        <div className="bg-amber-50 p-3 rounded-sm text-amber-600">
                                            <TrendingUp size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Efficiency</p>
                                            <p className="text-2xl font-black text-amber-900">92%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Clients Table */}
                                <div className="bg-white border-2 border-emerald-900/10 rounded-sm shadow-sm overflow-hidden">
                                    <div className="p-5 border-b-2 border-emerald-50 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="font-black text-xs uppercase tracking-widest text-emerald-900">Active Patients</h3>
                                        <span className="text-[10px] font-bold text-gray-400">{activeClients.length} TOTAL RECORDS</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 text-[10px] uppercase text-gray-500 font-black tracking-widest">
                                                    <th className="px-6 py-4">Patient</th>
                                                    <th className="px-6 py-4">Goal</th>
                                                    <th className="px-6 py-4 text-center">BMI</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-emerald-50 text-sm">
                                                {activeClients.map((client) => (
                                                    <tr
                                                        key={client.id}
                                                        onClick={() => onSelectClient(client)}
                                                        className="hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                                                    >
                                                        <td className="px-6 py-4 font-bold text-gray-800">
                                                            {client.name}
                                                            <span className="block text-[10px] text-gray-400 font-medium">{client.gender} • {client.age}y</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600 font-medium uppercase text-xs tracking-tight">{client.goal}</td>
                                                        <td className="px-6 py-4 text-center font-black text-emerald-700">{client.bmi || '-'}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                                <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">Live</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button className="text-emerald-900 opacity-20 group-hover:opacity-100 transition-opacity">
                                                                <ChevronRight size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {activeClients.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">No patient records found in clinical database.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right: Sidebar Activity/Reminders */}
                    <div className="space-y-6">
                        <ReminderManager role={role} />

                        <div className="bg-white border-2 border-emerald-900/10 p-6 rounded-sm shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 -mr-12 -mt-12 rounded-full opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-6 text-emerald-900 border-b-2 border-emerald-50 pb-3">
                                    <Calendar size={18} />
                                    <h3 className="font-black text-xs uppercase tracking-widest">Clinic Schedule</h3>
                                </div>
                                <div className="space-y-4">
                                    {todayFollowUps.map((meeting, i) => (
                                        <div key={i} className="flex items-start gap-4 p-2 hover:bg-gray-50 rounded-sm transition-colors border-l-2 border-transparent hover:border-emerald-500">
                                            <div className="text-center min-w-[50px]">
                                                <p className="text-xs font-black text-emerald-700">{meeting.time.split(' ')[0]}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase">{meeting.time.split(' ')[1]}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{meeting.client}</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{meeting.objective}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-900 p-6 rounded-sm shadow-lg text-white">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">Session Summary</h3>
                            <p className="text-sm font-medium leading-relaxed">
                                You have <span className="text-emerald-400 font-bold underline">3 assessments</span> pending for the high-priority metabolic group today.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* CLIENT DASHBOARD */
                /* ... (keeping client board similar but could also push to real data if goals/meals were dynamic) */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Health Status</h1>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Maria Garcia • Client Profile</p>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-sm border border-emerald-100">
                                <Target size={18} />
                                <span className="font-bold text-xs uppercase tracking-widest">Weight Loss Phase 1</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {progressStats.map((stat, i) => (
                                <div key={i} className="bg-white border-2 border-emerald-900/10 p-6 rounded-sm shadow-sm hover:translate-y-[-2px] transition-all">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{stat.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-black text-emerald-900">{stat.current}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">/ {stat.target} {stat.unit}</p>
                                    </div>
                                    <div className="mt-4 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${stat.color} transition-all duration-700 ease-out`}
                                            style={{ width: `${(stat.current / stat.target) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white border-2 border-emerald-900/10 rounded-sm shadow-sm overflow-hidden">
                            <div className="p-6 border-b-2 border-emerald-50 flex items-center gap-3 bg-gray-50/50">
                                <Utensils className="text-emerald-700" size={20} />
                                <h3 className="font-black text-xs uppercase tracking-widest text-emerald-900">Today's Nutrition Plan</h3>
                                <p className="ml-auto text-[10px] text-gray-400 uppercase font-black tracking-widest">Active Schedule</p>
                            </div>
                            <div className="p-8 space-y-8 relative">
                                <div className="absolute left-12 top-8 bottom-8 w-1 bg-emerald-50"></div>
                                {todayMeals.map((meal, i) => (
                                    <div key={i} className="flex gap-8 relative z-10">
                                        <div className="w-10 h-10 rounded-sm bg-white border-2 border-emerald-900/10 flex items-center justify-center shadow-sm">
                                            <span className="text-xl">{meal.icon}</span>
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex justify-between mb-1">
                                                <h4 className="font-black text-xs uppercase tracking-widest text-gray-800">{meal.meal}</h4>
                                                <span className="text-[10px] font-bold text-gray-400">{meal.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 font-medium leading-relaxed">{meal.items}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border-2 border-emerald-900/10 p-6 rounded-sm shadow-sm">
                            <ConsistencyPulse role="client" />
                        </div>

                        <div className="bg-white border-2 border-emerald-900/10 p-6 rounded-sm shadow-sm">
                            <ReflectionLog role="client" patientId={activeClients[0]?.id} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

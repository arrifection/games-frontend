import { useState } from "react";
import {
    User,
    History,
    ClipboardList,
    TrendingUp,
    AlertCircle,
    Plus,
    ArrowLeft,
    FileText,
    Calendar,
    Target,
    Activity,
    MessageCircle
} from "lucide-react";
import GoalManager from "./GoalManager";
import ReflectionLog from "./ReflectionLog";
import ConsistencyPulse from "./ConsistencyPulse";

export default function PatientDetail({ patient, onBack, onEditPlan }) {
    const [activeTab, setActiveTab] = useState("overview");

    // Mock history data for demonstration
    const history = {
        plans: [
            { id: 1, date: "2024-01-10", name: "High Protein / Low Carb Version 1", status: "Completed" },
            { id: 2, date: "2023-11-15", name: "Maintenance Plan", status: "Archived" }
        ],
        followUps: [
            { date: "2024-01-28", weight: "64.2kg", note: "Adherence is good, feeling more energetic.", type: "In-person" },
            { date: "2024-01-14", weight: "65.5kg", note: "Adjusting to new calorie deficit.", type: "Remote" }
        ],
        notes: [
            { id: 1, date: "2024-01-28", author: "Dr. Sarah", text: "Patient reported slight hunger in evenings. Added 10g protein to dinner snack." },
            { id: 2, date: "2024-01-10", author: "Dr. Sarah", text: "Initial assessment. Patient motivated. No clinical red flags." }
        ]
    };

    const tabs = [
        { id: "overview", label: "Profile Overview", icon: <User size={16} /> },
        { id: "goals", label: "Goals Tracking", icon: <Target size={16} /> },
        { id: "reflections", label: "Patient Reflections", icon: <MessageCircle size={16} /> },
        { id: "plans", label: "Diet Plans", icon: <FileText size={16} /> },
        { id: "history", label: "Follow-ups & Notes", icon: <History size={16} /> },
    ];


    return (
        <div className="space-y-6">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
                    <p className="text-sm text-gray-500">Patient ID: #P-{patient.id || '00' + patient.name.length} • Registered Jan 2024</p>
                </div>
                <div className="ml-auto flex gap-3">
                    <button
                        onClick={() => onEditPlan(patient)}
                        className="btn-primary text-sm flex items-center gap-2"
                    >
                        <Plus size={16} /> Update Plan
                    </button>
                </div>
            </div>

            {/* Quick Profile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-emerald-100 p-4 rounded-sm shadow-sm">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Status</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">On Track</span>
                </div>
                <div className="bg-white border border-emerald-100 p-4 rounded-sm shadow-sm">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Age / Gender</p>
                    <p className="text-sm font-bold text-gray-800">{patient.age}yr • {patient.gender}</p>
                </div>
                <div className="bg-white border border-emerald-100 p-4 rounded-sm shadow-sm">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Height / Weight</p>
                    <p className="text-sm font-bold text-gray-800">{patient.height}cm • {patient.weight}kg</p>
                </div>
                <div className="bg-white border border-emerald-100 p-4 rounded-sm shadow-sm">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">BMI</p>
                    <p className="text-sm font-bold text-emerald-600">{patient.bmi || '23.4'} (Normal)</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-emerald-100 flex gap-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === tab.id
                            ? "border-emerald-500 text-emerald-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Summary Section */}
                        <div className="space-y-6">
                            <div className="bg-white border border-emerald-100 p-6 rounded-sm shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Activity className="text-emerald-600" size={18} /> Current Assessment
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-emerald-50/50 rounded-sm border-l-4 border-emerald-400">
                                        <p className="text-xs text-emerald-800 leading-relaxed italic">
                                            "Patient is showing consistent progress with protein targets. Next phase will focus on metabolic flexibility and evening habit stack."
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-50 rounded-sm">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Activity Level</p>
                                            <p className="text-sm font-bold text-gray-700">{patient.activity_level}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-sm">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Goal Status</p>
                                            <p className="text-sm font-bold text-gray-700">{patient.goal}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-emerald-100 p-6 rounded-sm shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <AlertCircle className="text-amber-500" size={18} /> Clinical History
                                </h3>
                                <div className="text-sm text-gray-600 space-y-2">
                                    <p><span className="font-bold">Medical Notes:</span> {patient.medical_notes || "No previous records."}</p>
                                    <p><span className="font-bold">Known Allergies:</span> None reported.</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Progress section */}
                        <div className="space-y-6">
                            <div className="bg-white border border-emerald-100 p-6 rounded-sm shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <TrendingUp className="text-emerald-600" size={18} /> Weight Trend (Last 30 days)
                                </h3>
                                <div className="h-32 flex items-end gap-2 px-2 border-b border-gray-100 pb-2">
                                    {[66.2, 65.8, 65.5, 65.2, 64.8, 64.5, 64.2].map((w, i) => (
                                        <div key={i} className="flex-1 bg-emerald-100 hover:bg-emerald-400 transition-all cursor-help rounded-t-sm" style={{ height: `${(w - 60) * 10}%` }}></div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                                    <span>Jan 01</span>
                                    <span>Jan 28</span>
                                </div>
                            </div>

                            <div className="bg-white border border-emerald-100 p-6 rounded-sm shadow-sm">
                                <ConsistencyPulse role="dietitian" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "goals" && (
                    <GoalManager />
                )}

                {activeTab === "reflections" && (
                    <div className="max-w-4xl mx-auto">
                        <ReflectionLog role="dietitian" patientId={patient.id} />
                    </div>
                )}

                {activeTab === "plans" && (
                    <div className="bg-white border border-emerald-100 rounded-sm shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500">
                                <tr>
                                    <th className="px-6 py-4 text-left">Date</th>
                                    <th className="px-6 py-4 text-left">Plan Name</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50 text-sm">
                                {history.plans.map(p => (
                                    <tr key={p.id} className="hover:bg-emerald-50/50">
                                        <td className="px-6 py-4 text-gray-500">{p.date}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{p.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold uppercase ${p.status === 'Completed' ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-emerald-600 hover:underline">View PDF</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "history" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Follow up history */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <ClipboardList className="text-emerald-600" size={18} /> Follow-up Log
                            </h3>
                            {history.followUps.map((f, i) => (
                                <div key={i} className="bg-white border border-emerald-50 p-4 rounded-sm shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">{f.date}</span>
                                        <span className="text-xs text-gray-400">{f.type}</span>
                                    </div>
                                    <p className="text-sm font-bold mb-1">Weight: {f.weight}</p>
                                    <p className="text-sm text-gray-600 italic">"{f.note}"</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Progress Notes */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <FileText className="text-emerald-600" size={18} /> Clinical Notes
                            </h3>
                            {history.notes.map(note => (
                                <div key={note.id} className="bg-amber-50/30 border border-amber-100 p-4 rounded-sm">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-bold text-amber-700">{note.date}</span>
                                        <span className="text-[10px] font-bold text-gray-400">{note.author}</span>
                                    </div>
                                    <p className="text-xs text-amber-900 leading-relaxed">{note.text}</p>
                                </div>
                            ))}
                            <button className="w-full py-2 bg-white border border-emerald-100 text-emerald-600 text-xs font-bold rounded-sm hover:bg-emerald-50 transition-all border-dashed">
                                + ADD NEW CLINICAL NOTE
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

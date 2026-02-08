import { useState, useEffect } from "react";
import {
    Bell,
    Calendar,
    Clock,
    AlertCircle,
    MessageCircle,
    MoreHorizontal,
    CheckCircle2,
    Send,
    X,
    UserMinus
} from "lucide-react";
import { getReminders, dismissReminder } from "../services/api";

export default function ReminderManager({ role = "dietitian" }) {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReminders = async () => {
            const response = await getReminders();
            if (response.success) {
                setReminders(response.data);
            }
            setLoading(false);
        };
        fetchReminders();
    }, []);

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case "high": return "border-red-500 bg-red-50 text-red-800";
            case "medium": return "border-amber-500 bg-amber-50 text-amber-800";
            default: return "border-blue-500 bg-blue-50 text-blue-800";
        }
    };

    const handleAction = async (id, action) => {
        if (action === 'dismiss') {
            const response = await dismissReminder(id);
            if (response.success) {
                setReminders(prev => prev.filter(r => r.id !== id));
            }
        } else {
            console.log(`Action ${action} on reminder ${id}`);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Bell size={18} className="text-emerald-700" />
                    <h3 className="font-bold text-gray-800">Clinic Action Queue</h3>
                </div>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {reminders.length} ACTIVE
                </span>
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-4 text-xs text-gray-400">Loading action queue...</div>
                ) : reminders.length > 0 ? reminders.map(reminder => (
                    <div
                        key={reminder.id}
                        className={`border-l-4 p-4 rounded-sm shadow-sm flex flex-col gap-3 transition-all hover:translate-x-1 ${getPriorityStyles(reminder.priority)}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] uppercase font-black tracking-widest opacity-70">
                                        {reminder.type}
                                    </span>
                                    <span className="text-[10px] opacity-50 font-medium">• {reminder.time_label}</span>
                                </div>
                                <h4 className="text-sm font-bold leading-tight">{reminder.patient_name}</h4>
                                <p className="text-xs opacity-80 mt-1">{reminder.text}</p>
                            </div>
                            <button className="opacity-40 hover:opacity-100 p-1">
                                <MoreHorizontal size={14} />
                            </button>
                        </div>

                        <div className="flex gap-2 pt-1">
                            {reminder.priority === 'high' && (
                                <button
                                    onClick={() => handleAction(reminder.id, 'nudge')}
                                    className="flex-1 bg-red-800 text-white text-[10px] font-bold py-1.5 rounded-sm flex items-center justify-center gap-1 hover:bg-red-900 transition-colors"
                                >
                                    <Send size={12} /> SEND URGENT NUDGE
                                </button>
                            )}
                            {reminder.priority === 'medium' && (
                                <button
                                    onClick={() => handleAction(reminder.id, 'review')}
                                    className="flex-1 bg-amber-800 text-white text-[10px] font-bold py-1.5 rounded-sm flex items-center justify-center gap-1 hover:bg-amber-900 transition-colors"
                                >
                                    OPEN CLINICAL REVIEW
                                </button>
                            )}
                            {reminder.priority === 'low' && (
                                <button
                                    onClick={() => handleAction(reminder.id, 'confirm')}
                                    className="flex-1 bg-blue-800 text-white text-[10px] font-bold py-1.5 rounded-sm flex items-center justify-center gap-1 hover:bg-blue-900 transition-colors"
                                >
                                    <CheckCircle2 size={12} /> CONFIRM ATTENDANCE
                                </button>
                            )}

                            <button
                                onClick={() => handleAction(reminder.id, 'dismiss')}
                                className="px-3 py-1.5 bg-white/50 border border-current/20 text-[10px] font-bold hover:bg-white rounded-sm transition-all"
                            >
                                DISMISS
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-200 rounded-sm">
                        <CheckCircle2 size={24} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400 font-medium tracking-wide">Action queue is clear.</p>
                    </div>
                )}
            </div>

            {/* Notification Filter Controls */}
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-sm border border-gray-100">
                <p className="text-[9px] text-gray-400 font-bold uppercase pl-1">Filter View</p>
                <div className="flex gap-2">
                    <button className="text-[9px] font-black text-emerald-700 bg-white border border-emerald-100 px-2 py-0.5 rounded-sm">ALL</button>
                    <button className="text-[9px] font-black text-gray-400 hover:text-red-600 px-2 py-0.5 rounded-sm">URGENT</button>
                    <button className="text-[9px] font-black text-gray-400 hover:text-blue-600 px-2 py-0.5 rounded-sm">ROUTINE</button>
                </div>
            </div>

            <div className="bg-emerald-50/50 p-3 rounded-sm border border-emerald-100">
                <div className="flex gap-2">
                    <AlertCircle size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-emerald-800 leading-relaxed italic">
                        "System automatically filters alerts to prevent fatigue. High-priority metabolic alerts are always surfaced first."
                    </p>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import {
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    Send,
    HelpCircle,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { getLogs, createLog, updateLog } from "../services/api";

export default function ReflectionLog({ role = "client", patientId }) {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newEntry, setNewEntry] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if (!patientId) return;

        const fetchLogs = async () => {
            const response = await getLogs(patientId);
            if (response.success) {
                setEntries(response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            }
            setLoading(false);
        };
        fetchLogs();
    }, [patientId]);

    const handleAddEntry = async () => {
        if (!newEntry.trim() || !patientId) return;

        const now = new Date();
        const logData = {
            patient_id: patientId,
            date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: newEntry,
            status: "pending",
            type: "Note"
        };

        const response = await createLog(logData);
        if (response.success) {
            setEntries([response.data, ...entries]);
            setNewEntry("");
        }
    };

    const toggleResolved = async (id) => {
        const entry = entries.find(e => e.id === id);
        const newStatus = entry.status === "resolved" ? "pending" : "resolved";

        const response = await updateLog(id, { status: newStatus });
        if (response.success) {
            setEntries(entries.map(e =>
                e.id === id ? { ...e, status: newStatus } : e
            ));
        }
    };

    if (!patientId && role === "client") return <div className="text-gray-400 text-xs italic">Select a patient context to view logs.</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-50 pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 p-2 rounded-sm text-emerald-600">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Mind & Body Log</h3>
                        <p className="text-xs text-gray-500">Continuous reflection for clinical review.</p>
                    </div>
                </div>
                {role === "dietitian" && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter("pending")}
                            className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all ${filter === "pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all ${filter === "all" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}
                        >
                            All
                        </button>
                    </div>
                )}
            </div>

            {/* Entry Form (Client Only) */}
            {role === "client" && (
                <div className="bg-white border border-emerald-100 p-4 rounded-sm shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Offload a thought or concern</p>
                    <textarea
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        className="w-full border border-gray-100 p-3 rounded-sm text-sm focus:border-emerald-500 outline-none transition-all min-h-[100px] bg-gray-50/30"
                        placeholder="Symptoms, cravings, questions, or general feelings..."
                    />
                    <div className="flex justify-between items-center mt-3">
                        <p className="text-[10px] text-gray-400 italic">This will be reviewed during your next follow-up.</p>
                        <button
                            onClick={handleAddEntry}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-sm text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                        >
                            <Send size={14} /> LOG CONCERN
                        </button>
                    </div>
                </div>
            )}

            {/* Logs Timeline */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-4 text-xs text-gray-400">Loading reflection logs...</div>
                ) : entries
                    .filter(e => filter === "all" || e.status === filter)
                    .map(entry => (
                        <div
                            key={entry.id}
                            className={`bg-white border transition-all rounded-sm shadow-sm overflow-hidden ${entry.status === 'resolved' ? 'border-gray-100 opacity-70' : 'border-emerald-100 border-l-4 border-l-amber-400'}`}
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400">{entry.date} · {entry.time}</span>
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase ${entry.type === 'Symptom' ? 'bg-red-50 text-red-600' :
                                            entry.type === 'Question' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {entry.type}
                                        </span>
                                    </div>
                                    {role === "dietitian" ? (
                                        <button
                                            onClick={() => toggleResolved(entry.id)}
                                            className={`flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-bold transition-all ${entry.status === 'resolved' ? 'text-gray-400' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                }`}
                                        >
                                            {entry.status === 'resolved' ? <CheckCircle2 size={12} /> : null}
                                            {entry.status === 'resolved' ? 'ADDRESSED' : 'MARK AS ADDRESSED'}
                                        </button>
                                    ) : (
                                        <span className={`text-[10px] font-bold ${entry.status === 'resolved' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                            {entry.status === 'resolved' ? '✓ Reviewed' : '● Pending Review'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-wrap">
                                    {entry.text}
                                </p>

                                {entry.response && (
                                    <div className="mt-4 p-3 bg-emerald-50/50 border-t border-emerald-50 rounded-sm">
                                        <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1">Dietitian Response</p>
                                        <p className="text-xs text-gray-600 italic">"{entry.response}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                {!loading && entries.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-gray-200 rounded-sm">
                        <HelpCircle size={32} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-xs text-gray-400 font-medium">No logs found. Start by writing down a thought or concern.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

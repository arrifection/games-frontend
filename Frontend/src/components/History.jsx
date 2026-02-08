import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const History = ({ onBack }) => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get("http://localhost:8000/history/list");
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-emerald-900 tracking-tight">My Records</h2>
                    <p className="text-emerald-600 font-medium mt-1">Activity history for {user?.username}</p>
                </div>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 border border-emerald-100 text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            ) : history.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-emerald-50 shadow-sm">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">No activity yet</h3>
                    <p className="text-gray-500 mt-2">Start using the planners and calculators to see your history here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((entry) => (
                        <div key={entry._id} className="bg-white rounded-2xl border border-emerald-50 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${entry.activity_type.includes("BMI") ? "bg-blue-50 text-blue-600" :
                                                entry.activity_type.includes("Macros") ? "bg-emerald-50 text-emerald-600" :
                                                    "bg-purple-50 text-purple-600"
                                            }`}>
                                            {entry.activity_type}
                                        </span>
                                        <span className="text-[11px] font-semibold text-gray-400">
                                            {formatDate(entry.timestamp)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Input Data</p>
                                            <div className="grid grid-cols-2 gap-y-2">
                                                {Object.entries(entry.input_data).map(([key, val]) => (
                                                    <div key={key}>
                                                        <p className="text-[10px] text-gray-500 capitalize">{key.replace('_', ' ')}</p>
                                                        <p className="text-sm font-bold text-gray-800">{String(val)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-emerald-50/50 rounded-xl p-4">
                                            <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest mb-3">Result</p>
                                            <div className="grid grid-cols-1 gap-y-2">
                                                {Object.entries(entry.output_result).slice(0, 4).map(([key, val]) => (
                                                    <div key={key} className="flex justify-between border-b border-emerald-100 last:border-0 pb-1">
                                                        <p className="text-xs text-emerald-700 capitalize">{key.replace('_', ' ')}</p>
                                                        <p className="text-xs font-bold text-emerald-900 italic">{String(val)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;

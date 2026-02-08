import { useState, useEffect } from "react";
import Card from "./ui/Card";
import { createPatient, updatePatient, getPatients } from "../services/api";

export default function PatientProfile({ onProfileUpdate, onError }) {
    const [patients, setPatients] = useState([]);
    const [profile, setProfile] = useState({
        name: "",
        age: "",
        gender: "female",
        height: "",
        weight: "",
        activity_level: "sedentary",
        allergies: "",
        dietary_restrictions: "",
        goal: "maintenance"
    });
    const [originalProfile, setOriginalProfile] = useState(null);

    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [heightUnit, setHeightUnit] = useState("cm"); // "cm" or "ft"
    const [heightFt, setHeightFt] = useState({ feet: "", inches: "" });

    // Fetch existing patients on mount
    useEffect(() => {
        const fetchPatients = async () => {
            const response = await getPatients();
            if (response.success) setPatients(response.data);
        };
        fetchPatients();
    }, []);

    const handleSelectPatient = (id) => {
        if (!id) {
            setProfile({ name: "", age: "", gender: "female", height: "", weight: "", activity_level: "sedentary", allergies: "", dietary_restrictions: "", goal: "maintenance" });
            setMetrics(null);
            setIsEditing(true);
            return;
        }
        const selected = patients.find(p => p.id === id);
        if (selected) {
            setProfile(selected);
            setOriginalProfile(selected);
            setMetrics(selected);
            setIsEditing(false);
            onProfileUpdate?.(selected);
        }
    };

    const activityLevels = [
        { value: "sedentary", label: "Sedentary (Office job)" },
        { value: "light", label: "Lightly Active (1-3 days/week)" },
        { value: "moderate", label: "Moderately Active (3-5 days/week)" },
        { value: "active", label: "Active (6-7 days/week)" },
        { value: "very_active", label: "Very Active (Physical job)" }
    ];

    const goals = [
        { value: "weight loss", label: "Weight Loss (-300 kcal)" },
        { value: "maintenance", label: "Maintenance" },
        { value: "weight gain", label: "Weight Gain (+300 kcal)" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleHeightFtChange = (e) => {
        const { name, value } = e.target;
        setHeightFt(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Calculate height in CM if using feet
        let finalHeight = profile.height;
        if (heightUnit === "ft") {
            const ft = parseFloat(heightFt.feet) || 0;
            const inc = parseFloat(heightFt.inches) || 0;
            finalHeight = (ft * 30.48) + (inc * 2.54);
        }

        // Prepare data (convert types)
        const data = {
            ...profile,
            height: parseFloat(finalHeight),
            age: parseInt(profile.age),
            weight: parseFloat(profile.weight)
        };

        let response;
        if (metrics && metrics.id) {
            response = await updatePatient(metrics.id, data);
        } else {
            response = await createPatient(data);
        }

        if (response.success) {
            setMetrics(response.data);
            setIsEditing(false);
            setOriginalProfile(response.data);
            if (response.data.height) {
                setProfile(prev => ({ ...prev, height: response.data.height }));
            }
            if (onProfileUpdate) {
                onProfileUpdate(response.data);
            }
            // Refresh patient list
            const pResp = await getPatients();
            if (pResp.success) setPatients(pResp.data);
        } else {
            onError?.(response.error);
        }
        setLoading(false);
    };

    return (
        <Card
            title="Patient Profile"
            description="Manage personal details and health constants"
            className="w-full"
        >
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b-2 border-primary-100 pb-6">
                <div className="w-full md:w-64">
                    <label className="block text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Load Saved Profile</label>
                    <select
                        onChange={(e) => handleSelectPatient(e.target.value)}
                        value={profile.id || ""}
                        className="w-full p-2 border-2 border-primary-200 text-sm font-bold bg-beige-50"
                    >
                        <option value="">-- New Profile --</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.age}y)</option>
                        ))}
                    </select>
                </div>
                <button
                    type="button"
                    onClick={() => handleSelectPatient("")}
                    className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                    <span className="text-lg">+</span> Create New
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-primary-900 uppercase tracking-widest mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                            className="w-full p-2 border-2 border-primary-900 bg-white disabled:bg-beige-100"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-primary-900 uppercase tracking-widest mb-1">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={profile.age}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                                className="w-full p-2 border-2 border-primary-900 bg-white disabled:bg-beige-100"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-primary-900 uppercase tracking-widest mb-1">Gender</label>
                            <select
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full p-2 border-2 border-primary-900 bg-white disabled:bg-beige-100"
                            >
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Measurements */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-black text-primary-900 uppercase tracking-widest">Height</label>
                            {isEditing && (
                                <div className="text-[10px] space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setHeightUnit("cm")}
                                        className={`font-bold ${heightUnit === "cm" ? "text-primary-900 underline" : "text-primary-400"}`}
                                    >CM</button>
                                    <button
                                        type="button"
                                        onClick={() => setHeightUnit("ft")}
                                        className={`font-bold ${heightUnit === "ft" ? "text-primary-900 underline" : "text-primary-400"}`}
                                    >FT/IN</button>
                                </div>
                            )}
                        </div>

                        {heightUnit === "cm" ? (
                            <input
                                type="number"
                                name="height"
                                placeholder="cm"
                                value={profile.height}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                                className="w-full p-2 border-2 border-primary-900 bg-white disabled:bg-beige-100"
                            />
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    name="feet"
                                    placeholder="ft"
                                    value={heightFt.feet}
                                    onChange={handleHeightFtChange}
                                    disabled={!isEditing}
                                    className="w-full p-2 border-2 border-primary-900 bg-white disabled:bg-beige-100"
                                />
                                <input
                                    type="number"
                                    name="inches"
                                    placeholder="in"
                                    value={heightFt.inches}
                                    onChange={handleHeightFtChange}
                                    disabled={!isEditing}
                                    className="w-full p-2 border-2 border-primary-900 bg-white disabled:bg-beige-100"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-black text-primary-900 uppercase tracking-widest mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={profile.weight}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                            className="w-full p-2 border-2 border-primary-900 bg-white disabled:bg-beige-100"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-primary-900 uppercase tracking-widest mb-1">Goal</label>
                        <select
                            name="goal"
                            value={profile.goal}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full p-2 border-2 border-primary-900 bg-white disabled:bg-beige-100"
                        >
                            {goals.map(g => (
                                <option key={g.value} value={g.value}>{g.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Activity & Health */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-primary-900 uppercase tracking-widest mb-1">Activity Level</label>
                        <select
                            name="activity_level"
                            value={profile.activity_level}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full p-2 border-2 border-primary-900 bg-white disabled:bg-beige-100"
                        >
                            {activityLevels.map(l => (
                                <option key={l.value} value={l.value}>{l.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-primary-900 uppercase tracking-widest mb-1">Allergies / Restrictions</label>
                        <input
                            type="text"
                            name="allergies"
                            placeholder="e.g. Peanuts, Gluten"
                            value={profile.allergies}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full p-2 border-2 border-primary-900 bg-white disabled:bg-beige-100"
                        />
                    </div>
                </div>

                {/* Actions & Metrics */}
                <div className="border-t-2 border-primary-100 pt-4 mt-6">
                    {metrics ? (
                        <div className="bg-primary-900 text-white p-6 mb-4">
                            <div className="grid grid-cols-3 gap-8 text-center">
                                <div>
                                    <p className="text-xs uppercase opacity-70 mb-1">BMI</p>
                                    <p className="text-4xl font-black text-yellow-400">{metrics.bmi}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase opacity-70 mb-1">BMR</p>
                                    <p className="text-4xl font-black text-pink-400">{metrics.bmr}</p>
                                    <p className="text-[10px]">kcal/day</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase opacity-70 mb-1">Target TDEE</p>
                                    <p className="text-4xl font-black text-green-400">{metrics.tdee}</p>
                                    <p className="text-[10px]">kcal/day</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-beige-100 p-6 mb-4 text-center text-primary-500 font-bold uppercase text-sm">
                            Enter details to calculate metrics
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        {(!isEditing && metrics) ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-8 py-3 bg-primary-600 text-white border-2 border-primary-900 font-black uppercase tracking-widest hover:bg-primary-700 shadow-[4px_4px_0px_0px_#881337] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                {metrics && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfile(originalProfile);
                                            setIsEditing(false);
                                        }}
                                        className="px-6 py-2 bg-white text-primary-900 border-2 border-primary-900 font-black uppercase tracking-widest hover:bg-beige-100"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-primary-900 text-white border-2 border-primary-900 font-black uppercase tracking-widest hover:bg-primary-800 shadow-[4px_4px_0px_0px_#4c0519] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : (metrics ? "Update Profile" : "Save & Calculate")}
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </form>
        </Card>
    );
}

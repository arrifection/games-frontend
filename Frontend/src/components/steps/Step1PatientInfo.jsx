import { useState, useEffect } from "react";
import { createPatient, updatePatient, getPatients } from "../../services/api";

export default function Step1PatientInfo({ onSave, onError, initialData }) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!initialData);
    const [heightUnit, setHeightUnit] = useState("cm"); // "cm" or "ft"
    const [heightFt, setHeightFt] = useState({ feet: "", inches: "" });

    const [profile, setProfile] = useState({
        name: "",
        age: "",
        gender: "female",
        height: "",
        weight: "",
        activity_level: "sedentary",
        goal: "maintenance",
        medical_notes: "",
    });

    // Load existing patients for dropdown
    useEffect(() => {
        const fetchPatients = async () => {
            const response = await getPatients();
            if (response.success) setPatients(response.data);
        };
        fetchPatients();
    }, []);

    // Pre-fill if initialData provided
    useEffect(() => {
        if (initialData) {
            setProfile({
                name: initialData.name || "",
                age: initialData.age || "",
                gender: initialData.gender || "female",
                height: initialData.height || "",
                weight: initialData.weight || "",
                activity_level: initialData.activity_level || "sedentary",
                goal: initialData.goal || "maintenance",
                medical_notes: initialData.medical_notes || "",
                id: initialData.id,
            });
            setIsEditing(false);
        }
    }, [initialData]);

    const activityLevels = [
        { value: "sedentary", label: "Sedentary (office job, minimal exercise)" },
        { value: "light", label: "Light (1-3 days/week)" },
        { value: "moderate", label: "Moderate (3-5 days/week)" },
        { value: "active", label: "Active (6-7 days/week)" },
        { value: "very_active", label: "Very Active (physical job + exercise)" },
    ];

    const goals = [
        { value: "weight loss", label: "Weight Loss" },
        { value: "maintenance", label: "Maintenance" },
        { value: "weight gain", label: "Weight Gain" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleHeightFtChange = (e) => {
        const { name, value } = e.target;
        setHeightFt((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectPatient = (id) => {
        if (!id) {
            setProfile({
                name: "",
                age: "",
                gender: "female",
                height: "",
                weight: "",
                activity_level: "sedentary",
                goal: "maintenance",
                medical_notes: "",
            });
            setHeightFt({ feet: "", inches: "" });
            setIsEditing(true);
            return;
        }
        const selected = patients.find((p) => p.id === id);
        if (selected) {
            setProfile({
                ...selected,
                medical_notes: selected.medical_notes || "",
            });
            setIsEditing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("🟢 Submit button clicked");
        setLoading(true);


        // Calculate height in CM if using feet
        let finalHeight = profile.height;
        if (heightUnit === "ft") {
            const ft = parseFloat(heightFt.feet) || 0;
            const inc = parseFloat(heightFt.inches) || 0;
            finalHeight = (ft * 30.48) + (inc * 2.54);
        }

        const heightVal = parseFloat(finalHeight);
        const ageVal = parseInt(profile.age);
        const weightVal = parseFloat(profile.weight);

        if (isNaN(heightVal) || isNaN(ageVal) || isNaN(weightVal)) {
            onError?.("Please enter valid numbers for age, height, and weight");
            setLoading(false);
            return;
        }

        const data = {
            ...profile,
            height: heightVal,
            age: ageVal,
            weight: weightVal,
        };


        console.log("📤 Sending patient data:", data);
        let response;
        if (profile.id) {
            response = await updatePatient(profile.id, data);
        } else {
            response = await createPatient(data);
        }

        console.log("📥 Backend response:", response);

        if (response.success) {
            // Refresh patient list
            const pResp = await getPatients();
            if (pResp.success) setPatients(pResp.data);

            onSave(response.data);
        } else {
            console.error("❌ Save failed:", response.error);
            onError?.(response.error);
        }

        setLoading(false);
    };

    return (
        <div className="section">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="section-title">Patient Information</h2>
                    <p className="text-sm text-gray-500">
                        Step 1 of 5 — Enter patient details
                    </p>
                </div>
            </div>

            {/* Load existing patient */}
            <div className="mb-8 pb-6 border-b border-emerald-100">
                <label className="form-label">Load Existing Patient</label>
                <div className="flex gap-3">
                    <select
                        onChange={(e) => handleSelectPatient(e.target.value)}
                        value={profile.id || ""}
                        className="form-select flex-1"
                    >
                        <option value="">— New Patient —</option>
                        {patients.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name} ({p.age} years)
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => handleSelectPatient("")}
                        className="btn-secondary"
                    >
                        New
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="form-label">Patient Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                            className="form-input"
                            placeholder="Full name"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={profile.age}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                                className="form-input"
                                placeholder="Years"
                            />
                        </div>
                        <div>
                            <label className="form-label">Gender</label>
                            <select
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="form-select"
                            >
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Measurements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="form-label mb-0">Height</label>
                            {isEditing && (
                                <div className="flex gap-2 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setHeightUnit("cm")}
                                        className={`px-2 py-1 rounded ${heightUnit === "cm" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}
                                    >
                                        CM
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHeightUnit("ft")}
                                        className={`px-2 py-1 rounded ${heightUnit === "ft" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}
                                    >
                                        Ft/In
                                    </button>
                                </div>
                            )}
                        </div>
                        {heightUnit === "cm" ? (
                            <input
                                type="number"
                                name="height"
                                value={profile.height}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                                className="form-input"
                                placeholder="e.g. 165"
                            />
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    name="feet"
                                    value={heightFt.feet}
                                    onChange={handleHeightFtChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                    placeholder="Feet"
                                />
                                <input
                                    type="number"
                                    name="inches"
                                    value={heightFt.inches}
                                    onChange={handleHeightFtChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                    placeholder="Inches"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="form-label">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={profile.weight}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                            className="form-input"
                            placeholder="e.g. 65"
                        />
                    </div>
                    <div>
                        <label className="form-label">Goal</label>
                        <select
                            name="goal"
                            value={profile.goal}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="form-select"
                        >
                            {goals.map((g) => (
                                <option key={g.value} value={g.value}>
                                    {g.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Activity Level */}
                <div className="mb-6">
                    <label className="form-label">Activity Level</label>
                    <select
                        name="activity_level"
                        value={profile.activity_level}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-select"
                    >
                        {activityLevels.map((l) => (
                            <option key={l.value} value={l.value}>
                                {l.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Medical Notes */}
                <div className="mb-8">
                    <label className="form-label">Medical Notes (optional)</label>
                    <textarea
                        name="medical_notes"
                        value={profile.medical_notes}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={3}
                        className="form-textarea"
                        placeholder="Allergies, conditions, dietary restrictions..."
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-emerald-100">
                    {!isEditing && profile.id ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="btn-secondary"
                        >
                            Edit Patient
                        </button>
                    ) : null}

                    {isEditing && profile.id && (
                        <button
                            type="button"
                            onClick={() => {
                                handleSelectPatient(profile.id);
                            }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading
                            ? "Saving..."
                            : profile.id
                                ? "Update & Continue"
                                : "Save & Continue"}
                    </button>
                </div>
            </form>
        </div>
    );
}

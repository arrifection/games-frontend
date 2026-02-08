export default function Step2Calculations({ metrics, onProceed, onBack }) {
    if (!metrics) {
        return (
            <div className="section">
                <p className="text-gray-500 text-center py-8">
                    No calculations available. Please complete patient information first.
                </p>
                <div className="flex justify-center">
                    <button onClick={onBack} className="btn-secondary">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600" };
        if (bmi < 25) return { label: "Normal Weight", color: "text-emerald-600" };
        if (bmi < 30) return { label: "Overweight", color: "text-amber-600" };
        return { label: "Obese", color: "text-red-600" };
    };

    const bmiCategory = getBMICategory(metrics.bmi);

    return (
        <div className="section">
            <div className="mb-6">
                <h2 className="section-title">Calculation Results</h2>
                <p className="text-sm text-gray-500">
                    Step 2 of 5 — Review calculated metrics
                </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* BMI */}
                <div className="data-box">
                    <div className="data-label">BMI</div>
                    <div className="flex items-baseline gap-2">
                        <span className="data-value">{metrics.bmi}</span>
                        <span className="text-sm text-gray-500">kg/m²</span>
                    </div>
                    <div className={`mt-2 text-sm font-medium ${bmiCategory.color}`}>
                        {bmiCategory.label}
                    </div>
                </div>

                {/* BMR */}
                <div className="data-box">
                    <div className="data-label">BMR</div>
                    <div className="flex items-baseline gap-2">
                        <span className="data-value">{metrics.bmr}</span>
                        <span className="text-sm text-gray-500">kcal/day</span>
                    </div>
                </div>

                {/* TDEE */}
                <div className="data-box border-emerald-200 bg-emerald-50">
                    <div className="data-label">TDEE (Target)</div>
                    <div className="flex items-baseline gap-2">
                        <span className="data-value text-emerald-700">{metrics.tdee}</span>
                        <span className="text-sm text-emerald-600">kcal/day</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-emerald-100">
                <button onClick={onBack} className="btn-secondary">
                    ← Back
                </button>
                <button onClick={onProceed} className="btn-primary">
                    Proceed to Macro Setup →
                </button>
            </div>
        </div>
    );
}

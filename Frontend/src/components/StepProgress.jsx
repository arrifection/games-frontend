export default function StepProgress({ currentStep, onStepClick }) {
    const steps = [
        { number: 1, title: "Patient Info" },
        { number: 2, title: "Calculations" },
        { number: 3, title: "Macro Setup" },
        { number: 4, title: "Meal Planner" },
        { number: 5, title: "Weekly Plan" },
    ];

    const getStepStatus = (stepNumber) => {
        if (stepNumber < currentStep) return "completed";
        if (stepNumber === currentStep) return "active";
        return "inactive";
    };

    return (
        <div className="flex items-center justify-between">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1 last:flex-none">
                    {/* Step circle and label */}
                    <button
                        onClick={() => step.number <= currentStep && onStepClick(step.number)}
                        disabled={step.number > currentStep}
                        className={`flex flex-col items-center ${step.number <= currentStep ? "cursor-pointer" : "cursor-default"
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${getStepStatus(step.number) === "completed"
                                ? "bg-emerald-600 text-white"
                                : getStepStatus(step.number) === "active"
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-200 text-gray-500"
                                }`}
                        >
                            {getStepStatus(step.number) === "completed" ? "✓" : step.number}
                        </div>
                        <span
                            className={`mt-1.5 text-xs font-medium ${getStepStatus(step.number) === "active"
                                ? "text-gray-800"
                                : getStepStatus(step.number) === "completed"
                                    ? "text-emerald-600"
                                    : "text-gray-400"
                                }`}
                        >
                            {step.title}
                        </span>
                    </button>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                        <div
                            className={`h-px flex-1 mx-4 ${step.number < currentStep ? "bg-emerald-600" : "bg-emerald-200"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

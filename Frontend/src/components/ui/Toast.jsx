export default function Toast({ message, type = "info", isVisible, onClose }) {
    if (!isVisible) return null;

    const typeStyles = {
        success: "bg-emerald-600 text-white",
        error: "bg-red-600 text-white",
        info: "bg-gray-800 text-white",
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div
                className={`flex items-center gap-3 px-4 py-3 rounded-sm shadow-lg ${typeStyles[type] || typeStyles.info
                    }`}
            >
                <span className="text-sm font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white ml-2"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

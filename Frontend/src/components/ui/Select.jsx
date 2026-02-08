import { cn } from "../../utils/cn";
import { ChevronDown } from "lucide-react";

export default function Select({ label, className, options, ...props }) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-medium text-slate-700 ml-1">{label}</label>}
            <div className="relative">
                <select
                    className={cn(
                        "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm",
                        "text-slate-900 appearance-none cursor-pointer",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                        "transition-all duration-200",
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
        </div>
    );
}

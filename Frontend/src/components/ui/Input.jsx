import { cn } from "../../utils/cn";

export default function Input({ label, className, ...props }) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-medium text-slate-700 ml-1">{label}</label>}
            <input
                className={cn(
                    "w-full px-5 py-4 border-2 border-primary-900 bg-beige-50",
                    "text-primary-950 font-bold placeholder:text-beige-400",
                    "focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:bg-white",
                    "transition-all duration-200 uppercase tracking-tight",
                    className
                )}
                {...props}
            />
        </div>
    );
}

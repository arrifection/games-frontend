import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Card({ children, className, title, description, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "bg-offwhite border-4 border-primary-900 p-10 shadow-[8px_8px_0px_0px_rgba(180,148,99,0.3)]",
                className
            )}
            {...props}
        >
            {(title || description) && (
                <div className="mb-6">
                    {title && <h2 className="text-xl font-bold text-slate-900">{title}</h2>}
                    {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
                </div>
            )}
            {children}
        </motion.div>
    );
}

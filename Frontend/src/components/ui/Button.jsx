import { motion } from 'framer-motion';
import { cn } from '../../utils/cn'; // I need to create a utils file for clsx/tailwind-merge

export default function Button({ children, className, variant = 'primary', ...props }) {
    const baseStyles = "px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 shadow-sm hover:shadow-md";

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 font-black uppercase tracking-widest shadow-lg active:translate-y-0.5",
        secondary: "bg-beige-100 text-primary-900 border-2 border-primary-900 hover:bg-beige-200 font-black uppercase tracking-widest",
        danger: "bg-red-800 text-white hover:bg-red-900 font-black uppercase tracking-widest"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
}

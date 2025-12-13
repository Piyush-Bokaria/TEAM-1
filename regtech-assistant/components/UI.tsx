import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card: React.FC<HTMLMotionProps<"div"> & { children: React.ReactNode }> = ({ children, className = '', ...props }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn("bg-white border border-reg-border rounded-[10px] shadow-sm hover:shadow-md transition-shadow duration-300", className)}
    {...props}
  >
    {children}
  </motion.div>
);

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & { 
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info'; 
  children: React.ReactNode 
}> = ({ variant = 'neutral', children, className, ...props }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    error: 'bg-red-50 text-red-700 border-red-100',
    neutral: 'bg-slate-50 text-slate-600 border-slate-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100'
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-[6px] text-xs font-medium border", styles[variant], className)} {...props}>
      {children}
    </span>
  );
};

export const Button: React.FC<Omit<HTMLMotionProps<"button">, "children"> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
  children?: React.ReactNode;
}> = ({ className = '', variant = 'primary', isLoading, children, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1";
  
  const variants = {
    primary: "bg-reg-navy hover:bg-slate-800 text-white shadow-sm hover:shadow-md focus:ring-reg-navy",
    secondary: "bg-reg-teal hover:bg-reg-tealDark text-white shadow-sm hover:shadow-md focus:ring-reg-teal",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-reg-navy focus:ring-slate-200",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 focus:ring-red-200"
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyle, variants[variant], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </motion.button>
  );
};
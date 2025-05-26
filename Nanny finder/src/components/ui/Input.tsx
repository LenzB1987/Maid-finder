import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftAddon,
      rightAddon,
      size = 'md',
      className,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-4 py-3 text-lg',
    };
    
    return (
      <div className={cn('flex flex-col space-y-1', fullWidth ? 'w-full' : '', className)}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftAddon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {leftAddon}
            </div>
          )}
          
          <input
            id={id}
            ref={ref}
            className={cn(
              'block rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm transition-colors',
              'focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus:ring-1',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
              sizeClasses[size],
              leftAddon ? 'pl-10' : '',
              rightAddon ? 'pr-10' : '',
              error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : '',
              fullWidth ? 'w-full' : ''
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            {...props}
          />
          
          {rightAddon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              {rightAddon}
            </div>
          )}
        </div>
        
        {helperText && !error && (
          <p id={`${id}-helper`} className="text-xs text-gray-500">
            {helperText}
          </p>
        )}
        
        {error && (
          <p id={`${id}-error`} className="text-xs text-error-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
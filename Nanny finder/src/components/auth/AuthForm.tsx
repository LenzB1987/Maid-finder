import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuthStore } from '../../store/auth';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['parent', 'nanny']).optional(),
  fullName: z.string().min(2, 'Full name is required').optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const { signIn, signUp } = useAuthStore();
  const isSignUp = mode === 'signup';
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isSignUp) {
        await signUp(data.email, data.password, {
          role: data.role,
          full_name: data.fullName,
        });
      } else {
        await signIn(data.email, data.password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
        fullWidth
      />
      
      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
        fullWidth
      />
      
      {isSignUp && (
        <>
          <Input
            label="Full Name"
            error={errors.fullName?.message}
            {...register('fullName')}
            fullWidth
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a:
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="parent"
                  {...register('role')}
                  className="mr-2"
                />
                Parent
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="nanny"
                  {...register('role')}
                  className="mr-2"
                />
                Nanny
              </label>
            </div>
            {errors.role && (
              <p className="text-xs text-error-600 mt-1">{errors.role.message}</p>
            )}
          </div>
        </>
      )}
      
      <Button
        type="submit"
        isLoading={isSubmitting}
        fullWidth
      >
        {isSignUp ? 'Create Account' : 'Sign In'}
      </Button>
    </form>
  );
};

export default AuthForm;
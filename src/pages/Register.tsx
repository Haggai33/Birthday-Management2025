import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormInput } from '../components/forms/FormInput';
import type { RegisterData } from '../types/auth';

function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterData & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-gray-600">Join the Yechiel Family Birthday System</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            id="firstName"
            label="First Name"
            register={register}
            disabled={isSubmitting}
            validation={{
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters',
              },
            }}
            error={errors.firstName}
          />

          <FormInput
            id="lastName"
            label="Last Name"
            register={register}
            disabled={isSubmitting}
            validation={{
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters',
              },
            }}
            error={errors.lastName}
          />
        </div>

        <FormInput
          id="email"
          label="Email"
          type="email"
          register={register}
          disabled={isSubmitting}
          validation={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          error={errors.email}
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          register={register}
          disabled={isSubmitting}
          validation={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          error={errors.password}
        />

        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          register={register}
          disabled={isSubmitting}
          validation={{
            required: 'Please confirm your password',
            validate: value =>
              value === password || 'The passwords do not match',
          }}
          error={errors.confirmPassword}
        />

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center px-4 py-2 rounded-md ${
              isSubmitting
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isSubmitting ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Create Account
              </>
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LogIn, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormInput } from '../components/forms/FormInput';
import type { LoginData } from '../types/auth';

function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await login(data);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="mt-2 text-gray-600">Please sign in to your account</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6 space-y-6">
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
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </>
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
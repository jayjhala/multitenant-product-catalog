'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import authApi from '@/services/auth-api';

// Define the schema
const registerSchema = z.object({
    tenantName: z
        .string()
        .min(3, 'Tenant name must be at least 3 characters')
        .regex(/^[A-Za-z\s]+$/, 'Tenant name can only contain letters and spaces'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});


// Infer the form type from the schema
type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setError('');
        setIsLoading(true);

        try {
            const response = await authApi.post('/auth/register', data);

            if (response.data) {
                router.push('/login');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-semibold mb-4">Register</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="tenantName" className="block mb-2 text-gray-700">Tenant Name</label>
                        <input
                            type="text"
                            id="tenantName"
                            {...register('tenantName')}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        {errors.tenantName && <p className="text-red-500 text-sm mt-1">{errors.tenantName.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email')}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2 text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password')}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full cursor-pointer bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex justify-center items-center">
                                <svg
                                    className="w-5 h-5 mr-2 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z" fill="none" stroke="currentColor" strokeWidth="4"></path>
                                </svg>
                                Registering...
                            </span>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-500 hover:text-blue-600">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

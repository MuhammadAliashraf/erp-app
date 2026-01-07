import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password);
      navigate('/');
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="absolute inset-0 bg-black/20" />
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-none backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center tracking-tight text-gray-900">Welcome back</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="Ex. johndoe" 
                {...register('username')} 
                className={errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                {...register('password')} 
                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 transition-all duration-200" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"/> 
                    Signing In...
                  </span>
                ) : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
             <p className="text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">Register</Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

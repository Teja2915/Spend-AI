import React, { useState } from 'react';
import type { User } from '../../types';

interface LoginViewProps {
  onLogin: (credentials: Pick<User, 'email' | 'password'>) => { success: boolean, message: string };
  onRegister: (newUser: Omit<User, 'id'>) => { success: boolean, message: string };
  onGuestLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegister, onGuestLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginView) {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      const result = onLogin({ email, password });
      if (!result.success) {
        setError(result.message);
      }
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all required fields.');
        return;
      }
      const result = onRegister({ 
        name, 
        email, 
        password, 
        mobile,
        profilePicUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${name}`
      });
       if (!result.success) {
        setError(result.message);
      }
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    // Clear form fields
    setEmail('');
    setPassword('');
    setName('');
    setMobile('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary mr-3 flex items-center justify-center font-bold text-primary-foreground text-2xl">S</div>
            <h1 className="font-bold text-3xl text-foreground">SpendAI</h1>
          </div>
          <h2 className="text-xl font-semibold text-foreground">{isLoginView ? 'Welcome Back!' : 'Create an Account'}</h2>
          <p className="text-sm text-muted-foreground">{isLoginView ? 'Sign in to continue' : 'Get started with SpendAI'}</p>
        </div>
        
        {error && <div className="p-3 text-sm text-center text-destructive-foreground bg-destructive/80 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="text-sm font-medium text-muted-foreground" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-muted-foreground" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
           {!isLoginView && (
            <div>
              <label className="text-sm font-medium text-muted-foreground" htmlFor="mobile">Mobile Number (Optional)</label>
              <input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}
          <button type="submit" className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors">
            {isLoginView ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center">
            <button onClick={toggleView} className="text-sm text-primary hover:underline">
            {isLoginView ? 'Don\'t have an account? Sign up' : 'Already have an account? Sign in'}
            </button>
        </div>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
        </div>

         <button onClick={onGuestLogin} className="w-full py-2 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-secondary/80 transition-colors">
            Continue as Guest
        </button>
      </div>
    </div>
  );
};

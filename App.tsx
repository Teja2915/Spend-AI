import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { ChatView } from './components/chat/ChatView';
import { LoginView } from './components/auth/LoginView';
import { ProfileView } from './components/profile/ProfileView';
import type { View, User, Theme } from './types';
import { MOCK_INVOICES } from './lib/mockData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<Theme>('dark');
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem('spendai-users');
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      return [];
    }
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('spendai-currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('spendai-users', JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users to localStorage", error);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('spendai-currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('spendai-currentUser');
      }
    } catch (error) {
      console.error("Failed to save current user to localStorage", error);
    }
  }, [currentUser]);

  const handleRegister = (newUser: Omit<User, 'id'>): { success: boolean, message: string } => {
    if (users.some(user => user.email === newUser.email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const userWithId = { ...newUser, id: `user_${Date.now()}` };
    setUsers(prevUsers => [...prevUsers, userWithId]);
    setCurrentUser(userWithId);
    return { success: true, message: 'Account created successfully!' };
  };

  const handleLogin = (credentials: Pick<User, 'email' | 'password'>): { success: boolean, message: string } => {
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
      setCurrentUser(user);
      return { success: true, message: 'Logged in successfully!' };
    }
    return { success: false, message: 'Invalid email or password.' };
  };
  
  const handleGuestLogin = () => {
    setCurrentUser({
        id: 'guest',
        name: 'Guest User',
        email: 'guest@spendai.com',
        mobile: '',
        password: '',
        profilePicUrl: `https://api.dicebear.com/8.x/initials/svg?seed=Guest`
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };


  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'chat':
        return <ChatView />;
      case 'profile':
        return currentUser ? <ProfileView user={currentUser} onUpdateUser={handleUpdateUser} /> : <LoginView onLogin={handleLogin} onRegister={handleRegister} onGuestLogin={handleGuestLogin} />;
      default:
        return <DashboardView />;
    }
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} onRegister={handleRegister} onGuestLogin={handleGuestLogin} />;
  }

  return (
    <div className={`${theme} flex h-screen bg-background text-foreground`}>
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={currentUser}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={currentUser} 
          theme={theme} 
          setTheme={setTheme} 
          onProfileClick={() => setCurrentView('profile')}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background/50 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
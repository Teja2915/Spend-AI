import React from 'react';
import type { View, User } from '../../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  user: User;
  onLogout: () => void;
}

const NavItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md transition-colors
      ${isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
  >
    {children}
    <span className="ml-3">{label}</span>
  </button>
);

const ChartBarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /> </svg> );
const ChatBubbleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /> </svg> );
const UserCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /> </svg> );
const LogoutIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /> </svg> );

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, user, onLogout }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-card border-r border-border p-4 flex flex-col">
      <div>
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary mr-3 flex items-center justify-center font-bold text-primary-foreground text-xl">S</div>
          <h1 className="font-bold text-xl">SpendAI</h1>
        </div>
        <nav className="space-y-2">
          <NavItem
            label="Dashboard"
            isActive={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          >
            <ChartBarIcon />
          </NavItem>
          <NavItem
            label="AI Assistant"
            isActive={currentView === 'chat'}
            onClick={() => setCurrentView('chat')}
          >
            <ChatBubbleIcon />
          </NavItem>
           <NavItem
            label="Profile"
            isActive={currentView === 'profile'}
            onClick={() => setCurrentView('profile')}
          >
            <UserCircleIcon />
          </NavItem>
        </nav>
      </div>
      <div className="mt-auto">
         <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-muted/50">
            <img src={user.profilePicUrl} alt="User" className="w-10 h-10 rounded-full object-cover bg-secondary" />
            <div>
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
        </div>
        <NavItem
          label="Logout"
          isActive={false}
          onClick={onLogout}
        >
          <LogoutIcon />
        </NavItem>
      </div>
    </aside>
  );
};
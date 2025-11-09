import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import type { User } from '../../types';
import { ProfilePicModal } from './ProfilePicModal';

interface ProfileViewProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser }) => {
    const [name, setName] = useState(user.name);
    const [mobile, setMobile] = useState(user.mobile);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setName(user.name);
        setMobile(user.mobile);
    }, [user]);

    const handleSave = () => {
        onUpdateUser({ ...user, name, mobile });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };
    
    const handleProfilePicSave = (newUrl: string) => {
        onUpdateUser({ ...user, profilePicUrl: newUrl });
        setIsModalOpen(false);
    }

    const hasChanges = user.name !== name || user.mobile !== mobile;

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>Manage your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img src={user.profilePicUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-2 ring-primary"/>
                            <button onClick={() => setIsModalOpen(true)} className="absolute bottom-0 right-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
                         <div>
                            <label className="text-sm font-medium text-muted-foreground" htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 mt-1 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground" htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full px-3 py-2 mt-1 bg-muted/50 border border-input rounded-md cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground" htmlFor="mobile">Mobile Number</label>
                            <input
                                id="mobile"
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="w-full px-3 py-2 mt-1 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        {isSaved && <p className="text-sm text-green-500">Changes saved!</p>}
                        <button 
                            onClick={handleSave} 
                            disabled={!hasChanges}
                            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Changes
                        </button>
                    </div>
                </CardContent>
            </Card>
            {isModalOpen && <ProfilePicModal onClose={() => setIsModalOpen(false)} onSave={handleProfilePicSave} />}
        </div>
    );
};
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ProfilePicModalProps {
    onClose: () => void;
    onSave: (newUrl: string) => void;
}

type Tab = 'avatar' | 'upload' | 'camera';
type CameraState = 'idle' | 'streaming' | 'preview' | 'error';

const AVATARS = [
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Mimi',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Max',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Coco',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Rocky',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Luna',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Leo',
];

const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
const AvatarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>

export const ProfilePicModal: React.FC<ProfilePicModalProps> = ({ onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState<Tab>('avatar');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [cameraState, setCameraState] = useState<CameraState>('idle');
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isVideoReady, setIsVideoReady] = useState(false);
    
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraState('idle');
        setIsVideoReady(false);
    }, []);

    const startCamera = useCallback(async () => {
        if (streamRef.current) stopCamera();
        setCameraState('idle');
        setCameraError(null);
        setIsVideoReady(false);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraError("Camera access is not supported by your browser.");
            setCameraState('error');
            return;
        }

        try {
            if (navigator.permissions) {
                 const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
                 if (permissionStatus.state === 'denied') {
                     setCameraError("Camera permission denied. Please enable it in your browser settings for this site.");
                     setCameraState('error');
                     return;
                 }
            }

            const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = newStream;
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        if (err.name !== 'AbortError') {
                            console.error("Video play failed:", err);
                            setCameraError("Could not start the video stream.");
                            setCameraState('error');
                        }
                    });
                }
            }
            setCameraState('streaming');
        } catch (err: any) {
            console.error("Camera error:", err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setCameraError("Camera access denied. Please allow camera access in your browser settings to use this feature.");
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setCameraError("No camera found on your device. Please connect a camera and try again.");
            } else {
                setCameraError("Could not access camera. Please check your connection and browser permissions.");
            }
            setCameraState('error');
        }
    }, [stopCamera]);


    useEffect(() => {
        if (activeTab === 'camera') {
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
             stopCamera();
        };
    }, [activeTab, startCamera, stopCamera]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleTakePhoto = () => {
        if (videoRef.current && canvasRef.current && isVideoReady) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            setPreviewUrl(canvas.toDataURL('image/png'));
            stopCamera();
            setCameraState('preview');
        }
    };

    const handleRetake = () => {
        setPreviewUrl(null);
        startCamera();
    }
    
    const handleSave = () => {
        if (previewUrl) {
            onSave(previewUrl);
        }
    };

    const TabButton = ({ tab, icon, label }: { tab: Tab; icon: React.ReactNode; label: string; }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center p-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        >
            {icon} {label}
        </button>
    );
    
    const renderCameraContent = () => {
        switch(cameraState) {
            case 'streaming':
                return (
                    <>
                        <div className="w-full max-w-sm h-48 bg-muted rounded-md overflow-hidden flex items-center justify-center mb-4 relative">
                            <video 
                                ref={videoRef} 
                                playsInline 
                                autoPlay 
                                className="w-full h-full object-cover" 
                                muted 
                                onCanPlay={() => setIsVideoReady(true)}
                            />
                            {!isVideoReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                                    <p>Starting camera...</p>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={handleTakePhoto}
                            disabled={!isVideoReady}
                            className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Take Photo
                        </button>
                    </>
                );
            case 'preview':
                return (
                     <>
                        <div className="w-full max-w-sm h-48 bg-muted rounded-md overflow-hidden flex items-center justify-center mb-4">
                             {previewUrl && <img src={previewUrl} alt="Camera preview" className="w-full h-full object-cover" />}
                        </div>
                        <button onClick={handleRetake} className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-secondary/80 transition-colors">Retake</button>
                    </>
                );
            case 'error':
                 return <p className="text-sm text-destructive text-center p-4">{cameraError}</p>;
            case 'idle':
            default:
                 return (
                    <div className="flex items-center text-muted-foreground">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Initializing Camera...
                    </div>
                );
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-lg">Update Profile Picture</h3>
                </div>
                <div className="p-4 flex gap-2 bg-muted/50">
                    <TabButton tab="avatar" icon={<AvatarIcon />} label="Avatar" />
                    <TabButton tab="upload" icon={<UploadIcon />} label="Upload" />
                    <TabButton tab="camera" icon={<CameraIcon />} label="Camera" />
                </div>
                
                <div className="p-6 min-h-[250px] flex flex-col items-center justify-center">
                    {activeTab === 'avatar' && (
                        <div className="grid grid-cols-3 gap-4">
                            {AVATARS.map(url => (
                                <button key={url} onClick={() => setPreviewUrl(url)} className={`rounded-full transition-all duration-200 ${previewUrl === url ? 'ring-4 ring-primary ring-offset-2 ring-offset-card' : 'hover:opacity-80'}`}>
                                    <img src={url} alt="Avatar" className="w-24 h-24 rounded-full"/>
                                </button>
                            ))}
                        </div>
                    )}
                    {activeTab === 'upload' && (
                        <div className="text-center">
                            {previewUrl ? 
                                <img src={previewUrl} alt="Upload preview" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                                : <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-muted flex items-center justify-center text-muted-foreground">Preview</div>
                            }
                            <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-secondary/80 transition-colors">
                                Choose a file...
                            </label>
                            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>
                    )}
                    {activeTab === 'camera' && (
                        <div className="w-full flex flex-col items-center">
                           {renderCameraContent()}
                           <canvas ref={canvasRef} className="hidden"></canvas>
                        </div>
                    )}
                </div>

                 <div className="flex justify-end items-center gap-4 p-4 bg-muted/50 border-t border-border rounded-b-lg">
                    {previewUrl && <img src={previewUrl} alt="Final Preview" className="w-10 h-10 rounded-full object-cover mr-auto"/>}
                    <button onClick={onClose} className="px-4 py-2 border border-input bg-background font-semibold rounded-md hover:bg-accent transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={!previewUrl}
                        className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
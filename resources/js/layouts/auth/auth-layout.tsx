import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative">
            {/* Background with overlay */}
            <div 
                className="absolute inset-0 z-0" 
                style={{
                    backgroundImage: 'url("/images/leaf-bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(0.7)'
                }}
            />
            {/* Logo  */}
            <div className="mb-1">
                <img 
                    src="/images/your-logo.png" 
                    alt="AgriCord" 
                    className="h-4 w-auto"
                    test-id="AgriCord-Logo"
                />
            </div>
            {/* Content with glassmorphism effect */}
            <div className="w-full max-w-sm relative z-10 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md p-8 rounded-xl border border-white/30 shadow-xl -mt-8" 
                style={{
                    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                }}>
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col items-center -space-y-5">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-1 font-medium"
                        >
                            <div className="flex flex-col items-center">
                                {/* logo */}
                                <img 
                                    src="/images/logo.png" 
                                    alt="AgriCord Logo" 
                                    className="h-40 w-auto -mt-10"
                                />
                                {/* Text if logo is not available */}
                                {/* <div className="text-2xl font-bold text-[#ffffff]">
                                    AgriCord
                                </div> */}
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium text-[#ffffff]">{title}</h1>
                            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

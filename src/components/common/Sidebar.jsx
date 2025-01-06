import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="min-h-screen w-64 bg-white shadow-lg flex flex-col items-center py-6 ">
            {/* Logo */}
            <div className="mb-10">
                <Logo />
            </div>

            {/* Menu Items */}
            <nav className="space-y-8 w-full text-[#3F3F46]">
                {[
                    { id:"/dashboard", name: "Dashboard", icon: "house" },
                    { id: "/questioning", name: "Practice", icon: "dumbbell" },
                    { id: "/dashboard", name: "Performance", icon: "chart-line" },
                    { id: "/dashboard", name: "Friends", icon: "git-merge" },
                    { id: "/dashboard", name: "Textbook", icon: "book-open" },
                    { id: "/dashboard", name: "OSCE", icon: "bed" },
                ].map((item, index) => (
                    
                    <div
                        key={index}
                        className="flex items-center space-x-3 px-6 group cursor-pointer"
                    >
                       
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`lucide lucide-${item.icon} group-hover:text-[#3CC8A1]`}
                        >
                            {/* Define paths for the icons */}
                            {item.icon === "house" && (
                                <>
                                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                </>
                            )}
                            {item.icon === "dumbbell" && (
                                <>
                                    <path d="M14.4 14.4 9.6 9.6" />
                                    <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
                                    <path d="m21.5 21.5-1.4-1.4" />
                                    <path d="M3.9 3.9 2.5 2.5" />
                                    <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
                                </>
                            )}
                            {item.icon === "chart-line" && (
                                <>
                                    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                                    <path d="m19 9-5 5-4-4-3 3" />
                                </>
                            )}
                            {item.icon === "git-merge" && (
                                <>
                                    <circle cx="18" cy="18" r="3" />
                                    <circle cx="6" cy="6" r="3" />
                                    <path d="M6 21V9a9 9 0 0 0 9 9" />
                                </>
                            )}
                            {item.icon === "book-open" && (
                                <>
                                    <path d="M12 7v14" />
                                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                                </>
                            )}
                            {item.icon === "bed" && (
                                <>
                                    <path d="M2 4v16" />
                                    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                                    <path d="M2 17h20" />
                                    <path d="M6 8v9" />
                                </>
                            )}
                        </svg>
                        <Link to={item.id}>
                        <span className="text-[16px] font-medium group-hover:text-[#3CC8A1]">
                            {item.name}
                        </span>
                    </Link>
                    </div>
                   
                ))}
            </nav>

            {/* Bottom Settings */}
            <div className="mt-auto w-full px-6">
                <Link to='/setting'>
                <div className="flex items-center space-x-3 text-[#3F3F46] group cursor-pointer">

                    <i className="fa fa-cog text-xl group-hover:text-[#3CC8A1]"></i>
                    
                    <span className="text-lg font-medium group-hover:text-[#3CC8A1]">
                        Settings
                    </span>
                </div>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
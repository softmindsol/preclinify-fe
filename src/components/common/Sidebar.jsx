import React, { useEffect } from "react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptions } from "../../redux/features/subscription/subscription.service";

const Sidebar = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const darkModeRedux = useSelector((state) => state.darkMode.isDarkMode);
  const { subscriptions, plan, loader, planType } = useSelector(
    (state) => state?.subscription,
  );

  const navItems = [
    { id: "/dashboard", name: "Dashboard", icon: "house" },
    { id: "/questioning", name: "Practice", icon: "dumbbell" },
    { id: "/osce", name: "OSCE", icon: "bed" },
    { id: "/textbook", name: "Textbook", icon: "book-open" },
  ];

  // **Only show pricing if plan is null or undefined**
  if (!plan) {
    navItems.push({ id: "/pricing", name: "Pricing", icon: "gem" });
  }
  useEffect(() => {
    dispatch(fetchSubscriptions({ userId }));
  }, [dispatch, userId]);

  return (
    <div
      className={`flex min-h-screen w-64 flex-col items-center bg-white py-6 text-black shadow-lg dark:border-r-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A]`}
    >
      {/* Logo */}
      <div className="mb-10">
        <Link to={"/dashboard"}>
          <Logo />
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="w-full space-y-8 text-[#3F3F46]">
        {navItems.map((item, index) => (
          <div key={index}>
            <NavLink
              to={item.id}
              className="group flex cursor-pointer items-center space-x-3 px-6 dark:text-white"
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
                {item.icon === "gem" && (
                  <>
                    <path d="M6 3h12l4 6-10 13L2 9Z" />
                    <path d="M11 3 8 9l4 13 4-13-3-6" />
                    <path d="M2 9h20" />
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
                {item.icon === "book-open" && (
                  <>
                    <path d="M12 7v14" />
                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                  </>
                )}
              </svg>
              <span className="text-[16px] font-semibold group-hover:text-[#3CC8A1]">
                {item.name}
              </span>
            </NavLink>
          </div>
        ))}
      </nav>

      {/* Bottom Settings */}
      <div className="mt-auto w-full px-6">
        <div className="group flex cursor-pointer items-center space-x-3 text-[#3F3F46] dark:text-white">
          <NavLink to="/setting">
            <span className="text-lg font-medium group-hover:text-[#3CC8A1]">
              Settings
            </span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

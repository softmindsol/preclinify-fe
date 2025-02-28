import { useEffect, useState } from "react";
import supabase from "../config/helper";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/common/Loader";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ProtectedRoute = ({ children }) => {
  const currentPlan = useSelector((state) => state?.subscription?.plan);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const isDashboardRoute = location.pathname.includes('/dashboard');

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <Loader />; // Show loading state while checking auth

  // Not logged in - redirect to login
  if (!user) return <Navigate to="/login" />;

  // Dashboard route specific checks - verify plan exists
  if (isDashboardRoute && (!currentPlan || !Object.keys(currentPlan).length)) {
    toast.error("You need to subscribe to a plan to access the dashboard.");
    // If on dashboard route but no plan exists, redirect to plans page
    return <Navigate to="/pricing" />;
  }

  // User is authenticated and has required plan (if needed)
  return children;
};

export default ProtectedRoute;
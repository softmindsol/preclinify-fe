import { useEffect, useState } from "react";
import supabase from "../config/helper";
import { Navigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const currentPlan = useSelector((state) => state?.subscription?.plan) || null;

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
      }
      setLoading(false);
    };

    checkUser();
  }, []); // Removed 'loading' from dependencies to prevent infinite re-renders

  if (loading) return <Loader />; // Show loader while checking authentication

  // If user is NOT logged in → Redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but has no current plan → Redirect to pricing
  if (user && currentPlan == null) {
    return <Navigate to="/pricing" replace />;
  }

  // Otherwise, show the protected content
  return children;
};

export default ProtectedRoute;

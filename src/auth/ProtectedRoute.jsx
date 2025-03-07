import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import supabase from "../config/helper";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ children, redirectIfAuthenticated = false }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
      setLoading(false);
    };

    checkUser();

    // 🟢 Supabase auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  if (loading) return <Loader />;
 
  // 🟢 If user is logged in, redirect from login/signup to home
  if (user && redirectIfAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // if(user){
  //     return <Navigate to="/dashboard" replace />;
  // }
  // 🔴 If user is not logged in, redirect to login
  if (!user && !redirectIfAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }


  return children;
};

export default ProtectedRoute;

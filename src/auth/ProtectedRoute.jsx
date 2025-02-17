import { useEffect, useState } from 'react';
import supabase from '../config/helper';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

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

    if (loading) return <p>Loading...</p>; // Avoid flashing login page
    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

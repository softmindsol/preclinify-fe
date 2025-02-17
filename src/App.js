import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import logo from './logo.svg';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import Pricing from './pages/Pricing';
import VerifyEmail from './pages/VerifyEmail';
import Setting from './pages/Setting';
import Dashboard from './pages/Dashboard';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';

import Questioning from './components/Questioning';
import QuestionCard from './components/QuestionCard';
import Score from './components/common/Score';
import ShortQuestion from './components/ShortQuestion';
import Scenarios from './components/Scenerio';
import SceneriosDetail from './components/SceneriosDetail';
// import Performance from './pages/Performance';
import ContactPage from './components/contact-us';
import { useContext, useEffect } from 'react';
import ThemeContext from './lib/ThemeContext';
import ChatHistory from './components/common/ChatHistory';
import OSCEAIBOT from './components/OSCE-AI-BOT';
import QuestionGenerator from './components/question-generation/QuestionGenerator';
import MockTestQuestion from './components/mock-test/Mock';
import PersonalInformation from './pages/PersonalInformation';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import AINewVersion from './components/AI-bot-version';
import SbaPresentation from './components/SBA-presentation/presentation-SBA';
import MockPresentation from './components/Mock-presentation/MockPresentation';
import supabase from './config/helper';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const navigate = useNavigate();

  // useEffect(() => {
  //   const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
  //     if (event === 'SIGNED_IN') {
  //       navigate('/personal-info'); // Redirect after email confirmation
  //     }
  //   });

  //   return () => {
  //     listener?.subscription?.unsubscribe();
  //   };
  // }, [navigate]);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', location.pathname + location.search);
    }
  }, [location]);



  return (
    <div className={`App`}>
      <Routes>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/contact-us' element={<ContactPage />} />
        <Route path='/checkout-success' element={<CheckoutSuccess />} />
        <Route path='/checkout-cancelled' element={<CheckoutCancel />} />

        {/* Protected Routes (Only Logged-in Users) */}
        <Route
          path='/setting'
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />
        <Route
          path='/sba-presentation'
          element={
            <ProtectedRoute>
              <SbaPresentation />
            </ProtectedRoute>
          }
        />
        <Route
          path='/mock-presentation'
          element={
            <ProtectedRoute>
              <MockPresentation />
            </ProtectedRoute>
          }
        />
        <Route
          path='/chat-history'
          element={
            <ProtectedRoute>
              <ChatHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard'
          element={
            // <ProtectedRoute>
              <Dashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path='/questioning'
          element={
            <ProtectedRoute>
              <Questioning />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/question-card'
          element={
            <ProtectedRoute>
              <QuestionCard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/score'
          element={
            <ProtectedRoute>
              <Score />
            </ProtectedRoute>
          }
        />
        <Route
          path='/short-question'
          element={
            <ProtectedRoute>
              <ShortQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path='/osce'
          element={
            <ProtectedRoute>
              <Scenarios />
            </ProtectedRoute>
          }
        />
        <Route
          path='/static-scenerios-detail/:id'
          element={
            <ProtectedRoute>
              <SceneriosDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path='/osce-ai-bot/:categoryName'
          element={
            <ProtectedRoute>
              <AINewVersion />
            </ProtectedRoute>
          }
        />
        <Route
          path='/question-generator'
          element={
            <ProtectedRoute>
              <QuestionGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path='/mock-test'
          element={
            <ProtectedRoute>
              <MockTestQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path='/personal-info'
          element={
            // <ProtectedRoute>
              <PersonalInformation />
            // </ProtectedRoute>
          }
        />
      </Routes>

    </div>
  );
}

export default App;

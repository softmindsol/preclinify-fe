import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import Pricing from "./pages/Pricing";
import VerifyEmail from "./pages/VerifyEmail";
import Setting from "./pages/Setting";
import Dashboard from "./pages/Dashboard";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Questioning from "./components/Questioning";
import QuestionCard from "./components/QuestionCard";
import Score from "./components/common/Score";
import ShortQuestion from "./components/ShortQuestion";
import Scenarios from "./components/Scenerio";
import SceneriosDetail from "./components/SceneriosDetail";
import ContactPage from "./components/contact-us";
import { useContext, useEffect } from "react";
import ThemeContext from "./lib/ThemeContext";
import ChatHistory from "./components/common/ChatHistory";
import OSCEAIBOT from "./components/OSCE-AI-BOT";
import QuestionGenerator from "./components/question-generation/QuestionGenerator";
import MockTestQuestion from "./components/mock-test/Mock";
import PersonalInformation from "./pages/PersonalInformation";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import AINewVersion from "./components/AI-bot-version";
import SbaPresentation from "./components/SBA-presentation/presentation-SBA";
import MockPresentation from "./components/Mock-presentation/MockPresentation";
import supabase from "./config/helper";
import ProtectedRoute from "./auth/ProtectedRoute";
import AIAssistant from "./components/ai-assistant";
import OSCEAI from "./components/OSCE-AI-Audio-Stream";
import AudioStreamingClient from "./components/AudioStream";
import { Privacy } from "./pages/Privacy";
import TermCondition from "./pages/TermCondition";
import Declaimer from "./pages/Declaimer";

function App() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const userId = localStorage.getItem("userId"); // Ya cookies se check karein
  useEffect(() => {
    if (userId && location.pathname === "/") {
      navigate("/dashboard", { replace: true }); // Redirect to dashboard
    }
  }, [navigate, location.pathname]);
  return (
    <div className={`App`}>
      <Routes>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/checkout-cancelled" element={<CheckoutCancel />} />
        {/* <Route path='/personal-info' element={<PersonalInformation />} /> */}
        <Route path="/pricing" element={<Pricing />} />

        <Route
          path="/setting"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sba-presentation"
          element={
            <ProtectedRoute>
              <SbaPresentation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-presentation"
          element={
            <ProtectedRoute>
              <MockPresentation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-history"
          element={
            <ProtectedRoute>
              <ChatHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questioning"
          element={
            <ProtectedRoute>
              <Questioning />
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/question-card"
          element={
            <ProtectedRoute>
              <QuestionCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/score"
          element={
            <ProtectedRoute>
              <Score />
            </ProtectedRoute>
          }
        />
        <Route
          path="/short-question"
          element={
            <ProtectedRoute>
              <ShortQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/osce"
          element={
            <ProtectedRoute>
              <Scenarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/static-scenerios-detail/:id"
          element={
            <ProtectedRoute>
              <SceneriosDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/osce-ai-bot/:id"
          element={
            <ProtectedRoute>
              <AINewVersion />

            </ProtectedRoute>
          }
        />
        <Route
          path="/question-generator"
          element={
            <ProtectedRoute>
              <QuestionGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-test"
          element={
            <ProtectedRoute>
              <MockTestQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/privacy-policy"
          element={

            <Privacy />

          }
        />
        <Route
          path="/term-and-condition"
          element={

            <TermCondition />

          }
        />
        <Route
          path="/disclaimer"
          element={

            <Declaimer />

          }
        />
      </Routes>
    </div>
  );
}

export default App;

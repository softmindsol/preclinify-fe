import { Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/protectedRoute'; 
import Performance from './pages/Performance';
import ContactPage from './components/contact-us';
import { useContext } from 'react';
import ThemeContext from './lib/ThemeContext';
import ChatHistory from './components/common/ChatHistory';
import OSCEAIBOT from './components/OSCE-AI-BOT';
import QuestionGenerator from './components/question-generation/QuestionGenerator';
import MockTestQuestion from './components/mock-test/Mock';

function App() {
  const {theme} = useContext(ThemeContext);
  
  return (
    <div className={`App`}>
      <Routes>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes */}
        <Route path="/performance" element={<><Performance /></>} />

        <Route path="/setting" element={<><Setting/></>} />
        <Route path="/chat-history" element={<><ChatHistory /></>} />
        <Route path="/dashboard" element={<><Dashboard /></>} />
        <Route path="/questioning" element={<><Questioning /></>} />
      
        <Route path="/reset-password" element={<><ResetPassword /></>} />
        <Route path="/question-card" element={<><QuestionCard /></>} />
        <Route path="/score" element={<><Score /></>} />
        <Route path="/short-question" element={<><ShortQuestion /></>} />
        <Route path="/osce" element={<><Scenarios /></>} />
        <Route path="/static-scenerios-detail/:id" element={<><SceneriosDetail /></>} />
        <Route path='/contact-us' element={<ContactPage/>}/>
        <Route path='/osce-ai-bot' element={<OSCEAIBOT />} />
        <Route path='/question-generator' element={<QuestionGenerator />} />
        <Route path='/mock-test' element={<MockTestQuestion />} />
      </Routes>
    </div>
  );
}

export default App;

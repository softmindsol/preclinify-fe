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
import AllModules from './components/AllModules';
import SubModule from './pages/SubModule';
import SubModuleTwo from './pages/SubModuleTwo';
import ProgressTable from './components/Questioning';
import QuestionCard from './components/QuestionCard';
import Score from './components/Score';
import ShortQuestion from './components/ShortQuestion';
import Scenarios from './components/Scenerio';
import SceneriosDetail from './components/SceneriosDetail';
import ProtectedRoute from './components/protectedRoute'; // Import the ProtectedRoute component

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes */}
        <Route path="/setting" element={<ProtectedRoute><Setting/></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><AllModules /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/progress-table" element={<ProtectedRoute><ProgressTable /></ProtectedRoute>} />
        <Route path="/dashboard/:id" element={<ProtectedRoute><SubModule /></ProtectedRoute>} />
        <Route path="/dashboard/detail/:id" element={<ProtectedRoute><SubModuleTwo /></ProtectedRoute>} />
        <Route path="/reset-password" element={<><ResetPassword /></>} />
        <Route path="/question-card" element={<ProtectedRoute><QuestionCard /></ProtectedRoute>} />
        <Route path="/score" element={<ProtectedRoute><Score /></ProtectedRoute>} />
        <Route path="/short-question" element={<ProtectedRoute><ShortQuestion /></ProtectedRoute>} />
        <Route path="/scenarios" element={<ProtectedRoute><Scenarios /></ProtectedRoute>} />
        <Route path="/scenerios-detail" element={<ProtectedRoute><SceneriosDetail /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;

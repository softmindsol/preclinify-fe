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
import Questioning from './components/Questioning';
import QuestionCard from './components/QuestionCard';
import Score from './components/common/Score';
import ShortQuestion from './components/ShortQuestion';
import Scenarios from './components/Scenerio';
import SceneriosDetail from './components/SceneriosDetail';
import ProtectedRoute from './components/protectedRoute'; 

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
        <Route path="/setting" element={<><Setting/></>} />
        <Route path="/home" element={<><AllModules /></>} />
        <Route path="/dashboard" element={<><Dashboard /></>} />
        <Route path="/questioning" element={<><Questioning /></>} />
        <Route path="/dashboard/:id" element={<><SubModule /></>} />
        <Route path="/dashboard/detail/:id" element={<><SubModuleTwo /></>} />
        <Route path="/reset-password" element={<><ResetPassword /></>} />
        <Route path="/question-card" element={<><QuestionCard /></>} />
        <Route path="/score" element={<><Score /></>} />
        <Route path="/short-question" element={<><ShortQuestion /></>} />
        <Route path="/scenarios" element={<><Scenarios /></>} />
        <Route path="/scenerios-detail" element={<><SceneriosDetail /></>} />
      </Routes>
    </div>
  );
}

export default App;

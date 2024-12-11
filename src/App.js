import { Route, Router, Routes } from 'react-router-dom';
import logo from './logo.svg';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'
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
function App() {
  return (
    <div className="App">

      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/setting" element={<Setting />} />
        <Route path='/dashboard' element={<AllModules />} />
        <Route path='/home' element={<Dashboard />} />
        <Route path='/progress-table' element={<ProgressTable />} />

        
        <Route path='/dashboard/:id' element={<SubModule />} />
        <Route path='/dashboard/detail/:id' element={<SubModuleTwo />} />

        <Route path='/forget-password' element={<ForgetPassword />}/>
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/question-card' element={<QuestionCard />} />

        
      </Routes>
    </div>
  );
}

export default App;

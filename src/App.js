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
        <Route path='/dashboard/:id' element={<SubModule />} />

        <Route path='/forget-password' element={<ForgetPassword />}/>
        <Route path='/reset-password' element={<ResetPassword />} />

      </Routes>
    </div>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from "./pages/Signup"
import Home from './pages/Home'
import VerifyEmail from './pages/VerifyEmail'
import {ToastContainer} from "react-toastify"
import UserProfile from './pages/UserProfile'
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" exact element={<Signup />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/" exact element={<Home />} />
          <Route path="/verify-email" exact element={<VerifyEmail />} />
          <Route path="/profile" exact element={<UserProfile />} />
        </Routes>
      </Router>
      <ToastContainer/>
    </>
  )
}

export default App

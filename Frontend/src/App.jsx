// App entry with routing

import React from 'react'
import { BrowserRouter as Router , Routes,Route } from 'react-router-dom'
import WelcomePage from './pages/Landing/LandingPage'
import LoginPage from './pages/Auth/Login'
import SignupPage from './pages/Auth/Signup'
import LearnerDashboard from "./pages/Learner/LearnerDashboard";
import TutorDashboard from "./pages/Tutor/TutorDashboard";

const App = () => {
  return (
    <div> 
    <Router>
      <Routes>
        <Route path="/"element={<WelcomePage/>}/>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/learner-dashboard" element={<LearnerDashboard />} />
        <Route path="/tutor-dashboard" element={<TutorDashboard />} />
      </Routes>
    </Router>
    </div>
  )
}

export default App

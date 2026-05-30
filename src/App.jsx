import { BrowserRouter, Routes, Route } from "react-router-dom"
import Welcome from "./pages/welcome"
import SignUp from "./pages/signup"
import SignIn from "./pages/signIn"
import Dashboard from "./pages/dashboard"
import Opportunities from "./pages/opportunities"
import OpportunityDetail from "./pages/opportunityDetail"
import PostOpportunity from "./pages/postOpportunity"
import Profile from "./pages/profile"
import MyApplications from "./pages/myApplications"
import OrgDashboard from "./pages/orgDashboard"
import ForgotPassword from "./pages/forgotPassword"
import ResetPassword from "./pages/resetPassword"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/post-opportunity" element={<PostOpportunity />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/org-dashboard" element={<OrgDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}
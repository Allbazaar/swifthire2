import { BrowserRouter, Routes, Route } from "react-router-dom"
import Welcome from "./pages/welcome"
import SignUp from "./pages/signup"
import SignIn from "./pages/signIn"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  )
}

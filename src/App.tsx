import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import TaskPage from "./pages/TaskPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Deadlines from "./pages/Deadlines.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

//const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const GOOGLE_CLIENT_ID = "809961904728-vaqbhre2eb4dulfdleur066pgb8e0ui8.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/list/:id" element={<ProtectedRoute><TaskPage /></ProtectedRoute>} />
        <Route path="/deadlines" element={<Deadlines/>} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

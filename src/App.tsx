import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import TaskPage from "./pages/TaskPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/list/:id" element={<ProtectedRoute><TaskPage /></ProtectedRoute>} />
        <Route path="/list/:id" element={<ProtectedRoute><Deadlines /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

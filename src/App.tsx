import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import TaskPage from "./pages/TaskPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Deadlines from "./pages/Deadlines.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/list/:id" element={<ProtectedRoute><TaskPage /></ProtectedRoute>} />
        <Route path="/deadlines" element={<Deadlines/>} />
      </Routes>
    </Router>
  );
}

export default App;

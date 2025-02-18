import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import Navbar from "./components/Navbar";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tasks" element={isAuthenticated ? <TasksPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/tasks" />} />
      </Routes>
    </Router>
  );
};

export default App;

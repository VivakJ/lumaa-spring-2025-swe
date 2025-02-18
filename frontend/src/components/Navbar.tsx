import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//this has the login, tasks, and register buttons
const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav>
      <Link to="/tasks">Tasks</Link>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;

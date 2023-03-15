import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/layout/Landing";
import LoginForm from "./components/auth/LoginForm";
import Test from "./components/Test";
import RegisterForm from "./components/auth/RegisterForm";
import Dashboard from "./views/Dashboard";
import AuthContextProvider from "./contexts/AuthContext";
import Auth from "./views/Auth";
function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth authRoute="login" />} />
          <Route path="/register" element={<Auth authRoute="register" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;

import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/layout/Landing";
import Test from "./components/Test";
import Overview from "./views/Overview";
import AuthContextProvider from "./contexts/AuthContext";
import Auth from "./views/Auth";
import ProtectedRoute from "./components/routing/ProtectedRoute";
function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth authRoute="login" />} />
          <Route path="/register" element={<Auth authRoute="register" />} />
          <Route
            path="/overview"
            element={
              <ProtectedRoute redirectTo="/login">
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;

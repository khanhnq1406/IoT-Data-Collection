import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/layout/Landing";
import Test from "./components/Test";
import Overview from "./views/Overview";
import Node1 from "./views/Node1";
import Node2 from "./views/Node2";
import Node3 from "./views/Node3";
import Node4 from "./views/Node4";
import Node5 from "./views/Node5";
import Node1DataTable from "./views/DataTable";
import AuthContextProvider from "./contexts/AuthContext";
import Auth from "./views/Auth";
import AlarmTable from "./views/AlarmTable";
import Admin from "./views/Admin";
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
          <Route
            path="/node1"
            element={
              <ProtectedRoute redirectTo="/login">
                <Node1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/node2"
            element={
              <ProtectedRoute redirectTo="/login">
                <Node2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/node3"
            element={
              <ProtectedRoute redirectTo="/login">
                <Node3 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/node4"
            element={
              <ProtectedRoute redirectTo="/login">
                <Node4 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/node5"
            element={
              <ProtectedRoute redirectTo="/login">
                <Node5 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alarm-table"
            element={
              <ProtectedRoute redirectTo="/login">
                <AlarmTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data-table"
            element={
              <ProtectedRoute redirectTo="/login">
                <Node1DataTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute redirectTo="/login">
                <Admin />
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

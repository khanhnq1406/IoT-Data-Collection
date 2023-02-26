import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Test from "./components/Test";
function App() {
  return (
      <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/test" element={<Test/>} />
          </Routes>
        </Router>
  )
}

export default App;

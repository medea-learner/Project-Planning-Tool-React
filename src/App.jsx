import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Project from "./pages/Project";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <Router basename="/">
      <Navbar />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/projects/new" element={<ProtectedRoute><Project /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><Project /></ProtectedRoute>} />
      </Routes>
  </Router>
  );
}

export default App;

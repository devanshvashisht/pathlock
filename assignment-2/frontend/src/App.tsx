import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProjectList from "./components/ProjectList";
import ProjectDetails from "./components/ProjectDetails";
import { AuthProvider, useAuth } from "./context/AuthContext";

function PrivateRoute({ children }: any) {
  const { token } = useAuth();
  return token ? children : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/projects" element={<PrivateRoute><ProjectList /></PrivateRoute>} />
          <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

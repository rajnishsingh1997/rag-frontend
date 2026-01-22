import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import userAuthStore from "@/store/auth.store";

type RouteGuardProps = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: RouteGuardProps) => {
  const user = userAuthStore((state) => state.user);
  const token = localStorage.getItem("token");

  if (!user && !token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const PublicRoute = ({ children }: RouteGuardProps) => {
  const user = userAuthStore((state) => state.user);
  const token = localStorage.getItem("token");

  if (user || token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

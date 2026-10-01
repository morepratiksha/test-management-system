import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import TestCreation from "../pages/TestCreation/TestCreation";
import Questions from "../pages/Questions/Questions";
import Preview from "../pages/Preview/Preview";
import DashboardLayout from "../layouts/DashboardLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tests/create" element={<TestCreation />} />
          <Route path="/tests/:id/edit" element={<TestCreation />} />
          <Route path="/tests/:id/questions" element={<Questions />} />
          <Route path="/tests/:id/preview" element={<Preview />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

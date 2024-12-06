import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Homepage from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./pages/ProtectedRoute";
import UserDashboard from "./pages/User/UserDashboard.jsx";
import UserTickets from "./pages/User/UserTickets.jsx";
import TicketView from "./pages/User/TicketView.jsx";
import UserSettings from "./pages/User/UserSettings.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminTickets from "./pages/Admin/AdminTickets.jsx";
import AdminTicketView from "./pages/Admin/AdminTicketView.jsx";
import AssignAgent from "./pages/Admin/AssignAgent.jsx";
import AdminPriorities from "./pages/Admin/AdminPriorities.jsx";
import AdminStatuses from "./pages/Admin/AdminStatuses.jsx";
import UserManagement from "./pages/Admin/UserManagement.jsx";
import AddUser from "./pages/Admin/AddUser.jsx";
import EditUser from "./pages/Admin/EditUser.jsx";
import AdminSettings from "./pages/Admin/AdminSettings.jsx";
import AgentDashboard from "./pages/Agent/AgentDashboard.jsx";
import AgentTickets from "./pages/Agent/AgentTickets.jsx";
import AgentViewTicket from "./pages/Agent/AgentViewTicket.jsx";
import AgentPriorities from "./pages/Agent/AgentPriorities.jsx";
import AgentStatuses from "./pages/Agent/AgentStatuses.jsx";
import AgentSettings from "./pages/Agent/AgentSettings.jsx";
import RaiseTicket from "./pages/User/RaiseTicket.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<Navigate to="/helpdesk" replace />} />
        <Route path="/helpdesk" element={<Homepage />} />
        <Route path="/helpdesk/login" element={<Login />} />

        {/* User Dashboard Routes */}
        <Route
          path="/helpdesk/user_dashboard"
          element={
            <ProtectedRoute requiredRole="User">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/user_tickets"
          element={
            <ProtectedRoute requiredRole="User">
              <UserTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/raise_tickets"
          element={
            <ProtectedRoute requiredRole="User">
              <RaiseTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/tickets/:id"
          element={
            <ProtectedRoute requiredRole="User">
              <TicketView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/user_settings"
          element={
            <ProtectedRoute requiredRole="User">
              <UserSettings />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard Routes */}
        <Route
          path="/helpdesk/admin_dashboard"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/admin_tickets"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/admin/ticket/:id"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminTicketView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/admin/tickets/:id/assign"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AssignAgent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/admin_priorities"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminPriorities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/admin_statuses"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminStatuses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/admin/users"
          element={
            <ProtectedRoute requiredRole="Admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/helpdesk/admin/add_user"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AddUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/helpdesk/admin/users/:id/edit"
          element={
            <ProtectedRoute requiredRole="Admin">
              <EditUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/helpdesk/admin_settings"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* Agent Dashboard Routes */}
        <Route
          path="/helpdesk/agent_dashboard"
          element={
            <ProtectedRoute requiredRole="Agent">
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/helpdesk/agent_tickets"
          element={
            <ProtectedRoute requiredRole="Agent">
              <AgentTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/helpdesk/agent_tickets/:ticketId"
          element={
            <ProtectedRoute requiredRole="Agent">
              <AgentViewTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/agent_priorities"
          element={
            <ProtectedRoute requiredRole="Agent">
              <AgentPriorities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/agent_statuses"
          element={
            <ProtectedRoute requiredRole="Agent">
              <AgentStatuses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpdesk/agent_settings"
          element={
            <ProtectedRoute requiredRole="Agent">
              <AgentSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

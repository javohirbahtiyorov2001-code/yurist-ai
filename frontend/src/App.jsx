import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Chat from './pages/Chat.jsx'
import Contracts from './pages/Contracts.jsx'
import Review from './pages/Review.jsx'
import Workflows from './pages/Workflows.jsx'
import Documents from './pages/Documents.jsx'
import Workspace from './pages/Workspace.jsx'
import Templates from './pages/Templates.jsx'
import Compliance from './pages/Compliance.jsx'
import Lawyers from './pages/Lawyers.jsx'
import LawyerProfile from './pages/LawyerProfile.jsx'
import LawyerRequests from './pages/LawyerRequests.jsx'
import Team from './pages/Team.jsx'
import Layout from './components/Layout.jsx'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text2)' }}>Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={<Protected><Layout /></Protected>}>
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:id" element={<Chat />} />
            <Route path="contracts" element={<Contracts />} />
            <Route path="review" element={<Review />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="documents" element={<Documents />} />
            <Route path="workspace" element={<Workspace />} />
            <Route path="templates" element={<Templates />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="lawyers" element={<Lawyers />} />
            <Route path="lawyer/profile" element={<LawyerProfile />} />
            <Route path="lawyer/requests" element={<LawyerRequests />} />
            <Route path="team" element={<Team />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

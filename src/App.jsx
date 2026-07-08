import { useEffect, useState } from "react"
import "./App.css"

import AppRouter from "./routes/AppRouter"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

import {
  getCurrentUser,
  logout
} from "./services/authService"

function App() {
  const [user, setUser] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        if (currentUser) {
          setUser(currentUser)
        }
      })
      .finally(() => {
        setLoadingSession(false)
      })
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  if (loadingSession) {
    return (
      <div className="loading-screen">
        <h1>Cargando EduGestion...</h1>
      </div>
    )
  }

  if (user) {
    if (user.role === "ADMIN") {
      return (
        <AppRouter
          user={user}
          onLogout={handleLogout}
        />
      )
    }

    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <div className="auth-container">
      <Login onLogin={handleLogin} />
    </div>
  )
}

export default App
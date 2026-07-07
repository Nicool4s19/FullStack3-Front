import { useEffect, useState } from "react";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { getCurrentUser, logout } from "./services/authService";

function App() {

  const [page, setPage] = useState("login")
  const [user, setUser] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        if (currentUser) {
          setUser(currentUser)
        }
      })
      .finally(() => setLoadingSession(false))
  }, [])


  const handleLogin = (userData) => {
    setUser(userData)
  }


  const handleLogout = () => {
    logout()
    setUser(null)
    setPage("login")
  }


  if (loadingSession) {
    return <h1>Cargando...</h1>
  }


  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    )
  }


  return (
    <div className="auth-container">
      {
        page === "login" ? (
          <Login
            onLogin={handleLogin}
            goToRegister={() => setPage("register")}
          />
        ) : (
          <Register
            onRegister={handleLogin}
            goToLogin={() => setPage("login")}
          />
        )
      }
    </div>
  )
}

export default App;
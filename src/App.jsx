import { useState } from "react"
import "./App.css"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"

function App() {
  const [page, setPage] = useState("login")
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleRegister = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setPage("login")
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
      {page === "login" ? (
        <Login
          onLogin={handleLogin}
          goToRegister={() => setPage("register")}
        />
      ) : (
        <Register
          onRegister={handleRegister}
          goToLogin={() => setPage("login")}
        />
      )}
    </div>
  )
}

export default App
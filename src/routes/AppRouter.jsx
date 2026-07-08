import {
 BrowserRouter,
 Routes,
 Route
} from "react-router-dom"


import Dashboard from "../pages/Dashboard"
import AdminDashboard from "../pages/AdminDashboard"
import GestionUsuarios from "../pages/GestionUsuarios"



function AppRouter({user,onLogout}){


return (

<BrowserRouter>

<Routes>


<Route
path="/"
element={

user.role === "ADMIN"

?

<AdminDashboard
user={user}
onLogout={onLogout}
/>

:

<Dashboard
user={user}
onLogout={onLogout}
/>

}

/>



<Route
path="/admin"
element={
<AdminDashboard
user={user}
onLogout={onLogout}
/>
}
/>



<Route
path="/admin/usuarios"
element={
<GestionUsuarios/>
}
/>



</Routes>


</BrowserRouter>

)

}


export default AppRouter
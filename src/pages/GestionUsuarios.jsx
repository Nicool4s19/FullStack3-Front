import {useEffect,useState} from "react"
import {
 listarUsuarios,
 eliminarUsuario
} from "../services/usuarioService"


function GestionUsuarios(){


const [usuarios,setUsuarios]=useState([])



useEffect(()=>{

 cargar()

},[])



function cargar(){

 listarUsuarios()
 .then(res=>{

    setUsuarios(res.data)

 })

}



function borrar(id){

 if(confirm("¿Eliminar usuario?")){

    eliminarUsuario(id)
    .then(()=>{

        cargar()

    })

 }

}



return (

<div>


<h1>
Gestión de Usuarios
</h1>



<table>


<thead>

<tr>

<th>
Nombre
</th>

<th>
Email
</th>

<th>
Rol
</th>

<th>
Acción
</th>

</tr>

</thead>



<tbody>


{
usuarios.map(usuario=>(


<tr key={usuario.idUsuario}>


<td>
{usuario.nombre}
</td>


<td>
{usuario.email}
</td>


<td>
{usuario.rol?.nombreRol}
</td>


<td>


<button
onClick={()=>borrar(usuario.idUsuario)}
>
Eliminar
</button>


</td>


</tr>


))

}


</tbody>


</table>


</div>

)


}


export default GestionUsuarios
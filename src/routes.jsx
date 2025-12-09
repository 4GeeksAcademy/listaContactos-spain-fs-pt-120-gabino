import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Contacts } from "./pages/Contacts"; // Vista principal de contactos
import { AddContact } from "./pages/AddContact"; // Vista del formulario

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1 className="text-center mt-5">404: Ruta no encontrada.</h1>} >

        {/* Ruta de la Lista de Contactos (Home) */}
        <Route index element={<Contacts />} /> 
        
        {/* Ruta para Añadir Contacto */}
        <Route path="/add" element={ <AddContact />} />  

        {/* Ruta para Editar Contacto (con parámetro dinámico) */}
        <Route path="/edit/:contactId" element={ <AddContact />} /> 
        
      </Route>
    )
);
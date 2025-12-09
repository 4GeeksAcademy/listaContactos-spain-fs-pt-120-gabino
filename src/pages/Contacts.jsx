import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ContactCard } from "../components/ContactCard";

export const Contacts = () => {
  const { store, actions } = useGlobalReducer();

  useEffect(() => {
    // Cargar los contactos en el momento que se cargue el componente
    actions.loadContacts();
  }, []); 

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Lista de Contactos ({store.agendaSlug})</h1>
        <Link to="/add">
          <button className="btn btn-success">
            <i className="fa fa-plus me-2"></i>Añadir Nuevo Contacto
          </button>
        </Link>
      </div>

      {/* Para mostrar mensaje del estado del proceso */}
      {store.loading && (
        <div className="alert alert-info text-center">Cargando contactos...</div>
      )}
      
      {store.error && (
        <div className="alert alert-danger text-center">
          Error al cargar contactos: {store.error}.
        </div>
      )}

      {!store.loading && store.contacts.length === 0 && !store.error && (
        <div className="alert alert-warning text-center">
          No hay contactos en la agenda '{store.agendaSlug}'. ¡Crea uno!
        </div>
      )}

      {/* Listado de los contactos */}
      {store.contacts.length > 0 && (
        <ul className="list-group list-group-flush shadow">
          {store.contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </ul>
      )}
    </div>
  );
};
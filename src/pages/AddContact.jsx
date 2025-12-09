import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AddContact = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();
  const { store, actions } = useGlobalReducer();

  const isEditing = !!contactId;
  const contactToEdit = isEditing
    ? store.contacts.find((c) => c.id === parseInt(contactId))
    : null;

  const [contact, setContact] = useState({
    name: contactToEdit?.name || "",
    email: contactToEdit?.email || "",
    phone: contactToEdit?.phone || "",
    address: contactToEdit?.address || "",
    agenda_slug: store.agendaSlug,
    // ID es necesario para PUT
    id: contactToEdit?.id || "", 
  });

  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirigir si estamos editando y el contacto no se encuentra
  useEffect(() => {
    if (contactToEdit) {
      setContact({
        name: contactToEdit.name || "",
        email: contactToEdit.email || "",
        phone: contactToEdit.phone || "",
        address: contactToEdit.address || "",
        agenda_slug: store.agendaSlug || "",
        id: contactToEdit.id,
      });
    }
  }, [contactToEdit]);


  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!contact.name || !contact.email || !contact.phone || !contact.address) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        // En modo edición, el ID ya está en el objeto contact
        await actions.updateContact(contact.id, contact); 
        alert("Contacto actualizado exitosamente!");
      } else {
        await actions.addContact(contact);
        alert("Contacto creado exitosamente!");
      }
      navigate("/"); // Navegar de vuelta a la lista
    } catch (error) {
      setFormError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el contacto.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar mensaje de carga si estamos en modo edición esperando el contacto
  if (isEditing && !contactToEdit && store.loading) {
    return <div className="container mt-5 text-center">Cargando contacto para edición...</div>;
  }
  
  return (
    <div className="container mt-5">
      <h1 className="text-center">{isEditing ? "Editar Contacto" : "Añadir Nuevo Contacto"}</h1>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        
        {formError && <div className="alert alert-danger">{formError}</div>}
        
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre Completo</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={contact.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={contact.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={contact.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : (
              <i className="fa-solid fa-save me-2"></i>
            )}
            {isEditing ? (isSubmitting ? "Actualizando..." : "Actualizar") : (isSubmitting ? "Guardando..." : "Guardar")}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>
            <i className="fa-solid fa-arrow-left me-2"></i>Volver a Contactos
          </button>
        </div>
      </form>
    </div>
  );
};
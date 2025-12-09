const AGENDA_SLUG = "de Gabino";

export const initialStore = () => {
  return {
    agendaSlug: AGENDA_SLUG,
    contacts: [],
    loading: false,
    error: null,
  };
};

// Reducer maneja las actualizaciones de estado síncronas
export function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_contacts":
      return { ...store, contacts: action.payload, loading: false, error: null };
    case "set_loading":
      return { ...store, loading: action.payload };
    case "set_error":
      return { ...store, error: action.payload, loading: false };
    case "add_contact":
      return { ...store, contacts: [...store.contacts, action.payload] };
    case "update_contact":
      return {
        ...store,
        contacts: store.contacts.map((contact) =>
          contact.id === action.payload.id ? action.payload : contact
        ),
      };
    case "delete_contact":
      return {
        ...store,
        contacts: store.contacts.filter(
          (contact) => contact.id !== action.payload.id
        ),
      };
    default:
      throw Error("Unknown action: " + action.type);
  }
}

// getActions (acota, empaqueta) a la API y entrega los resultados al reducer
export const getActions = (dispatch, store) => ({
  // READ: Obtengo todos los contactos incluyendo la creación de la listado de contactos si ésta no existiera
  loadContacts: async () => {
    dispatch({ type: "set_loading", payload: true });
    try {
      const url = `https://playground.4geeks.com/contact/agendas/${store.agendaSlug}/contacts`;
      let response = await fetch(url);

      // Si la agenda no existe (404), y se crea.
      if (response.status === 404) {
        const createAgendaUrl = `https://playground.4geeks.com/contact/agendas/${store.agendaSlug}`;
        const createAgendaResponse = await fetch(createAgendaUrl, { method: "POST" });
        if (!createAgendaResponse.ok) {
          throw new Error("Fallo al crear la agenda.");
        }
        dispatch({ type: "set_contacts", payload: [] });
        return;
      }

      if (!response.ok) {
        throw new Error(`Fallo al obtener contactos: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch({ type: "set_contacts", payload: data.contacts || [] });

    } catch (error) {
      console.error("Error al cargar contactos:", error);
      dispatch({ type: "set_error", payload: error.message });
    }
  },

  // CREATE: Para ir añadiendo nuevos contactos a la lista
  addContact: async (contact) => {
    dispatch({ type: "set_loading", payload: true });
    try {
      const url = `https://playground.4geeks.com/contact/agendas/${store.agendaSlug}/contacts`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof error.Data.detail ==='string'
          ? errorData.detail
          : JSON.stringify(errorData.detail || errorData);
          
        throw new Error(errorMessage);
      }

      const newContact = await response.json();
      // Dispatch la acción síncrona para actualizar el estado con el nuevo contacto
      dispatch({ type: "add_contact", payload: newContact });
    } catch (error) {
      console.error("Error al añadir contacto:", error);
      dispatch({ type: "set_error", payload: error.message });
      throw error;
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  },

  // UPDATE: Aquí actualizo os contactos que ya se encuentran en la lista
  updateContact: async (contactId, contact) => {
    dispatch({ type: "set_loading", payload: true });
    try {
      const url = `https://playground.4geeks.com/contact/agendas/${store.agendaSlug}/contacts/${contactId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Fallo al actualizar contacto: ${response.statusText}`);
      }

      const updatedContact = await response.json();
      dispatch({ type: "update_contact", payload: updatedContact });
    } catch (error) {
      console.error("Error al actualizar contacto:", error);
      dispatch({ type: "set_error", payload: error.message });
      throw error;
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  },

  // DELETE: Aquí borro un contacto 
  deleteContact: async (contactId) => {
    dispatch({ type: "set_loading", payload: true });
    try {
      const url = `https://playground.4geeks.com/contact/agendas/${store.agendaSlug}/contacts/${contactId}`;
      const response = await fetch(url, { method: "DELETE" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Fallo al eliminar contacto: ${response.statusText}`);
      }
      
      // Actuaizo el estado de la lista
      dispatch({ type: "delete_contact", payload: { id: contactId } });
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      dispatch({ type: "set_error", payload: error.message });
      throw error;
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  },
});

export default storeReducer;
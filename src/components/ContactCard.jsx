import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Modal } from "./Modal";

export const ContactCard = ({ contact }) => {
  const { actions } = useGlobalReducer();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await actions.deleteContact(contact.id);
      setShowModal(false);
    } catch (error) {
      alert("Error al eliminar el contacto: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <li className="list-group-item">
      <div className="d-flex w-100 justify-content-between align-items-center p-3">
        {/* Información de contacto */}
        <div className="me-4">
          <img
            src={`https://ui-avatars.com/api/?name=${contact.name}&background=random`}
            alt={contact.name}
            className="rounded-circle"
            style={{ with: "80px", height: "80px", objectFit: "cover"}}
          />
        </div>
        <div className="text-start flex-grow-1">
          <h5 className="mb-1 text-primary">{contact.name}</h5>
          <p className="mb-1 text-muted">
            <i className="fa fa-envelope me-2"></i>
            {contact.email}
          </p>
          <p className="mb-1 text-muted">
            <i className="fa fa-phone me-2"></i>
            {contact.phone}
          </p>
          <p className="mb-0 text-muted">
            <i className="fa fa-location-dot me-2"></i>
            {contact.address}
          </p>
        </div>

        <div className="d-flex flex-column">
          {/* Edito el contacto */}
          <Link
            to={`/edit/${contact.id}`}
            className="btn btn-warning btn-sm mb-2"
          >
            <i className="fa fa-pen me-1"></i>
            Editar
          </Link>
          {/* Botón eliminar */}
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-danger btn-sm"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            ) : (
              <i className="fa fa-trash me-1"></i>
            )}
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      {/* Confirmo la eliminación */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro que deseas eliminar el contacto ${contact.name}?`}
      />
    </li>
  );
};

ContactCard.propTypes = {
  contact: PropTypes.object.isRequired,
};
import React from "react";
import PropTypes from "prop-types";

export const Modal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div
      className="modal"
      tabIndex="-1"
      role="dialog"
      style={{ display: show ? "block" : "none", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
};
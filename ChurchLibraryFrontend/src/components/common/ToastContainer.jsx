import React, { useState, useCallback } from "react";
import Toast from "./Toast";

const ToastContainer = ({ position = "top-right", maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    (toast) => {
      const id = Date.now().toString();
      const newToast = { ...toast, id };

      setToasts((prevToasts) => {
        const updatedToasts = [newToast, ...prevToasts].slice(0, maxToasts);
        return updatedToasts;
      });

      return id;
    },
    [maxToasts]
  );

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Expose methods globally for easy access
  React.useEffect(() => {
    window.showToast = addToast;
    window.clearAllToasts = clearAllToasts;

    return () => {
      delete window.showToast;
      delete window.clearAllToasts;
    };
  }, [addToast, clearAllToasts]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          position={position}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

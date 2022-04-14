import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ children, onClose }) {
    
    

    const handleKeyDown = useCallback(
        e => {
            if (e.code === 'Escape') {
                onClose();
            }
        },
        [onClose],
    ); 
    
    const handleOverlayClick = e => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
    
    return createPortal(
        <div className="Overlay" onClick={handleOverlayClick}>
            <div className="Modal">{children}</div>
        </div>,
        modalRoot,
    );
}
import { createPortal } from 'react-dom';

const Modal = ({ children, onClose }) => {
  return createPortal(
    <div className='Modal'>
      {children}
      <button className='Button' onClick={onClose}>
        Close
      </button>
    </div>,
    document.body
  );
};

export default Modal;

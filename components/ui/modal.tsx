import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
  <div className="bg-white p-5 rounded-lg w-[500px] relative">
    <button className="absolute top-2 right-4 text-xl cursor-pointer" onClick={onClose}>
      &times;
    </button>
    {children}
  </div>
</div>
  );
};

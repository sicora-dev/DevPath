const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0 bg-light-secondary/40 dark:bg-dark-secondary/40 flex items-center justify-center z-20">
      <div className="p-6 rounded-md shadow-lg bg-light-secondary dark:bg-dark-secondary">
        {children}
      </div>
    </div>
  );
};

export default Modal;
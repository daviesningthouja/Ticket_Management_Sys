const SuccessPopup = ({ message, onClose }) => (
  <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50">
    <div className="flex items-center justify-between gap-4">
      <span>{message}</span>
      <button onClick={onClose} className="text-white font-bold text-xl leading-none">&times;</button>
    </div>
  </div>
);

export default SuccessPopup;

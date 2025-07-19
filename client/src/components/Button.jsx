const Button = ({ children, onClick, type = "button", style = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      //className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
      className={`${style}`}
    >
      {children}
    </button>
  );
};

export default Button;

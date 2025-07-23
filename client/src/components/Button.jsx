const Button = ({ children, onClick, type = "button", style = {} }) => {
  console.log(style)
  return (
    <button
      type={type}
      onClick={onClick}
      //className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
      className={`${style}` ? style : 'px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700'}
    >
      {children}
    </button>
  );
};

export default Button;

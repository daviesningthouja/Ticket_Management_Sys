import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuth } from '../utils/authUtils'
import "../styles/login.css"
import { loginUser } from '../services/authService'
const Login = () => {
  const [form, setForm] = useState({email: "", password: ""});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  const handleLogin = async (e) =>{
    e.preventDefault();
    try{
      const res = await loginUser(form);
      setAuth(res.token,res);
      const role = res.role.toLowerCase();
      navigate(`/${role}`);
    } catch (err){
      setError("Invalid credentials");
      console.log(err,error);
    }
  }
  return (
    <div className='login-container'>
      {error && <p className='error'>{error}</p>}
       <form onSubmit={handleLogin} className="login-form">
      <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default Login

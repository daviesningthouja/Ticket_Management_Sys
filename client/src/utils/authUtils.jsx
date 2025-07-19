import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
export const getUser = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    //console.log(user)
    return token && user ? JSON.parse(user) : null ;
}
export const getToken = () => {
    const token = localStorage.getItem("token");
    if(!token){
        localStorage.removeItem("user");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        return null;
    }
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.exp);
    const currentTime = Date.now() / 1000; // Convert to seconds
    console.log(currentTime);
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token"); // Clear expired token
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
      return <Navigate to="/" replace />;
    }
     return token;
}


export const setAuth = (token, user, id, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('id',id);
    localStorage.setItem('role',role)
    //console.log(token,user,id)
}

export const getUserId = () => {
    const uID = localStorage.getItem("id")
    //console.log(uID)
    return uID;
}

export const getUserRole = () => {
    
    const role = localStorage.getItem('role');
    return role;

}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
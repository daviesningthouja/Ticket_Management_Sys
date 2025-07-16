export const getUser = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return token && user ? JSON.parse(user) : null ;
}

export const setAuth = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
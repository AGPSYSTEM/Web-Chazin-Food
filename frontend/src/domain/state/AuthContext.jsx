import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(void 0);
let MOCK_USERS = [
  {
    id: 1,
    nombre: "Administrador Sistema",
    correo: "admin@chazinfood.com",
    contrase\u00F1a: "admin123",
    rol: "administrador"
  },
  {
    id: 2,
    nombre: "Carlos Mart\xEDnez",
    correo: "cocinero@chazinfood.com",
    contrase\u00F1a: "cocina123",
    rol: "cocinero"
  },
  {
    id: 3,
    nombre: "Mar\xEDa Garc\xEDa",
    correo: "cliente@chazinfood.com",
    contrase\u00F1a: "cliente123",
    rol: "cliente"
  }
];
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Se deshabilita para que el proyecto siempre inicie en la pantalla de iniciar sesión.
  // useEffect(() => {
  //   const savedUser = localStorage.getItem("chazin_user");
  //   if (savedUser) {
  //     setUser(JSON.parse(savedUser));
  //   }
  // }, []);
  const login = (correo, contrase\u00F1a) => {
    const foundUser = MOCK_USERS.find(
      (u) => u.correo === correo && u.contrase\u00F1a === contrase\u00F1a
    );
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        nombre: foundUser.nombre,
        correo: foundUser.correo,
        rol: foundUser.rol
      };
      setUser(userData);
      localStorage.setItem("chazin_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };
  const register = (nombre, correo, contrase\u00F1a) => {
    const exists = MOCK_USERS.find((u) => u.correo.toLowerCase() === correo.toLowerCase());
    if (exists) {
      return { success: false, message: "Ya existe una cuenta con ese correo electr\xF3nico" };
    }
    const newUser = {
      id: MOCK_USERS.length + 1,
      nombre,
      correo,
      contrase\u00F1a,
      rol: "cliente"
    };
    MOCK_USERS = [...MOCK_USERS, newUser];
    const userData = { id: newUser.id, nombre, correo, rol: "cliente" };
    setUser(userData);
    localStorage.setItem("chazin_user", JSON.stringify(userData));
    return { success: true, message: "\xA1Cuenta creada exitosamente!" };
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("chazin_user");
  };
  return <AuthContext.Provider value={{
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

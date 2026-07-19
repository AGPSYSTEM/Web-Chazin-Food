import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(void 0);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Se deshabilita para que el proyecto siempre inicie en la pantalla de iniciar sesión.
  // useEffect(() => {
  //   const savedUser = localStorage.getItem("chazin_user");
  //   if (savedUser) {
  //     setUser(JSON.parse(savedUser));
  //   }
  // }, []);

  const login = async (correo, contraseña) => {
    try {
      const response = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo, contrasena: contraseña })
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("chazin_user", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error en login:", err);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        localStorage.setItem("chazin_user", JSON.stringify(data));
        return { success: true, message: "¡Cuenta creada exitosamente!" };
      }
      return { success: false, message: data.message || "Error al crear la cuenta" };
    } catch (err) {
      console.error("Error en register:", err);
      return { success: false, message: "Fallo de conexión al registrar cuenta" };
    }
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

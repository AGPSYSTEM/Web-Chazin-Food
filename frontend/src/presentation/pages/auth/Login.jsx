import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/domain/state/AuthContext";
import { Lock, Mail, Eye, EyeOff, ChefHat, Sparkles, User, UserPlus, LogIn, Phone } from "lucide-react";
import { useToast } from "@/domain/state/ToastContext";
import logoImg from "@/presentation/assets/ChatGPT_Image_1_jun_2026__21_55_04.png";
export function Login() {
  const [tab, setTab] = useState("login");
  const [loginCorreo, setLoginCorreo] = useState("");
  const [loginContrase\u00F1a, setLoginContrase\u00F1a] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [regNombre, setRegNombre] = useState("");
  const [regCorreo, setRegCorreo] = useState("");
  const [regTelefono, setRegTelefono] = useState("");
  const [regContrase\u00F1a, setRegContrase\u00F1a] = useState("");
  const [regConfirmar, setRegConfirmar] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [isRegLoading, setIsRegLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    if (wasDark) document.documentElement.classList.remove("dark");
    return () => {
      if (localStorage.getItem("darkMode") === "true") {
        document.documentElement.classList.add("dark");
      }
    };
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginCorreo || !loginContrase\u00F1a) {
      toast.error("Campos requeridos", "Por favor ingresa tu correo y contrase\xF1a");
      return;
    }
    setIsLoginLoading(true);
    setTimeout(() => {
      const success = login(loginCorreo, loginContrase\u00F1a);
      if (success) {
        toast.success("\xA1Bienvenido!", "Inicio de sesi\xF3n exitoso");
        setTimeout(() => navigate("/"), 500);
      } else {
        toast.error("Error de autenticaci\xF3n", "Correo o contrase\xF1a incorrectos");
      }
      setIsLoginLoading(false);
    }, 800);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regNombre || !regCorreo || !regContrase\u00F1a || !regConfirmar) {
      toast.error("Campos requeridos", "Por favor completa todos los campos obligatorios");
      return;
    }
    if (regContrase\u00F1a.length < 6) {
      toast.error("Contrase\xF1a d\xE9bil", "La contrase\xF1a debe tener al menos 6 caracteres");
      return;
    }
    if (regContrase\u00F1a !== regConfirmar) {
      toast.error("Contrase\xF1as no coinciden", "Verifica que ambas contrase\xF1as sean iguales");
      return;
    }
    setIsRegLoading(true);
    setTimeout(() => {
      const result = register(regNombre, regCorreo, regContrase\u00F1a);
      if (result.success) {
        toast.success("\xA1Cuenta creada!", result.message);
        setTimeout(() => navigate("/"), 500);
      } else {
        toast.error("Error al registrar", result.message);
      }
      setIsRegLoading(false);
    }, 800);
  };
  const inputBase = "relative w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all bg-white/50 backdrop-blur-sm outline-none";
  const inputWithRight = "relative w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all bg-white/50 backdrop-blur-sm outline-none";
  return <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
      {
    /* Fondo decorativo */
  }
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-red-400/30 to-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[#30475E]/30 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-red-300/20 to-rose-400/10 rounded-full blur-2xl" />
        <div className="absolute top-10 right-10 w-64 h-64 opacity-5">
          <div className="grid grid-cols-8 gap-4">
            {[...Array(64)].map((_, i) => <div key={i} className="w-2 h-2 bg-gray-800 rounded-full" />)}
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full opacity-5" viewBox="0 0 1440 320">
          <path fill="#F05454" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>

      <div className="relative w-full max-w-md z-10">
        {
    /* Logo */
  }
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-500 rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-white rounded-full p-6 shadow-2xl border-4 border-red-500/20">
              <img src={logoImg} alt="Chazin Food" className="w-24 h-24 object-contain" />
            </div>
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-rose-600 p-2 rounded-full shadow-lg animate-bounce">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 bg-clip-text text-transparent">
            Chazin Food
          </h1>
          <p className="text-gray-600 font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            Sistema de Gestión
            <Sparkles className="w-4 h-4 text-red-500" />
          </p>
        </div>

        {
    /* Card principal */
  }
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />

          {
    /* Tabs */
  }
          <div className="flex border-b border-gray-200/70">
            <button
    onClick={() => setTab("login")}
    className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold text-sm transition-all duration-300 ${tab === "login" ? "text-red-600 border-b-2 border-red-500 bg-red-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
  >
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </button>
            <button
    onClick={() => setTab("register")}
    className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold text-sm transition-all duration-300 ${tab === "register" ? "text-red-600 border-b-2 border-red-500 bg-red-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
  >
              <UserPlus className="w-4 h-4" />
              Registrarse
            </button>
          </div>

          <div className="p-8">
            {
    /* ── LOGIN ── */
  }
            {tab === "login" && <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl opacity-0 group-focus-within:opacity-10 blur transition-opacity" />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 w-5 h-5 transition-colors z-10" />
                    <input
    type="email"
    value={loginCorreo}
    onChange={(e) => setLoginCorreo(e.target.value)}
    className={inputBase}
    placeholder="usuario@chazinfood.com"
  />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl opacity-0 group-focus-within:opacity-10 blur transition-opacity" />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 w-5 h-5 transition-colors z-10" />
                    <input
    type={showLoginPassword ? "text" : "password"}
    value={loginContrase\u00F1a}
    onChange={(e) => setLoginContrase\u00F1a(e.target.value)}
    className={inputWithRight}
    placeholder="••••••••"
  />
                    <button
    type="button"
    onClick={() => setShowLoginPassword(!showLoginPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors z-10"
  >
                      {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
    type="submit"
    disabled={isLoginLoading}
    className="relative w-full bg-gradient-to-r from-red-500 via-rose-500 to-red-500 text-white font-bold py-4 px-4 rounded-xl transition-all duration-500 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
  >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoginLoading ? <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Ingresando...
                      </> : <>
                        <LogIn className="w-5 h-5" />
                        Iniciar Sesión
                      </>}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </button>

                <div className="text-center">
                  <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-700 font-semibold hover:underline transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </form>}

            {
    /* ── REGISTRO ── */
  }
            {tab === "register" && <form onSubmit={handleRegister} className="space-y-4">
                <p className="text-xs text-gray-500 text-center -mt-1 mb-2">
                  Los campos marcados con <span className="text-red-500">*</span> son obligatorios. La cuenta se crea con rol <span className="font-semibold text-[#30475E]">Cliente</span>.
                </p>

                {
    /* Nombre */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl opacity-0 group-focus-within:opacity-10 blur transition-opacity" />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 w-5 h-5 transition-colors z-10" />
                    <input
    type="text"
    value={regNombre}
    onChange={(e) => setRegNombre(e.target.value)}
    className={inputBase}
    placeholder="Tu nombre completo"
  />
                  </div>
                </div>

                {
    /* Correo */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl opacity-0 group-focus-within:opacity-10 blur transition-opacity" />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 w-5 h-5 transition-colors z-10" />
                    <input
    type="email"
    value={regCorreo}
    onChange={(e) => setRegCorreo(e.target.value)}
    className={inputBase}
    placeholder="tu@correo.com"
  />
                  </div>
                </div>

                {
    /* Teléfono (opcional) */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono <span className="text-gray-400 font-normal text-xs">(opcional)</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl opacity-0 group-focus-within:opacity-10 blur transition-opacity" />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 w-5 h-5 transition-colors z-10" />
                    <input
    type="tel"
    value={regTelefono}
    onChange={(e) => setRegTelefono(e.target.value)}
    className={inputBase}
    placeholder="+58 412 000 0000"
  />
                  </div>
                </div>

                {
    /* Contraseña */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl opacity-0 group-focus-within:opacity-10 blur transition-opacity" />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 w-5 h-5 transition-colors z-10" />
                    <input
    type={showRegPassword ? "text" : "password"}
    value={regContrase\u00F1a}
    onChange={(e) => setRegContrase\u00F1a(e.target.value)}
    className={inputWithRight}
    placeholder="Mínimo 6 caracteres"
  />
                    <button
    type="button"
    onClick={() => setShowRegPassword(!showRegPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors z-10"
  >
                      {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {
    /* Indicador de fortaleza */
  }
                  {regContrase\u00F1a.length > 0 && <div className="mt-2 flex gap-1">
                      {[...Array(4)].map((_, i) => {
    const strength = regContrase\u00F1a.length >= 10 ? 4 : regContrase\u00F1a.length >= 8 ? 3 : regContrase\u00F1a.length >= 6 ? 2 : 1;
    return <div
      key={i}
      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? strength === 1 ? "bg-red-400" : strength === 2 ? "bg-yellow-400" : strength === 3 ? "bg-blue-400" : "bg-green-400" : "bg-gray-200"}`}
    />;
  })}
                      <span className="text-xs text-gray-500 ml-1">
                        {regContrase\u00F1a.length < 6 ? "D\xE9bil" : regContrase\u00F1a.length < 8 ? "Regular" : regContrase\u00F1a.length < 10 ? "Buena" : "Fuerte"}
                      </span>
                    </div>}
                </div>

                {
    /* Confirmar contraseña */
  }
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl opacity-0 group-focus-within:opacity-10 blur transition-opacity" />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 w-5 h-5 transition-colors z-10" />
                    <input
    type={showRegConfirm ? "text" : "password"}
    value={regConfirmar}
    onChange={(e) => setRegConfirmar(e.target.value)}
    className={`${inputWithRight} ${regConfirmar.length > 0 ? regContrase\u00F1a === regConfirmar ? "border-green-400 focus:border-green-500 focus:ring-green-500/50" : "border-red-300 focus:border-red-500" : ""}`}
    placeholder="Repite tu contraseña"
  />
                    <button
    type="button"
    onClick={() => setShowRegConfirm(!showRegConfirm)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors z-10"
  >
                      {showRegConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {regConfirmar.length > 0 && regContrase\u00F1a !== regConfirmar && <p className="text-xs text-red-500 mt-1 ml-1">Las contraseñas no coinciden</p>}
                </div>

                <button
    type="submit"
    disabled={isRegLoading}
    className="relative w-full bg-gradient-to-r from-red-500 via-rose-500 to-red-500 text-white font-bold py-4 px-4 rounded-xl transition-all duration-500 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
  >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isRegLoading ? <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creando cuenta...
                      </> : <>
                        <UserPlus className="w-5 h-5" />
                        Crear Cuenta
                      </>}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </button>

              </form>}
          </div>
        </div>

      </div>

      <style>{`
        .bg-size-200 { background-size: 200% 100%; }
        .bg-pos-0 { background-position: 0% 50%; }
        .bg-pos-100 { background-position: 100% 50%; }
      `}</style>
    </div>;
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, ChefHat, Clock, CheckCircle, AlertCircle, Package, User, Sun, Moon, BookOpen, X, ChevronDown, FileText, Search } from "lucide-react";
import { useAuth } from "@/domain/state/AuthContext";
import { useDarkMode } from "@/domain/hooks/useDarkMode";
import { useNotifications } from "@/domain/hooks/useNotifications";
import logoImg from "@/presentation/assets/ChatGPT_Image_1_jun_2026__21_55_04.png";
export function CocineroDashboard() {
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const { success, confirmAction, confirmLogout } = useNotifications();
  const [pedidos, setPedidos] = useState([
    {
      id: 101,
      cliente: "Mar\xEDa Garc\xEDa",
      productos: [
        {
          nombre: "Hamburguesa Especial",
          cantidad: 2,
          observaciones: "Sin cebolla",
          receta: {
            ingredientes: [
              { nombre: "Pan de hamburguesa", cantidad: "2 unidades" },
              { nombre: "Carne de res molida", cantidad: "200g" },
              { nombre: "Queso cheddar", cantidad: "2 lonchas" },
              { nombre: "Lechuga", cantidad: "30g" },
              { nombre: "Tomate", cantidad: "2 rodajas" },
              { nombre: "Salsa especial", cantidad: "30ml" },
              { nombre: "Pepinillos", cantidad: "4 rodajas" }
            ],
            pasos: [
              "Calentar la plancha a fuego medio-alto",
              "Formar las hamburguesas de 100g cada una",
              "Cocinar las hamburguesas 4 minutos por lado",
              "Agregar el queso en los \xFAltimos 2 minutos",
              "Tostar el pan ligeramente",
              "Montar: pan, salsa, lechuga, tomate, carne con queso, pepinillos, pan"
            ],
            tiempoPreparacion: "12 min"
          }
        },
        {
          nombre: "Papas Fritas",
          cantidad: 1,
          receta: {
            ingredientes: [
              { nombre: "Papas", cantidad: "200g" },
              { nombre: "Aceite vegetal", cantidad: "Para fre\xEDr" },
              { nombre: "Sal", cantidad: "Al gusto" }
            ],
            pasos: [
              "Pelar y cortar las papas en tiras",
              "Remojar en agua fr\xEDa por 10 minutos",
              "Secar bien las papas",
              "Fre\xEDr a 180\xB0C hasta dorar",
              "Escurrir y salar inmediatamente"
            ],
            tiempoPreparacion: "8 min"
          }
        },
        { nombre: "Coca Cola", cantidad: 2 }
      ],
      horaRecepcion: "14:30",
      estado: "Recibido",
      prioridad: "urgente"
    },
    {
      id: 102,
      cliente: "Carlos L\xF3pez",
      productos: [
        {
          nombre: "Pollo Broaster",
          cantidad: 1,
          receta: {
            ingredientes: [
              { nombre: "Presas de pollo", cantidad: "4 piezas" },
              { nombre: "Harina de trigo", cantidad: "100g" },
              { nombre: "F\xE9cula de ma\xEDz", cantidad: "50g" },
              { nombre: "Especias (ajo, cebolla, piment\xF3n)", cantidad: "15g" },
              { nombre: "Leche", cantidad: "100ml" },
              { nombre: "Huevo", cantidad: "1 unidad" },
              { nombre: "Aceite vegetal", cantidad: "Para fre\xEDr" }
            ],
            pasos: [
              "Mezclar leche con huevo y marinar el pollo por 15 min",
              "Combinar harina, f\xE9cula y especias",
              "Pasar el pollo marinado por la mezcla de harina",
              "Precalentar aceite a 175\xB0C",
              "Fre\xEDr las presas 15-18 minutos hasta dorar",
              "Escurrir sobre papel absorbente"
            ],
            tiempoPreparacion: "20 min"
          }
        },
        {
          nombre: "Ensalada",
          cantidad: 1,
          receta: {
            ingredientes: [
              { nombre: "Lechuga", cantidad: "80g" },
              { nombre: "Tomate", cantidad: "2 unidades" },
              { nombre: "Zanahoria", cantidad: "1 unidad" },
              { nombre: "Repollo", cantidad: "40g" },
              { nombre: "Aderezo vinagreta", cantidad: "30ml" }
            ],
            pasos: [
              "Lavar y desinfectar todas las verduras",
              "Cortar lechuga en trozos medianos",
              "Picar tomates en cubos",
              "Rallar la zanahoria",
              "Cortar repollo en juliana fina",
              "Mezclar todo en un bowl y servir con vinagreta"
            ],
            tiempoPreparacion: "5 min"
          }
        }
      ],
      horaRecepcion: "14:35",
      estado: "En preparaci\xF3n",
      prioridad: "normal"
    },
    {
      id: 103,
      cliente: "Ana Mart\xEDnez",
      productos: [
        {
          nombre: "Combo Familiar",
          cantidad: 1,
          observaciones: "Extra queso en todo",
          receta: {
            ingredientes: [
              { nombre: "Pan de hamburguesa", cantidad: "4 unidades" },
              { nombre: "Carne de res molida", cantidad: "400g" },
              { nombre: "Queso cheddar", cantidad: "6 lonchas" },
              { nombre: "Papas", cantidad: "400g" },
              { nombre: "Salchichas", cantidad: "200g" },
              { nombre: "Vegetales variados", cantidad: "150g" },
              { nombre: "Salsas variadas", cantidad: "120ml" }
            ],
            pasos: [
              "Preparar 2 hamburguesas seg\xFAn receta est\xE1ndar",
              "Preparar salchipapa grande",
              "Fre\xEDr porci\xF3n doble de papas",
              "Servir 4 bebidas fr\xEDas",
              "Empacar todo en combo familiar"
            ],
            tiempoPreparacion: "25 min"
          }
        }
      ],
      horaRecepcion: "14:40",
      estado: "Recibido",
      prioridad: "normal"
    },
    {
      id: 104,
      cliente: "Pedro Ram\xEDrez",
      productos: [
        {
          nombre: "Salchipapa Grande",
          cantidad: 2,
          receta: {
            ingredientes: [
              { nombre: "Papas", cantidad: "300g" },
              { nombre: "Salchichas", cantidad: "4 unidades" },
              { nombre: "Queso gratinado", cantidad: "80g" },
              { nombre: "Salsas (rosada, mostaza, ketchup)", cantidad: "60ml" },
              { nombre: "Aceite vegetal", cantidad: "Para fre\xEDr" }
            ],
            pasos: [
              "Cortar papas en tiras y fre\xEDr a 180\xB0C",
              "Cortar salchichas en rodajas y fre\xEDr",
              "Servir papas en base del plato",
              "Agregar salchichas encima",
              "Espolvorear queso gratinado",
              "Decorar con las tres salsas"
            ],
            tiempoPreparacion: "15 min"
          }
        },
        {
          nombre: "Perro Caliente",
          cantidad: 1,
          observaciones: "Sin salsa picante",
          receta: {
            ingredientes: [
              { nombre: "Pan para perro", cantidad: "1 unidad" },
              { nombre: "Salchicha premium", cantidad: "1 unidad" },
              { nombre: "Papa chip", cantidad: "30g" },
              { nombre: "Queso rallado", cantidad: "30g" },
              { nombre: "Salsas (rosada, mostaza, ketchup)", cantidad: "40ml" },
              { nombre: "Cebolla caramelizada", cantidad: "20g" }
            ],
            pasos: [
              "Cocinar la salchicha a la plancha o hervida",
              "Tostar ligeramente el pan",
              "Colocar salchicha en el pan",
              "Agregar papa chip triturada",
              "Espolvorear queso rallado",
              "Agregar salsas (excepto picante por indicaci\xF3n)",
              "Coronar con cebolla caramelizada"
            ],
            tiempoPreparacion: "10 min"
          }
        }
      ],
      horaRecepcion: "14:42",
      estado: "En preparaci\xF3n",
      prioridad: "normal"
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroAbierto, setFiltroAbierto] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [recetasExpandidas, setRecetasExpandidas] = useState(/* @__PURE__ */ new Set());
  const filtroLabels = {
    "todos": "Todos",
    "Recibido": "Nuevos",
    "En preparaci\xF3n": "En Preparaci\xF3n",
    "Listo": "Listos"
  };
  const filtroColors = {
    "todos": "bg-red-500 text-white",
    "Recibido": "bg-yellow-500 text-white",
    "En preparaci\xF3n": "bg-blue-500 text-white",
    "Listo": "bg-green-500 text-white"
  };
  const handleSelectFiltro = (estado) => {
    setFiltroEstado(estado);
    setFiltroAbierto(false);
  };
  const toggleReceta = (idx) => {
    setRecetasExpandidas((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };
  const pedidosFiltrados = pedidos.filter((p) => {
    const matchEstado = filtroEstado === "todos" || p.estado === filtroEstado;
    const t = searchTerm.trim().toLowerCase();
    const matchSearch = !t || String(p.id).includes(t) || p.cliente.toLowerCase().includes(t) || p.estado.toLowerCase().includes(t);
    return matchEstado && matchSearch;
  });
  const pedidosRecibidos = pedidos.filter((p) => p.estado === "Recibido").length;
  const pedidosEnPreparacion = pedidos.filter((p) => p.estado === "En preparaci\xF3n").length;
  const pedidosListos = pedidos.filter((p) => p.estado === "Listo").length;
  const abrirPedido = (pedido) => {
    setRecetasExpandidas(/* @__PURE__ */ new Set());
    setPedidoSeleccionado(pedido);
  };
  const cerrarModal = () => {
    setPedidoSeleccionado(null);
    setRecetasExpandidas(/* @__PURE__ */ new Set());
  };
  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido) return;
    const mensaje = nuevoEstado === "En preparaci\xF3n" ? "\xBFComenzar a preparar este pedido?" : "\xBFMarcar este pedido como listo para entrega?";
    const confirmed = await confirmAction("Cambiar Estado", mensaje, "S\xED, confirmar");
    if (confirmed) {
      const actualizados = pedidos.map(
        (p) => p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
      );
      setPedidos(actualizados);
      const pedidoActualizado = actualizados.find((p) => p.id === pedidoId);
      setPedidoSeleccionado(pedidoActualizado);
      if (nuevoEstado === "Listo") {
        success("\xA1Pedido listo!", `El pedido #${pedidoId} est\xE1 listo para entrega`);
      } else {
        success("En preparaci\xF3n", `Comenzaste a preparar el pedido #${pedidoId}`);
      }
    }
  };
  const handleLogout = async () => {
    const confirmed = await confirmLogout();
    if (confirmed) {
      logout();
      success("Sesi\xF3n cerrada", "Has salido del sistema correctamente");
    }
  };
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Recibido":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700";
      case "En preparaci\xF3n":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700";
      case "Listo":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700";
    }
  };
  const getPrioridadBorder = (prioridad) => prioridad === "urgente" ? "border-l-4 border-l-red-500" : "border-l-4 border-l-gray-200 dark:border-l-gray-700";
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {
    /* Header */
  }
      <header className="bg-white dark:bg-gray-900 dark:border-b dark:border-gray-800 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-full p-2">
                <img src={logoImg} alt="Chazin Food" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Cocina - Chazin Food</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <ChefHat className="w-4 h-4" />
                  {user?.nombre}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
    to="/fichas-tecnicas"
    title="Fichas Técnicas"
    className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
  >
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Fichas Técnicas</span>
              </Link>
              <Link
    to="/fichas-tecnicas"
    title="Fichas Técnicas"
    className="sm:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
  >
                <FileText className="w-5 h-5" />
              </Link>
              <button
    onClick={toggleDarkMode}
    title={darkMode ? "Modo claro" : "Modo oscuro"}
    className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
  >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
    onClick={handleLogout}
    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
  >
                <LogOut className="w-5 h-5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {
    /* Stats */
  }
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pedidos Nuevos</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{pedidosRecibidos}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg">
                <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">En Preparación</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{pedidosEnPreparacion}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Listos para Entrega</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{pedidosListos}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {
    /* Barra de búsqueda */
  }
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
    type="text"
    placeholder="Buscar por N° pedido, cliente o estado..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition text-sm"
  />
            {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-4 h-4" />
              </button>}
          </div>
          {searchTerm && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {pedidosFiltrados.length} resultado{pedidosFiltrados.length !== 1 ? "s" : ""} para "{searchTerm}"
            </p>}
        </div>

        {
    /* Filtros */
  }
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 mb-6">
          <div className="sm:hidden">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por estado:</p>
            <button
    onClick={() => setFiltroAbierto(!filtroAbierto)}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${filtroColors[filtroEstado]}`}
  >
              <span>{filtroLabels[filtroEstado]}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${filtroAbierto ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${filtroAbierto ? "max-h-96 mt-2" : "max-h-0"}`}>
              <div className="flex flex-col gap-2">
                {["todos", "Recibido", "En preparaci\xF3n", "Listo"].map(
    (estado) => filtroEstado !== estado && <button
      key={estado}
      onClick={() => handleSelectFiltro(estado)}
      className="w-full px-4 py-3 rounded-lg font-medium transition-all bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-left"
    >
                      {filtroLabels[estado]}
                    </button>
  )}
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por estado:</span>
            <div className="flex gap-2 flex-wrap">
              {["todos", "Recibido", "En preparaci\xF3n", "Listo"].map((estado) => <button
    key={estado}
    onClick={() => setFiltroEstado(estado)}
    className={`px-4 py-2 rounded-lg font-medium transition-all ${filtroEstado === estado ? filtroColors[estado] : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
  >
                  {filtroLabels[estado]}
                </button>)}
            </div>
          </div>
        </div>

        {
    /* Tarjetas de pedidos */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pedidosFiltrados.map((pedido) => <button
    key={pedido.id}
    onClick={() => abrirPedido(pedido)}
    className={`bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl hover:-translate-y-0.5 text-left w-full ${getPrioridadBorder(pedido.prioridad)}`}
  >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Pedido #{pedido.id}</h3>
                      {pedido.prioridad === "urgente" && <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full">
                          URGENTE
                        </span>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {pedido.cliente}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      {pedido.horaRecepcion}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {pedido.productos.length} {pedido.productos.length === 1 ? "producto" : "productos"}
                  </p>
                  <div className="space-y-1">
                    {pedido.productos.slice(0, 2).map((prod, i) => <p key={i} className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        <span className="text-red-500 font-bold">{prod.cantidad}x</span> {prod.nombre}
                      </p>)}
                    {pedido.productos.length > 2 && <p className="text-xs text-gray-400 dark:text-gray-500">
                        +{pedido.productos.length - 2} más...
                      </p>}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-red-500 dark:text-red-400 font-medium">
                    Toca para ver detalles y acciones →
                  </span>
                </div>
              </div>
            </button>)}
        </div>

        {pedidosFiltrados.length === 0 && <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-md">
            <Package className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No hay pedidos con este estado</p>
          </div>}
      </div>

      {
    /* Modal de pedido */
  }
      {pedidoSeleccionado && <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
    onClick={cerrarModal}
  >
          <div
    className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
            {
    /* Modal header */
  }
            <div className={`p-5 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between ${pedidoSeleccionado.prioridad === "urgente" ? "border-l-4 border-l-red-500" : ""}`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Pedido #{pedidoSeleccionado.id}
                  </h2>
                  {pedidoSeleccionado.prioridad === "urgente" && <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full">
                      URGENTE
                    </span>}
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getEstadoColor(pedidoSeleccionado.estado)}`}>
                    {pedidoSeleccionado.estado}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{pedidoSeleccionado.cliente}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{pedidoSeleccionado.horaRecepcion}</span>
                </div>
              </div>
              <button
    onClick={cerrarModal}
    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            {
    /* Modal body */
  }
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Productos del pedido
              </p>

              {pedidoSeleccionado.productos.map((producto, idx) => <div
    key={idx}
    className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden"
  >
                  {
    /* Producto header */
  }
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100">
                          <span className="text-red-500 dark:text-red-400">{producto.cantidad}x</span>{" "}
                          {producto.nombre}
                        </p>
                        {producto.observaciones && <p className="text-sm text-orange-600 dark:text-orange-400 italic mt-1 flex items-center gap-1">
                            ⚠️ {producto.observaciones}
                          </p>}
                        {producto.receta && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Tiempo estimado: {producto.receta.tiempoPreparacion}
                          </p>}
                      </div>
                      {producto.receta && <button
    onClick={() => toggleReceta(idx)}
    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
  >
                          <BookOpen className="w-4 h-4 text-red-500" />
                          <span>{recetasExpandidas.has(idx) ? "Ocultar" : "Ver receta"}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${recetasExpandidas.has(idx) ? "rotate-180" : ""}`} />
                        </button>}
                    </div>
                  </div>

                  {
    /* Receta expandible */
  }
                  {producto.receta && <div className={`transition-all duration-300 overflow-hidden ${recetasExpandidas.has(idx) ? "max-h-[1000px]" : "max-h-0"}`}>
                      <div className="border-t border-gray-200 dark:border-gray-700 mx-4" />
                      <div className="p-4 pt-3 grid sm:grid-cols-2 gap-4">
                        {
    /* Ingredientes */
  }
                        <div>
                          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Ingredientes
                          </p>
                          <div className="space-y-1.5">
                            {producto.receta.ingredientes.map((ing, i) => <div key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-red-500 mt-0.5 shrink-0">•</span>
                                <span className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">{ing.nombre}:</span> {ing.cantidad}
                                </span>
                              </div>)}
                          </div>
                        </div>
                        {
    /* Pasos */
  }
                        <div>
                          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Preparación
                          </p>
                          <div className="space-y-2">
                            {producto.receta.pasos.map((paso, i) => <div key={i} className="flex items-start gap-2 text-sm">
                                <span className="font-bold text-red-500 dark:text-red-400 min-w-[18px] shrink-0">{i + 1}.</span>
                                <span className="text-gray-700 dark:text-gray-300">{paso}</span>
                              </div>)}
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>)}
            </div>

            {
    /* Modal footer — acciones */
  }
            <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              {pedidoSeleccionado.estado === "Recibido" && <button
    onClick={() => handleCambiarEstado(pedidoSeleccionado.id, "En preparaci\xF3n")}
    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
  >
                  <Package className="w-5 h-5" />
                  Comenzar a Preparar
                </button>}
              {pedidoSeleccionado.estado === "En preparaci\xF3n" && <button
    onClick={() => handleCambiarEstado(pedidoSeleccionado.id, "Listo")}
    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
  >
                  <CheckCircle className="w-5 h-5" />
                  Marcar como Listo
                </button>}
              {pedidoSeleccionado.estado === "Listo" && <div className="w-full py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Listo para Entrega
                </div>}
            </div>
          </div>
        </div>}
    </div>;
}

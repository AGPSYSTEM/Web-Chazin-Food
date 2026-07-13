import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, LogIn, ShoppingCart, User, Search, Package, Clock, X, Plus, Minus, Award, TrendingUp, Sun, Moon, Menu, MapPin, CreditCard, Banknote, Smartphone, FileText, ChevronRight, ChevronUp, ChevronDown, CheckCircle, Truck, Store, Flame, Gift } from "lucide-react";
import { useAuth } from "@/domain/state/AuthContext";
import { useDarkMode } from "@/domain/hooks/useDarkMode";
import { useNotifications } from "@/domain/hooks/useNotifications";
import { useCart } from "@/domain/state/CartContext";
import logoImg from "@/presentation/assets/ChatGPT_Image_1_jun_2026__21_55_04.png";
const categorias = [
  { id: 1, nombre: "Hamburguesas", icon: "\u{1F354}", color: "from-yellow-400 to-orange-500" },
  { id: 2, nombre: "Salchipapas", icon: "\u{1F35F}", color: "from-yellow-500 to-amber-600" },
  { id: 3, nombre: "Perros Calientes", icon: "\u{1F32D}", color: "from-orange-400 to-red-500" },
  { id: 4, nombre: "Pollo", icon: "\u{1F357}", color: "from-amber-500 to-orange-600" },
  { id: 5, nombre: "Bebidas", icon: "\u{1F964}", color: "from-blue-400 to-blue-600" },
  { id: 6, nombre: "Acompa\xF1amientos", icon: "\u{1F957}", color: "from-green-400 to-green-600" },
  { id: 8, nombre: "Combos", icon: "\u{1F371}", color: "from-purple-400 to-purple-600" }
];
const productos = [
  { id: 1, nombre: "Hamburguesa Especial", precio: 15e3, categoria: 1, imagen: "\u{1F354}", descripcion: "Doble carne, queso, lechuga, tomate y salsas", stock: 25 },
  { id: 2, nombre: "Salchipapa Grande", precio: 12e3, categoria: 2, imagen: "\u{1F35F}", descripcion: "Papas fritas con salchicha y salsas", stock: 30 },
  { id: 3, nombre: "Perro Caliente Especial", precio: 1e4, categoria: 3, imagen: "\u{1F32D}", descripcion: "Hot dog con salsas y papa chip", stock: 20 },
  { id: 4, nombre: "Pollo Broaster", precio: 18e3, categoria: 4, imagen: "\u{1F357}", descripcion: "Porci\xF3n de pollo con papas", stock: 15 },
  { id: 5, nombre: "Coca Cola", precio: 3e3, categoria: 5, imagen: "\u{1F964}", descripcion: "Gaseosa 350ml", stock: 60 },
  { id: 6, nombre: "Combo Familiar", precio: 45e3, categoria: 8, imagen: "\u{1F371}", descripcion: "2 hamburguesas, salchipapa y bebidas", stock: 12 }
];
const adicionesDisponibles = [
  { idAdicion: 1, nombre: "Salsa BBQ", precio: 1e3, stockActual: 50, tipo: "Salsa", imagen: "\u{1F96B}" },
  { idAdicion: 2, nombre: "Salsa de Ajo", precio: 1e3, stockActual: 45, tipo: "Salsa", imagen: "\u{1F9C4}" },
  { idAdicion: 3, nombre: "Salsa Picante", precio: 1e3, stockActual: 40, tipo: "Salsa", imagen: "\u{1F336}\uFE0F" },
  { idAdicion: 4, nombre: "Queso Extra", precio: 2e3, stockActual: 30, tipo: "Ingrediente", imagen: "\u{1F9C0}" },
  { idAdicion: 5, nombre: "Tocineta", precio: 3e3, stockActual: 25, tipo: "Ingrediente", imagen: "\u{1F953}" },
  { idAdicion: 6, nombre: "Papas Fritas", precio: 5e3, stockActual: 35, tipo: "Acompa\xF1amiento", imagen: "\u{1F35F}" },
  { idAdicion: 7, nombre: "Coca Cola", precio: 3e3, stockActual: 60, tipo: "Bebida", imagen: "\u{1F964}" },
  { idAdicion: 8, nombre: "Sprite", precio: 3e3, stockActual: 55, tipo: "Bebida", imagen: "\u{1F964}" },
  { idAdicion: 9, nombre: "Jugo de Naranja", precio: 4e3, stockActual: 20, tipo: "Bebida", imagen: "\u{1F9C3}" }
];
const fichasTecnicas = {
  1: { ingredientes: ["Carne de res 150g", "Pan artesanal", "Lechuga", "Tomate", "Queso cheddar", "Salsas especiales"], peso: "350g", tamano: "Regular", calorias: "620 kcal" },
  2: { ingredientes: ["Papas crinkle 200g", "Salchicha premium 100g", "Queso gratinado", "Salsas de la casa"], peso: "400g", tamano: "Grande", calorias: "720 kcal" },
  3: { ingredientes: ["Salchicha premium", "Pan de perro", "Papa chip", "Queso", "Salsas especiales"], peso: "280g", tamano: "Regular", calorias: "540 kcal" },
  4: { ingredientes: ["Pechuga de pollo broaster 200g", "Papas crinkle", "Ensalada fresca"], peso: "450g", tamano: "Grande", calorias: "680 kcal" },
  5: { ingredientes: ["Gaseosa 350ml"], peso: "350ml", tamano: "Regular", calorias: "140 kcal" },
  6: { ingredientes: ["2 Hamburguesas Especiales", "Salchipapa Grande", "Papas Crinkle", "4 Bebidas 350ml"], peso: "1.8kg", tamano: "Familiar", calorias: "2800 kcal" }
};
function FichaTecnicaProductoCliente({ ficha }) {
  const [open, setOpen] = useState(false);
  return <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
    type="button"
    onClick={() => setOpen((v) => !v)}
    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-red-500" />
          Ficha Técnica del Producto
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="p-4 space-y-3 bg-white dark:bg-gray-900">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Peso</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{ficha.peso}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Tamaño</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{ficha.tamano}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Calorías</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{ficha.calorias}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Ingredientes:</p>
            <div className="flex flex-wrap gap-1.5">
              {ficha.ingredientes.map((ing, i) => <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  {ing}
                </span>)}
            </div>
          </div>
        </div>}
    </div>;
}
export function ClienteLanding() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, getTotalItems, getSubtotal, getIVA, getTotal } = useCart();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const { success, error, confirmAction, confirmLogout } = useNotifications();
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showEmptyCartLoginModal, setShowEmptyCartLoginModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutNombre, setCheckoutNombre] = useState("");
  const [checkoutDireccion, setCheckoutDireccion] = useState("");
  const [checkoutMetodoPago, setCheckoutMetodoPago] = useState("efectivo");
  const [checkoutTarjetaNumero, setCheckoutTarjetaNumero] = useState("");
  const [checkoutTarjetaMonto, setCheckoutTarjetaMonto] = useState("");
  const [checkoutEspecificaciones, setCheckoutEspecificaciones] = useState("");
  const [checkoutTipoEntrega, setCheckoutTipoEntrega] = useState("domicilio");
  const [checkoutEfectivoPaga, setCheckoutEfectivoPaga] = useState("");
  const [checkoutTransferReferencia, setCheckoutTransferReferencia] = useState("");
  const [checkoutTransferBanco, setCheckoutTransferBanco] = useState("Bancolombia");
  const [showPedidos, setShowPedidos] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [pedidos, setPedidos] = useState(() => {
    const saved = localStorage.getItem("chazin_client_pedidos");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        fecha: "2026-06-02 14:30",
        items: [
          { nombre: "Hamburguesa Especial", cantidad: 2, precio: 15e3 },
          { nombre: "Coca Cola", cantidad: 2, precio: 3e3 }
        ],
        total: 36e3,
        estado: "En preparación"
      },
      {
        id: 2,
        fecha: "2026-06-01 19:15",
        items: [
          { nombre: "Combo Familiar", cantidad: 1, precio: 45e3 }
        ],
        total: 45e3,
        estado: "Entregado"
      }
    ];
  });
  const productosFiltrados = productos.filter((p) => {
    const matchCategoria = !selectedCategoria || p.categoria === selectedCategoria;
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategoria && matchSearch;
  });
  const handleProductClick = (producto) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setProductoSeleccionado({
      producto,
      cantidad: 1,
      adicionesSeleccionadas: []
    });
    setShowProductModal(true);
  };
  const handleAdicionToggle = (adicion) => {
    if (!productoSeleccionado) return;
    const exists = productoSeleccionado.adicionesSeleccionadas.find((a) => a.idAdicion === adicion.idAdicion);
    if (exists) {
      setProductoSeleccionado({
        ...productoSeleccionado,
        adicionesSeleccionadas: productoSeleccionado.adicionesSeleccionadas.filter((a) => a.idAdicion !== adicion.idAdicion)
      });
    } else {
      setProductoSeleccionado({
        ...productoSeleccionado,
        adicionesSeleccionadas: [
          ...productoSeleccionado.adicionesSeleccionadas,
          { idAdicion: adicion.idAdicion, nombre: adicion.nombre, precio: adicion.precio, cantidad: 1 }
        ]
      });
    }
  };
  const handleAdicionQuantityChange = (idAdicion, delta) => {
    if (!productoSeleccionado) return;
    setProductoSeleccionado({
      ...productoSeleccionado,
      adicionesSeleccionadas: productoSeleccionado.adicionesSeleccionadas.map((a) => {
        if (a.idAdicion === idAdicion) {
          const newQuantity = Math.max(1, a.cantidad + delta);
          return { ...a, cantidad: newQuantity };
        }
        return a;
      })
    });
  };
  const handleAddToCart = () => {
    if (!productoSeleccionado) return;
    addToCart({
      id: productoSeleccionado.producto.id,
      nombre: productoSeleccionado.producto.nombre,
      precio: productoSeleccionado.producto.precio,
      cantidad: productoSeleccionado.cantidad,
      imagen: productoSeleccionado.producto.imagen,
      adiciones: productoSeleccionado.adicionesSeleccionadas.map((a) => ({
        ...a,
        imagen: a.imagen || adicionesDisponibles.find((ad) => ad.idAdicion === a.idAdicion)?.imagen
      }))
    });
    setShowProductModal(false);
    setProductoSeleccionado(null);
    success("\xA1Producto agregado!", "El producto se agreg\xF3 al carrito correctamente");
  };
  const handleAbrirCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (cart.length === 0) return;
    setCheckoutNombre(user?.nombre || "");
    setCheckoutDireccion("");
    setCheckoutEspecificaciones("");
    setCheckoutMetodoPago("efectivo");
    setCheckoutTipoEntrega("domicilio");
    setCheckoutEfectivoPaga("");
    setCheckoutTransferReferencia("");
    setCheckoutTransferBanco("Bancolombia");
    setCheckoutTarjetaNumero("");
    setCheckoutTarjetaMonto("");
    setShowCheckout(true);
  };
  const CLIENT_IVA_RATE = 0;
  const clientSubtotal = getSubtotal();
  const clientIVA = Math.round(clientSubtotal * CLIENT_IVA_RATE);
  const clientTotal = clientSubtotal + clientIVA;
  const totalCheckout = clientTotal;
  const vueltoEfectivo = Math.max(0, Number(checkoutEfectivoPaga || 0) - totalCheckout);
  const handleConfirmarPedido = async () => {
    if (checkoutTipoEntrega === "domicilio" && !checkoutDireccion.trim()) {
      error("Dirección requerida", "Por favor ingresa la dirección de entrega");
      return;
    }
    if (checkoutMetodoPago === "efectivo" && checkoutEfectivoPaga) {
      if (Number(checkoutEfectivoPaga) < totalCheckout) {
        error("Monto insuficiente", "El efectivo entregado es menor al total a pagar");
        return;
      }
    }
    if (checkoutMetodoPago === "transferencia" && !checkoutTransferReferencia.trim()) {
      error("Referencia requerida", "Ingresa el número de referencia de la transferencia");
      return;
    }
    const confirmed = await confirmAction(
      "Confirmar Pedido",
      "¿Deseas confirmar tu pedido?",
      "Sí, confirmar"
    );
    if (confirmed) {
      // 1. Guardar el nuevo pedido en el historial del cliente
      const newClientOrderId = pedidos.length + 1;
      const newClientOrder = {
        id: newClientOrderId,
        fecha: new Date().toISOString().slice(0, 16).replace("T", " "),
        items: cart.map(item => ({ nombre: item.nombre, cantidad: item.cantidad, precio: item.precio })),
        total: totalCheckout,
        estado: "En preparación"
      };
      const updatedClientPedidos = [newClientOrder, ...pedidos];
      setPedidos(updatedClientPedidos);
      localStorage.setItem("chazin_client_pedidos", JSON.stringify(updatedClientPedidos));

      // 2. Sincronizar con las órdenes de producción del administrador en localStorage
      const savedOrders = localStorage.getItem("chazin_ordenes");
      const currentOrders = savedOrders ? JSON.parse(savedOrders) : [
        {
          id: "OP-001",
          producto: "Hamburguesa Especial",
          emoji: "🍔",
          cantidad: 2,
          cocinero: "Carlos R.",
          fechaCreacion: "2026-06-23",
          horaInicio: "10:30",
          tiempoEstimado: 15,
          estado: "en_preparacion",
          prioridad: "alta",
          notas: "Sin cebolla en una de las hamburguesas",
          ingredientes: [
            { nombre: "Pan de hamburguesa", cantidad: 2, unidad: "unidades" },
            { nombre: "Carne de res 150g", cantidad: 2, unidad: "porciones" },
            { nombre: "Queso cheddar", cantidad: 4, unidad: "lonchas" }
          ]
        },
        {
          id: "OP-002",
          producto: "Pollo Broaster",
          emoji: "🍗",
          cantidad: 1,
          cocinero: "María G.",
          fechaCreacion: "2026-06-23",
          horaInicio: "10:35",
          tiempoEstimado: 20,
          estado: "en_cola",
          prioridad: "media",
          notas: "",
          ingredientes: [
            { nombre: "Pechuga de pollo", cantidad: 1, unidad: "unidad" },
            { nombre: "Harina sazonada", cantidad: 100, unidad: "g" },
            { nombre: "Aceite vegetal", cantidad: 500, unidad: "ml" }
          ]
        },
        {
          id: "OP-003",
          producto: "Salchipapa Grande",
          emoji: "🍟",
          cantidad: 3,
          cocinero: "Carlos R.",
          fechaCreacion: "2026-06-23",
          horaInicio: "10:20",
          tiempoEstimado: 10,
          estado: "listo",
          prioridad: "normal",
          notas: "Extra salsa rosada",
          ingredientes: [
            { nombre: "Papas fritas", cantidad: 600, unidad: "g" },
            { nombre: "Salchichas", cantidad: 6, unidad: "unidades" },
            { nombre: "Salsas variadas", cantidad: 3, unidad: "porciones" }
          ]
        },
        {
          id: "OP-004",
          producto: "Combo Familiar",
          emoji: "🍱",
          cantidad: 1,
          cocinero: "Juan P.",
          fechaCreacion: "2026-06-23",
          horaInicio: "10:15",
          tiempoEstimado: 25,
          estado: "despachado",
          prioridad: "alta",
          notas: "Pedido para domicilio",
          ingredientes: [
            { nombre: "Pollo asado", cantidad: 1, unidad: "unidad entera" },
            { nombre: "Papas fritas", cantidad: 400, unidad: "g" },
            { nombre: "Bebidas", cantidad: 4, unidad: "unidades" }
          ]
        },
        {
          id: "OP-005",
          producto: "Perro Caliente",
          emoji: "🌭",
          cantidad: 2,
          cocinero: "María G.",
          fechaCreacion: "2026-06-23",
          horaInicio: "09:50",
          tiempoEstimado: 12,
          estado: "entregado",
          prioridad: "normal",
          notas: "",
          ingredientes: [
            { nombre: "Pan de hot dog", cantidad: 2, unidad: "unidades" },
            { nombre: "Salchicha", cantidad: 2, unidad: "unidades" },
            { nombre: "Aderezos", cantidad: 2, unidad: "porciones" }
          ]
        },
        {
          id: "OP-006",
          producto: "Papas Fritas",
          emoji: "🍟",
          cantidad: 4,
          cocinero: "Carlos R.",
          fechaCreacion: "2026-06-23",
          horaInicio: "10:45",
          tiempoEstimado: 8,
          estado: "en_cola",
          prioridad: "alta",
          notas: "Con sal extra",
          ingredientes: [
            { nombre: "Papas", cantidad: 800, unidad: "g" },
            { nombre: "Aceite", cantidad: 1, unidad: "L" }
          ]
        },
        {
          id: "OP-007",
          producto: "Hamburguesa Especial",
          emoji: "🍔",
          cantidad: 1,
          cocinero: "Juan P.",
          fechaCreacion: "2026-06-23",
          horaInicio: "10:50",
          tiempoEstimado: 15,
          estado: "en_cola",
          prioridad: "media",
          notas: "",
          ingredientes: [
            { nombre: "Pan de hamburguesa", cantidad: 1, unidad: "unidad" },
            { nombre: "Carne de res 150g", cantidad: 1, unidad: "porción" },
            { nombre: "Lechuga y tomate", cantidad: 1, unidad: "porción" }
          ]
        },
        {
          id: "OP-008",
          producto: "Bebida Combo",
          emoji: "🥤",
          cantidad: 3,
          cocinero: "María G.",
          fechaCreacion: "2026-06-23",
          horaInicio: "10:55",
          tiempoEstimado: 5,
          estado: "en_preparacion",
          prioridad: "normal",
          notas: "Una sin azúcar",
          ingredientes: [
            { nombre: "Gaseosa 400ml", cantidad: 2, unidad: "vasos" },
            { nombre: "Jugo natural", cantidad: 1, unidad: "vaso" }
          ]
        }
      ];

      const newProductionOrders = cart.map((cartItem, index) => {
        const nextOPNum = currentOrders.length + 1 + index;
        const opId = `OP-${String(nextOPNum).padStart(3, "0")}`;
        return {
          id: opId,
          producto: cartItem.nombre,
          emoji: cartItem.imagen || "🍔",
          cantidad: cartItem.cantidad,
          cocinero: "Sin asignar",
          fechaCreacion: new Date().toISOString().slice(0, 10),
          horaInicio: new Date().toTimeString().slice(0, 5),
          tiempoEstimado: 15,
          estado: "en_preparacion", // In "En Preparación" status as requested
          prioridad: "normal",
          notas: checkoutEspecificaciones || "",
          ingredientes: cartItem.adiciones?.map(a => ({ nombre: a.nombre, cantidad: a.cantidad, unidad: "unidad" })) || [{ nombre: "Ingredientes base", cantidad: 1, unidad: "porción" }]
        };
      });

      const updatedOrders = [...currentOrders, ...newProductionOrders];
      localStorage.setItem("chazin_ordenes", JSON.stringify(updatedOrders));

      success("¡Pedido realizado!", "Tu pedido ha sido enviado a cocina. Recibirás una notificación cuando esté listo.");
      clearCart();
      setShowCheckout(false);
      setShowCart(false);
    }
  };
  const handleLogout = async () => {
    const confirmed = await confirmLogout();
    if (confirmed) {
      logout();
      clearCart();
      setShowCart(false);
      setShowPedidos(false);
      setShowPerfil(false);
      setShowProductModal(false);
      success("Sesi\xF3n cerrada", "Has salido del sistema correctamente");
      navigate("/");
    }
  };
  const estadisticasCliente = (() => {
    const pedidosEntregados = pedidos.filter((p) => p.estado !== "Cancelado");
    let totalProductos = 0;
    const conteo = {};
    let totalGastado = 0;
    pedidosEntregados.forEach((p) => {
      totalGastado += p.total;
      p.items.forEach((item) => {
        totalProductos += item.cantidad;
        conteo[item.nombre] = (conteo[item.nombre] || 0) + item.cantidad;
      });
    });
    let productoFavorito = "A\xFAn no tienes un favorito";
    let cantidadFavorito = 0;
    Object.entries(conteo).forEach(([nombre, cantidad]) => {
      if (cantidad > cantidadFavorito) {
        productoFavorito = nombre;
        cantidadFavorito = cantidad;
      }
    });
    const META_FIDELIDAD = 3;
    const comprasFidelidad = pedidosEntregados.length;
    const rachaActual = comprasFidelidad % META_FIDELIDAD;
    const recompensasGanadas = Math.floor(comprasFidelidad / META_FIDELIDAD);
    const faltanParaRecompensa = META_FIDELIDAD - rachaActual;
    return {
      totalProductos,
      productoFavorito,
      cantidadFavorito,
      totalPedidos: pedidosEntregados.length,
      totalGastado,
      rachaActual,
      recompensasGanadas,
      faltanParaRecompensa,
      metaFidelidad: META_FIDELIDAD
    };
  })();
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "En preparaci\xF3n":
        return "bg-yellow-100 text-yellow-700";
      case "Listo":
        return "bg-blue-100 text-blue-700";
      case "En camino":
        return "bg-purple-100 text-purple-700";
      case "Entregado":
        return "bg-green-100 text-green-700";
      case "Cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {
    /* Header */
  }
      <header className="bg-white dark:bg-gray-900 dark:border-b dark:border-gray-800 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden bg-white">
                <img
    src={logoImg}
    alt="Chazin Food"
    className="w-full h-full object-cover"
    style={{ objectPosition: "50% 56%" }}
  />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Chazin Food</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{isAuthenticated ? `¡Bienvenido, ${user?.nombre}!` : "Bienvenido a Chazin Food"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <button
    onClick={toggleDarkMode}
    title={darkMode ? "Modo claro" : "Modo oscuro"}
    className="hidden md:inline-flex p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
  >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated ? <>
                <button
    onClick={() => setShowPerfil(true)}
    className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
  >
                  <User className="w-5 h-5" />
                  <span>Mi Perfil</span>
                </button>

                <button
    onClick={() => setShowPedidos(!showPedidos)}
    className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
  >
                  <Package className="w-5 h-5" />
                  <span>Mis Pedidos</span>
                </button>
              </> : <button
    onClick={() => navigate("/login")}
    className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
  >
                  <User className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </button>}

              <button
    onClick={() => {
      if (!isAuthenticated) {
        setShowEmptyCartLoginModal(true);
        return;
      }
      setShowCart(!showCart);
    }}
    className="relative flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
  >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && <span className="absolute -top-2 -right-2 bg-white text-red-600 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shadow">
                    {getTotalItems()}
                  </span>}
                <span className="hidden sm:inline">Carrito</span>
              </button>

              {isAuthenticated && <button
    onClick={handleLogout}
    className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
  >
                <LogOut className="w-5 h-5" />
                <span>Salir</span>
              </button>}

              <div className="relative md:hidden">
                <button
    onClick={() => setShowMenu(!showMenu)}
    className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
    title="Menú"
  >
                  <Menu className="w-6 h-6" />
                </button>

                {showMenu && <>
                    <div
    className="fixed inset-0 z-40"
    onClick={() => setShowMenu(false)}
  />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                      <button
    onClick={() => {
      toggleDarkMode();
      setShowMenu(false);
    }}
    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
  >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span>{darkMode ? "Modo claro" : "Modo oscuro"}</span>
                      </button>
                      {isAuthenticated ? <>
                        <button
    onClick={() => {
      setShowPerfil(true);
      setShowMenu(false);
    }}
    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
  >
                          <User className="w-5 h-5" />
                          <span>Mi Perfil</span>
                        </button>
                        <button
    onClick={() => {
      setShowPedidos(true);
      setShowMenu(false);
    }}
    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
  >
                          <Package className="w-5 h-5" />
                          <span>Mis Pedidos</span>
                        </button>
                        <div className="border-t border-gray-200 dark:border-gray-700" />
                        <button
    onClick={() => {
      handleLogout();
      setShowMenu(false);
    }}
    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
  >
                          <LogOut className="w-5 h-5" />
                          <span>Cerrar sesión</span>
                        </button>
                      </> : <button
    onClick={() => {
      navigate("/login");
      setShowMenu(false);
    }}
    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
  >
                          <User className="w-5 h-5" />
                          <span>Iniciar sesión</span>
                        </button>}
                    </div>
                  </>}
              </div>
            </div>
          </div>
        </div>
      </header>

      {
    /* Hero Section */
  }
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">¡Las mejores hamburguesas de la ciudad!</h2>
          <p className="text-base sm:text-lg md:text-xl text-red-100">Ordena ahora y recibe en la puerta de tu casa</p>
        </div>
      </div>

      {
    /* Search Bar */
  }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
    type="text"
    placeholder="Buscar productos..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  />
          </div>
        </div>
      </div>

      {
    /* Categorías */
  }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Categorías</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <button
    onClick={() => setSelectedCategoria(null)}
    className={`p-4 rounded-xl transition-all ${selectedCategoria === null ? "bg-red-500 text-white shadow-lg" : "bg-white dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
  >
            <div className="text-4xl mb-2">🍽️</div>
            <p className="font-medium text-sm">Todos</p>
          </button>
          {categorias.map((cat) => <button
    key={cat.id}
    onClick={() => setSelectedCategoria(cat.id)}
    className={`p-4 rounded-xl transition-all ${selectedCategoria === cat.id ? "bg-red-500 text-white shadow-lg" : "bg-white dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
  >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="font-medium text-sm">{cat.nombre}</p>
            </button>)}
        </div>
      </div>

      {
    /* Productos */
  }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          {selectedCategoria ? categorias.find((c) => c.id === selectedCategoria)?.nombre : "Todos los productos"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosFiltrados.map((producto) => <div key={producto.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
              <div className="bg-gradient-to-br from-red-400 to-red-600 h-48 flex items-center justify-center">
                <div className="text-8xl">{producto.imagen}</div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">{producto.nombre}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{producto.descripcion}</p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">${producto.precio.toLocaleString()}</p>
                </div>
                <button
    onClick={() => handleProductClick(producto)}
    className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold flex items-center justify-center gap-2"
  >
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al carrito
                </button>
              </div>
            </div>)}
        </div>
      </div>

      {
    /* Modal de Selección de Producto con Adiciones */
  }
      {showProductModal && productoSeleccionado && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 dark:bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-br from-red-400 to-red-600 p-4 sm:p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className="text-4xl sm:text-6xl shrink-0">{productoSeleccionado.producto.imagen}</div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-2xl font-bold text-white truncate">{productoSeleccionado.producto.nombre}</h2>
                  <p className="text-sm sm:text-base text-red-100 truncate">{categorias.find((c) => c.id === productoSeleccionado.producto.categoria)?.nombre || "Producto"}</p>
                  <p className="text-white font-bold text-base sm:text-xl mt-1">${productoSeleccionado.producto.precio.toLocaleString()}</p>
                </div>
              </div>
              <button
    onClick={() => {
      setShowProductModal(false);
      setProductoSeleccionado(null);
    }}
    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors shrink-0 ml-2"
  >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100">Información del Producto</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3">{productoSeleccionado.producto.descripcion}</p>

                {
    /* Ficha Técnica colapsable */
  }
                {fichasTecnicas[productoSeleccionado.producto.id] && <FichaTecnicaProductoCliente ficha={fichasTecnicas[productoSeleccionado.producto.id]} />}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cantidad</label>
                <div className="flex items-center gap-3">
                  <button
    onClick={() => setProductoSeleccionado({
      ...productoSeleccionado,
      cantidad: Math.max(1, productoSeleccionado.cantidad - 1)
    })}
    className="w-10 h-10 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 w-16 text-center">
                    {productoSeleccionado.cantidad}
                  </span>
                  <button
    onClick={() => setProductoSeleccionado({
      ...productoSeleccionado,
      cantidad: Math.min(productoSeleccionado.producto.stock, productoSeleccionado.cantidad + 1)
    })}
    className="w-10 h-10 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100 mb-3">Adiciones Disponibles</h3>
                <div className="space-y-3 sm:space-y-4">
                  {Object.entries(adicionesDisponibles.reduce((acc, adicion) => {
    if (!acc[adicion.tipo]) acc[adicion.tipo] = [];
    acc[adicion.tipo].push(adicion);
    return acc;
  }, {})).map(([tipo, adiciones]) => <div key={tipo}>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{tipo}s</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {adiciones.map((adicion) => {
    const seleccionada = productoSeleccionado.adicionesSeleccionadas.find(
      (a) => a.idAdicion === adicion.idAdicion
    );
    return <div
      key={adicion.idAdicion}
      className={`border-2 rounded-lg p-2 sm:p-3 transition-all cursor-pointer ${seleccionada ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500"}`}
      onClick={() => handleAdicionToggle(adicion)}
    >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                  <div className="text-2xl sm:text-3xl shrink-0">{adicion.imagen}</div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100 truncate">{adicion.nombre}</p>
                                    <p className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400">+${adicion.precio.toLocaleString()}</p>
                                  </div>
                                </div>
                                {seleccionada && <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                    <button
      onClick={(e) => {
        e.stopPropagation();
        handleAdicionQuantityChange(adicion.idAdicion, -1);
      }}
      className="w-6 h-6 sm:w-7 sm:h-7 bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
                                      {seleccionada.cantidad}
                                    </span>
                                    <button
      onClick={(e) => {
        e.stopPropagation();
        handleAdicionQuantityChange(adicion.idAdicion, 1);
      }}
      className="w-6 h-6 sm:w-7 sm:h-7 bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>}
                              </div>
                            </div>;
  })}
                      </div>
                    </div>)}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-800 dark:text-gray-100">Total:</span>
                  <span className="font-bold text-2xl text-red-600 dark:text-red-400">
                    ${((productoSeleccionado.producto.precio + productoSeleccionado.adicionesSeleccionadas.reduce((sum, a) => sum + a.precio * a.cantidad, 0)) * productoSeleccionado.cantidad).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
    onClick={() => {
      setShowProductModal(false);
      setProductoSeleccionado(null);
    }}
    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
  >
                    Cancelar
                  </button>
                  <button
    onClick={handleAddToCart}
    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold shadow-lg"
  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}

      {
    /* Modal de Carrito */
  }
      {showCart && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex items-center justify-between z-10">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Mi Carrito ({getTotalItems()})</h3>
              <button
    onClick={() => setShowCart(false)}
    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300 rounded-lg transition-colors"
  >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {cart.length === 0 ? <div className="text-center py-12">
                  <ShoppingCart className="w-24 h-24 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Tu carrito está vacío</p>
                  <p className="text-gray-400 dark:text-gray-500 mt-2">¡Agrega productos para comenzar!</p>
                </div> : <>
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    {cart.map((item, index) => <div key={`${item.id}-${index}`} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                          <div className="text-3xl sm:text-4xl shrink-0">{item.imagen}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100 truncate">{item.nombre}</h4>
                            <p className="text-sm sm:text-base text-red-600 dark:text-red-400 font-bold">${item.precio.toLocaleString()}</p>
                          </div>
                          <button
    onClick={() => removeFromCart(item.id)}
    className="p-1.5 sm:p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 transition-colors shrink-0"
  >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>

                        {item.adiciones.length > 0 && <div className="mb-2 sm:mb-3 pl-0 sm:pl-11 space-y-1">
                            {item.adiciones.map((adicion) => <div key={adicion.idAdicion} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <span className="text-base">{adicion.imagen || "\u2795"}</span>
                                <span>{adicion.nombre} x{adicion.cantidad} (${(adicion.precio * adicion.cantidad).toLocaleString()})</span>
                              </div>)}
                          </div>}

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <button
    onClick={() => updateQuantity(item.id, -1)}
    className="w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <span className="font-bold text-base sm:text-lg dark:text-gray-100 min-w-[2rem] text-center">{item.cantidad}</span>
                            <button
    onClick={() => updateQuantity(item.id, 1)}
    className="w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                          <p className="font-bold text-sm sm:text-lg text-gray-800 dark:text-gray-100">
                            ${((item.precio + item.adiciones.reduce((sum, a) => sum + a.precio * a.cantidad, 0)) * item.cantidad).toLocaleString()}
                          </p>
                        </div>
                      </div>)}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">${clientSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 dark:text-gray-400">IVA ({(CLIENT_IVA_RATE * 100).toFixed(0)}%):</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">${clientIVA.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-2xl pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="font-bold text-gray-800 dark:text-gray-100">Total:</span>
                      <span className="font-bold text-red-600 dark:text-red-400">${clientTotal.toLocaleString()}</span>
                    </div>
                    <button
    onClick={handleAbrirCheckout}
    className="w-full py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold text-lg shadow-lg flex items-center justify-center gap-2"
  >
                      Continuar al pago
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </>}
            </div>
          </div>
        </div>}

      {
    /* Modal de Perfil */
  }
      {showPerfil && <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-br from-red-500 to-red-600 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-9 h-9 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>
                  <p className="text-red-100">{user?.nombre}</p>
                  <p className="text-red-100 text-sm">{user?.email}</p>
                </div>
              </div>
              <button
    onClick={() => setShowPerfil(false)}
    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
  >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Estadísticas de Compras</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Productos Comprados</p>
                  </div>
                  <p className="text-4xl font-bold text-red-600 dark:text-red-400">{estadisticasCliente.totalProductos}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">unidades en total</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Pedidos Realizados</p>
                  </div>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{estadisticasCliente.totalPedidos}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">total de pedidos</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Producto Favorito</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">El más pedido por ti</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{estadisticasCliente.productoFavorito}</p>
                {estadisticasCliente.cantidadFavorito > 0 && <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    Lo has pedido {estadisticasCliente.cantidadFavorito} {estadisticasCliente.cantidadFavorito === 1 ? "vez" : "veces"}
                  </p>}
              </div>

              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-red-900/20 border border-orange-300 dark:border-orange-700 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Racha de Fidelidad</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Recompensa cada {estadisticasCliente.metaFidelidad} compras</p>
                  </div>
                  {estadisticasCliente.recompensasGanadas > 0 && <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow">
                      <Gift className="w-3.5 h-3.5" />
                      {estadisticasCliente.recompensasGanadas}
                    </div>}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: estadisticasCliente.metaFidelidad }).map((_, i) => <div
    key={i}
    className={`flex-1 h-3 rounded-full transition-all ${i < estadisticasCliente.rachaActual ? "bg-gradient-to-r from-orange-500 to-red-500 shadow" : "bg-orange-100 dark:bg-orange-900/40"}`}
  />)}
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                  {estadisticasCliente.rachaActual === 0 && estadisticasCliente.recompensasGanadas === 0 ? "\xA1Haz tu primera compra para iniciar tu racha!" : estadisticasCliente.faltanParaRecompensa === estadisticasCliente.metaFidelidad ? "\xA1Felicidades! Reclama tu recompensa \u{1F381}" : `Te ${estadisticasCliente.faltanParaRecompensa === 1 ? "falta" : "faltan"} ${estadisticasCliente.faltanParaRecompensa} ${estadisticasCliente.faltanParaRecompensa === 1 ? "compra" : "compras"} para tu pr\xF3xima recompensa \u{1F381}`}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total de Compra</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">en Chazin Food</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ${estadisticasCliente.totalGastado.toLocaleString()}
                  </p>
                </div>
              </div>

              <button
    onClick={() => setShowPerfil(false)}
    className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium"
  >
                Cerrar
              </button>
            </div>
          </div>
        </div>}

      {
    /* Modal de Checkout */
  }
      {showCheckout && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
            {
    /* Header */
  }
            <div className="sticky top-0 bg-gradient-to-r from-red-500 to-rose-600 p-5 flex items-center justify-between z-10 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-white">Finalizar Pedido</h3>
                <p className="text-red-100 text-sm">Completa los datos de entrega y pago</p>
              </div>
              <button
    onClick={() => setShowCheckout(false)}
    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
  >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {
    /* Resumen rápido con IVA */
  }
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <ShoppingCart className="w-4 h-4 text-red-500" />
                    Subtotal ({getTotalItems()} prod.)
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">${clientSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">IVA ({(CLIENT_IVA_RATE * 100).toFixed(0)}%)</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">${clientIVA.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-bold text-gray-800 dark:text-gray-100">Total</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">${clientTotal.toLocaleString()}</span>
                </div>
              </div>

              {
    /* Tipo de entrega */
  }
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-100 mb-3">
                  <Truck className="w-4 h-4 text-red-500" />
                  Tipo de Entrega
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
    { id: "domicilio", label: "Domicilio", icon: <Truck className="w-5 h-5" />, desc: "Llevamos tu pedido" },
    { id: "recoger", label: "Recoger en Local", icon: <Store className="w-5 h-5" />, desc: "Pasas a recogerlo" }
  ].map((tipo) => <button
    key={tipo.id}
    type="button"
    onClick={() => setCheckoutTipoEntrega(tipo.id)}
    className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 transition-all text-left ${checkoutTipoEntrega === tipo.id ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-700"}`}
  >
                      <div className="flex items-center gap-2 font-medium text-sm">
                        {tipo.icon}
                        {tipo.label}
                        {checkoutTipoEntrega === tipo.id && <CheckCircle className="w-4 h-4 ml-auto" />}
                      </div>
                      <span className="text-xs opacity-80">{tipo.desc}</span>
                    </button>)}
                </div>
              </div>

              {
    /* Datos de entrega */
  }
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-100 mb-3">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Datos de {checkoutTipoEntrega === "domicilio" ? "Entrega" : "Contacto"}
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del destinatario</label>
                    <input
    type="text"
    value={checkoutNombre}
    onChange={(e) => setCheckoutNombre(e.target.value)}
    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all"
    placeholder="Nombre completo"
  />
                  </div>
                  {checkoutTipoEntrega === "domicilio" ? <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Dirección de entrega <span className="text-red-500">*</span>
                      </label>
                      <input
    type="text"
    value={checkoutDireccion}
    onChange={(e) => setCheckoutDireccion(e.target.value)}
    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all"
    placeholder="Ej: Calle 45 #12-30, Apto 201"
  />
                    </div> : <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-sm text-blue-800 dark:text-blue-300">
                      📍 Recoger en: <strong>Chazin Food — Cra. 12 #45-67</strong>. Te notificaremos cuando esté listo.
                    </div>}
                </div>
              </div>

              {
    /* Método de pago */
  }
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-100 mb-3">
                  <CreditCard className="w-4 h-4 text-red-500" />
                  Método de Pago
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
    { id: "efectivo", label: "Efectivo", icon: <Banknote className="w-5 h-5" /> },
    { id: "tarjeta", label: "Tarjeta", icon: <CreditCard className="w-5 h-5" /> },
    { id: "transferencia", label: "Transferencia", icon: <Smartphone className="w-5 h-5" /> }
  ].map((metodo) => <button
    key={metodo.id}
    type="button"
    onClick={() => setCheckoutMetodoPago(metodo.id)}
    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all font-medium text-xs ${checkoutMetodoPago === metodo.id ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-700"}`}
  >
                      {metodo.icon}
                      {metodo.label}
                      {checkoutMetodoPago === metodo.id && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>)}
                </div>

                {
    /* Formulario Efectivo */
  }
                {checkoutMetodoPago === "efectivo" && <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl space-y-3">
                    <label className="block text-sm font-medium text-green-800 dark:text-green-300">
                      ¿Con cuánto vas a pagar? <span className="text-xs opacity-70">(opcional)</span>
                    </label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 w-4 h-4" />
                      <input
    type="number"
    min="0"
    value={checkoutEfectivoPaga}
    onChange={(e) => setCheckoutEfectivoPaga(e.target.value)}
    className="w-full pl-9 pr-3 py-2.5 border-2 border-green-200 dark:border-green-800 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none"
    placeholder="Ej: 50000"
  />
                    </div>
                    {checkoutEfectivoPaga && Number(checkoutEfectivoPaga) >= totalCheckout && <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-3 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Vuelto a entregar:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">${vueltoEfectivo.toLocaleString()}</span>
                      </div>}
                    {checkoutEfectivoPaga && Number(checkoutEfectivoPaga) < totalCheckout && <p className="text-xs text-red-600 dark:text-red-400">El monto es menor al total a pagar.</p>}
                  </div>}

                {
    /* Formulario Tarjeta */
  }
                {checkoutMetodoPago === "tarjeta" && <div className="mt-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">
                        Número de tarjeta <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 w-4 h-4" />
                        <input
    type="text"
    inputMode="numeric"
    maxLength={19}
    value={checkoutTarjetaNumero}
    onChange={(e) => {
      const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
      setCheckoutTarjetaNumero(raw.replace(/(.{4})/g, "$1 ").trim());
    }}
    className="w-full pl-9 pr-3 py-2.5 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none tracking-widest font-mono"
    placeholder="0000 0000 0000 0000"
  />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">
                        Monto a cargar
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 text-sm font-bold">$</span>
                        <input
    type="number"
    min="0"
    value={checkoutTarjetaMonto}
    onChange={(e) => setCheckoutTarjetaMonto(e.target.value)}
    className="w-full pl-7 pr-3 py-2.5 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none"
    placeholder={totalCheckout.toLocaleString()}
  />
                      </div>
                      {checkoutTarjetaMonto && Number(checkoutTarjetaMonto) > 0 && Number(checkoutTarjetaMonto) < totalCheckout && <p className="text-xs text-red-600 dark:text-red-400 mt-1">El monto es menor al total a pagar.</p>}
                    </div>
                  </div>}

                {
    /* Formulario Transferencia / Nequi / Daviplata */
  }
                {checkoutMetodoPago === "transferencia" && <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Entidad / Banco origen</label>
                      <select
    value={checkoutTransferBanco}
    onChange={(e) => setCheckoutTransferBanco(e.target.value)}
    className="w-full px-3 py-2.5 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
  >
                        <optgroup label="Billeteras digitales">
                          <option>Nequi</option>
                          <option>Daviplata</option>
                        </optgroup>
                        <optgroup label="Bancos">
                          <option>Bancolombia</option>
                          <option>Davivienda</option>
                          <option>BBVA</option>
                          <option>Banco de Bogotá</option>
                          <option>Banco Caja Social</option>
                          <option>Scotiabank Colpatria</option>
                          <option>Otro</option>
                        </optgroup>
                      </select>
                    </div>
                    {checkoutTransferBanco === "Nequi" || checkoutTransferBanco === "Daviplata" ? <p className="text-sm text-blue-800 dark:text-blue-300 bg-white/60 dark:bg-gray-800/60 rounded-lg px-3 py-2">
                        Envía a <strong>300 123 4567</strong> ({checkoutTransferBanco}) a nombre de <strong>Chazin Food</strong>.
                      </p> : <p className="text-sm text-blue-800 dark:text-blue-300 bg-white/60 dark:bg-gray-800/60 rounded-lg px-3 py-2">
                        Transfiere a <strong>Bancolombia Ahorros 123-456789-00</strong> a nombre de Chazin Food.
                      </p>}
                    <div>
                      <label className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                        Número de referencia <span className="text-red-500">*</span>
                      </label>
                      <input
    type="text"
    value={checkoutTransferReferencia}
    onChange={(e) => setCheckoutTransferReferencia(e.target.value)}
    className="w-full px-3 py-2.5 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
    placeholder="Ej: 987654321"
  />
                    </div>
                  </div>}
              </div>

              {
    /* Especificaciones */
  }
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-100 mb-3">
                  <FileText className="w-4 h-4 text-red-500" />
                  Especificaciones <span className="text-gray-400 font-normal text-xs">(opcional)</span>
                </h4>
                <textarea
    value={checkoutEspecificaciones}
    onChange={(e) => setCheckoutEspecificaciones(e.target.value)}
    rows={3}
    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all resize-none"
    placeholder="Ej: Sin cebolla, dejar en portería, tocar timbre..."
  />
              </div>

              {
    /* Total y confirmar */
  }
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between items-center text-xl">
                  <span className="font-bold text-gray-800 dark:text-gray-100">Total a pagar:</span>
                  <span className="font-bold text-red-600 dark:text-red-400">${clientTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                  {CLIENT_IVA_RATE > 0 ? "\u2713 Precio calculado con IVA incluido" : "\u2139 Precio sin IVA aplicado"}
                </p>
                <button
    onClick={handleConfirmarPedido}
    className="relative w-full py-4 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-red-500/40 transition-all overflow-hidden group"
  >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Confirmar Pedido
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                </button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* Modal de Mis Pedidos */
  }
      {showPedidos && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Mis Pedidos</h3>
              <button
    onClick={() => setShowPedidos(false)}
    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300 rounded-lg transition-colors"
  >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {pedidos.map((pedido) => <div key={pedido.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-lg text-gray-800 dark:text-gray-100">Pedido #{pedido.id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        {pedido.fecha}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {pedido.items.map((item, idx) => <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{item.cantidad}x {item.nombre}</span>
                        <span className="font-medium text-gray-800 dark:text-gray-100">${(item.cantidad * item.precio).toLocaleString()}</span>
                      </div>)}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                    <span className="font-bold text-gray-800 dark:text-gray-100">Total:</span>
                    <span className="font-bold text-red-600 dark:text-red-400 text-lg">${pedido.total.toLocaleString()}</span>
                  </div>
                </div>)}
            </div>
        </div>}

      {showEmptyCartLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-6">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingCart className="w-10 h-10 text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Tu carrito está vacío
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 px-2 leading-relaxed">
                Inicia sesión para agregar productos y realizar tu pedido.
              </p>
            </div>
            
            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  setShowEmptyCartLoginModal(false);
                  navigate("/login");
                }}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20 active:scale-[0.98]"
              >
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </button>
              
              <button
                onClick={() => setShowEmptyCartLoginModal(false)}
                className="w-full py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-all text-sm cursor-pointer"
              >
                Seguir explorando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>;
}

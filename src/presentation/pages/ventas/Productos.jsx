import { useState } from "react";
import { Plus, Search, Edit, Eye, AlertCircle, Star, Upload, X, Trash2, ChevronDown, Package, TrendingUp, CalendarDays, Zap, Clock, Tag, ArrowDownUp, Sparkles } from "lucide-react";
import { useNotifications } from "@/domain/hooks/useNotifications";
import { FichaTecnicaProducto } from "@/presentation/pages/fichasTecnicas/FichaTecnicaProducto";
import { Pagination } from "@/presentation/components/common/Pagination";
const inputCls = "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition";
const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
const productosDataInitial = [
  { idProducto: 1, nombre: "Hamburguesa Especial", idCategoriaProducto: 1, categoriaNombre: "Hamburguesas", precio: 15e3, costoProduccion: 8500, descripcion: "Hamburguesa con doble carne, queso, lechuga, tomate y salsas especiales", imagen: "\u{1F354}", stockActual: 25, vendidos: 245, estado: "Disponible" },
  { idProducto: 2, nombre: "Salchipapa Grande", idCategoriaProducto: 2, categoriaNombre: "Salchipapas", precio: 12e3, costoProduccion: 6500, descripcion: "Papas fritas con salchicha, salsas y queso gratinado", imagen: "\u{1F35F}", stockActual: 30, vendidos: 198, estado: "Disponible" },
  { idProducto: 3, nombre: "Perro Caliente Especial", idCategoriaProducto: 3, categoriaNombre: "Perros Calientes", precio: 1e4, costoProduccion: 5500, descripcion: "Hot dog con salchicha premium, salsas, papa chip y queso", imagen: "\u{1F32D}", stockActual: 20, vendidos: 167, estado: "Disponible" },
  { idProducto: 4, nombre: "Pollo Broaster", idCategoriaProducto: 4, categoriaNombre: "Pollo", precio: 18e3, costoProduccion: 1e4, descripcion: "Porci\xF3n de pollo broaster con papas y ensalada", imagen: "\u{1F357}", stockActual: 5, vendidos: 142, estado: "Bajo Stock" },
  { idProducto: 5, nombre: "Combo Familiar", idCategoriaProducto: 8, categoriaNombre: "Combos", precio: 45e3, costoProduccion: 25e3, descripcion: "2 hamburguesas, 1 salchipapa, papas y 4 bebidas", imagen: "\u{1F371}", stockActual: 15, vendidos: 89, estado: "Disponible" },
  { idProducto: 6, nombre: "Papas Fritas Medianas", idCategoriaProducto: 6, categoriaNombre: "Acompa\xF1amientos", precio: 6e3, costoProduccion: 2500, descripcion: "Papas fritas crujientes con sal", imagen: "\u{1F35F}", stockActual: 40, vendidos: 312, estado: "Disponible" }
];
const getEstadoBadge = (estado) => {
  switch (estado) {
    case "Agotado":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    case "Bajo Stock":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
    default:
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
  }
};
const tipoEventoConfig = {
  insumo_temporal: { label: "Insumo Temporal", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: <Clock className="w-3 h-3" /> },
  insumo_permanente: { label: "Insumo Permanente", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: <Package className="w-3 h-3" /> },
  promocion_precio: { label: "Promoci\xF3n Precio", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <Tag className="w-3 h-3" /> },
  descuento: { label: "Descuento", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: <ArrowDownUp className="w-3 h-3" /> }
};
export function Productos() {
  const notify = useNotifications();
  const [productosData, setProductosData] = useState(productosDataInitial);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("Todas las categor\xEDas");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [newProducto, setNewProducto] = useState({
    nombre: "",
    idCategoriaProducto: "",
    precio: "",
    estado: "Disponible",
    descripcion: "",
    fichaTecnica: null
  });
  const [editProducto, setEditProducto] = useState(null);
  const [adiciones, setAdiciones] = useState([]);
  const [salsas, setSalsas] = useState([]);
  const [acompanamientos, setAcompanamientos] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [expandedSections, setExpandedSections] = useState({ adiciones: false, salsas: false, acompanamientos: false, bebidas: false });
  const defaultAdiciones = [{ id: 1, nombre: "Queso extra", precio: 2e3 }, { id: 2, nombre: "Tocineta", precio: 3e3 }, { id: 3, nombre: "Carne extra", precio: 5e3 }];
  const defaultSalsas = [{ id: 1, nombre: "Salsa BBQ", precio: 1e3 }, { id: 2, nombre: "Salsa de la casa", precio: 0 }, { id: 3, nombre: "Salsa picante", precio: 500 }];
  const defaultAcompanamientos = [{ id: 1, nombre: "Papas fritas", precio: 4e3 }, { id: 2, nombre: "Ensalada", precio: 3500 }];
  const defaultBebidas = [{ id: 1, nombre: "Gaseosa 350ml", precio: 4e3 }, { id: 2, nombre: "Jugo natural", precio: 5e3 }];
  const [eventos, setEventos] = useState([]);
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [productoParaEvento, setProductoParaEvento] = useState(null);
  const [showEventosPanel, setShowEventosPanel] = useState(false);
  const [nextEventoId, setNextEventoId] = useState(1);
  const [eventosPanelTab, setEventosPanelTab] = useState("activos");
  const emptyEvento = {
    tipo: "insumo_temporal",
    titulo: "",
    descripcion: "",
    accion: "agregar",
    insumoNombre: "",
    insumoUnidad: "und",
    insumoCantidad: 1,
    precioNuevo: "",
    descuentoPct: "",
    esTemporal: true,
    fechaInicio: "",
    fechaFin: ""
  };
  const [formEvento, setFormEvento] = useState(emptyEvento);
  const getEventosActivos = (idProducto) => {
    const hoy = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    return eventos.filter((e) => {
      if (e.idProducto !== idProducto || !e.activo) return false;
      if (!e.esTemporal) return true;
      return (!e.fechaInicio || e.fechaInicio <= hoy) && (!e.fechaFin || e.fechaFin >= hoy);
    });
  };
  const handleGuardarEvento = () => {
    if (!productoParaEvento || !formEvento.titulo.trim()) return;
    const nuevo = {
      id: nextEventoId,
      idProducto: productoParaEvento.idProducto,
      nombreProducto: productoParaEvento.nombre,
      imagenProducto: productoParaEvento.imagen,
      tipo: formEvento.tipo,
      titulo: formEvento.titulo.trim(),
      descripcion: formEvento.descripcion.trim(),
      accion: formEvento.accion,
      insumoNombre: formEvento.insumoNombre.trim() || void 0,
      insumoUnidad: formEvento.insumoUnidad || void 0,
      insumoCantidad: formEvento.insumoCantidad || void 0,
      precioOriginal: productoParaEvento.precio,
      precioNuevo: formEvento.precioNuevo ? parseFloat(formEvento.precioNuevo) : void 0,
      descuentoPct: formEvento.descuentoPct ? parseFloat(formEvento.descuentoPct) : void 0,
      esTemporal: formEvento.esTemporal,
      fechaInicio: formEvento.fechaInicio || void 0,
      fechaFin: formEvento.fechaFin || void 0,
      fechaCreacion: /* @__PURE__ */ new Date(),
      activo: true
    };
    setEventos((prev) => [nuevo, ...prev]);
    setNextEventoId((n) => n + 1);
    setFormEvento(emptyEvento);
    setShowEventoModal(false);
    notify.success("Evento creado", `El evento "${nuevo.titulo}" fue registrado para ${productoParaEvento.nombre}`);
  };
  const desactivarEvento = (id) => {
    setEventos((prev) => prev.map((e) => e.id === id ? { ...e, activo: false } : e));
    notify.success("Evento desactivado", "El evento fue desactivado correctamente");
  };
  const openEdit = (p) => {
    setSelectedProducto(p);
    setEditProducto({ ...p });
    setAdiciones(p.adiciones ?? defaultAdiciones);
    setSalsas(p.salsas ?? defaultSalsas);
    setAcompanamientos(p.acompanamientos ?? defaultAcompanamientos);
    setBebidas(p.bebidas ?? defaultBebidas);
    setExpandedSections({ adiciones: false, salsas: false, acompanamientos: false, bebidas: false });
    setShowEditModal(true);
  };
  const closeEdit = () => {
    setShowEditModal(false);
    setSelectedProducto(null);
    setEditProducto(null);
  };
  const handleSaveNewProducto = async () => {
    if (!newProducto.nombre || !newProducto.idCategoriaProducto) return;
    const nextId = productosData.length ? Math.max(...productosData.map((p) => p.idProducto)) + 1 : 1;
    const categoriaNombres = { "1": "Hamburguesas", "2": "Salchipapas", "3": "Perros Calientes", "4": "Pollo", "5": "Bebidas", "6": "Acompa\xF1amientos", "7": "Postres", "8": "Combos" };
    const nuevoProducto = {
      idProducto: nextId,
      nombre: newProducto.nombre,
      idCategoriaProducto: parseInt(newProducto.idCategoriaProducto),
      categoriaNombre: categoriaNombres[newProducto.idCategoriaProducto] || "Sin Categor\xEDa",
      precio: parseFloat(newProducto.precio) || 0,
      costoProduccion: 0,
      descripcion: newProducto.descripcion,
      imagen: "\u{1F354}",
      stockActual: 0,
      vendidos: 0,
      estado: newProducto.estado,
      fichaTecnica: newProducto.fichaTecnica
    };
    setProductosData([...productosData, nuevoProducto]);
    setShowModal(false);
    setNewProducto({ nombre: "", idCategoriaProducto: "", precio: "", estado: "Disponible", descripcion: "", fichaTecnica: null });
    setImagePreview(null);
    notify.success("Producto creado", "El producto se agreg\xF3 correctamente");
  };
  const handleSaveEditProducto = async () => {
    if (!editProducto) return;
    const categoriaNombres = { "1": "Hamburguesas", "2": "Salchipapas", "3": "Perros Calientes", "4": "Pollo", "5": "Bebidas", "6": "Acompa\xF1amientos", "7": "Postres", "8": "Combos" };
    const updatedProducto = { ...editProducto, categoriaNombre: categoriaNombres[editProducto.idCategoriaProducto] || editProducto.categoriaNombre, adiciones, salsas, acompanamientos, bebidas };
    setProductosData(productosData.map((p) => p.idProducto === updatedProducto.idProducto ? updatedProducto : p));
    closeEdit();
    notify.success("Producto actualizado", "Los cambios se guardaron correctamente");
  };
  const updateItem = (list, setter, id, field, value) => {
    if (field === "nombre") {
      const dup = list.some((i) => i.id !== id && i.nombre.trim().toLowerCase() === value.trim().toLowerCase() && value.trim() !== "");
      if (dup) {
        notify.error("Nombre duplicado", "Ya existe un elemento con ese nombre en esta secci\xF3n");
        return;
      }
    }
    if (field === "precio") {
      const num = parseFloat(value);
      if (num < 0) {
        notify.error("Valor inv\xE1lido", "El precio no puede ser negativo");
        return;
      }
    }
    setter(list.map((i) => i.id === id ? { ...i, [field]: field === "precio" ? Math.max(0, Number(value) || 0) : value } : i));
  };
  const addItem = (list, setter) => {
    const nextId = list.length ? Math.max(...list.map((i) => i.id)) + 1 : 1;
    setter([...list, { id: nextId, nombre: "", precio: 0 }]);
  };
  const removeItem = (list, setter, id) => {
    setter(list.filter((i) => i.id !== id));
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [imagePreview, setImagePreview] = useState(null);
  const handleDelete = async (producto) => {
    const confirmed = await notify.confirmDelete("\xBFEliminar producto?", `\xBFEst\xE1s seguro de eliminar "${producto.nombre}"? Esta acci\xF3n no se puede deshacer.`);
    if (confirmed) {
      setProductosData(productosData.filter((p) => p.idProducto !== producto.idProducto));
      notify.success("Producto eliminado", "El producto se elimin\xF3 correctamente");
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const filtered = productosData.filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    const matchSearch = term === "" || p.nombre.toLowerCase().includes(term) || p.categoriaNombre.toLowerCase().includes(term);
    const matchCat = filterCategoria === "Todas las categor\xEDas" || p.categoriaNombre === filterCategoria;
    return matchSearch && matchCat;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filtered.slice(startIndex, startIndex + itemsPerPage);
  const masVendido = [...productosData].sort((a, b) => b.vendidos - a.vendidos)[0];
  const totalBajoStock = productosData.filter((p) => p.estado === "Bajo Stock" || p.estado === "Agotado").length;
  const totalVendidos = productosData.reduce((s, p) => s + p.vendidos, 0);
  const eventosActivosPorProducto = eventos.filter((e) => e.activo).reduce((acc, e) => {
    if (!acc[e.idProducto]) acc[e.idProducto] = [];
    acc[e.idProducto].push(e);
    return acc;
  }, {});
  return <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-full">

      {
    /* Header */
  }
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Productos</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Administra el menú y productos del negocio</p>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 lg:p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <Package className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Total Productos</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{productosData.length}</p>
            <p className="text-green-600 dark:text-green-400 text-xs mt-1 hidden sm:block">en catálogo</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-green-100 dark:bg-green-900/30 p-2.5 lg:p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <Star className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Más Vendido</p>
            <p className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{masVendido?.nombre}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 hidden sm:block">{masVendido?.vendidos} ventas</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-green-100 dark:bg-green-900/30 p-2.5 lg:p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Total Vendidos</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalVendidos}</p>
            <p className="text-green-600 dark:text-green-400 text-xs mt-1 hidden sm:block">unidades</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-red-100 dark:bg-red-900/30 p-2.5 lg:p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Bajo Stock</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalBajoStock}</p>
            <p className="text-red-600 dark:text-red-400 text-xs mt-1 hidden sm:block">requieren atención</p>
          </div>
        </div>
      </div>

      {
    /* Search & Filter Bar */
  }
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
    type="text"
    placeholder="Buscar producto..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
  />
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap">
            <select
    value={filterCategoria}
    onChange={(e) => {
      setFilterCategoria(e.target.value);
      setCurrentPage(1);
    }}
    className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
  >
              <option>Todas las categorías</option>
              <option>Hamburguesas</option>
              <option>Salchipapas</option>
              <option>Perros Calientes</option>
              <option>Pollo</option>
              <option>Bebidas</option>
              <option>Acompañamientos</option>
              <option>Combos</option>
            </select>
            {
    /* Eventos button */
  }
            <button
    onClick={() => setShowEventosPanel(true)}
    className="relative flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:scale-95 transition-all font-medium text-sm shadow-sm whitespace-nowrap"
  >
              <Sparkles className="w-4 h-4" />
              <span>Eventos</span>
              {eventos.filter((e) => e.activo).length > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {eventos.filter((e) => e.activo).length}
                </span>}
            </button>
            <button
    onClick={() => setShowModal(true)}
    className="flex items-center gap-2 px-4 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-red-600 active:scale-95 transition-all font-medium text-sm shadow-sm whitespace-nowrap"
  >
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* Products Grid */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4">
        {currentProducts.map((producto) => <div
    key={producto.idProducto}
    className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
  >
            {
    /* Image area */
  }
            <div className="relative bg-gradient-to-br from-[#F05454] to-red-700 h-44 flex items-center justify-center shrink-0">
              <span className="text-7xl select-none">{producto.imagen}</span>
              <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoBadge(producto.estado)}`}>
                {producto.estado}
              </span>
              {producto.vendidos > 150 && <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  Popular
                </div>}
              {getEventosActivos(producto.idProducto).length > 0 && <div className="absolute bottom-3 left-3 bg-purple-600 text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                  <Zap className="w-3 h-3 fill-current" />
                  {getEventosActivos(producto.idProducto).length} evento{getEventosActivos(producto.idProducto).length !== 1 ? "s" : ""}
                </div>}
            </div>

            {
    /* Body */
  }
            <div className="p-4 flex flex-col flex-1">
              <div className="mb-2">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 leading-snug">{producto.nombre}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{producto.categoriaNombre}</p>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1">{producto.descripcion}</p>

              {
    /* Stats row */
  }
              <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700/60">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Precio</p>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">${(producto.precio / 1e3).toFixed(0)}k</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Vendidos</p>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{producto.vendidos}</p>
                </div>
              </div>

              {
    /* Event button row */
  }
              <button
    onClick={() => {
      setProductoParaEvento(producto);
      setFormEvento(emptyEvento);
      setShowEventoModal(true);
    }}
    className="w-full flex items-center justify-center gap-1.5 py-2 mb-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors border border-purple-200 dark:border-purple-800/40"
  >
                <Zap className="w-4 h-4" />
                <span>Crear Evento</span>
              </button>

              {
    /* Actions */
  }
              <div className="flex gap-1.5">
                <button
    onClick={() => {
      setSelectedProducto(producto);
      setShowDetailModal(true);
    }}
    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
  >
                  <Eye className="w-4 h-4" />
                  <span>Ver</span>
                </button>
                <button
    onClick={() => openEdit(producto)}
    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors"
  >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
    onClick={() => handleDelete(producto)}
    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
  >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>)}

        {currentProducts.length === 0 && <div className="col-span-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-10 text-center text-sm text-gray-500 dark:text-gray-400">
            No se encontraron productos.
          </div>}
      </div>

      {
    /* Pagination */
  }
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 px-4">
        <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
    itemsPerPage={itemsPerPage}
    totalItems={filtered.length}
    onItemsPerPageChange={setItemsPerPage}
  />
      </div>

      {
    /* ── New Product Modal ── */
  }
      {showModal && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Nuevo Producto</h2>
              <button onClick={() => {
    setShowModal(false);
    setNewProducto({ nombre: "", idCategoriaProducto: "", precio: "", estado: "Disponible", descripcion: "", fichaTecnica: null });
    setImagePreview(null);
  }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {
    /* Image upload */
  }
              <div>
                <label className={labelCls}>Imagen del Producto</label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-red-400 dark:hover:border-red-500 transition-colors">
                  {imagePreview ? <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                      <button onClick={() => {
    setImagePreview(null);
  }} className="absolute top-2 right-2 p-2 bg-[#F05454] text-white rounded-full hover:bg-red-600 transition-colors shadow-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div> : <label className="flex flex-col items-center cursor-pointer gap-2">
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Haz clic para subir una imagen</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG hasta 5MB</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Nombre del Producto</label>
                  <input type="text" value={newProducto.nombre} onChange={(e) => setNewProducto({ ...newProducto, nombre: e.target.value })} className={inputCls} placeholder="Ej: Hamburguesa Especial" />
                </div>
                <div>
                  <label className={labelCls}>Categoría (idCategoriaProducto)</label>
                  <select value={newProducto.idCategoriaProducto} onChange={(e) => setNewProducto({ ...newProducto, idCategoriaProducto: e.target.value })} className={inputCls}>
                    <option value="">Seleccionar...</option>
                    <option value="1">Hamburguesas</option><option value="2">Salchipapas</option>
                    <option value="3">Perros Calientes</option><option value="4">Pollo</option>
                    <option value="5">Bebidas</option><option value="6">Acompañamientos</option>
                    <option value="7">Postres</option><option value="8">Combos</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Precio de Venta</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input type="number" value={newProducto.precio} onChange={(e) => setNewProducto({ ...newProducto, precio: e.target.value })} className={`${inputCls} pl-7`} placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Estado</label>
                  <select value={newProducto.estado} onChange={(e) => setNewProducto({ ...newProducto, estado: e.target.value })} className={inputCls}>
                    <option>Disponible</option><option>No Disponible</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Descripción</label>
                  <textarea value={newProducto.descripcion} onChange={(e) => setNewProducto({ ...newProducto, descripcion: e.target.value })} className={`${inputCls} resize-none`} rows={3} placeholder="Describe el producto..." />
                </div>
              </div>

              <FichaTecnicaProducto initialData={null} onSave={(data) => setNewProducto({ ...newProducto, fichaTecnica: data })} />
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button onClick={() => {
    setShowModal(false);
    setNewProducto({ nombre: "", idCategoriaProducto: "", precio: "", estado: "Disponible", descripcion: "", fichaTecnica: null });
    setImagePreview(null);
  }} className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancelar</button>
              <button onClick={handleSaveNewProducto} className="px-6 py-2.5 bg-[#F05454] text-white rounded-xl text-sm hover:bg-red-600 transition-colors font-medium">Guardar Producto</button>
            </div>
          </div>
        </div>}

      {
    /* ── Edit Product Modal ── */
  }
      {showEditModal && selectedProducto && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Editar Producto</h2>
              <button onClick={closeEdit} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex items-center justify-center gap-4">
                <span className="text-5xl">{selectedProducto.imagen}</span>
                <label className="flex flex-col items-center cursor-pointer gap-1">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Cambiar imagen</span>
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Nombre del Producto</label>
                  <input type="text" value={editProducto?.nombre || ""} onChange={(e) => setEditProducto({ ...editProducto, nombre: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Categoría (idCategoriaProducto)</label>
                  <select value={editProducto?.idCategoriaProducto || ""} onChange={(e) => setEditProducto({ ...editProducto, idCategoriaProducto: parseInt(e.target.value) })} className={inputCls}>
                    <option value="1">Hamburguesas</option><option value="2">Salchipapas</option>
                    <option value="3">Perros Calientes</option><option value="4">Pollo</option>
                    <option value="5">Bebidas</option><option value="6">Acompañamientos</option>
                    <option value="7">Postres</option><option value="8">Combos</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Precio de Venta</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input type="number" value={editProducto?.precio || 0} onChange={(e) => setEditProducto({ ...editProducto, precio: parseFloat(e.target.value) || 0 })} className={`${inputCls} pl-7`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Costo de Producción (costoProduccion)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input type="number" value={editProducto?.costoProduccion || 0} onChange={(e) => setEditProducto({ ...editProducto, costoProduccion: parseFloat(e.target.value) || 0 })} className={`${inputCls} pl-7`} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Estado</label>
                  <select value={editProducto?.estado || "Disponible"} onChange={(e) => setEditProducto({ ...editProducto, estado: e.target.value })} className={inputCls}>
                    <option>Disponible</option><option>Bajo Stock</option>
                    <option>Agotado</option><option>No Disponible</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Descripción</label>
                  <textarea value={editProducto?.descripcion || ""} onChange={(e) => setEditProducto({ ...editProducto, descripcion: e.target.value })} className={`${inputCls} resize-none`} rows={3} />
                </div>
              </div>

              {
    /* Personalización sections */
  }
              {[
    { title: "Adiciones de Ingredientes", list: adiciones, setter: setAdiciones, key: "adiciones" },
    { title: "Salsas", list: salsas, setter: setSalsas, key: "salsas" },
    { title: "Acompa\xF1amientos", list: acompanamientos, setter: setAcompanamientos, key: "acompanamientos" },
    { title: "Bebidas", list: bebidas, setter: setBebidas, key: "bebidas" }
  ].map((section) => {
    const isExpanded = expandedSections[section.key];
    return <div key={section.title} className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <button
      type="button"
      onClick={() => setExpandedSections((prev) => ({ ...prev, [section.key]: !prev[section.key] }))}
      className="w-full flex items-center justify-between mb-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors"
    >
                      <div className="flex items-center gap-2">
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{section.title}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({section.list.length})</span>
                      </div>
                      <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        addItem(section.list, section.setter);
        if (!isExpanded) setExpandedSections((prev) => ({ ...prev, [section.key]: true }));
      }}
      className="flex items-center gap-1 px-3 py-1.5 bg-[#F05454] text-white rounded-xl hover:bg-red-600 transition-colors text-xs font-medium"
    >
                        <Plus className="w-3.5 h-3.5" /> Agregar
                      </button>
                    </button>
                    <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                      {section.list.length === 0 ? <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-3 pl-2">Sin elementos. Haz clic en "Agregar" para añadir uno.</p> : <div className="space-y-2 mb-3">
                          {section.list.map((item) => <div key={item.id} className="flex gap-2 items-center">
                              <input type="text" value={item.nombre} onChange={(e) => updateItem(section.list, section.setter, item.id, "nombre", e.target.value)} placeholder="Nombre" className={`${inputCls} flex-1`} />
                              <div className="relative w-32 shrink-0">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                                <input type="number" min={0} value={item.precio} onChange={(e) => updateItem(section.list, section.setter, item.id, "precio", e.target.value)} placeholder="0" className={`${inputCls} pl-7`} />
                              </div>
                              <button type="button" onClick={() => removeItem(section.list, section.setter, item.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors shrink-0">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>)}
                        </div>}
                    </div>
                  </div>;
  })}

              <FichaTecnicaProducto
    productId={selectedProducto.idProducto}
    productName={selectedProducto.nombre}
    initialData={editProducto?.fichaTecnica || selectedProducto.fichaTecnica || null}
    onSave={(data) => setEditProducto({ ...editProducto, fichaTecnica: data })}
  />
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button onClick={closeEdit} className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancelar</button>
              <button onClick={handleSaveEditProducto} className="px-6 py-2.5 bg-[#F05454] text-white rounded-xl text-sm hover:bg-red-600 transition-colors font-medium">Guardar Cambios</button>
            </div>
          </div>
        </div>}

      {
    /* ── Product Detail Modal ── */
  }
      {showDetailModal && selectedProducto && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {
    /* Hero */
  }
            <div className="relative bg-gradient-to-br from-[#F05454] to-red-700 h-52 flex items-center justify-center rounded-t-2xl">
              <span className="text-8xl select-none">{selectedProducto.imagen}</span>
              <button
    onClick={() => {
      setShowDetailModal(false);
      setSelectedProducto(null);
    }}
    className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/80 p-2 rounded-full hover:bg-white transition-colors shadow"
  >
                <X className="w-4 h-4 text-gray-700 dark:text-gray-200" />
              </button>
              <span className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(selectedProducto.estado)}`}>
                {selectedProducto.estado}
              </span>
            </div>

            <div className="p-6 space-y-5">
              {
    /* Title */
  }
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{selectedProducto.nombre}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{selectedProducto.categoriaNombre}</p>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300">{selectedProducto.descripcion}</p>

              {
    /* Financial grid */
  }
              <div className="grid grid-cols-2 gap-3">
                {[
    { label: "Precio de Venta", value: `$${selectedProducto.precio.toLocaleString()}`, sub: null, color: "text-gray-800 dark:text-gray-100" },
    { label: "Costo de Producci\xF3n", value: `$${selectedProducto.costoProduccion.toLocaleString()}`, sub: null, color: "text-gray-600 dark:text-gray-300" },
    { label: "Margen de Ganancia", value: `$${(selectedProducto.precio - selectedProducto.costoProduccion).toLocaleString()}`, sub: `${Math.round((selectedProducto.precio - selectedProducto.costoProduccion) / selectedProducto.precio * 100)}%`, color: "text-green-600 dark:text-green-400" },
    { label: "Total Vendidos", value: `${selectedProducto.vendidos} uds`, sub: `$${(selectedProducto.vendidos * selectedProducto.precio).toLocaleString()} ingresos`, color: "text-gray-800 dark:text-gray-100" }
  ].map((item) => <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                    <p className={`font-bold text-lg ${item.color}`}>{item.value}</p>
                    {item.sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.sub}</p>}
                  </div>)}
              </div>

            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button
    onClick={() => {
      setShowDetailModal(false);
      setSelectedProducto(null);
    }}
    className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
  >
                Cerrar
              </button>
            </div>
          </div>
        </div>}

      {
    /* ── Crear Evento Modal ── */
  }
      {showEventoModal && productoParaEvento && <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {
    /* Header */
  }
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{productoParaEvento.imagen}</span>
                <div>
                  <h2 className="text-lg font-bold text-white">Crear Evento</h2>
                  <p className="text-purple-200 text-sm">{productoParaEvento.nombre}</p>
                </div>
              </div>
              <button onClick={() => setShowEventoModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {
    /* Body */
  }
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {
    /* Event type selector */
  }
              <div>
                <label className={labelCls}>Tipo de Evento</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(tipoEventoConfig).map(([key, cfg]) => <button
    key={key}
    type="button"
    onClick={() => setFormEvento((prev) => ({ ...prev, tipo: key, esTemporal: key === "insumo_temporal" || key === "promocion_precio" || key === "descuento" }))}
    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${formEvento.tipo === key ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-700"}`}
  >
                      <span className={`p-1.5 rounded-lg ${cfg.color}`}>{cfg.icon}</span>
                      {cfg.label}
                    </button>)}
                </div>
              </div>

              {
    /* Title */
  }
              <div>
                <label className={labelCls}>Título del Evento <span className="text-red-500">*</span></label>
                <input
    type="text"
    value={formEvento.titulo}
    onChange={(e) => setFormEvento((prev) => ({ ...prev, titulo: e.target.value }))}
    className={inputCls}
    placeholder="Ej: Temporada de verano — carne extra incluida"
  />
              </div>

              {
    /* Description */
  }
              <div>
                <label className={labelCls}>Descripción</label>
                <textarea
    value={formEvento.descripcion}
    onChange={(e) => setFormEvento((prev) => ({ ...prev, descripcion: e.target.value }))}
    className={`${inputCls} resize-none`}
    rows={2}
    placeholder="Describe brevemente este evento..."
  />
              </div>

              {
    /* Conditional fields: insumo */
  }
              {(formEvento.tipo === "insumo_temporal" || formEvento.tipo === "insumo_permanente") && <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Detalle del Insumo</p>
                  <div>
                    <label className={labelCls}>Acción</label>
                    <div className="flex gap-3">
                      {["agregar", "eliminar"].map((accion) => <label key={accion} className="flex items-center gap-2 cursor-pointer">
                          <input
    type="radio"
    checked={formEvento.accion === accion}
    onChange={() => setFormEvento((prev) => ({ ...prev, accion }))}
    className="accent-purple-600"
  />
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{accion}</span>
                        </label>)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className={labelCls}>Nombre del Insumo</label>
                      <input
    type="text"
    value={formEvento.insumoNombre}
    onChange={(e) => setFormEvento((prev) => ({ ...prev, insumoNombre: e.target.value }))}
    className={inputCls}
    placeholder="Ej: Carne extra"
  />
                    </div>
                    <div>
                      <label className={labelCls}>Cantidad</label>
                      <input
    type="number"
    min={0}
    value={formEvento.insumoCantidad}
    onChange={(e) => setFormEvento((prev) => ({ ...prev, insumoCantidad: parseFloat(e.target.value) || 0 }))}
    className={inputCls}
  />
                    </div>
                    <div>
                      <label className={labelCls}>Unidad</label>
                      <select
    value={formEvento.insumoUnidad}
    onChange={(e) => setFormEvento((prev) => ({ ...prev, insumoUnidad: e.target.value }))}
    className={inputCls}
  >
                        <option value="und">und</option>
                        <option value="gr">gr</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="lt">lt</option>
                        <option value="oz">oz</option>
                      </select>
                    </div>
                  </div>
                </div>}

              {
    /* Conditional fields: precio */
  }
              {formEvento.tipo === "promocion_precio" && <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Detalle del Precio</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Precio original:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">${productoParaEvento.precio.toLocaleString()}</span>
                  </div>
                  <div>
                    <label className={labelCls}>Nuevo Precio Promocional</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
    type="number"
    min={0}
    value={formEvento.precioNuevo}
    onChange={(e) => setFormEvento((prev) => ({ ...prev, precioNuevo: e.target.value }))}
    className={`${inputCls} pl-7`}
    placeholder="0"
  />
                    </div>
                  </div>
                </div>}

              {
    /* Conditional fields: descuento */
  }
              {formEvento.tipo === "descuento" && <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Detalle del Descuento</p>
                  <div>
                    <label className={labelCls}>Porcentaje de Descuento (%)</label>
                    <div className="relative">
                      <input
    type="number"
    min={1}
    max={100}
    value={formEvento.descuentoPct}
    onChange={(e) => setFormEvento((prev) => ({ ...prev, descuentoPct: e.target.value }))}
    className={`${inputCls} pr-8`}
    placeholder="10"
  />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                    {formEvento.descuentoPct && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Precio resultante: ${Math.round(productoParaEvento.precio * (1 - parseFloat(formEvento.descuentoPct) / 100)).toLocaleString()}
                      </p>}
                  </div>
                </div>}

              {
    /* Temporal toggle */
  }
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Evento Temporal</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Activo solo en un rango de fechas</p>
                </div>
                <button
    type="button"
    onClick={() => setFormEvento((prev) => ({ ...prev, esTemporal: !prev.esTemporal }))}
    className={`w-12 h-6 rounded-full transition-colors relative ${formEvento.esTemporal ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"}`}
  >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formEvento.esTemporal ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>

              {
    /* Date range */
  }
              {formEvento.esTemporal && <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>
                      <CalendarDays className="w-3.5 h-3.5 inline mr-1" />
                      Fecha de Inicio
                    </label>
                    <input
    type="date"
    value={formEvento.fechaInicio}
    onChange={(e) => setFormEvento((prev) => ({ ...prev, fechaInicio: e.target.value }))}
    className={inputCls}
  />
                  </div>
                  <div>
                    <label className={labelCls}>
                      <CalendarDays className="w-3.5 h-3.5 inline mr-1" />
                      Fecha de Fin
                    </label>
                    <input
    type="date"
    value={formEvento.fechaFin}
    onChange={(e) => setFormEvento((prev) => ({ ...prev, fechaFin: e.target.value }))}
    className={inputCls}
  />
                  </div>
                </div>}
            </div>

            {
    /* Footer */
  }
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 shrink-0">
              <button
    onClick={() => setShowEventoModal(false)}
    className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
  >
                Cancelar
              </button>
              <button
    onClick={handleGuardarEvento}
    disabled={!formEvento.titulo.trim()}
    className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
  >
                <Zap className="w-4 h-4" />
                Crear Evento
              </button>
            </div>
          </div>
        </div>}

      {
    /* ── Eventos Panel Modal ── */
  }
      {showEventosPanel && <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {
    /* Header */
  }
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-xl">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Versionamiento de Fichas Técnicas</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{eventos.length} eventos registrados</p>
                </div>
              </div>
              <button onClick={() => setShowEventosPanel(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {
    /* Tabs */
  }
            <div className="px-6 pt-4 flex gap-1 shrink-0">
              <button
    onClick={() => setEventosPanelTab("activos")}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${eventosPanelTab === "activos" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
  >
                Eventos Activos
                {eventos.filter((e) => e.activo).length > 0 && <span className="ml-2 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">{eventos.filter((e) => e.activo).length}</span>}
              </button>
              <button
    onClick={() => setEventosPanelTab("historial")}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${eventosPanelTab === "historial" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
  >
                Historial Completo
                {eventos.length > 0 && <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-1.5 py-0.5 rounded-full">{eventos.length}</span>}
              </button>
            </div>

            {
    /* Content */
  }
            <div className="p-6 overflow-y-auto flex-1">
              {eventosPanelTab === "activos" && <>
                  {Object.keys(eventosActivosPorProducto).length === 0 ? <div className="text-center py-12">
                      <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No hay eventos activos actualmente.</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Crea un evento desde cualquier producto.</p>
                    </div> : <div className="space-y-6">
                      {Object.entries(eventosActivosPorProducto).map(([idProducto, evs]) => {
    const p = productosData.find((x) => x.idProducto === parseInt(idProducto));
    return <div key={idProducto}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">{evs[0].imagenProducto}</span>
                              <h3 className="font-bold text-gray-800 dark:text-gray-100">{evs[0].nombreProducto}</h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400">({evs.length} evento{evs.length !== 1 ? "s" : ""})</span>
                            </div>
                            <div className="space-y-3 pl-2">
                              {evs.map((evento) => <EventoCard key={evento.id} evento={evento} onDesactivar={desactivarEvento} />)}
                            </div>
                          </div>;
  })}
                    </div>}
                </>}

              {eventosPanelTab === "historial" && <>
                  {eventos.length === 0 ? <div className="text-center py-12">
                      <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CalendarDays className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No hay eventos registrados.</p>
                    </div> : <div className="space-y-3">
                      {eventos.map((evento) => <div key={evento.id} className="relative">
                          <div className="absolute left-0 top-3 w-px h-full bg-gray-100 dark:bg-gray-800 ml-4" />
                          <EventoCard evento={evento} onDesactivar={desactivarEvento} showDate />
                        </div>)}
                    </div>}
                </>}
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end shrink-0">
              <button
    onClick={() => setShowEventosPanel(false)}
    className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
  >
                Cerrar
              </button>
            </div>
          </div>
        </div>}
    </div>;
}
function EventoCard({ evento, onDesactivar, showDate }) {
  const cfg = tipoEventoConfig[evento.tipo];
  const actionPill = () => {
    if (evento.tipo === "insumo_temporal" || evento.tipo === "insumo_permanente") {
      if (!evento.insumoNombre) return null;
      const sign = evento.accion === "agregar" ? "+" : "-";
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
          {sign} {evento.insumoNombre} {evento.insumoCantidad}{evento.insumoUnidad}
        </span>;
    }
    if (evento.tipo === "promocion_precio" && evento.precioNuevo) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
          ${evento.precioOriginal?.toLocaleString()} → ${evento.precioNuevo.toLocaleString()}
        </span>;
    }
    if (evento.tipo === "descuento" && evento.descuentoPct) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
          -{evento.descuentoPct}% descuento
        </span>;
    }
    return null;
  };
  return <div className={`bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border ${evento.activo ? "border-gray-100 dark:border-gray-700" : "border-gray-100 dark:border-gray-700 opacity-60"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {showDate && <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{evento.imagenProducto}</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{evento.nombreProducto}</span>
            </div>}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
              {cfg.icon}
              {cfg.label}
            </span>
            {!evento.activo && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                Inactivo
              </span>}
            {evento.esTemporal && (evento.fechaInicio || evento.fechaFin) && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                <Clock className="w-3 h-3" />
                {evento.fechaInicio && evento.fechaFin ? `${evento.fechaInicio} \u2013 ${evento.fechaFin}` : evento.fechaInicio ? `Desde ${evento.fechaInicio}` : `Hasta ${evento.fechaFin}`}
              </span>}
          </div>
          <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{evento.titulo}</p>
          {evento.descripcion && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{evento.descripcion}</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {actionPill()}
          </div>
          {showDate && <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Creado {evento.fechaCreacion.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
            </p>}
        </div>
        {evento.activo && <button
    onClick={() => onDesactivar(evento.id)}
    className="shrink-0 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl transition-colors"
  >
            Desactivar
          </button>}
      </div>
    </div>;
}

import { useState } from "react";
import { Plus, Search, Edit, Eye, Mail, Phone, MapPin, Star, ShoppingBag, X, Trash2, Calendar, Clock, TrendingUp, Users } from "lucide-react";
import { Pagination } from "@/presentation/components/common/Pagination";
import { useNotifications } from "@/domain/hooks/useNotifications";
const inputCls = "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition";
const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
const clientesData = [
  { idCliente: 1, nombre: "Juan Carlos P\xE9rez", email: "juan.perez@email.com", telefono: "319 123 4567", direccion: "Calle 50 #45-30, Bel\xE9n, Medell\xEDn", totalCompras: 45, totalGastado: 68e4, ultimaCompra: "2026-05-27", fidelidad: "VIP", descuento: 15 },
  { idCliente: 2, nombre: "Mar\xEDa Garc\xEDa L\xF3pez", email: "maria.garcia@email.com", telefono: "300 234 5678", direccion: "Carrera 80 #21-15, Bel\xE9n, Medell\xEDn", totalCompras: 32, totalGastado: 52e4, ultimaCompra: "2026-05-26", fidelidad: "Frecuente", descuento: 10 },
  { idCliente: 3, nombre: "Carlos L\xF3pez Mart\xEDnez", email: "carlos.lopez@email.com", telefono: "311 345 6789", direccion: "Calle 33 #70-25, Bel\xE9n, Medell\xEDn", totalCompras: 28, totalGastado: 45e4, ultimaCompra: "2026-05-25", fidelidad: "Frecuente", descuento: 10 },
  { idCliente: 4, nombre: "Ana Mart\xEDnez Rodr\xEDguez", email: "ana.martinez@email.com", telefono: "314 456 7890", direccion: "Carrera 76 #30-45, Bel\xE9n, Medell\xEDn", totalCompras: 18, totalGastado: 28e4, ultimaCompra: "2026-05-24", fidelidad: "Regular", descuento: 5 },
  { idCliente: 5, nombre: "Luis Rodr\xEDguez G\xF3mez", email: "luis.rodriguez@email.com", telefono: "320 567 8901", direccion: "Calle 10 #80-50, Bel\xE9n, Medell\xEDn", totalCompras: 52, totalGastado: 85e4, ultimaCompra: "2026-05-27", fidelidad: "VIP", descuento: 15 },
  { idCliente: 6, nombre: "Sandra G\xF3mez P\xE9rez", email: "sandra.gomez@email.com", telefono: "301 678 9012", direccion: "Carrera 65 #25-80, Bel\xE9n, Medell\xEDn", totalCompras: 8, totalGastado: 12e4, ultimaCompra: "2026-05-20", fidelidad: "Nuevo", descuento: 0 }
];
const productosMuestra = ["Hamburguesa Especial", "Salchipapa Grande", "Perro Caliente Especial", "Pollo Broaster", "Combo Familiar", "Papas Fritas Medianas"];
function calcularFrecuencia(totalCompras) {
  const porMes = totalCompras / 12;
  let etiqueta = "Espor\xE1dico";
  if (porMes >= 4) etiqueta = "Muy frecuente";
  else if (porMes >= 2) etiqueta = "Frecuente";
  else if (porMes >= 1) etiqueta = "Mensual";
  return { porMes: porMes.toFixed(1), etiqueta };
}
function generarHistorial(cliente) {
  const ultima = new Date(cliente.ultimaCompra);
  const ticketPromedio = Math.round(cliente.totalGastado / Math.max(1, cliente.totalCompras));
  return Array.from({ length: Math.min(5, cliente.totalCompras) }).map((_, i) => {
    const fecha = new Date(ultima);
    fecha.setDate(fecha.getDate() - i * 7);
    const variacion = (cliente.idCliente + i) % 5 * 1500 - 3e3;
    return {
      id: `T-${cliente.idCliente}-${1e3 + i}`,
      fecha: fecha.toISOString().slice(0, 10),
      producto: productosMuestra[(cliente.idCliente + i) % productosMuestra.length],
      total: ticketPromedio + variacion
    };
  });
}
const getFidelidadBadge = (fidelidad) => {
  switch (fidelidad) {
    case "VIP":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
    case "Frecuente":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "Regular":
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
  }
};
const getAvatarGradient = (fidelidad) => {
  switch (fidelidad) {
    case "VIP":
      return "from-purple-400 to-purple-600";
    case "Frecuente":
      return "from-blue-400 to-blue-600";
    case "Regular":
      return "from-green-400 to-green-600";
    default:
      return "from-gray-400 to-gray-600";
  }
};
export function Clientes() {
  const notify = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFidelidad, setFilterFidelidad] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const openEdit = (c) => {
    setSelectedCliente(c);
    setShowEditModal(true);
  };
  const closeEdit = () => {
    setShowEditModal(false);
    setSelectedCliente(null);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const handleDelete = async (cliente) => {
    const confirmed = await notify.confirmDelete("\xBFEliminar cliente?", `\xBFEst\xE1s seguro de eliminar a "${cliente.nombre}"? Esta acci\xF3n no se puede deshacer.`);
    if (confirmed) notify.success("Cliente eliminado", "El cliente se elimin\xF3 correctamente");
  };
  const filtered = clientesData.filter((c) => {
    const term = searchTerm.trim().toLowerCase();
    const matchSearch = term === "" || c.nombre.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || c.telefono.includes(term);
    const matchFid = filterFidelidad === "Todos" || c.fidelidad === filterFidelidad;
    return matchSearch && matchFid;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClientes = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalVIP = clientesData.filter((c) => c.fidelidad === "VIP").length;
  const totalFrecuente = clientesData.filter((c) => c.fidelidad === "Frecuente").length;
  const totalNuevo = clientesData.filter((c) => c.fidelidad === "Nuevo").length;
  return <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-full">

      {
    /* Header */
  }
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Clientes</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Administra la base de datos de clientes</p>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 lg:p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Total Clientes</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{clientesData.length}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 hidden sm:block">registrados</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 lg:p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <Star className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Clientes VIP</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalVIP}</p>
            <p className="text-purple-600 dark:text-purple-400 text-xs mt-1 hidden sm:block">con descuento</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-green-100 dark:bg-green-900/30 p-2.5 lg:p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Frecuentes</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalFrecuente}</p>
            <p className="text-green-600 dark:text-green-400 text-xs mt-1 hidden sm:block">activos</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-green-100 dark:bg-green-900/30 p-2.5 lg:p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Nuevos</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalNuevo}</p>
            <p className="text-green-600 dark:text-green-400 text-xs mt-1 hidden sm:block">este mes</p>
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
    placeholder="Buscar cliente..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
  />
          </div>
          <div className="flex gap-2 shrink-0">
            <select
    value={filterFidelidad}
    onChange={(e) => {
      setFilterFidelidad(e.target.value);
      setCurrentPage(1);
    }}
    className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
  >
              <option>Todos</option>
              <option>VIP</option>
              <option>Frecuente</option>
              <option>Regular</option>
              <option>Nuevo</option>
            </select>
            <button
    onClick={() => setShowModal(true)}
    className="flex items-center gap-2 px-4 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-red-600 active:scale-95 transition-all font-medium text-sm shadow-sm whitespace-nowrap"
  >
              <Plus className="w-4 h-4" />
              <span>Nuevo Cliente</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* Client Cards Grid */
  }
      {/* Vista de tabla desktop */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200 dark:border-gray-700">
              {["ID", "Cliente", "Teléfono", "Email", "Compras", "Total Gastado", "Tipo", "Estado", "Acciones"].map((h) => (
                <th key={h} className="pb-3 pr-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {currentClientes.map((cliente) => (
              <tr key={cliente.idCliente} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="py-3 pr-4 font-mono font-medium text-gray-800 dark:text-gray-200">
                  #{cliente.idCliente}
                </td>
                <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 bg-gradient-to-br ${getAvatarGradient(cliente.fidelidad)} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {cliente.nombre.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-100 leading-snug">{cliente.nombre}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{cliente.direccion}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{cliente.telefono}</td>
                <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{cliente.email}</td>
                <td className="py-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                  {cliente.totalCompras}
                </td>
                <td className="py-3 pr-4 font-bold text-gray-800 dark:text-gray-100">
                  ${cliente.totalGastado.toLocaleString("es-CO")}
                </td>
                <td className="py-3 pr-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${getFidelidadBadge(cliente.fidelidad)}`}>
                    {cliente.fidelidad}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    Activo
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedCliente(cliente);
                        setShowDetailModal(true);
                      }}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(cliente)}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentClientes.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-500 dark:text-gray-400">
            No se encontraron clientes.
          </div>
        )}
      </div>

      {/* Vista de tarjetas móvil */}
      <div className="md:hidden space-y-3 mb-4">
        {currentClientes.map((cliente) => (
          <div key={cliente.idCliente} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(cliente.fidelidad)} rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0`}>
                  {cliente.nombre.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate leading-snug">{cliente.nombre}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">ID: #{cliente.idCliente}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${getFidelidadBadge(cliente.fidelidad)}`}>
                {cliente.fidelidad}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-gray-100 dark:border-gray-700/60">
              <div>
                <p className="text-gray-400 dark:text-gray-500">Email</p>
                <p className="font-medium text-gray-700 dark:text-gray-300 truncate">{cliente.email}</p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Gastado</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">${(cliente.totalGastado / 1e3).toFixed(0)}K</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                {cliente.totalCompras} compras · Activo
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedCliente(cliente);
                    setShowDetailModal(true);
                  }}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Eye className="w-4 h-4" /> Ver
                </button>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <button
                  onClick={() => openEdit(cliente)}
                  className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  <Edit className="w-4 h-4" /> Editar
                </button>
              </div>
            </div>
          </div>
        ))}
        {currentClientes.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-10 text-center text-sm text-gray-500 dark:text-gray-400">
            No se encontraron clientes.
          </div>
        )}
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
    /* ── New Client Modal ── */
  }
      {showModal && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Nuevo Cliente</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Nombre Completo</label>
                <input type="text" className={inputCls} placeholder="Ej: Juan Pérez" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" className={inputCls} placeholder="email@ejemplo.com" />
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input type="tel" className={inputCls} placeholder="319 000 0000" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Dirección</label>
                <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Calle/Carrera # - , Barrio, Ciudad" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nivel de Fidelidad</label>
                  <select className={inputCls}>
                    <option>Nuevo</option>
                    <option>Regular</option>
                    <option>Frecuente</option>
                    <option>VIP</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Descuento (%)</label>
                  <input type="number" className={inputCls} placeholder="0" min="0" max="100" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancelar</button>
              <button className="px-6 py-2.5 bg-[#F05454] text-white rounded-xl text-sm hover:bg-red-600 transition-colors font-medium">Guardar Cliente</button>
            </div>
          </div>
        </div>}

      {
    /* ── Edit Client Modal ── */
  }
      {showEditModal && selectedCliente && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(selectedCliente.fidelidad)} rounded-2xl flex items-center justify-center text-white font-bold shrink-0`}>
                  {selectedCliente.nombre.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Editar Cliente</h2>
              </div>
              <button onClick={closeEdit} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Nombre Completo</label>
                <input type="text" defaultValue={selectedCliente.nombre} className={inputCls} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" defaultValue={selectedCliente.email} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input type="tel" defaultValue={selectedCliente.telefono} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Dirección</label>
                <textarea defaultValue={selectedCliente.direccion} className={`${inputCls} resize-none`} rows={2} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nivel de Fidelidad</label>
                  <select defaultValue={selectedCliente.fidelidad} className={inputCls}>
                    <option>Nuevo</option>
                    <option>Regular</option>
                    <option>Frecuente</option>
                    <option>VIP</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Descuento (%)</label>
                  <input type="number" defaultValue={selectedCliente.descuento} className={inputCls} min="0" max="100" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button onClick={closeEdit} className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancelar</button>
              <button className="px-6 py-2.5 bg-[#F05454] text-white rounded-xl text-sm hover:bg-red-600 transition-colors font-medium">Guardar Cambios</button>
            </div>
          </div>
        </div>}

      {
    /* ── Client Detail Modal ── */
  }
      {showDetailModal && selectedCliente && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {
    /* Header */
  }
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarGradient(selectedCliente.fidelidad)} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0`}>
                  {selectedCliente.nombre.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{selectedCliente.nombre}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cliente #{selectedCliente.idCliente}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFidelidadBadge(selectedCliente.fidelidad)}`}>
                  {selectedCliente.fidelidad}
                </span>
                <button onClick={() => {
    setShowDetailModal(false);
    setSelectedCliente(null);
  }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {
    /* Contact info */
  }
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Información de Contacto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
    { icon: Mail, label: "Email", value: selectedCliente.email },
    { icon: Phone, label: "Tel\xE9fono", value: selectedCliente.telefono },
    { icon: MapPin, label: "Direcci\xF3n", value: selectedCliente.direccion, full: true }
  ].map((item) => <div key={item.label} className={`bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 flex items-start gap-2.5 ${item.full ? "sm:col-span-2" : ""}`}>
                      <item.icon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{item.value}</p>
                      </div>
                    </div>)}
                </div>
              </div>

              {
    /* Purchase stats */
  }
              <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Estadísticas de Compra</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-3 text-center">
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Compras</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{selectedCliente.totalCompras}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-3 text-center">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-1">Total Gastado</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">${(selectedCliente.totalGastado / 1e3).toFixed(0)}K</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-3 text-center">
                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Ticket Promedio</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">${(Math.round(selectedCliente.totalGastado / selectedCliente.totalCompras) / 1e3).toFixed(0)}K</p>
                  </div>
                </div>
              </div>

              {
    /* Frequency */
  }
              <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Frecuencia de Consumo</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1.5 min-h-[80px]">
                    <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-tight">Compras / mes</p>
                    <p className="font-bold text-base text-amber-700 dark:text-amber-300 leading-none">{calcularFrecuencia(selectedCliente.totalCompras).porMes}</p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1.5 min-h-[80px]">
                    <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-tight">Tipo</p>
                    <p className="font-bold text-sm text-indigo-700 dark:text-indigo-300 leading-snug">{calcularFrecuencia(selectedCliente.totalCompras).etiqueta}</p>
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1.5 min-h-[80px]">
                    <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <p className="text-xs text-teal-700 dark:text-teal-400 leading-tight">Última compra</p>
                    <p className="font-bold text-sm text-teal-700 dark:text-teal-300 leading-snug">{new Date(selectedCliente.ultimaCompra).toLocaleDateString("es-CO")}</p>
                  </div>
                </div>
              </div>

              {
    /* Transaction history */
  }
              <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Historial de Transacciones</h3>
                <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">N° Trans.</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fecha</th>
                        <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Producto</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {generarHistorial(selectedCliente).map((t) => <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{t.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{new Date(t.fecha).toLocaleDateString("es-CO")}</td>
                          <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t.producto}</td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-gray-100">${t.total.toLocaleString()}</td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Mostrando las últimas {Math.min(5, selectedCliente.totalCompras)} de {selectedCliente.totalCompras} transacciones.
                </p>
              </div>

              {
    /* Active benefits */
  }
              <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Beneficios Activos</h3>
                  {selectedCliente.descuento > 0 && <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold">
                      {selectedCliente.descuento}% de descuento
                    </span>}
                </div>
                <div className="bg-gradient-to-r from-[#F05454]/10 to-red-100/60 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-800/40 rounded-2xl p-4 flex items-center gap-3">
                  <div className="bg-[#F05454]/10 dark:bg-red-900/30 p-2.5 rounded-xl shrink-0">
                    <Star className="w-5 h-5 text-[#F05454] dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-100">Cliente {selectedCliente.fidelidad}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Última compra: {new Date(selectedCliente.ultimaCompra).toLocaleDateString("es-CO")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button
    onClick={() => {
      setShowDetailModal(false);
      setSelectedCliente(null);
    }}
    className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
  >
                Cerrar
              </button>
            </div>
          </div>
        </div>}
    </div>;
}

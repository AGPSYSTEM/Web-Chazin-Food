import { useState } from "react";
import { Plus, Search, Eye, XCircle, FileText, Calendar, User, Edit, X, Lock, Package, Trash2, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { Pagination } from "@/presentation/components/common/Pagination";
import { useAuth } from "@/domain/state/AuthContext";
import { useNotifications } from "@/domain/hooks/useNotifications";
const comprasData = [
  { idCompra: 1, numeroCompra: "C-2026-001", fecha: "2026-05-27", idProveedor: 1, proveedorNombre: "FruVer SA", items: 5, total: 245e3, estado: "Completada", idUsuario: 1, usuarioNombre: "Admin" },
  { idCompra: 2, numeroCompra: "C-2026-002", fecha: "2026-05-26", idProveedor: 2, proveedorNombre: "Carnes Premium", items: 3, total: 58e4, estado: "Completada", idUsuario: 2, usuarioNombre: "Maria G." },
  { idCompra: 3, numeroCompra: "C-2026-003", fecha: "2026-05-25", idProveedor: 4, proveedorNombre: "L\xE1cteos del Valle", items: 4, total: 32e4, estado: "Pendiente", idUsuario: 1, usuarioNombre: "Admin" },
  { idCompra: 4, numeroCompra: "C-2026-004", fecha: "2026-05-25", idProveedor: 3, proveedorNombre: "Av\xEDcola del Sur", items: 2, total: 45e4, estado: "Completada", idUsuario: 3, usuarioNombre: "Carlos L." },
  { idCompra: 5, numeroCompra: "C-2026-005", fecha: "2026-05-24", idProveedor: 5, proveedorNombre: "Panader\xEDa El Trigo", items: 6, total: 185e3, estado: "Anulada", idUsuario: 1, usuarioNombre: "Admin" },
  { idCompra: 6, numeroCompra: "C-2026-006", fecha: "2026-05-24", idProveedor: 1, proveedorNombre: "FruVer SA", items: 8, total: 39e4, estado: "Completada", idUsuario: 2, usuarioNombre: "Maria G." }
];
const detalleCompra = [
  { insumo: "Tomate", cantidad: 20, unidad: "kg", precio: 3500, subtotal: 7e4 },
  { insumo: "Lechuga", cantidad: 15, unidad: "und", precio: 2e3, subtotal: 3e4 },
  { insumo: "Papas", cantidad: 30, unidad: "kg", precio: 4e3, subtotal: 12e4 },
  { insumo: "Cebolla", cantidad: 10, unidad: "kg", precio: 2500, subtotal: 25e3 }
];
export function GestionCompras() {
  const { user } = useAuth();
  const { success, confirmAction } = useNotifications();
  const isAdmin = user?.rol?.toLowerCase() === "administrador";
  const [compras, setCompras] = useState(comprasData);
  const handleAnular = async (compra) => {
    const confirmed = await confirmAction(
      "Anular compra",
      `\xBFSeguro que deseas anular la compra ${compra.numeroCompra}? Esta acci\xF3n quedar\xE1 registrada.`,
      "Anular"
    );
    if (!confirmed) return;
    setCompras((list) => list.map((c) => c.idCompra === compra.idCompra ? { ...c, estado: "Anulada" } : c));
    success("Compra anulada", `${compra.numeroCompra} fue marcada como anulada`);
  };
  const [proveedoresList] = useState([
    { id: 1, nombre: "FruVer SA" },
    { id: 2, nombre: "Carnes Premium" },
    { id: 3, nombre: "Av\xEDcola del Sur" },
    { id: 4, nombre: "L\xE1cteos del Valle" },
    { id: 5, nombre: "Panader\xEDa El Trigo" },
    { id: 6, nombre: "Distribuidora Andina" }
  ]);
  const UNIDADES = ["Unidad", "Kilogramo", "Gramo", "Litro", "Mililitro", "Caja", "Paquete", "Bolsa"];
  const INSUMOS_DISPONIBLES = ["Tomate", "Lechuga", "Papas", "Cebolla", "Carne de Res", "Pollo", "Queso Mozzarella", "Salchicha Premium", "Pan Hamburguesa", "Coca Cola", "Mayonesa", "Salsa BBQ"];
  const emptyForm = { proveedorId: "", fecha: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), observaciones: "" };
  const [formCompra, setFormCompra] = useState(emptyForm);
  const [itemsCompra, setItemsCompra] = useState([]);
  const [nextItemId, setNextItemId] = useState(1);
  const addItemCompra = () => {
    setItemsCompra((prev) => [...prev, { id: nextItemId, insumo: INSUMOS_DISPONIBLES[0], cantidad: 1, unidad: "Kilogramo", precioUnitario: 0 }]);
    setNextItemId((n) => n + 1);
  };
  const removeItemCompra = (id) => setItemsCompra((prev) => prev.filter((i) => i.id !== id));
  const updateItemCompra = (id, field, value) => {
    setItemsCompra((prev) => prev.map((i) => i.id === id ? { ...i, [field]: value } : i));
  };
  const handleGuardarCompra = () => {
    if (!formCompra.proveedorId) return;
    if (itemsCompra.length === 0) return;
    const proveedor = proveedoresList.find((p) => String(p.id) === formCompra.proveedorId);
    const nextId = compras.length ? Math.max(...compras.map((c) => c.idCompra)) + 1 : 1;
    const nextNum = `C-2026-${String(nextId).padStart(3, "0")}`;
    const nuevaCompra = {
      idCompra: nextId,
      numeroCompra: nextNum,
      fecha: formCompra.fecha,
      idProveedor: Number(formCompra.proveedorId),
      proveedorNombre: proveedor?.nombre ?? "Desconocido",
      items: itemsCompra.length,
      total: totalItems,
      estado: "Pendiente",
      idUsuario: 1,
      usuarioNombre: "Admin"
    };
    setCompras((prev) => [nuevaCompra, ...prev]);
    setShowModal(false);
    setFormCompra(emptyForm);
    setItemsCompra([]);
    setIvaCompra(0);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [ivaCompra, setIvaCompra] = useState(0);
  const subtotalItems = itemsCompra.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0);
  const ivaMontoItems = Math.round(subtotalItems * (ivaCompra / 100));
  const totalItems = subtotalItems + ivaMontoItems;
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const openEdit = (c) => {
    setSelectedCompra(c);
    setShowEditModal(true);
  };
  const closeEdit = () => {
    setShowEditModal(false);
    setSelectedCompra(null);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const filteredCompras = compras.filter((c) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = term === "" || c.numeroCompra.toLowerCase().includes(term) || c.proveedorNombre.toLowerCase().includes(term) || c.usuarioNombre.toLowerCase().includes(term);
    const matchesEstado = filterEstado === "Todos" || c.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });
  const totalPages = Math.max(1, Math.ceil(filteredCompras.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCompras = filteredCompras.slice(startIndex, startIndex + itemsPerPage);
  const totalGastoCompras = compras.filter((c) => c.estado === "Completada").reduce((s, c) => s + c.total, 0);
  const ticketPromedioCompra = compras.filter((c) => c.estado === "Completada").length > 0
    ? Math.round(totalGastoCompras / compras.filter((c) => c.estado === "Completada").length)
    : 0;
  const insumoMayorGastoVal = "Carne de Res";
  const subInsumoMayorGasto = "$725.000 acum.";
  const insumosBajoStockVal = "5 insumos";
  const insumosProxVencerVal = "2 insumos";

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "Completada":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "Pendiente":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "Anulada":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
    }
  };
  return <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-full">

      {
    /* Header */
  }
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Compras</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Administra las órdenes de compra del negocio</p>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        {[
          { icon: <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-100 dark:bg-blue-900/30", label: "Gasto Total en Compras", value: `$${totalGastoCompras.toLocaleString("es-CO")}`, sub: "órdenes completadas", subCls: "text-gray-500 dark:text-gray-400" },
          { icon: <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-100 dark:bg-blue-900/30", label: "Ticket Promedio de Compra", value: `$${ticketPromedioCompra.toLocaleString("es-CO")}`, sub: "valor medio", subCls: "text-gray-500 dark:text-gray-400" },
          { icon: <Package className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-100 dark:bg-blue-900/30", label: "Mayor Gasto Acumulado", value: insumoMayorGastoVal, sub: subInsumoMayorGasto, subCls: "text-gray-500 dark:text-gray-400" },
          { icon: <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400" />, bg: "bg-red-100 dark:bg-red-900/30", label: "Bajo Stock Mínimo", value: insumosBajoStockVal, sub: "reabastecimiento", subCls: "text-red-600 dark:text-red-400" },
          { icon: <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600 dark:text-yellow-400" />, bg: "bg-yellow-100 dark:bg-yellow-900/30", label: "Próximos a Vencer", value: insumosProxVencerVal, sub: "alerta de mermas", subCls: "text-yellow-600 dark:text-yellow-400" }
        ].map((card) => <div key={card.label} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
            <div className={`${card.bg} p-2.5 lg:p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3`}>
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5 leading-tight">{card.label}</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 leading-none truncate">{card.value}</p>
              <p className={`${card.subCls} text-xs mt-1 hidden sm:block`}>{card.sub}</p>
            </div>
          </div>)}
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
    placeholder="Buscar compra..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
  />
          </div>
          <div className="flex gap-2 shrink-0">
            <select
    value={filterEstado}
    onChange={(e) => {
      setFilterEstado(e.target.value);
      setCurrentPage(1);
    }}
    className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
  >
              <option value="Todos">Todos los estados</option>
              <option value="Completada">Completada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Anulada">Anulada</option>
            </select>
            <button
    onClick={() => {
      setIvaCompra(0);
      setShowModal(true);
    }}
    className="flex items-center gap-2 px-4 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-red-600 active:scale-95 transition-all font-medium text-sm shadow-sm whitespace-nowrap"
  >
              <Plus className="w-4 h-4" />
              <span>Nueva Compra</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* Purchase Cards — mobile */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 lg:hidden">
        {currentCompras.map((compra) => <div
    key={compra.idCompra}
    className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden hover:shadow-md transition-shadow"
  >
            <div className="p-4">
              {
    /* Top row */
  }
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl shrink-0">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{compra.numeroCompra}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{compra.proveedorNombre}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${getEstadoBadge(compra.estado)}`}>
                  {compra.estado}
                </span>
              </div>

              {
    /* Info grid */
  }
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5">
                  <p className="text-gray-500 dark:text-gray-400 mb-0.5">Fecha</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{new Date(compra.fecha).toLocaleDateString("es-CO")}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5">
                  <p className="text-gray-500 dark:text-gray-400 mb-0.5">Items</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold">
                    {compra.items}
                  </span>
                </div>
              </div>

              {
    /* Total + user */
  }
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  <p className="font-bold text-gray-800 dark:text-gray-100">${compra.total.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <User className="w-3 h-3" />
                  <span>{compra.usuarioNombre}</span>
                </div>
              </div>
            </div>

            {
    /* Footer actions */
  }
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700/60 flex gap-1">
              <button
    onClick={() => {
      setSelectedCompra(compra);
      setShowDetailModal(true);
    }}
    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
    title="Ver detalles"
  >
                <Eye className="w-3.5 h-3.5" /> Ver
              </button>
              {compra.estado === "Pendiente" && <button
    onClick={() => openEdit(compra)}
    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors"
    title="Editar compra"
  >
                  <Edit className="w-3.5 h-3.5" /> Editar
                </button>}
              {compra.estado !== "Anulada" && (isAdmin ? <button
    onClick={() => handleAnular(compra)}
    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
    title="Anular compra"
  >
                    <XCircle className="w-3.5 h-3.5" /> Anular
                  </button> : <span
    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-gray-300 dark:text-gray-700 cursor-not-allowed"
    title="Solo el administrador puede anular compras"
  >
                    <Lock className="w-3.5 h-3.5" />
                  </span>)}
            </div>
          </div>)}
        {currentCompras.length === 0 && <div className="col-span-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-10 text-center text-sm text-gray-500 dark:text-gray-400">
            No se encontraron compras.
          </div>}
      </div>

      {
    /* Purchase Table — desktop */
  }
      <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">N° Compra</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Proveedor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Items</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {currentCompras.map((compra) => <tr key={compra.idCompra} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg shrink-0">
                        <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{compra.numeroCompra}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      {new Date(compra.fecha).toLocaleDateString("es-CO")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">{compra.proveedorNombre}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold">
                      {compra.items}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-100">
                    ${compra.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      {compra.usuarioNombre}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoBadge(compra.estado)}`}>
                      {compra.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
    onClick={() => {
      setSelectedCompra(compra);
      setShowDetailModal(true);
    }}
    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
    title="Ver detalles"
  >
                        <Eye className="w-4 h-4" />
                      </button>
                      {compra.estado === "Pendiente" && <button
    onClick={() => openEdit(compra)}
    className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors"
    title="Editar compra"
  >
                          <Edit className="w-4 h-4" />
                        </button>}
                      {compra.estado !== "Anulada" && (isAdmin ? <button
    onClick={() => handleAnular(compra)}
    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
    title="Anular compra"
  >
                            <XCircle className="w-4 h-4" />
                          </button> : <span
    className="p-2 text-gray-300 dark:text-gray-700 cursor-not-allowed inline-flex"
    title="Solo el administrador puede anular compras"
  >
                            <Lock className="w-4 h-4" />
                          </span>)}
                    </div>
                  </td>
                </tr>)}
              {currentCompras.length === 0 && <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No se encontraron compras.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700/60 px-6">
          <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
    itemsPerPage={itemsPerPage}
    totalItems={filteredCompras.length}
    onItemsPerPageChange={setItemsPerPage}
  />
        </div>
      </div>

      {
    /* Pagination — mobile */
  }
      <div className="lg:hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 px-4">
        <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
    itemsPerPage={itemsPerPage}
    totalItems={filteredCompras.length}
    onItemsPerPageChange={setItemsPerPage}
  />
      </div>

      {
    /* Edit Modal */
  }
      {showEditModal && selectedCompra && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Editar Compra</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{selectedCompra.numeroCompra}</p>
              </div>
              <button onClick={closeEdit} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proveedor</label>
                <select defaultValue={selectedCompra.proveedorNombre} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition">
                  <option>FruVer SA</option>
                  <option>Carnes Premium</option>
                  <option>Avícola del Sur</option>
                  <option>Lácteos del Valle</option>
                  <option>Panadería El Trigo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha</label>
                <input type="date" defaultValue={selectedCompra.fecha} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
                <select defaultValue={selectedCompra.estado} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition">
                  <option>Pendiente</option>
                  <option>Completada</option>
                  <option>Anulada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observaciones</label>
                <textarea className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none" rows={3} placeholder="Notas adicionales..." />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button onClick={closeEdit} className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancelar</button>
              <button className="px-6 py-2.5 bg-[#F05454] text-white rounded-xl text-sm hover:bg-red-600 transition-colors font-medium">Guardar Cambios</button>
            </div>
          </div>
        </div>}

      {
    /* Nueva Compra Modal */
  }
      {showModal && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col">
            {
    /* Header */
  }
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Nueva Compra</h2>
              <button onClick={() => {
    setShowModal(false);
    setFormCompra(emptyForm);
    setItemsCompra([]);
    setIvaCompra(0);
  }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {
    /* Proveedor + Fecha */
  }
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proveedor <span className="text-red-500">*</span></label>
                  <select
    value={formCompra.proveedorId}
    onChange={(e) => setFormCompra((f) => ({ ...f, proveedorId: e.target.value }))}
    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
  >
                    <option value="">Seleccionar proveedor...</option>
                    {proveedoresList.map((p) => <option key={p.id} value={String(p.id)}>{p.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha</label>
                  <input
    type="date"
    value={formCompra.fecha}
    onChange={(e) => setFormCompra((f) => ({ ...f, fecha: e.target.value }))}
    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
  />
                </div>
              </div>

              {
    /* Items de Compra */
  }
              <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">Insumos a Comprar <span className="text-red-500">*</span></h3>
                  <button
    type="button"
    onClick={addItemCompra}
    className="flex items-center gap-2 px-4 py-2 bg-[#30475E] text-white rounded-xl hover:bg-[#253a4e] transition-colors text-sm font-medium"
  >
                    <Plus className="w-4 h-4" /> Agregar Insumo
                  </button>
                </div>

                {itemsCompra.length === 0 ? <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-8 text-center">
                    <Package className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Haz clic en "Agregar Insumo" para añadir productos a esta compra</p>
                  </div> : <div className="space-y-3">
                    {
    /* Header tabla */
  }
                    <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] gap-3 px-3">
                      {["Insumo", "Cantidad", "Unidad", "Precio Unit.", "Subtotal", ""].map((h) => <span key={h} className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</span>)}
                    </div>

                    {itemsCompra.map((item) => <div key={item.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] gap-3 items-center">
                        {
    /* Insumo */
  }
                        <select
    value={item.insumo}
    onChange={(e) => updateItemCompra(item.id, "insumo", e.target.value)}
    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
  >
                          {INSUMOS_DISPONIBLES.map((ins) => <option key={ins} value={ins}>{ins}</option>)}
                        </select>
                        {
    /* Cantidad */
  }
                        <input
    type="number"
    min="0"
    value={item.cantidad}
    onChange={(e) => updateItemCompra(item.id, "cantidad", Math.max(0, Number(e.target.value) || 0))}
    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
  />
                        {
    /* Unidad */
  }
                        <select
    value={item.unidad}
    onChange={(e) => updateItemCompra(item.id, "unidad", e.target.value)}
    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
  >
                          {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                        {
    /* Precio unitario */
  }
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                          <input
    type="number"
    min="0"
    value={item.precioUnitario}
    onChange={(e) => updateItemCompra(item.id, "precioUnitario", Math.max(0, Number(e.target.value) || 0))}
    className="w-full pl-7 pr-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
  />
                        </div>
                        {
    /* Subtotal (read-only) */
  }
                        <div className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-100">
                          ${(item.cantidad * item.precioUnitario).toLocaleString()}
                        </div>
                        {
    /* Eliminar */
  }
                        <button
    type="button"
    onClick={() => removeItemCompra(item.id)}
    className="w-9 h-9 flex items-center justify-center text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
  >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>)}
                  </div>}
              </div>

              {
    /* Observaciones */
  }
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Observaciones <span className="text-gray-400 dark:text-gray-500 text-xs font-normal">(opcional)</span>
                </label>
                <textarea
                  value={formCompra.observaciones}
                  onChange={(e) => setFormCompra((f) => ({ ...f, observaciones: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#30475E]/40 focus:border-transparent outline-none transition resize-none"
                  placeholder="Notas adicionales sobre esta compra..."
                />
              </div>

              {
    /* Resumen */
  }
              <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/60 p-5 space-y-4 shadow-sm">
                  <p className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 pb-1.5 border-b border-gray-200/60 dark:border-gray-700/40">Resumen Financiero</p>
                  
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Cantidad de insumos</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100 bg-gray-200/50 dark:bg-gray-700 px-2 py-0.5 rounded-lg text-xs">{itemsCompra.length} {itemsCompra.length !== 1 ? "ítems" : "ítem"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal base</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">${subtotalItems.toLocaleString("es-CO")}</span>
                    </div>

                    {/* IVA Configurator */}
                    <div className="py-2 border-t border-b border-gray-200/50 dark:border-gray-700/40 space-y-2">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Configurar IVA</span>
                        <div className="flex items-center gap-2">
                          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-xs bg-white dark:bg-gray-900 p-0.5">
                            {[0, 19].map((pct) => (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => setIvaCompra(pct)}
                                className={`px-3 py-1 rounded-md font-bold transition-all ${ivaCompra === pct ? "bg-[#30475E] text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                              >
                                {pct}%
                              </button>
                            ))}
                          </div>
                          <div className="relative w-20">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={ivaCompra}
                              onChange={(e) => setIvaCompra(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                              className="w-full pl-2 pr-6 py-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-xs text-right outline-none focus:ring-2 focus:ring-[#30475E]/40 font-bold"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none font-bold">%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Impuesto IVA ({ivaCompra}%)</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">${ivaMontoItems.toLocaleString("es-CO")}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="font-extrabold text-sm text-gray-800 dark:text-gray-100 block">Total Neto</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 block leading-tight">Valor de facturación</span>
                    </div>
                    <span className="font-black text-2xl text-[#F05454] dark:text-red-400 font-mono tracking-tight">${totalItems.toLocaleString("es-CO")}</span>
                  </div>
                </div>
              </div>
            </div>

            {
    /* Footer */
  }
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 shrink-0">
              <button
    onClick={() => {
      setShowModal(false);
      setFormCompra(emptyForm);
      setItemsCompra([]);
      setIvaCompra(0);
    }}
    className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
  >Cancelar</button>
              <button
    onClick={handleGuardarCompra}
    disabled={!formCompra.proveedorId || itemsCompra.length === 0}
    className="px-6 py-2.5 bg-[#F05454] text-white rounded-xl text-sm hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
  >
                Guardar Compra
              </button>
            </div>
          </div>
        </div>}

      {
    /* Detalle Modal */
  }
      {showDetailModal && selectedCompra && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Detalle de Compra</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{selectedCompra.numeroCompra}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadge(selectedCompra.estado)}`}>
                  {selectedCompra.estado}
                </span>
                <button onClick={() => {
    setShowDetailModal(false);
    setSelectedCompra(null);
  }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {
    /* Meta grid */
  }
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
    { label: "Proveedor", value: selectedCompra.proveedorNombre },
    { label: "Fecha", value: new Date(selectedCompra.fecha).toLocaleDateString("es-CO") },
    { label: "Usuario", value: selectedCompra.usuarioNombre },
    { label: "Total Items", value: selectedCompra.items }
  ].map((meta) => <div key={meta.label} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{meta.label}</p>
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{meta.value}</p>
                  </div>)}
              </div>

              {
    /* Items detail */
  }
              <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" /> Detalles de Items
                </h3>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 overflow-x-auto">
                  <table className="w-full min-w-[420px]">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">Insumo</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">Cantidad</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">Precio unit.</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {detalleCompra.map((item, index) => <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{item.insumo}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right whitespace-nowrap">{item.cantidad} {item.unidad}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right whitespace-nowrap">${item.precio.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 text-right whitespace-nowrap">${item.subtotal.toLocaleString()}</td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>

              {
    /* Total */
  }
              <div className="flex justify-end">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl px-6 py-4 flex items-center justify-between gap-8">
                  <span className="font-bold text-gray-800 dark:text-gray-100">Total:</span>
                  <span className="font-bold text-xl text-gray-800 dark:text-gray-100">${selectedCompra.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button
    onClick={() => {
      setShowDetailModal(false);
      setSelectedCompra(null);
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

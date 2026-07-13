import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Eye,
  X,
  CheckCircle,
  Calendar,
  Download,
  BarChart2,
  Clock,
  ChevronDown,
  Users
} from "lucide-react";
import { IVA_RATE } from "@/domain/state/CartContext";
const calcularIVA = (base) => Math.round(base * IVA_RATE);
const tipoEntregaLabel = {
  mesa: { label: "En Mesa", icon: "\u{1F37D}\uFE0F" },
  domicilio: { label: "Domicilio", icon: "\u{1F6F5}" },
  recoger: { label: "Recoger", icon: "\u{1F3EA}" }
};
const metodoPagoLabel = {
  efectivo: "\u{1F4B5} Efectivo",
  tarjeta: "\u{1F4B3} Tarjeta",
  transferencia: "\u{1F4F2} Transferencia"
};
const pedidosMock = [
  {
    id: "PED-001",
    cliente: "Juan Garc\xEDa",
    fecha: "2026-06-09",
    hora: "12:30",
    horaFin: "12:45",
    estado: "pagado",
    metodoPago: "efectivo",
    tipoEntrega: "domicilio",
    subtotal: 28e3,
    descuento: 0,
    total: 28e3,
    detalle: [
      { nombre: "Hamburguesa Especial", cantidad: 1, precio: 15e3, adiciones: ["Queso Extra", "Salsa BBQ"] },
      { nombre: "Coca Cola", cantidad: 1, precio: 3e3 },
      { nombre: "Papas Fritas", cantidad: 2, precio: 6e3 }
    ]
  },
  {
    id: "PED-002",
    cliente: "Mar\xEDa L\xF3pez",
    fecha: "2026-06-09",
    hora: "13:05",
    horaFin: "13:20",
    estado: "pagado",
    metodoPago: "tarjeta",
    tipoEntrega: "mesa",
    subtotal: 45e3,
    descuento: 10,
    total: 40500,
    detalle: [
      { nombre: "Combo Familiar", cantidad: 1, precio: 45e3 }
    ]
  },
  {
    id: "PED-003",
    cliente: "Carlos P\xE9rez",
    fecha: "2026-06-09",
    hora: "13:45",
    horaFin: "14:00",
    estado: "pagado",
    metodoPago: "efectivo",
    tipoEntrega: "recoger",
    subtotal: 22e3,
    descuento: 0,
    total: 22e3,
    detalle: [
      { nombre: "Pollo Broaster", cantidad: 1, precio: 18e3, adiciones: ["Salsa Picante"] },
      { nombre: "Sprite", cantidad: 1, precio: 3e3 }
    ]
  },
  {
    id: "PED-004",
    cliente: "Ana Mart\xEDnez",
    fecha: "2026-06-08",
    hora: "11:20",
    horaFin: "11:35",
    estado: "pagado",
    metodoPago: "tarjeta",
    tipoEntrega: "domicilio",
    subtotal: 2e4,
    descuento: 5,
    total: 19e3,
    detalle: [
      { nombre: "Perro Caliente", cantidad: 1, precio: 1e4, adiciones: ["Salsa de Ajo"] },
      { nombre: "Salchipapa Grande", cantidad: 1, precio: 12e3 }
    ]
  },
  {
    id: "PED-005",
    cliente: "Luis Rodr\xEDguez",
    fecha: "2026-06-08",
    hora: "14:15",
    horaFin: "14:30",
    estado: "pagado",
    metodoPago: "efectivo",
    tipoEntrega: "mesa",
    subtotal: 36e3,
    descuento: 0,
    total: 36e3,
    detalle: [
      { nombre: "Hamburguesa Especial", cantidad: 2, precio: 15e3 },
      { nombre: "Jugo de Naranja", cantidad: 1, precio: 4e3 }
    ]
  },
  {
    id: "PED-006",
    cliente: "Sofia G\xF3mez",
    fecha: "2026-06-07",
    hora: "12:00",
    horaFin: "12:15",
    estado: "pagado",
    metodoPago: "transferencia",
    tipoEntrega: "recoger",
    subtotal: 15e3,
    descuento: 0,
    total: 15e3,
    detalle: [
      { nombre: "Hamburguesa Especial", cantidad: 1, precio: 15e3, adiciones: ["Tocineta"] }
    ]
  },
  {
    id: "PED-007",
    cliente: "Pedro Vargas",
    fecha: "2026-06-07",
    hora: "19:30",
    horaFin: "19:45",
    estado: "pagado",
    metodoPago: "efectivo",
    tipoEntrega: "domicilio",
    subtotal: 54e3,
    descuento: 15,
    total: 45900,
    detalle: [
      { nombre: "Combo Familiar", cantidad: 1, precio: 45e3 },
      { nombre: "Arepa con Queso", cantidad: 1, precio: 8e3 }
    ]
  },
  {
    id: "PED-008",
    cliente: "Cliente General",
    fecha: "2026-06-06",
    hora: "13:00",
    horaFin: "13:15",
    estado: "pagado",
    metodoPago: "efectivo",
    tipoEntrega: "mesa",
    subtotal: 12e3,
    descuento: 0,
    total: 12e3,
    detalle: [
      { nombre: "Salchipapa Grande", cantidad: 1, precio: 12e3 }
    ]
  },
  {
    id: "PED-009",
    cliente: "Diana Torres",
    fecha: "2026-06-06",
    hora: "17:45",
    horaFin: "18:00",
    estado: "pagado",
    metodoPago: "tarjeta",
    tipoEntrega: "domicilio",
    subtotal: 3e4,
    descuento: 0,
    total: 3e4,
    detalle: [
      { nombre: "Pollo Broaster", cantidad: 1, precio: 18e3 },
      { nombre: "Coca Cola", cantidad: 2, precio: 3e3 },
      { nombre: "Papas Fritas", cantidad: 1, precio: 6e3 }
    ]
  },
  {
    id: "PED-010",
    cliente: "Andr\xE9s Cano",
    fecha: "2026-06-05",
    hora: "20:10",
    horaFin: "20:25",
    estado: "pagado",
    metodoPago: "efectivo",
    tipoEntrega: "recoger",
    subtotal: 48e3,
    descuento: 0,
    total: 48e3,
    detalle: [
      { nombre: "Combo Familiar", cantidad: 1, precio: 45e3 },
      { nombre: "Sprite", cantidad: 1, precio: 3e3 }
    ]
  }
];
const ventasPorDia = [
  { dia: "Lun", ventas: 185e3, pedidos: 6 },
  { dia: "Mar", ventas: 21e4, pedidos: 7 },
  { dia: "Mi\xE9", ventas: 16e4, pedidos: 5 },
  { dia: "Jue", ventas: 295e3, pedidos: 9 },
  { dia: "Vie", ventas: 34e4, pedidos: 11 },
  { dia: "S\xE1b", ventas: 42e4, pedidos: 14 },
  { dia: "Dom", ventas: 38e4, pedidos: 12 }
];
const productosMasVendidos = [
  { nombre: "Hamburguesa Esp.", cantidad: 38 },
  { nombre: "Combo Familiar", cantidad: 24 },
  { nombre: "Pollo Broaster", cantidad: 21 },
  { nombre: "Salchipapa", cantidad: 19 },
  { nombre: "Perro Caliente", cantidad: 15 }
];
const metodoPagoData = [
  { name: "Efectivo", value: 62 },
  { name: "Tarjeta", value: 38 }
];
const PIE_COLORS = ["#10B981", "#3B82F6"];
const formatCOP = (v) => `$${v.toLocaleString("es-CO")}`;
export function GestionVentas() {
  const [tab, setTab] = useState("pedidos");
  const [search, setSearch] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [metodoPagoFiltro, setMetodoPagoFiltro] = useState("todos");
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [periodo, setPeriodo] = useState("semana");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const getRangoFecha = () => {
    const hoy = "2026-06-23";
    if (periodo === "hoy") return { desde: hoy, hasta: hoy };
    if (periodo === "semana") return { desde: "2026-06-17", hasta: hoy };
    if (periodo === "mes") return { desde: "2026-06-01", hasta: hoy };
    if (periodo === "ano") return { desde: "2026-01-01", hasta: hoy };
    return { desde: fechaDesde, hasta: fechaHasta };
  };
  const pedidosFiltrados = useMemo(() => {
    const rango = getRangoFecha();
    return pedidosMock.filter((p) => {
      const matchSearch = p.cliente.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchFecha = !fechaFiltro || p.fecha === fechaFiltro;
      const matchMetodo = metodoPagoFiltro === "todos" || p.metodoPago === metodoPagoFiltro;
      const matchPeriodo = (!rango.desde || p.fecha >= rango.desde) && (!rango.hasta || p.fecha <= rango.hasta);
      return matchSearch && matchFecha && matchMetodo && matchPeriodo;
    });
  }, [search, fechaFiltro, metodoPagoFiltro, periodo, fechaDesde, fechaHasta]);
  const totalIngresos = pedidosMock.reduce((s, p) => s + p.total, 0);
  const ticketPromedio = Math.round(totalIngresos / pedidosMock.length);
  const totalDescuentos = pedidosMock.reduce((s, p) => s + (p.subtotal - p.total), 0);
  const tasaDescuento = totalIngresos > 0 ? ((totalDescuentos / (totalIngresos + totalDescuentos)) * 100).toFixed(1) + "%" : "0%";
  const clientesUnicos = new Set(pedidosMock.map(p => p.cliente)).size;
  const frecuenciaPedidos = clientesUnicos > 0 ? (pedidosMock.length / clientesUnicos).toFixed(1) : "0.0";

  const tabs = [
    { key: "pedidos", label: "Pedidos Pagados", icon: <CheckCircle className="w-4 h-4" /> },
    { key: "historial", label: "Historial", icon: <Clock className="w-4 h-4" /> },
    { key: "reportes", label: "Reportes", icon: <BarChart2 className="w-4 h-4" /> }
  ];
  const periodoLabel = periodo === "personalizado" ? `${fechaDesde || "\u2014"} a ${fechaHasta || "\u2014"}` : periodo === "hoy" ? "Hoy" : periodo === "semana" ? "\xDAltimos 7 d\xEDas" : periodo === "mes" ? "Este mes" : "Este a\xF1o";
  return <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {
    /* Header */
  }
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Ventas</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Monitoreo de pedidos pagados y análisis comercial</p>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {[
          { label: "Total Ventas", value: formatCOP(totalIngresos), icon: <DollarSign className="w-5 h-5" />, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", sub: "ingresos brutos" },
          { label: "Ticket Promedio", value: formatCOP(ticketPromedio), icon: <TrendingUp className="w-5 h-5" />, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", sub: "valor medio por pedido" },
          { label: "Frecuencia de Compra", value: `${frecuenciaPedidos} ped/cli`, icon: <Users className="w-5 h-5" />, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", sub: "pedidos por cliente" },
          { label: "Tasa de Descuento", value: tasaDescuento, icon: <ShoppingBag className="w-5 h-5" />, color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400", sub: `${formatCOP(totalDescuentos)} en desc.` }
        ].map((card) => <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className={`inline-flex p-2 rounded-lg mb-2 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-none">{card.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">{card.label}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-none">{card.sub}</p>
          </div>)}
      </div>

      {
    /* Tabs */
  }
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((t) => <button
    key={t.key}
    onClick={() => setTab(t.key)}
    className={`flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium transition-all ${tab === t.key ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
  >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(" ")[0]}</span>
            </button>)}
        </div>

        <div className="p-4 lg:p-6">
          {
    /* ── Pedidos Pagados ─────────────────────────────────── */
  }
          {tab === "pedidos" && <div className="space-y-4">
              {
    /* Period selector */
  }
              <div className="flex flex-wrap gap-2 items-center mb-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Período:</span>
                {[
    { key: "hoy", label: "Hoy" },
    { key: "semana", label: "7 d\xEDas" },
    { key: "mes", label: "Este mes" },
    { key: "ano", label: "Este a\xF1o" },
    { key: "personalizado", label: "Personalizado" }
  ].map((p) => <button
    key={p.key}
    onClick={() => setPeriodo(p.key)}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${periodo === p.key ? "bg-[#30475E] text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
  >
                    {p.label}
                  </button>)}
                {periodo === "personalizado" && <div className="flex items-center gap-2 ml-1">
                    <input
    type="date"
    value={fechaDesde}
    onChange={(e) => setFechaDesde(e.target.value)}
    className="px-2 py-1.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#30475E]"
  />
                    <span className="text-gray-400 text-xs">→</span>
                    <input
    type="date"
    value={fechaHasta}
    onChange={(e) => setFechaHasta(e.target.value)}
    className="px-2 py-1.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#30475E]"
  />
                  </div>}
              </div>

              {
    /* Barra de búsqueda y filtros */
  }
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
    type="text"
    placeholder="Buscar por cliente o ID..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
  />
                </div>
                <button
    onClick={() => setShowFilters(!showFilters)}
    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
  >
                  <Filter className="w-4 h-4" />
                  Filtros
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </button>
              </div>

              {showFilters && <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha</label>
                    <input
    type="date"
    value={fechaFiltro}
    onChange={(e) => setFechaFiltro(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
  />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Método de pago</label>
                    <select
    value={metodoPagoFiltro}
    onChange={(e) => setMetodoPagoFiltro(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
  >
                      <option value="todos">Todos</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
    onClick={() => {
      setFechaFiltro("");
      setMetodoPagoFiltro("todos");
      setSearch("");
    }}
    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
  >
                      Limpiar
                    </button>
                  </div>
                </div>}

              <p className="text-sm text-gray-500 dark:text-gray-400">{pedidosFiltrados.length} pedido(s) encontrado(s)</p>

              {
    /* Tabla desktop */
  }
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                      {["ID", "Cliente", "Fecha", "Hora", "Entrega", "M\xE9todo", "Total", "Estado", ""].map((h) => <th key={h} className="pb-3 pr-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {pedidosFiltrados.map((p) => <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="py-3 pr-4 font-mono font-medium text-gray-800 dark:text-gray-200">{p.id}</td>
                        <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {p.cliente.charAt(0)}
                            </div>
                            {p.cliente}
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{p.fecha}</td>
                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{p.hora} – {p.horaFin}</td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                            {tipoEntregaLabel[p.tipoEntrega].icon} {tipoEntregaLabel[p.tipoEntrega].label}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.metodoPago === "efectivo" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : p.metodoPago === "tarjeta" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"}`}>
                            {metodoPagoLabel[p.metodoPago]}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-bold text-gray-800 dark:text-gray-100">{formatCOP(p.total)}</td>
                        <td className="py-3 pr-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            <CheckCircle className="w-3 h-3" /> Pagado
                          </span>
                        </td>
                        <td className="py-3">
                          <button
    onClick={() => setPedidoDetalle(p)}
    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
    title="Ver detalle"
  >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>

              {
    /* Cards móvil */
  }
              <div className="md:hidden space-y-3">
                {pedidosFiltrados.map((p) => <div key={p.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{p.id}</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{p.cliente}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        <CheckCircle className="w-3 h-3" /> Pagado
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{p.fecha} {p.hora} – {p.horaFin}</span>
                      <span>{metodoPagoLabel[p.metodoPago]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium">
                        {tipoEntregaLabel[p.tipoEntrega].icon} {tipoEntregaLabel[p.tipoEntrega].label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-800 dark:text-gray-100">{formatCOP(p.total)}</p>
                      <button
    onClick={() => setPedidoDetalle(p)}
    className="flex items-center gap-1 text-sm text-red-600 hover:underline"
  >
                        <Eye className="w-4 h-4" /> Ver detalle
                      </button>
                    </div>
                  </div>)}
              </div>

              {pedidosFiltrados.length === 0 && <div className="text-center py-16">
                  <CheckCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No se encontraron pedidos con los filtros aplicados</p>
                </div>}
            </div>}

          {
    /* ── Historial de Ventas ─────────────────────────────── */
  }
          {tab === "historial" && <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Historial — {periodoLabel}</h3>
                <button className="flex items-center gap-2 text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4" /> Exportar
                </button>
              </div>

              <div className="space-y-3">
                {(() => {
    const rango = getRangoFecha();
    return [...pedidosMock].filter(
      (p) => (!rango.desde || p.fecha >= rango.desde) && (!rango.hasta || p.fecha <= rango.hasta)
    ).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.hora.localeCompare(a.hora)).map((p) => <div key={p.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {p.cliente.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-800 dark:text-gray-100">{p.cliente}</p>
                                <span className="font-mono text-xs text-gray-400">{p.id}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.fecha}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.hora} – {p.horaFin}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                            <div className="text-right">
                              {p.descuento > 0 && <p className="text-xs text-gray-400 line-through">{formatCOP(p.subtotal)}</p>}
                              <p className="font-bold text-gray-800 dark:text-gray-100">{formatCOP(p.total)}</p>
                              {p.descuento > 0 && <p className="text-xs text-green-600">-{p.descuento}% desc.</p>}
                            </div>
                            <button
      onClick={() => setPedidoDetalle(p)}
      className="text-red-600 hover:underline text-sm flex items-center gap-1"
    >
                              <Eye className="w-3 h-3" /> Detalle
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
                          {p.detalle.map((item, i) => <span key={i} className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full px-2 py-0.5 text-gray-600 dark:text-gray-400">
                              {item.cantidad}x {item.nombre}
                            </span>)}
                        </div>
                      </div>);
  })()}
              </div>
            </div>}

          {
    /* ── Reportes ────────────────────────────────────────── */
  }
          {tab === "reportes" && <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Análisis de ventas — últimos 7 días</h3>
                <button className="flex items-center gap-2 text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4" /> Exportar
                </button>
              </div>

              {
    /* Ingresos por día */
  }
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <p className="font-medium text-gray-700 dark:text-gray-300 mb-4 text-sm">Ingresos diarios (COP)</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ventasPorDia} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [formatCOP(v), "Ingresos"]} />
                    <Bar dataKey="ventas" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {
    /* Pedidos por día */
  }
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <p className="font-medium text-gray-700 dark:text-gray-300 mb-4 text-sm">Número de pedidos por día</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={ventasPorDia} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [v, "Pedidos"]} />
                    <Line type="monotone" dataKey="pedidos" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4, fill: "#3B82F6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {
    /* Productos más vendidos */
  }
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-4 text-sm">Productos más vendidos</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={productosMasVendidos} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11 }} width={100} />
                      <Tooltip formatter={(v) => [v, "Unidades"]} />
                      <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
                        {productosMasVendidos.map((entry, index) => {
                          const colors = ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5"];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {
    /* Métodos de pago */
  }
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-4 text-sm">Métodos de pago</p>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="w-[60%] min-w-[180px] h-[180px] relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={metodoPagoData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                          >
                            {metodoPagoData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={PIE_COLORS[index % PIE_COLORS.length]} 
                                style={{
                                  filter: activeIndex === index ? 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' : 'none',
                                  transition: 'all 0.2s ease',
                                  cursor: 'pointer'
                                }}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">
                          {activeIndex !== null ? (metodoPagoData[activeIndex].name === "Efectivo" ? "Efectivo" : "Tarjeta") : "Todos"}
                        </span>
                        <span className="text-xl font-extrabold text-gray-800 dark:text-gray-100">
                          {activeIndex !== null ? `${metodoPagoData[activeIndex].value}%` : "100%"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-3 w-full sm:w-auto">
                      {metodoPagoData.map((item, index) => (
                        <div 
                          key={item.name} 
                          className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${
                            activeIndex === index ? "font-bold text-gray-800 dark:text-gray-100 scale-105" : "text-gray-600 dark:text-gray-400"
                          }`}
                          onMouseEnter={() => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(null)}
                        >
                          <span 
                            className="w-3 h-3 rounded-full inline-block shrink-0" 
                            style={{ 
                              backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                              transform: activeIndex === index ? 'scale(1.2)' : 'scale(1)',
                              transition: 'all 0.2s ease'
                            }}
                          ></span>
                          <span className="text-sm">{item.name} ({item.value === 62 ? 65 : 35}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {
    /* Resumen ejecutivo */
  }
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Resumen ejecutivo del período</p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {[
    { label: "Ingresos totales del per\xEDodo", value: formatCOP(ventasPorDia.reduce((s, d) => s + d.ventas, 0)) },
    { label: "Total de pedidos procesados", value: `${ventasPorDia.reduce((s, d) => s + d.pedidos, 0)} pedidos` },
    { label: "D\xEDa con mayor facturaci\xF3n", value: "S\xE1bado \u2014 $420.000" },
    { label: "Producto estrella", value: "Hamburguesa Especial (38 und.)" },
    { label: "M\xE9todo de pago preferido", value: "Efectivo (62%)" },
    { label: "Ticket promedio", value: formatCOP(ticketPromedio) }
  ].map((row) => <div key={row.label} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{row.label}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{row.value}</span>
                    </div>)}
                </div>
              </div>
            </div>}
        </div>
      </div>

      {
    /* Modal Detalle Pedido */
  }
      {pedidoDetalle && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {
    /* Header modal */
  }
            <div className="sticky top-0 bg-gradient-to-r from-[#30475E] to-[#3d5a76] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <p className="text-white font-bold text-lg">{pedidoDetalle.id}</p>
                <p className="text-blue-200 text-sm">{pedidoDetalle.cliente}</p>
              </div>
              <button
    onClick={() => setPedidoDetalle(null)}
    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
  >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {
    /* Info básica */
  }
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
    { label: "Fecha", value: pedidoDetalle.fecha },
    { label: "Horario", value: `${pedidoDetalle.hora} \u2013 ${pedidoDetalle.horaFin}` },
    { label: "M\xE9todo de pago", value: metodoPagoLabel[pedidoDetalle.metodoPago] },
    { label: "Tipo de entrega", value: `${tipoEntregaLabel[pedidoDetalle.tipoEntrega].icon} ${tipoEntregaLabel[pedidoDetalle.tipoEntrega].label}` }
  ].map((item) => <div key={item.label} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{item.label}</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100 leading-snug">{item.value}</p>
                  </div>)}
                {
    /* Estado ocupa el ancho completo */
  }
                <div className="col-span-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">Pagado</span>
                </div>
              </div>

              {
    /* Productos del pedido */
  }
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-3 text-sm">
                  Productos del pedido ({pedidoDetalle.detalle.length})
                </p>
                <div className="space-y-2">
                  {pedidoDetalle.detalle.map((item, i) => <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 space-y-2">
                      {
    /* Nombre + subtotal en una fila, ambos con espacio garantizado */
  }
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug break-words">
                            {item.nombre}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {item.cantidad} × {formatCOP(item.precio)}
                          </p>
                        </div>
                        <p className="font-bold text-gray-800 dark:text-gray-100 text-sm shrink-0 pt-0.5">
                          {formatCOP(item.precio * item.cantidad)}
                        </p>
                      </div>
                      {
    /* Adiciones en chips, sin truncar */
  }
                      {item.adiciones && item.adiciones.length > 0 && <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-100 dark:border-gray-700/60">
                          {item.adiciones.map((a, j) => <span
    key={j}
    className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full px-2.5 py-0.5 whitespace-nowrap"
  >
                              + {a}
                            </span>)}
                        </div>}
                    </div>)}
                </div>
              </div>

              {
    /* Totales */
  }
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2 text-sm">
                {(() => {
    const descAmount = pedidoDetalle.subtotal * (pedidoDetalle.descuento / 100);
    const base = pedidoDetalle.subtotal - descAmount;
    const iva = calcularIVA(base);
    const totalConIVA = base + iva;
    return <>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="text-gray-800 dark:text-gray-100">{formatCOP(pedidoDetalle.subtotal)}</span>
                      </div>
                      {pedidoDetalle.descuento > 0 && <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Descuento ({pedidoDetalle.descuento}%)</span>
                          <span className="text-green-600">-{formatCOP(descAmount)}</span>
                        </div>}
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">IVA ({(IVA_RATE * 100).toFixed(0)}%)</span>
                        <span className="text-gray-800 dark:text-gray-100">{formatCOP(iva)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-bold text-gray-800 dark:text-gray-100">Total</span>
                        <span className="font-bold text-lg text-[#F05454]">{formatCOP(totalConIVA)}</span>
                      </div>
                    </>;
  })()}
              </div>
            </div>
          </div>
        </div>}
    </div>;
}

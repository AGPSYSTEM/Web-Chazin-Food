import { useState } from "react";
import { Plus, Eye, ChevronRight, Clock, User, AlertCircle, X, ChevronDown, ChevronUp } from "lucide-react";
const ESTADOS = ["en_cola", "en_preparacion", "listo", "despachado", "entregado"];
const ESTADO_CONFIG = {
  en_cola: { label: "En Cola", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-700", darkBg: "bg-gray-200 dark:bg-gray-700", header: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" },
  en_preparacion: { label: "En Preparaci\xF3n", color: "text-blue-600 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/30", darkBg: "bg-blue-50 dark:bg-blue-950/40", header: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800" },
  listo: { label: "Listo", color: "text-green-600 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/30", darkBg: "bg-green-50 dark:bg-green-950/40", header: "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800" },
  despachado: { label: "Despachado", color: "text-purple-600 dark:text-purple-300", bg: "bg-purple-100 dark:bg-purple-900/30", darkBg: "bg-purple-50 dark:bg-purple-950/40", header: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800" },
  entregado: { label: "Entregado", color: "text-teal-600 dark:text-teal-300", bg: "bg-teal-100 dark:bg-teal-900/30", darkBg: "bg-teal-50 dark:bg-teal-950/40", header: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800" }
};
const PRIORIDAD_CONFIG = {
  alta: { label: "Alta", cls: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
  media: { label: "Media", cls: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" },
  normal: { label: "Normal", cls: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400" }
};
const PRODUCTOS_LISTA = [
  { nombre: "Hamburguesa Especial", emoji: "\u{1F354}" },
  { nombre: "Pollo Broaster", emoji: "\u{1F357}" },
  { nombre: "Salchipapa Grande", emoji: "\u{1F35F}" },
  { nombre: "Combo Familiar", emoji: "\u{1F371}" },
  { nombre: "Perro Caliente", emoji: "\u{1F32D}" },
  { nombre: "Bebida Combo", emoji: "\u{1F964}" }
];
const COCINEROS = ["Carlos R.", "Mar\xEDa G.", "Juan P."];
const initialOrdenes = [
  {
    id: "OP-001",
    producto: "Hamburguesa Especial",
    emoji: "\u{1F354}",
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
    emoji: "\u{1F357}",
    cantidad: 1,
    cocinero: "Mar\xEDa G.",
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
    emoji: "\u{1F35F}",
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
    emoji: "\u{1F371}",
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
    emoji: "\u{1F32D}",
    cantidad: 2,
    cocinero: "Mar\xEDa G.",
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
    emoji: "\u{1F35F}",
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
    emoji: "\u{1F354}",
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
      { nombre: "Carne de res 150g", cantidad: 1, unidad: "porci\xF3n" },
      { nombre: "Lechuga y tomate", cantidad: 1, unidad: "porci\xF3n" }
    ]
  },
  {
    id: "OP-008",
    producto: "Bebida Combo",
    emoji: "\u{1F964}",
    cantidad: 3,
    cocinero: "Mar\xEDa G.",
    fechaCreacion: "2026-06-23",
    horaInicio: "10:55",
    tiempoEstimado: 5,
    estado: "en_preparacion",
    prioridad: "normal",
    notas: "Una sin az\xFAcar",
    ingredientes: [
      { nombre: "Gaseosa 400ml", cantidad: 2, unidad: "vasos" },
      { nombre: "Jugo natural", cantidad: 1, unidad: "vaso" }
    ]
  }
];
const inputCls = "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#F05454] focus:border-transparent transition-colors text-sm";
const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";
function nextEstado(estado) {
  const idx = ESTADOS.indexOf(estado);
  return idx < ESTADOS.length - 1 ? ESTADOS[idx + 1] : null;
}
export function GestionProduccion() {
  const [ordenes, setOrdenes] = useState(() => {
    const saved = localStorage.getItem("chazin_ordenes");
    return saved ? JSON.parse(saved) : initialOrdenes;
  });
  const [detailOrden, setDetailOrden] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [collapsed, setCollapsed] = useState({});
  const [newForm, setNewForm] = useState({
    producto: PRODUCTOS_LISTA[0].nombre,
    cantidad: 1,
    cocinero: COCINEROS[0],
    prioridad: "normal",
    notas: ""
  });
  const [pages, setPages] = useState({});
  const ITEMS_PER_PAGE = 3;

  const avanzarEstado = (id) => {
    setOrdenes((prev) => {
      const updated = prev.map((o) => {
        if (o.id !== id) return o;
        const next = nextEstado(o.estado);
        return next ? { ...o, estado: next } : o;
      });
      localStorage.setItem("chazin_ordenes", JSON.stringify(updated));
      return updated;
    });
  };
  const handleSaveNew = () => {
    const productoInfo = PRODUCTOS_LISTA.find((p) => p.nombre === newForm.producto) || PRODUCTOS_LISTA[0];
    const newId = `OP-${String(ordenes.length + 1).padStart(3, "0")}`;
    const newOrder = {
      id: newId,
      producto: productoInfo.nombre,
      emoji: productoInfo.emoji,
      cantidad: newForm.cantidad,
      cocinero: newForm.cocinero,
      fechaCreacion: new Date().toISOString().slice(0, 10),
      horaInicio: new Date().toTimeString().slice(0, 5),
      tiempoEstimado: 15,
      estado: "en_cola",
      prioridad: newForm.prioridad,
      notas: newForm.notas,
      ingredientes: [{ nombre: "Ingredientes varios", cantidad: 1, unidad: "porción" }]
    };
    setOrdenes((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem("chazin_ordenes", JSON.stringify(updated));
      return updated;
    });
    setShowNewModal(false);
    setNewForm({ producto: PRODUCTOS_LISTA[0].nombre, cantidad: 1, cocinero: COCINEROS[0], prioridad: "normal", notas: "" });
  };
  const toggleCollapse = (estado) => {
    setCollapsed((prev) => ({ ...prev, [estado]: !prev[estado] }));
  };
  const enCola = ordenes.filter((o) => o.estado === "en_cola").length;
  const enPrep = ordenes.filter((o) => o.estado === "en_preparacion").length;
  const listos = ordenes.filter((o) => o.estado === "listo").length;
  const total = ordenes.length;
  return <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      {
    /* Header */
  }
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-gray-100">Gestión de Producción</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Administra las órdenes de producción en tiempo real</p>
        </div>
        <button
    onClick={() => setShowNewModal(true)}
    className="flex items-center gap-2 px-4 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-[#c0392b] transition-colors text-sm font-medium shadow-sm self-start sm:self-auto whitespace-nowrap"
  >
          <Plus className="w-4 h-4" />
          Nueva Orden
        </button>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "En Cola", value: enCola, color: "text-yellow-600 dark:text-yellow-300", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
          { label: "En Preparación", value: enPrep, color: "text-blue-600 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/30" },
          { label: "Listos", value: listos, color: "text-green-600 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/30" },
          { label: "Total del Día", value: total, color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-700" }
        ].map(({ label, value, color, bg }) => <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                  <div className="flex items-end gap-2">
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                    <div className={`w-2 h-2 rounded-full mb-1.5 ${bg}`} />
                  </div>
                </div>)}
      </div>

      {
    /* Kanban Board — desktop */
  }
      <div className="hidden md:grid md:grid-cols-5 gap-4">
        {ESTADOS.map((estado) => {
          const cfg = ESTADO_CONFIG[estado];
          const cols = ordenes.filter((o) => o.estado === estado);
          const currentPage = pages[estado] || 1;
          const totalPages = Math.ceil(cols.length / ITEMS_PER_PAGE);
          const paginatedCols = cols.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

          return (
            <div key={estado} className="flex flex-col gap-3 min-w-0 justify-between h-full bg-gray-50/30 dark:bg-gray-900/5 p-2 rounded-2xl border border-gray-100/80 dark:border-gray-800/80">
              <div className="flex flex-col gap-3">
                {/* Column header */}
                <div className={`rounded-xl border px-3 py-2 flex items-center justify-between ${cfg.header}`}>
                  <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cols.length}</span>
                </div>
                {/* Cards */}
                <div className="space-y-3">
                  {paginatedCols.map((orden) => (
                    <KanbanCard key={orden.id} orden={orden} onAdvance={avanzarEstado} onDetail={setDetailOrden} />
                  ))}
                  {cols.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center text-xs text-gray-400 dark:text-gray-600">
                      Sin órdenes
                    </div>
                  )}
                </div>
              </div>
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 px-2 py-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setPages(p => ({ ...p, [estado]: currentPage - 1 }))}
                    className="px-2 py-1 text-[10px] font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Ant.
                  </button>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">{currentPage} / {totalPages}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setPages(p => ({ ...p, [estado]: currentPage + 1 }))}
                    className="px-2 py-1 text-[10px] font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Sig.
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {
    /* Mobile — collapsible sections */
  }
      <div className="md:hidden space-y-3">
        {ESTADOS.map((estado) => {
          const cfg = ESTADO_CONFIG[estado];
          const cols = ordenes.filter((o) => o.estado === estado);
          const isCollapsed = collapsed[estado];
          const currentPage = pages[estado] || 1;
          const totalPages = Math.ceil(cols.length / ITEMS_PER_PAGE);
          const paginatedCols = cols.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

          return (
            <div key={estado} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden">
              <button
                onClick={() => toggleCollapse(estado)}
                className={`w-full flex items-center justify-between px-4 py-3 ${cfg.header} border-b`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cols.length}</span>
                </div>
                {isCollapsed ? <ChevronDown className={`w-4 h-4 ${cfg.color}`} /> : <ChevronUp className={`w-4 h-4 ${cfg.color}`} />}
              </button>
              {!isCollapsed && (
                <div className="p-3 space-y-3">
                  {cols.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 dark:text-gray-600 py-4">Sin órdenes</p>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {paginatedCols.map((orden) => (
                          <KanbanCard key={orden.id} orden={orden} onAdvance={avanzarEstado} onDetail={setDetailOrden} />
                        ))}
                      </div>
                      {/* Mobile Pagination controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setPages(p => ({ ...p, [estado]: currentPage - 1 }))}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-40 rounded text-gray-700 dark:text-gray-300 transition-colors"
                          >
                            Anterior
                          </button>
                          <span className="text-xs text-gray-500 font-semibold">{currentPage} de {totalPages}</span>
                          <button
                            disabled={currentPage === totalPages}
                            onClick={() => setPages(p => ({ ...p, [estado]: currentPage + 1 }))}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-40 rounded text-gray-700 dark:text-gray-300 transition-colors"
                          >
                            Siguiente
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {
    /* Detail Modal */
  }
      {detailOrden && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700/60">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{detailOrden.emoji}</span>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-gray-100">{detailOrden.producto}</h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{detailOrden.id}</p>
                </div>
              </div>
              <button onClick={() => setDetailOrden(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
    { label: "Estado", value: ESTADO_CONFIG[detailOrden.estado].label },
    { label: "Prioridad", value: PRIORIDAD_CONFIG[detailOrden.prioridad].label },
    { label: "Cantidad", value: `x${detailOrden.cantidad}` },
    { label: "Cocinero", value: detailOrden.cocinero },
    { label: "Fecha", value: detailOrden.fechaCreacion },
    { label: "Hora Inicio", value: detailOrden.horaInicio },
    { label: "Tiempo Est.", value: `${detailOrden.tiempoEstimado} min` }
  ].map(({ label, value }) => <div key={label}>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</p>
                  </div>)}
              </div>
              {detailOrden.notas && <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 rounded-xl p-3">
                  <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Notas</p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">{detailOrden.notas}</p>
                </div>}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Ingredientes</p>
                <div className="space-y-1.5">
                  {detailOrden.ingredientes.map((ing, i) => <div key={i} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                      <span className="text-gray-700 dark:text-gray-300">{ing.nombre}</span>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">{ing.cantidad} {ing.unidad}</span>
                    </div>)}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 dark:border-gray-700/60 flex justify-end">
              <button onClick={() => setDetailOrden(null)} className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
                Cerrar
              </button>
            </div>
          </div>
        </div>}

      {
    /* New Order Modal */
  }
      {showNewModal && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700/60">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-gray-100">Nueva Orden de Producción</h2>
              <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Producto</label>
                <select
    value={newForm.producto}
    onChange={(e) => setNewForm((f) => ({ ...f, producto: e.target.value }))}
    className={inputCls}
  >
                  {PRODUCTOS_LISTA.map((p) => <option key={p.nombre} value={p.nombre}>{p.emoji} {p.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Cantidad</label>
                <input
    type="number"
    min={1}
    value={newForm.cantidad}
    onChange={(e) => setNewForm((f) => ({ ...f, cantidad: Number(e.target.value) }))}
    className={inputCls}
  />
              </div>
              <div>
                <label className={labelCls}>Cocinero</label>
                <select
    value={newForm.cocinero}
    onChange={(e) => setNewForm((f) => ({ ...f, cocinero: e.target.value }))}
    className={inputCls}
  >
                  {COCINEROS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Prioridad</label>
                <select
    value={newForm.prioridad}
    onChange={(e) => setNewForm((f) => ({ ...f, prioridad: e.target.value }))}
    className={inputCls}
  >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Notas</label>
                <textarea
    value={newForm.notas}
    onChange={(e) => setNewForm((f) => ({ ...f, notas: e.target.value }))}
    rows={3}
    placeholder="Instrucciones especiales, alergias, etc."
    className={inputCls}
  />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 dark:border-gray-700/60 flex justify-end gap-3">
              <button onClick={() => setShowNewModal(false)} className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
                Cancelar
              </button>
              <button onClick={handleSaveNew} className="px-5 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-[#c0392b] transition-colors text-sm font-medium">
                Crear Orden
              </button>
            </div>
          </div>
        </div>}
    </div>;
}
function KanbanCard({ orden, onAdvance, onDetail }) {
  const cfg = ESTADO_CONFIG[orden.estado];
  const prioridadCfg = PRIORIDAD_CONFIG[orden.prioridad];
  const next = nextEstado(orden.estado);
  return <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-3 flex flex-col gap-2.5">
      {
    /* Top row */
  }
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">{orden.emoji}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">{orden.producto}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{orden.id} · x{orden.cantidad}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {orden.prioridad === "alta" && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
          <button
    onClick={() => onDetail(orden)}
    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
    title="Ver detalle"
  >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {
    /* Info row */
  }
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{orden.cocinero}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{orden.tiempoEstimado}min</span>
        </div>
      </div>

      {
    /* Badges */
  }
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${prioridadCfg.cls}`}>
          {prioridadCfg.label}
        </span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      {
    /* Action button */
  }
      {next && <button
    onClick={() => onAdvance(orden.id)}
    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-[#F05454]/10 dark:hover:bg-[#F05454]/10 text-gray-600 dark:text-gray-400 hover:text-[#F05454] dark:hover:text-[#F05454] transition-colors border border-gray-200 dark:border-gray-700"
  >
          <span>→ {ESTADO_CONFIG[next].label}</span>
          <ChevronRight className="w-3 h-3" />
        </button>}
    </div>;
}

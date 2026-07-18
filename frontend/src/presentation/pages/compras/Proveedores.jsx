import { useState, useEffect } from "react";
import { Pagination } from "@/presentation/components/common/Pagination";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  Building,
  X,
  Eye,
  Download,
  ShoppingBag,
  Clock,
  Package,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Award,
  DollarSign,
  TrendingUp,
  Percent
} from "lucide-react";
const proveedoresDataInitial = [
  { idProveedor: 1, nombre: "FruVer SA", nit: "900.123.456-7", telefono: "604 123 4567", email: "ventas@fruversa.com", direccion: "Calle 50 #45-30, Medell\xEDn", tipoPersona: "Jur\xEDdica", nombreContacto: "Juan P\xE9rez", estado: "Activo" },
  { idProveedor: 2, nombre: "Carnes Premium", nit: "900.234.567-8", telefono: "604 234 5678", email: "info@carnespremium.com", direccion: "Carrera 43A #12-80, Medell\xEDn", tipoPersona: "Jur\xEDdica", nombreContacto: "Mar\xEDa Garc\xEDa", estado: "Activo" },
  { idProveedor: 3, nombre: "Av\xEDcola del Sur", nit: "900.345.678-9", telefono: "604 345 6789", email: "ventas@avicolasur.com", direccion: "Calle 10 Sur #48-20, Envigado", tipoPersona: "Jur\xEDdica", nombreContacto: "Carlos L\xF3pez", estado: "Activo" },
  { idProveedor: 4, nombre: "L\xE1cteos del Valle", nit: "900.456.789-0", telefono: "604 456 7890", email: "contacto@lacteosval.com", direccion: "Avenida Las Palmas #55-100, Medell\xEDn", tipoPersona: "Jur\xEDdica", nombreContacto: "Ana Mart\xEDnez", estado: "Activo" },
  { idProveedor: 5, nombre: "Panader\xEDa El Trigo", nit: "43.123.456-7", telefono: "604 567 8901", email: "eltrigo@gmail.com", direccion: "Calle 33 #70-25, Medell\xEDn", tipoPersona: "Natural", nombreContacto: "Luis Rodr\xEDguez", estado: "Activo" },
  { idProveedor: 6, nombre: "Distribuidora Andina", nit: "900.567.890-1", telefono: "604 678 9012", email: "ventas@distrandina.com", direccion: "Carrera 65 #8B-91, Medell\xEDn", tipoPersona: "Jur\xEDdica", nombreContacto: "Pedro G\xF3mez", estado: "Inactivo" }
];
const historialPorProveedor = {
  1: [
    { id: "OC-001", fecha: "2026-06-15", insumo: "Tomate", cantidad: 50, unidad: "kg", total: 175e3, estado: "Recibido" },
    { id: "OC-002", fecha: "2026-06-08", insumo: "Lechuga", cantidad: 30, unidad: "und", total: 6e4, estado: "Recibido" },
    { id: "OC-003", fecha: "2026-05-28", insumo: "Papas", cantidad: 80, unidad: "kg", total: 32e4, estado: "Recibido" },
    { id: "OC-004", fecha: "2026-06-20", insumo: "Tomate", cantidad: 40, unidad: "kg", total: 144e3, estado: "Pendiente" }
  ],
  2: [
    { id: "OC-005", fecha: "2026-06-14", insumo: "Carne de Res", cantidad: 20, unidad: "kg", total: 5e5, estado: "Recibido" },
    { id: "OC-006", fecha: "2026-06-07", insumo: "Salchicha Premium", cantidad: 15, unidad: "kg", total: 225e3, estado: "Recibido" },
    { id: "OC-007", fecha: "2026-06-21", insumo: "Carne de Res", cantidad: 25, unidad: "kg", total: 637500, estado: "Pendiente" }
  ],
  3: [
    { id: "OC-008", fecha: "2026-06-12", insumo: "Pollo", cantidad: 30, unidad: "kg", total: 36e4, estado: "Recibido" },
    { id: "OC-009", fecha: "2026-06-01", insumo: "Pollo", cantidad: 25, unidad: "kg", total: 287500, estado: "Recibido" }
  ],
  4: [
    { id: "OC-010", fecha: "2026-06-10", insumo: "Queso Mozzarella", cantidad: 10, unidad: "kg", total: 18e4, estado: "Recibido" }
  ],
  5: [
    { id: "OC-011", fecha: "2026-06-13", insumo: "Pan Hamburguesa", cantidad: 20, unidad: "paq", total: 17e4, estado: "Recibido" },
    { id: "OC-012", fecha: "2026-06-19", insumo: "Pan Hamburguesa", cantidad: 25, unidad: "paq", total: 212500, estado: "Pendiente" }
  ],
  6: [
    { id: "OC-013", fecha: "2026-05-20", insumo: "Coca Cola", cantidad: 60, unidad: "und", total: 15e4, estado: "Recibido" }
  ]
};
const productosPorProveedor = {
  1: [
    { id: 1, nombre: "Tomate", categoria: "Verduras", precioUnitario: 3500, unidad: "kg", disponible: true },
    { id: 2, nombre: "Lechuga", categoria: "Verduras", precioUnitario: 2e3, unidad: "und", disponible: true },
    { id: 3, nombre: "Papas", categoria: "Verduras", precioUnitario: 4e3, unidad: "kg", disponible: true },
    { id: 4, nombre: "Cebolla", categoria: "Verduras", precioUnitario: 2800, unidad: "kg", disponible: true },
    { id: 5, nombre: "Piment\xF3n", categoria: "Verduras", precioUnitario: 5e3, unidad: "kg", disponible: false }
  ],
  2: [
    { id: 1, nombre: "Carne de Res", categoria: "Prote\xEDnas", precioUnitario: 25e3, unidad: "kg", disponible: true },
    { id: 2, nombre: "Salchicha Premium", categoria: "Prote\xEDnas", precioUnitario: 15e3, unidad: "kg", disponible: true },
    { id: 3, nombre: "Tocineta", categoria: "Prote\xEDnas", precioUnitario: 22e3, unidad: "kg", disponible: true },
    { id: 4, nombre: "Costilla de Res", categoria: "Prote\xEDnas", precioUnitario: 18e3, unidad: "kg", disponible: false }
  ],
  3: [
    { id: 1, nombre: "Pollo Entero", categoria: "Prote\xEDnas", precioUnitario: 1e4, unidad: "kg", disponible: true },
    { id: 2, nombre: "Pechuga de Pollo", categoria: "Prote\xEDnas", precioUnitario: 13e3, unidad: "kg", disponible: true },
    { id: 3, nombre: "Alas de Pollo", categoria: "Prote\xEDnas", precioUnitario: 9e3, unidad: "kg", disponible: true }
  ],
  4: [
    { id: 1, nombre: "Queso Mozzarella", categoria: "L\xE1cteos", precioUnitario: 18e3, unidad: "kg", disponible: true },
    { id: 2, nombre: "Leche", categoria: "L\xE1cteos", precioUnitario: 2800, unidad: "lt", disponible: true },
    { id: 3, nombre: "Mantequilla", categoria: "L\xE1cteos", precioUnitario: 12e3, unidad: "kg", disponible: false }
  ],
  5: [
    { id: 1, nombre: "Pan Hamburguesa", categoria: "Carbohidratos", precioUnitario: 8500, unidad: "paq", disponible: true },
    { id: 2, nombre: "Pan Perro Caliente", categoria: "Carbohidratos", precioUnitario: 7e3, unidad: "paq", disponible: true },
    { id: 3, nombre: "Arepa Redonda", categoria: "Carbohidratos", precioUnitario: 5500, unidad: "paq", disponible: true }
  ],
  6: [
    { id: 1, nombre: "Coca Cola 350ml", categoria: "Bebidas", precioUnitario: 2500, unidad: "und", disponible: true },
    { id: 2, nombre: "Sprite 350ml", categoria: "Bebidas", precioUnitario: 2500, unidad: "und", disponible: true },
    { id: 3, nombre: "Agua 600ml", categoria: "Bebidas", precioUnitario: 1800, unidad: "und", disponible: false }
  ]
};
function estadoBadge(estado) {
  if (estado === "Recibido") return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
  if (estado === "Pendiente") return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
  return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
}
function descargarReporte(p) {
  const historial = historialPorProveedor[p.idProveedor] ?? [];
  const productos = productosPorProveedor[p.idProveedor] ?? [];
  const totalFacturado = historial.reduce((s, h) => s + h.total, 0);
  const fecha = (/* @__PURE__ */ new Date()).toLocaleDateString("es-CO");
  const txt = [
    "REPORTE DE PROVEEDOR \u2014 Chazin Food",
    `Generado: ${fecha}`,
    "=".repeat(55),
    "",
    "INFORMACI\xD3N GENERAL",
    `Nombre:       ${p.nombre}`,
    `NIT:          ${p.nit}`,
    `Tipo:         ${p.tipoPersona}`,
    `Estado:       ${p.estado}`,
    `Contacto:     ${p.nombreContacto}`,
    `Tel\xE9fono:     ${p.telefono}`,
    `Email:        ${p.email}`,
    `Direcci\xF3n:    ${p.direccion}`,
    "",
    "=".repeat(55),
    `CAT\xC1LOGO DE PRODUCTOS (${productos.length})`,
    "-".repeat(55),
    ...productos.map(
      (pr) => `  \u2022 ${pr.nombre.padEnd(25)} $${pr.precioUnitario.toLocaleString().padStart(8)}/${pr.unidad}  ${pr.disponible ? "\u2713" : "\u2717"}`
    ),
    "",
    "=".repeat(55),
    `HISTORIAL DE COMPRAS (${historial.length} \xF3rdenes)`,
    "-".repeat(55),
    ...historial.map(
      (h) => `  ${h.id}  ${h.fecha}  ${h.insumo.padEnd(20)} ${String(h.cantidad).padStart(3)} ${h.unidad.padEnd(4)}  $${h.total.toLocaleString().padStart(9)}  ${h.estado}`
    ),
    "-".repeat(55),
    `TOTAL FACTURADO: $${totalFacturado.toLocaleString()}`,
    "",
    "=".repeat(55),
    "Chazin Food \u2014 Sistema de Gesti\xF3n"
  ].join("\n");
  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte_${p.nombre.replace(/\s+/g, "_")}_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
const inputCls = "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition";
const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";
export function Proveedores() {
  const [proveedoresData, setProveedoresData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterTipo, setFilterTipo] = useState("Todos");
  const [showFormModal, setShowFormModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActividadModal, setShowActividadModal] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [actividadTab, setActividadTab] = useState("historial");
  const [expandirHistorial, setExpandirHistorial] = useState(false);
  const emptyForm = { nombre: "", nit: "", telefono: "", email: "", direccion: "", tipoPersona: "Jurídica", nombreContacto: "", estado: "Activo" };
  const [form, setForm] = useState(emptyForm);

  const fetchProveedores = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/proveedores');
      if (response.ok) {
        const data = await response.json();
        // map idProveedor, nombre, numeroDocumento as nit, correo as email, etc.
        setProveedoresData(data.map(p => ({
          ...p,
          nit: p.numeroDocumento || '',
          email: p.correo || '',
          estado: p.estado ? 'Activo' : 'Inactivo',
          tipoPersona: p.tipoPersona || 'Jurídica',
          nombreContacto: p.nombreContacto || 'N/A'
        })));
      }
    } catch (error) {
      console.error('Error fetching proveedores:', error);
    }
  };

  const registrarTrazabilidad = async (tipo, entidadNombre, detalle) => {
    try {
      await fetch('http://localhost:5000/api/trazabilidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, entidadNombre, detalle })
      });
    } catch (error) {
      console.error('Error al registrar trazabilidad:', error);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const openNew = () => {
    setSelectedProveedor(null);
    setForm(emptyForm);
    setFormSubmitted(false);
    setShowFormModal(true);
  };
  const openEdit = (p) => {
    setSelectedProveedor(p);
    setForm({ ...p });
    setFormSubmitted(false);
    setShowFormModal(true);
  };
  const openDelete = (p) => {
    setSelectedProveedor(p);
    setShowDeleteModal(true);
  };
  const openActividad = (p) => {
    setSelectedProveedor(p);
    setActividadTab("historial");
    setExpandirHistorial(false);
    setShowActividadModal(true);
  };
  const handleGuardar = async () => {
    setFormSubmitted(true);
    if (!form.nombre.trim() || !form.nit.trim()) return;
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return;
    
    const payload = {
      nombre: form.nombre,
      numeroDocumento: form.nit,
      telefono: form.telefono,
      correo: form.email,
      direccion: form.direccion,
      tipoPersona: form.tipoPersona,
      estado: form.estado,
      nombreContacto: form.nombreContacto
    };

    try {
      if (selectedProveedor) {
        const response = await fetch(`http://localhost:5000/api/proveedores/${selectedProveedor.idProveedor}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          await fetchProveedores();
          await registrarTrazabilidad('editar', form.nombre, `Se modificó la información del proveedor: ${form.nombre}`);
        }
      } else {
        const response = await fetch('http://localhost:5000/api/proveedores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          await fetchProveedores();
          await registrarTrazabilidad('crear', form.nombre, `Se registró un nuevo proveedor en el sistema: ${form.nombre}`);
        }
      }
      setShowFormModal(false);
      setFormSubmitted(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInactivar = async () => {
    if (!selectedProveedor) return;
    try {
      const payload = {
        ...selectedProveedor,
        numeroDocumento: selectedProveedor.nit,
        correo: selectedProveedor.email,
        estado: 'Inactivo'
      };
      const response = await fetch(`http://localhost:5000/api/proveedores/${selectedProveedor.idProveedor}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        await fetchProveedores();
        await registrarTrazabilidad('eliminar', selectedProveedor.nombre, `Se inactivó al proveedor: ${selectedProveedor.nombre}`);
      }
      setShowDeleteModal(false);
    } catch (e) {
      console.error(e);
    }
  };
  const filtered = proveedoresData.filter((p) => {
    const t = searchTerm.trim().toLowerCase();
    const matchSearch = !t || p.nombre.toLowerCase().includes(t) || p.email.toLowerCase().includes(t) || p.nit.toLowerCase().includes(t) || p.nombreContacto.toLowerCase().includes(t);
    const matchEstado = filterEstado === "Todos" || p.estado === filterEstado;
    const matchTipo = filterTipo === "Todos" || p.tipoPersona === filterTipo;
    return matchSearch && matchEstado && matchTipo;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProveedores = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalActivos = proveedoresData.filter((p) => p.estado === "Activo").length;
  const totalInactivos = proveedoresData.filter((p) => p.estado === "Inactivo").length;
  const historialActivo = selectedProveedor ? historialPorProveedor[selectedProveedor.idProveedor] ?? [] : [];
  const productosActivo = selectedProveedor ? productosPorProveedor[selectedProveedor.idProveedor] ?? [] : [];
  // 1. Proveedor con mayor volumen de compras
  let maxProveedorNombre = "Ninguno";
  let maxMonto = 0;
  proveedoresData.forEach(p => {
    const historia = historialPorProveedor[p.idProveedor] ?? [];
    const totalProv = historia.reduce((sum, item) => sum + item.total, 0);
    if (totalProv > maxMonto) {
      maxMonto = totalProv;
      maxProveedorNombre = p.nombre;
    }
  });
  const provMayorVolumen = maxMonto > 0 ? maxProveedorNombre : "Ninguno";
  const subProvMayorVolumen = maxMonto > 0 ? `$${maxMonto.toLocaleString("es-CO")} total` : "Sin compras";

  // 2. Gasto total en compras del mes (Junio 2026 en los datos de prueba)
  const currentMonth = "2026-06";
  const comprasMesActual = Object.values(historialPorProveedor)
    .flat()
    .filter(order => order.fecha.startsWith(currentMonth))
    .reduce((sum, order) => sum + order.total, 0);

  // 3. Insumo más comprado
  const insumoCounts = {};
  Object.values(historialPorProveedor)
    .flat()
    .forEach(order => {
      insumoCounts[order.insumo] = (insumoCounts[order.insumo] ?? 0) + order.cantidad;
    });
  let maxInsumo = "Ninguno";
  let maxQty = 0;
  Object.entries(insumoCounts).forEach(([insumo, qty]) => {
    if (qty > maxQty) {
      maxQty = qty;
      maxInsumo = insumo;
    }
  });
  const flatOrders = Object.values(historialPorProveedor).flat();
  const sampleOrder = flatOrders.find(o => o.insumo === maxInsumo);
  const maxInsumoUnit = sampleOrder ? sampleOrder.unidad : "und";
  const insumoMasComprado = maxInsumo;
  const subInsumoMasComprado = `${maxQty} ${maxInsumoUnit} adquiridos`;

  // 4. Tasa de rechazo / no conformidad
  const tasaRechazo = "1.8%";

  const historialVisible = expandirHistorial ? historialActivo : historialActivo.slice(0, 4);
  const totalFacturado = historialActivo.reduce((s, h) => s + h.total, 0);

  return <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-full">

      {
    /* Header */
  }
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Proveedores</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Proveedores, historial de compras y catálogos de productos</p>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        {[
          { icon: <Award className="w-5 h-5 text-green-600 dark:text-green-400" />, bg: "bg-green-100 dark:bg-green-900/30", label: "Mayor Volumen de Compra", sub: subProvMayorVolumen, subCls: "text-green-600 dark:text-green-400", value: provMayorVolumen },
          { icon: <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-100 dark:bg-blue-900/30", label: "Compras del Mes", sub: "junio 2026", subCls: "text-gray-500 dark:text-gray-400", value: `$${comprasMesActual.toLocaleString("es-CO")}` },
          { icon: <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-100 dark:bg-blue-900/30", label: "Insumo Más Comprado", sub: subInsumoMasComprado, subCls: "text-gray-500 dark:text-gray-400", value: insumoMasComprado },
          { icon: <Percent className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />, bg: "bg-yellow-100 dark:bg-yellow-900/30", label: "Tasa de Rechazo", sub: "no conformidad", subCls: "text-yellow-600 dark:text-yellow-400", value: tasaRechazo }
        ].map((card) => <div key={card.label} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-3 sm:p-4 lg:p-6 flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center sm:gap-3 lg:flex-col lg:items-stretch lg:text-left hover:shadow-md transition-shadow">
            <div className={`${card.bg} p-2 sm:p-2.5 rounded-xl shrink-0 mb-2 sm:mb-0 lg:mb-3 lg:w-fit`}>{card.icon}</div>
            <div className="lg:flex-1 min-w-0">
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5 leading-tight">{card.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 leading-none truncate">{card.value}</p>
              <p className={`${card.subCls} text-xs mt-1 leading-tight`}>{card.sub}</p>
            </div>
          </div>)}
      </div>

      {
    /* Search & Filters */
  }
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 mb-4 sm:mb-6 space-y-3">
        {
    /* Fila 1: buscador + botón */
  }
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
    type="text"
    placeholder="Buscar por nombre, NIT, email o contacto..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
  />
          </div>
          <button
    onClick={openNew}
    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-red-600 active:scale-95 transition-all font-medium text-sm shadow-sm shrink-0"
  >
            <Plus className="w-4 h-4" /><span>Nuevo Proveedor</span>
          </button>
        </div>
        {
    /* Fila 2: filtros */
  }
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">Filtrar por:</span>
          {
    /* Estado */
  }
          <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden text-xs font-medium">
            {["Todos", "Activo", "Inactivo"].map((opt) => <button
    key={opt}
    onClick={() => setFilterEstado(opt)}
    className={`px-3 py-1.5 transition-colors whitespace-nowrap ${filterEstado === opt ? "bg-[#30475E] text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
  >
                {opt === "Todos" ? "Todos los estados" : opt}
              </button>)}
          </div>
          {
    /* Tipo */
  }
          <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden text-xs font-medium">
            {["Todos", "Jur\xEDdica", "Natural"].map((opt) => <button
    key={opt}
    onClick={() => setFilterTipo(opt)}
    className={`px-3 py-1.5 transition-colors whitespace-nowrap ${filterTipo === opt ? "bg-[#30475E] text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
  >
                {opt === "Todos" ? "Todos los tipos" : `P. ${opt}`}
              </button>)}
          </div>
          {
    /* Limpiar filtros */
  }
          {(filterEstado !== "Todos" || filterTipo !== "Todos" || searchTerm) && <button
    onClick={() => {
      setFilterEstado("Todos");
      setFilterTipo("Todos");
      setSearchTerm("");
    }}
    className="text-xs text-red-500 dark:text-red-400 hover:underline px-2"
  >
              Limpiar filtros
            </button>}
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Vista de tabla desktop */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200 dark:border-gray-700">
              {["ID", "Proveedor", "Tipo", "Contacto", "Teléfono", "Productos", "Órdenes", "Estado", "Acciones"].map((h) => (
                <th key={h} className="pb-3 pr-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {currentProveedores.map((p) => (
              <tr key={p.idProveedor} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="py-3 pr-4 font-mono font-medium text-gray-800 dark:text-gray-200">
                  #{p.idProveedor}
                </td>
                <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-gradient-to-br from-[#30475E] to-[#1e3347] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {p.nombre.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-100 leading-snug">{p.nombre}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{p.nit}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{p.tipoPersona}</td>
                <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{p.nombreContacto}</td>
                <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{p.telefono}</td>
                <td className="py-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                  {(productosPorProveedor[p.idProveedor] ?? []).length}
                </td>
                <td className="py-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                  {(historialPorProveedor[p.idProveedor] ?? []).length}
                </td>
                <td className="py-3 pr-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${p.estado === "Activo" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
                    {p.estado}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openActividad(p)}
                      className="p-1.5 text-gray-500 hover:text-[#30475E] dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => descargarReporte(p)}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Descargar Reporte"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDelete(p)}
                      title={p.estado === "Activo" ? "Inactivar proveedor" : "Ya inactivo"}
                      disabled={p.estado === "Inactivo"}
                      className="p-1.5 text-yellow-500 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-500 dark:text-gray-400">
            No se encontraron proveedores.
          </div>
        )}
      </div>

      {/* Vista de tarjetas móvil */}
      <div className="md:hidden space-y-3">
        {currentProveedores.map((p) => (
          <div key={p.idProveedor} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#30475E] to-[#1e3347] rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0">
                  {p.nombre.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate leading-snug">{p.nombre}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{p.tipoPersona} · {p.nit}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${p.estado === "Activo" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
                {p.estado}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-gray-100 dark:border-gray-700/60">
              <div>
                <p className="text-gray-400 dark:text-gray-500">Contacto</p>
                <p className="font-medium text-gray-700 dark:text-gray-300 truncate">{p.nombreContacto}</p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Teléfono</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">{p.telefono}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                {(productosPorProveedor[p.idProveedor] ?? []).length} productos · {(historialPorProveedor[p.idProveedor] ?? []).length} órdenes
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openActividad(p)}
                  className="flex items-center gap-1 text-sm text-[#30475E] dark:text-blue-400 hover:underline"
                >
                  <Eye className="w-4 h-4" /> Ver
                </button>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <button
                  onClick={() => openEdit(p)}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Edit className="w-4 h-4" /> Editar
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-10 text-center text-sm text-gray-500 dark:text-gray-400">
            No se encontraron proveedores.
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filtered.length}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      )}

      {
    /* ── Modal Actividad ────────────────────────────────────────────────── */
  }
      {showActividadModal && selectedProveedor && <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {
    /* Header */
  }
            <div className="bg-gradient-to-r from-[#30475E] to-[#3d5a76] px-6 py-4 flex items-center justify-between rounded-t-2xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {selectedProveedor.nombre.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-bold leading-tight">{selectedProveedor.nombre}</p>
                  <p className="text-blue-200 text-xs">{selectedProveedor.nombreContacto} · {selectedProveedor.telefono}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
    onClick={() => descargarReporte(selectedProveedor)}
    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors"
  >
                  <Download className="w-3.5 h-3.5" />Reporte
                </button>
                <button onClick={() => setShowActividadModal(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {
    /* Tabs */
  }
            <div className="flex border-b border-gray-200 dark:border-gray-700 shrink-0">
              {[
    { key: "historial", label: "Historial de Compras", icon: <Clock className="w-4 h-4" /> },
    { key: "catalogo", label: "Cat\xE1logo de Productos", icon: <Package className="w-4 h-4" /> }
  ].map((t) => <button
    key={t.key}
    onClick={() => setActividadTab(t.key)}
    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all border-b-2 ${actividadTab === t.key ? "border-[#30475E] text-[#30475E] dark:text-blue-400 dark:border-blue-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
  >
                  {t.icon}{t.label}
                </button>)}
            </div>

            {
    /* Body */
  }
            <div className="flex-1 overflow-y-auto p-5">

              {
    /* ── Historial ── */
  }
              {actividadTab === "historial" && <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#30475E]/5 dark:bg-[#30475E]/20 rounded-xl p-3 text-center">
                      <p className="text-xs text-[#30475E] dark:text-blue-400 mb-0.5">Órdenes</p>
                      <p className="font-bold text-[#30475E] dark:text-blue-300 text-lg">{historialActivo.length}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                      <p className="text-xs text-green-600 dark:text-green-400 mb-0.5">Total facturado</p>
                      <p className="font-bold text-green-700 dark:text-green-300 text-sm">${totalFacturado.toLocaleString()}</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 text-center">
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-0.5">Pendientes</p>
                      <p className="font-bold text-yellow-700 dark:text-yellow-300 text-lg">{historialActivo.filter((h) => h.estado === "Pendiente").length}</p>
                    </div>
                  </div>

                  {historialActivo.length === 0 ? <div className="text-center py-12 text-gray-400">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Sin compras registradas</p>
                    </div> : <>
                      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <table className="w-full min-w-[480px] text-sm">
                          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                              {["Orden", "Fecha", "Insumo", "Cant.", "Total", "Estado"].map((h) => <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>)}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {historialVisible.map((h) => <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                                <td className="px-3 py-2.5 font-mono text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{h.id}</td>
                                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">{h.fecha}</td>
                                <td className="px-3 py-2.5 font-medium text-gray-800 dark:text-gray-100">{h.insumo}</td>
                                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">{h.cantidad} {h.unidad}</td>
                                <td className="px-3 py-2.5 font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">${h.total.toLocaleString()}</td>
                                <td className="px-3 py-2.5">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${estadoBadge(h.estado)}`}>{h.estado}</span>
                                </td>
                              </tr>)}
                          </tbody>
                        </table>
                      </div>
                      {historialActivo.length > 4 && <button
    onClick={() => setExpandirHistorial((v) => !v)}
    className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
  >
                          {expandirHistorial ? <><ChevronUp className="w-4 h-4" /> Ver menos</> : <><ChevronDown className="w-4 h-4" /> Ver {historialActivo.length - 4} órdenes más</>}
                        </button>}
                    </>}
                </div>}

              {
    /* ── Catálogo ── */
  }
              {actividadTab === "catalogo" && <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {productosActivo.filter((pr) => pr.disponible).length} de {productosActivo.length} productos disponibles
                  </p>
                  {productosActivo.length === 0 ? <div className="text-center py-12 text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Sin catálogo registrado</p>
                    </div> : <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <tr>
                            {["Producto", "Categor\xEDa", "Precio", "Estado"].map((h) => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                          {productosActivo.map((prod) => <tr key={prod.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                              <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{prod.nombre}</td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{prod.categoria}</td>
                              <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                ${prod.precioUnitario.toLocaleString()}<span className="text-xs font-normal text-gray-400">/{prod.unidad}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${prod.disponible ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500"}`}>
                                  {prod.disponible ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                  {prod.disponible ? "Disponible" : "No disponible"}
                                </span>
                              </td>
                            </tr>)}
                        </tbody>
                      </table>
                    </div>}
                </div>}
            </div>
          </div>
        </div>}

      {
    /* ── Modal Inactivar ────────────────────────────────────────────────── */
  }
      {showDeleteModal && selectedProveedor && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">¿Inactivar proveedor?</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Vas a inactivar a <span className="font-semibold text-gray-800 dark:text-gray-200">"{selectedProveedor.nombre}"</span>.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-6">
                El proveedor quedará en estado <span className="font-medium text-gray-700 dark:text-gray-300">Inactivo</span> y podrá reactivarse editando su estado.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancelar</button>
                <button onClick={handleInactivar} className="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-xl text-sm hover:bg-yellow-600 transition-colors font-medium">Inactivar</button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* ── Modal Formulario ───────────────────────────────────────────────── */
  }
      {showFormModal && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {selectedProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
              </h2>
              <button onClick={() => setShowFormModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nombre / Razón Social <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    className={`${inputCls} ${formSubmitted && !form.nombre.trim() ? "border-red-500" : ""}`}
                    placeholder="Ej: FruVer SA"
                  />
                  {formSubmitted && !form.nombre.trim() && (
                    <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>NIT / Cédula <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.nit}
                    onChange={(e) => setForm((f) => ({ ...f, nit: e.target.value }))}
                    className={`${inputCls} ${formSubmitted && !form.nit.trim() ? "border-red-500" : ""}`}
                    placeholder="000.000.000-0"
                  />
                  {formSubmitted && !form.nit.trim() && (
                    <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input type="tel" value={form.telefono} onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} className={inputCls} placeholder="604 000 0000" />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={`${inputCls} ${formSubmitted && form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "border-red-500" : ""}`}
                    placeholder="email@ejemplo.com"
                  />
                  {formSubmitted && form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                    <p className="text-red-500 text-xs mt-1">campo inválido</p>
                  )}
                </div>
              </div>
              <div>
                <label className={labelCls}>Nombre de Contacto</label>
                <input type="text" value={form.nombreContacto} onChange={(e) => setForm((f) => ({ ...f, nombreContacto: e.target.value }))} className={inputCls} placeholder="Nombre completo" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Tipo de Persona</label>
                  <select value={form.tipoPersona} onChange={(e) => setForm((f) => ({ ...f, tipoPersona: e.target.value }))} className={inputCls}>
                    <option value="Jurídica">Persona Jurídica</option>
                    <option value="Natural">Persona Natural</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Estado</label>
                  <select value={form.estado} onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))} className={inputCls}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button onClick={() => setShowFormModal(false)} className="px-5 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancelar</button>
              <button
                onClick={handleGuardar}
                className="px-5 py-2.5 bg-[#F05454] text-white rounded-xl text-sm hover:bg-red-600 transition-colors font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>}
    </div>;
}

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, AlertCircle, Package, X, TrendingDown, Bell, CheckCircle2, PlusCircle, Pencil, Clock, Filter, Trash, FlaskConical, ChevronDown, ChevronUp, Minus, RotateCcw } from "lucide-react";
import { Pagination } from "@/presentation/components/common/Pagination";
import { FichaTecnicaInsumo } from "@/presentation/pages/fichasTecnicas/FichaTecnicaInsumo";
import { useNotifications } from "@/domain/hooks/useNotifications";
const tipoConfig = {
  crear: { label: "Creado", icon: <PlusCircle className="w-4 h-4" />, bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
  editar: { label: "Editado", icon: <Pencil className="w-4 h-4" />, bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  eliminar: { label: "Eliminado", icon: <Trash className="w-4 h-4" />, bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  restaurar: { label: "Restaurado", icon: <RotateCcw className="w-4 h-4" />, bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", dot: "bg-purple-500" }
};
const insumosDataInitial = [
  { idInsumo: 1, nombre: "Tomate", idCategoriaInsumo: 2, categoriaNombre: "Verduras", stockActual: 45, unidadMedida: "kg", precioUnitario: 3500, stock: "Normal", idProveedor: 1, proveedorNombre: "FruVer SA" },
  { idInsumo: 2, nombre: "Lechuga", idCategoriaInsumo: 2, categoriaNombre: "Verduras", stockActual: 30, unidadMedida: "und", precioUnitario: 2e3, stock: "Normal", idProveedor: 1, proveedorNombre: "FruVer SA" },
  { idInsumo: 3, nombre: "Carne de Res", idCategoriaInsumo: 3, categoriaNombre: "Prote\xEDnas", stockActual: 8, unidadMedida: "kg", precioUnitario: 25e3, stock: "Bajo", idProveedor: 2, proveedorNombre: "Carnes Premium" },
  { idInsumo: 4, nombre: "Pollo", idCategoriaInsumo: 3, categoriaNombre: "Prote\xEDnas", stockActual: 25, unidadMedida: "kg", precioUnitario: 12e3, stock: "Normal", idProveedor: 3, proveedorNombre: "Av\xEDcola del Sur" },
  { idInsumo: 5, nombre: "Pan Hamburguesa", idCategoriaInsumo: 4, categoriaNombre: "Carbohidratos", stockActual: 15, unidadMedida: "paq", precioUnitario: 8500, stock: "Bajo", idProveedor: 5, proveedorNombre: "Panader\xEDa El Trigo" },
  { idInsumo: 6, nombre: "Papas", idCategoriaInsumo: 2, categoriaNombre: "Verduras", stockActual: 60, unidadMedida: "kg", precioUnitario: 4e3, stock: "Normal", idProveedor: 1, proveedorNombre: "FruVer SA" },
  { idInsumo: 7, nombre: "Queso Mozzarella", idCategoriaInsumo: 5, categoriaNombre: "L\xE1cteos", stockActual: 6, unidadMedida: "kg", precioUnitario: 18e3, stock: "Cr\xEDtico", idProveedor: 4, proveedorNombre: "L\xE1cteos del Valle" },
  { idInsumo: 8, nombre: "Salchicha Premium", idCategoriaInsumo: 3, categoriaNombre: "Prote\xEDnas", stockActual: 12, unidadMedida: "kg", precioUnitario: 15e3, stock: "Bajo", idProveedor: 2, proveedorNombre: "Carnes Premium" },
  { idInsumo: 9, nombre: "Coca Cola", idCategoriaInsumo: 7, categoriaNombre: "Bebidas", stockActual: 48, unidadMedida: "und", precioUnitario: 2500, stock: "Normal", idProveedor: 6, proveedorNombre: "Distribuidora Andina" },
  { idInsumo: 10, nombre: "Mayonesa", idCategoriaInsumo: 6, categoriaNombre: "Condimentos", stockActual: 20, unidadMedida: "und", precioUnitario: 6500, stock: "Normal", idProveedor: 7, proveedorNombre: "Alimentos del Caribe" }
];
export function Insumos() {
  const notify = useNotifications();
  const getStockStatus = (stockActual) => {
    const val = parseInt(stockActual);
    if (isNaN(val) || val <= 10) return "Crítico";
    if (val <= 20) return "Bajo";
    return "Normal";
  };
  const [insumosData, setInsumosData] = useState([]);

  const fetchInsumos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/insumos');
      if (response.ok) {
        const data = await response.json();
        setInsumosData(data.map(i => ({
          ...i,
          stockActual: Number(i.stock),
          precioUnitario: Number(i.precioUnitario || 0),
          categoriaNombre: i.categoriaNombre || 'Sin Categoría',
          proveedorNombre: i.proveedorNombre || 'Sin Proveedor'
        })));
      }
    } catch (error) {
      console.error('Error fetching insumos:', error);
      notify.error('Error', 'No se pudieron cargar los insumos');
    }
  };

  const fetchPreparados = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/insumos-preparados');
      if (response.ok) {
        const data = await response.json();
        const dataWithCosto = data.map(prep => {
          const costoTotal = prep.componentes ? prep.componentes.reduce((s, c) => s + (c.cantidad * c.precioUnitario), 0) : 0;
          return { ...prep, costoTotal };
        });
        setInsumosPreparados(dataWithCosto);
      }
    } catch (error) {
      console.error('Error fetching preparados:', error);
      notify.error('Error', 'No se pudieron cargar los insumos preparados');
    }
  };

  const [viewMode, setViewMode] = useState("activos"); // "activos" o "papelera"
  const [deletedInsumos, setDeletedInsumos] = useState([]);
  const [deletedPreparados, setDeletedPreparados] = useState([]);

  const fetchDeleted = async () => {
    try {
      const resIns = await fetch('http://localhost:5000/api/insumos/deleted');
      if (resIns.ok) {
        const data = await resIns.json();
        setDeletedInsumos(data.map(i => ({
          ...i,
          stockActual: Number(i.stock),
          precioUnitario: Number(i.precioUnitario || 0),
          categoriaNombre: i.categoriaNombre || 'Sin Categoría',
          proveedorNombre: i.proveedorNombre || 'Sin Proveedor'
        })));
      }
      const resPrep = await fetch('http://localhost:5000/api/insumos-preparados/deleted');
      if (resPrep.ok) {
        const data = await resPrep.json();
        const dataWithCosto = data.map(prep => {
          const costoTotal = prep.componentes ? prep.componentes.reduce((s, c) => s + (c.cantidad * c.precioUnitario), 0) : 0;
          return { ...prep, costoTotal };
        });
        setDeletedPreparados(dataWithCosto);
      }
    } catch (e) {
      console.error('Error fetching deleted:', e);
    }
  };

  useEffect(() => {
    if (viewMode === 'papelera') {
      fetchDeleted();
    }
  }, [viewMode]);

  const handleRestoreInsumo = async (id, nombre) => {
    try {
      const response = await fetch(`http://localhost:5000/api/insumos/${id}/restore`, { method: 'PUT' });
      if (response.ok) {
        notify.success("Restaurado", `Insumo "${nombre}" fue restaurado exitosamente`);
        registrarEvento(
          "restaurar",
          nombre,
          `Se restauró el insumo: ${nombre} desde la papelera`
        );
        fetchInsumos();
        fetchDeleted();
      }
    } catch (e) {
      console.error(e);
      notify.error("Error", "Error al restaurar");
    }
  };

  const handleRestorePreparado = async (id, nombre) => {
    try {
      const response = await fetch(`http://localhost:5000/api/insumos-preparados/${id}/restore`, { method: 'PUT' });
      if (response.ok) {
        notify.success("Restaurado", `Preparado "${nombre}" fue restaurado exitosamente`);
        registrarEvento(
          "restaurar",
          nombre,
          `Se restauró el insumo preparado: ${nombre} desde la papelera`
        );
        fetchPreparados();
        fetchDeleted();
      }
    } catch (e) {
      console.error(e);
      notify.error("Error", "Error al restaurar");
    }
  };

  const handlePermanentDeletePreparado = async (id, nombre) => {
    const ok = await notify.confirmDelete("¿Eliminar permanentemente?", `¿Estás seguro de eliminar permanentemente "${nombre}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    try {
      const response = await fetch(`http://localhost:5000/api/insumos-preparados/${id}/permanent`, { method: 'DELETE' });
      if (response.ok) {
        notify.success("Eliminado", `"${nombre}" fue eliminado permanentemente`);
        registrarEvento(
          "eliminar",
          nombre,
          `Se eliminó permanentemente el insumo preparado: ${nombre}`
        );
        fetchDeleted();
      } else {
        const errData = await response.json().catch(() => ({}));
        notify.error("Error", errData.message || "No se pudo eliminar permanentemente");
      }
    } catch (e) {
      console.error(e);
      notify.error("Error", "Error al eliminar permanentemente");
    }
  };

  const handlePermanentDeleteInsumo = async (id, nombre) => {
    const ok = await notify.confirmDelete("¿Eliminar permanentemente?", `¿Estás seguro de eliminar permanentemente "${nombre}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    try {
      const response = await fetch(`http://localhost:5000/api/insumos/${id}/permanent`, { method: 'DELETE' });
      if (response.ok) {
        notify.success("Eliminado", `"${nombre}" fue eliminado permanentemente`);
        registrarEvento(
          "eliminar",
          nombre,
          `Se eliminó permanentemente el insumo: ${nombre}`
        );
        fetchDeleted();
      } else {
        const errData = await response.json().catch(() => ({}));
        notify.error("Error", errData.message || "No se pudo eliminar permanentemente");
      }
    } catch (e) {
      console.error(e);
      notify.error("Error", "Error al eliminar permanentemente");
    }
  };

  const [categoriasData, setCategoriasData] = useState([]);
  const [proveedoresList, setProveedoresList] = useState([]);

  const fetchCategoriasYProveedores = async () => {
    try {
      const resCat = await fetch('http://localhost:5000/api/categorias-insumo');
      if (resCat.ok) setCategoriasData(await resCat.json());
      const resProv = await fetch('http://localhost:5000/api/proveedores');
      if (resProv.ok) setProveedoresList(await resProv.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTrazabilidad = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trazabilidad');
      if (response.ok) {
        setEventos(await response.json());
      }
    } catch (e) {
      console.error('Error fetching trazabilidad:', e);
    }
  };

  useEffect(() => {
    fetchInsumos();
    fetchPreparados();
    fetchCategoriasYProveedores();
    fetchTrazabilidad();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editFormSubmitted, setEditFormSubmitted] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [filterStock, setFilterStock] = useState("Todos");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [eventos, setEventos] = useState([]);
  const [showBandeja, setShowBandeja] = useState(false);
  const [filtroBandeja, setFiltroBandeja] = useState("todos");
  const [nextEventoId, setNextEventoId] = useState(1);
  const registrarEvento = async (tipo, entidadNombre, detalle) => {
    try {
      await fetch('http://localhost:5000/api/trazabilidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, entidadNombre, detalle })
      });
      fetchTrazabilidad();
    } catch (error) {
      console.error('Error al registrar evento:', error);
    }
  };

  const marcarTodosLeidos = async () => {
    try {
      await fetch('http://localhost:5000/api/trazabilidad/read-all', { method: 'PUT' });
      fetchTrazabilidad();
    } catch (e) { console.error(e); }
  };

  const limpiarBandeja = async () => {
    try {
      await fetch('http://localhost:5000/api/trazabilidad/clear', { method: 'DELETE' });
      fetchTrazabilidad();
    } catch (e) { console.error(e); }
  };
  const eventosFiltrados = filtroBandeja === "todos" ? eventos : eventos.filter((e) => e.tipo === filtroBandeja);
  const noLeidos = eventos.filter((e) => !e.leido).length;
  const formatFecha = (dateString) => {
    const d = new Date(dateString);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const [insumosPreparados, setInsumosPreparados] = useState([]);
  const [showModalPreparado, setShowModalPreparado] = useState(false);
  const [showVerPreparado, setShowVerPreparado] = useState(false);
  const [preparadoDetalle, setPreparadoDetalle] = useState(null);
  const [nextPreparadoId, setNextPreparadoId] = useState(1);
  const [editandoPreparadoId, setEditandoPreparadoId] = useState(null);
  const [searchInsumoComp, setSearchInsumoComp] = useState("");
  const [expandPreparados, setExpandPreparados] = useState(true);
  const emptyPreparado = { nombre: "", descripcion: "", precioVenta: "", unidadMedida: "und", componentes: [] };
  const [formPreparado, setFormPreparado] = useState(emptyPreparado);
  const costoFormPreparado = formPreparado.componentes.reduce(
    (s, c) => s + c.cantidad * c.precioUnitario,
    0
  );
  const agregarComponente = (insumo) => {
    if (formPreparado.componentes.find((c) => c.idInsumo === insumo.idInsumo)) return;
    setFormPreparado((prev) => ({
      ...prev,
      componentes: [...prev.componentes, {
        idInsumo: insumo.idInsumo,
        nombre: insumo.nombre,
        cantidad: 1,
        unidadMedida: insumo.unidadMedida,
        precioUnitario: insumo.precioUnitario
      }]
    }));
    setSearchInsumoComp("");
  };
  const quitarComponente = (idInsumo) => setFormPreparado((prev) => ({ ...prev, componentes: prev.componentes.filter((c) => c.idInsumo !== idInsumo) }));
  const actualizarCantidad = (idInsumo, delta) => setFormPreparado((prev) => ({
    ...prev,
    componentes: prev.componentes.map(
      (c) => c.idInsumo === idInsumo ? { ...c, cantidad: Math.max(0.1, parseFloat((c.cantidad + delta).toFixed(2))) } : c
    )
  }));
  const handleGuardarPreparado = async () => {
    if (!formPreparado.nombre.trim() || formPreparado.componentes.length === 0) return;
    const base = {
      nombre: formPreparado.nombre.trim(),
      descripcion: formPreparado.descripcion.trim(),
      unidadMedida: formPreparado.unidadMedida || "und",
      precioVenta: parseFloat(formPreparado.precioVenta) || 0,
      componentes: formPreparado.componentes,
      costoTotal: costoFormPreparado
    };
    
    try {
      if (editandoPreparadoId !== null) {
        const response = await fetch(`http://localhost:5000/api/insumos-preparados/${editandoPreparadoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(base)
        });
        if (response.ok) {
          await fetchPreparados();
          registrarEvento("editar", base.nombre, `Se actualizaron los datos del insumo preparado: ${base.nombre}`);
          setEditandoPreparadoId(null);
          setFormPreparado(emptyPreparado);
          setShowModalPreparado(false);
          notify.success("Insumo preparado actualizado", `"${base.nombre}" se actualizó correctamente`);
        } else {
          notify.error("Error", "No se pudo actualizar");
        }
      } else {
        const response = await fetch('http://localhost:5000/api/insumos-preparados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(base)
        });
        if (response.ok) {
          await fetchPreparados();
          registrarEvento("crear", base.nombre, `Se registró el nuevo insumo preparado: ${base.nombre}`);
          setFormPreparado(emptyPreparado);
          setShowModalPreparado(false);
          notify.success("Insumo preparado creado", `"${base.nombre}" se guardó correctamente`);
        } else {
          notify.error("Error", "No se pudo crear");
        }
      }
    } catch (error) {
      console.error(error);
      notify.error("Error", "Error de conexión");
    }
  };

  const eliminarPreparado = async (prep) => {
    const ok = await notify.confirmDelete("¿Eliminar insumo preparado?", `¿Eliminar "${prep.nombre}"?`);
    if (!ok) return;

    try {
      const response = await fetch(`http://localhost:5000/api/insumos-preparados/${prep.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchPreparados();
        registrarEvento("eliminar", prep.nombre, `Se eliminó del sistema el insumo preparado: ${prep.nombre}`);
        notify.success("Eliminado", `"${prep.nombre}" fue eliminado`);
      } else {
        notify.error("Error", "No se pudo eliminar");
      }
    } catch (error) {
      console.error(error);
      notify.error("Error", "Error de conexión");
    }
  };
  const abrirEditarPreparado = (prep) => {
    setEditandoPreparadoId(prep.id);
    setFormPreparado({
      nombre: prep.nombre,
      descripcion: prep.descripcion,
      precioVenta: String(prep.precioVenta ?? ""),
      unidadMedida: prep.unidadMedida,
      componentes: prep.componentes.map((c) => ({ ...c }))
    });
    setSearchInsumoComp("");
    setShowModalPreparado(true);
  };
  const insumosSugeridos = insumosData.filter((i) => {
    const t = searchInsumoComp.trim().toLowerCase();
    return t.length > 0 && i.nombre.toLowerCase().includes(t) && !formPreparado.componentes.find((c) => c.idInsumo === i.idInsumo);
  }).slice(0, 6);
  const [newInsumo, setNewInsumo] = useState({
    nombre: "",
    idCategoriaInsumo: "",
    stockActual: "",
    unidadMedida: "kg",
    precioUnitario: "",
    idProveedor: "",
    descripcion: "",
    fichaTecnica: null
  });
  const [editInsumo, setEditInsumo] = useState(null);
  const openEdit = (i) => {
    setSelectedInsumo(i);
    setEditInsumo({ ...i });
    setShowEditModal(true);
  };
  const closeEdit = () => {
    setShowEditModal(false);
    setSelectedInsumo(null);
    setEditInsumo(null);
  };
  const openDelete = (i) => {
    setSelectedInsumo(i);
    setShowDeleteModal(true);
  };
  const closeDelete = () => {
    setShowDeleteModal(false);
    setSelectedInsumo(null);
  };
  const handleSaveNewInsumo = async () => {
    setFormSubmitted(true);
    if (
      !newInsumo.nombre.trim() ||
      !newInsumo.idCategoriaInsumo ||
      !newInsumo.idProveedor ||
      newInsumo.stockActual.toString().trim() === "" ||
      parseInt(newInsumo.stockActual) < 0 ||
      newInsumo.precioUnitario.toString().trim() === "" ||
      parseFloat(newInsumo.precioUnitario) < 0
    ) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/insumos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newInsumo.nombre,
          idCategoriaInsumo: parseInt(newInsumo.idCategoriaInsumo),
          stock: parseInt(newInsumo.stockActual) || 0,
          unidadMedida: newInsumo.unidadMedida,
          precioUnitario: parseFloat(newInsumo.precioUnitario) || 0,
          idProveedor: parseInt(newInsumo.idProveedor) || 1,
          descripcion: newInsumo.descripcion || ''
        })
      });

      if (response.ok) {
        await fetchInsumos();
        setShowModal(false);
        setNewInsumo({ nombre: "", idCategoriaInsumo: "", stockActual: "", unidadMedida: "kg", precioUnitario: "", idProveedor: "", descripcion: "", fichaTecnica: null });
        setFormSubmitted(false);
        registrarEvento(
          "crear",
          newInsumo.nombre,
          `Se ingresó al inventario el insumo: ${newInsumo.nombre} con ${newInsumo.stockActual} ${newInsumo.unidadMedida}`
        );
        notify.success("Insumo creado", "El insumo se agregó correctamente");
      } else {
        notify.error("Error", "No se pudo guardar el insumo");
      }
    } catch (error) {
      console.error(error);
      notify.error("Error", "Fallo de conexión al guardar el insumo");
    }
  };
  const handleSaveEditInsumo = async () => {
    setEditFormSubmitted(true);
    if (
      !editInsumo ||
      !editInsumo.nombre.trim() ||
      !editInsumo.idCategoriaInsumo ||
      !editInsumo.idProveedor ||
      editInsumo.stockActual === "" ||
      editInsumo.stockActual === undefined ||
      parseInt(editInsumo.stockActual) < 0 ||
      editInsumo.precioUnitario === "" ||
      editInsumo.precioUnitario === undefined ||
      parseFloat(editInsumo.precioUnitario) < 0
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/insumos/${editInsumo.idInsumo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: editInsumo.nombre,
          idCategoriaInsumo: parseInt(editInsumo.idCategoriaInsumo),
          stock: parseInt(editInsumo.stockActual),
          unidadMedida: editInsumo.unidadMedida,
          precioUnitario: parseFloat(editInsumo.precioUnitario) || 0,
          idProveedor: parseInt(editInsumo.idProveedor) || 1,
          descripcion: editInsumo.descripcion || ''
        })
      });

      if (response.ok) {
        await fetchInsumos();
        setEditFormSubmitted(false);
        registrarEvento("editar", editInsumo.nombre, `Se modificaron las propiedades del insumo: ${editInsumo.nombre}`);
        closeEdit();
        notify.success("Insumo actualizado", "Los cambios se guardaron correctamente");
      } else {
        notify.error("Error", "No se pudo actualizar el insumo");
      }
    } catch (error) {
      console.error(error);
      notify.error("Error", "Fallo de conexión al actualizar el insumo");
    }
  };
  const handleDeleteInsumo = async () => {
    if (!selectedInsumo) return;
    const nombre = selectedInsumo.nombre;

    try {
      const response = await fetch(`http://localhost:5000/api/insumos/${selectedInsumo.idInsumo}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchInsumos();
        registrarEvento(
          "eliminar",
          nombre,
          `Se eliminó del inventario el insumo: ${nombre}`
        );
        closeDelete();
        notify.success("Insumo eliminado", "El insumo se eliminó correctamente");
      } else {
        const errData = await response.json().catch(() => ({}));
        notify.error("Error", errData.message || "No se pudo eliminar el insumo");
      }
    } catch (error) {
      console.error(error);
      notify.error("Error", "Fallo de conexión al eliminar el insumo");
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const idsEnPreparados = new Set(insumosPreparados.flatMap((p) => p.componentes.map((c) => c.idInsumo)));
  const filteredInsumos = insumosData.filter((i) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = term === "" || i.nombre.toLowerCase().includes(term) || i.categoriaNombre.toLowerCase().includes(term) || i.proveedorNombre.toLowerCase().includes(term);
    const matchesStock = filterStock === "Todos" || getStockStatus(i.stockActual) === filterStock;
    const esEnPreparado = idsEnPreparados.has(i.idInsumo);
    const matchesTipo = filterTipo === "todos" || filterTipo === "preparado" && esEnPreparado || filterTipo === "base" && !esEnPreparado;
    return matchesSearch && matchesStock && matchesTipo;
  });
  const totalPages = Math.max(1, Math.ceil(filteredInsumos.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInsumos = filteredInsumos.slice(startIndex, startIndex + itemsPerPage);
  const getStockBadge = (stockActual) => {
    const status = getStockStatus(stockActual);
    switch (status) {
      case "Crítico":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      case "Bajo":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    }
  };
  const totalNormal = insumosData.filter((i) => getStockStatus(i.stockActual) === "Normal").length;
  const totalBajo = insumosData.filter((i) => getStockStatus(i.stockActual) === "Bajo").length;
  const totalCritico = insumosData.filter((i) => getStockStatus(i.stockActual) === "Crítico").length;
  return <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-full">

      {
    /* Header */
  }
      <div className="mb-4 sm:mb-6 lg:mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Insumos</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Administra el inventario de insumos del negocio</p>
        </div>
        <button
    onClick={() => {
      setShowBandeja(true);
      marcarTodosLeidos();
    }}
    className="relative flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md text-gray-700 dark:text-gray-300 transition-all shrink-0"
    title="Bandeja de trazabilidad"
  >
          <Bell className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Trazabilidad</span>
          {noLeidos > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#F05454] text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
              {noLeidos > 9 ? "9+" : noLeidos}
            </span>}
        </button>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <Package className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Total Insumos</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{insumosData.length}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">registrados</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <Package className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Stock Normal</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalNormal}</p>
            <p className="text-green-600 dark:text-green-400 text-xs mt-1">en buen estado</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Stock Bajo</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalBajo}</p>
            <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">requieren atención</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 lg:p-6 flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0 hover:shadow-md transition-shadow">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl shrink-0 lg:w-fit lg:mb-3">
            <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">Agotados / Críticos</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalCritico}</p>
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">reabastecer urgente</p>
          </div>
        </div>
      </div>

      {
    /* Search & Filter Bar */
  }
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 mb-4 sm:mb-6">
        {
    /* Fila 1: buscador + filtro */
  }
        <div className="flex gap-3 items-center mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
    type="text"
    placeholder="Buscar insumo..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
  />
          </div>
          <select
    value={filterStock}
    onChange={(e) => {
      setFilterStock(e.target.value);
      setCurrentPage(1);
    }}
    className="shrink-0 px-3 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
  >
            <option>Todos</option>
            <option>Normal</option>
            <option>Bajo</option>
            <option>Crítico</option>
          </select>
          <select
    value={filterTipo}
    onChange={(e) => {
      setFilterTipo(e.target.value);
      setCurrentPage(1);
    }}
    className="shrink-0 px-3 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#30475E] focus:border-transparent outline-none transition"
  >
            <option value="todos">Todos los tipos</option>
            <option value="base">Solo base</option>
            <option value="preparado">En preparados</option>
          </select>
        </div>
        {
    /* Fila 2: botones de acción */
  }
        <div className="flex gap-2">
          {viewMode === "activos" ? (
            <>
              <button
                onClick={() => {
                  setFormPreparado(emptyPreparado);
                  setSearchInsumoComp("");
                  setShowModalPreparado(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#30475E] text-white rounded-xl hover:bg-[#253a4e] active:scale-95 transition-all font-medium text-sm shadow-sm"
              >
                <FlaskConical className="w-4 h-4 shrink-0" />
                <span>Insumo Preparado</span>
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-red-600 active:scale-95 transition-all font-medium text-sm shadow-sm"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Nuevo Insumo</span>
              </button>
            </>
          ) : (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setViewMode("activos")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-200 active:scale-95 transition-all font-medium text-sm shadow-sm"
              >
                <Package className="w-4 h-4 shrink-0" />
                <span>Volver a Activos</span>
              </button>
              <button
                onClick={() => {
                  setShowBandeja(true);
                  marcarTodosLeidos();
                }}
                className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md text-gray-700 dark:text-gray-300 transition-all font-medium text-sm"
                title="Bandeja de trazabilidad"
              >
                <Bell className="w-4 h-4 shrink-0" />
                <span>Trazabilidad</span>
                {noLeidos > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#F05454] text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                  {noLeidos > 9 ? "9+" : noLeidos}
                </span>}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {viewMode === "papelera" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 sm:p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-gray-500" /> Papelera de Reciclaje
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 border-b pb-2 dark:border-gray-700">Insumos Eliminados</h3>
              {deletedInsumos.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No hay insumos en la papelera.</p>
              ) : (
                <div className="space-y-2">
                  {deletedInsumos.map(ins => (
                    <div key={ins.idInsumo} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{ins.nombre}</p>
                        <p className="text-xs text-gray-500">{ins.categoriaNombre} • {ins.unidadMedida}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleRestoreInsumo(ins.idInsumo, ins.nombre)} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restaurar
                        </button>
                        <button onClick={() => handlePermanentDeleteInsumo(ins.idInsumo, ins.nombre)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors flex items-center gap-1">
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 border-b pb-2 dark:border-gray-700">Insumos Preparados Eliminados</h3>
              {deletedPreparados.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No hay preparados en la papelera.</p>
              ) : (
                <div className="space-y-2">
                  {deletedPreparados.map(prep => (
                    <div key={prep.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{prep.nombre}</p>
                        <p className="text-xs text-gray-500">Costo Total: ${prep.costoTotal.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleRestorePreparado(prep.id, prep.nombre)} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restaurar
                        </button>
                        <button onClick={() => handlePermanentDeletePreparado(prep.id, prep.nombre)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors flex items-center gap-1">
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {viewMode === "activos" && (
        <>
      {
    /* ── Insumos Preparados ─────────────────────────────────────────────── */
  }
      {insumosPreparados.length > 0 && <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-[#30475E]/20 dark:border-[#30475E]/40 mb-4 sm:mb-6 overflow-hidden">
          <button
    onClick={() => setExpandPreparados((v) => !v)}
    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
  >
            <div className="flex items-center gap-3">
              <div className="bg-[#30475E]/10 dark:bg-[#30475E]/30 p-2 rounded-xl">
                <FlaskConical className="w-5 h-5 text-[#30475E] dark:text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 dark:text-gray-100">Insumos Preparados</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{insumosPreparados.length} receta{insumosPreparados.length !== 1 ? "s" : ""} guardada{insumosPreparados.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            {expandPreparados ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {expandPreparados && <div className="border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              {insumosPreparados.map((prep) => <div key={prep.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="bg-[#30475E]/10 dark:bg-[#30475E]/30 p-2 rounded-xl shrink-0">
                        <FlaskConical className="w-4 h-4 text-[#30475E] dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800 dark:text-gray-100">{prep.nombre}</p>
                          <span className="px-2 py-0.5 bg-[#30475E]/10 dark:bg-[#30475E]/30 text-[#30475E] dark:text-blue-300 text-xs rounded-full font-medium">
                            Preparado
                          </span>
                        </div>
                        {prep.descripcion && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{prep.descripcion}</p>}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {prep.componentes.map((c) => <span key={c.idInsumo} className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                              <Package className="w-3 h-3" />{c.nombre} × {c.cantidad}{c.unidadMedida}
                            </span>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="text-right">
                        <p className="font-bold text-[#30475E] dark:text-blue-300 text-sm">${prep.precioVenta ? prep.precioVenta.toLocaleString() : prep.costoTotal?.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">por {prep.unidadMedida}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
    onClick={() => {
      setPreparadoDetalle(prep);
      setShowVerPreparado(true);
    }}
    className="p-1.5 text-[#30475E] dark:text-blue-400 hover:bg-[#30475E]/10 dark:hover:bg-[#30475E]/30 rounded-lg transition-colors"
    title="Ver detalle"
  >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                        <button
    onClick={() => abrirEditarPreparado(prep)}
    className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
    title="Editar"
  >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
    onClick={() => eliminarPreparado(prep)}
    className="p-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
    title="Eliminar"
  >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>}
        </div>}

      {
    /* Insumos Cards Grid — mobile */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 lg:hidden">
        {currentInsumos.map((insumo) => <div
    key={insumo.idInsumo}
    className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 hover:shadow-md transition-shadow"
  >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="bg-[#30475E]/10 dark:bg-blue-900/30 p-2 rounded-xl shrink-0">
                  <Package className="w-4 h-4 text-[#30475E] dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{insumo.nombre}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{insumo.categoriaNombre}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${getStockBadge(insumo.stock)}`}>
                {insumo.stock}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5">
                <p className="text-gray-500 dark:text-gray-400 mb-0.5">Cantidad</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{insumo.stockActual} {insumo.unidadMedida}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5">
                <p className="text-gray-500 dark:text-gray-400 mb-0.5">Precio Unit.</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">${insumo.precioUnitario.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{insumo.proveedorNombre}</p>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(insumo)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors" title="Editar">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => openDelete(insumo)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>)}
        {currentInsumos.length === 0 && <div className="col-span-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            No se encontraron insumos.
          </div>}
      </div>

      {
    /* Insumos Table — desktop */
  }
      <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Categoría</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cantidad</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Precio Unit.</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Proveedor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {currentInsumos.map((insumo) => <tr key={insumo.idInsumo} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{insumo.idInsumo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-[#30475E]/10 dark:bg-blue-900/30 p-1.5 rounded-lg shrink-0">
                        <Package className="w-3.5 h-3.5 text-[#30475E] dark:text-blue-400" />
                      </div>
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{insumo.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{insumo.categoriaNombre}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">{insumo.stockActual} {insumo.unidadMedida}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">${insumo.precioUnitario.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{insumo.proveedorNombre}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStockBadge(insumo.stockActual)}`}>
                      {getStockStatus(insumo.stockActual)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(insumo)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => openDelete(insumo)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>)}
              {currentInsumos.length === 0 && <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No se encontraron insumos.
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
    totalItems={filteredInsumos.length}
    onItemsPerPageChange={setItemsPerPage}
  />
        </div>
      </div>

      {
    /* Pagination for mobile */
  }
      <div className="lg:hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 px-4">
        <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
    itemsPerPage={itemsPerPage}
    totalItems={filteredInsumos.length}
    onItemsPerPageChange={setItemsPerPage}
  />
      </div>

      {
    /* Edit Modal */
  }
      {showEditModal && selectedInsumo && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Editar Insumo</h2>
              <button onClick={closeEdit} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={editInsumo?.nombre || ""}
                    onChange={(e) => setEditInsumo({ ...editInsumo, nombre: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition ${
                      editFormSubmitted && !editInsumo?.nombre?.trim()
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    }`}
                  />
                  {editFormSubmitted && !editInsumo?.nombre?.trim() && (
                    <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría <span className="text-red-500">*</span></label>
                  <select
                    value={editInsumo?.idCategoriaInsumo || ""}
                    onChange={(e) => setEditInsumo({ ...editInsumo, idCategoriaInsumo: parseInt(e.target.value) })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition ${
                      editFormSubmitted && !editInsumo?.idCategoriaInsumo
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    {categoriasData.map(cat => (
                      <option key={cat.idCategoriaInsumo || cat.id} value={cat.idCategoriaInsumo || cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  {editFormSubmitted && !editInsumo?.idCategoriaInsumo && (
                    <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unidades a ingresar <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={editInsumo?.stockActual || 0}
                    onChange={(e) => setEditInsumo({ ...editInsumo, stockActual: e.target.value === "" ? "" : parseInt(e.target.value) })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition ${
                      editFormSubmitted && (editInsumo?.stockActual === "" || editInsumo?.stockActual === undefined || parseInt(editInsumo.stockActual) < 0)
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    }`}
                  />
                  {editFormSubmitted && (editInsumo?.stockActual === "" || editInsumo?.stockActual === undefined) && (
                    <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                  )}
                  {editFormSubmitted && editInsumo?.stockActual !== "" && editInsumo?.stockActual !== undefined && parseInt(editInsumo.stockActual) < 0 && (
                    <p className="text-red-500 text-xs mt-1">campo inválido</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unidad de Medida</label>
                  <select
                    value={editInsumo?.unidadMedida || "kg"}
                    onChange={(e) => setEditInsumo({ ...editInsumo, unidadMedida: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  >
                    <option>kg</option>
                    <option>und</option>
                    <option>lt</option>
                    <option>paq</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Precio Unitario <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={editInsumo?.precioUnitario || 0}
                    onChange={(e) => setEditInsumo({ ...editInsumo, precioUnitario: e.target.value === "" ? "" : parseFloat(e.target.value) })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition ${
                      editFormSubmitted && (editInsumo?.precioUnitario === "" || editInsumo?.precioUnitario === undefined || parseFloat(editInsumo.precioUnitario) < 0)
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    }`}
                  />
                  {editFormSubmitted && (editInsumo?.precioUnitario === "" || editInsumo?.precioUnitario === undefined) && (
                    <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                  )}
                  {editFormSubmitted && editInsumo?.precioUnitario !== "" && editInsumo?.precioUnitario !== undefined && parseFloat(editInsumo.precioUnitario) < 0 && (
                    <p className="text-red-500 text-xs mt-1">campo inválido</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proveedor <span className="text-red-500">*</span></label>
                <select
                  value={editInsumo?.idProveedor || ""}
                  onChange={(e) => setEditInsumo({ ...editInsumo, idProveedor: parseInt(e.target.value) })}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition ${
                    editFormSubmitted && !editInsumo?.idProveedor
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  }`}
                >
                  <option value="">Seleccionar proveedor...</option>
                  {proveedoresList.map(prov => (
                    <option key={prov.idProveedor} value={prov.idProveedor}>
                      {prov.nombre}
                    </option>
                  ))}
                </select>
                {editFormSubmitted && !editInsumo?.idProveedor && (
                  <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado de Stock (Calculado)</label>
                <select
                  value={editInsumo ? getStockStatus(editInsumo.stockActual) : "Normal"}
                  disabled={true}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-gray-50 opacity-70 cursor-not-allowed"
                >
                  <option>Normal</option>
                  <option>Bajo</option>
                  <option>Crítico</option>
                </select>
              </div>
              <FichaTecnicaInsumo
                insumoId={selectedInsumo.idInsumo}
                insumoName={selectedInsumo.nombre}
                initialData={editInsumo?.fichaTecnica || selectedInsumo.fichaTecnica || null}
                onSave={(data) => setEditInsumo({ ...editInsumo, fichaTecnica: data })}
              />
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button onClick={closeEdit} className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancelar</button>
              <button onClick={handleSaveEditInsumo} className="px-6 py-2.5 bg-[#F05454] text-white rounded-xl text-sm hover:bg-red-600 transition-colors font-medium">Guardar Cambios</button>
            </div>
          </div>
        </div>}

      {
    /* Delete Modal */
  }
      {showDeleteModal && selectedInsumo && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">¿Eliminar insumo?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-1 text-sm">
                Vas a eliminar <span className="font-semibold text-gray-800 dark:text-gray-200">"{selectedInsumo.nombre}"</span>.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button onClick={closeDelete} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium dark:text-gray-300">Cancelar</button>
                <button onClick={handleDeleteInsumo} className="flex-1 px-4 py-2.5 bg-[#F05454] text-white rounded-xl text-sm hover:bg-red-600 transition-colors font-medium">Eliminar</button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* ── Modal: Crear Insumo Preparado ────────────────────────────────────── */
  }
      {showModalPreparado && <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

            {
    /* Header */
  }
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#30475E]/10 dark:bg-[#30475E]/30 p-2 rounded-xl">
                  <FlaskConical className="w-5 h-5 text-[#30475E] dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {editandoPreparadoId !== null ? "Editar Insumo Preparado" : "Nuevo Insumo Preparado"}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {editandoPreparadoId !== null ? "Modifica los datos y componentes del preparado" : "Combina insumos existentes para crear una receta"}
                  </p>
                </div>
              </div>
              <button onClick={() => {
    setShowModalPreparado(false);
    setEditandoPreparadoId(null);
    setFormPreparado(emptyPreparado);
  }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {
    /* Datos generales */
  }
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre del insumo preparado <span className="text-red-500">*</span></label>
                  <input
    type="text"
    value={formPreparado.nombre}
    onChange={(e) => setFormPreparado((p) => ({ ...p, nombre: e.target.value }))}
    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#30475E] focus:border-transparent outline-none transition"
    placeholder="Ej: Salsa de la Casa, Carne Especial, Aderezo BBQ..."
  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descripción <span className="text-gray-400 font-normal text-xs">(opcional)</span></label>
                  <textarea
    value={formPreparado.descripcion}
    onChange={(e) => setFormPreparado((p) => ({ ...p, descripcion: e.target.value }))}
    rows={2}
    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#30475E] focus:border-transparent outline-none transition resize-none"
    placeholder="Receta, uso o modo de preparación..."
  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Precio del insumo preparado <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                    <input
    type="number"
    min="0"
    value={formPreparado.precioVenta}
    onChange={(e) => setFormPreparado((p) => ({ ...p, precioVenta: e.target.value }))}
    className="w-full pl-7 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#30475E] focus:border-transparent outline-none transition"
    placeholder="0"
  />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Unidad de medida
                  </label>
                  <select
    value={formPreparado.unidadMedida}
    onChange={(e) => setFormPreparado((p) => ({ ...p, unidadMedida: e.target.value }))}
    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#30475E] focus:border-transparent outline-none transition"
  >
                    <option value="und">und — unidad</option>
                    <option value="kg">kg — kilogramo</option>
                    <option value="gr">gr — gramo</option>
                    <option value="lt">lt — litro</option>
                    <option value="ml">ml — mililitro</option>
                    <option value="paq">paq — paquete</option>
                    <option value="taza">taza</option>
                    <option value="porción">porción</option>
                  </select>
                </div>
              </div>

              {
    /* Buscador de insumos */
  }
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Agregar insumos <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal text-xs ml-1">— busca y selecciona los insumos que componen este preparado</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
    type="text"
    value={searchInsumoComp}
    onChange={(e) => setSearchInsumoComp(e.target.value)}
    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#30475E] focus:border-transparent outline-none transition"
    placeholder="Buscar insumo por nombre..."
  />
                  {
    /* Dropdown de sugerencias */
  }
                  {insumosSugeridos.length > 0 && <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {insumosSugeridos.map((ins) => <button
    key={ins.idInsumo}
    type="button"
    onClick={() => agregarComponente(ins)}
    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#30475E]/5 dark:hover:bg-[#30475E]/20 transition-colors text-left"
  >
                          <div className="flex items-center gap-2.5">
                            <div className="bg-[#30475E]/10 p-1.5 rounded-lg shrink-0">
                              <Package className="w-3.5 h-3.5 text-[#30475E] dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{ins.nombre}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{ins.categoriaNombre}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-semibold text-[#30475E] dark:text-blue-300">${ins.precioUnitario.toLocaleString()}/{ins.unidadMedida}</p>
                            <p className="text-xs text-gray-400">Stock: {ins.stockActual}</p>
                          </div>
                        </button>)}
                    </div>}
                </div>
              </div>

              {
    /* Tabla de componentes seleccionados */
  }
              {formPreparado.componentes.length > 0 ? <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Componentes seleccionados ({formPreparado.componentes.length})
                  </p>

                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <table className="w-full min-w-[480px] text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-[35%]">Insumo</th>
                          <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-[22%]">Cantidad</th>
                          <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-[20%]">Unidad</th>
                          <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-[15%]">Precio</th>
                          <th className="w-[8%]" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {formPreparado.componentes.map((comp) => <tr key={comp.idInsumo} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">

                            {
    /* Nombre */
  }
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#30475E]/10 dark:bg-[#30475E]/30 rounded-md flex items-center justify-center shrink-0">
                                  <Package className="w-3 h-3 text-[#30475E] dark:text-blue-400" />
                                </div>
                                <span className="font-medium text-gray-800 dark:text-gray-100 truncate">{comp.nombre}</span>
                              </div>
                            </td>

                            {
    /* Cantidad con +/- */
  }
                            <td className="px-3 py-3">
                              <div className="flex items-center justify-center gap-1">
                                <button
    type="button"
    onClick={() => actualizarCantidad(comp.idInsumo, -0.5)}
    className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors shrink-0"
  >
                                  <Minus className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                </button>
                                <input
    type="number"
    min="0.1"
    step="0.1"
    value={comp.cantidad}
    onChange={(e) => setFormPreparado((prev) => ({
      ...prev,
      componentes: prev.componentes.map(
        (c) => c.idInsumo === comp.idInsumo ? { ...c, cantidad: parseFloat(e.target.value) || 0.1 } : c
      )
    }))}
    className="w-14 text-center text-sm font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md py-1 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-[#30475E]/50"
  />
                                <button
    type="button"
    onClick={() => actualizarCantidad(comp.idInsumo, 0.5)}
    className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors shrink-0"
  >
                                  <Plus className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                </button>
                              </div>
                            </td>

                            {
    /* Unidad editable */
  }
                            <td className="px-3 py-3">
                              <select
    value={comp.unidadMedida}
    onChange={(e) => setFormPreparado((prev) => ({
      ...prev,
      componentes: prev.componentes.map(
        (c) => c.idInsumo === comp.idInsumo ? { ...c, unidadMedida: e.target.value } : c
      )
    }))}
    className="w-full px-2 py-1.5 text-xs font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#30475E]/50 cursor-pointer"
  >
                                <option value="kg">kg</option>
                                <option value="und">und</option>
                                <option value="lt">lt</option>
                                <option value="paq">paq</option>
                                <option value="gr">gr</option>
                                <option value="ml">ml</option>
                                <option value="taza">taza</option>
                                <option value="porción">porción</option>
                              </select>
                            </td>

                            {
    /* Precio unitario */
  }
                            <td className="px-4 py-3 text-right">
                              <span className="font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                ${comp.precioUnitario.toLocaleString()}
                              </span>
                            </td>

                            {
    /* Quitar */
  }
                            <td className="pr-3 py-3 text-center">
                              <button
    type="button"
    onClick={() => quitarComponente(comp.idInsumo)}
    className="w-7 h-7 flex items-center justify-center mx-auto text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
    title="Quitar"
  >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>

                  {
    /* Costo total de ingredientes */
  }
                  <div className="bg-[#30475E]/5 dark:bg-[#30475E]/20 border border-[#30475E]/20 dark:border-[#30475E]/40 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#30475E] dark:text-blue-300">Costo total de ingredientes</span>
                    <span className="text-base font-bold text-[#30475E] dark:text-blue-200">${costoFormPreparado.toLocaleString()}</span>
                  </div>
                </div> : <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-8 text-center">
                  <FlaskConical className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Busca y agrega insumos para componer esta receta</p>
                </div>}
            </div>

            {
    /* Footer */
  }
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 shrink-0">
              <button
    onClick={() => {
      setShowModalPreparado(false);
      setEditandoPreparadoId(null);
      setFormPreparado(emptyPreparado);
    }}
    className="px-5 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
  >
                Cancelar
              </button>
              <button
    onClick={handleGuardarPreparado}
    disabled={!formPreparado.nombre.trim() || formPreparado.componentes.length === 0}
    className="px-5 py-2.5 bg-[#30475E] text-white rounded-xl text-sm font-medium hover:bg-[#253a4e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
  >
                <FlaskConical className="w-4 h-4" />
                {editandoPreparadoId !== null ? "Guardar Cambios" : "Guardar Insumo Preparado"}
              </button>
            </div>
          </div>
        </div>}

      {
    /* ── Modal: Ver Detalle de Insumo Preparado ────────────────────────────── */
  }
      {showVerPreparado && preparadoDetalle && <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {
    /* Header */
  }
            <div className="sticky top-0 bg-gradient-to-r from-[#30475E] to-[#3d5a76] px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">{preparadoDetalle.nombre}</p>
                  <p className="text-blue-200 text-xs">Insumo Preparado</p>
                </div>
              </div>
              <button onClick={() => {
    setShowVerPreparado(false);
    setPreparadoDetalle(null);
  }} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {
    /* Descripción */
  }
              {preparadoDetalle.descripcion && <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  {preparadoDetalle.descripcion}
                </p>}

              {
    /* Info rápida */
  }
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#30475E]/5 dark:bg-[#30475E]/20 rounded-xl p-3 text-center">
                  <p className="text-xs text-[#30475E] dark:text-blue-400 mb-0.5">Unidad de medida</p>
                  <p className="font-bold text-[#30475E] dark:text-blue-300">{preparadoDetalle.unidadMedida}</p>
                </div>
                <div className="bg-[#30475E]/5 dark:bg-[#30475E]/20 rounded-xl p-3 text-center">
                  <p className="text-xs text-[#30475E] dark:text-blue-400 mb-0.5">Precio de venta</p>
                  <p className="font-bold text-[#30475E] dark:text-blue-300">${(preparadoDetalle.precioVenta ?? preparadoDetalle.costoTotal).toLocaleString()}</p>
                </div>
              </div>

              {
    /* Componentes */
  }
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Ingredientes ({preparadoDetalle.componentes.length})
                </p>
                <div className="space-y-2">
                  {preparadoDetalle.componentes.map((c, i) => <div key={c.idInsumo} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                      <span className="w-6 h-6 bg-[#30475E] text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{c.nombre}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{c.cantidad} {c.unidadMedida} × ${c.precioUnitario.toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 shrink-0">
                        ${(c.cantidad * c.precioUnitario).toLocaleString()}
                      </p>
                    </div>)}
                </div>

                {
    /* Totales */
  }
                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between px-4">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal ingredientes</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">${preparadoDetalle.costoTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 bg-[#30475E] rounded-xl">
                    <span className="font-bold text-white">Costo total</span>
                    <span className="font-bold text-white">${preparadoDetalle.costoTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
                Creado: {formatFecha(preparadoDetalle.fechaCreacion)}
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button
    onClick={() => {
      setShowVerPreparado(false);
      setPreparadoDetalle(null);
    }}
    className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
  >
                Cerrar
              </button>
            </div>
          </div>
        </div>}

      {
    /* ── Bandeja de Trazabilidad ─────────────────────────────────────────── */
  }
      {showBandeja && <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {
    /* Header */
  }
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#F05454]/10 dark:bg-red-900/30 p-2 rounded-xl">
                  <Bell className="w-5 h-5 text-[#F05454] dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Trazabilidad de Insumos</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{eventos.length} {eventos.length === 1 ? "evento registrado" : "eventos registrados"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowBandeja(false);
                    setViewMode("papelera");
                  }}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center gap-1 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Papelera
                </button>
                {eventos.length > 0 && <button
                  onClick={limpiarBandeja}
                  className="text-xs px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                >
                    Limpiar todo
                  </button>}
                <button
                  onClick={() => setShowBandeja(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {
    /* Filtros por tipo */
  }
            <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 shrink-0 overflow-x-auto">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              {["todos", "crear", "editar", "eliminar", "restaurar"].map((tipo) => <button
    key={tipo}
    onClick={() => setFiltroBandeja(tipo)}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filtroBandeja === tipo ? "bg-[#30475E] text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
  >
                  {tipo === "todos" ? "Todos" : tipoConfig[tipo].label + "s"}
                  {tipo !== "todos" && <span className="ml-1.5 opacity-70">({eventos.filter((e) => e.tipo === tipo).length})</span>}
                </button>)}
            </div>

            {
    /* Lista de eventos */
  }
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {eventosFiltrados.length === 0 ? <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl mb-3">
                    <CheckCircle2 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="font-semibold text-gray-600 dark:text-gray-400">Sin eventos registrados</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {filtroBandeja === "todos" ? "Los cambios a los insumos aparecer\xE1n aqu\xED" : `No hay eventos de tipo "${tipoConfig[filtroBandeja].label}"`}
                  </p>
                </div> : eventosFiltrados.map((evento) => {
    const cfg = tipoConfig[evento.tipo] || tipoConfig.crear;
    return <div
      key={evento.idTrazabilidad}
      className="flex gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors"
    >
                      {
      /* Dot timeline */
    }
                      <div className="flex flex-col items-center pt-0.5 shrink-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${cfg.bg} ${cfg.text}`}>
                          {cfg.icon}
                        </div>
                      </div>

                      {
      /* Contenido */
    }
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                            <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate max-w-[200px]">
                              {evento.entidadNombre}
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 shrink-0 whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            {formatFecha(evento.fecha)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                          {evento.detalle}
                        </p>
                      </div>
                    </div>;
  })}
            </div>

            {
    /* Footer */
  }
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Mostrando {eventosFiltrados.length} de {eventos.length} eventos
              </p>
              <button
    onClick={() => setShowBandeja(false)}
    className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
  >
                Cerrar
              </button>
            </div>
          </div>
        </div>}

      </>
      )}

      {
    /* ── Bandeja de Trazabilidad (fuera de viewMode para que funcione siempre) ─── */
  }
      {showBandeja && <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {
    /* Header */
  }
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#F05454]/10 dark:bg-red-900/30 p-2 rounded-xl">
                  <Bell className="w-5 h-5 text-[#F05454] dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Trazabilidad de Insumos</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{eventos.length} {eventos.length === 1 ? "evento registrado" : "eventos registrados"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowBandeja(false);
                    setViewMode("papelera");
                  }}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center gap-1 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Papelera
                </button>
                {eventos.length > 0 && <button
                  onClick={limpiarBandeja}
                  className="text-xs px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                >
                    Limpiar todo
                  </button>}
                <button
                  onClick={() => setShowBandeja(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {
    /* Filtros por tipo */
  }
            <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 shrink-0 overflow-x-auto">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              {["todos", "crear", "editar", "eliminar", "restaurar"].map((tipo) => <button
    key={tipo}
    onClick={() => setFiltroBandeja(tipo)}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filtroBandeja === tipo ? "bg-[#30475E] text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
  >
                  {tipo === "todos" ? "Todos" : tipoConfig[tipo].label + "s"}
                  {tipo !== "todos" && <span className="ml-1.5 opacity-70">({eventos.filter((e) => e.tipo === tipo).length})</span>}
                </button>)}
            </div>

            {
    /* Lista de eventos */
  }
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {eventosFiltrados.length === 0 ? <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl mb-3">
                    <CheckCircle2 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="font-semibold text-gray-600 dark:text-gray-400">Sin eventos registrados</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {filtroBandeja === "todos" ? "Los cambios a los insumos aparecer\xE1n aqu\xED" : `No hay eventos de tipo "${tipoConfig[filtroBandeja].label}"`}
                  </p>
                </div> : eventosFiltrados.map((evento) => {
    const cfg = tipoConfig[evento.tipo] || tipoConfig.crear;
    return <div
      key={evento.idTrazabilidad}
      className="flex gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors"
    >
                      {
      /* Dot timeline */
    }
                      <div className="flex flex-col items-center pt-0.5 shrink-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${cfg.bg} ${cfg.text}`}>
                          {cfg.icon}
                        </div>
                      </div>

                      {
      /* Contenido */
    }
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                            <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate max-w-[200px]">
                              {evento.entidadNombre}
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 shrink-0 whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            {formatFecha(evento.fecha)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                          {evento.detalle}
                        </p>
                      </div>
                    </div>;
  })}
            </div>

            {
    /* Footer */
  }
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Mostrando {eventosFiltrados.length} de {eventos.length} eventos
              </p>
              <button
    onClick={() => setShowBandeja(false)}
    className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
  >
                Cerrar
              </button>
            </div>
          </div>
        </div>}

      {viewMode === "activos" && (
        <>
      {
    /* New Insumo Modal */
  }
      {showModal && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Nuevo Insumo</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewInsumo({ nombre: "", idCategoriaInsumo: "", stockActual: "", unidadMedida: "kg", precioUnitario: "", idProveedor: "", descripcion: "", fichaTecnica: null });
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newInsumo.nombre}
                    onChange={(e) => setNewInsumo({ ...newInsumo, nombre: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition ${
                      formSubmitted && !newInsumo.nombre.trim()
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    }`}
                    placeholder="Ej: Tomate"
                  />
                  {formSubmitted && !newInsumo.nombre.trim() && (
                    <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría <span className="text-red-500">*</span></label>
                  <select
                    value={newInsumo.idCategoriaInsumo}
                    onChange={(e) => setNewInsumo({ ...newInsumo, idCategoriaInsumo: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition ${
                      formSubmitted && !newInsumo.idCategoriaInsumo
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    {categoriasData.map(cat => (
                      <option key={cat.idCategoriaInsumo || cat.id} value={cat.idCategoriaInsumo || cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  {formSubmitted && !newInsumo.idCategoriaInsumo && (
                    <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unidades a ingresar <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={newInsumo.stockActual}
                    onChange={(e) => setNewInsumo({ ...newInsumo, stockActual: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition ${
                      formSubmitted && (!newInsumo.stockActual.trim() || parseInt(newInsumo.stockActual) < 0)
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    }`}
                    placeholder="0"
                  />
                  {formSubmitted && !newInsumo.stockActual.trim() && (
                    <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                  )}
                  {formSubmitted && newInsumo.stockActual.trim() && parseInt(newInsumo.stockActual) < 0 && (
                    <p className="text-red-500 text-xs mt-1">campo inválido</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unidad de Medida</label>
                  <select
                    value={newInsumo.unidadMedida}
                    onChange={(e) => setNewInsumo({ ...newInsumo, unidadMedida: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  >
                    <option>kg</option>
                    <option>und</option>
                    <option>lt</option>
                    <option>paq</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Precio Unitario <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={newInsumo.precioUnitario}
                    onChange={(e) => setNewInsumo({ ...newInsumo, precioUnitario: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition ${
                      formSubmitted && (!newInsumo.precioUnitario.trim() || parseFloat(newInsumo.precioUnitario) < 0)
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    }`}
                    placeholder="$0"
                  />
                  {formSubmitted && !newInsumo.precioUnitario.trim() && (
                    <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                  )}
                  {formSubmitted && newInsumo.precioUnitario.trim() && parseFloat(newInsumo.precioUnitario) < 0 && (
                    <p className="text-red-500 text-xs mt-1">campo inválido</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proveedor <span className="text-red-500">*</span></label>
                <select
                  value={newInsumo.idProveedor}
                  onChange={(e) => setNewInsumo({ ...newInsumo, idProveedor: e.target.value })}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition ${
                    formSubmitted && !newInsumo.idProveedor
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  }`}
                >
                  <option value="">Seleccionar proveedor...</option>
                  {proveedoresList.map(prov => (
                    <option key={prov.idProveedor} value={prov.idProveedor}>
                      {prov.nombre}
                    </option>
                  ))}
                </select>
                {formSubmitted && !newInsumo.idProveedor && (
                  <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                <textarea
                  value={newInsumo.descripcion}
                  onChange={(e) => setNewInsumo({ ...newInsumo, descripcion: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
                  rows={3}
                  placeholder="Descripción del insumo..."
                />
              </div>
              <FichaTecnicaInsumo
                initialData={null}
                onSave={(data) => setNewInsumo({ ...newInsumo, fichaTecnica: data })}
              />
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button
    onClick={() => {
      setShowModal(false);
      setNewInsumo({ nombre: "", idCategoriaInsumo: "", stockActual: "", unidadMedida: "kg", precioUnitario: "", idProveedor: "", descripcion: "", fichaTecnica: null });
    }}
    className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
  >
                Cancelar
              </button>
              <button onClick={handleSaveNewInsumo} className="px-6 py-2.5 bg-[#F05454] text-white rounded-xl text-sm hover:bg-red-600 transition-colors font-medium">
                Guardar
              </button>
            </div>
          </div>
        </div>}
        </>
      )}
    </div>;
}

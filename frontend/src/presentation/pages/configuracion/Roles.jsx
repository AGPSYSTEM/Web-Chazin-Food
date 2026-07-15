import { useState, useEffect } from "react";
import { Search, Shield, Check, Users, X, Edit, Trash2, ToggleLeft, ToggleRight, Plus } from "lucide-react";
const rolesData = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema",
    usuarios: 2,
    permisos: ["Dashboard", "Compras", "Categor\xEDa Insumos", "Insumos", "Proveedores", "Gesti\xF3n de Compras", "Producci\xF3n", "Categor\xEDa Productos", "Productos", "Fichas T\xE9cnicas", "Gesti\xF3n de Producci\xF3n", "Ventas", "Clientes", "Gesti\xF3n de Ventas", "Punto de Venta", "Configuraci\xF3n", "Usuarios", "Roles"],
    estado: "Activo"
  },
  {
    id: 2,
    nombre: "Cocinero",
    descripcion: "Acceso a producci\xF3n y fichas t\xE9cnicas",
    usuarios: 3,
    permisos: ["Dashboard", "Productos", "Fichas T\xE9cnicas", "Gesti\xF3n de Producci\xF3n"],
    estado: "Activo"
  },
  {
    id: 3,
    nombre: "Cliente",
    descripcion: "Acceso b\xE1sico para realizar pedidos",
    usuarios: 10,
    permisos: ["Dashboard", "Ventas", "Gesti\xF3n de Ventas", "Punto de Venta"],
    estado: "Activo"
  }
];
const TODOS_PERMISOS = [
  "Dashboard",
  "Compras",
  "Categor\xEDa Insumos",
  "Insumos",
  "Proveedores",
  "Gesti\xF3n de Compras",
  "Producci\xF3n",
  "Categor\xEDa Productos",
  "Productos",
  "Fichas T\xE9cnicas",
  "Gesti\xF3n de Producci\xF3n",
  "Ventas",
  "Clientes",
  "Gesti\xF3n de Ventas",
  "Punto de Venta",
  "Configuraci\xF3n",
  "Usuarios",
  "Roles"
];
const getRolAccent = (nombre) => {
  switch (nombre) {
    case "Administrador":
      return { bg: "from-purple-500 to-purple-700", icon: "bg-purple-100 dark:bg-purple-900/30", iconText: "text-purple-600 dark:text-purple-400", badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" };
    case "Cocinero":
      return { bg: "from-green-500 to-green-700", icon: "bg-green-100 dark:bg-green-900/30", iconText: "text-green-600 dark:text-green-400", badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" };
    case "Cliente":
      return { bg: "from-[#F05454] to-[#c0392b]", icon: "bg-[#F05454]/10", iconText: "text-[#F05454]", badge: "bg-[#F05454]/10 text-[#F05454]" };
    default:
      return { bg: "from-gray-400 to-gray-600", icon: "bg-gray-100 dark:bg-gray-700", iconText: "text-gray-500", badge: "bg-gray-100 dark:bg-gray-700 text-gray-600" };
  }
};
export function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPermisosModal, setShowPermisosModal] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);
  const [editingPermisos, setEditingPermisos] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRol, setEditingRol] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [showNuevoModal, setShowNuevoModal] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoDescripcion, setNuevoDescripcion] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/roles");
      if (!response.ok) {
        throw new Error("Error al obtener los roles");
      }
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error(error);
      showToast("Error al cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const totalRoles = roles.length;
  const rolesActivos = roles.filter((r) => r.estado === "Activo").length;
  const totalUsuariosAsignados = roles.reduce((acc, r) => acc + r.usuarios, 0);
  
  const filtered = roles.filter(
    (r) => searchTerm.trim() === "" || 
           r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
           r.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPermisos = (rol) => {
    setSelectedRol(rol);
    setEditingPermisos([...rol.permisos]);
    setShowPermisosModal(true);
  };

  const togglePermiso = (permiso) => {
    setEditingPermisos(
      (prev) => prev.includes(permiso) ? prev.filter((p) => p !== permiso) : [...prev, permiso]
    );
  };

  const savePermisos = () => {
    setRoles((prev) => prev.map((r) => r.id === selectedRol.id ? { ...r, permisos: [...editingPermisos] } : r));
    setShowPermisosModal(false);
    setSelectedRol(null);
    showToast("Permisos actualizados correctamente");
  };

  const openEdit = (rol) => {
    setEditingRol(rol);
    setEditNombre(rol.nombre);
    setEditDescripcion(rol.descripcion);
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!editNombre.trim()) return;
    try {
      const response = await fetch(`http://localhost:5000/api/roles/${editingRol.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: editNombre.trim(),
          descripcion: editDescripcion.trim(),
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al actualizar el rol");
      }
      const updatedRole = await response.json();
      setRoles((prev) => prev.map((r) => r.id === editingRol.id ? { ...r, nombre: updatedRole.nombre, descripcion: updatedRole.descripcion } : r));
      setShowEditModal(false);
      setEditingRol(null);
      showToast("Rol actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al actualizar el rol");
    }
  };

  const toggleEstado = (id) => {
    setRoles((prev) => prev.map((r) => r.id === id ? { ...r, estado: r.estado === "Activo" ? "Inactivo" : "Activo" } : r));
    showToast("Estado del rol actualizado");
  };

  const deleteRol = async (id, nombre) => {
    if (nombre === "Administrador") return;
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el rol "${nombre}"?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/roles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al eliminar el rol");
      }
      setRoles((prev) => prev.filter((r) => r.id !== id));
      showToast("Rol eliminado correctamente");
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al eliminar el rol");
    }
  };

  const saveNuevoRol = async () => {
    if (!nuevoNombre.trim()) return;
    try {
      const response = await fetch("http://localhost:5000/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nuevoNombre.trim(),
          descripcion: nuevoDescripcion.trim(),
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al crear el rol");
      }
      const newRole = await response.json();
      setRoles((prev) => [...prev, newRole]);
      setShowNuevoModal(false);
      setNuevoNombre("");
      setNuevoDescripcion("");
      showToast("Nuevo rol creado correctamente");
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al crear el rol");
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-full flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#F05454]"></div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium animate-pulse">Cargando roles desde la base de datos...</p>
      </div>
    );
  }

  return <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-full">

      {
    /* Toast */
  }
      {toast && <div className="fixed top-4 right-4 z-[100] bg-green-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-medium animate-fade-in">
          <Check className="w-4 h-4 shrink-0" />
          {toast}
        </div>}

      {
    /* Header */
  }
      <div className="mb-6">
        <h1 className="text-gray-900 dark:text-gray-100">Gestión de Roles</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Administra los roles y permisos del sistema</p>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F05454]/10 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#F05454]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalRoles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Roles Activos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{rolesActivos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Usuarios Asignados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalUsuariosAsignados}</p>
            </div>
          </div>
        </div>
      </div>

      {
    /* Search Bar + Nuevo Rol */
  }
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
    type="text"
    placeholder="Buscar rol..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#F05454] focus:border-transparent transition-colors text-sm"
  />
          </div>
          <button
    onClick={() => setShowNuevoModal(true)}
    className="flex items-center gap-2 px-4 py-2.5 bg-[#F05454] hover:bg-[#d94444] text-white rounded-xl text-sm font-medium transition-colors shrink-0"
  >
            <Plus className="w-4 h-4" />
            <span>Nuevo Rol</span>
          </button>
        </div>
      </div>

      {
    /* Role Cards */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((rol) => {
    const accent = getRolAccent(rol.nombre);
    return <div key={rol.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden hover:shadow-md transition-shadow">
              {
      /* Card hero strip */
    }
              <div className={`bg-gradient-to-r ${accent.bg} px-5 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{rol.nombre}</h3>
                    <p className="text-white/70 text-xs">{rol.permisos.length} permisos</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${rol.estado === "Activo" ? "bg-white/20 text-white" : "bg-black/20 text-white/80"}`}>
                  {rol.estado}
                </span>
              </div>

              {
      /* Card body */
    }
              <div className="p-5">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{rol.descripcion}</p>

                {
      /* Stats row */
    }
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Usuarios</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">{rol.usuarios}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Permisos</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">{rol.permisos.length}</p>
                  </div>
                </div>

                {
      /* Permission tags */
    }
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Permisos Asignados</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rol.permisos.slice(0, 3).map((permiso, i) => <span key={i} className={`px-2 py-0.5 rounded-lg text-xs font-medium ${accent.badge}`}>
                        {permiso}
                      </span>)}
                    {rol.permisos.length > 3 && <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium">
                        +{rol.permisos.length - 3} más
                      </span>}
                    {rol.permisos.length === 0 && <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-lg text-xs">Sin permisos</span>}
                  </div>
                </div>

                {
      /* Actions */
    }
                <div className="border-t border-gray-100 dark:border-gray-700/60 pt-3 flex items-center gap-1">
                  <button
      onClick={() => openPermisos(rol)}
      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
      title="Editar permisos"
    >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Permisos</span>
                  </button>
                  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
                  <button
      onClick={() => openEdit(rol)}
      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
      title="Editar rol"
    >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
                  <button
      onClick={() => toggleEstado(rol.id)}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl transition-colors ${rol.estado === "Activo" ? "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20" : "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"}`}
      title={rol.estado === "Activo" ? "Desactivar" : "Activar"}
    >
                    {rol.estado === "Activo" ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    <span>{rol.estado === "Activo" ? "Desactivar" : "Activar"}</span>
                  </button>
                  {rol.nombre !== "Administrador" && <>
                      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
                      <button
      onClick={() => deleteRol(rol.id, rol.nombre)}
      className="flex items-center justify-center p-2 text-[#F05454] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
      title="Eliminar rol"
    >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>}
                </div>
              </div>
            </div>;
  })}

        {filtered.length === 0 && <div className="sm:col-span-2 lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-12 text-center">
            <Shield className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No se encontraron roles</p>
          </div>}
      </div>

      {
    /* ── Edit Permissions Modal ── */
  }
      {showPermisosModal && selectedRol && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-100 dark:border-gray-700/60">
            <div className={`bg-gradient-to-r ${getRolAccent(selectedRol.nombre).bg} p-6 rounded-t-2xl flex items-center justify-between shrink-0`}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white">{selectedRol.nombre}</h2>
                  <p className="text-white/70 text-xs">Editar permisos del rol</p>
                </div>
              </div>
              <button
    onClick={() => {
      setShowPermisosModal(false);
      setSelectedRol(null);
    }}
    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
  >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {editingPermisos.length} de {TODOS_PERMISOS.length} permisos seleccionados
              </p>
              <div className="grid grid-cols-1 gap-2">
                {TODOS_PERMISOS.map((permiso) => {
    const active = editingPermisos.includes(permiso);
    return <button
      key={permiso}
      onClick={() => togglePermiso(permiso)}
      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-medium text-left ${active ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/40 text-green-800 dark:text-green-200" : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"}`}
    >
                      <span>{permiso}</span>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ml-3 ${active ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}>
                        {active ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
                      </div>
                    </button>;
  })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700/60 flex justify-end gap-3 shrink-0">
              <button
    onClick={() => {
      setShowPermisosModal(false);
      setSelectedRol(null);
    }}
    className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
  >
                Cancelar
              </button>
              <button
    onClick={savePermisos}
    className="px-5 py-2.5 bg-[#F05454] hover:bg-[#d94444] text-white rounded-xl transition-colors text-sm font-medium flex items-center gap-2"
  >
                <Check className="w-4 h-4" />
                Guardar Permisos
              </button>
            </div>
          </div>
        </div>}

      {
    /* ── Edit Role Modal ── */
  }
      {showEditModal && editingRol && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700/60">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F05454]/10 rounded-xl flex items-center justify-center">
                  <Edit className="w-5 h-5 text-[#F05454]" />
                </div>
                <h2 className="font-bold text-gray-900 dark:text-gray-100">Editar Rol</h2>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Nombre del Rol</label>
                <input
    type="text"
    value={editNombre}
    onChange={(e) => setEditNombre(e.target.value)}
    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#F05454] focus:border-transparent transition-colors text-sm"
    placeholder="Nombre del rol"
  />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Descripción</label>
                <textarea
    value={editDescripcion}
    onChange={(e) => setEditDescripcion(e.target.value)}
    rows={3}
    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#F05454] focus:border-transparent transition-colors text-sm resize-none"
    placeholder="Descripción del rol"
  />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700/60 flex justify-end gap-3">
              <button
    onClick={() => setShowEditModal(false)}
    className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
  >
                Cancelar
              </button>
              <button
    onClick={saveEdit}
    disabled={!editNombre.trim()}
    className="px-5 py-2.5 bg-[#F05454] hover:bg-[#d94444] disabled:opacity-50 text-white rounded-xl transition-colors text-sm font-medium flex items-center gap-2"
  >
                <Check className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>}

      {
    /* ── Nuevo Rol Modal ── */
  }
      {showNuevoModal && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700/60">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F05454]/10 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-[#F05454]" />
                </div>
                <h2 className="font-bold text-gray-900 dark:text-gray-100">Nuevo Rol</h2>
              </div>
              <button onClick={() => setShowNuevoModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Nombre del Rol</label>
                <input
    type="text"
    value={nuevoNombre}
    onChange={(e) => setNuevoNombre(e.target.value)}
    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#F05454] focus:border-transparent transition-colors text-sm"
    placeholder="Ej. Vendedor, Supervisor..."
    autoFocus
  />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Descripción</label>
                <textarea
    value={nuevoDescripcion}
    onChange={(e) => setNuevoDescripcion(e.target.value)}
    rows={3}
    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#F05454] focus:border-transparent transition-colors text-sm resize-none"
    placeholder="Descripción del nuevo rol"
  />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Podrás asignar permisos después desde el botón "Permisos" en la tarjeta del rol.</p>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700/60 flex justify-end gap-3">
              <button
    onClick={() => setShowNuevoModal(false)}
    className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
  >
                Cancelar
              </button>
              <button
    onClick={saveNuevoRol}
    disabled={!nuevoNombre.trim()}
    className="px-5 py-2.5 bg-[#F05454] hover:bg-[#d94444] disabled:opacity-50 text-white rounded-xl transition-colors text-sm font-medium flex items-center gap-2"
  >
                <Plus className="w-4 h-4" />
                Crear Rol
              </button>
            </div>
          </div>
        </div>}
    </div>;
}

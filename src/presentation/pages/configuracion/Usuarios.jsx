import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, User, Mail, Phone, Shield, Lock, X, Upload, Download, Users, UserCheck, UserX, CreditCard, MapPin, Calendar } from "lucide-react";
import { useNotifications } from "@/domain/hooks/useNotifications";

const ROL_ID_MAP = {
  "1": { idRol: 1, rolNombre: "Administrador" },
  "2": { idRol: 2, rolNombre: "Cocinero" },
  "3": { idRol: 3, rolNombre: "Cliente" }
};

function getIniciales(nombre = "") {
  return nombre.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").join("").slice(0, 2);
}

const inputCls = "w-full px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#F05454] focus:border-transparent transition-colors text-sm";
const labelCls = "block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1";
const ROLES_FILTRO = ["Todos", "Administrador", "Cocinero", "Cliente"];
const ESTADOS_FILTRO = ["Todos", "Activo", "Inactivo"];

export function Usuarios() {
  const { success, error: notifError } = useNotifications();
  const [usuarios, setUsuarios] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const fetchRolesList = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("chazin_user") || "{}");
      const response = await fetch("http://localhost:5000/api/roles", {
        headers: {
          "Authorization": `Bearer ${savedUser.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRolesList(data);
      }
    } catch (err) {
      console.error("Error al obtener roles:", err);
    }
  };

  const isCliente = (idRolStr) => {
    const rolObj = rolesList.find((r) => String(r.id) === String(idRolStr));
    return rolObj ? rolObj.nombre === "Cliente" : idRolStr === "3";
  };
  
  const [newForm, setNewForm] = useState({
    documento: "",
    tipoDocumento: "C.C.",
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
    confirmPassword: "",
    idRolStr: "3",
    estado: "Activo"
  });

  const [editForm, setEditForm] = useState({
    nombre: "",
    apellidos: "",
    tipoDocumento: "C.C.",
    email: "",
    telefono: "",
    direccion: "",
    idRolStr: "3",
    estado: "Activo"
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: ""
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("chazin_user") || "{}");
      const response = await fetch("http://localhost:5000/api/usuarios", {
        headers: {
          "Authorization": `Bearer ${savedUser.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.map(u => ({
          ...u,
          idRolStr: String(u.idRol || 3),
          rolNombre: u.rol || "Cliente",
          estado: u.estado === "ACTIVO" ? "Activo" : "Inactivo",
          iniciales: getIniciales(u.nombre)
        })));
      } else {
        notifError("Error", "No se pudo obtener la lista de usuarios");
      }
    } catch (err) {
      console.error(err);
      notifError("Error", "Error de conexión al obtener usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRolesList();
  }, []);

  const openPassword = (u) => {
    setSelectedUsuario(u);
    setPasswordForm({
      password: "",
      confirmPassword: ""
    });
    setShowPasswordModal(true);
  };

  const closePassword = () => {
    setShowPasswordModal(false);
    setSelectedUsuario(null);
  };

  const handleSavePassword = async () => {
    if (!selectedUsuario) return;
    if (!passwordForm.password || !passwordForm.confirmPassword) {
      notifError("Campos requeridos", "Ambos campos de contraseña son obligatorios");
      return;
    }
    if (passwordForm.password.length < 6) {
      notifError("Contraseña muy corta", "La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      notifError("Contraseñas no coinciden", "Verifica que las contraseñas sean iguales");
      return;
    }

    try {
      const savedUser = JSON.parse(localStorage.getItem("chazin_user") || "{}");
      const response = await fetch(`http://localhost:5000/api/usuarios/${selectedUsuario.idUsuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedUser.token}`
        },
        body: JSON.stringify({ contrasena: passwordForm.password })
      });

      if (response.ok) {
        success("Contraseña actualizada", `La contraseña de ${selectedUsuario.nombre} ha sido cambiada correctamente.`);
        closePassword();
      } else {
        const errData = await response.json().catch(() => ({}));
        notifError("Error", errData.message || "No se pudo actualizar la contraseña");
      }
    } catch (error) {
      console.error(error);
      notifError("Error", "Error al actualizar contraseña");
    }
  };

  const openEdit = (u) => {
    setSelectedUsuario(u);
    setEditForm({
      nombre: u.nombre,
      apellidos: u.apellidos || "",
      tipoDocumento: u.tipoDocumento || "C.C.",
      email: u.email,
      telefono: u.telefono || "",
      direccion: u.direccion || "",
      idRolStr: String(u.idRol || 3),
      estado: u.estado
    });
    setShowEditModal(true);
  };

  const closeEdit = () => {
    setShowEditModal(false);
    setSelectedUsuario(null);
  };

  const openDelete = (u) => {
    setSelectedUsuario(u);
    setShowDeleteModal(true);
  };

  const closeDelete = () => {
    setShowDeleteModal(false);
    setSelectedUsuario(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedUsuario) return;
    if (!editForm.nombre.trim() || !editForm.apellidos.trim() || !editForm.email.trim()) {
      notifError("Campos requeridos", "Nombre, Apellidos y Email son obligatorios");
      return;
    }

    // Si es cliente, la dirección es requerida
    if (isCliente(editForm.idRolStr) && !editForm.direccion.trim()) {
    if (editForm.idRolStr === "3" && !editForm.direccion.trim()) {
      notifError("Campo requerido", "La dirección es obligatoria para usuarios con rol Cliente");
      return;
    }

    try {
      const savedUser = JSON.parse(localStorage.getItem("chazin_user") || "{}");
      const response = await fetch(`http://localhost:5000/api/usuarios/${selectedUsuario.idUsuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedUser.token}`
        },
        body: JSON.stringify({
          nombre: editForm.nombre.trim(),
          apellidos: editForm.apellidos.trim(),
          tipoDocumento: editForm.tipoDocumento,
          email: editForm.email.trim(),
          telefono: editForm.telefono.trim(),
          direccion: isCliente(editForm.idRolStr) ? editForm.direccion.trim() : "",
          direccion: editForm.idRolStr === "3" ? editForm.direccion.trim() : "",
          idRol: parseInt(editForm.idRolStr),
          estado: editForm.estado === "Activo" ? "ACTIVO" : "INACTIVO"
        })
      });

      if (response.ok) {
        success("Usuario actualizado", `${editForm.nombre} ha sido actualizado correctamente.`);
        fetchUsers();
        closeEdit();
      } else {
        const errData = await response.json().catch(() => ({}));
        notifError("Error", errData.message || "No se pudo actualizar el usuario");
      }
    } catch (error) {
      console.error(error);
      notifError("Error", "Error al actualizar usuario");
    }
  };

  const handleInactivar = async () => {
    if (!selectedUsuario) return;
    try {
      const savedUser = JSON.parse(localStorage.getItem("chazin_user") || "{}");
      const response = await fetch(`http://localhost:5000/api/usuarios/${selectedUsuario.idUsuario}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${savedUser.token}`
        }
      });

      if (response.ok) {
        success("Usuario eliminado", `${selectedUsuario.nombre} ha sido eliminado correctamente`);
        fetchUsers();
        closeDelete();
      } else {
        const errData = await response.json().catch(() => ({}));
        notifError("Error", errData.message || "No se pudo inactivar el usuario");
      }
    } catch (error) {
      console.error(error);
      notifError("Error", "Error al inactivar usuario");
    }
  };

  const handleCreateUser = async () => {
    if (!newForm.documento.trim() || !newForm.nombre.trim() || !newForm.apellidos.trim() || !newForm.email.trim() || !newForm.password.trim()) {
      notifError("Campos requeridos", "Documento, Nombres, Apellidos, Email y Contraseña son obligatorios");
      return;
    }
    if (newForm.password !== newForm.confirmPassword) {
      notifError("Contraseñas no coinciden", "Verifica que las contraseñas sean iguales");
      return;
    }
    if (isCliente(newForm.idRolStr) && !newForm.direccion.trim()) {
    if (newForm.idRolStr === "3" && !newForm.direccion.trim()) {
      notifError("Campo requerido", "La dirección es obligatoria para usuarios con rol Cliente");
      return;
    }

    try {
      const savedUser = JSON.parse(localStorage.getItem("chazin_user") || "{}");
      const response = await fetch("http://localhost:5000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedUser.token}`
        },
        body: JSON.stringify({
          idUsuario: parseInt(newForm.documento.trim()),
          tipoDocumento: newForm.tipoDocumento,
          nombre: newForm.nombre.trim(),
          apellidos: newForm.apellidos.trim(),
          email: newForm.email.trim(),
          telefono: newForm.telefono.trim(),
          direccion: isCliente(newForm.idRolStr) ? newForm.direccion.trim() : "",
          direccion: newForm.idRolStr === "3" ? newForm.direccion.trim() : "",
          contrasena: newForm.password,
          idRol: parseInt(newForm.idRolStr),
          estado: newForm.estado === "Activo" ? "ACTIVO" : "INACTIVO"
        })
      });

      if (response.ok) {
        const created = await response.json();
        success("Usuario creado", `${created.nombre} fue creado exitosamente`);
        fetchUsers();
        setShowModal(false);
        setNewForm({
          documento: "",
          tipoDocumento: "C.C.",
          nombre: "",
          apellidos: "",
          email: "",
          telefono: "",
          direccion: "",
          password: "",
          confirmPassword: "",
          idRolStr: "3",
          estado: "Activo"
        });
      } else {
        const errData = await response.json().catch(() => ({}));
        notifError("Error", errData.message || "No se pudo crear el usuario");
      }
    } catch (error) {
      console.error(error);
      notifError("Error", "Error al crear usuario");
    }
  };

  const exportarReporte = () => {
    const rows = filtered;
    const headers = ["Documento ID", "Nombres", "Apellidos", "Tipo Doc", "Email", "Teléfono", "Dirección", "Rol", "Estado", "Fecha Registro"];
    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      headers.join(","),
      ...rows.map((u) => [
        u.idUsuario,
        u.nombre,
        u.apellidos,
        u.tipoDocumento,
        u.email,
        u.telefono,
        u.direccion || "-",
        u.rolNombre,
        u.estado,
        u.fechaRegistro ? u.fechaRegistro.slice(0, 10) : "-"
      ].map(escape).join(","))
    ].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success("Reporte generado", `${rows.length} usuario(s) exportados a CSV`);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const filtered = usuarios.filter((u) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = term === "" || 
      u.nombre.toLowerCase().includes(term) || 
      u.apellidos.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term) ||
      String(u.idUsuario).includes(term);
    const matchesRol = filterRol === "Todos" || u.rolNombre === filterRol;
    const matchesEstado = filterEstado === "Todos" || u.estado === filterEstado;
    return matchesSearch && matchesRol && matchesEstado;
  });

  const totalActivos = usuarios.filter((u) => u.estado === "Activo").length;
  const totalInactivos = usuarios.filter((u) => u.estado === "Inactivo").length;

  const getRolColor = (rol) => {
    switch (rol) {
      case "Administrador":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
      case "Cocinero":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "Cliente":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const getAvatarGradient = (rol) => {
    switch (rol) {
      case "Administrador":
        return "from-purple-400 to-purple-600";
      case "Cocinero":
        return "from-green-400 to-green-600";
      case "Cliente":
        return "from-[#F05454] to-[#c0392b]";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const pillBtn = (active) => active ? "px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F05454] text-white shadow-sm" : "px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";

  return <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 dark:text-gray-100 font-bold text-2xl">Gestión de Usuarios</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Administra los usuarios del sistema</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F05454]/10 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#F05454]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{usuarios.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Activos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalActivos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
              <UserX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Inactivos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalInactivos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="search-user-chazin"
              placeholder="Buscar por documento, nombre, apellido o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#F05454] focus:border-transparent transition-colors text-sm"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={exportarReporte} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium whitespace-nowrap">
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#F05454] text-white rounded-xl hover:bg-[#c0392b] transition-colors text-sm font-medium shadow-sm whitespace-nowrap">
              <Plus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-3 mb-6 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1">Rol:</span>
        {["Todos", ...rolesList.map((r) => r.nombre)].map((r) => <button key={r} onClick={() => setFilterRol(r)} className={pillBtn(filterRol === r)}>{r}</button>)}
        {ROLES_FILTRO.map((r) => <button key={r} onClick={() => setFilterRol(r)} className={pillBtn(filterRol === r)}>{r}</button>)}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1">Estado:</span>
        {ESTADOS_FILTRO.map((e) => <button key={e} onClick={() => setFilterEstado(e)} className={pillBtn(filterEstado === e)}>{e}</button>)}
      </div>

      {/* Mobile Cards View */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {filtered.map((usuario) => <div key={usuario.idUsuario} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarGradient(usuario.rolNombre)} rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {usuario.iniciales}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{usuario.nombre} {usuario.apellidos}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{usuario.tipoDocumento} #: {usuario.idUsuario}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${usuario.estado === "Activo" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                {usuario.estado}
              </span>
            </div>
            <div className="px-4 pb-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{usuario.email}</span>
              </div>
              {usuario.telefono && <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>{usuario.telefono}</span>
              </div>}
              {usuario.rolNombre === "Cliente" && usuario.direccion && <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{usuario.direccion}</span>
              </div>}
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 shrink-0" />
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getRolColor(usuario.rolNombre)}`}>{usuario.rolNombre}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Reg: {formatFecha(usuario.fechaRegistro)}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700/60 px-4 py-2 flex items-center gap-1">
              <button onClick={() => openEdit(usuario)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                <Edit className="w-3.5 h-3.5" /><span>Editar</span>
              </button>
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
              <button onClick={() => openPassword(usuario)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
                <Lock className="w-3.5 h-3.5" /><span>Clave</span>
              </button>
              {usuario.rolNombre !== "Administrador" && usuario.estado === "Activo" && <>
                  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
                  <button onClick={() => openDelete(usuario)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-[#F05454] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /><span>Inactivar</span>
                  </button>
                </>}
            </div>
          </div>)}
        {filtered.length === 0 && <div className="sm:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-12 text-center">
            <User className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No se encontraron usuarios</p>
          </div>}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/40">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuario (Doc ID)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registro</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/40">
              {filtered.map((usuario) => <tr key={usuario.idUsuario} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(usuario.rolNombre)} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                        {usuario.iniciales}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{usuario.nombre} {usuario.apellidos}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">{usuario.tipoDocumento}: {usuario.idUsuario}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{usuario.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{usuario.telefono || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px]">{usuario.direccion || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getRolColor(usuario.rolNombre)}`}>
                      <Shield className="w-3 h-3" />{usuario.rolNombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatFecha(usuario.fechaRegistro)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${usuario.estado === "Activo" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(usuario)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => openPassword(usuario)} className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors" title="Cambiar contraseña">
                        <Lock className="w-4 h-4" />
                      </button>
                      {usuario.rolNombre !== "Administrador" && usuario.estado === "Activo" && <button onClick={() => openDelete(usuario)} className="p-2 text-[#F05454] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>}
                    </div>
                  </td>
                </tr>)}
              {filtered.length === 0 && <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                    No se encontraron usuarios con los filtros aplicados
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Eliminar Modal */}
      {showDeleteModal && selectedUsuario && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-700/60">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserX className="w-7 h-7 text-[#F05454]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">¿Eliminar usuario?</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                Vas a eliminar a <span className="font-semibold text-gray-800 dark:text-gray-200">"{selectedUsuario.nombre}"</span>.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Esta acción eliminará al usuario del sistema.</p>
              <div className="flex gap-3">
                <button onClick={closeDelete} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">Cancelar</button>
                <button onClick={handleInactivar} className="flex-1 px-4 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-[#c0392b] transition-colors text-sm font-medium">Eliminar</button>
              </div>
            </div>
          </div>
        </div>}

      {/* Edit Modal */}
      {showEditModal && selectedUsuario && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700/60">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(selectedUsuario.rolNombre)} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
                  {selectedUsuario.iniciales}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-gray-100">Editar Usuario</h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Documento ID: {selectedUsuario.idUsuario}</p>
                </div>
              </div>
              <button onClick={closeEdit} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nombres</label>
                  <input type="text" value={editForm.nombre} onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))} className={inputCls} placeholder="Nombres" />
                </div>
                <div>
                  <label className={labelCls}>Apellidos</label>
                  <input type="text" value={editForm.apellidos} onChange={(e) => setEditForm((f) => ({ ...f, apellidos: e.target.value }))} className={inputCls} placeholder="Apellidos" />
                </div>
                <div>
                  <label className={labelCls}>Tipo de Documento</label>
                  <select value={editForm.tipoDocumento} onChange={(e) => setEditForm((f) => ({ ...f, tipoDocumento: e.target.value }))} className={inputCls}>
                    <option value="C.C.">C.C.</option>
                    <option value="T.I.">T.I.</option>
                    <option value="C.E.">C.E.</option>
                    <option value="P.P.">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="email@chazinfood.com" />
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input type="tel" value={editForm.telefono} onChange={(e) => setEditForm((f) => ({ ...f, telefono: e.target.value }))} className={inputCls} placeholder="319 000 0000" />
                </div>
                <div>
                  <label className={labelCls}>Rol</label>
                  <select value={editForm.idRolStr} onChange={(e) => setEditForm((f) => ({ ...f, idRolStr: e.target.value }))} className={inputCls}>
                    {rolesList.length > 0 ? rolesList.map((r) => (
                      <option key={r.id} value={String(r.id)}>{r.nombre}</option>
                    )) : (<>
                      <option value="1">Administrador</option>
                      <option value="2">Cocinero</option>
                      <option value="3">Cliente</option>
                    </>)}
                  </select>
                </div>
                {/* Conditional Address field: only shown if rol is Cliente */}
                {isCliente(editForm.idRolStr) && <div className="sm:col-span-2 animate-fadeIn">
                    <option value="1">Administrador</option>
                    <option value="2">Cocinero</option>
                    <option value="3">Cliente</option>
                  </select>
                </div>
                {/* Conditional Address field: only shown if rol is Cliente */}
                {editForm.idRolStr === "3" && <div className="sm:col-span-2 animate-fadeIn">
                  <label className={labelCls}>Dirección <span className="text-red-500">*</span></label>
                  <input type="text" value={editForm.direccion} onChange={(e) => setEditForm((f) => ({ ...f, direccion: e.target.value }))} className={inputCls} placeholder="Calle 12 # 34-56" />
                </div>}
                <div className="sm:col-span-2">
                  <label className={labelCls}>Estado</label>
                  <select value={editForm.estado} onChange={(e) => setEditForm((f) => ({ ...f, estado: e.target.value }))} className={inputCls}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700/60 flex justify-end gap-3">
              <button onClick={closeEdit} className="px-6 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-6 py-2 bg-[#F05454] text-white rounded-xl hover:bg-[#c0392b] transition-colors text-sm font-medium">Guardar Cambios</button>
            </div>
          </div>
        </div>}

      {/* New User Modal */}
      {showModal && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700/60">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Nuevo Usuario</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Tipo de Documento <span className="text-red-500">*</span></label>
                  <select value={newForm.tipoDocumento} onChange={(e) => setNewForm((f) => ({ ...f, tipoDocumento: e.target.value }))} className={inputCls}>
                    <option value="C.C.">C.C.</option>
                    <option value="T.I.">T.I.</option>
                    <option value="C.E.">C.E.</option>
                    <option value="P.P.">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Número de Documento (ID) <span className="text-red-500">*</span></label>
                  <input type="number" value={newForm.documento} onChange={(e) => setNewForm((f) => ({ ...f, documento: e.target.value }))} className={inputCls} placeholder="Ej: 1094000123" />
                </div>
                <div>
                  <label className={labelCls}>Nombres <span className="text-red-500">*</span></label>
                  <input type="text" value={newForm.nombre} onChange={(e) => setNewForm((f) => ({ ...f, nombre: e.target.value }))} className={inputCls} placeholder="Ej: Juan" />
                </div>
                <div>
                  <label className={labelCls}>Apellidos <span className="text-red-500">*</span></label>
                  <input type="text" value={newForm.apellidos} onChange={(e) => setNewForm((f) => ({ ...f, apellidos: e.target.value }))} className={inputCls} placeholder="Ej: Pérez" />
                </div>
                <div>
                  <label className={labelCls}>Email <span className="text-red-500">*</span></label>
                  <input type="email" value={newForm.email} onChange={(e) => setNewForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="usuario@chazinfood.com" />
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input type="tel" value={newForm.telefono} onChange={(e) => setNewForm((f) => ({ ...f, telefono: e.target.value }))} className={inputCls} placeholder="319 000 0000" />
                </div>
                <div>
                  <label className={labelCls}>Rol <span className="text-red-500">*</span></label>
                  <select value={newForm.idRolStr} onChange={(e) => setNewForm((f) => ({ ...f, idRolStr: e.target.value }))} className={inputCls}>
                    {rolesList.length > 0 ? rolesList.map((r) => (
                      <option key={r.id} value={String(r.id)}>{r.nombre}</option>
                    )) : (<>
                      <option value="1">Administrador</option>
                      <option value="2">Cocinero</option>
                      <option value="3">Cliente</option>
                    </>)}
                  </select>
                </div>
                {/* Conditional Address field: only shown if rol is Cliente */}
                {isCliente(newForm.idRolStr) && <div className="sm:col-span-2 animate-fadeIn">
                    <option value="1">Administrador</option>
                    <option value="2">Cocinero</option>
                    <option value="3">Cliente</option>
                  </select>
                </div>
                {/* Conditional Address field: only shown if rol is Cliente */}
                {newForm.idRolStr === "3" && <div className="sm:col-span-2 animate-fadeIn">
                  <label className={labelCls}>Dirección <span className="text-red-500">*</span></label>
                  <input type="text" value={newForm.direccion} onChange={(e) => setNewForm((f) => ({ ...f, direccion: e.target.value }))} className={inputCls} placeholder="Calle 12 # 34-56" />
                </div>}
                <div>
                  <label className={labelCls}>Estado</label>
                  <select value={newForm.estado} onChange={(e) => setNewForm((f) => ({ ...f, estado: e.target.value }))} className={inputCls}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-xs">Credenciales de Acceso</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Contraseña <span className="text-red-500">*</span></label>
                    <input type="password" value={newForm.password} onChange={(e) => setNewForm((f) => ({ ...f, password: e.target.value }))} className={inputCls} placeholder="••••••••" autoComplete="new-password" />
                  </div>
                  <div>
                    <label className={labelCls}>Confirmar Contraseña <span className="text-red-500">*</span></label>
                    <input type="password" value={newForm.confirmPassword} onChange={(e) => setNewForm((f) => ({ ...f, confirmPassword: e.target.value }))} className={inputCls} placeholder="••••••••" autoComplete="new-password" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700/60 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
                Cancelar
              </button>
              <button onClick={handleCreateUser} className="px-6 py-2 bg-[#F05454] text-white rounded-xl hover:bg-[#c0392b] transition-colors text-sm font-medium">
                Crear Usuario
              </button>
            </div>
          </div>
        </div>}

      {/* Password Modal */}
      {showPasswordModal && selectedUsuario && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700/60">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-gray-100">Cambiar Contraseña</h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{selectedUsuario.nombre} {selectedUsuario.apellidos}</p>
                </div>
              </div>
              <button onClick={closePassword} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Nueva Contraseña</label>
                <input type="password" value={passwordForm.password} onChange={(e) => setPasswordForm((f) => ({ ...f, password: e.target.value }))} className={inputCls} placeholder="••••••••" autoComplete="new-password" />
              </div>
              <div>
                <label className={labelCls}>Confirmar Nueva Contraseña</label>
                <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))} className={inputCls} placeholder="••••••••" autoComplete="new-password" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700/60 flex justify-end gap-3">
              <button onClick={closePassword} className="px-6 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">Cancelar</button>
              <button onClick={handleSavePassword} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors text-sm font-medium">Actualizar Contraseña</button>
            </div>
          </div>
        </div>}
    </div>;
}

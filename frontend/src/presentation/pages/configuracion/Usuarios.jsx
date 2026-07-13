import { useState } from "react";
import { Plus, Search, Edit, Trash2, User, Mail, Phone, Shield, Lock, X, Upload, Download, Users, UserCheck, UserX, Activity } from "lucide-react";
import { useNotifications } from "@/domain/hooks/useNotifications";
const usuariosIniciales = [
  {
    idUsuario: 1,
    nombre: "Admin Sistema",
    email: "admin@chazinfood.com",
    telefono: "319 000 0001",
    password: "********",
    imagen: null,
    idRol: 1,
    rolNombre: "Administrador",
    estado: "Activo",
    fechaRegistro: "2026-01-15",
    ultimoAcceso: "2026-05-27 14:30",
    iniciales: "AS"
  },
  {
    idUsuario: 2,
    nombre: "Mar\xEDa Garc\xEDa",
    email: "maria.garcia@chazinfood.com",
    telefono: "319 000 0002",
    password: "********",
    imagen: null,
    idRol: 3,
    rolNombre: "Cliente",
    estado: "Activo",
    fechaRegistro: "2026-02-10",
    ultimoAcceso: "2026-05-27 13:15",
    iniciales: "MG"
  },
  {
    idUsuario: 3,
    nombre: "Carlos L\xF3pez",
    email: "carlos.lopez@chazinfood.com",
    telefono: "319 000 0003",
    password: "********",
    imagen: null,
    idRol: 2,
    rolNombre: "Cocinero",
    estado: "Activo",
    fechaRegistro: "2026-03-05",
    ultimoAcceso: "2026-05-27 12:45",
    iniciales: "CL"
  },
  {
    idUsuario: 4,
    nombre: "Ana Mart\xEDnez",
    email: "ana.martinez@chazinfood.com",
    telefono: "319 000 0004",
    password: "********",
    imagen: null,
    idRol: 3,
    rolNombre: "Cliente",
    estado: "Activo",
    fechaRegistro: "2026-03-20",
    ultimoAcceso: "2026-05-26 18:30",
    iniciales: "AM"
  },
  {
    idUsuario: 5,
    nombre: "Luis Rodr\xEDguez",
    email: "luis.rodriguez@chazinfood.com",
    telefono: "319 000 0005",
    password: "********",
    imagen: null,
    idRol: 2,
    rolNombre: "Cocinero",
    estado: "Activo",
    fechaRegistro: "2026-04-12",
    ultimoAcceso: "2026-05-27 10:20",
    iniciales: "LR"
  },
  {
    idUsuario: 6,
    nombre: "Sandra G\xF3mez",
    email: "sandra.gomez@chazinfood.com",
    telefono: "319 000 0006",
    password: "********",
    imagen: null,
    idRol: 3,
    rolNombre: "Cliente",
    estado: "Inactivo",
    fechaRegistro: "2026-02-28",
    ultimoAcceso: "2026-05-20 15:45",
    iniciales: "SG"
  }
];
const ROL_ID_MAP = {
  "1": { idRol: 1, rolNombre: "Administrador" },
  "2": { idRol: 2, rolNombre: "Cocinero" },
  "3": { idRol: 3, rolNombre: "Cliente" }
};
function getIniciales(nombre) {
  return nombre.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").join("").slice(0, 2);
}
const inputCls = "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#F05454] focus:border-transparent transition-colors text-sm";
const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";
const ROLES_FILTRO = ["Todos", "Administrador", "Cocinero", "Cliente"];
const ESTADOS_FILTRO = ["Todos", "Activo", "Inactivo"];
export function Usuarios() {
  const { success, error: notifError } = useNotifications();
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newForm, setNewForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    idRolStr: "3",
    estado: "Activo",
    sendWelcome: false
  });
  const [editForm, setEditForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    idRolStr: "3",
    estado: "Activo",
    sendNotification: true
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
    sendNotification: true
  });
  const openPassword = (u) => {
    setSelectedUsuario(u);
    setPasswordForm({
      password: "",
      confirmPassword: "",
      sendNotification: true
    });
    setShowPasswordModal(true);
  };
  const closePassword = () => {
    setShowPasswordModal(false);
    setSelectedUsuario(null);
  };
  const handleSavePassword = () => {
    if (!selectedUsuario) return;
    if (!passwordForm.password || !passwordForm.confirmPassword) {
      notifError("Campos requeridos", "Ambos campos de contraseña son obligatorios");
      return;
    }
    if (passwordForm.password.length < 8) {
      notifError("Contraseña muy corta", "La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      notifError("Contraseñas no coinciden", "Verifica que las contraseñas sean iguales");
      return;
    }
    setUsuarios((prev) => prev.map(
      (u) => u.idUsuario === selectedUsuario.idUsuario ? { ...u, password: passwordForm.password } : u
    ));
    const detail = passwordForm.sendNotification
      ? `La contraseña de ${selectedUsuario.nombre} ha sido cambiada y se le ha enviado un correo de notificación.`
      : `La contraseña de ${selectedUsuario.nombre} ha sido cambiada correctamente.`;
    success("Contraseña actualizada", detail);
    closePassword();
  };
  const openEdit = (u) => {
    setSelectedUsuario(u);
    setEditForm({
      nombre: u.nombre,
      email: u.email,
      telefono: u.telefono,
      idRolStr: String(u.idRol),
      estado: u.estado,
      sendNotification: true
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
  const handleSaveEdit = () => {
    if (!selectedUsuario) return;
    if (!editForm.nombre.trim() || !editForm.email.trim()) {
      notifError("Campos requeridos", "Nombre y email son obligatorios");
      return;
    }
    const rolData = ROL_ID_MAP[editForm.idRolStr] ?? ROL_ID_MAP["3"];

    const cambios = [];
    if (selectedUsuario.nombre !== editForm.nombre.trim()) cambios.push("Nombre");
    if (selectedUsuario.email !== editForm.email.trim()) cambios.push("Email");
    if (selectedUsuario.telefono !== editForm.telefono.trim()) cambios.push("Teléfono");
    if (String(selectedUsuario.idRol) !== editForm.idRolStr) cambios.push("Rol");
    if (selectedUsuario.estado !== editForm.estado) cambios.push("Estado");

    setUsuarios((prev) => prev.map(
      (u) => u.idUsuario === selectedUsuario.idUsuario ? { ...u, nombre: editForm.nombre.trim(), email: editForm.email.trim(), telefono: editForm.telefono.trim(), ...rolData, estado: editForm.estado, iniciales: getIniciales(editForm.nombre) } : u
    ));

    const detail = (editForm.sendNotification && cambios.length > 0)
      ? `${editForm.nombre} ha sido actualizado correctamente y se le ha enviado un correo detallando los cambios (${cambios.join(", ")}).`
      : `${editForm.nombre} ha sido actualizado correctamente.`;

    success("Usuario actualizado", detail);
    closeEdit();
  };
  const handleInactivar = () => {
    if (!selectedUsuario) return;
    setUsuarios((prev) => prev.map(
      (u) => u.idUsuario === selectedUsuario.idUsuario ? { ...u, estado: "Inactivo" } : u
    ));
    success("Usuario inactivado", `${selectedUsuario.nombre} ha sido inactivado`);
    closeDelete();
  };
  const handleCreateUser = () => {
    if (!newForm.nombre.trim() || !newForm.email.trim()) {
      notifError("Campos requeridos", "Nombre y email son obligatorios");
      return;
    }
    if (newForm.password !== newForm.confirmPassword) {
      notifError("Contrase\xF1as no coinciden", "Verifica que las contrase\xF1as sean iguales");
      return;
    }
    const rolData = ROL_ID_MAP[newForm.idRolStr] ?? ROL_ID_MAP["3"];
    const newId = Math.max(...usuarios.map((u) => u.idUsuario)) + 1;
    const newUser = {
      idUsuario: newId,
      nombre: newForm.nombre.trim(),
      email: newForm.email.trim(),
      telefono: newForm.telefono.trim(),
      password: "********",
      imagen: imagePreview,
      ...rolData,
      estado: newForm.estado,
      fechaRegistro: "2026-06-23",
      ultimoAcceso: "Nunca",
      iniciales: getIniciales(newForm.nombre)
    };
    setUsuarios((prev) => [newUser, ...prev]);
    success("Usuario creado", `${newUser.nombre} fue creado exitosamente`);
    setShowModal(false);
    setImagePreview(null);
    setNewForm({ nombre: "", email: "", telefono: "", password: "", confirmPassword: "", idRolStr: "3", estado: "Activo", sendWelcome: false });
  };
  const exportarReporte = () => {
    const rows = filtered;
    const headers = ["ID", "Nombre", "Email", "Tel\xE9fono", "Rol", "Estado", "Fecha Registro", "\xDAltimo Acceso"];
    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      headers.join(","),
      ...rows.map((u) => [u.idUsuario, u.nombre, u.email, u.telefono, u.rolNombre, u.estado, u.fechaRegistro, u.ultimoAcceso].map(escape).join(","))
    ].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-usuarios-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success("Reporte generado", `${rows.length} usuario(s) exportados a CSV`);
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
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
  const filtered = usuarios.filter((u) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = term === "" || u.nombre.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    const matchesRol = filterRol === "Todos" || u.rolNombre === filterRol;
    const matchesEstado = filterEstado === "Todos" || u.estado === filterEstado;
    return matchesSearch && matchesRol && matchesEstado;
  });
  const totalActivos = usuarios.filter((u) => u.estado === "Activo").length;
  const totalInactivos = usuarios.filter((u) => u.estado === "Inactivo").length;
  const todayStr = "2026-05-27";
  const conectadosHoy = usuarios.filter((u) => u.ultimoAcceso.startsWith(todayStr)).length;
  const pillBtn = (active) => active ? "px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F05454] text-white shadow-sm" : "px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";
  return <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      {
    /* Header */
  }
      <div className="mb-6">
        <h1 className="text-gray-900 dark:text-gray-100">Gestión de Usuarios</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Administra los usuarios del sistema</p>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F05454]/10 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#F05454]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Usuarios</p>
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
              <p className="text-xs text-gray-500 dark:text-gray-400">Activos</p>
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
              <p className="text-xs text-gray-500 dark:text-gray-400">Inactivos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalInactivos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#30475E]/10 dark:bg-[#30475E]/30 rounded-xl flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-[#30475E] dark:text-blue-300" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Conectados Hoy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{conectadosHoy}</p>
            </div>
          </div>
        </div>
      </div>

      {
    /* Search & Actions Bar */
  }
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
    type="text"
    name="search-user-chazin"
    placeholder="Buscar usuario por nombre o email..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-[#F05454] focus:border-transparent transition-colors text-sm"
    autoComplete="off"
  />
          </div>
          <div className="flex gap-2">
            <button onClick={exportarReporte} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium whitespace-nowrap" title="Exportar CSV">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-[#c0392b] transition-colors text-sm font-medium shadow-sm whitespace-nowrap">
              <Plus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* Filter pills */
  }
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-3 mb-6 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1">Rol:</span>
        {ROLES_FILTRO.map((r) => <button key={r} onClick={() => setFilterRol(r)} className={pillBtn(filterRol === r)}>{r}</button>)}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mr-1">Estado:</span>
        {ESTADOS_FILTRO.map((e) => <button key={e} onClick={() => setFilterEstado(e)} className={pillBtn(filterEstado === e)}>{e}</button>)}
      </div>

      {
    /* Mobile Cards */
  }
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {filtered.map((usuario) => <div key={usuario.idUsuario} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarGradient(usuario.rolNombre)} rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {usuario.iniciales}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{usuario.nombre}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">ID #{usuario.idUsuario}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${usuario.estado === "Activo" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                {usuario.estado}
              </span>
            </div>
            <div className="px-4 pb-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{usuario.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>{usuario.telefono}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Shield className="w-3.5 h-3.5 shrink-0" />
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRolColor(usuario.rolNombre)}`}>{usuario.rolNombre}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Activity className="w-3.5 h-3.5 shrink-0" />
                <span>Último acceso: {usuario.ultimoAcceso}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700/60 px-4 py-2.5 flex items-center gap-1">
              <button onClick={() => openEdit(usuario)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Editar">
                <Edit className="w-3.5 h-3.5" /><span>Editar</span>
              </button>
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
              <button onClick={() => openPassword(usuario)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors" title="Cambiar contraseña">
                <Lock className="w-3.5 h-3.5" /><span>Contraseña</span>
              </button>
              {usuario.rolNombre !== "Administrador" && usuario.estado === "Activo" && <>
                  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
                  <button onClick={() => openDelete(usuario)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-[#F05454] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Inactivar">
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

      {
    /* Desktop Table */
  }
      <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700/60">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Último Acceso</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
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
                        <p className="font-medium text-gray-900 dark:text-gray-100">{usuario.nombre}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">ID #{usuario.idUsuario}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{usuario.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{usuario.telefono}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getRolColor(usuario.rolNombre)}`}>
                      <Shield className="w-3 h-3" />{usuario.rolNombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{usuario.ultimoAcceso}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${usuario.estado === "Activo" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
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
                      {usuario.rolNombre !== "Administrador" && usuario.estado === "Activo" && <button onClick={() => openDelete(usuario)} className="p-2 text-[#F05454] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Inactivar">
                          <Trash2 className="w-4 h-4" />
                        </button>}
                    </div>
                  </td>
                </tr>)}
              {filtered.length === 0 && <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                    No se encontraron usuarios con los filtros aplicados
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Inactivar Modal */
  }
      {showDeleteModal && selectedUsuario && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-700/60">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserX className="w-7 h-7 text-[#F05454]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">¿Inactivar usuario?</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                Vas a inactivar a <span className="font-semibold text-gray-800 dark:text-gray-200">"{selectedUsuario.nombre}"</span>.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">El usuario perderá acceso al sistema. Puedes reactivarlo editando su estado.</p>
              <div className="flex gap-3">
                <button onClick={closeDelete} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">Cancelar</button>
                <button onClick={handleInactivar} className="flex-1 px-4 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-[#c0392b] transition-colors text-sm font-medium">Inactivar</button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* Edit Modal */
  }
      {showEditModal && selectedUsuario && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700/60">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(selectedUsuario.rolNombre)} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
                  {selectedUsuario.iniciales}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-gray-100">Editar Usuario</h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{selectedUsuario.nombre}</p>
                </div>
              </div>
              <button onClick={closeEdit} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Nombre Completo</label>
                  <input type="text" value={editForm.nombre} onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))} className={inputCls} placeholder="Nombre completo" />
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
                    <option value="1">Administrador</option>
                    <option value="2">Cocinero</option>
                    <option value="3">Cliente</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Estado</label>
                  <select value={editForm.estado} onChange={(e) => setEditForm((f) => ({ ...f, estado: e.target.value }))} className={inputCls}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </select>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-xl p-3.5 space-y-2 mt-2 select-none col-span-1 sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.sendNotification}
                      onChange={(e) => setEditForm((f) => ({ ...f, sendNotification: e.target.checked }))}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                      Notificar al usuario por correo electrónico sobre los cambios
                    </span>
                  </label>
                  {editForm.sendNotification && (
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 pl-6 leading-relaxed">
                      Se enviará un correo automático a <span className="font-semibold">{editForm.email}</span> detallando los datos modificados (Nombre, Teléfono, Rol o Estado).
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700/60 flex justify-end gap-3">
              <button onClick={closeEdit} className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-6 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-[#c0392b] transition-colors text-sm font-medium">Guardar Cambios</button>
            </div>
          </div>
        </div>}

      {
    /* New User Modal */
  }
      {showModal && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700/60">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-gray-100">Nuevo Usuario</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {
    /* Profile image */
  }
              <div>
                <label className={labelCls}>Imagen de Perfil (Opcional)</label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-[#F05454] transition-colors">
                  {imagePreview ? <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                      <button onClick={() => setImagePreview(null)} className="absolute top-2 right-2 p-1.5 bg-[#F05454] text-white rounded-full hover:bg-[#c0392b] transition-colors shadow">
                        <X className="w-3 h-3" />
                      </button>
                    </div> : <label className="flex flex-col items-center justify-center h-32 cursor-pointer gap-2">
                      <Upload className="w-7 h-7 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Haz clic para subir foto de perfil</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG hasta 2MB</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Nombre Completo</label>
                  <input type="text" value={newForm.nombre} onChange={(e) => setNewForm((f) => ({ ...f, nombre: e.target.value }))} className={inputCls} placeholder="Ej: Juan Pérez" />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={newForm.email} onChange={(e) => setNewForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="usuario@chazinfood.com" />
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input type="tel" value={newForm.telefono} onChange={(e) => setNewForm((f) => ({ ...f, telefono: e.target.value }))} className={inputCls} placeholder="319 000 0000" />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Credenciales de Acceso</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Contraseña</label>
                    <input type="password" value={newForm.password} onChange={(e) => setNewForm((f) => ({ ...f, password: e.target.value }))} className={inputCls} placeholder="••••••••" autoComplete="new-password" />
                  </div>
                  <div>
                    <label className={labelCls}>Confirmar Contraseña</label>
                    <input type="password" value={newForm.confirmPassword} onChange={(e) => setNewForm((f) => ({ ...f, confirmPassword: e.target.value }))} className={inputCls} placeholder="••••••••" autoComplete="new-password" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Asignación de Rol</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Rol</label>
                    <select value={newForm.idRolStr} onChange={(e) => setNewForm((f) => ({ ...f, idRolStr: e.target.value }))} className={inputCls}>
                      <option value="">Seleccionar rol...</option>
                      <option value="1">Administrador</option>
                      <option value="2">Cocinero</option>
                      <option value="3">Cliente</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Estado</label>
                    <select value={newForm.estado} onChange={(e) => setNewForm((f) => ({ ...f, estado: e.target.value }))} className={inputCls}>
                      <option>Activo</option>
                      <option>Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-xl p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300">El usuario heredará todos los permisos asignados al rol seleccionado</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newForm.sendWelcome} onChange={(e) => setNewForm((f) => ({ ...f, sendWelcome: e.target.checked }))} className="rounded border-gray-300 dark:border-gray-600 text-[#F05454] focus:ring-[#F05454]" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Enviar correo de bienvenida con credenciales de acceso</span>
              </label>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700/60 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
                Cancelar
              </button>
              <button onClick={handleCreateUser} className="px-6 py-2.5 bg-[#F05454] text-white rounded-xl hover:bg-[#c0392b] transition-colors text-sm font-medium">
                Crear Usuario
              </button>
            </div>
          </div>
        </div>}

      {showPasswordModal && selectedUsuario && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700/60">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-gray-100">Cambiar Contraseña</h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{selectedUsuario.nombre}</p>
                </div>
              </div>
              <button onClick={closePassword} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Dummy hidden inputs to absorb browser autofill */}
              <input type="text" style={{ display: "none" }} name="fakeusername" />
              <input type="password" style={{ display: "none" }} name="fakepassword" />
              <div>
                <label className={labelCls}>Nueva Contraseña</label>
                <input type="password" value={passwordForm.password} onChange={(e) => setPasswordForm((f) => ({ ...f, password: e.target.value }))} className={inputCls} placeholder="••••••••" autoComplete="new-password" />
              </div>
              <div>
                <label className={labelCls}>Confirmar Nueva Contraseña</label>
                <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))} className={inputCls} placeholder="••••••••" autoComplete="new-password" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-normal leading-normal">
                La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-xl p-3.5 space-y-2 mt-2 select-none">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={passwordForm.sendNotification}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, sendNotification: e.target.checked }))}
                    className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                    Notificar al usuario por correo electrónico
                  </span>
                </label>
                {passwordForm.sendNotification && (
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 pl-6 leading-relaxed">
                    Se enviará un correo automático a <span className="font-semibold">{selectedUsuario.email}</span> para notificarle que su contraseña ha sido modificada por seguridad.
                  </p>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700/60 flex justify-end gap-3">
              <button onClick={closePassword} className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">Cancelar</button>
              <button onClick={handleSavePassword} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors text-sm font-medium">Actualizar Contraseña</button>
            </div>
          </div>
        </div>}
    </div>;
}

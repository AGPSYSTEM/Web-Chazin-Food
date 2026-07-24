import { useState } from "react";
import { Plus, Search, Edit, Trash2, Package, X, Upload, UploadCloud } from "lucide-react";
import { useNotifications } from "@/domain/hooks/useNotifications";
const EMOJIS = ["\u{1F354}", "\u{1F35F}", "\u{1F32D}", "\u{1F357}", "\u{1F964}", "\u{1F957}", "\u{1F370}", "\u{1F371}", "\u{1F355}", "\u{1F363}", "\u{1F969}", "\u{1F35C}", "\u{1F96A}", "\u{1F37F}", "\u{1F9C3}"];
const isImage = (val) => {
  if (!val) return false;
  return val.startsWith("data:") || val.startsWith("http") || val.startsWith("/");
};
const initialData = [
  { idCategoriaProducto: 1, nombre: "Hamburguesas", descripcion: "Hamburguesas de todo tipo", cantidad: 8, estado: "Activo", imagen: "\u{1F354}" },
  { idCategoriaProducto: 2, nombre: "Salchipapas", descripcion: "Salchipapas y variaciones", cantidad: 5, estado: "Activo", imagen: "\u{1F35F}" },
  { idCategoriaProducto: 3, nombre: "Perros Calientes", descripcion: "Hot dogs y variaciones", cantidad: 6, estado: "Activo", imagen: "\u{1F32D}" },
  { idCategoriaProducto: 4, nombre: "Pollo", descripcion: "Pollo broaster y derivados", cantidad: 4, estado: "Activo", imagen: "\u{1F357}" },
  { idCategoriaProducto: 5, nombre: "Bebidas", descripcion: "Bebidas fr\xEDas y calientes", cantidad: 12, estado: "Activo", imagen: "\u{1F964}" },
  { idCategoriaProducto: 6, nombre: "Acompa\xF1amientos", descripcion: "Papas, aros de cebolla, etc.", cantidad: 7, estado: "Activo", imagen: "\u{1F957}" },
  { idCategoriaProducto: 7, nombre: "Postres", descripcion: "Postres y dulces", cantidad: 3, estado: "Activo", imagen: "\u{1F370}" },
  { idCategoriaProducto: 8, nombre: "Combos", descripcion: "Combos especiales", cantidad: 10, estado: "Activo", imagen: "\u{1F371}" }
];
function EmojiPicker({ selected, onSelect }) {
  return <div>
      <div className="flex items-center justify-center mb-3">
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl text-5xl">{selected}</div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {EMOJIS.map((emoji) => <button
    key={emoji}
    type="button"
    onClick={() => onSelect(emoji)}
    className={`text-2xl p-2 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 ${selected === emoji ? "bg-red-100 dark:bg-red-900/40 ring-2 ring-red-400" : ""}`}
  >
            {emoji}
          </button>)}
      </div>
    </div>;
}
const ModalBackdrop = ({ children, onClose }) => <div
  className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4"
  onClick={onClose}
>
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>;
export function CategoriaProductos() {
  const notify = useNotifications();
  const [categorias, setCategorias] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const emptyForm = { nombre: "", descripcion: "", estado: "Activo", imagen: "\u{1F354}" };
  const [newForm, setNewForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [newFormTab, setNewFormTab] = useState("emoji"); // "emoji" o "upload"
  const [editFormTab, setEditFormTab] = useState("emoji"); // "emoji" o "upload"
  const total = categorias.length;
  const activas = categorias.filter((c) => c.estado === "Activo").length;
  const inactivas = categorias.filter((c) => c.estado === "Inactivo").length;
  const filteredCategorias = categorias.filter(
    (c) => c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const openNew = () => {
    setNewForm(emptyForm);
    setNewFormTab("emoji");
    setShowModal(true);
  };
  const handleSaveNew = () => {
    if (!newForm.nombre.trim()) {
      notify.error("Campo requerido", "El nombre de la categoría no puede estar vacío.");
      return;
    }
    const duplicate = categorias.some(
      (c) => c.nombre.trim().toLowerCase() === newForm.nombre.trim().toLowerCase()
    );
    if (duplicate) {
      notify.error("Nombre duplicado", `Ya existe una categoría con el nombre "${newForm.nombre}".`);
      return;
    }
    const nextId = categorias.length > 0 ? Math.max(...categorias.map((c) => c.idCategoriaProducto)) + 1 : 1;
    const nueva = {
      idCategoriaProducto: nextId,
      nombre: newForm.nombre.trim(),
      descripcion: newForm.descripcion.trim(),
      estado: newForm.estado,
      imagen: newForm.imagen,
      cantidad: 0
    };
    setCategorias((prev) => [...prev, nueva]);
    setShowModal(false);
    notify.success("Categoría creada", `"${nueva.nombre}" fue agregada exitosamente.`);
  };
  const openEdit = (cat) => {
    setSelectedCategoria(cat);
    setEditForm({ nombre: cat.nombre, descripcion: cat.descripcion, estado: cat.estado, imagen: cat.imagen });
    setEditFormTab(isImage(cat.imagen) ? "upload" : "emoji");
    setShowEditModal(true);
  };
  const closeEdit = () => {
    setShowEditModal(false);
    setSelectedCategoria(null);
  };
  const handleSaveEdit = () => {
    if (!editForm.nombre.trim()) {
      notify.error("Campo requerido", "El nombre de la categor\xEDa no puede estar vac\xEDo.");
      return;
    }
    const duplicate = categorias.some(
      (c) => c.nombre.trim().toLowerCase() === editForm.nombre.trim().toLowerCase() && c.idCategoriaProducto !== selectedCategoria.idCategoriaProducto
    );
    if (duplicate) {
      notify.error("Nombre duplicado", `Ya existe una categor\xEDa con el nombre "${editForm.nombre}".`);
      return;
    }
    setCategorias(
      (prev) => prev.map(
        (c) => c.idCategoriaProducto === selectedCategoria.idCategoriaProducto ? { ...c, nombre: editForm.nombre.trim(), descripcion: editForm.descripcion.trim(), estado: editForm.estado, imagen: editForm.imagen } : c
      )
    );
    closeEdit();
    notify.success("Categor\xEDa actualizada", `"${editForm.nombre}" fue actualizada exitosamente.`);
  };
  const handleDelete = async (cat) => {
    if (cat.cantidad > 0) {
      notify.error("No se puede eliminar", "No es posible eliminar esta categor\xEDa porque existen productos asociados a ella.");
      return;
    }
    const confirmed = await notify.confirmDelete(
      "\xBFEliminar categor\xEDa?",
      `\xBFEst\xE1s seguro de eliminar la categor\xEDa "${cat.nombre}"? Esta acci\xF3n no se puede deshacer.`
    );
    if (confirmed) {
      setCategorias((prev) => prev.filter((c) => c.idCategoriaProducto !== cat.idCategoriaProducto));
      notify.success("Categor\xEDa eliminada", `"${cat.nombre}" fue eliminada correctamente.`);
    }
  };
  const handleToggleEstado = (cat) => {
    const nuevoEstado = cat.estado === "Activo" ? "Inactivo" : "Activo";
    setCategorias(
      (prev) => prev.map(
        (c) => c.idCategoriaProducto === cat.idCategoriaProducto ? { ...c, estado: nuevoEstado } : c
      )
    );
    notify.success("Estado actualizado", `"${cat.nombre}" ahora est\xE1 ${nuevoEstado}.`);
  };
  return <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      {
    /* Header */
  }
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Categoría de Productos</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona las categorías de productos del menú</p>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">{total}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Categorías</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 flex flex-col items-center">
          <span className="text-3xl font-bold text-green-600">{activas}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Activas</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-500">{inactivas}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Inactivas</span>
        </div>
      </div>

      {
    /* Actions Bar */
  }
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
    type="text"
    placeholder="Buscar categoría..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  />
            </div>
          </div>
          <button
    onClick={openNew}
    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-md"
  >
            <Plus className="w-4 h-4" />
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      {
    /* Grid */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCategorias.map((categoria) => <div
    key={categoria.idCategoriaProducto}
    className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
  >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-xl flex items-center justify-center text-4xl overflow-hidden shrink-0">
                  {isImage(categoria.imagen) ? (
                    <img src={categoria.imagen} alt={categoria.nombre} className="w-full h-full object-cover" />
                  ) : (
                    categoria.imagen
                  )}
                </div>
                <button
    onClick={() => handleToggleEstado(categoria)}
    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${categoria.estado === "Activo" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
  >
                  {categoria.estado}
                </button>
              </div>

              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">{categoria.nombre}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{categoria.descripcion}</p>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <Package className="w-4 h-4" />
                <span>{categoria.cantidad} productos</span>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
    onClick={() => openEdit(categoria)}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
  >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
    onClick={() => handleDelete(categoria)}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
  >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>)}

        {filteredCategorias.length === 0 && <div className="col-span-full text-center py-16 text-gray-400 dark:text-gray-500">
            No se encontraron categorías que coincidan con la búsqueda.
          </div>}
      </div>

      {
    /* Nueva Categoría Modal */
  }
      {showModal && <ModalBackdrop onClose={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Nueva Categoría</h2>
              <button
    onClick={() => setShowModal(false)}
    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
  >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre *</label>
                <input
    type="text"
    value={newForm.nombre}
    onChange={(e) => setNewForm((f) => ({ ...f, nombre: e.target.value }))}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
    placeholder="Ej: Hamburguesas"
  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                <textarea
    value={newForm.descripcion}
    onChange={(e) => setNewForm((f) => ({ ...f, descripcion: e.target.value }))}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
    rows={3}
    placeholder="Describe la categoría..."
  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagen de la Categoría</label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNewFormTab("emoji");
                      if (isImage(newForm.imagen)) {
                        setNewForm(f => ({ ...f, imagen: "🍔" }));
                      }
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${newFormTab === "emoji" ? "bg-red-500 border-red-500 text-white" : "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                  >
                    Usar Ícono/Emoji
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewFormTab("upload");
                      if (!isImage(newForm.imagen)) {
                        setNewForm(f => ({ ...f, imagen: "" }));
                      }
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${newFormTab === "upload" ? "bg-red-500 border-red-500 text-white" : "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                  >
                    Subir Imagen
                  </button>
                </div>

                {newFormTab === "emoji" ? (
                  <EmojiPicker selected={newForm.imagen} onSelect={(e) => setNewForm((f) => ({ ...f, imagen: e }))} />
                ) : (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-red-400 dark:hover:border-red-500 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-colors text-center">
                    {newForm.imagen && isImage(newForm.imagen) ? (
                      <div className="relative inline-block">
                        <img src={newForm.imagen} alt="Preview" className="w-24 h-24 object-cover rounded-xl mx-auto" />
                        <button
                          type="button"
                          onClick={() => setNewForm((f) => ({ ...f, imagen: "" }))}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-full text-blue-500 dark:text-blue-400">
                          <UploadCloud className="w-8 h-8" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Haz clic para subir una imagen</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG hasta 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setNewForm((f) => ({ ...f, imagen: event.target.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
                <select
    value={newForm.estado}
    onChange={(e) => setNewForm((f) => ({ ...f, estado: e.target.value }))}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
    onClick={() => setShowModal(false)}
    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium dark:text-gray-300"
  >
                Cancelar
              </button>
              <button
    onClick={handleSaveNew}
    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
  >
                Guardar
              </button>
            </div>
          </div>
        </ModalBackdrop>}

      {
    /* Editar Categoría Modal */
  }
      {showEditModal && selectedCategoria && <ModalBackdrop onClose={closeEdit}>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Editar Categoría</h2>
              <button
    onClick={closeEdit}
    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
  >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre *</label>
                <input
    type="text"
    value={editForm.nombre}
    onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                <textarea
    value={editForm.descripcion}
    onChange={(e) => setEditForm((f) => ({ ...f, descripcion: e.target.value }))}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
    rows={3}
  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagen de la Categoría</label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditFormTab("emoji");
                      if (isImage(editForm.imagen)) {
                        setEditForm(f => ({ ...f, imagen: "🍔" }));
                      }
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${editFormTab === "emoji" ? "bg-red-500 border-red-500 text-white" : "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                  >
                    Usar Ícono/Emoji
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditFormTab("upload");
                      if (!isImage(editForm.imagen)) {
                        setEditForm(f => ({ ...f, imagen: "" }));
                      }
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${editFormTab === "upload" ? "bg-red-500 border-red-500 text-white" : "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                  >
                    Subir Imagen
                  </button>
                </div>

                {editFormTab === "emoji" ? (
                  <EmojiPicker selected={editForm.imagen} onSelect={(e) => setEditForm((f) => ({ ...f, imagen: e }))} />
                ) : (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-red-400 dark:hover:border-red-500 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-colors text-center">
                    {editForm.imagen && isImage(editForm.imagen) ? (
                      <div className="relative inline-block">
                        <img src={editForm.imagen} alt="Preview" className="w-24 h-24 object-cover rounded-xl mx-auto" />
                        <button
                          type="button"
                          onClick={() => setEditForm((f) => ({ ...f, imagen: "" }))}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-full text-blue-500 dark:text-blue-400">
                          <UploadCloud className="w-8 h-8" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Haz clic para subir una imagen</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG hasta 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setEditForm((f) => ({ ...f, imagen: event.target.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
                <select
    value={editForm.estado}
    onChange={(e) => setEditForm((f) => ({ ...f, estado: e.target.value }))}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
    onClick={closeEdit}
    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium dark:text-gray-300"
  >
                Cancelar
              </button>
              <button
    onClick={handleSaveEdit}
    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
  >
                Guardar Cambios
              </button>
            </div>
          </div>
        </ModalBackdrop>}
    </div>;
}

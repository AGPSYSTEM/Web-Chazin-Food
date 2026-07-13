import { useState } from "react";
import { Plus, Search, Edit, Trash2, X, AlertTriangle } from "lucide-react";
import { useNotifications } from "@/domain/hooks/useNotifications";
const categoriasData = [
  { id: 1, nombre: "Frutas", descripcion: "Frutas frescas y congeladas", cantidad: 12, estado: "Activo" },
  { id: 2, nombre: "Verduras", descripcion: "Verduras y vegetales", cantidad: 18, estado: "Activo" },
  { id: 3, nombre: "Prote\xEDnas", descripcion: "Carnes, pollo, pescado", cantidad: 8, estado: "Activo" },
  { id: 4, nombre: "Carbohidratos", descripcion: "Panes, harinas, pastas", cantidad: 15, estado: "Activo" },
  { id: 5, nombre: "L\xE1cteos", descripcion: "Leche, quesos, mantequilla", cantidad: 10, estado: "Activo" },
  { id: 6, nombre: "Condimentos", descripcion: "Salsas, especias, aderezos", cantidad: 25, estado: "Activo" },
  { id: 7, nombre: "Bebidas", descripcion: "Gaseosas, jugos, agua", cantidad: 14, estado: "Activo" },
  { id: 8, nombre: "Congelados", descripcion: "Productos congelados", cantidad: 6, estado: "Inactivo" }
];
const insumosPorCategoria = { 1: 3, 2: 4, 3: 3, 4: 3, 5: 2, 6: 4, 7: 3, 8: 1 };
export function CategoriaInsumos() {
  const notify = useNotifications();
  const [categorias, setCategorias] = useState(categoriasData);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevaFormSubmitted, setNuevaFormSubmitted] = useState(false);
  const [editFormSubmitted, setEditFormSubmitted] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [formNueva, setFormNueva] = useState({ nombre: "", descripcion: "", estado: "Activo" });
  const [formEdit, setFormEdit] = useState({ nombre: "", descripcion: "", estado: "Activo" });
  const openEdit = (c) => {
    setSelectedCategoria(c);
    setFormEdit({ nombre: c.nombre, descripcion: c.descripcion, estado: c.estado });
    setShowEditModal(true);
    setEditFormSubmitted(false);
  };
  const closeEdit = () => {
    setShowEditModal(false);
    setSelectedCategoria(null);
    setEditFormSubmitted(false);
  };
  const openDelete = (c) => {
    setSelectedCategoria(c);
    setShowDeleteModal(true);
  };
  const closeDelete = () => {
    setShowDeleteModal(false);
    setSelectedCategoria(null);
  };
  const handleGuardarNueva = () => {
    setNuevaFormSubmitted(true);
    if (!formNueva.nombre.trim()) return;
    const nextId = categorias.length ? Math.max(...categorias.map((c) => c.id)) + 1 : 1;
    setCategorias([...categorias, { id: nextId, nombre: formNueva.nombre.trim(), descripcion: formNueva.descripcion.trim(), cantidad: 0, estado: formNueva.estado }]);
    setFormNueva({ nombre: "", descripcion: "", estado: "Activo" });
    setShowModal(false);
    setNuevaFormSubmitted(false);
  };
  const handleGuardarEdit = () => {
    setEditFormSubmitted(true);
    if (!selectedCategoria || !formEdit.nombre.trim()) return;
    setCategorias(categorias.map((c) => c.id === selectedCategoria.id ? { ...c, nombre: formEdit.nombre.trim(), descripcion: formEdit.descripcion.trim(), estado: formEdit.estado } : c));
    closeEdit();
  };
  const handleEliminar = () => {
    if (!selectedCategoria) return;
    const cantidadInsumos = insumosPorCategoria[selectedCategoria.id] || selectedCategoria.cantidad || 0;
    if (cantidadInsumos > 0) {
      notify.error("No se puede eliminar", "No es posible eliminar esta categor\xEDa porque existen insumos asociados a ella.");
      return;
    }
    setCategorias(categorias.filter((c) => c.id !== selectedCategoria.id));
    notify.success("Categoría eliminada", `La categoría "${selectedCategoria.nombre}" ha sido eliminada exitosamente.`);
    closeDelete();
  };
  const categoriasFiltradas = categorias.filter(
    (c) => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || c.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-full">
      {
    /* Header */
  }
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Categoría de Insumos</h1>
        <p className="text-gray-600 mt-1">Gestiona las categorías de insumos del negocio</p>
      </div>

      {
    /* Actions Bar */
  }
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
    type="text"
    placeholder="Buscar categoría..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
    onClick={() => setShowModal(true)}
    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-md whitespace-nowrap text-sm w-full md:w-auto"
  >
              <Plus className="w-4 h-4" />
              <span>Nueva Categoría</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* Table */
  }
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="hidden sm:table-cell px-3 md:px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-3 md:px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="hidden md:table-cell px-3 md:px-6 py-4 text-left text-sm font-semibold text-gray-700">Descripción</th>
                <th className="hidden sm:table-cell px-3 md:px-6 py-4 text-left text-sm font-semibold text-gray-700">Insumos</th>
                <th className="px-3 md:px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-3 md:px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categoriasFiltradas.map((categoria) => <tr key={categoria.id} className="hover:bg-gray-50 transition-colors">
                  <td className="hidden sm:table-cell px-3 md:px-6 py-4 text-sm text-gray-600">{categoria.id}</td>
                  <td className="px-3 md:px-6 py-4">
                    <span className="font-medium text-gray-800">{categoria.nombre}</span>
                  </td>
                  <td className="hidden md:table-cell px-3 md:px-6 py-4 text-sm text-gray-600">{categoria.descripcion}</td>
                  <td className="hidden sm:table-cell px-3 md:px-6 py-4">
                    <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs md:text-sm font-medium">
                      {categoria.cantidad}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4">
                    <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${categoria.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {categoria.estado}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4">
                    <div className="flex items-center gap-1 md:gap-2">
                      <button onClick={() => openEdit(categoria)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => openDelete(categoria)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Edit Modal */
  }
      {showEditModal && selectedCategoria && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Editar Categoría</h2>
              <button onClick={closeEdit} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formEdit.nombre}
                  onChange={(e) => setFormEdit((f) => ({ ...f, nombre: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                    editFormSubmitted && !formEdit.nombre.trim() ? "border-red-500" : "border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                />
                {editFormSubmitted && !formEdit.nombre.trim() && (
                  <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                <textarea value={formEdit.descripcion} onChange={(e) => setFormEdit((f) => ({ ...f, descripcion: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
                <select value={formEdit.estado} onChange={(e) => setFormEdit((f) => ({ ...f, estado: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button onClick={closeEdit} className="px-6 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancelar</button>
              <button onClick={handleGuardarEdit} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">Guardar Cambios</button>
            </div>
          </div>
        </div>}

      {
    /* Delete Modal */
  }
      {showDeleteModal && selectedCategoria && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">¿Eliminar categoría?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                Vas a eliminar <span className="font-semibold text-gray-800 dark:text-gray-200">"{selectedCategoria.nombre}"</span>.
              </p>
              <p className="text-sm text-gray-500 mb-6">Afectará los {selectedCategoria.cantidad} insumos asociados. Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button onClick={closeDelete} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancelar</button>
                <button onClick={handleEliminar} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">Eliminar</button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* Nueva Categoría Modal */
  }
      {showModal && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Nueva Categoría</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formNueva.nombre}
                  onChange={(e) => setFormNueva((f) => ({ ...f, nombre: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                    nuevaFormSubmitted && !formNueva.nombre.trim() ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: Frutas"
                />
                {nuevaFormSubmitted && !formNueva.nombre.trim() && (
                  <p className="text-red-500 text-xs mt-1">campo obligatorio*</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formNueva.descripcion}
                  onChange={(e) => setFormNueva((f) => ({ ...f, descripcion: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Describe la categoría..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select value={formNueva.estado} onChange={(e) => setFormNueva((f) => ({ ...f, estado: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormNueva({ nombre: "", descripcion: "", estado: "Activo" });
                  setNuevaFormSubmitted(false);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button onClick={handleGuardarNueva} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
                Guardar
              </button>
            </div>
          </div>
        </div>}
    </div>;
}

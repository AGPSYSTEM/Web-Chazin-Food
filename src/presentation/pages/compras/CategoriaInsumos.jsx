import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, AlertTriangle } from "lucide-react";
import { useNotifications } from "@/domain/hooks/useNotifications";

export function CategoriaInsumos() {
  const notify = useNotifications();
  const [categorias, setCategorias] = useState([]);
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
    if (c.cantidad > 0) {
      notify.error("No se puede eliminar", "No es posible eliminar esta categoría porque la categoría cuenta con insumos asociados.");
      return;
    }
    setSelectedCategoria(c);
    setShowDeleteModal(true);
  };
  const closeDelete = () => {
    setShowDeleteModal(false);
    setSelectedCategoria(null);
  };
  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categorias-insumo');
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error(error);
      notify.error("Error", "Fallo de conexión al cargar categorías");
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

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

  const handleGuardarNueva = async () => {
    setNuevaFormSubmitted(true);
    if (!formNueva.nombre.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/categorias-insumo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formNueva)
      });
      if (response.ok) {
        await fetchCategorias();
        setFormNueva({ nombre: "", descripcion: "", estado: "Activo" });
        setShowModal(false);
        setNuevaFormSubmitted(false);
        await registrarTrazabilidad("crear", formNueva.nombre, `Se creó una nueva categoría en el inventario: ${formNueva.nombre}`);
        notify.success("Categoría creada", "La categoría se creó exitosamente");
      } else {
        notify.error("Error", "No se pudo guardar la categoría");
      }
    } catch (error) {
      console.error(error);
      notify.error("Error", "Fallo de conexión al guardar categoría");
    }
  };

  const handleGuardarEdit = async () => {
    setEditFormSubmitted(true);
    if (!selectedCategoria || !formEdit.nombre.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/categorias-insumo/${selectedCategoria.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEdit)
      });
      if (response.ok) {
        await fetchCategorias();
        closeEdit();
        await registrarTrazabilidad("editar", formEdit.nombre, `Se actualizaron los datos de la categoría: ${formEdit.nombre}`);
        notify.success("Categoría actualizada", "La categoría se actualizó exitosamente");
      } else {
        notify.error("Error", "No se pudo actualizar la categoría");
      }
    } catch (error) {
      console.error(error);
      notify.error("Error", "Fallo de conexión al actualizar categoría");
    }
  };

  const handleEliminar = async () => {
    if (!selectedCategoria) return;
    const cantidadInsumos = selectedCategoria.cantidad || 0;
    if (cantidadInsumos > 0) {
      notify.error("No se puede eliminar", "No es posible eliminar esta categoría porque la categoría cuenta con insumos asociados.");
      closeDelete();
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/categorias-insumo/${selectedCategoria.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchCategorias();
        await registrarTrazabilidad("eliminar", selectedCategoria.nombre, `Se eliminó del inventario la categoría: ${selectedCategoria.nombre}`);
        notify.success("Categoría eliminada", `La categoría "${selectedCategoria.nombre}" ha sido eliminada exitosamente.`);
        closeDelete();
      } else {
        const errorData = await response.json();
        notify.error("No se puede eliminar", errorData.message || "No se pudo eliminar la categoría");
        closeDelete();
      }
    } catch (error) {
      console.error(error);
      notify.error("Error", "Fallo de conexión al eliminar categoría");
      closeDelete();
    }
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

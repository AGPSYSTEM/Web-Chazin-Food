import { useState } from "react";
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, DollarSign, User, X, Package, Truck, Store, Banknote, Smartphone } from "lucide-react";
import { useCart, IVA_RATE } from "@/domain/state/CartContext";
import { useNotifications } from "@/domain/hooks/useNotifications";
const adicionesDisponibles = [
  { idAdicion: 1, nombre: "Salsa BBQ", precio: 1e3, stockActual: 50, tipo: "Salsa", imagen: "\u{1F96B}" },
  { idAdicion: 2, nombre: "Salsa de Ajo", precio: 1e3, stockActual: 45, tipo: "Salsa", imagen: "\u{1F9C4}" },
  { idAdicion: 3, nombre: "Salsa Picante", precio: 1e3, stockActual: 40, tipo: "Salsa", imagen: "\u{1F336}\uFE0F" },
  { idAdicion: 4, nombre: "Queso Extra", precio: 2e3, stockActual: 30, tipo: "Ingrediente", imagen: "\u{1F9C0}" },
  { idAdicion: 5, nombre: "Tocineta", precio: 3e3, stockActual: 25, tipo: "Ingrediente", imagen: "\u{1F953}" },
  { idAdicion: 6, nombre: "Papas Fritas", precio: 5e3, stockActual: 35, tipo: "Acompa\xF1amiento", imagen: "\u{1F35F}" },
  { idAdicion: 7, nombre: "Coca Cola", precio: 3e3, stockActual: 60, tipo: "Bebida", imagen: "\u{1F964}" },
  { idAdicion: 8, nombre: "Sprite", precio: 3e3, stockActual: 55, tipo: "Bebida", imagen: "\u{1F964}" },
  { idAdicion: 9, nombre: "Jugo de Naranja", precio: 4e3, stockActual: 20, tipo: "Bebida", imagen: "\u{1F9C3}" }
];
const productosDisponibles = [
  { id: 1, nombre: "Hamburguesa Especial", precio: 15e3, categoria: "Hamburguesas", imagen: "\u{1F354}", stockActual: 25, descripcion: "Hamburguesa con doble carne, queso, lechuga y tomate" },
  { id: 2, nombre: "Salchipapa Grande", precio: 12e3, categoria: "Salchipapas", imagen: "\u{1F35F}", stockActual: 30, descripcion: "Papas fritas con salchicha y salsas" },
  { id: 3, nombre: "Perro Caliente", precio: 1e4, categoria: "Perros", imagen: "\u{1F32D}", stockActual: 20, descripcion: "Hot dog con salsas y papa chip" },
  { id: 4, nombre: "Pollo Broaster", precio: 18e3, categoria: "Pollo", imagen: "\u{1F357}", stockActual: 15, descripcion: "Porci\xF3n de pollo broaster con papas" },
  { id: 5, nombre: "Papas Fritas", precio: 6e3, categoria: "Acompa\xF1amientos", imagen: "\u{1F35F}", stockActual: 40, descripcion: "Papas fritas crujientes" },
  { id: 6, nombre: "Coca Cola", precio: 3e3, categoria: "Bebidas", imagen: "\u{1F964}", stockActual: 60, descripcion: "Gaseosa Coca Cola 350ml" },
  { id: 7, nombre: "Combo Familiar", precio: 45e3, categoria: "Combos", imagen: "\u{1F371}", stockActual: 12, descripcion: "2 hamburguesas, salchipapa y bebidas" },
  { id: 8, nombre: "Arepa con Queso", precio: 8e3, categoria: "Acompa\xF1amientos", imagen: "\u{1FAD3}", stockActual: 18, descripcion: "Arepa rellena de queso" }
];
export function Venta() {
  const notify = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("Todos");
  const [showCheckout, setShowCheckout] = useState(false);
  const [cliente, setCliente] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState("mesa");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [efectivoPaga, setEfectivoPaga] = useState("");
  const [transferReferencia, setTransferReferencia] = useState("");
  const [transferBanco, setTransferBanco] = useState("Bancolombia");
  const [tarjetaNumero, setTarjetaNumero] = useState("");
  const [tarjetaMonto, setTarjetaMonto] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getSubtotal } = useCart();
  const categorias = ["Todos", "Hamburguesas", "Salchipapas", "Perros", "Pollo", "Bebidas", "Combos", "Acompa\xF1amientos"];
  const filteredProductos = productosDisponibles.filter((producto) => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === "Todos" || producto.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria;
  });
  const handleProductClick = (producto) => {
    setProductoSeleccionado({
      producto,
      cantidad: 1,
      adicionesSeleccionadas: []
    });
    setShowProductModal(true);
  };
  const handleAdicionToggle = (adicion) => {
    if (!productoSeleccionado) return;
    const exists = productoSeleccionado.adicionesSeleccionadas.find((a) => a.idAdicion === adicion.idAdicion);
    if (exists) {
      setProductoSeleccionado({
        ...productoSeleccionado,
        adicionesSeleccionadas: productoSeleccionado.adicionesSeleccionadas.filter((a) => a.idAdicion !== adicion.idAdicion)
      });
    } else {
      setProductoSeleccionado({
        ...productoSeleccionado,
        adicionesSeleccionadas: [
          ...productoSeleccionado.adicionesSeleccionadas,
          { idAdicion: adicion.idAdicion, nombre: adicion.nombre, precio: adicion.precio, cantidad: 1 }
        ]
      });
    }
  };
  const handleAdicionQuantityChange = (idAdicion, delta) => {
    if (!productoSeleccionado) return;
    setProductoSeleccionado({
      ...productoSeleccionado,
      adicionesSeleccionadas: productoSeleccionado.adicionesSeleccionadas.map((a) => {
        if (a.idAdicion === idAdicion) {
          const newQuantity = Math.max(1, a.cantidad + delta);
          return { ...a, cantidad: newQuantity };
        }
        return a;
      })
    });
  };
  const handleAddToCart = () => {
    if (!productoSeleccionado) return;
    addToCart({
      id: productoSeleccionado.producto.id,
      nombre: productoSeleccionado.producto.nombre,
      precio: productoSeleccionado.producto.precio,
      cantidad: productoSeleccionado.cantidad,
      imagen: productoSeleccionado.producto.imagen,
      adiciones: productoSeleccionado.adicionesSeleccionadas.map((a) => ({
        ...a,
        imagen: a.imagen || adicionesDisponibles.find((ad) => ad.idAdicion === a.idAdicion)?.imagen
      }))
    });
    setShowProductModal(false);
    setProductoSeleccionado(null);
    notify.success("\xA1Producto agregado!", "El producto se agreg\xF3 al carrito correctamente");
  };
  const handleRemoveFromCart = async (id, nombre) => {
    const confirmed = await notify.confirmDelete(
      "\xBFEliminar producto?",
      `\xBFEst\xE1s seguro de eliminar "${nombre}" del carrito?`
    );
    if (confirmed) {
      removeFromCart(id);
    }
  };
  const handleClearCart = async () => {
    const confirmed = await notify.confirmAction(
      "\xBFVaciar carrito?",
      "\xBFEst\xE1s seguro de vaciar todo el carrito?",
      "S\xED, vaciar"
    );
    if (confirmed) {
      clearCart();
      setCliente("");
      setDescuento(0);
      setShowCart(false);
    }
  };
  const subtotal = getSubtotal();
  const descuentoAmount = subtotal * (descuento / 100);
  const baseGravable = subtotal - descuentoAmount;
  const iva = Math.round(baseGravable * IVA_RATE);
  const total = baseGravable + iva;
  const vuelto = Math.max(0, Number(efectivoPaga || 0) - total);
  const handleCompleteSale = async () => {
    if (metodoPago === "efectivo" && efectivoPaga && Number(efectivoPaga) < total) {
      notify.error("Monto insuficiente", "El efectivo recibido es menor al total a pagar");
      return;
    }
    if (metodoPago === "transferencia" && !transferReferencia.trim()) {
      notify.error("Referencia requerida", "Ingresa el n\xFAmero de referencia de la transferencia");
      return;
    }
    notify.success("\xA1Venta completada!", "La venta se proces\xF3 exitosamente");
    clearCart();
    setShowCheckout(false);
    setCliente("");
    setDescuento(0);
    setEfectivoPaga("");
    setTransferReferencia("");
    setTipoEntrega("mesa");
    setMetodoPago("efectivo");
    setTarjetaNumero("");
    setTarjetaMonto("");
  };
  const adicionesPorTipo = adicionesDisponibles.reduce((acc, adicion) => {
    if (!acc[adicion.tipo]) acc[adicion.tipo] = [];
    acc[adicion.tipo].push(adicion);
    return acc;
  }, {});
  return <div className="flex flex-col lg:flex-row h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {
    /* Products Section */
  }
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Punto de Venta</h1>
          <p className="text-gray-600 dark:text-gray-400">Selecciona un producto para ver sus detalles y agregarlo al carrito</p>
        </div>

        {
    /* Search */
  }
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
    type="text"
    placeholder="Buscar producto..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  />
          </div>
        </div>

        {
    /* Categories */
  }
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2">
            {categorias.map((cat) => <button
    key={cat}
    onClick={() => setSelectedCategoria(cat)}
    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategoria === cat ? "bg-red-500 text-white shadow-md" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
  >
                {cat}
              </button>)}
          </div>
        </div>

        {
    /* Products Grid */
  }
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4 pb-20 lg:pb-4">
          {filteredProductos.map((producto) => <button
    key={producto.id}
    onClick={() => handleProductClick(producto)}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden text-left transform hover:scale-105"
  >
              <div className="bg-gradient-to-br from-red-400 to-red-600 h-32 flex items-center justify-center relative">
                <div className="text-6xl">{producto.imagen}</div>
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                  Stock: {producto.stockActual}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1 line-clamp-1">{producto.nombre}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{producto.categoria}</p>
                <p className="text-xl font-bold text-red-600">${producto.precio.toLocaleString()}</p>
              </div>
            </button>)}
        </div>
      </div>

      {
    /* Mobile Cart Button */
  }
      {getTotalItems() > 0 && <div className="lg:hidden fixed bottom-4 right-4 z-30">
          <button
    onClick={() => setShowCart(true)}
    className="bg-red-500 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-red-600 transition-all flex items-center gap-3 relative"
  >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-white text-red-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              {getTotalItems()}
            </span>
            <span className="font-bold">${total.toLocaleString()}</span>
          </button>
        </div>}

      {
    /* Desktop Cart */
  }
      <div className="hidden lg:flex flex-col bg-white dark:bg-gray-800 shadow-2xl w-96">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Carrito</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{getTotalItems()} productos</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente (Opcional)</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
    type="text"
    placeholder="Nombre del cliente..."
    value={cliente}
    onChange={(e) => setCliente(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">El carrito está vacío</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Agrega productos para comenzar</p>
            </div> : <div className="space-y-3">
              {cart.map((item, index) => <div key={`${item.id}-${index}`} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{item.imagen}</div>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm">{item.nombre}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">${item.precio.toLocaleString()}</p>
                      </div>
                    </div>
                    <button
    onClick={() => handleRemoveFromCart(item.id, item.nombre)}
    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded transition-colors"
  >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {item.adiciones.length > 0 && <div className="mb-2 pl-8 space-y-1">
                      {item.adiciones.map((adicion) => <div key={adicion.idAdicion} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <span className="text-sm">{adicion.imagen || "\u2795"}</span>
                          <span>{adicion.nombre} x{adicion.cantidad} (${(adicion.precio * adicion.cantidad).toLocaleString()})</span>
                        </div>)}
                    </div>}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
    onClick={() => updateQuantity(item.id, -1)}
    className="w-7 h-7 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
                        <Minus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-800 dark:text-gray-100 text-sm">{item.cantidad}</span>
                      <button
    onClick={() => updateQuantity(item.id, 1)}
    className="w-7 h-7 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
                        <Plus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                      ${((item.precio + item.adiciones.reduce((sum, a) => sum + a.precio * a.cantidad, 0)) * item.cantidad).toLocaleString()}
                    </p>
                  </div>
                </div>)}

              {cart.length > 0 && <button
    onClick={handleClearCart}
    className="w-full mt-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
  >
                  <Trash2 className="w-4 h-4" />
                  Vaciar carrito
                </button>}
            </div>}
        </div>

        {cart.length > 0 && <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descuento (%)</label>
              <input
    type="number"
    min="0"
    max="100"
    value={descuento}
    onChange={(e) => setDescuento(Number(e.target.value))}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">${subtotal.toLocaleString()}</span>
              </div>
              {descuento > 0 && <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Descuento ({descuento}%):</span>
                  <span className="font-medium text-red-600">-${descuentoAmount.toLocaleString()}</span>
                </div>}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">IVA ({(IVA_RATE * 100).toFixed(0)}%):</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">${iva.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="font-bold text-gray-800 dark:text-gray-100">Total:</span>
                <span className="font-bold text-xl text-gray-800 dark:text-gray-100">${total.toLocaleString()}</span>
              </div>
            </div>

            <button
    onClick={() => setShowCheckout(true)}
    className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold shadow-lg flex items-center justify-center gap-2"
  >
              <CreditCard className="w-5 h-5" />
              <span>Procesar Pago</span>
            </button>
          </div>}
      </div>

      {
    /* Mobile Cart Modal */
  }
      {showCart && <div className="lg:hidden fixed inset-0 z-40 bg-white dark:bg-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
    onClick={() => setShowCart(false)}
    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
  >
                  <X className="w-5 h-5" />
                </button>
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Carrito</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{getTotalItems()} productos</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente (Opcional)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
    type="text"
    placeholder="Nombre del cliente..."
    value={cliente}
    onChange={(e) => setCliente(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">El carrito está vacío</p>
              </div> : <div className="space-y-4">
                {cart.map((item, index) => <div key={`${item.id}-${index}`} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{item.imagen}</div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-gray-100">{item.nombre}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">${item.precio.toLocaleString()}</p>
                        </div>
                      </div>
                      <button
    onClick={() => handleRemoveFromCart(item.id, item.nombre)}
    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded transition-colors"
  >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {item.adiciones.length > 0 && <div className="mb-3 pl-11 space-y-1">
                        {item.adiciones.map((adicion) => <div key={adicion.idAdicion} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-base">{adicion.imagen || "\u2795"}</span>
                            <span>{adicion.nombre} x{adicion.cantidad} (${(adicion.precio * adicion.cantidad).toLocaleString()})</span>
                          </div>)}
                      </div>}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
    onClick={() => updateQuantity(item.id, -1)}
    className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
                          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="w-12 text-center font-medium text-gray-800 dark:text-gray-100">{item.cantidad}</span>
                        <button
    onClick={() => updateQuantity(item.id, 1)}
    className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
                          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                      <p className="font-bold text-gray-800 dark:text-gray-100">
                        ${((item.precio + item.adiciones.reduce((sum, a) => sum + a.precio * a.cantidad, 0)) * item.cantidad).toLocaleString()}
                      </p>
                    </div>
                  </div>)}

                {cart.length > 0 && <button
    onClick={handleClearCart}
    className="w-full py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
  >
                    <Trash2 className="w-4 h-4" />
                    Vaciar carrito
                  </button>}
              </div>}
          </div>

          {cart.length > 0 && <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descuento (%)</label>
                <input
    type="number"
    min="0"
    max="100"
    value={descuento}
    onChange={(e) => setDescuento(Number(e.target.value))}
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">${subtotal.toLocaleString()}</span>
                </div>
                {descuento > 0 && <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Descuento ({descuento}%):</span>
                    <span className="font-medium text-red-600">-${descuentoAmount.toLocaleString()}</span>
                  </div>}
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-bold text-gray-800 dark:text-gray-100">Total:</span>
                  <span className="font-bold text-xl text-gray-800 dark:text-gray-100">${total.toLocaleString()}</span>
                </div>
              </div>

              <button
    onClick={() => {
      setShowCheckout(true);
      setShowCart(false);
    }}
    className="w-full py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold text-lg shadow-lg flex items-center justify-center gap-2"
  >
                <CreditCard className="w-5 h-5" />
                <span>Procesar Pago</span>
              </button>
            </div>}
        </div>}

      {
    /* Product Selection Modal */
  }
      {showProductModal && productoSeleccionado && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-br from-red-400 to-red-600 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{productoSeleccionado.producto.imagen}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{productoSeleccionado.producto.nombre}</h2>
                  <p className="text-red-100">{productoSeleccionado.producto.categoria}</p>
                  <p className="text-white font-bold text-xl mt-1">${productoSeleccionado.producto.precio.toLocaleString()}</p>
                </div>
              </div>
              <button
    onClick={() => {
      setShowProductModal(false);
      setProductoSeleccionado(null);
    }}
    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
  >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">Información del Producto</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{productoSeleccionado.producto.descripcion}</p>
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <span className="font-medium">Stock disponible:</span> {productoSeleccionado.producto.stockActual} unidades
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cantidad</label>
                <div className="flex items-center gap-3">
                  <button
    onClick={() => setProductoSeleccionado({
      ...productoSeleccionado,
      cantidad: Math.max(1, productoSeleccionado.cantidad - 1)
    })}
    className="w-10 h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 w-16 text-center">
                    {productoSeleccionado.cantidad}
                  </span>
                  <button
    onClick={() => setProductoSeleccionado({
      ...productoSeleccionado,
      cantidad: Math.min(productoSeleccionado.producto.stockActual, productoSeleccionado.cantidad + 1)
    })}
    className="w-10 h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Adiciones Disponibles</h3>
                <div className="space-y-4">
                  {Object.entries(adicionesPorTipo).map(([tipo, adiciones]) => <div key={tipo}>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{tipo}s</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {adiciones.map((adicion) => {
    const seleccionada = productoSeleccionado.adicionesSeleccionadas.find(
      (a) => a.idAdicion === adicion.idAdicion
    );
    return <div
      key={adicion.idAdicion}
      className={`border-2 rounded-lg p-3 transition-all cursor-pointer ${seleccionada ? "border-red-500 bg-red-50 dark:bg-red-900/30" : "border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700"}`}
      onClick={() => handleAdicionToggle(adicion)}
    >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-gray-800 dark:text-gray-100">{adicion.nombre}</p>
                                    <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                                      Stock: {adicion.stockActual}
                                    </span>
                                  </div>
                                  <p className="text-sm font-bold text-red-600">+${adicion.precio.toLocaleString()}</p>
                                </div>
                                {seleccionada && <div className="flex items-center gap-2 ml-3">
                                    <button
      onClick={(e) => {
        e.stopPropagation();
        handleAdicionQuantityChange(adicion.idAdicion, -1);
      }}
      className="w-7 h-7 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center font-medium text-gray-800 dark:text-gray-100">
                                      {seleccionada.cantidad}
                                    </span>
                                    <button
      onClick={(e) => {
        e.stopPropagation();
        handleAdicionQuantityChange(adicion.idAdicion, 1);
      }}
      className="w-7 h-7 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>}
                              </div>
                            </div>;
  })}
                      </div>
                    </div>)}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-800 dark:text-gray-100">Total:</span>
                  <span className="font-bold text-2xl text-red-600">
                    ${((productoSeleccionado.producto.precio + productoSeleccionado.adicionesSeleccionadas.reduce((sum, a) => sum + a.precio * a.cantidad, 0)) * productoSeleccionado.cantidad).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
    onClick={() => {
      setShowProductModal(false);
      setProductoSeleccionado(null);
    }}
    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
  >
                    Cancelar
                  </button>
                  <button
    onClick={handleAddToCart}
    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold shadow-lg"
  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}

      {
    /* Checkout Modal */
  }
      {showCheckout && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Procesar Pago</h2>
            </div>
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">${subtotal.toLocaleString()}</span>
                </div>
                {descuento > 0 && <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Descuento ({descuento}%):</span>
                    <span className="font-medium text-red-600">-${descuentoAmount.toLocaleString()}</span>
                  </div>}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">IVA ({(IVA_RATE * 100).toFixed(0)}%):</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">${iva.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-bold text-lg text-gray-800 dark:text-gray-100">Total:</span>
                  <span className="font-bold text-2xl text-red-600">${total.toLocaleString()}</span>
                </div>
              </div>

              {
    /* Tipo de entrega */
  }
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Entrega</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
    { id: "mesa", label: "En Mesa", icon: <Store className="w-4 h-4" /> },
    { id: "recoger", label: "Recoger", icon: <Package className="w-4 h-4" /> },
    { id: "domicilio", label: "Domicilio", icon: <Truck className="w-4 h-4" /> }
  ].map((t) => <button
    key={t.id}
    type="button"
    onClick={() => setTipoEntrega(t.id)}
    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-xs font-medium ${tipoEntrega === t.id ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-300"}`}
  >
                      {t.icon}
                      {t.label}
                    </button>)}
                </div>
              </div>

              {
    /* Método de pago */
  }
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método de Pago</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
    { id: "efectivo", label: "Efectivo", icon: <Banknote className="w-4 h-4" /> },
    { id: "tarjeta", label: "Tarjeta", icon: <CreditCard className="w-4 h-4" /> },
    { id: "transferencia", label: "Transferencia", icon: <Smartphone className="w-4 h-4" /> }
  ].map((m) => <button
    key={m.id}
    type="button"
    onClick={() => setMetodoPago(m.id)}
    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-xs font-medium ${metodoPago === m.id ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-300"}`}
  >
                      {m.icon}
                      {m.label}
                    </button>)}
                </div>
              </div>

              {
    /* Formulario Efectivo */
  }
              {metodoPago === "efectivo" && <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-3">
                  <label className="block text-sm font-medium text-green-800 dark:text-green-300">
                    Efectivo recibido <span className="text-xs opacity-70">(opcional)</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 w-4 h-4" />
                    <input
    type="number"
    min="0"
    value={efectivoPaga}
    onChange={(e) => setEfectivoPaga(e.target.value)}
    className="w-full pl-9 pr-3 py-2.5 border-2 border-green-200 dark:border-green-800 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none"
    placeholder="Ej: 50000"
  />
                  </div>
                  {efectivoPaga && Number(efectivoPaga) >= total && <div className="flex justify-between bg-white dark:bg-gray-800 rounded-lg p-3 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Vuelto a entregar:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">${vuelto.toLocaleString()}</span>
                    </div>}
                  {efectivoPaga && Number(efectivoPaga) < total && <p className="text-xs text-red-600 dark:text-red-400">Monto menor al total a pagar.</p>}
                </div>}

              {
    /* Formulario Tarjeta */
  }
              {metodoPago === "tarjeta" && <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">
                      Número de tarjeta <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 w-4 h-4" />
                      <input
    type="text"
    inputMode="numeric"
    maxLength={19}
    value={tarjetaNumero}
    onChange={(e) => {
      const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
      setTarjetaNumero(raw.replace(/(.{4})/g, "$1 ").trim());
    }}
    className="w-full pl-9 pr-3 py-2.5 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none tracking-widest font-mono text-sm"
    placeholder="0000 0000 0000 0000"
  />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">
                      Monto a cargar
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 text-sm font-bold">$</span>
                      <input
    type="number"
    min="0"
    value={tarjetaMonto}
    onChange={(e) => setTarjetaMonto(e.target.value)}
    className="w-full pl-7 pr-3 py-2.5 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none text-sm"
    placeholder={total.toLocaleString()}
  />
                    </div>
                    {tarjetaMonto && Number(tarjetaMonto) > 0 && Number(tarjetaMonto) < total && <p className="text-xs text-red-600 dark:text-red-400 mt-1">El monto es menor al total a pagar.</p>}
                  </div>
                </div>}

              {
    /* Formulario Transferencia / Nequi / Daviplata */
  }
              {metodoPago === "transferencia" && <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Entidad / Banco origen</label>
                    <select
    value={transferBanco}
    onChange={(e) => setTransferBanco(e.target.value)}
    className="w-full px-3 py-2.5 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-blue-500 outline-none text-sm"
  >
                      <optgroup label="Billeteras digitales">
                        <option>Nequi</option>
                        <option>Daviplata</option>
                      </optgroup>
                      <optgroup label="Bancos">
                        <option>Bancolombia</option>
                        <option>Davivienda</option>
                        <option>BBVA</option>
                        <option>Banco de Bogotá</option>
                        <option>Banco Caja Social</option>
                        <option>Scotiabank Colpatria</option>
                        <option>Otro</option>
                      </optgroup>
                    </select>
                  </div>
                  {transferBanco === "Nequi" || transferBanco === "Daviplata" ? <p className="text-xs text-blue-800 dark:text-blue-300 bg-white/60 dark:bg-gray-800/60 rounded-lg px-3 py-2">
                      Envía a <strong>300 123 4567</strong> ({transferBanco}) — Chazin Food.
                    </p> : <p className="text-xs text-blue-800 dark:text-blue-300 bg-white/60 dark:bg-gray-800/60 rounded-lg px-3 py-2">
                      Transfiere a <strong>Bancolombia Ahorros 123-456789-00</strong> — Chazin Food.
                    </p>}
                  <div>
                    <label className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                      N° de referencia <span className="text-red-500">*</span>
                    </label>
                    <input
    type="text"
    value={transferReferencia}
    onChange={(e) => setTransferReferencia(e.target.value)}
    className="w-full px-3 py-2.5 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-blue-500 outline-none text-sm"
    placeholder="Ej: 987654321"
  />
                  </div>
                </div>}

              {cliente && <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <span className="font-medium">Cliente:</span> {cliente}
                  </p>
                </div>}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
    onClick={() => setShowCheckout(false)}
    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
  >
                Cancelar
              </button>
              <button
    onClick={handleCompleteSale}
    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold"
  >
                Confirmar Venta
              </button>
            </div>
          </div>
        </div>}
    </div>;
}

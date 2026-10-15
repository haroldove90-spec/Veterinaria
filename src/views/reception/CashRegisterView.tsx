import React, { useState } from 'react';
import {
  Receipt,
  ShoppingCart,
  Plus,
  Trash2,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  Printer,
  MessageCircle,
  Search,
  CheckCircle2,
  DollarSign,
  User,
  Dog,
} from 'lucide-react';
import {
  SaleTransaction,
  SaleItem,
  ServiceItem,
  InventoryItem,
  Client,
  Pet,
  PaymentMethod,
} from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

interface CashRegisterViewProps {
  services: ServiceItem[];
  inventory: InventoryItem[];
  clients: Client[];
  pets: Pet[];
  sales: SaleTransaction[];
  onAddSale: (sale: SaleTransaction) => void;
  onOpenTicket: (sale: SaleTransaction) => void;
  cashierName?: string;
  preselectedClientId?: string | null;
  preselectedPetId?: string | null;
}

export const CashRegisterView: React.FC<CashRegisterViewProps> = ({
  services,
  inventory,
  clients,
  pets,
  sales,
  onAddSale,
  onOpenTicket,
  cashierName = 'Carlos Rivas (Recepción)',
  preselectedClientId,
  preselectedPetId,
}) => {
  // Cart state
  const [selectedClientId, setSelectedClientId] = useState<string>(preselectedClientId || '');
  const [selectedPetId, setSelectedPetId] = useState<string>(preselectedPetId || '');
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [paymentReference, setPaymentReference] = useState<string>('');

  // Item catalog search
  const [itemSearch, setItemSearch] = useState('');
  const [catalogTab, setCatalogTab] = useState<'servicios' | 'productos'>('servicios');

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const selectedPet = pets.find((p) => p.id === selectedPetId);

  // Add service to cart
  const handleAddService = (srv: ServiceItem) => {
    const existing = cartItems.find((it) => it.itemId === srv.id);
    if (existing) {
      setCartItems(
        cartItems.map((it) =>
          it.itemId === srv.id
            ? { ...it, quantity: it.quantity + 1, subtotal: (it.quantity + 1) * it.unitPrice }
            : it
        )
      );
    } else {
      const newItem: SaleItem = {
        id: `it-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'servicio',
        itemId: srv.id,
        name: srv.name,
        quantity: 1,
        unitPrice: srv.price,
        subtotal: srv.price,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  // Add inventory product to cart
  const handleAddProduct = (prod: InventoryItem) => {
    const existing = cartItems.find((it) => it.itemId === prod.id);
    if (existing) {
      setCartItems(
        cartItems.map((it) =>
          it.itemId === prod.id
            ? { ...it, quantity: it.quantity + 1, subtotal: (it.quantity + 1) * it.unitPrice }
            : it
        )
      );
    } else {
      const newItem: SaleItem = {
        id: `it-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'producto',
        itemId: prod.id,
        name: prod.name,
        quantity: 1,
        unitPrice: prod.salePrice,
        subtotal: prod.salePrice,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleUpdateQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setCartItems(cartItems.filter((it) => it.id !== itemId));
    } else {
      setCartItems(
        cartItems.map((it) =>
          it.id === itemId
            ? { ...it, quantity: qty, subtotal: qty * it.unitPrice }
            : it
        )
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((it) => it.id !== itemId));
  };

  const subtotal = cartItems.reduce((acc, it) => acc + it.subtotal, 0);
  const total = Math.max(0, subtotal - discount);
  const change = paymentMethod === 'Efectivo' && amountReceived > total ? amountReceived - total : 0;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Agrega al menos un servicio o producto para cobrar.');
      return;
    }

    if (paymentMethod === 'Efectivo' && amountReceived < total) {
      alert(`El efectivo recibido (${formatCurrency(amountReceived)}) es menor al total a pagar (${formatCurrency(total)}).`);
      return;
    }

    const folioNumber = `TKT-${String(1040 + sales.length + 1).padStart(6, '0')}`;
    const newSale: SaleTransaction = {
      id: `sal-${Date.now()}`,
      folio: folioNumber,
      clientId: selectedClientId || undefined,
      clientName: selectedClient?.name || 'Venta al Público en General',
      clientPhone: selectedClient?.whatsapp || selectedClient?.phone,
      petId: selectedPetId || undefined,
      petName: selectedPet?.name,
      items: cartItems,
      subtotal,
      discount,
      total,
      paymentMethod,
      amountReceived: paymentMethod === 'Efectivo' ? amountReceived : undefined,
      change: paymentMethod === 'Efectivo' ? change : undefined,
      paymentReference: paymentReference || undefined,
      createdAt: new Date().toISOString(),
      cashierName,
    };

    onAddSale(newSale);
    onOpenTicket(newSale);

    // Reset cart
    setCartItems([]);
    setDiscount(0);
    setAmountReceived(0);
    setPaymentReference('');
    setSelectedPetId('');
  };

  // Filter catalog items
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
    s.code.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const filteredInventory = inventory.filter((p) =>
    p.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(itemSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600" />
            Caja y Punto de Cobro Rápido
          </h2>
          <p className="text-xs text-slate-500">
            Registro de pagos de consultas, servicios, medicamentos e impresión de tickets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Catalog Selection (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Customer Selection Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-teal-600" />
              Asignación de Tutor y Paciente
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Cliente / Tutor</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    setSelectedPetId('');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Venta al Público en General --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Paciente (Opcional)</label>
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  disabled={!selectedClientId}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                >
                  <option value="">-- Sin paciente asignado --</option>
                  {pets
                    .filter((p) => p.ownerId === selectedClientId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species})
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Catalog Tab & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setCatalogTab('servicios')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    catalogTab === 'servicios'
                      ? 'bg-white text-teal-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Servicios y Consultas ({services.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCatalogTab('productos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    catalogTab === 'productos'
                      ? 'bg-white text-teal-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Medicamentos y Alimentos ({inventory.length})
                </button>
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar concepto o código..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {catalogTab === 'servicios' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredServices.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => handleAddService(srv)}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-bold text-xs text-slate-800 line-clamp-2">
                          {srv.name}
                        </span>
                        <span className="text-xs font-extrabold text-teal-700 shrink-0">
                          {formatCurrency(srv.price)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-600 mt-2 pt-1 border-t border-slate-200/50">
                        <span>{srv.category}</span>
                        <span className="text-teal-600 font-bold flex items-center gap-0.5">
                          <Plus className="w-3 h-3" /> Agregar
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {catalogTab === 'productos' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredInventory.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleAddProduct(prod)}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <span className="font-bold text-xs text-slate-800 line-clamp-2">
                            {prod.name}
                          </span>
                          <span className="text-[10px] text-slate-600 block">
                            {prod.unit}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-teal-700 shrink-0">
                          {formatCurrency(prod.salePrice)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] mt-2 pt-1 border-t border-slate-200/50">
                        <span
                          className={
                            prod.stock <= prod.minStock
                              ? 'text-amber-700 font-bold'
                              : 'text-slate-600'
                          }
                        >
                          Stock: {prod.stock}
                        </span>
                        <span className="text-teal-600 font-bold flex items-center gap-0.5">
                          <Plus className="w-3 h-3" /> Agregar
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Cart & Payment (5 Cols) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleProcessPayment}
            className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-5 space-y-4 sticky top-20"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <ShoppingCart className="w-4 h-4 text-teal-600" />
                <span>Ticket en Caja ({cartItems.length})</span>
              </div>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCartItems([])}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Vaciar
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="max-h-56 overflow-y-auto space-y-2 text-xs">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-600">
                      {formatCurrency(item.unitPrice)} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      className="w-5 h-5 rounded-md bg-white border border-slate-300 flex items-center justify-center font-bold hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      className="w-5 h-5 rounded-md bg-white border border-slate-300 flex items-center justify-center font-bold hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-bold text-slate-800 w-16 text-right shrink-0">
                    {formatCurrency(item.subtotal)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="py-8 text-center text-slate-400 italic">
                  Selecciona conceptos del catálogo para armar el ticket.
                </div>
              )}
            </div>

            {/* Calculation Totals */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600">Descuento ($):</span>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discount || ''}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-24 px-2 py-1 text-right bg-slate-50 border border-slate-200 rounded-md font-semibold text-emerald-700"
                />
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>TOTAL A COBRAR:</span>
                <span className="text-teal-700">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">Forma de Pago *</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Efectivo', 'Tarjeta', 'Transferencia'] as PaymentMethod[]).map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => {
                      setPaymentMethod(method);
                      if (method === 'Efectivo' && amountReceived === 0) {
                        setAmountReceived(total);
                      }
                    }}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl border transition flex flex-col items-center gap-1 ${
                      paymentMethod === method
                        ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {method === 'Efectivo' && <Banknote className="w-4 h-4 text-emerald-600" />}
                    {method === 'Tarjeta' && <CreditCard className="w-4 h-4 text-blue-600" />}
                    {method === 'Transferencia' && (
                      <ArrowRightLeft className="w-4 h-4 text-purple-600" />
                    )}
                    <span>{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Payment Method Fields */}
            {paymentMethod === 'Efectivo' && (
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-semibold text-slate-700">Efectivo Recibido:</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={amountReceived || ''}
                    onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                    placeholder="Monto entregado"
                    className="w-28 px-2 py-1 bg-white border border-slate-300 rounded-lg text-right font-bold text-slate-900"
                  />
                </div>
                <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-emerald-200/50">
                  <span>Cambio / Vuelto:</span>
                  <span className={change > 0 ? 'text-emerald-700 text-sm' : 'text-slate-500'}>
                    {formatCurrency(change)}
                  </span>
                </div>
              </div>
            )}

            {(paymentMethod === 'Tarjeta' || paymentMethod === 'Transferencia') && (
              <div className="text-xs">
                <label className="block text-slate-600 font-semibold mb-1">
                  {paymentMethod === 'Tarjeta'
                    ? 'Referencia de Terminal / Autorización'
                    : 'Folio de Transferencia / SPEI'}
                </label>
                <input
                  type="text"
                  placeholder="Ej: AUTH-8821 / SPEI-4491"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>
            )}

            {/* Action Process Button */}
            <button
              type="submit"
              disabled={cartItems.length === 0}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Registrar Cobro e Imprimir Ticket</span>
            </button>
          </form>
        </div>
      </div>

      {/* Recent Sales History */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-600" />
            Ventas y Cobros Realizados Recientemente ({sales.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Folio</th>
                <th className="py-2.5 px-3">Fecha y Hora</th>
                <th className="py-2.5 px-3">Cliente / Mascota</th>
                <th className="py-2.5 px-3">Conceptos</th>
                <th className="py-2.5 px-3">Método</th>
                <th className="py-2.5 px-3 text-right">Total</th>
                <th className="py-2.5 px-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-700">
                    {sale.folio}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {formatDateTime(sale.createdAt)}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-800">{sale.clientName}</div>
                    {sale.petName && (
                      <div className="text-[10px] text-slate-600">Pac: {sale.petName}</div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                    {sale.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onOpenTicket(sale)}
                      className="px-2.5 py-1 text-xs font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition"
                    >
                      Ver Ticket
                    </button>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400 italic">
                    Aún no hay cobros registrados en la sesión actual.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Edit2,
  Trash2,
  X,
  Package,
} from 'lucide-react';
import { InventoryItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onAddInventoryItem: (item: InventoryItem) => void;
  onUpdateInventoryItem: (item: InventoryItem) => void;
  onDeleteInventoryItem: (id: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  onAddInventoryItem,
  onUpdateInventoryItem,
  onDeleteInventoryItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [onlyLowStock, setOnlyLowStock] = useState<boolean>(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Stock Adjust Modal
  const [stockAdjustItem, setStockAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustType, setAdjustType] = useState<'entrada' | 'salida'>('entrada');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState<string>('');

  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
    sku: '',
    name: '',
    category: 'Medicamento',
    activeSubstance: '',
    costPrice: 100,
    salePrice: 200,
    stock: 10,
    minStock: 5,
    unit: 'Frasco',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      sku: `INV-${String(inventory.length + 1).padStart(3, '0')}`,
      name: '',
      category: 'Medicamento',
      activeSubstance: '',
      costPrice: 100,
      salePrice: 200,
      stock: 10,
      minStock: 5,
      unit: 'Frasco',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      sku: item.sku,
      name: item.name,
      category: item.category,
      activeSubstance: item.activeSubstance || '',
      costPrice: item.costPrice,
      salePrice: item.salePrice,
      stock: item.stock,
      minStock: item.minStock,
      unit: item.unit,
    });
    setIsModalOpen(true);
  };

  const handleOpenAdjust = (item: InventoryItem, type: 'entrada' | 'salida') => {
    setStockAdjustItem(item);
    setAdjustType(type);
    setAdjustQuantity(1);
    setAdjustReason(type === 'entrada' ? 'Compra de reabastecimiento' : 'Uso en consulta médica');
  };

  const handleSaveStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustItem || adjustQuantity <= 0) return;

    const newStock =
      adjustType === 'entrada'
        ? stockAdjustItem.stock + adjustQuantity
        : Math.max(0, stockAdjustItem.stock - adjustQuantity);

    onUpdateInventoryItem({
      ...stockAdjustItem,
      stock: newStock,
    });

    setStockAdjustItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingItem) {
      onUpdateInventoryItem({
        ...editingItem,
        ...formData,
      });
    } else {
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        ...formData,
      };
      onAddInventoryItem(newItem);
    }
    setIsModalOpen(false);
  };

  const lowStockCount = inventory.filter((i) => i.stock <= i.minStock).length;

  const filtered = inventory.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(term) ||
      item.sku.toLowerCase().includes(term) ||
      (item.activeSubstance && item.activeSubstance.toLowerCase().includes(term));

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesLowStock = !onlyLowStock || item.stock <= item.minStock;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const categories = ['Medicamento', 'Alimento', 'Accesorio', 'Insumo Médico'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-600" />
            Control de Inventario y Almacén
          </h2>
          <p className="text-xs text-slate-500">
            Medicamentos, alimentos, insumos clínicos, entradas/salidas y alertas de stock mínimo
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-xs active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Producto</span>
        </button>
      </div>

      {/* Low Stock Alert Header Banner */}
      {lowStockCount > 0 && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">
                ¡Alerta de Reabastecimiento! Hay {lowStockCount} {lowStockCount === 1 ? 'producto' : 'productos'} con stock igual o inferior al mínimo configurado.
              </span>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Revisa los pedidos a proveedores para evitar desabasto en farmacia o consultas.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition shrink-0"
          >
            {onlyLowStock ? 'Ver Todo el Inventario' : 'Filtrar Stock Bajo'}
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o sustancia activa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              categoryFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todos ({inventory.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === cat
                  ? 'bg-indigo-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">SKU / Código</th>
                <th className="py-3 px-4">Producto y Categoría</th>
                <th className="py-3 px-4">Presentación</th>
                <th className="py-3 px-4 text-right">P. Compra</th>
                <th className="py-3 px-4 text-right">P. Venta</th>
                <th className="py-3 px-4 text-center">Stock Actual</th>
                <th className="py-3 px-4 text-center">Ajustes Rápidos</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isLow = item.stock <= item.minStock;
                return (
                  <tr key={item.id} className={isLow ? 'bg-amber-50/40 hover:bg-amber-50/80' : 'hover:bg-slate-50/70'}>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {item.sku}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      {item.activeSubstance && (
                        <div className="text-[10px] text-teal-700 font-medium">
                          {item.activeSubstance}
                        </div>
                      )}
                      <span className="text-[10px] text-slate-600">{item.category}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {item.unit}
                    </td>

                    <td className="py-3 px-4 text-right text-slate-500 font-medium">
                      {formatCurrency(item.costPrice)}
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(item.salePrice)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black">
                        <span className={isLow ? 'text-amber-700 font-black' : 'text-slate-800'}>
                          {item.stock}
                        </span>
                        <span className="text-[10px] text-slate-600 font-normal">
                          / Mín: {item.minStock}
                        </span>
                        {isLow && (
                          <span className="px-1.5 py-0.2 rounded-sm bg-amber-200 text-amber-900 text-[9px] font-bold">
                            BAJO
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenAdjust(item, 'entrada')}
                          title="Entrada de mercancía / Compra"
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md font-semibold text-[11px] transition flex items-center gap-0.5"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Entrada</span>
                        </button>
                        <button
                          onClick={() => handleOpenAdjust(item, 'salida')}
                          title="Salida por uso en consulta o merma"
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md font-semibold text-[11px] transition flex items-center gap-0.5"
                        >
                          <ArrowDownRight className="w-3 h-3" />
                          <span>Salida</span>
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar ${item.name} del inventario?`)) {
                              onDeleteInventoryItem(item.id);
                            }
                          }}
                          className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                    No hay productos en inventario con los criterios seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Entrada / Salida Rápida de Stock */}
      {stockAdjustItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div
              className={`p-4 border-b flex items-center justify-between ${
                adjustType === 'entrada'
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-rose-50 border-rose-100'
              }`}
            >
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {adjustType === 'entrada' ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-rose-600" />
                )}
                <span>
                  {adjustType === 'entrada' ? 'Entrada de Mercancía' : 'Salida de Inventario'}
                </span>
              </h3>
              <button
                onClick={() => setStockAdjustItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStockAdjust} className="p-5 space-y-3.5 text-xs">
              <div>
                <span className="text-slate-600 block text-[11px]">Producto:</span>
                <span className="font-bold text-slate-900 text-sm">{stockAdjustItem.name}</span>
                <p className="text-[11px] text-slate-500">
                  Stock actual: <strong>{stockAdjustItem.stock}</strong> {stockAdjustItem.unit}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cantidad a {adjustType === 'entrada' ? 'Ingresar' : 'Retirar'} *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-base font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Motivo / Referencia
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Ej: Factura proveedor #991 / Uso en cirugía"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStockAdjustItem(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white font-medium rounded-lg shadow-xs ${
                    adjustType === 'entrada'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirmar {adjustType === 'entrada' ? 'Ingreso' : 'Salida'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Alta / Edición de Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-indigo-600" />
                {editingItem ? 'Editar Producto' : 'Nuevo Producto en Inventario'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU / Código *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoría *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as InventoryItem['category'],
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nombre Comercial del Producto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Meloxicam Suspensión Oral 10ml"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sustancia Activa (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Meloxicam 1.5mg"
                    value={formData.activeSubstance}
                    onChange={(e) =>
                      setFormData({ ...formData, activeSubstance: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Presentación / Unidad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Frasco 10ml, Caja 10 tabs, Bolsa 2kg"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Precio de Costo ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Precio de Venta al Público ($) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={formData.salePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Inicial *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Stock Mínimo de Alerta *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minStock}
                    onChange={(e) =>
                      setFormData({ ...formData, minStock: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-xs"
                >
                  {editingItem ? 'Guardar Cambios' : 'Registrar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

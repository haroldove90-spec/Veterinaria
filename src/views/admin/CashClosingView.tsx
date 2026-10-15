import React, { useState } from 'react';
import {
  BarChart3,
  Banknote,
  CreditCard,
  ArrowRightLeft,
  Calendar,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileCheck,
} from 'lucide-react';
import { SaleTransaction, DailyCashClosing } from '../../types';
import { formatCurrency, formatDateTime, formatDate } from '../../utils/formatters';

interface CashClosingViewProps {
  sales: SaleTransaction[];
  cashClosings: DailyCashClosing[];
  onAddCashClosing: (closing: DailyCashClosing) => void;
  adminName?: string;
}

export const CashClosingView: React.FC<CashClosingViewProps> = ({
  sales,
  cashClosings,
  onAddCashClosing,
  adminName = 'Dr. Alejandro Morales',
}) => {
  const todayStr = '2026-10-15';
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Cash count field for arqueo
  const [cashCounted, setCashCounted] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [lastSavedClosing, setLastSavedClosing] = useState<DailyCashClosing | null>(null);

  // Sales for the selected date
  const dateSales = sales.filter((s) => s.createdAt.startsWith(selectedDate));

  const totalCash = dateSales
    .filter((s) => s.paymentMethod === 'Efectivo')
    .reduce((sum, s) => sum + s.total, 0);

  const totalCard = dateSales
    .filter((s) => s.paymentMethod === 'Tarjeta')
    .reduce((sum, s) => sum + s.total, 0);

  const totalTransfer = dateSales
    .filter((s) => s.paymentMethod === 'Transferencia')
    .reduce((sum, s) => sum + s.total, 0);

  const totalSales = totalCash + totalCard + totalTransfer;
  const transactionCount = dateSales.length;

  const cashDifference = cashCounted - totalCash;

  const handlePerformClosing = (e: React.FormEvent) => {
    e.preventDefault();
    const newClosing: DailyCashClosing = {
      id: `close-${Date.now()}`,
      date: selectedDate,
      totalCash,
      totalCard,
      totalTransfer,
      totalSales,
      transactionCount,
      cashCounted,
      cashDifference,
      notes: notes || undefined,
      closedBy: adminName,
      closedAt: new Date().toISOString(),
    };

    onAddCashClosing(newClosing);
    setLastSavedClosing(newClosing);
    setShowSummaryModal(true);
  };

  const handlePrintClosing = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Cierre y Arqueo de Caja del Día
          </h2>
          <p className="text-xs text-slate-500">
            Resumen contable de ingresos por método de pago, cuadre de efectivo y acta de corte
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-800 shadow-2xs"
          />
        </div>
      </div>

      {/* KPI Financial Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total General */}
        <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white shadow-md space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Ingresos Totales del Día
          </span>
          <div className="text-2xl font-black">{formatCurrency(totalSales)}</div>
          <div className="text-[11px] text-teal-400 font-medium pt-1 border-t border-slate-700/80">
            {transactionCount} {transactionCount === 1 ? 'ticket cobrado' : 'tickets cobrados'}
          </div>
        </div>

        {/* Efectivo */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Efectivo en Caja
            </span>
            <Banknote className="w-5 h-5" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {formatCurrency(totalCash)}
          </div>
          <div className="text-[11px] text-slate-400">
            {dateSales.filter((s) => s.paymentMethod === 'Efectivo').length} operaciones
          </div>
        </div>

        {/* Tarjetas */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Terminal Bancaria / Tarjetas
            </span>
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {formatCurrency(totalCard)}
          </div>
          <div className="text-[11px] text-slate-400">
            {dateSales.filter((s) => s.paymentMethod === 'Tarjeta').length} operaciones
          </div>
        </div>

        {/* Transferencias */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Transferencias / SPEI
            </span>
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {formatCurrency(totalTransfer)}
          </div>
          <div className="text-[11px] text-slate-400">
            {dateSales.filter((s) => s.paymentMethod === 'Transferencia').length} operaciones
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Formulario de Arqueo y Cierre (5 Cols) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handlePerformClosing}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Arqueo de Efectivo Físico
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Efectivo esperado por sistema:</span>
                <span className="font-bold text-slate-900 text-sm">{formatCurrency(totalCash)}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Efectivo Real Contado en Gaveta ($) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  placeholder="0.00"
                  value={cashCounted || ''}
                  onChange={(e) => setCashCounted(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-base font-extrabold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              {/* Difference badge */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  cashDifference === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : cashDifference > 0
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold">
                  {cashDifference === 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>
                    {cashDifference === 0
                      ? 'Caja cuadrada con precisión'
                      : cashDifference > 0
                      ? 'Sobrante en caja'
                      : 'Faltante en caja'}
                  </span>
                </div>
                <span className="font-extrabold text-sm">
                  {formatCurrency(cashDifference)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Observaciones del Cierre
                </label>
                <textarea
                  rows={2}
                  placeholder="Retiros de efectivo realizados, fondo fijo de caja..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={transactionCount === 0}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Realizar Corte de Caja y Guardar Acta</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Desglose de Ventas del Día (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4 text-teal-600" />
              Operaciones de la Jornada ({dateSales.length})
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {formatDate(selectedDate)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Folio</th>
                  <th className="py-2.5 px-3">Hora</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Método</th>
                  <th className="py-2.5 px-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dateSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 font-mono font-bold text-teal-700">
                      {sale.folio}
                    </td>
                    <td className="py-2 px-3 text-slate-500">
                      {sale.createdAt.includes('T')
                        ? sale.createdAt.split('T')[1].substring(0, 5)
                        : ''}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-800 truncate max-w-[140px]">
                      {sale.clientName}
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {formatCurrency(sale.total)}
                    </td>
                  </tr>
                ))}
                {dateSales.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                      No hay cobros registrados en la fecha {formatDate(selectedDate)}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Acta de Cierre Diario Imprimible */}
      {showSummaryModal && lastSavedClosing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 max-h-[90vh]">
            <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
              <h3 className="font-bold text-indigo-950 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                Acta Oficial de Corte de Caja
              </h3>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono text-slate-800" id="printable-cierre">
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <h2 className="font-black text-sm text-slate-900 font-sans">
                  VETERINARIA PRO
                </h2>
                <p className="text-[11px] text-slate-500 font-sans">CORTE DE CAJA DIARIO</p>
                <p className="text-[10px] text-slate-400">Fecha: {formatDate(lastSavedClosing.date)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Ventas Totales:</span>
                  <span className="font-bold">{formatCurrency(lastSavedClosing.totalSales)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>• Efectivo:</span>
                  <span>{formatCurrency(lastSavedClosing.totalCash)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>• Tarjetas:</span>
                  <span>{formatCurrency(lastSavedClosing.totalCard)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>• Transferencias:</span>
                  <span>{formatCurrency(lastSavedClosing.totalTransfer)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>• Transacciones:</span>
                  <span>{lastSavedClosing.transactionCount} tickets</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Efectivo Contado:</span>
                  <span>{formatCurrency(lastSavedClosing.cashCounted)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Diferencia de Caja:</span>
                  <span
                    className={
                      lastSavedClosing.cashDifference === 0
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }
                  >
                    {formatCurrency(lastSavedClosing.cashDifference)}
                  </span>
                </div>
              </div>

              <div className="pt-4 text-center border-t border-slate-200 text-[10px] text-slate-500 font-sans">
                Responsable del Cierre: <strong>{lastSavedClosing.closedBy}</strong>
                <p className="text-[9px] text-slate-400">Generado el {formatDateTime(lastSavedClosing.closedAt)}</p>
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200/50 rounded-lg"
              >
                Cerrar
              </button>
              <button
                onClick={handlePrintClosing}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Acta de Corte</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

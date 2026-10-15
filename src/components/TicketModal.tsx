import React from 'react';
import { Printer, MessageCircle, X, CheckCircle, Receipt } from 'lucide-react';
import { SaleTransaction } from '../types';
import {
  formatCurrency,
  formatDateTime,
  buildReceiptWhatsAppMessage,
  buildWhatsAppLink,
} from '../utils/formatters';

interface TicketModalProps {
  sale: SaleTransaction | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const msg = buildReceiptWhatsAppMessage(sale);
    const phone = sale.clientPhone || '';
    const url = buildWhatsAppLink(phone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-800">Comprobante de Cobro</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-slate-700 space-y-3 bg-white" id="printable-ticket">
          {/* Clinic Brand */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
            <h2 className="text-sm font-black tracking-wider text-slate-900 font-sans">
              VETERINARIA PRO
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Atención Médica Veterinaria Integral
            </p>
            <p className="text-[10px] text-slate-400">Tel: (55) 1234-5678</p>
          </div>

          {/* Metadata */}
          <div className="text-[11px] space-y-0.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Folio:</span>
              <span className="font-bold">{sale.folio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fecha:</span>
              <span>{formatDateTime(sale.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cliente:</span>
              <span className="font-semibold">{sale.clientName}</span>
            </div>
            {sale.petName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Paciente:</span>
                <span>{sale.petName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Cajero:</span>
              <span>{sale.cashierName}</span>
            </div>
          </div>

          {/* Item Breakdown */}
          <div className="pt-2 border-t border-dashed border-slate-300 space-y-1.5">
            <div className="flex justify-between font-bold text-slate-900 pb-1 border-b border-slate-100">
              <span>Cant. Concepto</span>
              <span>Importe</span>
            </div>
            {sale.items.map((item) => (
              <div key={item.id} className="flex justify-between text-[11px]">
                <span className="pr-2 leading-tight">
                  {item.quantity}x {item.name}
                </span>
                <span className="shrink-0 font-medium">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span>{formatCurrency(sale.subtotal)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Descuento:</span>
                <span>-{formatCurrency(sale.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>TOTAL:</span>
              <span>{formatCurrency(sale.total)}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Forma de Pago:</span>
              <span className="font-semibold">{sale.paymentMethod}</span>
            </div>
            {sale.amountReceived !== undefined && sale.amountReceived > 0 && (
              <>
                <div className="flex justify-between text-slate-500">
                  <span>Recibido:</span>
                  <span>{formatCurrency(sale.amountReceived)}</span>
                </div>
                <div className="flex justify-between text-slate-700 font-semibold">
                  <span>Cambio:</span>
                  <span>{formatCurrency(sale.change || 0)}</span>
                </div>
              </>
            )}
            {sale.paymentReference && (
              <div className="flex justify-between text-slate-500 text-[10px]">
                <span>Ref:</span>
                <span>{sale.paymentReference}</span>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="text-center pt-3 border-t border-dashed border-slate-300 space-y-1">
            <p className="text-[10px] text-slate-500 font-sans">
              ¡Gracias por confiar en nosotros la salud de tu mascota!
            </p>
            <div className="text-[9px] text-slate-400">
              Comprobante sin validez fiscal legal directa
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ticket</span>
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

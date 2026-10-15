import React from 'react';
import { Printer, MessageCircle, X, FileText, CheckCircle2 } from 'lucide-react';
import { MedicalConsultation, Pet, Client } from '../types';
import {
  formatDate,
  buildPrescriptionWhatsAppMessage,
  buildWhatsAppLink,
} from '../utils/formatters';

interface PrescriptionModalProps {
  consultation: MedicalConsultation | null;
  pet?: Pet;
  client?: Client;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  consultation,
  pet,
  client,
  onClose,
}) => {
  if (!consultation) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const msg = buildPrescriptionWhatsAppMessage(consultation, pet, client);
    const phone = client?.whatsapp || client?.phone || '';
    const url = buildWhatsAppLink(phone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-800">Receta Médica Veterinaria</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Prescription Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-white" id="printable-prescription">
          {/* Clinic Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b-2 border-teal-600 gap-2">
            <div>
              <h1 className="text-xl font-black text-teal-800 tracking-tight">
                VETERINARIA PRO
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Hospital Clínico y Cirugía Veterinaria
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-600">
              <p className="font-semibold">{consultation.veterinarianName}</p>
              <p className="text-[11px] text-slate-500">Médico Veterinario Zootecnista</p>
              <p className="text-[10px] text-teal-700 font-mono">Céd. Prof: 9823412</p>
            </div>
          </div>

          {/* Patient and Owner Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Paciente</span>
              <span className="font-bold text-slate-800 text-sm">{pet?.name || 'Mascota'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Especie / Raza</span>
              <span className="font-semibold text-slate-700">
                {pet?.species} • {pet?.breed}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tutor (Dueño)</span>
              <span className="font-semibold text-slate-700">{client?.name || 'Tutor'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Fecha / Peso</span>
              <span className="font-semibold text-slate-700">
                {formatDate(consultation.date)} • {consultation.vitals.weightKg} kg
              </span>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Diagnóstico Clínico
            </h4>
            <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-lg text-xs font-medium text-slate-800">
              {consultation.diagnosis}
            </div>
          </div>

          {/* Prescriptions List (Rx) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="text-base font-black text-teal-700 font-serif">℞</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Tratamiento y Dosificación
              </h4>
            </div>

            {consultation.prescriptions && consultation.prescriptions.length > 0 ? (
              <div className="space-y-3">
                {consultation.prescriptions.map((rx, idx) => (
                  <div
                    key={rx.id || idx}
                    className="p-3 rounded-lg border border-slate-200 bg-white space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>
                        {idx + 1}. {rx.name}
                      </span>
                      <span className="text-teal-700 font-semibold">{rx.duration}</span>
                    </div>
                    <div className="text-slate-700 font-medium pl-4">
                      • <strong className="text-slate-900">Dosis:</strong> {rx.dosage}
                    </div>
                    {rx.instructions && (
                      <div className="text-slate-500 pl-4 text-[11px]">
                        • <span className="font-medium">Indicación:</span> {rx.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No se agregaron medicamentos en esta consulta.</p>
            )}
          </div>

          {/* General Recommendations */}
          {consultation.recommendations && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Cuidados e Indicaciones Generales
              </h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                {consultation.recommendations}
              </p>
            </div>
          )}

          {/* Follow Up */}
          {consultation.followUpDate && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
              <span className="font-semibold">Próxima fecha de revisión médica sugerida:</span>
              <span className="font-bold">{formatDate(consultation.followUpDate)}</span>
            </div>
          )}

          {/* Signature Line */}
          <div className="pt-8 flex justify-center text-center">
            <div className="w-56 border-t border-slate-400 pt-1 text-[11px] text-slate-600 space-y-0.5">
              <p className="font-bold text-slate-800">{consultation.veterinarianName}</p>
              <p className="text-[10px]">Firma y Cédula Profesional</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-100"
          >
            Cerrar
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-3.5 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Receta</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Enviar por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

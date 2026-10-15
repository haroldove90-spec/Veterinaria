import React, { useState } from 'react';
import { FileText, Search, Printer, MessageCircle, Dog, Calendar } from 'lucide-react';
import { MedicalConsultation, Pet, Client } from '../../types';
import {
  formatDate,
  buildPrescriptionWhatsAppMessage,
  buildWhatsAppLink,
} from '../../utils/formatters';

interface PrescriptionsViewProps {
  consultations: MedicalConsultation[];
  pets: Pet[];
  clients: Client[];
  onOpenPrescriptionModal: (con: MedicalConsultation) => void;
}

export const PrescriptionsView: React.FC<PrescriptionsViewProps> = ({
  consultations,
  pets,
  clients,
  onOpenPrescriptionModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Only consultations that have prescribed medications
  const rxConsultations = consultations.filter(
    (c) => c.prescriptions && c.prescriptions.length > 0
  );

  const filtered = rxConsultations.filter((c) => {
    const pet = pets.find((p) => p.id === c.petId);
    const client = clients.find((cl) => cl.id === c.clientId);
    const term = searchTerm.toLowerCase();

    return (
      (pet && pet.name.toLowerCase().includes(term)) ||
      (client && client.name.toLowerCase().includes(term)) ||
      c.diagnosis.toLowerCase().includes(term) ||
      c.prescriptions.some((rx) => rx.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Recetas Médicas y Tratamientos Emitidos
          </h2>
          <p className="text-xs text-slate-500">
            Histórico de prescripciones, reimpresión oficial y reenvío directo por WhatsApp
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por paciente, tutor, medicamento o diagnóstico..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Grid of Prescriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((con) => {
          const pet = pets.find((p) => p.id === con.petId);
          const client = clients.find((c) => c.id === con.clientId);
          const waUrl = buildWhatsAppLink(
            client?.whatsapp || client?.phone || '',
            buildPrescriptionWhatsAppMessage(con, pet, client)
          );

          return (
            <div
              key={con.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-900">
                        {pet?.name || 'Mascota'}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({pet?.species})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tutor: <strong>{client?.name || 'Sin tutor'}</strong> ({client?.phone})
                    </p>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    {formatDate(con.date)}
                  </span>
                </div>

                {/* Diagnosis Box */}
                <div className="mt-2.5 p-2 bg-teal-50/50 border border-teal-100 rounded-lg text-xs text-slate-800">
                  <span className="text-[10px] font-bold text-teal-800 uppercase block">Diagnóstico:</span>
                  {con.diagnosis}
                </div>

                {/* Prescribed Items */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                    Medicamentos ({con.prescriptions.length}):
                  </span>
                  {con.prescriptions.map((rx, idx) => (
                    <div
                      key={rx.id || idx}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700"
                    >
                      <span className="font-bold text-slate-900">{rx.name}</span>
                      <div className="text-slate-600">
                        • {rx.dosage} ({rx.duration})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-600">
                  {con.veterinarianName}
                </span>

                <div className="flex items-center gap-1.5">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg transition flex items-center gap-1"
                    title="Enviar por WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => onOpenPrescriptionModal(con)}
                    className="p-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition flex items-center gap-1 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Ver / Imprimir</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No hay recetas emitidas</h3>
            <p className="text-xs text-slate-600 mt-1">
              Las recetas se generan automáticamente al guardar una nueva consulta médica.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

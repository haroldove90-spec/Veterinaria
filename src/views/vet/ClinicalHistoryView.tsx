import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  PlusCircle,
  Calendar,
  Scale,
  Thermometer,
  Heart,
  Wind,
  FileText,
  Syringe,
  Printer,
  MessageCircle,
  User,
  Dog,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  MedicalConsultation,
  Pet,
  Client,
  VaccineRecord,
} from '../../types';
import { formatDate } from '../../utils/formatters';

interface ClinicalHistoryViewProps {
  pets: Pet[];
  clients: Client[];
  consultations: MedicalConsultation[];
  vaccines: VaccineRecord[];
  onOpenNewConsultation: (petId: string) => void;
  onOpenPrescriptionModal: (con: MedicalConsultation) => void;
  preselectedPetId?: string | null;
}

export const ClinicalHistoryView: React.FC<ClinicalHistoryViewProps> = ({
  pets,
  clients,
  consultations,
  vaccines,
  onOpenNewConsultation,
  onOpenPrescriptionModal,
  preselectedPetId,
}) => {
  const [selectedPetId, setSelectedPetId] = useState<string>(
    preselectedPetId || (pets[0]?.id || '')
  );
  const [searchTerm, setSearchTerm] = useState('');

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const selectedClient = selectedPet ? clients.find((c) => c.id === selectedPet.ownerId) : null;

  // Consultations for this pet
  const petConsultations = consultations
    .filter((c) => c.petId === selectedPetId)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Vaccines for this pet
  const petVaccines = vaccines
    .filter((v) => v.petId === selectedPetId)
    .sort((a, b) => b.applicationDate.localeCompare(a.applicationDate));

  const filteredPets = pets.filter((p) => {
    const term = searchTerm.toLowerCase();
    const owner = clients.find((c) => c.id === p.ownerId);
    return (
      p.name.toLowerCase().includes(term) ||
      p.breed.toLowerCase().includes(term) ||
      (owner && owner.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            Expediente Clínico Digital
          </h2>
          <p className="text-xs text-slate-500">
            Historial médico unificado en una sola pantalla: consultas, diagnósticos, constantes y biológicos
          </p>
        </div>

        {selectedPet && (
          <button
            onClick={() => onOpenNewConsultation(selectedPet.id)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-xs active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva Consulta para {selectedPet.name}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Pet Patient Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Dog className="w-4 h-4 text-teal-600" />
              Seleccionar Paciente ({pets.length})
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar mascota o dueño..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="max-h-[60vh] overflow-y-auto space-y-1.5 pr-1">
              {filteredPets.map((p) => {
                const isSelected = p.id === selectedPetId;
                const owner = clients.find((c) => c.id === p.ownerId);
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPetId(p.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-400 shadow-2xs ring-1 ring-teal-400'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{p.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {p.species}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {p.breed} • {p.currentWeight || p.initialWeight} kg
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="truncate">Tutor: {owner?.name || 'Sin tutor'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Full Clinical Sheet in One Screen (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedPet ? (
            <>
              {/* Pet Clinical Header Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900">{selectedPet.name}</h3>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        {selectedPet.species}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ({selectedPet.sex})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Raza: <strong>{selectedPet.breed}</strong> • Color: {selectedPet.color || 'No especificado'} • Microchip: {selectedPet.microchip || 'S/N'}
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-right text-xs">
                    <span className="text-[10px] text-slate-600 block uppercase font-bold">
                      Tutor Responsable
                    </span>
                    <span className="font-bold text-slate-800">{selectedClient?.name || 'Tutor no asignado'}</span>
                    <span className="text-slate-500 block text-[11px]">{selectedClient?.phone}</span>
                  </div>
                </div>

                {/* Patient Health Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold block">Peso Registrado</span>
                    <span className="font-bold text-slate-800">{selectedPet.currentWeight || selectedPet.initialWeight} kg</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold block">Nacimiento</span>
                    <span className="font-bold text-slate-800">{formatDate(selectedPet.birthDate)}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold block">Consultas Previas</span>
                    <span className="font-bold text-slate-800">{petConsultations.length} visitas</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold block">Vacunas Registradas</span>
                    <span className="font-bold text-slate-800">{petVaccines.length} dosis</span>
                  </div>
                </div>

                {selectedPet.allergies && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span><strong>ALERGIAS O SENSIBILIDADES:</strong> {selectedPet.allergies}</span>
                  </div>
                )}
              </div>

              {/* Consultations History Timeline */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    Historial de Consultas Médicas ({petConsultations.length})
                  </h4>
                </div>

                <div className="space-y-4">
                  {petConsultations.map((con) => (
                    <div
                      key={con.id}
                      className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-slate-50/80 transition space-y-3"
                    >
                      {/* Top Consultation Meta */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 mr-2">
                            {formatDate(con.date)}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">
                            Atendió: {con.veterinarianName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenPrescriptionModal(con)}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-teal-400 text-teal-700 font-semibold text-xs rounded-lg shadow-2xs transition flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Ver Receta</span>
                          </button>
                        </div>
                      </div>

                      {/* Motivo & Diagnóstico */}
                      <div className="space-y-1.5 text-xs">
                        <div>
                          <span className="text-slate-600 uppercase font-bold text-[10px]">Motivo: </span>
                          <span className="text-slate-800 font-medium">{con.reason}</span>
                        </div>

                        {/* Vitals Bar */}
                        <div className="flex flex-wrap items-center gap-2 py-1.5 px-2 bg-white rounded-lg border border-slate-200/80 text-[11px] text-slate-600">
                          <span className="flex items-center gap-1 font-semibold text-slate-800">
                            <Scale className="w-3 h-3 text-slate-400" /> {con.vitals.weightKg} kg
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-slate-800">
                            <Thermometer className="w-3 h-3 text-rose-500" /> {con.vitals.temperatureC} °C
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-400" /> FC: {con.vitals.heartRateBpm} lpm
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Wind className="w-3 h-3 text-blue-400" /> FR: {con.vitals.respiratoryRateRpm} rpm
                          </span>
                          <span>•</span>
                          <span>Mucosas: {con.vitals.mucousMembranes}</span>
                        </div>

                        {con.symptoms && (
                          <div>
                            <span className="text-slate-600 uppercase font-bold text-[10px]">Síntomas / Anamnesis: </span>
                            <span className="text-slate-700">{con.symptoms}</span>
                          </div>
                        )}

                        <div className="p-2.5 bg-teal-50/60 rounded-lg border border-teal-100 text-slate-800 font-medium">
                          <span className="text-teal-900 font-bold block text-[10px] uppercase">Diagnóstico:</span>
                          {con.diagnosis}
                        </div>

                        {/* Prescribed Medications */}
                        {con.prescriptions && con.prescriptions.length > 0 && (
                          <div className="p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                              Tratamiento Prescrito:
                            </span>
                            <div className="space-y-1">
                              {con.prescriptions.map((rx, idx) => (
                                <div key={rx.id || idx} className="text-[11px] text-slate-700">
                                  • <strong>{rx.name}</strong>: {rx.dosage} ({rx.duration})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {petConsultations.length === 0 && (
                    <div className="text-center py-8 text-slate-400 italic">
                      Este paciente aún no tiene consultas médicas registradas.
                    </div>
                  )}
                </div>
              </div>

              {/* Vaccines & Deworming Record */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Syringe className="w-4 h-4 text-emerald-600" />
                    Cartilla de Vacunación y Desparasitaciones ({petVaccines.length})
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Biológico / Tipo</th>
                        <th className="py-2 px-3">Marca / Lote</th>
                        <th className="py-2 px-3">Fecha Aplicación</th>
                        <th className="py-2 px-3">Próximo Refuerzo</th>
                        <th className="py-2 px-3">Médico</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {petVaccines.map((v) => (
                        <tr key={v.id}>
                          <td className="py-2 px-3 font-semibold text-slate-800">
                            {v.type}
                          </td>
                          <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                            {v.brand} ({v.batchNumber})
                          </td>
                          <td className="py-2 px-3 text-slate-700 font-medium">
                            {formatDate(v.applicationDate)}
                          </td>
                          <td className="py-2 px-3 font-bold text-teal-700">
                            {formatDate(v.nextBoosterDate)}
                          </td>
                          <td className="py-2 px-3 text-slate-500">
                            {v.veterinarianName}
                          </td>
                        </tr>
                      ))}
                      {petVaccines.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-slate-400 italic">
                            Sin registros de vacunas para este paciente.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <Dog className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-slate-700">Ningún paciente seleccionado</h3>
              <p className="text-xs text-slate-600 mt-1">
                Selecciona una mascota del panel izquierdo para consultar su expediente clínico.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

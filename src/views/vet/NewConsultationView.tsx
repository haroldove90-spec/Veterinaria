import React, { useState } from 'react';
import {
  PlusCircle,
  Stethoscope,
  Scale,
  Thermometer,
  Heart,
  Wind,
  Plus,
  Trash2,
  Printer,
  MessageCircle,
  CheckCircle2,
  User,
  Dog,
  Calendar,
} from 'lucide-react';
import {
  MedicalConsultation,
  Pet,
  Client,
  PrescribedMedication,
  PhysiologicalVitals,
} from '../../types';

interface NewConsultationViewProps {
  pets: Pet[];
  clients: Client[];
  onSaveConsultation: (consultation: MedicalConsultation) => void;
  onOpenPrescriptionModal: (con: MedicalConsultation) => void;
  preselectedPetId?: string | null;
  veterinarianName?: string;
}

export const NewConsultationView: React.FC<NewConsultationViewProps> = ({
  pets,
  clients,
  onSaveConsultation,
  onOpenPrescriptionModal,
  preselectedPetId,
  veterinarianName = 'Dra. Sofía Mendoza',
}) => {
  const todayStr = '2026-10-15';
  const [selectedPetId, setSelectedPetId] = useState<string>(
    preselectedPetId || (pets[0]?.id || '')
  );

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const selectedClient = selectedPet ? clients.find((c) => c.id === selectedPet.ownerId) : null;

  // Form Fields
  const [date, setDate] = useState<string>(todayStr);
  const [reason, setReason] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [physicalExamFindings, setPhysicalExamFindings] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string>('');
  const [followUpDate, setFollowUpDate] = useState<string>('');

  // Vitals
  const [vitals, setVitals] = useState<PhysiologicalVitals>({
    weightKg: selectedPet?.currentWeight || 5.0,
    temperatureC: 38.5,
    heartRateBpm: 100,
    respiratoryRateRpm: 24,
    capillaryRefillTime: '1-2 seg',
    mucousMembranes: 'Rosadas',
    bodyConditionScore: '3/5 (Ideal)',
  });

  // Prescriptions array
  const [prescriptions, setPrescriptions] = useState<PrescribedMedication[]>([
    {
      id: 'rx-tmp-1',
      name: '',
      dosage: '',
      duration: '',
      instructions: '',
    },
  ]);

  // When patient selection changes, auto-populate current weight
  const handlePetChange = (newPetId: string) => {
    setSelectedPetId(newPetId);
    const pet = pets.find((p) => p.id === newPetId);
    if (pet) {
      setVitals((prev) => ({
        ...prev,
        weightKg: pet.currentWeight || pet.initialWeight,
      }));
    }
  };

  const handleAddMedication = () => {
    setPrescriptions([
      ...prescriptions,
      {
        id: `rx-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        name: '',
        dosage: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  const handleUpdateMedication = (
    index: number,
    field: keyof PrescribedMedication,
    value: string
  ) => {
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], [field]: value };
    setPrescriptions(updated);
  };

  const handleRemoveMedication = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId || !reason.trim() || !diagnosis.trim()) {
      alert('Por favor completa el motivo de la consulta y el diagnóstico.');
      return;
    }

    // Clean empty prescriptions
    const validPrescriptions = prescriptions.filter((p) => p.name.trim() !== '');

    const newConsultation: MedicalConsultation = {
      id: `con-${Date.now()}`,
      petId: selectedPetId,
      clientId: selectedPet?.ownerId || '',
      veterinarianName,
      date,
      reason,
      vitals,
      symptoms,
      physicalExamFindings,
      diagnosis,
      recommendations,
      prescriptions: validPrescriptions,
      followUpDate: followUpDate || undefined,
    };

    onSaveConsultation(newConsultation);
    onOpenPrescriptionModal(newConsultation);

    // Reset Form
    setReason('');
    setSymptoms('');
    setPhysicalExamFindings('');
    setDiagnosis('');
    setRecommendations('');
    setFollowUpDate('');
    setPrescriptions([{ id: 'rx-tmp-1', name: '', dosage: '', duration: '', instructions: '' }]);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            Registro de Nueva Consulta Médica
          </h2>
          <p className="text-xs text-slate-500">
            Examen clínico, toma de constantes fisiológicas, diagnóstico y emisión de receta
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient and Owner Selector Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Paciente (Mascota) *
              </label>
              <select
                required
                value={selectedPetId}
                onChange={(e) => handlePetChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Seleccionar paciente --</option>
                {pets.map((p) => {
                  const owner = clients.find((c) => c.id === p.ownerId);
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species} - {p.breed}) - Tutor: {owner?.name || 'S/N'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fecha de Consulta
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Médico Veterinario Responsable
              </label>
              <input
                type="text"
                disabled
                value={veterinarianName}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          {selectedPet && (
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <Dog className="w-4 h-4 text-teal-700" />
                <span className="font-bold text-teal-900">{selectedPet.name}</span>
                <span className="text-teal-700 font-medium">
                  {selectedPet.species} • {selectedPet.breed} • {selectedPet.sex}
                </span>
              </div>
              <div className="flex items-center gap-2 text-teal-800 font-medium">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Tutor: {selectedClient?.name}</span>
                <span>({selectedClient?.phone})</span>
              </div>
            </div>
          )}
        </div>

        {/* Constantes Fisiológicas (Vitals) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-600" />
              Constantes Fisiológicas y Parámetros
            </h3>
            <span className="text-[11px] text-slate-400">Valores al momento de la consulta</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-teal-600" />
                Peso Actual (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={vitals.weightKg}
                onChange={(e) =>
                  setVitals({ ...vitals, weightKg: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                Temperatura (°C) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={vitals.temperatureC}
                onChange={(e) =>
                  setVitals({ ...vitals, temperatureC: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Frec. Cardíaca (lpm)
              </label>
              <input
                type="number"
                value={vitals.heartRateBpm}
                onChange={(e) =>
                  setVitals({ ...vitals, heartRateBpm: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-blue-400" />
                Frec. Respiratoria (rpm)
              </label>
              <input
                type="number"
                value={vitals.respiratoryRateRpm}
                onChange={(e) =>
                  setVitals({ ...vitals, respiratoryRateRpm: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mucosas</label>
              <select
                value={vitals.mucousMembranes}
                onChange={(e) =>
                  setVitals({
                    ...vitals,
                    mucousMembranes: e.target.value as PhysiologicalVitals['mucousMembranes'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="Rosadas">Rosadas (Normal)</option>
                <option value="Pálidas">Pálidas (Anemia / Shock)</option>
                <option value="Cianóticas">Cianóticas (Hipoxia)</option>
                <option value="Ictéricas">Ictéricas (Hepatopatía)</option>
                <option value="Congestivas">Congestivas (Toxemia / Fiebre)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tiempo Llenado Capilar
              </label>
              <input
                type="text"
                value={vitals.capillaryRefillTime}
                onChange={(e) =>
                  setVitals({ ...vitals, capillaryRefillTime: e.target.value })
                }
                placeholder="Ej: 1-2 seg"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Condición Corporal (BCS)
              </label>
              <select
                value={vitals.bodyConditionScore}
                onChange={(e) =>
                  setVitals({
                    ...vitals,
                    bodyConditionScore: e.target.value as PhysiologicalVitals['bodyConditionScore'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="1/5 (Muy delgado)">1/5 (Muy delgado / Emaciado)</option>
                <option value="2/5 (Bajo peso)">2/5 (Bajo peso)</option>
                <option value="3/5 (Ideal)">3/5 (Ideal / Normal)</option>
                <option value="4/5 (Sobrepeso)">4/5 (Sobrepeso)</option>
                <option value="5/5 (Obeso)">5/5 (Obeso)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Anamnesis, Hallazgos y Diagnóstico */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="text-xs space-y-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Motivo de Visita *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Cojera en pata derecha posterior desde hace 2 días..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Anamnesis y Síntomas Reportados
                </label>
                <textarea
                  rows={2}
                  placeholder="Inicio del cuadro, evolución, apetito, vómitos, heces..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Examen Físico y Hallazgos
                </label>
                <textarea
                  rows={2}
                  placeholder="Palpación, auscultación cardíaca/pulmonar, linfonodos, reflejos..."
                  value={physicalExamFindings}
                  onChange={(e) => setPhysicalExamFindings(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1 text-teal-800">
                Diagnóstico Presuntivo / Definitivo *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Esguince periarticular de rodilla derecha leve / Gastroenteritis bacteriana..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3 py-2.5 bg-teal-50/50 border border-teal-300 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Receta Médica / Tratamiento */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span className="font-serif font-black text-teal-700 text-base">℞</span>
                Receta Médica y Plan Terapéutico
              </h3>
              <p className="text-[11px] text-slate-500">
                Redacción de dosis, frecuencia y medicamentos para el tutor
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddMedication}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs rounded-lg transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Agregar Medicamento</span>
            </button>
          </div>

          <div className="space-y-3">
            {prescriptions.map((rx, idx) => (
              <div
                key={rx.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-700">Fármaco #{idx + 1}</span>
                  {prescriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-1">
                    <label className="block text-slate-600 font-medium mb-0.5">
                      Medicamento / Principio Activo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Meloxicam 1.5mg/ml"
                      value={rx.name}
                      onChange={(e) => handleUpdateMedication(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-0.5">
                      Dosis y Vía de Administración
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 1 ml vía oral cada 24 hrs"
                      value={rx.dosage}
                      onChange={(e) => handleUpdateMedication(idx, 'dosage', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-0.5">Duración</label>
                    <input
                      type="text"
                      placeholder="Ej: Por 5 días"
                      value={rx.duration}
                      onChange={(e) => handleUpdateMedication(idx, 'duration', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-0.5">
                    Indicaciones especiales para el tutor
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Administrar con el desayuno. No exceder la dosis."
                    value={rx.instructions}
                    onChange={(e) => handleUpdateMedication(idx, 'instructions', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Cuidados generales y revisión */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Cuidados Generales en Casa
              </label>
              <textarea
                rows={2}
                placeholder="Reposo estricto, alimentación blanda, curación de heridas..."
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Próxima Cita de Revisión Sugerida
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
              <p className="text-[10px] text-slate-600 mt-1">
                Aparecerá impresa en la receta médica para el dueño
              </p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Guardar Consulta y Generar Receta</span>
          </button>
        </div>
      </form>
    </div>
  );
};

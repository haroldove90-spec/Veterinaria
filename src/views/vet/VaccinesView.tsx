import React, { useState } from 'react';
import {
  Syringe,
  Plus,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  Dog,
  User,
  Shield,
  MessageCircle,
  X,
} from 'lucide-react';
import { VaccineRecord, Pet, Client } from '../../types';
import { formatDate, buildWhatsAppLink } from '../../utils/formatters';

interface VaccinesViewProps {
  vaccines: VaccineRecord[];
  pets: Pet[];
  clients: Client[];
  onAddVaccine: (record: VaccineRecord) => void;
  onDeleteVaccine: (id: string) => void;
  veterinarianName?: string;
}

export const VaccinesView: React.FC<VaccinesViewProps> = ({
  vaccines,
  pets,
  clients,
  onAddVaccine,
  onDeleteVaccine,
  veterinarianName = 'Dra. Sofía Mendoza',
}) => {
  const todayStr = '2026-10-15';
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<VaccineRecord, 'id'>>({
    petId: pets[0]?.id || '',
    type: 'Vacuna Séxtuple Canina (DHPPi+L)',
    brand: 'Zoetis Vanguard Plus',
    batchNumber: '',
    applicationDate: todayStr,
    nextBoosterDate: '2027-10-15',
    veterinarianName,
    isDeworming: false,
    productName: '',
  });

  const handleOpenAdd = () => {
    setFormData({
      petId: pets[0]?.id || '',
      type: 'Vacuna Séxtuple Canina (DHPPi+L)',
      brand: 'Zoetis Vanguard Plus',
      batchNumber: `LOTE-${Math.floor(1000 + Math.random() * 9000)}`,
      applicationDate: todayStr,
      nextBoosterDate: '2027-10-15',
      veterinarianName,
      isDeworming: false,
      productName: '',
    });
    setIsModalOpen(true);
  };

  const setBoosterOffsetDays = (days: number) => {
    const d = new Date(formData.applicationDate || todayStr);
    d.setDate(d.getDate() + days);
    setFormData({
      ...formData,
      nextBoosterDate: d.toISOString().split('T')[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petId || !formData.type || !formData.nextBoosterDate) return;

    const newRecord: VaccineRecord = {
      id: `vac-${Date.now()}`,
      ...formData,
    };
    onAddVaccine(newRecord);
    setIsModalOpen(false);
  };

  const filteredVaccines = vaccines.filter((v) => {
    const pet = pets.find((p) => p.id === v.petId);
    const client = pet ? clients.find((c) => c.id === pet.ownerId) : null;
    const term = searchTerm.toLowerCase();

    return (
      v.type.toLowerCase().includes(term) ||
      (pet && pet.name.toLowerCase().includes(term)) ||
      (client && client.name.toLowerCase().includes(term)) ||
      v.brand.toLowerCase().includes(term) ||
      v.batchNumber.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Syringe className="w-5 h-5 text-teal-600" />
            Control de Vacunas y Desparasitaciones
          </h2>
          <p className="text-xs text-slate-500">
            Registro de dosis aplicadas, marcas, lotes y programación de próximos refuerzos
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-xs active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Aplicación</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por vacuna, paciente, tutor, marca o lote..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Vaccines Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Paciente y Tutor</th>
                <th className="py-3 px-4">Biológico / Producto</th>
                <th className="py-3 px-4">Marca y Lote</th>
                <th className="py-3 px-4">Fecha Aplicación</th>
                <th className="py-3 px-4">Próximo Refuerzo</th>
                <th className="py-3 px-4">Médico</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVaccines.map((v) => {
                const pet = pets.find((p) => p.id === v.petId);
                const client = pet ? clients.find((c) => c.id === pet.ownerId) : null;

                const waMessage =
                  `🐾 *VETERINARIA PRO - COMPROBANTE DE VACUNACIÓN*\n\n` +
                  `Paciente: *${pet?.name}* (${pet?.species})\n` +
                  `Tutor: *${client?.name}*\n\n` +
                  `💉 *Biológico Aplicado:* ${v.type}\n` +
                  `🏷️ *Lote / Marca:* ${v.brand} (Lote: ${v.batchNumber})\n` +
                  `📅 *Fecha de Aplicación:* ${formatDate(v.applicationDate)}\n` +
                  `🗓️ *PRÓXIMO REFUERZO SUGERIDO:* ${formatDate(v.nextBoosterDate)}\n\n` +
                  `Atendió: ${v.veterinarianName}\n` +
                  `¡Gracias por mantener al día la salud de tu mascota! 🐶🐱`;

                const waLink = buildWhatsAppLink(
                  client?.whatsapp || client?.phone || '',
                  waMessage
                );

                return (
                  <tr key={v.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Dog className="w-3.5 h-3.5 text-teal-600" />
                        <span>{pet?.name || 'Mascota'}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({pet?.species})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Tutor: {client?.name} ({client?.phone})
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{v.type}</span>
                      {v.isDeworming && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          Desparasitación
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      <div>{v.brand}</div>
                      <div className="text-[10px] text-slate-400">Lote: {v.batchNumber}</div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700">
                      {formatDate(v.applicationDate)}
                    </td>

                    <td className="py-3 px-4 font-bold text-teal-800">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>{formatDate(v.nextBoosterDate)}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {v.veterinarianName}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          title="Enviar carnet / comprobante por WhatsApp"
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar este registro de vacuna?')) {
                              onDeleteVaccine(v.id);
                            }
                          }}
                          title="Eliminar"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredVaccines.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                    No se encontraron registros de vacunas o desparasitaciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Vacuna / Desparasitación */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Syringe className="w-4 h-4 text-teal-600" />
                Registrar Dosis de Vacuna / Desparasitación
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Paciente (Mascota) *
                </label>
                <select
                  required
                  value={formData.petId}
                  onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Seleccionar paciente --</option>
                  {pets.map((p) => {
                    const owner = clients.find((c) => c.id === p.ownerId);
                    return (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species} - {p.breed}) - Tutor: {owner?.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isDeworming}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isDeworming: e.target.checked,
                        type: e.target.checked
                          ? 'Desparasitación Interna / Externa'
                          : 'Vacuna Séxtuple Canina (DHPPi+L)',
                      })
                    }
                    className="w-4 h-4 text-teal-600 rounded-sm"
                  />
                  <span>Es un desparasitante (interno o externo)</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nombre del Biológico o Desparasitante *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Séxtuple Canina, Antirrábica, Triple Felina, Bravecto..."
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Marca Comercial / Laboratorio
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Zoetis, Boehringer, Virbac..."
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Número de Lote
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: LOT-2026-99"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Fecha de Aplicación *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.applicationDate}
                    onChange={(e) =>
                      setFormData({ ...formData, applicationDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Próxima Fecha de Refuerzo Sugerida *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.nextBoosterDate}
                    onChange={(e) =>
                      setFormData({ ...formData, nextBoosterDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-teal-50/50 border border-teal-400 rounded-lg font-bold text-teal-900"
                  />
                </div>
              </div>

              {/* Botones rápidos de cálculo de refuerzo */}
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">
                  Calcular refuerzo rápido a partir de la fecha de aplicación:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBoosterOffsetDays(15)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-md font-medium text-[11px]"
                  >
                    +15 Días
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoosterOffsetDays(30)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-md font-medium text-[11px]"
                  >
                    +1 Mes
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoosterOffsetDays(90)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-md font-medium text-[11px]"
                  >
                    +3 Meses
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoosterOffsetDays(180)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-md font-medium text-[11px]"
                  >
                    +6 Meses
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoosterOffsetDays(365)}
                    className="px-2.5 py-1 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-md font-bold text-[11px]"
                  >
                    +1 Año (Anual)
                  </button>
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
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-xs"
                >
                  Guardar en Cartilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

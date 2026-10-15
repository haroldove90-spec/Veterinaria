import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  User,
  Dog,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  RotateCcw,
  MessageCircle,
  Calendar,
  X,
  Stethoscope,
  Scissors,
  Syringe,
  Filter,
} from 'lucide-react';
import { Appointment, AppointmentStatus, AppointmentType, Client, Pet } from '../../types';
import {
  formatDate,
  buildAppointmentReminderMessage,
  buildWhatsAppLink,
} from '../../utils/formatters';

interface AppointmentsViewProps {
  appointments: Appointment[];
  clients: Client[];
  pets: Pet[];
  onAddAppointment: (apt: Appointment) => void;
  onUpdateStatus: (aptId: string, status: AppointmentStatus) => void;
  onDeleteAppointment: (aptId: string) => void;
  onStartConsultation?: (apt: Appointment) => void;
  onSendToCashier?: (apt: Appointment) => void;
  preselectedPetId?: string | null;
  preselectedClientId?: string | null;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  clients,
  pets,
  onAddAppointment,
  onUpdateStatus,
  onDeleteAppointment,
  onStartConsultation,
  onSendToCashier,
  preselectedPetId,
  preselectedClientId,
}) => {
  const todayStr = '2026-10-15';
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [formData, setFormData] = useState<Omit<Appointment, 'id'>>({
    clientId: preselectedClientId || (clients[0]?.id || ''),
    petId: preselectedPetId || (pets[0]?.id || ''),
    date: todayStr,
    time: '10:00',
    type: 'Consulta General',
    status: 'Programada',
    veterinarianName: 'Dra. Sofía Mendoza',
    reason: '',
    notes: '',
  });

  const handleOpenAdd = () => {
    const defaultOwnerId = preselectedClientId || (clients[0]?.id || '');
    const clientPets = pets.filter((p) => p.ownerId === defaultOwnerId);
    setFormData({
      clientId: defaultOwnerId,
      petId: clientPets[0]?.id || (pets[0]?.id || ''),
      date: selectedDate || todayStr,
      time: '11:00',
      type: 'Consulta General',
      status: 'Programada',
      veterinarianName: 'Dra. Sofía Mendoza',
      reason: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOwnerChange = (newOwnerId: string) => {
    const ownerPets = pets.filter((p) => p.ownerId === newOwnerId);
    setFormData({
      ...formData,
      clientId: newOwnerId,
      petId: ownerPets[0]?.id || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.petId || !formData.reason) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      ...formData,
    };
    onAddAppointment(newApt);
    setIsModalOpen(false);
  };

  const filteredAppointments = appointments
    .filter((a) => {
      const matchesDate = !selectedDate || a.date === selectedDate;
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchesDate && matchesStatus;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Programada':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'En espera':
        return 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse';
      case 'En consulta':
        return 'bg-purple-50 text-purple-700 border-purple-200 font-bold';
      case 'Completada':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelada':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case 'Consulta General':
      case 'Urgencia':
        return <Stethoscope className="w-4 h-4 text-teal-600" />;
      case 'Vacunación':
      case 'Desparasitación':
        return <Syringe className="w-4 h-4 text-emerald-600" />;
      case 'Estética / Baño':
        return <Scissors className="w-4 h-4 text-amber-600" />;
      default:
        return <Calendar className="w-4 h-4 text-indigo-600" />;
    }
  };

  const statuses: AppointmentStatus[] = [
    'Programada',
    'En espera',
    'En consulta',
    'Completada',
    'Cancelada',
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-teal-600" />
            Agenda y Calendario de Citas
          </h2>
          <p className="text-xs text-slate-500">
            Control de flujo de pacientes: consultas, vacunas, desparasitación y estética
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-xs active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Cita</span>
        </button>
      </div>

      {/* Date Navigator & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-700 shrink-0">Fecha:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-2.5 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50 rounded-lg transition"
          >
            Hoy
          </button>
          <button
            onClick={() => setSelectedDate('')}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
          >
            Ver Todas
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition shrink-0 ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas ({appointments.length})
          </button>
          {statuses.map((st) => {
            const count = appointments.filter((a) => a.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition shrink-0 ${
                  statusFilter === st
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.map((apt) => {
          const client = clients.find((c) => c.id === apt.clientId);
          const pet = pets.find((p) => p.id === apt.petId);
          const waReminderUrl = buildWhatsAppLink(
            client?.whatsapp || client?.phone || '',
            buildAppointmentReminderMessage(apt, client, pet)
          );

          return (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-teal-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Time & Patient */}
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex flex-col items-center justify-center shrink-0 text-teal-800">
                  <Clock className="w-4 h-4 mb-0.5 text-teal-600" />
                  <span className="text-xs font-extrabold">{apt.time}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-slate-900">
                      {pet?.name || 'Mascota'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ({pet?.species || 'Paciente'} - {pet?.breed || ''})
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        apt.status
                      )}`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      {getTypeIcon(apt.type)}
                      <span>{apt.type}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500">
                      <User className="w-3.5 h-3.5" />
                      <span>
                        Tutor: <strong>{client?.name || 'No asignado'}</strong> ({client?.phone})
                      </span>
                    </div>

                    {apt.veterinarianName && (
                      <span className="text-[11px] text-teal-700 font-medium">
                        Atiende: {apt.veterinarianName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    "{apt.reason}" {apt.notes && `• ${apt.notes}`}
                  </p>
                </div>
              </div>

              {/* Right Column: Fast Status Transitions & Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end shrink-0">
                {/* Fast Status Change Select */}
                <select
                  value={apt.status}
                  onChange={(e) => onUpdateStatus(apt.id, e.target.value as AppointmentStatus)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                {/* WhatsApp Reminder Button */}
                <a
                  href={waReminderUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Enviar recordatorio por WhatsApp"
                  className="p-1.5 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* Pass to consultation if in waiting room */}
                {onStartConsultation && (
                  <button
                    onClick={() => onStartConsultation(apt)}
                    title="Pasar a Consulta Médica"
                    className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 text-purple-600" />
                    <span className="hidden sm:inline">A Consulta</span>
                  </button>
                )}

                {/* Send to cashier */}
                {onSendToCashier && (
                  <button
                    onClick={() => onSendToCashier(apt)}
                    title="Pasar a Cobro en Caja"
                    className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition"
                  >
                    Cobrar
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm('¿Eliminar esta cita?')) {
                      onDeleteAppointment(apt.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Eliminar cita"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredAppointments.length === 0 && (
          <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">Sin citas para este criterio</h3>
            <p className="text-xs text-slate-600 mt-1">
              No hay citas programadas para el filtro seleccionado.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-3 px-4 py-2 bg-teal-600 text-white text-xs font-medium rounded-xl hover:bg-teal-700 transition"
            >
              + Agendar Nueva Cita
            </button>
          </div>
        )}
      </div>

      {/* Modal Agendar Cita */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-teal-600" />
                Programar Nueva Cita
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cliente / Tutor *
                  </label>
                  <select
                    required
                    value={formData.clientId}
                    onChange={(e) => handleOwnerChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  >
                    <option value="">-- Seleccionar cliente --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Paciente (Mascota) *
                  </label>
                  <select
                    required
                    value={formData.petId}
                    onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  >
                    <option value="">-- Seleccionar paciente --</option>
                    {pets
                      .filter((p) => !formData.clientId || p.ownerId === formData.clientId)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.species} - {p.breed})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hora *</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Servicio *</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as AppointmentType })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  >
                    <option value="Consulta General">Consulta General</option>
                    <option value="Vacunación">Vacunación</option>
                    <option value="Desparasitación">Desparasitación</option>
                    <option value="Estética / Baño">Estética / Baño</option>
                    <option value="Cirugía">Cirugía / Procedimiento</option>
                    <option value="Urgencia">Urgencia Médica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Médico Asignado
                </label>
                <input
                  type="text"
                  placeholder="Ej: Dra. Sofía Mendoza"
                  value={formData.veterinarianName}
                  onChange={(e) =>
                    setFormData({ ...formData, veterinarianName: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Motivo de la Cita *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Vacunación Séxtuple anual, revisión de oído..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notas Internas</label>
                <textarea
                  rows={2}
                  placeholder="Observaciones de manejo, advertencias..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
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
                  Confirmar y Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

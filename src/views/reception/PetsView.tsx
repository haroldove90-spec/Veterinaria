import React, { useState } from 'react';
import {
  Dog,
  Search,
  Plus,
  Calendar,
  Scale,
  Shield,
  FileSpreadsheet,
  CalendarPlus,
  Edit2,
  Trash2,
  X,
  User,
} from 'lucide-react';
import { Pet, Client, PetSpecies, PetSex } from '../../types';
import { formatDate } from '../../utils/formatters';

interface PetsViewProps {
  pets: Pet[];
  clients: Client[];
  onAddPet: (pet: Pet) => void;
  onUpdatePet: (pet: Pet) => void;
  onDeletePet: (id: string) => void;
  onOpenClinicalHistory: (petId: string) => void;
  onScheduleAppointment: (petId: string, clientId: string) => void;
  initialSelectedClientId?: string | null;
}

export const PetsView: React.FC<PetsViewProps> = ({
  pets,
  clients,
  onAddPet,
  onUpdatePet,
  onDeletePet,
  onOpenClinicalHistory,
  onScheduleAppointment,
  initialSelectedClientId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Pet, 'id' | 'createdAt'>>({
    ownerId: initialSelectedClientId || (clients[0]?.id || ''),
    name: '',
    species: 'Perro',
    breed: '',
    sex: 'Macho',
    birthDate: '',
    color: '',
    initialWeight: 0,
    currentWeight: 0,
    microchip: '',
    allergies: '',
    chronicConditions: '',
  });

  const handleOpenAdd = (preferredOwnerId?: string) => {
    setEditingPet(null);
    setFormData({
      ownerId: preferredOwnerId || initialSelectedClientId || (clients[0]?.id || ''),
      name: '',
      species: 'Perro',
      breed: '',
      sex: 'Macho',
      birthDate: new Date().toISOString().split('T')[0],
      color: '',
      initialWeight: 5.0,
      currentWeight: 5.0,
      microchip: '',
      allergies: '',
      chronicConditions: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      ownerId: pet.ownerId,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      sex: pet.sex,
      birthDate: pet.birthDate,
      color: pet.color,
      initialWeight: pet.initialWeight,
      currentWeight: pet.currentWeight,
      microchip: pet.microchip || '',
      allergies: pet.allergies || '',
      chronicConditions: pet.chronicConditions || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.ownerId) return;

    if (editingPet) {
      onUpdatePet({
        ...editingPet,
        ...formData,
      });
    } else {
      const newPet: Pet = {
        id: `pet-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAddPet(newPet);
    }
    setIsModalOpen(false);
  };

  const filteredPets = pets.filter((pet) => {
    const term = searchTerm.toLowerCase();
    const owner = clients.find((c) => c.id === pet.ownerId);
    const matchesSearch =
      pet.name.toLowerCase().includes(term) ||
      pet.breed.toLowerCase().includes(term) ||
      pet.microchip?.toLowerCase().includes(term) ||
      (owner && owner.name.toLowerCase().includes(term));

    const matchesSpecies = speciesFilter === 'all' || pet.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const speciesOptions: PetSpecies[] = [
    'Perro',
    'Gato',
    'Ave',
    'Conejo / Roedor',
    'Reptil',
    'Otro',
  ];

  const sexOptions: PetSex[] = [
    'Macho',
    'Hembra',
    'Macho Castrado',
    'Hembra Esterilizada',
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Dog className="w-5 h-5 text-teal-600" />
            Registro de Mascotas (Pacientes)
          </h2>
          <p className="text-xs text-slate-500">
            Fichas clínicas de pacientes asociadas a su tutor responsable
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-xs active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Paciente</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre de mascota, raza, chip o nombre del dueño..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
          <button
            onClick={() => setSpeciesFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              speciesFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todos ({pets.length})
          </button>
          <button
            onClick={() => setSpeciesFilter('Perro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              speciesFilter === 'Perro'
                ? 'bg-teal-700 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            🐶 Perros
          </button>
          <button
            onClick={() => setSpeciesFilter('Gato')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              speciesFilter === 'Gato'
                ? 'bg-teal-700 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            🐱 Gatos
          </button>
          <button
            onClick={() => setSpeciesFilter('Conejo / Roedor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              speciesFilter === 'Conejo / Roedor'
                ? 'bg-teal-700 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            🐰 Roedores
          </button>
        </div>
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPets.map((pet) => {
          const owner = clients.find((c) => c.id === pet.ownerId);
          return (
            <div
              key={pet.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-teal-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                {/* Top: Pet Name, Species Badge & Edit */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{pet.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                        {pet.species}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {pet.breed} • {pet.sex}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(pet)}
                      title="Editar datos de mascota"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar al paciente ${pet.name}?`)) {
                          onDeletePet(pet.id);
                        }
                      }}
                      title="Eliminar mascota"
                      className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Owner info */}
                <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 truncate">
                    <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="font-semibold truncate">
                      {owner?.name || 'Tutor no asignado'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {owner?.phone}
                  </span>
                </div>

                {/* Stats: Weight, Age, Color */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Peso: <strong>{pet.currentWeight || pet.initialWeight} kg</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Nac: {formatDate(pet.birthDate)}</span>
                  </div>
                  {pet.color && (
                    <div className="col-span-2 text-[11px] text-slate-500">
                      Color: {pet.color}
                    </div>
                  )}
                  {pet.microchip && (
                    <div className="col-span-2 text-[11px] font-mono text-teal-700">
                      Chip: {pet.microchip}
                    </div>
                  )}
                  {pet.allergies && (
                    <div className="col-span-2 p-1.5 bg-rose-50 border border-rose-100 rounded-lg text-[11px] text-rose-800">
                      ⚠️ Alergias: {pet.allergies}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenClinicalHistory(pet.id)}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 font-medium text-xs rounded-lg transition flex items-center justify-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                  <span>Expediente</span>
                </button>
                <button
                  onClick={() => onScheduleAppointment(pet.id, pet.ownerId)}
                  className="py-1.5 px-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-1 shadow-2xs"
                  title="Agendar nueva cita"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Cita</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredPets.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <Dog className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No hay mascotas registradas</h3>
            <p className="text-xs text-slate-600 mt-1">
              {searchTerm ? 'No hubo coincidencias con la búsqueda.' : 'Registra a tu primer paciente.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleOpenAdd()}
                className="mt-3 px-4 py-2 bg-teal-600 text-white text-xs font-medium rounded-xl hover:bg-teal-700 transition"
              >
                + Registrar Primera Mascota
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal Registro / Edición Mascota */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Dog className="w-4 h-4 text-teal-600" />
                {editingPet ? 'Editar Mascota' : 'Alta de Paciente'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Propietario / Tutor Responsable *
                </label>
                <select
                  required
                  value={formData.ownerId}
                  onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                >
                  <option value="">-- Seleccionar tutor --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nombre del Paciente *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Max, Luna, Bobby..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Especie *
                  </label>
                  <select
                    value={formData.species}
                    onChange={(e) =>
                      setFormData({ ...formData, species: e.target.value as PetSpecies })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  >
                    {speciesOptions.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Raza *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Golden Retriever, Siamés..."
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sexo *</label>
                  <select
                    value={formData.sex}
                    onChange={(e) =>
                      setFormData({ ...formData, sex: e.target.value as PetSex })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  >
                    {sexOptions.map((sx) => (
                      <option key={sx} value={sx}>
                        {sx}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Color / Señas</label>
                  <input
                    type="text"
                    placeholder="Ej: Dorado, atigrado..."
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Peso Inicial (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formData.initialWeight}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        initialWeight: val,
                        currentWeight: editingPet ? formData.currentWeight : val,
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Número de Microchip / Tatuaje
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 985141002348911"
                    value={formData.microchip}
                    onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-rose-700">
                    Alergias Conocidas
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Pollo, penicilina, pulgas..."
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
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
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-xs"
                >
                  {editingPet ? 'Guardar Mascota' : 'Registrar Mascota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

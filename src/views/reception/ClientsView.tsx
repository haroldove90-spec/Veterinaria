import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Dog,
  Edit2,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';
import { Client, Pet } from '../../types';
import { buildWhatsAppLink } from '../../utils/formatters';

interface ClientsViewProps {
  clients: Client[];
  pets: Pet[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onSelectPetForView?: (petId: string) => void;
  onNewPetForClient?: (clientId: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  pets,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onSelectPetForView,
  onNewPetForClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form fields
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt'>>({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    notes: '',
  });

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      whatsapp: client.whatsapp,
      email: client.email,
      address: client.address,
      notes: client.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingClient) {
      onUpdateClient({
        ...editingClient,
        ...formData,
      });
    } else {
      const newClient: Client = {
        id: `cli-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAddClient(newClient);
    }
    setIsModalOpen(false);
  };

  // Filter clients by name, phone, email, or their pets' names
  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesClient =
      c.name.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      c.email.toLowerCase().includes(term);

    // Also match if any of the client's pets has the name
    const clientPets = pets.filter((p) => p.ownerId === c.id);
    const matchesPet = clientPets.some((p) => p.name.toLowerCase().includes(term));

    return matchesClient || matchesPet;
  });

  return (
    <div className="space-y-4">
      {/* View Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Gestión de Clientes (Propietarios)
          </h2>
          <p className="text-xs text-slate-500">
            Directorio de tutores, contacto por WhatsApp y mascotas asociadas
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-xs active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Propietario</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por nombre del dueño, teléfono, WhatsApp o nombre de su mascota..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map((client) => {
          const clientPets = pets.filter((p) => p.ownerId === client.id);
          const waUrl = buildWhatsAppLink(
            client.whatsapp || client.phone,
            `¡Hola ${client.name}! Le contactamos de Veterinaria Pro respecto a la atención de sus mascotas.`
          );

          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-teal-300 transition-all space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{client.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{client.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Chatear por WhatsApp"
                    className="p-1.5 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleOpenEdit(client)}
                    title="Editar datos"
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar al cliente ${client.name}?`)) {
                        onDeleteClient(client.id);
                      }
                    }}
                    title="Eliminar cliente"
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2">
                {client.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{client.address}</span>
                  </div>
                )}
              </div>

              {/* Pets Section */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Dog className="w-3.5 h-3.5 text-teal-600" />
                    Mascotas ({clientPets.length})
                  </span>
                  {onNewPetForClient && (
                    <button
                      onClick={() => onNewPetForClient(client.id)}
                      className="text-[11px] font-semibold text-teal-600 hover:text-teal-800"
                    >
                      + Asociar Mascota
                    </button>
                  )}
                </div>

                {clientPets.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {clientPets.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelectPetForView && onSelectPetForView(p.id)}
                        className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 rounded-lg transition flex items-center gap-1"
                      >
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-[10px] text-slate-600">({p.species})</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Sin mascotas registradas aún.</p>
                )}
              </div>
            </div>
          );
        })}

        {filteredClients.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No se encontraron clientes</h3>
            <p className="text-xs text-slate-600 mt-1">
              {searchTerm
                ? 'Prueba con otro término de búsqueda.'
                : 'Empieza registrando al primer tutor o cliente.'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleOpenAdd}
                className="mt-3 px-4 py-2 bg-teal-600 text-white text-xs font-medium rounded-xl hover:bg-teal-700 transition"
              >
                + Registrar Primer Cliente
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal Alta / Edición Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                {editingClient ? 'Editar Propietario' : 'Registrar Nuevo Propietario'}
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
                  Nombre Completo del Tutor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: María Fernanda Ruiz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Teléfono Local / Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 5541238910"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        phone: val,
                        whatsapp: formData.whatsapp ? formData.whatsapp : val,
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Número para WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej: 5541238910"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dirección del Domicilio
                </label>
                <input
                  type="text"
                  placeholder="Calle, Número, Colonia, Ciudad"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notas de Atención / Preferencias
                </label>
                <textarea
                  rows={2}
                  placeholder="Horarios preferidos, observaciones especiales..."
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
                  {editingClient ? 'Guardar Cambios' : 'Registrar Propietario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

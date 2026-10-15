import React, { useState } from 'react';
import {
  UserCog,
  UserPlus,
  Search,
  Key,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Scissors,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  X,
  Lock,
} from 'lucide-react';
import { UserAccount, UserRole } from '../../types';

interface StaffViewProps {
  users: UserAccount[];
  onAddUser: (user: UserAccount) => void;
  onUpdateUser: (user: UserAccount) => void;
  onDeleteUser: (id: string) => void;
  onSelectRoleToTest?: (role: UserRole) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onSelectRoleToTest,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const [formData, setFormData] = useState<Omit<UserAccount, 'id'>>({
    name: '',
    role: 'reception',
    email: '',
    phone: '',
    active: true,
    pin: '1234',
    licenseNumber: '',
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      role: 'reception',
      email: '',
      phone: '',
      active: true,
      pin: '1234',
      licenseNumber: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone,
      active: user.active,
      pin: user.pin || '1234',
      licenseNumber: user.licenseNumber || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingUser) {
      onUpdateUser({
        ...editingUser,
        ...formData,
      });
    } else {
      const newUser: UserAccount = {
        id: `u-${Date.now()}`,
        ...formData,
      };
      onAddUser(newUser);
    }
    setIsModalOpen(false);
  };

  const filtered = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'reception':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Recepción / Caja</span>
          </span>
        );
      case 'vet':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Médico Veterinario</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrador / Dueño</span>
          </span>
        );
      case 'assistant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Scissors className="w-3.5 h-3.5" />
            <span>Asistente / Estética</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-indigo-600" />
            Gestión de Personal y Cuentas de Acceso
          </h2>
          <p className="text-xs text-slate-500">
            Administración de usuarios, roles de acceso, contraseñas PIN y cédulas veterinarias
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-xs active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Colaborador</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar colaborador por nombre, correo o rol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-base">{user.name}</h3>
                    {user.active ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Activo" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-400" title="Inactivo" />
                    )}
                  </div>
                  <div className="pt-0.5">{getRoleBadge(user.role)}</div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(user)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {users.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar al colaborador ${user.name}?`)) {
                          onDeleteUser(user.id);
                        }
                      }}
                      className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-3 border-t border-slate-100 mt-2">
                <div className="truncate">
                  <span className="text-slate-600 font-medium">Correo: </span>
                  <span className="font-semibold text-slate-800">{user.email}</span>
                </div>
                {user.phone && (
                  <div>
                    <span className="text-slate-600 font-medium">Teléfono: </span>
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.licenseNumber && (
                  <div>
                    <span className="text-slate-600 font-medium">Cédula Prof: </span>
                    <span className="font-mono text-teal-800 font-bold">{user.licenseNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>PIN de Acceso: ••••</span>
                </div>
              </div>
            </div>

            {onSelectRoleToTest && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectRoleToTest(user.role)}
                  className="w-full py-1.5 px-3 bg-slate-50 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 text-xs font-semibold rounded-lg transition border border-slate-200 hover:border-indigo-200"
                >
                  Entrar con este Rol
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Alta / Edición de Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <UserCog className="w-4 h-4 text-indigo-600" />
                {editingUser ? 'Editar Colaborador' : 'Nuevo Colaborador'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Dra. Valeria Morales"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rol Asignado *</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as UserRole,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold"
                  >
                    <option value="reception">Recepción / Caja</option>
                    <option value="vet">Médico Veterinario</option>
                    <option value="admin">Administrador / Dueño</option>
                    <option value="assistant">Asistente / Estética</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Clave / PIN de Acceso *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Ej: 1234"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="colaborador@veterinariapro.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="55 1234 5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cédula Profesional (Médicos)
                  </label>
                  <input
                    type="text"
                    placeholder="CED-VET-12345"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded-sm"
                  />
                  <span>Usuario Activo con Acceso al Sistema</span>
                </label>
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-xs"
                >
                  {editingUser ? 'Guardar Cambios' : 'Registrar Colaborador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

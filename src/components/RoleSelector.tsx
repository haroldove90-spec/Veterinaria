import React from 'react';
import { UserCheck, Stethoscope, ShieldCheck, Scissors } from 'lucide-react';
import { UserRole } from '../types';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const roles: {
    id: UserRole;
    name: string;
    icon: React.ReactNode;
    colorClasses: string;
    iconBg: string;
    borderHover: string;
  }[] = [
    {
      id: 'reception',
      name: 'Recepción / Caja',
      icon: <UserCheck className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 stroke-[1.75]" />,
      colorClasses: 'text-teal-600 group-hover:text-teal-700',
      iconBg: 'bg-teal-50 group-hover:bg-teal-100/90',
      borderHover: 'hover:border-teal-400 hover:shadow-teal-100',
    },
    {
      id: 'vet',
      name: 'Médico Veterinario',
      icon: <Stethoscope className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 stroke-[1.75]" />,
      colorClasses: 'text-emerald-600 group-hover:text-emerald-700',
      iconBg: 'bg-emerald-50 group-hover:bg-emerald-100/90',
      borderHover: 'hover:border-emerald-400 hover:shadow-emerald-100',
    },
    {
      id: 'admin',
      name: 'Administrador / Dueño',
      icon: <ShieldCheck className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 stroke-[1.75]" />,
      colorClasses: 'text-indigo-600 group-hover:text-indigo-700',
      iconBg: 'bg-indigo-50 group-hover:bg-indigo-100/90',
      borderHover: 'hover:border-indigo-400 hover:shadow-indigo-100',
    },
    {
      id: 'assistant',
      name: 'Asistente / Estética',
      icon: <Scissors className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 stroke-[1.75]" />,
      colorClasses: 'text-amber-600 group-hover:text-amber-700',
      iconBg: 'bg-amber-50 group-hover:bg-amber-100/90',
      borderHover: 'hover:border-amber-400 hover:shadow-amber-100',
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50/40">
      <div className="w-full max-w-5xl my-auto">
        {/* Strictly: 2 Columns on Mobile / 4 Columns on Desktop. No header, no descriptions, only role name and logo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRole(r.id)}
              className={`group flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm ${r.borderHover} transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95 cursor-pointer min-h-[160px] sm:min-h-[220px]`}
            >
              <div
                className={`w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl ${r.iconBg} ${r.colorClasses} flex items-center justify-center transition-colors mb-3 sm:mb-5 shadow-inner shrink-0`}
              >
                {r.icon}
              </div>
              <span className="text-xs sm:text-base lg:text-lg font-bold text-slate-800 text-center tracking-tight group-hover:text-slate-950 px-1 leading-tight sm:leading-normal">
                {r.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

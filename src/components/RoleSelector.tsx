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
      icon: <UserCheck className="w-12 h-12 sm:w-16 sm:h-16 stroke-[1.75]" />,
      colorClasses: 'text-teal-600 group-hover:text-teal-700',
      iconBg: 'bg-teal-50 group-hover:bg-teal-100/80',
      borderHover: 'hover:border-teal-400 hover:shadow-teal-100',
    },
    {
      id: 'vet',
      name: 'Médico Veterinario',
      icon: <Stethoscope className="w-12 h-12 sm:w-16 sm:h-16 stroke-[1.75]" />,
      colorClasses: 'text-emerald-600 group-hover:text-emerald-700',
      iconBg: 'bg-emerald-50 group-hover:bg-emerald-100/80',
      borderHover: 'hover:border-emerald-400 hover:shadow-emerald-100',
    },
    {
      id: 'admin',
      name: 'Administrador / Dueño',
      icon: <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 stroke-[1.75]" />,
      colorClasses: 'text-indigo-600 group-hover:text-indigo-700',
      iconBg: 'bg-indigo-50 group-hover:bg-indigo-100/80',
      borderHover: 'hover:border-indigo-400 hover:shadow-indigo-100',
    },
    {
      id: 'assistant',
      name: 'Asistente / Estética',
      icon: <Scissors className="w-12 h-12 sm:w-16 sm:h-16 stroke-[1.75]" />,
      colorClasses: 'text-amber-600 group-hover:text-amber-700',
      iconBg: 'bg-amber-50 group-hover:bg-amber-100/80',
      borderHover: 'hover:border-amber-400 hover:shadow-amber-100',
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50/40">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRole(r.id)}
              className={`group flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-md ${r.borderHover} transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95 cursor-pointer min-h-[190px] sm:min-h-[240px]`}
            >
              <div
                className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl ${r.iconBg} ${r.colorClasses} flex items-center justify-center transition-colors mb-4 sm:mb-6 shadow-inner`}
              >
                {r.icon}
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-800 text-center tracking-tight group-hover:text-slate-950">
                {r.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

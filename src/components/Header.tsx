import React from 'react';
import {
  Stethoscope,
  UserCheck,
  ShieldCheck,
  Scissors,
  LogOut,
  Database,
  Menu,
} from 'lucide-react';
import { UserRole } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentRole: UserRole;
  onLogout: () => void;
  onOpenDataManagement: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onLogout,
  onOpenDataManagement,
  onToggleSidebar,
}) => {
  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case 'reception':
        return {
          title: 'Recepción / Caja',
          icon: <UserCheck className="w-4 h-4 text-teal-600" />,
          badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
        };
      case 'vet':
        return {
          title: 'Médico Veterinario',
          icon: <Stethoscope className="w-4 h-4 text-emerald-600" />,
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'admin':
        return {
          title: 'Administrador / Dueño',
          icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
          badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'assistant':
        return {
          title: 'Asistente / Estética',
          icon: <Scissors className="w-4 h-4 text-amber-600" />,
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        };
    }
  };

  const roleInfo = getRoleInfo(currentRole);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Mobile Menu Toggle + Logo Institucional */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 select-none">
            {/* System Logo */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20M7 8l-3 4 3 4M17 8l3 4-3 4" opacity="0.3" />
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 bg-clip-text text-transparent">
                Veterinaria Pro
              </span>
              <span className="hidden sm:inline text-[10px] text-slate-600 font-semibold uppercase tracking-wider -mt-1">
                Clínica &amp; Hospital
              </span>
            </div>
          </div>
        </div>

        {/* Center: Identificación del Rol Activo */}
        <div className="hidden sm:flex items-center">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border text-xs sm:text-sm font-semibold shadow-2xs ${roleInfo.badgeClass}`}
          >
            {roleInfo.icon}
            <span className="truncate max-w-[140px] md:max-w-none">{roleInfo.title}</span>
          </div>
        </div>

        {/* Right: Acciones Institucionales (Instalar PWA, Datos/Supabase, Salir) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Botón PWA Instalable */}
          <PWAInstallButton compact />

          {/* Botón Borrar Datos de Muestra / Configurar Supabase */}
          <button
            onClick={onOpenDataManagement}
            title="Borrar datos de muestra o configurar Supabase"
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition flex items-center gap-1.5 active:scale-95"
          >
            <Database className="w-4 h-4 text-teal-600" />
            <span className="hidden md:inline">Datos / Supabase</span>
          </button>

          {/* Botón Cierre de Sesión */}
          <button
            onClick={onLogout}
            title="Cerrar sesión y volver a la selección de roles"
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 rounded-lg transition active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import {
  Users,
  Dog,
  CalendarDays,
  Receipt,
  FileSpreadsheet,
  PlusCircle,
  FileText,
  Syringe,
  BarChart3,
  Tags,
  Boxes,
  UserCog,
  Sparkles,
  LogOut,
  X,
  Database,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';
import { UserRole } from '../types';

export type AppViewId =
  | 'clients'
  | 'pets'
  | 'appointments'
  | 'cash-register'
  | 'clinical-history'
  | 'new-consultation'
  | 'prescriptions'
  | 'vaccines'
  | 'cash-closing'
  | 'services-catalog'
  | 'inventory'
  | 'staff'
  | 'phase2';

interface SidebarProps {
  currentRole: UserRole;
  currentView: AppViewId;
  onSelectView: (view: AppViewId) => void;
  isOpen: boolean;
  onClose: () => void;
  onSwitchRole: () => void;
  onOpenDataManagement: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentView,
  onSelectView,
  isOpen,
  onClose,
  onSwitchRole,
  onOpenDataManagement,
}) => {
  // Navigation modules tailored per role with full activation of requested capabilities
  const getRoleModules = () => {
    switch (currentRole) {
      case 'reception':
        return {
          primaryTitle: 'Módulos de Recepción y Caja',
          primary: [
            { id: 'clients' as AppViewId, label: 'Clientes (Propietarios)', icon: Users },
            { id: 'pets' as AppViewId, label: 'Registro de Mascotas', icon: Dog },
            { id: 'appointments' as AppViewId, label: 'Agenda de Citas', icon: CalendarDays },
            { id: 'cash-register' as AppViewId, label: 'Cobro y Tickets (Caja)', icon: Receipt },
          ],
          secondaryTitle: 'Consultas de Apoyo',
          secondary: [
            { id: 'services-catalog' as AppViewId, label: 'Catálogo de Servicios', icon: Tags },
            { id: 'inventory' as AppViewId, label: 'Stock de Farmacia / Alimentos', icon: Boxes },
          ],
        };
      case 'vet':
        return {
          primaryTitle: 'Atención Médica Veterinaria',
          primary: [
            { id: 'clinical-history' as AppViewId, label: 'Expediente Clínico Digital', icon: FileSpreadsheet },
            { id: 'new-consultation' as AppViewId, label: 'Nueva Consulta Médica', icon: PlusCircle },
            { id: 'prescriptions' as AppViewId, label: 'Recetas y Tratamientos', icon: FileText },
            { id: 'vaccines' as AppViewId, label: 'Vacunas y Desparasitaciones', icon: Syringe },
          ],
          secondaryTitle: 'Seguimiento de Pacientes',
          secondary: [
            { id: 'pets' as AppViewId, label: 'Pacientes Registrados', icon: Dog },
            { id: 'appointments' as AppViewId, label: 'Agenda Médica del Día', icon: CalendarDays },
          ],
        };
      case 'admin':
        return {
          primaryTitle: 'Supervisión y Administración',
          primary: [
            { id: 'cash-closing' as AppViewId, label: 'Cierre de Caja del Día', icon: BarChart3 },
            { id: 'services-catalog' as AppViewId, label: 'Catálogo de Servicios', icon: Tags },
            { id: 'inventory' as AppViewId, label: 'Control de Inventario', icon: Boxes },
            { id: 'staff' as AppViewId, label: 'Gestión de Personal', icon: UserCog },
          ],
          secondaryTitle: 'Operación General de la Clínica',
          secondary: [
            { id: 'cash-register' as AppViewId, label: 'Punto de Venta / Caja', icon: Receipt },
            { id: 'appointments' as AppViewId, label: 'Agenda General de Citas', icon: CalendarDays },
            { id: 'clients' as AppViewId, label: 'Directorio de Clientes', icon: Users },
            { id: 'pets' as AppViewId, label: 'Fichas de Mascotas', icon: Dog },
            { id: 'clinical-history' as AppViewId, label: 'Expedientes Clínicos', icon: FileSpreadsheet },
          ],
        };
      case 'assistant':
        return {
          primaryTitle: 'Estética y Soporte Clínico',
          primary: [
            { id: 'appointments' as AppViewId, label: 'Citas y Estética', icon: CalendarDays },
            { id: 'pets' as AppViewId, label: 'Pacientes en Sala', icon: Dog },
            { id: 'inventory' as AppViewId, label: 'Insumos y Accesorios', icon: Boxes },
            { id: 'cash-register' as AppViewId, label: 'Cobro Rápido en Caja', icon: Receipt },
          ],
          secondaryTitle: null,
          secondary: [],
        };
    }
  };

  const moduleGroups = getRoleModules();

  const handleNavClick = (viewId: AppViewId) => {
    onSelectView(viewId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Header info & Close on Mobile */}
        <div className="overflow-y-auto flex-1">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                VP
              </div>
              <span className="font-bold text-slate-800 text-base">Módulos del Sistema</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Context Pill */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 block">
            <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Rol Activo en Sesión
            </div>
            <div className="text-sm font-bold text-slate-800 flex items-center justify-between">
              <span>
                {currentRole === 'reception' && 'Recepción / Caja'}
                {currentRole === 'vet' && 'Médico Veterinario'}
                {currentRole === 'admin' && 'Administrador / Dueño'}
                {currentRole === 'assistant' && 'Asistente / Estética'}
              </span>
              <button
                onClick={onSwitchRole}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold underline cursor-pointer"
              >
                Cambiar
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {/* Primary Section */}
            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              {moduleGroups.primaryTitle}
            </div>

            {moduleGroups.primary.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200/80 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-teal-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-teal-600 shrink-0" />}
                </button>
              );
            })}

            {/* Secondary Section (if applicable) */}
            {moduleGroups.secondary && moduleGroups.secondary.length > 0 && (
              <div className="pt-3">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  {moduleGroups.secondaryTitle}
                </div>
                {moduleGroups.secondary.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200/80'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-teal-600' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-teal-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fase 2 Roadmap link */}
            <div className="pt-3">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Futuras Mejoras
              </div>
              <button
                onClick={() => handleNavClick('phase2')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  currentView === 'phase2'
                    ? 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Módulos Fase 2</span>
                </div>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                  Próximo
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom System & Logout Section */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-1 shrink-0">
          <button
            onClick={() => {
              onOpenDataManagement();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <Database className="w-4 h-4 text-teal-600" />
            <span>Datos &amp; Supabase</span>
          </button>

          <button
            onClick={onSwitchRole}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition border border-transparent hover:border-rose-100"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </div>
            <span className="text-[10px] text-slate-600 font-normal">Cambiar rol</span>
          </button>
        </div>
      </aside>
    </>
  );
};

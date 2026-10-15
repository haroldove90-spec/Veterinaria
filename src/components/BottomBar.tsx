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
} from 'lucide-react';
import { UserRole } from '../types';
import { AppViewId } from './Sidebar';

interface BottomBarProps {
  currentRole: UserRole;
  currentView: AppViewId;
  onSelectView: (view: AppViewId) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  currentRole,
  currentView,
  onSelectView,
}) => {
  const getNavItems = () => {
    switch (currentRole) {
      case 'reception':
        return [
          { id: 'clients' as AppViewId, label: 'Clientes', icon: Users },
          { id: 'pets' as AppViewId, label: 'Mascotas', icon: Dog },
          { id: 'appointments' as AppViewId, label: 'Citas', icon: CalendarDays },
          { id: 'cash-register' as AppViewId, label: 'Caja', icon: Receipt },
        ];
      case 'vet':
        return [
          { id: 'clinical-history' as AppViewId, label: 'Historial', icon: FileSpreadsheet },
          { id: 'new-consultation' as AppViewId, label: 'Consulta', icon: PlusCircle },
          { id: 'prescriptions' as AppViewId, label: 'Recetas', icon: FileText },
          { id: 'vaccines' as AppViewId, label: 'Vacunas', icon: Syringe },
        ];
      case 'admin':
        return [
          { id: 'cash-closing' as AppViewId, label: 'Cierre', icon: BarChart3 },
          { id: 'services-catalog' as AppViewId, label: 'Servicios', icon: Tags },
          { id: 'inventory' as AppViewId, label: 'Inventario', icon: Boxes },
          { id: 'staff' as AppViewId, label: 'Personal', icon: UserCog },
        ];
      case 'assistant':
        return [
          { id: 'appointments' as AppViewId, label: 'Citas', icon: CalendarDays },
          { id: 'pets' as AppViewId, label: 'Pacientes', icon: Dog },
          { id: 'inventory' as AppViewId, label: 'Insumos', icon: Boxes },
        ];
    }
  };

  const items = getNavItems();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 safe-area-bottom">
      <div className="grid grid-flow-col auto-cols-fr items-center justify-around gap-1 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all select-none active:scale-95 ${
                isActive
                  ? 'text-teal-700 font-bold bg-teal-50/80 scale-105'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-0.5 transition-colors ${
                  isActive ? 'text-teal-600 stroke-[2.2]' : 'text-slate-400'
                }`}
              />
              <span className="text-[10px] leading-tight truncate max-w-[70px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

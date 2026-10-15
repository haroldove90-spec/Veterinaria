import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Bed,
  Globe,
  Clock,
  Send,
  CheckCircle2,
  Calendar,
  HeartPulse,
  Activity,
  FileText,
  UserCheck,
} from 'lucide-react';

export const Phase2RoadmapView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'hospital' | 'portal'>('whatsapp');

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Módulos Fase 2 (Próxima Actualización)
            </h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              En Roadmap
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Vista previa interactiva de las funcionalidades de automatización, hospitalización y portal web para clientes
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-white p-1.5 border border-slate-200 shadow-2xs max-w-xl">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'whatsapp'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Recordatorios WhatsApp</span>
        </button>
        <button
          onClick={() => setActiveTab('hospital')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'hospital'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Hospitalización</span>
        </button>
        <button
          onClick={() => setActiveTab('portal')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'portal'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Portal Tutores</span>
        </button>
      </div>

      {/* Tab 1: Recordatorios Automáticos por WhatsApp */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                Automatización de Mensajería WhatsApp Business
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Envío programado automático de alertas 48h antes de vencimiento de vacunas y desparasitaciones.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Listo para enlazar con Cloud API
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Plantilla 1: Refuerzo de Vacuna Anual</span>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 leading-relaxed">
                "¡Hola {"{{tutor_nombre}}"}! Te recordamos que la vacuna Séxtuple de {"{{mascota_nombre}}"} vence el {"{{fecha_refuerzo}}"}. Mantén protegida su salud agendando aquí: {"{{link_reserva}}"}"
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[10px] pt-1">
                <span>Disparador: 3 días antes de la fecha</span>
                <span className="text-emerald-600 font-bold">Activo en Fase 2</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Plantilla 2: Desparasitación Trimestral</span>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 leading-relaxed">
                "¡Hola {"{{tutor_nombre}}"}! Ya pasaron 3 meses desde la última desparasitación de {"{{mascota_nombre}}"}. Pasa a la clínica o responde a este chat para enviar su pipeta a domicilio."
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[10px] pt-1">
                <span>Disparador: Cada 90 días</span>
                <span className="text-emerald-600 font-bold">Activo en Fase 2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hospitalización y Guardería */}
      {activeTab === 'hospital' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bed className="w-5 h-5 text-purple-600" />
              Módulo de Hospitalización y Bitácora Horaria
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Registro continuo por turnos médicos de fluidoterapia, medicación en bomba de infusión y evolución clínica.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Hora</th>
                  <th className="py-2.5 px-3">Paciente / Jaula</th>
                  <th className="py-2.5 px-3">Temperatura / FC</th>
                  <th className="py-2.5 px-3">Fluidoterapia (ml/h)</th>
                  <th className="py-2.5 px-3">Medicación Aplicada</th>
                  <th className="py-2.5 px-3">Micción / Heces</th>
                  <th className="py-2.5 px-3">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-3 font-mono font-bold">08:00</td>
                  <td className="py-2 px-3 font-bold text-purple-900">Max (Jaula #2 Caninos)</td>
                  <td className="py-2 px-3">38.4 °C • 88 lpm</td>
                  <td className="py-2 px-3">Hartmann @ 45 ml/h</td>
                  <td className="py-2 px-3">Ceftriaxona IV 300mg</td>
                  <td className="py-2 px-3 text-emerald-700 font-semibold">+ Micción / - Heces</td>
                  <td className="py-2 px-3 text-slate-500">Dra. Sofía Mendoza</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-bold">10:00</td>
                  <td className="py-2 px-3 font-bold text-purple-900">Max (Jaula #2 Caninos)</td>
                  <td className="py-2 px-3">38.2 °C • 90 lpm</td>
                  <td className="py-2 px-3">Hartmann @ 45 ml/h</td>
                  <td className="py-2 px-3">Ranitidina IV 25mg</td>
                  <td className="py-2 px-3 text-slate-400">Sin micción</td>
                  <td className="py-2 px-3 text-slate-500">Elena Garza (Auxiliar)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Portal para Tutores */}
      {activeTab === 'portal' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-600" />
              Portal Web de Autoservicio para Tutores
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Web app ligera donde el dueño consulta su cartilla digital con código QR y descarga recetas médicas.
            </p>
          </div>

          <div className="max-w-md mx-auto p-5 bg-gradient-to-b from-teal-50/50 to-white rounded-2xl border border-teal-200 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-teal-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black">
                  VP
                </div>
                <span className="font-bold text-slate-900">Mi Carnet Digital</span>
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-white px-2 py-0.5 rounded-full border border-teal-200">
                Acceso Tutor
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
                🐕
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Max</h4>
                <p className="text-[11px] text-slate-500">Golden Retriever • 31.2 kg</p>
                <p className="text-[10px] text-emerald-600 font-semibold">✓ Vacunas al día</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <button className="w-full py-2 px-3 bg-teal-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-2xs">
                <FileText className="w-3.5 h-3.5" />
                <span>Ver Recetas Vigentes</span>
              </button>
              <button className="w-full py-2 px-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold flex items-center justify-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar Próxima Vacuna</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Trash2, Database, ShieldAlert, CheckCircle2, RotateCcw, AlertTriangle, Key, Globe, ExternalLink } from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  isSampleDataCleared,
  SupabaseConfig,
} from '../utils/storage';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearSampleData: () => void;
  onRestoreSampleData: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onClearSampleData,
  onRestoreSampleData,
}) => {
  const [config, setConfig] = useState<SupabaseConfig>({ url: '', anonKey: '' });
  const [cleared, setCleared] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPurgingRemote, setIsPurgingRemote] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getSupabaseConfig());
      setCleared(isSampleDataCleared());
      setStatusMessage(null);
      setConfirmDelete(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(config);
    setStatusMessage('Configuración de Supabase guardada exitosamente.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExecuteLocalWipe = () => {
    onClearSampleData();
    setCleared(true);
    setConfirmDelete(false);
    setStatusMessage('✓ Todos los datos de muestra fueron eliminados. El navegador comenzará desde cero en las próximas sesiones.');
  };

  const handleExecuteRestore = () => {
    onRestoreSampleData();
    setCleared(false);
    setStatusMessage('✓ Datos de demostración restaurados.');
  };

  const handlePurgeRemoteSupabase = async () => {
    if (!config.url || !config.anonKey) {
      alert('Por favor ingresa primero la URL y la Anon Key de Supabase.');
      return;
    }

    setIsPurgingRemote(true);
    setStatusMessage('Conectando a Supabase para purgar registros...');

    try {
      // Direct REST calls to purge tables in Supabase if configured
      const tables = ['citas', 'consultas', 'ventas', 'pacientes', 'clientes'];
      const results: string[] = [];

      for (const table of tables) {
        try {
          const res = await fetch(`${config.url.replace(/\/$/, '')}/rest/v1/${table}?id=neq.00000000-0000-0000-0000-000000000000`, {
            method: 'DELETE',
            headers: {
              apikey: config.anonKey,
              Authorization: `Bearer ${config.anonKey}`,
              'Content-Type': 'application/json',
              Prefer: 'return=minimal',
            },
          });
          results.push(`${table}: ${res.status === 204 || res.status === 200 ? 'limpiada' : 'status ' + res.status}`);
        } catch {
          results.push(`${table}: no alcanzable`);
        }
      }

      // Also wipe locally
      handleExecuteLocalWipe();
      setStatusMessage(`✓ Petición enviada a Supabase y datos locales purgados. (${results.join(', ')})`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setStatusMessage(`Aviso de conexión: ${errorMsg}. Los datos locales fueron purgados.`);
      handleExecuteLocalWipe();
    } finally {
      setIsPurgingRemote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Gestión de Datos y Conexión Supabase
              </h3>
              <p className="text-xs text-slate-500">
                Borrado de datos de muestra y sincronización
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
          {statusMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>{statusMessage}</div>
            </div>
          )}

          {/* Section 1: Clear Sample Data */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  Borrado de Datos de Muestra
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Elimina todos los clientes, pacientes, citas, consultas y ventas de prueba. 
                  Se guarda una instrucción permanente en el navegador para que <strong>nunca se vuelvan a cargar automáticamente</strong> al refrescar o reiniciar.
                </p>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  cleared
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {cleared ? 'Sistema Limpio' : 'Con Datos Muestra'}
              </span>
            </div>

            {!confirmDelete ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-lg transition shadow-xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Borrar Datos de Muestra del Sistema
                </button>

                {cleared && (
                  <button
                    type="button"
                    onClick={handleExecuteRestore}
                    className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs rounded-lg transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restaurar Datos de Demostración
                  </button>
                )}
              </div>
            ) : (
              <div className="p-3 bg-white rounded-lg border border-rose-300 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  ¿Confirmas que deseas borrar todos los registros de muestra?
                </div>
                <p className="text-xs text-slate-500">
                  Las tablas quedarán en blanco para que ingreses tus pacientes y clientes reales.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleExecuteLocalWipe}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                  >
                    Sí, Borrar Todo Permanentemente
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Supabase Credentials and Purge */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-teal-600" />
                Conexión y Purga Remota en Supabase
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Ingresa tus credenciales de proyecto Supabase cuando desees sincronizar o purgar tablas remotas directamente desde la aplicación.
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  placeholder="https://xyzproject.supabase.co"
                  value={config.url}
                  onChange={(e) => setConfig({ ...config, url: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  Supabase Anon / Public API Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={config.anonKey}
                  onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg transition shadow-xs"
                >
                  Guardar Configuración Supabase
                </button>

                {config.url && config.anonKey && (
                  <button
                    type="button"
                    onClick={handlePurgeRemoteSupabase}
                    disabled={isPurgingRemote}
                    className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-medium text-xs rounded-lg transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {isPurgingRemote ? 'Purgando Supabase...' : 'Borrar Registros en Supabase'}
                  </button>
                )}
              </div>
            </form>

            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Las credenciales se guardan de forma segura y privada en este navegador.</span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-teal-600 hover:underline flex items-center gap-1 shrink-0 font-medium"
              >
                Abrir Supabase <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Download, CheckCircle2, Share2, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">App Instalada</span>
      </span>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Instalar Veterinaria Pro en tu dispositivo (Android, iOS o Computadora)"
        className={`inline-flex items-center gap-2 font-medium text-white transition-all shadow-sm rounded-lg active:scale-95 ${
          compact
            ? 'px-2.5 py-1.5 text-xs bg-teal-600 hover:bg-teal-700'
            : 'px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700'
        }`}
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 animate-bounce" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden text-[11px]">Instalar</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Instalar Veterinaria Pro</h3>
                  <p className="text-xs text-slate-500">Acceso rápido sin conexión</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm text-slate-600">
              {isIOS ? (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">Pasos para iPhone y iPad (Safari):</p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <span>1. Toca el botón <strong>Compartir</strong></span>
                      <Share2 className="w-4 h-4 text-blue-600 inline" />
                    </li>
                    <li>2. Desplázate hacia abajo en el menú.</li>
                    <li>
                      3. Selecciona <strong>"Agregar a pantalla de inicio"</strong>.
                    </li>
                    <li>4. Confirma tocando <strong>"Agregar"</strong> en la esquina superior.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">Instalación en Navegador / Android / PC:</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>
                        <strong>En Chrome / Edge (PC o Mac):</strong> Haz clic en el ícono de instalación que aparece a la derecha de la barra de direcciones URL, o en el menú ⋮ &gt; <em>"Instalar Veterinaria Pro"</em>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>
                        <strong>En Android (Chrome):</strong> Toca los tres puntos ⋮ en la parte superior derecha y selecciona <em>"Instalar aplicación"</em> o <em>"Agregar a la pantalla principal"</em>.
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-xs text-teal-800">
                ✨ La aplicación se iniciará como una app nativa en pantalla completa, lista para trabajar en recepción, consultorios y caja.
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React from 'react';
import { Check, Circle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { NexuAnalysis } from '../services/nexuService';
import { SessionInfoPanel } from './SessionInfoPanel';

interface NexuPanelProps {
  analysis: NexuAnalysis | null;
  isLoading: boolean;
  sessionId: string;
  showSessionInfo?: boolean;
  isDrawer?: boolean;
}

export const NexuPanel: React.FC<NexuPanelProps> = ({
  analysis,
  isLoading,
  sessionId,
  showSessionInfo = true,
  isDrawer = false,
}) => {
  const collectedCount = analysis
    ? Object.values(analysis.datosRecolectados).filter(Boolean).length
    : 0;
  const totalData: number = 5;
  const progress = totalData === 0 ? 0 : (collectedCount / totalData) * 100;

  const rootClassName = isDrawer
    ? 'panel-surface flex w-full flex-col overflow-visible px-4 py-4'
    : 'panel-surface flex h-full min-h-0 w-full flex-col overflow-y-auto px-4 py-4 lg:px-5';

  return (
    <aside className={rootClassName}>
      <div className="space-y-4">
        <header className="space-y-1.5 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#FFD8BF] bg-[#FFF3EA] text-[#FF641E]">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-[16px] font-semibold tracking-tight text-[#252525]">NEXU</h2>
              <p className="text-xs text-[#74706A]">Analisis del caso</p>
            </div>
          </div>

          {analysis ? (
            <StatusBadge estado={analysis.estadoCaso} />
          ) : (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[#F7F3EE] px-3 py-1.5 text-xs font-medium text-[#74706A]">
              <span className="h-2 w-2 rounded-full bg-[#F5B82E]" />
              Esperando conversacíon
            </span>
          )}
        </header>

        {isLoading && !analysis ? (
          <EmptyState
            icon={<Loader2 className="h-4 w-4 animate-spin" />}
            title="Actualizando analisis"
            text="NEXU esta procesando los ultimos mensajes."
          />
        ) : !analysis ? (
          <EmptyState
            icon={<Sparkles className="h-4 w-4" />}
            title="Esperando conversación"
            text="El analisis aparecera cuando avance la conversación."
          />
        ) : (
          <div className="space-y-4">
            <InfoBlock title="Problema detectado">
              <p className="text-[15px] leading-6 text-[#252525]">
                {analysis.problemaPrincipal}
              </p>
            </InfoBlock>

            <InfoBlock title="Datos para la cita" action={`${collectedCount}/${totalData}`}>
              <div className="mt-3 h-2 rounded-full bg-[#F0E8DF]">
                <div
                  className="h-full rounded-full bg-[#FF641E] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-3 space-y-2">
                <DataRow label="Nombre" value={analysis.datosRecolectados.nombre} />
                <DataRow label="Correo" value={analysis.datosRecolectados.correo} />
                <DataRow label="Fecha" value={analysis.datosRecolectados.fecha} />
                <DataRow label="Hora" value={analysis.datosRecolectados.hora} />
                <DataRow label="Motivo" value={analysis.datosRecolectados.motivo} />
              </div>
            </InfoBlock>

            <InfoBlock title="Resumen">
              <p className="text-[14px] leading-6 text-[#252525]">{analysis.resumen}</p>
            </InfoBlock>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Complejidad" value={analysis.complejidad} />
              <MetricCard label="Tono" value={analysis.tonoAparente} />
            </div>

            <InfoBlock title="Siguiente acciÃ³n sugerida" accent>
              <div className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FF641E]" />
                <p className="text-[15px] font-medium leading-6 text-[#252525]">
                  {analysis.siguienteAccion}
                </p>
              </div>
            </InfoBlock>

            {isLoading && (
              <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-xs text-[#74706A]">
                <span className="h-2 w-2 rounded-full bg-[#FF641E] animate-pulse" />
                Actualizando analisis
              </div>
            )}
          </div>
        )}

        {showSessionInfo ? (
          <div className="border-t border-[var(--border)] pt-4">
            <SessionInfoPanel sessionId={sessionId} />
          </div>
        ) : null}
      </div>
    </aside>
  );
};

const StatusBadge: React.FC<{ estado: NexuAnalysis['estadoCaso'] }> = ({ estado }) => {
  const config = getStatusConfig(estado);

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${config.className}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dotClassName}`} />
      {config.label}
    </span>
  );
};

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({
  icon,
  title,
  text,
}) => (
  <div className="rounded-[20px] border border-[var(--border)] bg-[#F7F3EE] px-4 py-4">
    <div className="flex items-center gap-2 text-sm font-medium text-[#252525]">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#FF641E] shadow-[0_4px_16px_rgba(40,35,25,0.04)]">
        {icon}
      </span>
      {title}
    </div>
    <p className="mt-2 text-sm leading-6 text-[#74706A]">{text}</p>
  </div>
);

const InfoBlock: React.FC<{
  title: string;
  action?: string;
  accent?: boolean;
  children: React.ReactNode;
}> = ({ title, action, accent, children }) => (
  <section
    className={`rounded-[20px] border px-4 py-4 ${
      accent ? 'border-[#FFD8BF] bg-[#FFF7F1]' : 'border-[var(--border)] bg-white'
    }`}
  >
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-[14px] font-semibold text-[#252525]">{title}</h3>
      {action ? <span className="text-xs font-medium text-[#74706A]">{action}</span> : null}
    </div>
    <div className="mt-3">{children}</div>
  </section>
);

const DataRow: React.FC<{ label: string; value: boolean }> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[#FAF9F6] px-3 py-2.5">
    <span className="text-sm text-[#252525]">{label}</span>
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        value ? 'text-[#4FA45F]' : 'text-[#A19D96]'
      }`}
    >
      {value ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
      {value ? 'Recolectado' : 'Pendiente'}
    </span>
  </div>
);

const MetricCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-[18px] border border-[var(--border)] bg-white px-4 py-3">
    <div className="text-[12px] text-[#A19D96]">{label}</div>
    <div className="mt-1 text-[14px] font-semibold text-[#252525]">{value}</div>
  </div>
);

function getStatusConfig(estado: NexuAnalysis['estadoCaso']) {
  switch (estado) {
    case 'En diagnóstico':
      return {
        label: 'En diagnóstico',
        className: 'border-[#FFD8BF] bg-[#FFF0E5] text-[#F45B13]',
        dotClassName: 'bg-[#FF641E]',
      };
    case 'Resuelto':
      return {
        label: 'Resuelto',
        className: 'border-[#CDE8D2] bg-[#EEF7EF] text-[#4FA45F]',
        dotClassName: 'bg-[#4FA45F]',
      };
    case 'Pendiente':
      return {
        label: 'Pendiente',
        className: 'border-[#F0E0A5] bg-[#FFF6DA] text-[#B07A00]',
        dotClassName: 'bg-[#F5B82E]',
      };
    case 'Requiere revisión técnica':
      return {
        label: 'Revisión técnica',
        className: 'border-[#F5C7C0] bg-[#FDECEC] text-[#D95040]',
        dotClassName: 'bg-[#D95040]',
      };
    case 'Cita en proceso':
      return {
        label: 'Cita en proceso',
        className: 'border-[#FFD8BF] bg-[#FFF7F1] text-[#F45B13]',
        dotClassName: 'bg-[#FF641E]',
      };
    case 'Cita agendada':
      return {
        label: 'Cita agendada',
        className: 'border-[#CDE8D2] bg-[#EEF7EF] text-[#4FA45F]',
        dotClassName: 'bg-[#4FA45F]',
      };
    default:
      return {
        label: estado,
        className: 'border-[#E5E0D8] bg-[#F7F3EE] text-[#74706A]',
        dotClassName: 'bg-[#A19D96]',
      };
  }
}

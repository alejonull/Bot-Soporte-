import React from 'react';
import { NexuAnalysis } from '../services/nexuService';

interface NexuPanelProps {
  analysis: NexuAnalysis | null;
  isLoading: boolean;
}

export const NexuPanel: React.FC<NexuPanelProps> = ({
  analysis,
  isLoading,
}) => {
  const collectedCount = analysis
    ? Object.values(analysis.datosRecolectados).filter(Boolean).length
    : 0;
  const totalData: number = 5;
  const progress = totalData === 0 ? 0 : (collectedCount / totalData) * 100;

  if (isLoading && !analysis) {
    return (
      <div className="panel-surface h-full w-full overflow-y-auto p-4 lg:p-4">
        <PanelHeader />
        <EmptyState text="Analizando conversación..." />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="panel-surface h-full w-full overflow-y-auto p-4 lg:p-4">
        <PanelHeader />
        <EmptyState text="El análisis aparecerá cuando avance la conversación." />
      </div>
    );
  }

  return (
    <div className="panel-surface h-full w-full overflow-y-auto p-4 lg:p-4">
      <div className="space-y-3.5">
        <PanelHeader />

        <section className="panel-section !p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="section-label">Estado</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="badge badge--info">{analysis.estadoCaso}</span>
                <span className="badge badge--neutral">Análisis del caso</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel-section !p-3">
          <div className="section-label">Problema principal</div>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            {analysis.problemaPrincipal}
          </p>
        </section>

        <section className="panel-section !p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="section-label">Datos para cita</div>
            <span className="badge badge--neutral">{collectedCount}/{totalData}</span>
          </div>

          <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 space-y-1.5">
            <DataRow label="Nombre" value={analysis.datosRecolectados.nombre} />
            <DataRow label="Correo" value={analysis.datosRecolectados.correo} />
            <DataRow label="Fecha" value={analysis.datosRecolectados.fecha} />
            <DataRow label="Hora" value={analysis.datosRecolectados.hora} />
            <DataRow label="Motivo" value={analysis.datosRecolectados.motivo} />
          </div>
        </section>

        <section className="panel-section !p-3">
          <div className="section-label">Resumen</div>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            {analysis.resumen}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-2">
          <CompactMetric label="Complejidad" value={analysis.complejidad} />
          <CompactMetric label="Tono" value={analysis.tonoAparente} />
        </section>

        <section className="panel-section !p-3">
          <div className="section-label">Revisión técnica</div>
          <div className="mt-2">
            <span className={`badge ${analysis.requiereRevisionTecnica ? 'badge--warn' : 'badge--success'}`}>
              {analysis.requiereRevisionTecnica ? 'Recomendada' : 'No requerida'}
            </span>
          </div>
        </section>

        <section className="panel-section panel-section--accent !p-3">
          <div className="section-label section-label--accent">Siguiente acción</div>
          <p className="mt-2 text-sm leading-6 font-medium text-slate-50">
            {analysis.siguienteAccion}
          </p>
        </section>

        {isLoading && <div className="text-xs text-slate-500">Actualizando análisis...</div>}
      </div>
    </div>
  );
};

const PanelHeader = () => (
  <header className="space-y-1">
    <h2 className="text-base font-semibold tracking-tight text-slate-100">NEXU</h2>
    <p className="text-xs text-slate-400">Análisis del caso</p>
    <span className="badge badge--info mt-1">En diagnóstico</span>
  </header>
);

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className="mt-4 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/40 px-3 py-4 text-sm text-slate-500">
    {text}
  </div>
);

interface DataRowProps {
  label: string;
  value: boolean;
}

const DataRow: React.FC<DataRowProps> = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800/70 bg-slate-950/40 px-3 py-2">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="badge badge--neutral">
        <span className={`h-1.5 w-1.5 rounded-full ${value ? 'bg-emerald-400' : 'bg-slate-500'}`} />
        {value ? 'Recolectado' : 'Pendiente'}
      </span>
    </div>
  );
};

const CompactMetric: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-2.5">
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-100">{value}</div>
    </div>
  );
};

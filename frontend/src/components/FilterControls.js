import React from 'react';

function FilterControls({
  patients,
  selectedPatient,
  onPatientChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  onApply, // Função para aplicar todos os filtros
}) {
  const isFilterDisabled = patients.length === 0 || !selectedPatient;

  return (
    <div className="card filter-card">
      <h2>Filtros de Visualização</h2>
      
      {/* Filtro de Paciente */}
      <div className="filter-group">
        <label htmlFor="patient-select">Paciente:</label>
        <select
          id="patient-select"
          value={selectedPatient}
          onChange={(e) => onPatientChange(e.target.value)}
          disabled={patients.length === 0}
        >
          <option value="">-- Selecione um Paciente --</option>
          {patients.map((patient) => (
            <option key={patient.paciente_id} value={patient.paciente_id}>
              {patient.paciente_nome} ({patient.paciente_id})
            </option>
          ))}
        </select>
      </div>

      {/* Filtro de Horário */}
      <div className="filter-group time-filter-group">
        <div className="time-input">
            <label htmlFor="startTime">Horário Inicial:</label>
            <input
                type="time"
                id="startTime"
                step="1"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                disabled={isFilterDisabled}
            />
        </div>
        <div className="time-input">
            <label htmlFor="endTime">Horário Final:</label>
            <input
                type="time"
                id="endTime"
                step="1"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                disabled={isFilterDisabled}
            />
        </div>
      </div>

      <button onClick={onApply} disabled={isFilterDisabled}>
        Aplicar Filtros
      </button>
    </div>
  );
}

export default FilterControls;
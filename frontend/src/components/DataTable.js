import React from 'react';

function DataTable({ data, patientId }) {

  const handleDownload = () => {
    if (!patientId) return;
    window.open(`${process.env.REACT_APP_API_URL}/patients/${patientId}/download`);
  };

  if (!patientId) {
    return <p>Selecione um paciente para visualizar os dados.</p>;
  }

  if (data.length === 0) {
    return <p>Nenhum dado encontrado para este paciente.</p>;
  }

  return (
    <div className="card data-table-card">
      <div className="table-header">
        <h2>Registros do Paciente</h2>
        <button onClick={handleDownload}>Download CSV</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Freq. Cardíaca (bpm)</th>
            <th>SpO2 (%)</th>
            <th>Pressão (sys/dia mmHg)</th>
            <th>Temperatura (°C)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className={row.status === 'ALERTA' ? 'alerta-row' : ''}>
              <td>{row.timestamp}</td>
              <td>{row.hr?.toFixed(1) || 'N/A'}</td>
              <td>{row.spo2?.toFixed(1) || 'N/A'}</td>
              <td>{`${row.pressao_sys?.toFixed(0) || 'N/A'} / ${row.pressao_dia?.toFixed(0) || 'N/A'}`}</td>
              <td>{row.temp?.toFixed(1) || 'N/A'}</td>
              <td>
                <span className={`status-pill ${row.status?.toLowerCase()}`}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
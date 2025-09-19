import React from 'react';

function DataTable({ data, patientId, startTime, endTime }) {

  const handleDownload = () => {
    if (!patientId) return;

    // Constrói a URL base
    let url = `${process.env.REACT_APP_API_URL}/patients/${patientId}/download`;

    // Adiciona os parâmetros de tempo à URL se eles existirem
    const params = new URLSearchParams();
    if (startTime) params.append('start_time', startTime);
    if (endTime) params.append('end_time', endTime);

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    window.open(url);
  };

  if (!patientId) {
    return null; 
  }

  return (
    <div className="card data-table-card">
      <div className="table-header">
        <h2>
          {data.length > 0 
            ? `Exibindo ${data.length} registros` 
            : 'Nenhum registro encontrado com os filtros atuais'}
        </h2>
        <button onClick={handleDownload} disabled={data.length === 0}>
            Download CSV Filtrado
        </button>
      </div>
      {data.length > 0 && (
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
      )}
    </div>
  );
}

export default DataTable;
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import UploadForm from './components/UploadForm';
import FilterControls from './components/FilterControls'; // <-- IMPORTAR O NOVO COMPONENTE
import DataTable from './components/DataTable';

function App() {
  const [patients, setPatients] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado para os filtros
  const [selectedPatient, setSelectedPatient] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchPatients = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/patients/`);
      if (!response.ok) {
        throw new Error('Nenhum paciente encontrado. Faça o upload de um arquivo CSV.');
      }
      const data = await response.json();
      setPatients(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setPatients([]);
    }
  }, []);

  const fetchPatientData = useCallback(async () => {
    if (!selectedPatient) {
      setVitalSigns([]);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (startTime) params.append('start_time', startTime);
      if (endTime) params.append('end_time', endTime);
      
      const url = `${process.env.REACT_APP_API_URL}/patients/${selectedPatient}?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Não foi possível carregar os dados do paciente.');
      
      const data = await response.json();
      setVitalSigns(data);
    } catch (err) {
      setError(err.message);
      setVitalSigns([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPatient, startTime, endTime]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Função para lidar com a mudança de paciente
  const handlePatientChange = (patientId) => {
    setSelectedPatient(patientId);
    // Limpa os filtros de tempo e os dados da tabela ao mudar de paciente
    setStartTime('');
    setEndTime('');
    setVitalSigns([]); 
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>HealthGo | Monitoramento de Pacientes</h1>
      </header>
      <main>
        <div className="controls-container">
          <UploadForm onUploadSuccess={fetchPatients} />
          {/* Substitui os dois componentes de filtro antigos por um só */}
          <FilterControls
            patients={patients}
            selectedPatient={selectedPatient}
            onPatientChange={handlePatientChange}
            startTime={startTime}
            onStartTimeChange={setStartTime}
            endTime={endTime}
            onEndTimeChange={setEndTime}
            onApply={fetchPatientData}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {isLoading ? (
          <p>Carregando dados...</p>
        ) : (
          // A tabela só é mostrada se um paciente for selecionado
          selectedPatient && <DataTable data={vitalSigns} patientId={selectedPatient} />
        )}
      </main>
    </div>
  );
}

export default App;
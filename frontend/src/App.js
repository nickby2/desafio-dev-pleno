import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import UploadForm from './components/UploadForm';
import FilterControls from './components/FilterControls'; 
import DataTable from './components/DataTable';
import VitalSignsChart from './components/VitalSignsChart';

function App() {
  const [patients, setPatients] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handlePatientChange = (patientId) => {
    setSelectedPatient(patientId);
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
          <div className="results-container">
            {selectedPatient && vitalSigns.length > 0 && (
              <>
                <VitalSignsChart data={vitalSigns} />
                <DataTable data={vitalSigns} patientId={selectedPatient} startTime={startTime} endTime={endTime} />
              </>
            )}
            {selectedPatient && !isLoading && vitalSigns.length === 0 && (
                <p>Nenhum dado encontrado para o paciente com os filtros atuais.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
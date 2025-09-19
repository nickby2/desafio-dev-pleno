import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import UploadForm from './components/UploadForm';
import FilterControls from './components/FilterControls';
import VitalSignsChart from './components/VitalSignsChart';
import DataTable from './components/DataTable';

function App() {
  const [patients, setPatients] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isUploadVisible, setUploadVisible] = useState(false);
  const [isFiltersVisible, setFiltersVisible] = useState(true);

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
      if (statusFilter) params.append('status', statusFilter);
      
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
  }, [selectedPatient, startTime, endTime, statusFilter]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handlePatientChange = (patientId) => {
    setSelectedPatient(patientId);
    setStartTime('');
    setEndTime('');
    setVitalSigns([]); 
    setStatusFilter('');
  };
  
  const toggleUpload = () => {
    setUploadVisible(prev => !prev);
    if (isFiltersVisible) setFiltersVisible(false); 
  };

  const toggleFilters = () => {
    setFiltersVisible(prev => !prev);
    if (isUploadVisible) setUploadVisible(false); 
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>HealthGo | Monitoramento de Pacientes</h1>
          <div className="header-buttons">
            <button onClick={toggleUpload} className={isUploadVisible ? 'active' : ''}>
              Upload de Dados
            </button>
            <button onClick={toggleFilters} className={isFiltersVisible ? 'active' : ''}>
              Filtros
            </button>
          </div>
        </div>
      </header>
      <main>
        {(isUploadVisible || isFiltersVisible) && (
          <div className="controls-container">
            {isUploadVisible && <UploadForm onUploadSuccess={fetchPatients} />}
            {isFiltersVisible && (
              <FilterControls
                patients={patients}
                selectedPatient={selectedPatient}
                onPatientChange={handlePatientChange}
                startTime={startTime}
                onStartTimeChange={setStartTime}
                endTime={endTime}
                onEndTimeChange={setEndTime}
                statusFilter={statusFilter} 
                onStatusChange={setStatusFilter}
                onApply={fetchPatientData}
              />
            )}
          </div>
        )}

        <div className="results-container">
          {error && <p className="error-message">{error}</p>}
          {isLoading ? (
            <p>Carregando dados...</p>
          ) : (
            <>
              {selectedPatient && vitalSigns.length > 0 && (
                <>
                  <VitalSignsChart data={vitalSigns} />
                  <DataTable data={vitalSigns} patientId={selectedPatient} startTime={startTime} endTime={endTime}  statusFilter={statusFilter} />
                </>
              )}
              {selectedPatient && !isLoading && vitalSigns.length === 0 && (
                  <p>Nenhum dado encontrado para o paciente com os filtros atuais.</p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
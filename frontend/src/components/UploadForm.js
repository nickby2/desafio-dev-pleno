import React, { useState } from 'react';

function UploadForm({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Por favor, selecione um arquivo CSV.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/upload-csv/`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Erro ao fazer upload.');
      }

      setMessage(result.message);
      onUploadSuccess(); 
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload de Dados</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Enviando...' : 'Enviar CSV'}
      </button>
      {message && <p className="upload-message">{message}</p>}
    </div>
  );
}

export default UploadForm;

import io
import pandas as pd
from typing import List, Optional
from datetime import time

from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models, schemas
from .database import engine, get_db

# Cria as tabelas no banco de dados, caso não existam
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HealthGo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-csv/", status_code=201)
def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Formato de arquivo inválido. Por favor, envie um .csv.")

    try:
        contents = file.file.read()
        df = pd.read_csv(io.BytesIO(contents))

        required_columns = {'timestamp', 'paciente_id', 'paciente_nome', 'status'}
        if not required_columns.issubset(df.columns):
            raise HTTPException(status_code=400, detail=f"O CSV deve conter as colunas: {required_columns}")

        df['timestamp'] = pd.to_datetime(df['timestamp'], format='%H:%M:%S.%f').dt.time
        df = df.sort_values(by='timestamp')
        
        df.to_sql(models.VitalSign.__tablename__, con=engine, if_exists='append', index=False)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro ao processar o arquivo: {e}")

    return {"message": f"Arquivo '{file.filename}' processado e dados salvos com sucesso!"}


@app.get("/patients/", response_model=List[schemas.Patient])
def get_patients_list(db: Session = Depends(get_db)):
    
    # Consulta que agrupa por ID e Nome do paciente para obter registros únicos
    patients = db.query(
        models.VitalSign.paciente_id,
        models.VitalSign.paciente_nome
    ).distinct().all()

    if not patients:
        raise HTTPException(status_code=404, detail="Nenhum paciente encontrado.")
        
    return patients


@app.get("/patients/{patient_id}", response_model=List[schemas.VitalSign])
def get_patient_data(
    patient_id: str,
    db: Session = Depends(get_db),
    start_time: Optional[time] = None, 
    end_time: Optional[time] = None    
):
    
    # Inicia a consulta base
    query = db.query(models.VitalSign).filter(
        models.VitalSign.paciente_id == patient_id
    )

    # Adiciona o filtro de tempo inicial
    if start_time:
        query = query.filter(models.VitalSign.timestamp >= start_time)

    # Adiciona o filtro de tempo final
    if end_time:
        query = query.filter(models.VitalSign.timestamp <= end_time)
    
    # Executa a consulta final com ordenação
    patient_data = query.order_by(models.VitalSign.timestamp).all()
    
    if not patient_data:
        return []
        
    return patient_data
    
    patient_data = db.query(models.VitalSign).filter(
        models.VitalSign.paciente_id == patient_id
    ).order_by(models.VitalSign.timestamp).all()
    
    if not patient_data:
        raise HTTPException(status_code=404, detail="Dados não encontrados para o paciente informado.")
        
    return patient_data


@app.get("/patients/{patient_id}/download")
def download_patient_csv(
    patient_id: str,
    db: Session = Depends(get_db),
    start_time: Optional[time] = None,
    end_time: Optional[time] = None    
):

    # Inicia a consulta base, exatamente como no endpoint de visualização
    query = db.query(models.VitalSign).filter(
        models.VitalSign.paciente_id == patient_id
    )

    # Adiciona os filtros de tempo
    if start_time:
        query = query.filter(models.VitalSign.timestamp >= start_time)
    if end_time:
        query = query.filter(models.VitalSign.timestamp <= end_time)

    # Executa a consulta final
    patient_data = query.order_by(models.VitalSign.timestamp).all()

    if not patient_data:
        raise HTTPException(
            status_code=404, 
            detail="Nenhum dado encontrado para o paciente com os filtros aplicados."
        )

    df = pd.DataFrame([data.__dict__ for data in patient_data])
    df = df.drop(columns=['_sa_instance_state', 'id']) 
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=dados_{patient_id}_filtrado.csv"
    
    return response

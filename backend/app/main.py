from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import pandas as pd
import io

from . import models
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Arquivo inválido. Por favor, envie um CSV.")

    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    
    # Lógica para converter colunas e salvar no banco
    # Ordenar por timestamp como solicitado
    df['timestamp'] = pd.to_datetime(df['timestamp'], format='%H:%M:%S.%f').dt.time
    df.sort_values(by='timestamp', inplace=True)

    # Inserir dados no banco
    df.to_sql('vital_signs', con=engine, if_exists='append', index=False)
    
    return {"message": f"Arquivo '{file.filename}' processado com sucesso!"}

@app.get("/patients/{patient_id}")
def get_patient_data(patient_id: str, db: Session = Depends(get_db)):
    query = db.query(models.VitalSign).filter(models.VitalSign.paciente_id == patient_id).all()
    if not query:
        raise HTTPException(status_code=404, detail="Paciente não encontrado.")
    return query

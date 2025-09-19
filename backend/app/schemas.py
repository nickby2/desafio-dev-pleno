from pydantic import BaseModel
from datetime import time
from typing import Optional

# Schema base para os sinais vitais, com os campos comuns
class VitalSignBase(BaseModel):
    timestamp: time
    paciente_id: str
    paciente_nome: str
    paciente_cpf: Optional[str] = None   # <--- CAMPO ADICIONADO
    hr: Optional[float] = None
    spo2: Optional[float] = None
    pressao_sys: Optional[float] = None
    pressao_dia: Optional[float] = None
    temp: Optional[float] = None
    resp_freq: Optional[float] = None # <--- CAMPO ADICIONADO
    status: str

# Schema usado para ler os dados do banco de dados e retorná-los na API.
class VitalSign(VitalSignBase):
    id: int

    class Config:
        from_attributes = True # 'orm_mode' foi renomeado para 'from_attributes' no Pydantic v2

# Schema para representar a identificação única de um paciente
class Patient(BaseModel):
    paciente_id: str
    paciente_nome: str

    class Config:
        from_attributes = True
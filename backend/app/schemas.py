from pydantic import BaseModel
from datetime import time
from typing import Optional


class VitalSignBase(BaseModel):
    timestamp: time
    paciente_id: str
    paciente_nome: str
    paciente_cpf: Optional[str] = None   
    hr: Optional[float] = None
    spo2: Optional[float] = None
    pressao_sys: Optional[float] = None
    pressao_dia: Optional[float] = None
    temp: Optional[float] = None
    resp_freq: Optional[float] = None
    status: str

class VitalSign(VitalSignBase):
    id: int

    class Config:
        from_attributes = True 
class Patient(BaseModel):
    paciente_id: str
    paciente_nome: str

    class Config:
        from_attributes = True
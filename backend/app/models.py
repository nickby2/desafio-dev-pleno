from sqlalchemy import Column, Integer, String, Float, Time
# Remova a importação do DateTime, pois estamos a usar Time
# from sqlalchemy import DateTime
from .database import Base # Importe a Base do seu arquivo database.py

class VitalSign(Base):
    __tablename__ = "vital_signs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(Time) # Alterado de DateTime para Time
    paciente_id = Column(String, index=True)
    paciente_nome = Column(String)
    paciente_cpf = Column(String)   # <--- CAMPO ADICIONADO
    hr = Column(Float)
    spo2 = Column(Float)
    pressao_sys = Column(Float)
    pressao_dia = Column(Float)
    temp = Column(Float)
    resp_freq = Column(Float) # <--- CAMPO ADICIONADO
    status = Column(String)
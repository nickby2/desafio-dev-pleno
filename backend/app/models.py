from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class VitalSign(Base):
    __tablename__ = "vital_signs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime)
    paciente_id = Column(String, index=True)
    paciente_nome = Column(String)
    hr = Column(Float)
    spo2 = Column(Float)
    pressao_sys = Column(Float)
    pressao_dia = Column(Float)
    temp = Column(Float)
    status = Column(String)
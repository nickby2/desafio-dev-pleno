from sqlalchemy import Column, Integer, String, Float, Time


from .database import Base

class VitalSign(Base):
    __tablename__ = "vital_signs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(Time) 
    paciente_id = Column(String, index=True)
    paciente_nome = Column(String)
    paciente_cpf = Column(String)  
    hr = Column(Float)
    spo2 = Column(Float)
    pressao_sys = Column(Float)
    pressao_dia = Column(Float)
    temp = Column(Float)
    resp_freq = Column(Float) 
    status = Column(String)
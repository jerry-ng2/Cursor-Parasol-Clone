from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Claim(Base):
    __tablename__ = 'claims'
    id = Column(Integer, primary_key=True, index=True)
    claim_number = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False)
    client_name = Column(String, nullable=False)
    policy_number = Column(String, nullable=False)
    status = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    images = relationship('Image', back_populates='claim', cascade='all, delete-orphan')

class Image(Base):
    __tablename__ = 'images'
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey('claims.id'))
    file_path = Column(String, nullable=False)
    claim = relationship('Claim', back_populates='images') 

from sqlalchemy import Column, Integer, String, Boolean, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base

class CharacterSQL(Base):
    __tablename__ = "characters"
    
    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    name = Column(String, index=True)
    japaneseName = Column(String, nullable=True)
    age = Column(String)
    gender = Column(String)
    race = Column(String)
    job = Column(String)
    height = Column(String)
    weight = Column(String)
    origin = Column(String)
    description = Column(Text, nullable=True)
    pictures = Column(JSON)
    stats = Column(JSON)


class MonsterSQL(Base):
    __tablename__ = "monsters"
    
    monsterId = Column(UUID(as_uuid=True), primary_key=True, index=True)
    name = Column(String, index=True)
    japaneseName = Column(String, nullable=True)
    elementalAffinity = Column(String, nullable=True)
    elementalWeakness = Column(String, nullable=True)
    hitPoints = Column(Integer, nullable=True)
    manaPoints = Column(Integer, nullable=True)
    attack = Column(Integer, nullable=True)
    defense = Column(Integer, nullable=True)
    picture = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    game = Column(String, nullable=True)

class GameSQL(Base):
    __tablename__ = "games"

    gameId = Column(UUID(as_uuid=True), primary_key=True, index=True)
    title = Column(String, index=True)
    picture = Column(String)
    platform = Column(String)
    releaseDate = Column(String)
    description = Column(Text)
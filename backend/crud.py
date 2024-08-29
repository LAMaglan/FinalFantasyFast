from sqlalchemy.orm import Session
from models import CharacterSQL, MonsterSQL, GameSQL
from sqlalchemy.exc import IntegrityError
from uuid import UUID
from typing import Optional

def create_entity(db: Session, entity_class, entity_data: dict):
    try:
        entity = entity_class(**{k: (UUID(v) if k.endswith("id") else v) for k, v in entity_data.items()})
        db.add(entity)
        db.commit()
        db.refresh(entity)
        return entity
    except IntegrityError:
        db.rollback()
        return None

def create_character(db: Session, character: dict):
    return create_entity(db, CharacterSQL, character)

def create_monster(db: Session, monster: dict):
    return create_entity(db, MonsterSQL, monster)

def create_game(db: Session, game: dict):
    return create_entity(db, GameSQL, game)

def get_entities(db: Session, entity_class, **filters):
    query = db.query(entity_class)
    
    for attr, value in filters.items():
        query = query.filter(getattr(entity_class, attr).ilike(f"%{value}%"))

    return query.all()

def get_characters(db: Session, **filters):
    return get_entities(db, CharacterSQL, **filters)

def get_monsters(db: Session, **filters):
    return get_entities(db, MonsterSQL, **filters)

def get_games(db: Session):
    return db.query(GameSQL).all()
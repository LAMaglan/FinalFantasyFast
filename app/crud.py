from sqlalchemy.orm import Session
from models import CharacterSQL, MonsterSQL
from sqlalchemy.exc import IntegrityError
from uuid import UUID

def create_character(db: Session, character: dict):
    try:
        db_character = CharacterSQL(
            id=UUID(character["id"]),
            name=character["name"],
            japaneseName=character.get("japaneseName"),
            age=character["age"],
            gender=character["gender"],
            race=character["race"],
            job=character["job"],
            height=character["height"],
            weight=character["weight"],
            origin=character["origin"],
            description=character.get("description"),
            pictures=character.get("pictures"),
            stats=character.get("stats", [])
        )
        db.add(db_character)
        db.commit()
        db.refresh(db_character)
        return db_character
    except IntegrityError:
        db.rollback()
        return None

def create_monster(db: Session, monster: dict):
    try:
        db_monster = MonsterSQL(
            monsterId=UUID(monster["monsterId"]),
            name=monster["name"],
            japaneseName=monster["japaneseName"],
            elementalAffinity=monster["elementalAffinity"],
            elementalWeakness=monster["elementalWeakness"],
            hitPoints=monster["hitPoints"],
            manaPoints=monster["manaPoints"],
            attack=monster["attack"],
            defense=monster["defense"],
            picture=monster["picture"],
            description=monster["description"],
            game=monster["game"]
        )
        db.add(db_monster)
        db.commit()
        db.refresh(db_monster)
        return db_monster
    except IntegrityError:
        db.rollback()
        return None

def get_characters(db: Session):
    return db.query(CharacterSQL).all()

def get_monsters(db: Session):
    return db.query(MonsterSQL).all()


def get_characters_by_name(db: Session, name: str):
    return db.query(CharacterSQL).filter(CharacterSQL.name.ilike(f'%{name}%')).all()

def get_monsters_by_name(db: Session, name: str):
    return db.query(MonsterSQL).filter(MonsterSQL.name.ilike(f'%{name}%')).all()
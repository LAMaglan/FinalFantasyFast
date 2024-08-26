from sqlalchemy.orm import Session
from models import CharacterSQL, MonsterSQL, GameSQL
from sqlalchemy.exc import IntegrityError
from uuid import UUID
from typing import Optional

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

def create_game(db: Session, game: dict):
    try:
        db_game = GameSQL(
            gameId=UUID(game["gameId"]), # TODO: weird error - TypeERror: list indices must be integers or slices, not str..??
            title=game["title"],
            picture=game["picture"],
            platform=game["platform"],
            releaseDate=game["releaseDate"],
            description=game["description"]
        )
        db.add(db_game)
        db.commit()
        db.refresh(db_game)
        return db_game
    except IntegrityError:
        db.rollback()
        return None


def get_characters(db: Session, **filters):
    query = db.query(CharacterSQL)
    
    if 'name' in filters:
        query = query.filter(CharacterSQL.name.ilike(f"%{filters['name']}%"))
        
    if 'origin' in filters:
        query = query.filter(CharacterSQL.origin == filters['origin'])

    return query.all()


def get_monsters(db: Session, **filters):
    query = db.query(MonsterSQL)
    
    if 'name' in filters:
        query = query.filter(MonsterSQL.name.ilike(f"%{filters['name']}%"))
        
    if 'game' in filters:
        query = query.filter(MonsterSQL.game == filters['game'])

    return query.all()


def get_games(db: Session):
    return db.query(GameSQL).all()

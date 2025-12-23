"""
seed.py
--------

Populate the database with an initial set of irregular verbs suitable for a
B2 English learner.  This script is intended to be run manually (for
example via ``python app/seed.py``) or during container start-up to ensure
that the verbs table contains data.  It checks whether each verb already
exists before inserting to avoid duplicates when run multiple times.
"""

from sqlalchemy.orm import Session
from .database import SessionLocal, Base, engine
from . import models


def seed_verbs(db: Session):
    """Insert a set of irregular verbs into the database if they don't exist."""
    verbs_data = [
        {
            "infinitive": "begin",
            "past": "began",
            "participle": "begun",
            "translation": "empezar",
            "example_b2": "She began working on the project yesterday.",
        },
        {
            "infinitive": "break",
            "past": "broke",
            "participle": "broken",
            "translation": "romper",
            "example_b2": "He has broken his glasses again.",
        },
        {
            "infinitive": "bring",
            "past": "brought",
            "participle": "brought",
            "translation": "traer",
            "example_b2": "Can you bring your notes to the meeting?",
        },
        {
            "infinitive": "build",
            "past": "built",
            "participle": "built",
            "translation": "construir",
            "example_b2": "They built their house near the lake.",
        },
        {
            "infinitive": "buy",
            "past": "bought",
            "participle": "bought",
            "translation": "comprar",
            "example_b2": "I bought a new laptop last week.",
        },
        {
            "infinitive": "catch",
            "past": "caught",
            "participle": "caught",
            "translation": "atrapar",
            "example_b2": "She caught the ball effortlessly.",
        },
        {
            "infinitive": "choose",
            "past": "chose",
            "participle": "chosen",
            "translation": "elegir",
            "example_b2": "We have chosen the best candidate.",
        },
        {
            "infinitive": "come",
            "past": "came",
            "participle": "come",
            "translation": "venir",
            "example_b2": "They came to visit us during the holidays.",
        },
        {
            "infinitive": "cost",
            "past": "cost",
            "participle": "cost",
            "translation": "costar",
            "example_b2": "The repairs cost much less than expected.",
        },
        {
            "infinitive": "cut",
            "past": "cut",
            "participle": "cut",
            "translation": "cortar",
            "example_b2": "She cut her hair short for the summer.",
        },
        {
            "infinitive": "do",
            "past": "did",
            "participle": "done",
            "translation": "hacer",
            "example_b2": "Have you done your homework yet?",
        },
        {
            "infinitive": "draw",
            "past": "drew",
            "participle": "drawn",
            "translation": "dibujar",
            "example_b2": "He has drawn a beautiful picture.",
        },
        {
            "infinitive": "drink",
            "past": "drank",
            "participle": "drunk",
            "translation": "beber",
            "example_b2": "They drank coffee in the morning.",
        },
        {
            "infinitive": "drive",
            "past": "drove",
            "participle": "driven",
            "translation": "conducir",
            "example_b2": "She has driven across the country.",
        },
        {
            "infinitive": "eat",
            "past": "ate",
            "participle": "eaten",
            "translation": "comer",
            "example_b2": "We have eaten at that restaurant before.",
        },
        {
            "infinitive": "fall",
            "past": "fell",
            "participle": "fallen",
            "translation": "caer",
            "example_b2": "The leaves have fallen off the trees.",
        },
        {
            "infinitive": "feel",
            "past": "felt",
            "participle": "felt",
            "translation": "sentir",
            "example_b2": "He felt happy about his promotion.",
        },
        {
            "infinitive": "fight",
            "past": "fought",
            "participle": "fought",
            "translation": "pelear",
            "example_b2": "They fought for their rights.",
        },
        {
            "infinitive": "find",
            "past": "found",
            "participle": "found",
            "translation": "encontrar",
            "example_b2": "She found her keys under the sofa.",
        },
        {
            "infinitive": "fly",
            "past": "flew",
            "participle": "flown",
            "translation": "volar",
            "example_b2": "They flew to Paris last summer.",
        },
    ]
    for data in verbs_data:
        existing = db.query(models.Verb).filter(models.Verb.infinitive == data["infinitive"]).first()
        if not existing:
            verb = models.Verb(**data)
            db.add(verb)
    db.commit()


def main():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_verbs(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
"""
backend/scripts/seed_content.py

Manual seed script for Content Items (Articles/Guides).
Usage: 
    # From project root (where backend/ is)
    export PYTHONPATH=$PYTHONPATH:.
    python -m backend.scripts.seed_content
"""
import sys
import os
from datetime import datetime

# Simple hack to ensure backend app is importable if run from root or backend/
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from sqlalchemy.exc import IntegrityError
from app.database import SessionLocal, Base, engine
from app.models import ContentItem

def seed_content():
    print("🌱 Seeding Content Items...")
    
    # Ensure tables exist (just in case)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    items = [
        {
            "slug": "present-simple-guide",
            "title": "Mastering the Present Simple",
            "excerpt": "Learn how to use the Present Simple tense correctly in 5 minutes.",
            "body": "## The Present Simple\n\nUse this tense for habits and facts.\n\n### Examples\n- I eat breakfast.\n- She walks to school.",
            "status": "published",
            "published_at": datetime.utcnow()
        },
        {
            "slug": "past-continuous-deep-dive",
            "title": "Past Continuous Deep Dive",
            "excerpt": "Everything you need to know about what you were doing.",
            "body": "## Past Continuous\n\nAction in progress in the past.",
            "status": "published",
            "published_at": datetime.utcnow()
        },
        {
            "slug": "future-perfect-draft",
            "title": "Future Perfect (Draft)",
            "excerpt": "Draft content not visible publicy.",
            "body": "Work in progress...",
            "status": "draft",
            "published_at": None
        }
    ]

    count = 0
    for data in items:
        existing = db.query(ContentItem).filter(ContentItem.slug == data["slug"]).first()
        if existing:
            print(f"  ⏭️  Skipping existing: {data['slug']}")
            continue
        
        item = ContentItem(**data)
        db.add(item)
        try:
            db.commit()
            print(f"  ✅ Created: {data['slug']} ({data['status']})")
            count += 1
        except IntegrityError:
            db.rollback()
            print(f"  ❌ Error creating {data['slug']}")

    print(f"✨ Seeding complete. Added {count} items.")
    db.close()

if __name__ == "__main__":
    seed_content()

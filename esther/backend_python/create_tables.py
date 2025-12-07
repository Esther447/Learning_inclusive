import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from backend_python.database import Base, engine
from backend_python import models

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("SUCCESS: Database tables created successfully!")
print("\n=== New tables added ===")
print("- resources")
print("- lesson_progress")
print("- assignments")
print("- announcements")
print("- discussions")
print("- pages")
print("\nUpdated tables:")
print("- courses (added: learning_outcomes, prerequisites, duration_hours, cover_image, tags, updated_at)")
print("- lessons (added: resource_links, downloadable_files)")

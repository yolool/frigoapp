
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from db.base import Base  # This imports your Base class
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("Missing DATABASE_URL in environment variables")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Helps with DB connection stability
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():

    Base.metadata.create_all(bind=engine)
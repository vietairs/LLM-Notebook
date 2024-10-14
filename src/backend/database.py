import sqlite3
from contextlib import closing
import os

DATABASE = 'data.db'

def init_db():
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    with closing(sqlite3.connect(DATABASE)) as db:
        cursor = db.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        if tables:
            print("Database already initialized. Skipping schema execution.")
        else:
            print(f"Initializing database with schema from {schema_path}")
            with open(schema_path, mode='r') as f:
                db.cursor().executescript(f.read())
            db.commit()
            print("Database initialized.")

def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

if __name__ == '__main__':
    init_db()
    db = get_db()
    print(db.execute('SELECT * FROM notes').fetchall())
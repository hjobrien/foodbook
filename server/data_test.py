import os
import sqlite3




DEFAULT_PATH = os.path.join(os.path.dirname(__file__), 'database.sqlite3')


con = sqlite3.connect(DEFAULT_PATH)

cur = con.cursor()

cur.execute("SELECT * FROM recipies;")
print(cur.fetchall())

cur.execute("SELECT * FROM ingredients;")
print(cur.fetchall())

cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
print(cur.fetchall())
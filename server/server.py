import sqlite3
import os
from flask import Flask, request, g
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

# create a default path to connect to and create (if necessary) a database
# called 'database.sqlite3' in the same directory as this script
DEFAULT_PATH = os.path.join(os.path.dirname(__file__), 'database.sqlite3')
# DEFAULT_PATH = ":memory:"

def get_db(db_path=DEFAULT_PATH):
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(db_path)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def db_init(db_path=DEFAULT_PATH):
    con = get_db()
    c = con.cursor()
    c.execute("CREATE TABLE ingredients"\
        " (name text NOT NULL); ")
    c.execute("CREATE TABLE recipies "\
        "(name text NOT NULL PRIMARY KEY, "\
        "instructions text NOT NULL);") #should make this an id and reference external storage probably
    c.execute("CREATE TABLE recipeIngredients "\
        "(ingredientID integer NOT NULL, "\
        "recipeID integer NOT NULL, "\
        "ingredientQuantity text NOT NULL, "\
        "FOREIGN KEY (ingredientID) REFERENCES ingredients(ROWID) ON DELETE CASCADE, "\
        "FOREIGN KEY (recipeID) REFERENCES recipies(ROWID) ON DELETE CASCADE, "\
        "UNIQUE (ingredientID, recipeID));") # should add another column for ingredient quantity (and perhaps another for unit?)
    c.executemany("INSERT INTO ingredients VALUES (?)", [('foo',), ('bar',)])
    c.execute("INSERT INTO recipies VALUES (?, ?);", ("example", "mix some things and combine"))
    c.execute("INSERT INTO recipies VALUES (?, ?);", ("bread", "kneed and pray"))
    con.commit()

@app.route('/addRecipe', methods=['POST'])
def add_recipe():
    # TODO: need to handle new ingredients: to do this, just add ALL ingredients with an "IF NOT EXISTS," then add the recipe, then add the bindings in the thitd table
    data = json.loads(request.data)
    print(data)
    name, ingredients, description = data['name'], data['ingredients'], data['description']
    con = get_db()
    c = con.cursor()
    ingredients = tuple(ingredients.split(" "))
    wrappedIngredients = list(map(lambda e: (e,), ingredients))

    # FIXME 'Or ignore' is SQLite specific, so this will have to change later
    c.execute("BEGIN TRANSACTION;")
    c.executemany("INSERT OR IGNORE INTO ingredients VALUES (?);", wrappedIngredients)
    c.execute("INSERT INTO recipies VALUES (?, ?);", (name, description))
    c.execute("SELECT ROWID FROM ingredients WHERE name IN (%s);" %
                           ','.join('?'*len(ingredients)), ingredients)
    ingIDs = list(map(lambda e: e[0], c.fetchall()))
    # TODO: add recipe quantity and unit
    c.executemany('''INSERT INTO recipeIngredients VALUES (?,
    (SELECT ROWID FROM recipies WHERE name = ?),
     'notyetimplemented')''', zip(ingIDs, [name]*len(ingIDs)))
    c.execute("COMMIT TRANSACTION;")
    con.commit()
    # c.executemany("INSERT INTO recipeIngredients ")
    return {"a":"b"}
    # name = request.body.get('name')
    # description = request.body.get('description')
    # ingredients = request.body.get('ingredients')
    # conn = get_db()
    # c = conn.cursor()
    # c.executemany("INSERT INTO ingredients VALUES (?) WHERE NOT EXISTS;", ingredients[name])
    # c.execute("INSERT INTO recipies VALUES (?, ?);", (name, description))
    # c.executemany("INSERT INTO recipeIngredients VALUES "\
    #     "((SELECT ROWID FROM RECIPIES WHERE NAME = ?),"\
    #         " (SELECT ROWID FROM ingredients WHERE NAME = ?), ?);", name, ingredients[name], ingredients[name])
    # conn.commit() # might need to add this above too in case there is a race between the insert and select above

@app.route('/getFirst', methods=['GET'])
def get_first_recipes():
    con = get_db()
    c = con.cursor()
    # c.execute("SELECT * FROM recipies LIMIT ?", request.args.get("limit"))
    c.execute("SELECT * FROM recipies LIMIT 50;")
    return form_response(c.fetchall())

def form_response(query_result):
    response = {"num_entries": len(query_result)}
    response["entries"] = []
    for entry in query_result:
        response["entries"].append({"name": entry[0], "description": entry[1]})
    return json.dumps(response)

@app.route('/', methods=['GET'])
def startup():
    return "hello world"

@app.route('/init', methods=['GET'])
def init():
    con = get_db()
    db_init(con)
    return "initialized"

@app.route('/dropAll', methods=['GET'])
def drop_tables():
    con = get_db()
    cur = con.cursor()
    cur.execute("DROP TABLE recipies;")
    cur.execute("DROP TABLE ingredients;")
    cur.execute("DROP TABLE recipeIngredients;")
    con.commit()
    # con.close()
    return "dropped three tables"

@app.route('/reset', methods=['GET'])
def reset():
    try:
        drop_tables()
    except sqlite3.OperationalError:
        pass
    try:
        init()
    except sqlite3.OperationalError:
        pass

    return "reset successful"

app.run()
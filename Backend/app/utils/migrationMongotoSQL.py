import json
import os
import mysql.connector
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import json_util


load_dotenv()
 #mongodb connection
mongo_db_host = os.getenv('mongohost')
mongo_db_port = os.getenv('mongoport')
mongo_db_name = os.getenv('mongodb')
mongo_db_collection = os.getenv('mongocollection')
print(mongo_db_host)
print(mongo_db_port)
print(mongo_db_name)
print(mongo_db_collection)

mongo_connection_string = f'mongodb://{mongo_db_host}:{mongo_db_port}/{mongo_db_name}'

client= MongoClient(mongo_connection_string)

db = client[mongo_db_name]
mongo_collection = db[mongo_db_collection]

with open('data.json', 'w') as f:
    data = list(mongo_collection.find())
    json.dump(data, f, default=json_util.default)
    print(data)

#mysql connection
mysql_host = os.getenv('host')
mysql_user = os.getenv('user')
mysql_password = os.getenv('password')
mysql_db = os.getenv('database')

mysql_conn = mysql.connector.connect(
    host=mysql_host,
    user=mysql_user,
    password=mysql_password,
    database=mysql_db
)

mysql_cursor = mysql_conn.cursor()

# Creating a separate table in MySQL to store migrated data from MongoDB
mysql_cursor.execute("""
    CREATE TABLE IF NOT EXISTS mongodb_data (
        oid VARCHAR(255),
        summary TEXT,
        comments TEXT,
        images VARCHAR(255)
    )
""")

with open('data.json', 'r') as f:
    data = json.load(f)

# Inserting data into the separate table
for record in data:
    mysql_cursor.execute("""
        INSERT INTO mongodb_data (oid, summary, comments, images) 
        VALUES (%s, %s, %s, %s);
    """, (
        record['_id']['$oid'], 
        record['summary'], 
        str(record['comments']),
        str(record['images'])
    ))

# Committing changes and close MySQL connection
mysql_conn.commit()
mysql_conn.close()
print("Data migrated successfully from MongoDB to MySQL.")
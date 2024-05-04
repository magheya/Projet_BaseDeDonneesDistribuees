import os
import mysql.connector
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

 #mongodb connection
mongo_db_host = os.getenv('mongohost')
mongo_db_port = os.getenv('mongoport')
mongo_db_name = os.getenv('mongodb')

mongo_connection_string = f'mongodb://{mongo_db_host}:{mongo_db_port}/{mongo_db_name}'

client= MongoClient(mongo_connection_string)

db = client[mongo_db_name]

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

mysql_cursor = mysql_conn.cursor(dictionary=True)

#Collection for users
mysql_cursor.execute("SELECT * FROM users;")
mongo_collection_users = db['users']

rowsusers = mysql_cursor.fetchall()

for row in rowsusers : 
    row['id'] = str(row['id'])
    row['username'] = str(row['username'])
    row['email'] = str(row['email'])
    row['password_hash'] = str(row['password_hash'])
    row['created_at'] = str(row['created_at'])

    mongo_collection_users.insert_one(row)


#collection for categories
mysql_cursor.execute("SELECT * FROM categories;")
mongo_collection_categories = db['categories']

rowscategories = mysql_cursor.fetchall()

for row in rowscategories : 
    row['id'] = str(row['id'])
    row['name'] = str(row['name'])

    mongo_collection_categories.insert_one(row)


#collection for articles
mysql_cursor.execute("SELECT * FROM articles;")
mongo_collection_articles = db['articles_sql']

rowsarticles = mysql_cursor.fetchall()

for row in rowsarticles : 
    row['id'] = str(row['id'])
    row['title'] = str(row['title'])
    row['publish_date'] = str(row['publish_date'])
    row['category_id'] = str(row['category_id'])
    row['user_id'] = str(row['user_id'])
    row['content_mongodb_id'] = str(row['content_mongodb_id'])


    mongo_collection_articles.insert_one(row)

print("Data migrated successfully from MySQL to MongoDB.")

mysql_cursor.close()
mysql_conn.close()
client.close()

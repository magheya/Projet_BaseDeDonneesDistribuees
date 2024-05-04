from pymongo import MongoClient

import mysql.connector

# Connect to MySQL
mysql_conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='maria1313',
    database='relational_db'
)

# Connect to MongoDB
mongo_client = MongoClient('mongodb://localhost:27017/')
mongo_db = mongo_client['non_relational_db']
mongo_collection = mongo_db['articles']

# Fetch data from MySQL
mysql_cursor = mysql_conn.cursor()
mysql_cursor.execute('SELECT * FROM relational_db')
mysql_data = mysql_cursor.fetchall()

# Migrate data to MongoDB
for row in mysql_data:
    data = {
        'field1': row[0],
        'field2': row[1],
        # Add more fields as needed
    }
    mongo_collection.insert_one(data)

# Close connections
mysql_cursor.close()
mysql_conn.close()
mongo_client.close()
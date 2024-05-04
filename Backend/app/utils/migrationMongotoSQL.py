import pymongo

import mysql.connector

# Connect to MongoDB
mongo_client = pymongo.MongoClient('mongodb://localhost:27017')
mongo_db = mongo_client['non_relational_db']
mongo_collection = mongo_db['articles']

# Connect to MySQL
mysql_connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='maria1313',
    database='relation_db'
)
mysql_cursor = mysql_connection.cursor()

# Fetch data from MongoDB
mongo_data = mongo_collection.find()

# Iterate over MongoDB data and insert into MySQL
for document in mongo_data:
    # Extract relevant fields from the MongoDB document
    field1 = document['field1']
    field2 = document['field2']
    # ...

    # Insert data into MySQL
    mysql_cursor.execute("INSERT INTO your_mysql_table (field1, field2) VALUES (%s, %s)", (field1, field2))
    mysql_connection.commit()

# Close connections
mongo_client.close()
mysql_cursor.close()
mysql_connection.close()
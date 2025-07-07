import sqlite3, json

def get_database_schema():
    """Extract schema information from the database"""
    conn = sqlite3.connect('sample_retail.db')
    cursor = conn.cursor()

    # Get list of tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()

    schema_info = {}

    for table in tables:
        table_name = table[0]
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()

        # Format column information
        column_info = []
        for col in columns:
            column_info.append({
                'name': col[1],
                'type': col[2],
                'primary_key': bool(col[5]),
            })

        schema_info[table_name] = {
            'columns': column_info,
            'description': f"Table containing {table_name} information"
        }

    conn.close()
    return schema_info

# Get schema information
schema_info = get_database_schema()
import sqlite3, json

def get_database_schema():
    """Extract schema information from the database with sample values"""
    conn = sqlite3.connect('fisicos.db')
    cursor = conn.cursor()

    # Get list of tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()

    schema_info = {}

    for table in tables:
        table_name = table[0]
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()

        column_info = []
        for col in columns:
            column_name = col[1]
            column_type = col[2]

            # Try to get 5 distinct non-null values from the column
            cursor.execute(f"""
                SELECT DISTINCT "{column_name}" 
                FROM "{table_name}" 
                WHERE "{column_name}" IS NOT NULL 
                LIMIT 5
            """)
            examples = [row[0] for row in cursor.fetchall()]

            column_info.append({
                'name': column_name,
                'type': column_type,
                'primary_key': bool(col[5]),
                'examples': examples
            })

        schema_info[table_name] = {
            'columns': column_info,
            'description': f"Table containing {table_name} information"
        }

    conn.close()
    return schema_info

# Get schema information with examples
schema_info = get_database_schema()
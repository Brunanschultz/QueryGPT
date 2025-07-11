import sqlite3, json
from database.connection import Connection

def get_database_schema():
    """Extract schema information from the database with sample values"""
    
    db = Connection()
    if not db.connect():
        print("❌ Erro ao conectar com o banco de dados")
        return {}
    
    try:
        # Obter lista de tabelas
        tables = db.read_sql("SELECT name FROM sqlite_master WHERE type='table'")
        
        schema_info = {}
        
        # Iterar sobre as linhas do DataFrame corretamente
        for index, row in tables.iterrows():
            table_name = row['name']
            print(f"\n🔍 Processando tabela: {table_name}")
            
            # CORREÇÃO: Usar f-string para formatar a query
            columns = db.read_sql(f"PRAGMA table_info({table_name})")
            
            if columns is None or columns.empty:
                print(f"⚠️ Nenhuma coluna encontrada para tabela {table_name}")
                continue
                
            column_info = []
            
            # Iterar sobre as colunas corretamente
            for col_index, col_row in columns.iterrows():
                column_name = col_row['name']  # Usar nome da coluna
                column_type = col_row['type']
                is_primary_key = bool(col_row['pk'])
                
                # Obter exemplos de valores da coluna
                try:
                    sample_query = f"""
                        SELECT DISTINCT "{column_name}" 
                        FROM "{table_name}" 
                        WHERE "{column_name}" IS NOT NULL 
                        LIMIT 5
                    """
                    samples = db.read_sql(sample_query)
                    
                    if samples is not None and not samples.empty:
                        examples = samples[column_name].tolist()
                    else:
                        examples = []
                        
                except Exception as e:
                    print(f"    ⚠️ Erro ao obter exemplos para {column_name}: {e}")
                    examples = []
                
                column_info.append({
                    'name': column_name,
                    'type': column_type,
                    'primary_key': is_primary_key,
                    'examples': examples
                })
            
            schema_info[table_name] = {
                'columns': column_info,
                'description': f"Table containing {table_name} information"
            }
            
        return schema_info
        
    except Exception as e:
        print(f"❌ Erro ao processar schema: {e}")
        return {}
    finally:
        db.disconnect()

# # Get schema information with examples
schema_info = get_database_schema()

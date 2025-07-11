
from src.database.connection import Connection

try:
        db = Connection()
        if db.connect():
            df = db.read_sql("SELECT * FROM fisicos LIMIT 5")
            print("\n🚀 Query executada com sucesso. Primeiros cinco resultados:")
            print(df.head(5))
            db.disconnect()
except Exception as e:
        print(f"\n❌ Query falhou: {str(e)}")
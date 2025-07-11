import sqlite3
import pandas as pd
from typing import List, Dict, Any, Optional
import os
class Connection:
    def __init__(self, db_path: str = None):
        """
        Inicializa a conexão com o banco SQLite
        
        Args:
            db_path (str): Caminho para o arquivo do banco de dados
        """
        if db_path is None:
            # Obter o diretório onde está o connection.py
            current_dir = os.path.dirname(os.path.abspath(__file__))
            # Caminho para o fisicos.db na mesma pasta
            self.db_path = os.path.join(current_dir, "fisicos.db")
        else:
            # Se não é caminho absoluto, assumir que está na pasta database
            if not os.path.isabs(db_path):
                current_dir = os.path.dirname(os.path.abspath(__file__))
                self.db_path = os.path.join(current_dir, db_path)
            else:
                self.db_path = db_path
        
        print(f"📂 Caminho do banco: {self.db_path}")
        print(f"📁 Arquivo existe: {os.path.exists(self.db_path)}")
        
        self.connection = None
        self.cursor = None
    
    def connect(self) -> bool:
        """
        Estabelece conexão com o banco de dados
        
        Returns:
            bool: True se conexão foi estabelecida com sucesso
        """
        try:
            self.connection = sqlite3.connect(self.db_path)
            self.connection.row_factory = sqlite3.Row
            self.cursor = self.connection.cursor()
            return True
        except sqlite3.Error as e:
            print(f"Erro ao conectar com o banco: {e}")
            return False
    
    def disconnect(self):
        """
        Fecha a conexão com o banco de dados
        """
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
    
    # Métodos originais mantidos para compatibilidade
    def execute_query(self, query: str, params: tuple = ()) -> Optional[List[Dict]]:
        """
        Executa uma query SELECT e retorna os resultados como lista de dicionários
        
        Args:
            query (str): Query SQL para executar
            params (tuple): Parâmetros para a query
            
        Returns:
            List[Dict]: Lista de dicionários com os resultados
        """
        try:
            self.cursor.execute(query, params)
            rows = self.cursor.fetchall()
            return [dict(row) for row in rows]
        except sqlite3.Error as e:
            print(f"Erro ao executar query: {e}")
            return None
    
    # NOVOS MÉTODOS PARA PANDAS DataFrame
    def query_to_dataframe(self, query: str, params: tuple = ()) -> Optional[pd.DataFrame]:
        """
        Executa uma query SELECT e retorna os resultados como pandas DataFrame
        
        Args:
            query (str): Query SQL para executar
            params (tuple): Parâmetros para a query
            
        Returns:
            pd.DataFrame: DataFrame com os resultados
        """
        try:
            df = pd.read_sql_query(query, self.connection, params=params)
            return df
        except (sqlite3.Error, pd.errors.DatabaseError) as e:
            print(f"Erro ao executar query: {e}")
            return None
    
    def read_sql(self, query: str, params: tuple = ()) -> Optional[pd.DataFrame]:
        """
        Alias para query_to_dataframe - compatível com seu padrão atual
        
        Args:
            query (str): Query SQL para executar
            params (tuple): Parâmetros para a query
            
        Returns:
            pd.DataFrame: DataFrame com os resultados
        """
        return self.query_to_dataframe(query, params)
    
    def table_to_dataframe(self, table_name: str, columns: str = "*", 
                          where_clause: str = "", params: tuple = ()) -> Optional[pd.DataFrame]:
        """
        Retorna uma tabela completa como DataFrame
        
        Args:
            table_name (str): Nome da tabela
            columns (str): Colunas a serem selecionadas (padrão: "*")
            where_clause (str): Cláusula WHERE opcional
            params (tuple): Parâmetros para a cláusula WHERE
            
        Returns:
            pd.DataFrame: DataFrame com os dados da tabela
        """
        query = f"SELECT {columns} FROM {table_name}"
        if where_clause:
            query += f" WHERE {where_clause}"
        
        return self.query_to_dataframe(query, params)
    
    # Métodos originais mantidos
    def execute_command(self, command: str, params: tuple = ()) -> bool:
        """
        Executa comandos INSERT, UPDATE, DELETE
        
        Args:
            command (str): Comando SQL para executar
            params (tuple): Parâmetros para o comando
            
        Returns:
            bool: True se comando foi executado com sucesso
        """
        try:
            self.cursor.execute(command, params)
            self.connection.commit()
            return True
        except sqlite3.Error as e:
            print(f"Erro ao executar comando: {e}")
            self.connection.rollback()
            return False
    
    def execute_many(self, command: str, params_list: List[tuple]) -> bool:
        """
        Executa múltiplos comandos de uma vez
        
        Args:
            command (str): Comando SQL para executar
            params_list (List[tuple]): Lista de parâmetros para cada comando
            
        Returns:
            bool: True se todos os comandos foram executados com sucesso
        """
        try:
            self.cursor.executemany(command, params_list)
            self.connection.commit()
            return True
        except sqlite3.Error as e:
            print(f"Erro ao executar múltiplos comandos: {e}")
            self.connection.rollback()
            return False
    
    def dataframe_to_sql(self, df: pd.DataFrame, table_name: str, 
                        if_exists: str = "replace", index: bool = False) -> bool:
        """
        Salva um DataFrame diretamente no banco
        
        Args:
            df (pd.DataFrame): DataFrame para salvar
            table_name (str): Nome da tabela
            if_exists (str): 'fail', 'replace', ou 'append'
            index (bool): Se deve incluir o índice
            
        Returns:
            bool: True se operação foi bem-sucedida
        """
        try:
            df.to_sql(table_name, self.connection, if_exists=if_exists, index=index)
            return True
        except Exception as e:
            print(f"Erro ao salvar DataFrame: {e}")
            return False
    
    def create_table(self, table_name: str, columns: Dict[str, str]) -> bool:
        """
        Cria uma tabela no banco de dados
        
        Args:
            table_name (str): Nome da tabela
            columns (Dict[str, str]): Dicionário com nome_coluna: tipo_dados
            
        Returns:
            bool: True se tabela foi criada com sucesso
        """
        columns_str = ", ".join([f"{col} {dtype}" for col, dtype in columns.items()])
        command = f"CREATE TABLE IF NOT EXISTS {table_name} ({columns_str})"
        return self.execute_command(command)
    
    def table_exists(self, table_name: str) -> bool:
        """
        Verifica se uma tabela existe no banco
        
        Args:
            table_name (str): Nome da tabela
            
        Returns:
            bool: True se a tabela existe
        """
        query = "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
        result = self.execute_query(query, (table_name,))
        return len(result) > 0 if result else False
    
    def get_last_insert_id(self) -> int:
        """
        Retorna o ID do último registro inserido
        
        Returns:
            int: ID do último registro inserido
        """
        return self.cursor.lastrowid
    
    def __enter__(self):
        """Context manager - entrada"""
        self.connect()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager - saída"""
        self.disconnect()


import google.generativeai as genai
from typing import Dict, Any
import json
import os


class AnswerAgent:
    def __init__(self, api_key: str = None):
        """
        Inicializa o agente com Google Gemini
        
        Args:
            api_key (str): Chave da API do Google Gemini
        """
        genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

        # Set up the model with generation config
        generation_config = {
            "temperature": 0.1,
            "response_mime_type": "application/json", # Ensures the output is valid JSON
        }
        self.model = genai.GenerativeModel(
            'gemini-2.0-flash',
            generation_config=generation_config
        )
        
    def processar_consulta(self, consulta_usuario: str, dados_resultado: Dict[str, Any]) -> str:
        """
        Processa a consulta do usuário e dados para gerar resposta em linguagem natural
        
        Args:
            consulta_usuario (str): Pergunta original do usuário
            dados_resultado (Dict): Dados estruturados com o resultado
            
        Returns:
            str: Resposta em linguagem natural
        """
        try:
            # Preparar o prompt para o Gemini
            prompt = self._criar_prompt(consulta_usuario, dados_resultado)
            
            # Gerar resposta usando Gemini
            response = self.model.generate_content(prompt)
            
            # Processar e limpar a resposta
            resposta_processada = self._processar_resposta(response.text)

            response_dict = json.loads(resposta_processada)

            valor = list(response_dict.values())[0]
           
            return valor
            
        except Exception as e:
            return f"Erro ao processar consulta: {str(e)}"
    
    def _criar_prompt(self, consulta: str, dados: Dict[str, Any]) -> str:
        """
        Cria o prompt estruturado para o Gemini
        
        Args:
            consulta (str): Consulta do usuário
            dados (Dict): Dados estruturados
            
        Returns:
            str: Prompt formatado
        """
        prompt = f"""
            Você é um analista de dados especializado em telecomunicações que deve responder perguntas de forma clara e profissional.

            CONSULTA DO USUÁRIO:
            {consulta}

            DADOS OBTIDOS:
            {json.dumps(dados, indent=2)}

            INSTRUÇÕES:
            1. Analise a consulta do usuário e os dados fornecidos
            2. Identifique o valor principal nos dados (normalmente um percentual)
            3. Crie uma resposta clara e concisa em português brasileiro
            4. A resposta deve ser direta e informativa
            5. Inclua o valor numérico de forma destacada
            6. Se houver contexto temporal ou segmentação, mencione-os
            7. Mantenha um tom profissional mas acessível

            FORMATO DA RESPOSTA:
            - Responda diretamente à pergunta
            - Destaque o valor principal
            - Adicione contexto quando relevante
            - Máximo de 2-3 frases

            Resposta:
            """
        return prompt
    
    def _processar_resposta(self, resposta_bruta: str) -> str:
        """
        Processa e limpa a resposta do Gemini
        
        Args:
            resposta_bruta (str): Resposta bruta do modelo
            
        Returns:
            str: Resposta processada
        """
        # Remover possíveis quebras de linha extras
        resposta = resposta_bruta.strip()
        
        # Remover prefixos como "Resposta:" se existirem
        if resposta.startswith("Resposta:"):
            resposta = resposta.replace("Resposta:", "").strip()
        
        return resposta


# teste = AnswerAgent()

# print(teste.processar_consulta("quais os principais produtos do estado RS em janeiro de 2025?","{'DS_PRODUTO': {0: 'TERMINAL', 1: 'M2M', 2: 'VOZ AVANÇADA', 3: 'BANDA LARGA', 4: 'PEN'}}"))

# print(teste.processar_consulta("Qual o churn médio de banda larga do segmento One no primeiro Tri de 2025 ?","{'resultado_percentual': {0: 1.33}}"))
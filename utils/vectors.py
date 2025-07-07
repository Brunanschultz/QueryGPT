from sentence_transformers import SentenceTransformer


class QueryVectorizer:
    def __init__(self):
        # Initialize the sentence transformer model for vectorization
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def vectorize(self, text):
        """Convert text to embeddings vector"""
        return self.model.encode(text)

    def bulk_vectorize(self, texts):
        """Vectorize multiple texts"""
        return self.model.encode(texts)




import json
import re
from pathlib import Path
from typing import List, Optional
from backend.app.core.config import DATA_DIR
from backend.app.schemas.ai import RAGSourceItem

KB_DIR = DATA_DIR / "knowledge_base"


class RAGEngine:
    """
    Lightweight, modular Retrieval-Augmented Generation (RAG) engine.
    Indexes authoritative circular IT, repair, sanitization, and e-waste guidance.
    Preserves full source attribution metadata for explainable recommendations.
    """

    def __init__(self, kb_path: Path = KB_DIR):
        self.kb_path = kb_path
        self._documents: List[dict] = []
        self.load_knowledge_base()

    def load_knowledge_base(self):
        """Loads and indexes all JSON documents in the knowledge base directory."""
        self._documents = []
        if not self.kb_path.exists():
            return

        for file_path in self.kb_path.glob("*.json"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    category = data.get("category", "general")
                    docs = data.get("documents", [])
                    for doc in docs:
                        doc["category"] = category
                        self._documents.append(doc)
            except Exception as e:
                # Silently continue if single file parse issue
                pass

    def retrieve_relevant_knowledge(
        self,
        query: str,
        category: Optional[str] = None,
        top_k: int = 3,
    ) -> List[RAGSourceItem]:
        """
        Retrieves top-k relevant knowledge chunks using normalized token overlap
        and keyword matching against document titles, keywords, and excerpts.
        """
        if not self._documents:
            self.load_knowledge_base()

        query_tokens = set(re.findall(r"\w+", query.lower()))
        results = []

        for doc in self._documents:
            if category and doc.get("category") != category:
                continue

            doc_keywords = set([k.lower() for k in doc.get("keywords", [])])
            title_tokens = set(re.findall(r"\w+", doc.get("source_title", "").lower()))
            excerpt_tokens = set(re.findall(r"\w+", doc.get("excerpt", "").lower()))

            # Scoring: Keyword overlap gets high weight, title overlap medium, excerpt overlap baseline
            keyword_overlap = len(query_tokens.intersection(doc_keywords))
            title_overlap = len(query_tokens.intersection(title_tokens))
            excerpt_overlap = len(query_tokens.intersection(excerpt_tokens))

            raw_score = (keyword_overlap * 3.0) + (title_overlap * 2.0) + (excerpt_overlap * 0.5)

            if raw_score > 0:
                # Normalize score between 0.50 and 0.99
                normalized_score = min(0.99, 0.50 + (raw_score / 20.0))
                results.append(
                    RAGSourceItem(
                        source_id=doc["source_id"],
                        source_title=doc["source_title"],
                        excerpt=doc["excerpt"],
                        category=doc["category"],
                        relevance_score=round(normalized_score, 2),
                    )
                )

        # Sort by relevance score descending
        results.sort(key=lambda r: r.relevance_score, reverse=True)

        # If no specific matches, return top authoritative foundational document
        if not results and self._documents:
            fallback = self._documents[0]
            results.append(
                RAGSourceItem(
                    source_id=fallback["source_id"],
                    source_title=fallback["source_title"],
                    excerpt=fallback["excerpt"],
                    category=fallback["category"],
                    relevance_score=0.50,
                )
            )

        return results[:top_k]


# Singleton instance
rag_engine = RAGEngine()

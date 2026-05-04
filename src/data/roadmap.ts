import type { RoadmapItem } from '@/types';

export const roadmap: RoadmapItem[] = [
  {
    topic: 'Python (advanced)',
    status: 'done',
    reflection: 'Daily driver for data engineering and AI tooling.',
  },
  {
    topic: 'Prompt Engineering fundamentals',
    status: 'done',
    reflection: 'Use it daily inside engineering workflows for code, docs and validation.',
  },
  {
    topic: 'n8n workflow automation',
    status: 'done',
    reflection: 'Comfortable wiring multi-step automations with HITL checkpoints.',
  },
  {
    topic: 'LLM fundamentals (tokens, context windows, sampling)',
    status: 'learning',
    resource: { label: 'Anthropic prompting docs', href: 'https://docs.anthropic.com' },
  },
  {
    topic: 'Retrieval-Augmented Generation (RAG)',
    status: 'learning',
    resource: { label: 'LangChain RAG guide', href: 'https://python.langchain.com' },
  },
  {
    topic: 'LangChain & LangGraph',
    status: 'learning',
  },
  {
    topic: 'Vector databases (Chroma, pgvector, Qdrant)',
    status: 'learning',
  },
  {
    topic: 'Agentic systems & tool use',
    status: 'next',
  },
  {
    topic: 'Evaluation frameworks (LLM-as-judge, golden sets)',
    status: 'next',
  },
  {
    topic: 'MLOps for LLM apps (observability, cost, latency)',
    status: 'next',
  },
  {
    topic: 'Fine-tuning fundamentals (LoRA, instruction-tuning)',
    status: 'next',
  },
];

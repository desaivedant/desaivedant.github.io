import type { Skill, SkillCategory } from '@/types';

export const skillCategoryLabels: Record<SkillCategory, string> = {
  data: 'Data Engineering',
  languages: 'Languages',
  ai: 'AI / ML',
  cloud: 'Cloud',
  tools: 'Tools',
};

export const skillCategoryColors: Record<SkillCategory, string> = {
  data: '#6366f1',
  languages: '#8b5cf6',
  ai: '#f59e0b',
  cloud: '#06b6d4',
  tools: '#10b981',
};

export const skills: Skill[] = [
  // Data Engineering
  { name: 'Microsoft Fabric', category: 'data', proficiency: 90 },
  { name: 'Apache Spark', category: 'data', proficiency: 85 },
  { name: 'PySpark', category: 'data', proficiency: 88 },
  { name: 'Delta Lake', category: 'data', proficiency: 85 },
  { name: 'Medallion Architecture', category: 'data', proficiency: 85 },
  { name: 'Azure Synapse', category: 'data', proficiency: 80 },
  { name: 'Databricks', category: 'data', proficiency: 75 },
  { name: 'Azure Data Factory', category: 'data', proficiency: 85 },
  { name: 'SSIS', category: 'data', proficiency: 75 },
  { name: 'Tableau', category: 'data', proficiency: 70 },

  // Languages
  { name: 'Python', category: 'languages', proficiency: 88 },
  { name: 'SQL', category: 'languages', proficiency: 92 },
  { name: 'T-SQL', category: 'languages', proficiency: 88 },
  { name: 'JavaScript', category: 'languages', proficiency: 50 },

  // AI / ML (learning)
  { name: 'LLMs', category: 'ai', proficiency: 55 },
  { name: 'RAG', category: 'ai', proficiency: 50 },
  { name: 'LangChain', category: 'ai', proficiency: 45 },
  { name: 'LangGraph', category: 'ai', proficiency: 40 },
  { name: 'Vector DBs', category: 'ai', proficiency: 45 },
  { name: 'Prompt Engineering', category: 'ai', proficiency: 70 },
  { name: 'n8n', category: 'ai', proficiency: 60 },

  // Cloud
  { name: 'Azure', category: 'cloud', proficiency: 85 },
  { name: 'Microsoft Fabric', category: 'cloud', proficiency: 90 },
  { name: 'DigitalOcean', category: 'cloud', proficiency: 60 },

  // Tools
  { name: 'Git', category: 'tools', proficiency: 85 },
  { name: 'Azure DevOps', category: 'tools', proficiency: 85 },
  { name: 'GitHub Actions', category: 'tools', proficiency: 70 },
  { name: 'Power Apps', category: 'tools', proficiency: 65 },
];

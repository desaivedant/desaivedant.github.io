import type { Certification, EducationEntry } from '@/types';

export const profile = {
  name: 'Vedant Desai',
  title: 'Data Engineer',
  targetTitle: 'AI Engineer',
  location: 'Vadodara, Gujarat, India',
  email: 'vedantdesai942000@gmail.com',
  taglines: [
    'Data Engineer.',
    'AI Engineer in the making.',
    'Builder of intelligent pipelines.',
  ],
  primaryTagline: 'Engineering data today. Engineering intelligence tomorrow.',
  subTagline: 'Azure · Fabric · Databricks · Scalable ETL · AI-Enabled Engineering',
  summary: `Data Engineer with four years of experience designing and automating cloud-based data pipelines that turn complex datasets into reliable insights. Expertise spans Microsoft Fabric, Azure Synapse, Databricks, ADF and Delta Lake. Currently transitioning into AI Engineering — integrating LLMs, RAG and agentic workflows into the data platforms I build.`,
  yearsInDataEngineering: 4,
} as const;

export const certifications: Certification[] = [
  {
    name: 'Microsoft Certified: Azure Data Engineer Associate',
    issuer: 'Microsoft',
    issued: 'Mar 2024',
    expires: 'Mar 2026',
    credentialId: '78B293F8D12237E5',
    skills: ['Azure Databricks', 'Azure Data Factory', 'Synapse', 'Delta Lake', 'PySpark', 'SQL', 'ADLS Gen2', 'Stream Analytics'],
    featured: true,
  },
  {
    name: 'Microsoft Certified: Azure Data Fundamentals',
    issuer: 'Microsoft',
    issued: 'Feb 2023',
    credentialId: '6ED503B8DA3E2702',
    skills: ['PySpark', 'Azure Databricks', 'SQL', 'Cosmos DB', 'Synapse', 'Data Lake'],
    featured: true,
  },
  {
    name: 'SQL (Intermediate)',
    issuer: 'HackerRank',
    issued: 'Feb 2022',
    credentialId: 'FCF8C842CFB8',
    skills: ['T-SQL', 'SQL Server Management Studio'],
  },
  {
    name: 'MongoDB M001: MongoDB Basics',
    issuer: 'MongoDB',
    issued: 'Mar 2021',
    credentialId: '7ae27ef1-4624-40c6-b6ea-d79f220',
    skills: ['NoSQL', 'MongoDB'],
  },
  {
    name: 'Python Data Structures',
    issuer: 'University of Michigan',
    issued: 'May 2020',
    credentialId: 'FM9YPM5A8RF4',
    skills: ['Python'],
  },
];

export const education: EducationEntry[] = [
  {
    institution: 'Charotar University of Science and Technology',
    degree: 'Master of Computer Applications (MCA), Computer Science',
    start: 'Apr 2020',
    end: 'May 2022',
  },
  {
    institution: 'Veer Narmad South Gujarat University, Surat',
    degree: 'Bachelor of Computer Application (BCA), Computer Science',
    start: '2017',
    end: '2020',
  },
];

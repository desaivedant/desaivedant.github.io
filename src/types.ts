export type SkillCategory = 'data' | 'languages' | 'ai' | 'cloud' | 'tools';

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: number;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  start: string;
  end: string | 'Present';
  location: string;
  bullets: string[];
  tech: string[];
  current?: boolean;
  future?: boolean;
}

export type ProjectStatus = 'shipped' | 'ongoing' | 'case-study';

export interface Project {
  slug: string;
  title: string;
  pitch: string;
  problem: string;
  approach: string;
  outcome: string;
  tech: string[];
  status: ProjectStatus;
  links?: { label: string; href: string }[];
  featured?: boolean;
}

export type RoadmapStatus = 'done' | 'learning' | 'next';

export interface RoadmapItem {
  topic: string;
  status: RoadmapStatus;
  resource?: { label: string; href: string };
  reflection?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'twitter' | 'mail';
}

export interface Certification {
  name: string;
  issuer: string;
  issued: string;
  expires?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills?: string[];
  featured?: boolean;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  start: string;
  end: string;
}

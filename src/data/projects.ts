import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'medallion-fabric-ml',
    title: 'Medallion Architecture for ML/AI Workloads',
    pitch: 'Bronze → Silver → Gold pipelines in Microsoft Fabric, feeding curated feature sets into ML training and Power Apps.',
    problem:
      'Raw data was scattered across enterprise systems with inconsistent quality, blocking both BI and ML model training.',
    approach:
      'Architected a multi-stage Medallion Architecture inside Microsoft Fabric — Bronze for raw landing, Silver for cleansed and conformed entities, Gold for analytics- and ML-ready marts. Built Lakehouses and Data Warehouses to standardize processing and integrate cleanly with downstream consumers.',
    outcome:
      'Predictive models train on reliable, feature-rich datasets. Business users get Gold-layer data inside Power Apps without waiting on hand-built reports.',
    tech: ['Microsoft Fabric', 'Lakehouse', 'Data Warehouse', 'PySpark', 'Delta Lake', 'Power Apps'],
    status: 'ongoing',
    featured: true,
  },
  {
    slug: 'd365-financial-etl',
    title: 'D365 Financial ETL Automation',
    pitch: 'End-to-end Fabric pipelines for financial and insurance data into D365 — 60% less manual effort.',
    problem:
      'Financial and insurance data was being moved into D365 via brittle, partially-manual processes with significant operational overhead.',
    approach:
      'Designed and shipped end-to-end ETL automation in Microsoft Fabric. Replaced manual steps with metadata-driven pipelines, added schema validation and added Spark tuning for performance.',
    outcome:
      'Operational effort dropped ~60%. Earned Premium, Contract and Claims data in the EDW became materially more accurate. Pipelines run ~30% faster after partitioning and Spark-tuning work.',
    tech: ['Microsoft Fabric', 'PySpark', 'Delta Lake', 'D365', 'Azure DevOps'],
    status: 'shipped',
    featured: true,
  },
  {
    slug: 'metadata-etl-framework',
    title: 'Metadata-Driven Reusable ETL Framework',
    pitch: 'A config-driven framework that turned new-pipeline setup from days into hours.',
    problem:
      'Each new data source required a bespoke pipeline. Setup times were long, code was duplicated, and maintenance scaled poorly.',
    approach:
      'Built a metadata-driven framework in PySpark + Delta Lake + Fabric Pipelines. Source configuration, transforms and load targets are declared in metadata; the engine handles ingestion, validation and logging generically.',
    outcome:
      'Cut new-pipeline setup time by ~40%. Reusable templates were adopted across the team, making onboarding and audits substantially easier.',
    tech: ['PySpark', 'Delta Lake', 'Fabric Pipelines', 'Metadata Engine'],
    status: 'shipped',
    featured: true,
  },
  {
    slug: 'quick-issue-etl-debug',
    title: 'Quick Issue Sales ETL — Root Cause Investigation',
    pitch: 'Tracked a fare-rounding bug across SSIS + SQL Server + Tableau back to a single ROUND() call in a stored procedure.',
    problem:
      'Quick-issue ticket sales totals were drifting in Tableau dashboards. Numbers looked right per row but aggregates were off by small amounts that compounded over time.',
    approach:
      'Walked the data backward from Tableau Hyper extracts → reporting tables → stored procedures. Isolated a `ROUND(..., 2)` call in the fare-splitting logic that, when applied per-leg before summing, accumulated rounding errors at the aggregate level.',
    outcome:
      'Moved rounding to the reporting boundary instead of mid-calculation. Aggregates reconciled to source. A clean case study in why early rounding is dangerous in financial pipelines.',
    tech: ['SSIS', 'SQL Server', 'T-SQL', 'Tableau', 'Hyper'],
    status: 'case-study',
    featured: false,
  },
];

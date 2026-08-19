// AWS Curriculum — Part 3: S3, RDS, Lambda, API Gateway

import type { Module } from "./curriculum";

export const s3Module: Module = {
  id: "s3",
  title: "Amazon S3 — Simple Storage Service",
  short: "S3",
  description: "Object storage for the internet. The most-used AWS service — used for files, backups, websites, data lakes, and more.",
  category: "storage",
  icon: "Database",
  color: "aws-emerald",
  level: "intermediate",
  totalLessons: 5,
  estimatedHours: 4,
  lessons: [
    {
      id: "s3-intro",
      title: "S3 Fundamentals — Buckets, Objects, Keys",
      level: "beginner",
      duration: 22,
      xp: 15,
      summary: "S3 is object storage — perfect for files, images, backups, and data lakes. Learn the core mental model.",
      content: [
        { type: "paragraph", text: "Amazon S3 stores objects (files) in buckets (containers). Each object has a key (its path/name) and can be up to 5 TB. S3 is infinitely scalable — there's no 'full' — and is designed for 99.999999911% durability (your data is replicated across multiple facilities automatically). It's the backbone of AWS storage." },
        { type: "list", items: [
          "Bucket — a top-level container. Names are globally unique (all of AWS).",
          "Object — a file plus metadata. Up to 5 TB each.",
          "Key — the object's full path/name within the bucket.",
          "Region — buckets live in a specific AWS region (with global namespace).",
          "URL format — https://<bucket>.s3.<region>.amazonaws.com/<key>",
        ]},
        { type: "code", language: "bash", code: `# Create a bucket (names must be globally unique)
aws s3api create-bucket \\
  --bucket my-company-documents-prod \\
  --region us-east-1 \\
  --create-bucket-configuration LocationConstraint=us-east-1

# Upload a file
aws s3 cp report.pdf s3://my-company-documents-prod/2026/q3/report.pdf

# List objects in a 'folder' (S3 has no real folders — just key prefixes)
aws s3 ls s3://my-company-documents-prod/2026/q3/

# Download
aws s3 cp s3://my-company-documents-prod/2026/q3/report.pdf ./local-report.pdf

# Delete
aws s3 rm s3://my-company-documents-prod/2026/q3/report.pdf`, caption: "Basic S3 operations with the AWS CLI." },
        { type: "callout", variant: "warning", title: "Block Public Access by default", text: "As of 2023, new S3 buckets block public access by default — a major security improvement. If you need public objects, you must explicitly disable this block AND add a bucket policy or object ACL. Never make a bucket public 'just to test' and forget — it's a leading cause of data breaches." },
        { type: "keyTakeaways", items: [
          "S3 = object storage with infinite scale and 11 nines durability.",
          "Bucket = global unique name; Key = object path.",
          "S3 has no real folders — just key prefixes with / separators.",
          "Block Public Access is on by default — keep it that way unless you have a reason.",
        ]},
      ],
    },
    {
      id: "s3-storage-classes",
      title: "Storage Classes and Lifecycle Policies",
      level: "intermediate",
      duration: 25,
      xp: 15,
      summary: "Six storage classes from frequent access to deep archive. Match the class to the access pattern and save 80%+.",
      content: [
        { type: "paragraph", text: "S3 offers six storage classes, each optimized for different access patterns. Choosing the right class can cut your S3 bill by 80% or more — but choosing wrong (e.g., Glacier for hot data) means slow access and retrieval fees. Lifecycle policies automate transitions between classes." },
        { type: "comparison", columns: ["Class", "Use case", "Retrieval time", "Cost (vs Standard)"], rows: [
          { label: "Standard", values: ["Frequently accessed data", "Milliseconds", "1x"] },
          { label: "Intelligent-Tiering", values: ["Unknown/unknown access patterns", "Milliseconds (frequent tier)", "Small monitoring fee"] },
          { label: "Standard-IA", values: ["Infrequent but fast access needed", "Milliseconds", "~50% cheaper"] },
          { label: "One-Zone-IA", values: ["Infrequent, non-critical data", "Milliseconds", "~70% cheaper"] },
          { label: "Glacier Instant Retrieval", values: ["Long-lived, rarely accessed", "Milliseconds", "~68% cheaper"] },
          { label: "Glacier Flexible", values: ["Archives, minutes-hours OK", "1-5 minutes (expedited) or hours", "~80% cheaper"] },
          { label: "Glacier Deep Archive", values: ["Compliance archives", "12 hours", "~95% cheaper"] },
        ]},
        { type: "code", language: "json", code: `{
  "Rules": [
    {
      "ID": "Move-to-IA-then-Archive",
      "Status": "Enabled",
      "Transitions": [
        { "Days": 30, "StorageClass": "STANDARD_IA" },
        { "Days": 90, "StorageClass": "GLACIER" },
        { "Days": 365, "StorageClass": "DEEP_ARCHIVE" }
      ],
      "Expiration": { "Days": 2555 },
      "Filter": { "Prefix": "logs/" }
    }
  ]
}`, caption: "Lifecycle policy: logs/ → Standard after 30d → IA → Glacier after 90d → Deep Archive after 1y → delete after 7y." },
        { type: "keyTakeaways", items: [
          "Six storage classes, optimized for different access patterns.",
          "Match access pattern to class — wrong choice wastes money.",
          "Lifecycle policies automate class transitions and expiration.",
          "Glacier Deep Archive is ~95% cheaper than Standard — use for compliance archives.",
        ]},
      ],
    },
    {
      id: "s3-security",
      title: "S3 Security — Bucket Policies, ACLs, Encryption",
      level: "advanced",
      duration: 30,
      xp: 25,
      summary: "Securing S3 properly: bucket policies, IAM vs resource policies, KMS encryption, presigned URLs.",
      content: [
        { type: "paragraph", text: "S3 access can be controlled by IAM policies (identity-based) or bucket policies (resource-based), or both. For cross-account access, you need a bucket policy. For same-account access, IAM is usually enough. Most S3 security mistakes come from misunderstanding this interaction." },
        { type: "code", language: "json", code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCrossAccountRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::999999999999:root"
      },
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::my-shared-bucket/*"
    },
    {
      "Sid": "DenyUnencryptedObjectUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::my-shared-bucket/*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": "aws:kms"
        }
      }
    }
  ]
}`, caption: "Bucket policy: allow cross-account read; deny uploads not encrypted with KMS." },
        { type: "list", items: [
          "Bucket policy — resource-based policy attached directly to the bucket.",
          "ACL — legacy access control list; avoid for new buckets, use policies instead.",
          "SSE-S3 — server-side encryption with S3-managed keys (default).",
          "SSE-KMS — server-side encryption with AWS KMS keys (more control, audit trail).",
          "SSE-C — server-side encryption with customer-provided keys.",
          "Presigned URL — time-limited URL granting temporary access to a private object.",
          "Block Public Access — account/bucket setting that overrides everything else.",
        ]},
        { type: "callout", variant: "danger", title: "Most S3 breaches are misconfigured buckets", text: "Public buckets left readable or writable have leaked billions of records. Always: keep Block Public Access on, use SSE-KMS for sensitive data, and audit with S3 storage lens and IAM Access Analyzer. A single misconfigured bucket can sink a company." },
        { type: "keyTakeaways", items: [
          "Bucket policies are resource-based; needed for cross-account access.",
          "SSE-KMS gives you encryption + audit trail via CloudTrail.",
          "Presigned URLs allow time-limited access to private objects without keys.",
          "Block Public Access = your safety net. Keep it on.",
        ]},
      ],
    },
    {
      id: "s3-static-website",
      title: "Static Website Hosting on S3",
      level: "intermediate",
      duration: 22,
      xp: 15,
      summary: "Host an entire static website on S3 for pennies per month. The classic serverless website pattern.",
      content: [
        { type: "paragraph", text: "S3 can serve HTML/CSS/JS directly as a website. Combined with CloudFront (CDN) and Route 53 (DNS), you get a globally distributed, lightning-fast static site for almost nothing. This is the modern way to host marketing sites, docs, and SPAs." },
        { type: "code", language: "bash", code: `# Enable static website hosting
aws s3api put-bucket-website \\
  --bucket my-static-site \\
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "404.html"}
  }'

# Upload site content
aws s3 sync ./dist/ s3://my-static-site/ --acl public-read

# Get the website endpoint
# http://my-static-site.s3-website-us-east-1.amazonaws.com`, caption: "Enable S3 website hosting and upload content." },
        { type: "callout", variant: "tip", title: "Always pair with CloudFront", text: "Raw S3 website endpoints have no HTTPS, no CDN, no caching. Always put CloudFront in front — it adds HTTPS, global edge caching, DDoS protection, and WAF. Cost is tiny for low-traffic sites and the security + speed benefits are enormous." },
        { type: "keyTakeaways", items: [
          "S3 can serve a static website directly via a special website endpoint.",
          "Pair with CloudFront for HTTPS, CDN, and DDoS protection.",
          "Pair with Route 53 for custom domains.",
          "Costs pennies per month for low-traffic sites.",
        ]},
      ],
    },
    {
      id: "s3-advanced",
      title: "Advanced S3 — Replication, Events, Versioning",
      level: "advanced",
      duration: 28,
      xp: 25,
      summary: "Cross-region replication, event notifications, versioning, and the production patterns that make S3 truly powerful.",
      content: [
        { type: "paragraph", text: "Beyond basic storage, S3 supports versioning (keep all versions of every object), replication (copy to another bucket, possibly another region), and event notifications (trigger Lambda when an object is uploaded). These unlock sophisticated data pipelines and DR strategies." },
        { type: "code", language: "json", code: `// Event notification config: trigger Lambda on object upload
{
  "LambdaFunctionConfigurations": [
    {
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:image-processor",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [{ "Name": "prefix", "Value": "uploads/" }]
        }
      }
    }
  ]
}`, caption: "Event notification — Lambda auto-runs when an object lands in uploads/." },
        { type: "list", items: [
          "Versioning — keeps all versions of an object, including deletes (as delete markers).",
          "Same-Region Replication (SRR) — copy to another bucket in same region (e.g., separate log archive).",
          "Cross-Region Replication (CRR) — copy to another region for DR or low-latency global access.",
          "Event notifications — trigger Lambda/SQS/SNS on object events.",
          "S3 Select — query CSV/JSON/Parquet directly from S3 without downloading.",
          "Batch Operations — perform bulk actions on millions of objects.",
          "Object Lock — WORM (write-once-read-many) for compliance archives.",
        ]},
        { type: "callout", variant: "warning", title: "Versioning adds storage cost", text: "With versioning on, every overwrite or delete creates a new version. Storage costs accumulate. Use lifecycle policies to expire old versions automatically — e.g., 'keep only the latest 30 versions of each object'." },
        { type: "keyTakeaways", items: [
          "Versioning protects against accidental overwrites and deletes.",
          "CRR replicates to another region for DR or global access.",
          "Event notifications trigger Lambda/SQS/SNS on object events.",
          "Combine with lifecycle policies to control storage costs.",
        ]},
      ],
    },
  ],
};

export const rdsModule: Module = {
  id: "rds",
  title: "Amazon RDS — Managed Relational Databases",
  short: "RDS",
  description: "Managed MySQL, PostgreSQL, SQL Server, and more. AWS handles backups, patching, and HA so you don't have to.",
  category: "database",
  icon: "Database",
  color: "aws-violet",
  level: "intermediate",
  totalLessons: 5,
  estimatedHours: 4,
  lessons: [
    {
      id: "rds-intro",
      title: "RDS Fundamentals — Managed Databases",
      level: "intermediate",
      duration: 22,
      xp: 15,
      summary: "Why RDS exists, what engines it supports, and how it differs from running your own database on EC2.",
      content: [
        { type: "paragraph", text: "Amazon RDS (Relational Database Service) runs a managed relational database for you. You choose the engine (MySQL, PostgreSQL, MariaDB, SQL Server, Oracle, or Amazon Aurora) and instance size; AWS handles OS patching, backups, software upgrades, and high availability. Compared to running MySQL on EC2, RDS dramatically reduces operational burden." },
        { type: "comparison", columns: ["Aspect", "MySQL on EC2", "RDS Managed"], rows: [
          { label: "OS patching", values: ["You", "AWS"] },
          { label: "DB software upgrade", values: ["You", "AWS (or you trigger)"] },
          { label: "Backups", values: ["You write scripts", "Automated daily + manual snapshots"] },
          { label: "Multi-AZ failover", values: ["You build replication", "Built-in, 60-120s failover"] },
          { label: "Read replicas", values: ["You configure", "Click a button"] },
          { label: "Cost", values: ["Lower (just EC2)", "Slightly higher (managed service fee)"] },
        ]},
        { type: "callout", variant: "tip", title: "Pick PostgreSQL for new apps", text: "For new applications without specific engine requirements, PostgreSQL is the modern default. It has the richest feature set, excellent JSON support, strong ecosystem, and Aurora PostgreSQL offers even better performance. MySQL/MariaDB is fine for simpler workloads." },
        { type: "keyTakeaways", items: [
          "RDS = managed relational DB; AWS handles ops burden.",
          "Six engines supported; PostgreSQL is the modern default.",
          "Slightly more expensive than EC2, but saves 90%+ of operational effort.",
          "Multi-AZ and read replicas are built-in — no scripting required.",
        ]},
      ],
    },
    {
      id: "rds-multi-az",
      title: "Multi-AZ, Read Replicas, and HA",
      level: "advanced",
      duration: 28,
      xp: 20,
      summary: "Multi-AZ for high availability, read replicas for scaling reads. Two different but complementary patterns.",
      content: [
        { type: "paragraph", text: "Multi-AZ and read replicas are commonly confused but solve different problems. Multi-AZ provides standby failover for HA — a synchronous copy in another AZ that takes over if primary fails. Read replicas are async copies used to scale read throughput — they can be in the same region, another region, or even another account." },
        { type: "architecture", nodes: [
          { id: "app", label: "Application", type: "compute" },
          { id: "primary", label: "Primary DB (AZ-a)", type: "database" },
          { id: "standby", label: "Standby DB (AZ-b)", type: "database" },
          { id: "replica1", label: "Read Replica 1", type: "database" },
          { id: "replica2", label: "Read Replica 2 (other region)", type: "database" },
        ], edges: [
          { from: "app", to: "primary", label: "writes + reads" },
          { from: "primary", to: "standby", label: "sync replication" },
          { from: "primary", to: "replica1", label: "async replication" },
          { from: "primary", to: "replica2", label: "async replication (cross-region)" },
          { from: "app", to: "replica1", label: "read-only queries" },
        ]},
        { type: "comparison", columns: ["Property", "Multi-AZ", "Read Replica"], rows: [
          { label: "Purpose", values: ["High availability / DR", "Scale read throughput"] },
          { label: "Replication", values: ["Synchronous", "Asynchronous"] },
          { label: "Standby is queryable", values: ["No — passive standby", "Yes — accepts reads"] },
          { label: "Failover time", values: ["60-120 seconds", "Manual promotion (minutes)"] },
          { label: "Cost", values: ["2x instance cost", "Per replica added"] },
        ]},
        { type: "callout", variant: "info", title: "Aurora changes the game", text: "Amazon Aurora (MySQL or PostgreSQL compatible) uses a distributed storage layer that replicates 6 ways across 3 AZs by default. Failover is faster (typically <30s), read replicas can be up to 15 (vs 5 for standard RDS), and there's an Aurora Serverless option for variable workloads. Aurora costs more but is dramatically more capable." },
        { type: "keyTakeaways", items: [
          "Multi-AZ = synchronous standby for HA; not queryable.",
          "Read replica = async copy for scaling reads; queryable.",
          "Failover to Multi-AZ standby takes 60-120s; replica promotion is manual.",
          "Aurora = distributed storage with 6-way replication and faster failover.",
        ]},
      ],
    },
    {
      id: "rds-security",
      title: "Securing RDS — Network, IAM, Encryption",
      level: "advanced",
      duration: 28,
      xp: 20,
      summary: "Three layers of RDS security: network isolation, IAM database authentication, and encryption.",
      content: [
        { type: "paragraph", text: "RDS security has three pillars. Network: keep databases in private subnets, accessible only from app tier. Identity: use IAM database authentication for short-lived token-based access. Encryption: encrypt storage with KMS, and use SSL for connections in transit. Skip any of these and your database is exposed." },
        { type: "list", items: [
          "Private subnets — RDS instances must never have public IPs for production workloads.",
          "Security groups — restrict inbound to specific app-tier SGs only.",
          "Encryption at rest — enable KMS encryption when creating the instance; cannot be added later (must snapshot + restore).",
          "Encryption in transit — enforce SSL by requiring it in parameter group.",
          "IAM DB auth — generate short-lived auth tokens instead of passwords (MySQL/PostgreSQL only).",
          "Secrets Manager — store DB credentials, rotate automatically, never hardcode.",
          "Parameter groups — tune DB settings, force SSL, set log retention.",
        ]},
        { type: "callout", variant: "danger", title: "Public RDS = recipe for disaster", text: "Never set 'Publicly Accessible: Yes' on a production RDS instance. Ransomware crews scan the internet for exposed databases 24/7 and have automated mass-encryption attacks. A single misconfigured security group or public accessibility setting can result in total data loss within hours." },
        { type: "keyTakeaways", items: [
          "RDS instances live in private subnets, accessed only from app tier.",
          "Enable KMS encryption at creation — cannot be added later.",
          "Use Secrets Manager for credential rotation.",
          "Never enable Publicly Accessible in production.",
        ]},
      ],
    },
    {
      id: "rds-backups-dr",
      title: "Backups, Snapshots, and Disaster Recovery",
      level: "advanced",
      duration: 25,
      xp: 20,
      summary: "Automated backups, manual snapshots, point-in-time recovery — and the cross-region DR pattern.",
      content: [
        { type: "paragraph", text: "RDS provides two backup mechanisms. Automated backups run daily during a maintenance window, retaining 1-35 days. They enable point-in-time recovery to any second within the retention window. Manual snapshots are taken on-demand and retained indefinitely until you delete them. For DR, copy automated snapshots to another region." },
        { type: "code", language: "bash", code: `# Create a manual snapshot
aws rds create-db-snapshot \\
  --db-instance-identifier prod-db \\
  --db-snapshot-identifier prod-db-pre-migration-2026-08-19

# Restore to a point in time (5 minutes ago)
aws rds restore-db-instance-to-point-in-time \\
  --source-db-instance-identifier prod-db \\
  --target-db-instance-identifier prod-db-restored \\
  --restore-time 2026-08-19T10:00:00Z

# Copy snapshot to another region for DR
aws rds copy-db-snapshot \\
  --source-db-snapshot-identifier arn:aws:rds:us-east-1:123456789012:snapshot:prod-db-snap \\
  --target-db-snapshot-identifier prod-db-dr-copy \\
  --source-region us-east-1 \\
  --region eu-west-1`, caption: "Manual snapshot, point-in-time restore, and cross-region copy for DR." },
        { type: "callout", variant: "info", title: "Test your restores regularly", text: "An untested backup is just a hope. Run a quarterly DR drill: snapshot prod, restore to a different region, start the application against it, verify data integrity. Most teams discover their backups are broken only during a real disaster — exactly when they can't afford to." },
        { type: "keyTakeaways", items: [
          "Automated backups: 1-35 day retention, point-in-time recovery to any second.",
          "Manual snapshots: indefinite retention until you delete them.",
          "Copy snapshots cross-region for DR.",
          "Test restores quarterly — untested backups are hopes, not guarantees.",
        ]},
      ],
    },
    {
      id: "rds-scaling",
      title: "Scaling RDS — Read Replicas, Aurora, Serverless",
      level: "expert",
      duration: 30,
      xp: 25,
      summary: "Beyond vertical scaling: how to actually scale relational databases on AWS for high read/write workloads.",
      content: [
        { type: "paragraph", text: "RDS instances scale vertically up to 24 TB RAM and 128 vCPUs, but that has hard limits. For real scaling, you need to architect differently: read replicas for read-heavy workloads, Aurora's distributed storage for write scaling, and Aurora Serverless v2 for variable workloads. Connection pooling (RDS Proxy) helps when you have many app instances hitting the same DB." },
        { type: "comparison", columns: ["Pattern", "Scales what", "Limit", "When to use"], rows: [
          { label: "Vertical scaling", values: ["Single instance CPU/RAM", "Hardware max", "Most workloads up to medium scale"] },
          { label: "Read replicas", values: ["Read throughput", "5 (RDS) / 15 (Aurora)", "Read-heavy apps (8:1 read:write)"] },
          { label: "Aurora distributed storage", values: ["Write throughput", "Single writer", "Apps with high write volume"] },
          { label: "Aurora Multi-Master", values: ["Write throughput", "Limited engines", "Multi-writer needed (rare)"] },
          { label: "Sharding (app-level)", values: ["Both reads + writes", "Operational complexity", "Very high scale — millions of QPS"] },
          { label: "RDS Proxy", values: ["Connection count", "Single instance", "Many Lambda/EC2 connections"] },
          { label: "Aurora Serverless v2", values: ["Variable workloads", "0.5-128 ACU", "Bursty workloads, dev/test"] },
        ]},
        { type: "callout", variant: "warning", title: "Sharding is a last resort", text: "Application-level sharding (splitting data across multiple databases by key) is operationally complex: cross-shard transactions, resharding on growth, and consistency are all hard. Exhaust Aurora scaling, read replicas, and connection pooling first. Many apps that 'need sharding' actually just need better indexes and query tuning." },
        { type: "keyTakeaways", items: [
          "Vertical scaling caps at hardware limits.",
          "Read replicas scale reads; Aurora distributed storage scales writes.",
          "RDS Proxy pools connections for many short-lived clients (Lambda).",
          "Aurora Serverless v2 handles variable workloads from 0.5 to 128 ACU.",
          "Sharding is a last resort — most apps don't actually need it.",
        ]},
      ],
    },
  ],
};

export const lambdaModule: Module = {
  id: "lambda",
  title: "AWS Lambda — Serverless Compute",
  short: "Lambda",
  description: "Run code without thinking about servers. Pay per millisecond. The defining service of the serverless paradigm.",
  category: "serverless",
  icon: "Zap",
  color: "aws-amber",
  level: "intermediate",
  totalLessons: 5,
  estimatedHours: 4,
  lessons: [
    {
      id: "lambda-intro",
      title: "What Is Lambda? Serverless Compute",
      level: "intermediate",
      duration: 22,
      xp: 15,
      summary: "Lambda runs your code in response to events, without servers. Understand the model, the limits, and the cost structure.",
      content: [
        { type: "paragraph", text: "AWS Lambda runs your code in response to events — an HTTP request, an S3 upload, a CloudWatch alarm — without you managing any servers. You upload a function (a ZIP of code), configure triggers, and AWS handles everything else: scaling, OS, patching, and you only pay for the milliseconds your code actually runs. It's the defining service of the serverless movement." },
        { type: "list", items: [
          "Function — your code plus configuration (runtime, memory, timeout).",
          "Trigger (event source) — what invokes the function: API Gateway, S3, DynamoDB streams, CloudWatch Events, etc.",
          "Execution role — IAM role granting the function permission to call other AWS services.",
          "Runtime — Python, Node.js, Java, Go, .NET, Ruby, or custom.",
          "Cold start — the first invocation after idle takes longer (~100ms-1s) as AWS provisions the execution environment.",
          "Concurrency — number of simultaneous executions; default 1000 per account per region.",
        ]},
        { type: "code", language: "python", code: `# A simple Lambda function in Python
import json
import boto3

def lambda_handler(event, context):
    # event contains the trigger data (API GW path, S3 object, etc.)
    print(f"Received event: {json.dumps(event)}")
    
    name = event.get('queryStringParameters', {}).get('name', 'World')
    
    s3 = boto3.client('s3')
    s3.put_object(
        Bucket='my-logs',
        Key=f'greetings/{name}.txt',
        Body=f'Hello, {name}!'.encode()
    )
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'message': f'Hello, {name}!'})
    }`, caption: "A simple Lambda function that writes to S3 and returns an HTTP response." },
        { type: "callout", variant: "tip", title: "Lambda is not always cheaper", text: "Lambda is cheaper for low/sporadic traffic because you pay per invocation. For high steady-state traffic (millions of requests per minute), EC2 or Fargate can be cheaper. Lambda shines for: APIs with spiky traffic, event-driven pipelines, scheduled tasks, and glue code between services." },
        { type: "keyTakeaways", items: [
          "Lambda = run code without managing servers, pay per millisecond.",
          "Functions are triggered by events: API calls, S3 uploads, schedules, etc.",
          "Cold starts add latency on first invocation after idle.",
          "Best for sporadic traffic, event-driven pipelines, and small APIs.",
        ]},
      ],
    },
    {
      id: "lambda-triggers",
      title: "Triggers — Event Sources and Integrations",
      level: "intermediate",
      duration: 25,
      xp: 15,
      summary: "Lambda connects to dozens of AWS services. Understand the common patterns and how each invokes.",
      content: [
        { type: "paragraph", text: "Lambda's power comes from its integrations. The same function can be triggered by an HTTP request, a file upload, a database change, a scheduled timer, or a queue message. Understanding the invocation patterns — synchronous, asynchronous, and stream-based — determines how you write your function and handle errors." },
        { type: "comparison", columns: ["Trigger type", "Invocation", "Error handling"], rows: [
          { label: "API Gateway", values: ["Synchronous", "Return 5xx to client"] },
          { label: "S3 events", values: ["Asynchronous", "Retries 2x, then DLQ"] },
          { label: "SNS", values: ["Asynchronous", "Retries with backoff"] },
          { label: "DynamoDB Streams", values: ["Stream (batch)", "Replays failed batches"] },
          { label: "Kinesis", values: ["Stream (batch)", "Retries until expiry"] },
          { label: "SQS", values: ["Polling (batch)", "Failed messages → DLQ"] },
          { label: "EventBridge", values: ["Asynchronous", "Retries 2x, then DLQ"] },
          { label: "CloudWatch Events (cron)", values: ["Asynchronous", "Retries 2x"] },
        ]},
        { type: "keyTakeaways", items: [
          "Lambda supports dozens of triggers via synchronous, async, and stream patterns.",
          "Synchronous (API GW) = caller waits; return status to them.",
          "Asynchronous (S3, SNS) = caller doesn't wait; retries + DLQ.",
          "Stream (DynamoDB Streams, Kinesis) = batched, in-order processing.",
        ]},
      ],
    },
    {
      id: "lambda-cold-starts",
      title: "Cold Starts, Concurrency, and Performance",
      level: "advanced",
      duration: 30,
      xp: 25,
      summary: "The biggest complaint about Lambda — cold starts. Why they happen and 7 ways to mitigate them.",
      content: [
        { type: "paragraph", text: "A cold start is the delay AWS incurs the first time your Lambda function runs after being idle. AWS provisions a fresh microVM, loads your runtime, loads your code, then runs your handler. This can add 100ms-3s of latency depending on runtime and package size. After the first call, subsequent invocations reuse the warm container for ~15-60 minutes." },
        { type: "list", items: [
          "Provisioned concurrency — keep N instances warm; eliminates cold starts. Costs extra.",
          "Lighter packages — fewer dependencies = faster load. Tree-shake aggressively.",
          "Avoid Java/C# for latency-sensitive work — they have the longest cold starts.",
          "Node.js and Python have the shortest cold starts (~100-300ms).",
          "Initialize outside the handler — DB connections, SDK clients, config loading happen once per container, not per invocation.",
          "SnapStart (Java only) — restores from a snapshot, dramatically reducing Java cold starts.",
          "Right-size memory — more memory = more CPU, often faster overall even though more expensive per 100ms.",
        ]},
        { type: "callout", variant: "info", title: "Concurrency = parallelism", text: "Each concurrent invocation gets its own execution environment. If your function takes 200ms and you get 1000 requests/sec, you need ~200 concurrent instances. Default account limit is 1000 per region — request a quota increase if you expect to exceed it. Reserved concurrency guarantees capacity for critical functions; provisioned concurrency eliminates cold starts." },
        { type: "keyTakeaways", items: [
          "Cold starts add 100ms-3s latency on first invocation after idle.",
          "Provisioned concurrency eliminates cold starts (costs extra).",
          "Initialize SDK clients and DB connections outside the handler.",
          "Right-size memory — more RAM = more CPU = often faster overall.",
        ]},
      ],
    },
    {
      id: "lambda-error-handling",
      title: "Error Handling, Retries, and Idempotency",
      level: "advanced",
      duration: 28,
      xp: 25,
      summary: "Distributed systems fail constantly. Designing Lambda for retries requires idempotency and DLQs.",
      content: [
        { type: "paragraph", text: "Lambda functions will be retried. The question is not 'if' but 'when'. Asynchronous triggers retry automatically 2-3 times with backoff. Stream triggers replay batches until they succeed or expire. If your function has side effects (writes to DB, sends email, charges a credit card), retries will cause duplicate operations unless your code is idempotent — designed to handle being called multiple times with the same input." },
        { type: "code", language: "python", code: `# Idempotent Lambda: use an event ID to dedupe
import boto3
import hashlib

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('processed-events')

def lambda_handler(event, context):
    event_id = event['id']
    
    # Check if we've already processed this event
    response = table.get_item(Key={'eventId': event_id})
    if 'Item' in response:
        print(f"Already processed {event_id}, skipping")
        return {'status': 'duplicate'}
    
    # Do the actual work (charge card, send email, etc.)
    process_event(event)
    
    # Record that we've processed it
    table.put_item(Item={'eventId': event_id, 'processedAt': int(time.time())})
    
    return {'status': 'processed'}`, caption: "Idempotent Lambda using DynamoDB as a deduplication ledger." },
        { type: "list", items: [
          "Idempotency key — a unique ID per logical operation (event ID, request ID).",
          "Deduplication store — DynamoDB, ElastiCache, or RDS to track processed IDs.",
          "Dead-letter queue (DLQ) — SNS or SQS topic that receives failed events after all retries.",
          "Destination — Lambda can route successful/failed results to other Lambdas/SQS/SNS.",
          "Use SQS as a buffer — instead of direct Lambda trigger, use SQS + Lambda for retry/DLQ.",
        ]},
        { type: "callout", variant: "danger", title: "Non-idempotent side effects are dangerous", text: "If your function charges a customer $100 and is retried 3 times due to a transient error, the customer gets charged $400. Always design Lambda with side effects to be idempotent — use a deduplication key and check before executing. The cost of adding idempotency is far less than the cost of refunding customers." },
        { type: "keyTakeaways", items: [
          "Lambda will retry — design for it.",
          "Idempotency: same input → same effect, even when called multiple times.",
          "Use a deduplication store (DynamoDB) to track processed events.",
          "Configure DLQ for events that fail all retries.",
        ]},
      ],
    },
    {
      id: "lambda-production",
      title: "Production Lambda — Layers, Observability, Cost",
      level: "expert",
      duration: 30,
      xp: 25,
      summary: "Take Lambda to production: layers for shared code, Powertools for observability, and cost analysis.",
      content: [
        { type: "paragraph", text: "Production Lambda needs more than just a function: shared code in Layers, structured logging with Powertools, distributed tracing with X-Ray, infrastructure-as-code deployment (SAM or CDK or Serverless Framework), and careful cost analysis. Lambda is cheap at low scale but can dwarf EC2 at high scale if you don't watch it." },
        { type: "list", items: [
          "Layers — share code/dependencies across functions (e.g., common utilities, heavy deps).",
          "Powertools (Python/Java/TypeScript) — structured logging, tracing, metrics, idempotency decorators.",
          "X-Ray — distributed tracing across Lambda + API Gateway + DynamoDB.",
          "SAM / CDK / Serverless Framework — IaC deployment; far better than console.",
          "Versions + Aliases — versioned functions, alias-based traffic shifting for canary deployments.",
          "Cost model — pay per request + GB-second. Free tier: 1M requests + 400k GB-sec/month.",
          "Warm concurrency costs — provisioned concurrency bills hourly, not per call.",
        ]},
        { type: "callout", variant: "warning", title: "Watch your GB-seconds", text: "Lambda bills by GB-second: memory × duration. A 1GB function running for 1 second = 1 GB-sec. If your function does 10s of work and you give it 128MB, doubling to 256MB often cuts duration in half (more CPU), making it faster AND cheaper. Right-sizing Lambda memory can save 30-70% on cost." },
        { type: "keyTakeaways", items: [
          "Layers share code/dependencies across multiple functions.",
          "Use Powertools for structured logging, tracing, metrics.",
          "Deploy with IaC (SAM/CDK), never console.",
          "Right-size memory — often doubling RAM makes functions faster AND cheaper.",
        ]},
      ],
    },
  ],
};

export const apiGatewayModule: Module = {
  id: "api-gateway",
  title: "Amazon API Gateway",
  short: "API GW",
  description: "Build, deploy, and manage REST and WebSocket APIs at scale. The front door for serverless architectures.",
  category: "serverless",
  icon: "Network",
  color: "aws-cyan",
  level: "intermediate",
  totalLessons: 4,
  estimatedHours: 3,
  lessons: [
    {
      id: "apigw-intro",
      title: "API Gateway Fundamentals",
      level: "intermediate",
      duration: 22,
      xp: 15,
      summary: "What API Gateway does, the three API types (REST, HTTP, WebSocket), and when to use each.",
      content: [
        { type: "paragraph", text: "API Gateway is a managed service for creating, publishing, and securing APIs at scale. It handles the API front door — routing, authentication, throttling, monitoring — and integrates with Lambda, EC2, and other backends. For serverless architectures, it's the standard way to expose HTTP endpoints." },
        { type: "comparison", columns: ["API type", "Best for", "Pricing model"], rows: [
          { label: "REST API", values: ["Full-featured APIs with auth, validation, models", "Per-request + data transfer"] },
          { label: "HTTP API", values: ["Simple, low-cost Lambda proxy", "~70% cheaper than REST, per-request"] },
          { label: "WebSocket API", values: ["Real-time bidirectional (chat, streaming)", "Per-minute connection + messages"] },
        ]},
        { type: "callout", variant: "tip", title: "HTTP API for new simple apps", text: "For most new serverless APIs that just need to forward HTTP to Lambda, HTTP API is the right choice — it's 70% cheaper than REST API and faster. Use REST API only when you need features like request validation models, API keys with usage plans, or WebSocket-style features." },
        { type: "keyTakeaways", items: [
          "API Gateway = managed API front door.",
          "REST API = full features, higher cost. HTTP API = simple, 70% cheaper.",
          "WebSocket API = real-time bidirectional.",
          "Standard pattern: API Gateway → Lambda → DynamoDB.",
        ]},
      ],
    },
    {
      id: "apigw-integrations",
      title: "Integrations — Lambda, HTTP, Mock, AWS Services",
      level: "intermediate",
      duration: 25,
      xp: 15,
      summary: "API Gateway can route requests to Lambda, HTTP endpoints, AWS services directly, or return mock responses.",
      content: [
        { type: "paragraph", text: "API Gateway supports several integration types. Lambda proxy integration is the most common — the entire HTTP request is passed to Lambda as an event, and Lambda returns a structured response. HTTP integration lets you forward to existing HTTP backends. AWS service integration lets you call AWS APIs directly (e.g., put an item in DynamoDB) without writing Lambda code. Mock returns canned responses." },
        { type: "code", language: "yaml", code: `# SAM template for API Gateway + Lambda
Resources:
  MyApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
      
  GetUsersFunction:
    Type: AWS::Serverless::Function
    Properties:
      Runtime: python3.12
      Handler: app.handler
      CodeUri: ./src
      MemorySize: 256
      Timeout: 10
      Events:
        GetUsers:
          Type: Api
          Properties:
            Path: /users
            Method: get
            RestApiId: !Ref MyApi
      Policies:
        - DynamoDBReadPolicy:
            TableName: users-table`, caption: "SAM template — define Lambda + API Gateway together." },
        { type: "keyTakeaways", items: [
          "Lambda proxy integration is the most common pattern.",
          "HTTP integration forwards to existing HTTP backends.",
          "AWS service integration calls AWS APIs directly without Lambda.",
          "Use SAM/CDK to define API Gateway + Lambda together.",
        ]},
      ],
    },
    {
      id: "apigw-auth",
      title: "Authentication, Authorization, and Throttling",
      level: "advanced",
      duration: 28,
      xp: 25,
      summary: "Secure your APIs: Cognito, Lambda authorizers, IAM auth, usage plans, and throttling.",
      content: [
        { type: "paragraph", text: "API Gateway supports multiple authentication and authorization mechanisms. Cognito user pools for end-user auth, Lambda authorizers for custom logic (e.g., validate JWT from your own auth service), IAM auth for internal AWS callers, and no auth for public endpoints. Throttling and usage plans protect your backend from abuse." },
        { type: "comparison", columns: ["Auth type", "Best for", "Notes"], rows: [
          { label: "Cognito User Pool", values: ["End-user signup/login", "OAuth 2.0, social login, MFA"] },
          { label: "Lambda authorizer", values: ["Custom JWT or session token", "Full code control"] },
          { label: "IAM", values: ["Internal AWS callers", "Sigv4 signed requests"] },
          { label: "None (public)", values: ["Open APIs", "Use throttling + WAF"] },
        ]},
        { type: "list", items: [
          "Usage plans — define quotas (1000 req/day) and throttling (10 req/sec) per API key.",
          "API keys — identifier for usage plan, NOT for authentication (common confusion).",
          "Stage-level throttling — burst + rate limits applied to all routes in a stage.",
          "Per-route throttling — override per method.",
          "WAF integration — block SQL injection, XSS, rate limit by IP.",
        ]},
        { type: "callout", variant: "warning", title: "API keys are not auth", text: "API keys identify the caller for usage plan tracking — they do not authenticate. Anyone who intercepts the key can call the API. For real auth, use Cognito or Lambda authorizers. API keys just rate-limit and quota." },
        { type: "keyTakeaways", items: [
          "Auth options: Cognito, Lambda authorizers, IAM, or none.",
          "API keys are for usage plans, not authentication.",
          "Set throttling + quotas to protect backend.",
          "Always pair public APIs with WAF.",
        ]},
      ],
    },
    {
      id: "apigw-production",
      title: "Production API Gateway — Stages, Canary, Custom Domains",
      level: "advanced",
      duration: 28,
      xp: 25,
      summary: "Deploying APIs the right way: stages, canary releases, custom domains, and CloudFront.",
      content: [
        { type: "paragraph", text: "Production API Gateway deployments are more than just pushing code. You need stages (dev/staging/prod), canary deployments for safe rollouts, custom domains with TLS, access logging to CloudWatch/Kinesis, and CloudFront in front for global performance and WAF protection." },
        { type: "code", language: "bash", code: `# Deploy API to a new stage
aws apigateway create-deployment \\
  --rest-api-id abc123 \\
  --stage-name prod \\
  --description "Deploy v1.2.3 to prod"

# Canary deployment (10% traffic to new version)
aws apigateway update-stage \\
  --rest-api-id abc123 \\
  --stage-name prod \\
  --patch-operations op=replace,path=/canarySettings/percentTraffic,value=10

# Custom domain with TLS
aws apigateway create-domain-name \\
  --domain-name api.mycompany.com \\
  --regional-certificate-arn arn:aws:acm:us-east-1:123456789012:certificate/abc123 \\
  --endpoint-configuration types=REGIONAL`, caption: "Deploy stage, canary 10%, set up custom domain." },
        { type: "keyTakeaways", items: [
          "Stages isolate environments (dev/staging/prod).",
          "Canary deployments shift traffic gradually for safe rollouts.",
          "Custom domains + ACM certs give HTTPS on your own domain.",
          "CloudFront in front adds global caching and WAF.",
        ]},
      ],
    },
  ],
};

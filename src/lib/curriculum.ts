// AWS Cloud Learning Platform — Curriculum data
// 16 modules, each with 4-6 lessons across Beginner → Expert levels.

import type { SkillLevel } from "./store";
import { ec2Module } from "./curriculum-ec2";
import { s3Module, rdsModule, lambdaModule, apiGatewayModule } from "./curriculum-storage-db";
import {
  networkingModule,
  securityModule,
  containersModule,
  devopsModule,
  aimlModule,
  awsCliModule,
} from "./curriculum-networking-sec";

export interface Lesson {
  id: string;
  title: string;
  level: SkillLevel;
  duration: number; // minutes
  xp: number;
  summary: string;
  // Rich content blocks rendered by LessonView
  content: LessonBlock[];
}

export type LessonBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; variant: "info" | "warning" | "tip" | "danger" | "success"; title: string; text: string }
  | { type: "code"; language: string; code: string; caption?: string }
  | { type: "architecture"; nodes: { id: string; label: string; type: string }[]; edges: { from: string; to: string; label?: string }[]; caption?: string }
  | { type: "comparison"; columns: string[]; rows: { label: string; values: string[] }[]; caption?: string }
  | { type: "qa"; question: string; answer: string }
  | { type: "keyTakeaways"; items: string[] };

export interface Module {
  id: string;
  title: string;
  short: string;
  description: string;
  category: "fundamentals" | "compute" | "storage" | "database" | "networking" | "security" | "serverless" | "containers" | "devops" | "aiml" | "core";
  icon: string; // lucide icon name
  color: string; // theme color key
  level: SkillLevel;
  totalLessons: number;
  estimatedHours: number;
  lessons: Lesson[];
}

// ----------------------------------------------------------------------------
// Module: Cloud Computing Fundamentals
// ----------------------------------------------------------------------------

const fundamentalsModule: Module = {
  id: "fundamentals",
  title: "Cloud Computing Fundamentals",
  short: "Cloud 101",
  description: "Understand what cloud computing is, why it exists, and how it differs from traditional infrastructure. Build the mental models that everything else in AWS depends on.",
  category: "fundamentals",
  icon: "Cloud",
  color: "aws-orange",
  level: "beginner",
  totalLessons: 6,
  estimatedHours: 3,
  lessons: [
    {
      id: "what-is-cloud",
      title: "What Is Cloud Computing?",
      level: "beginner",
      duration: 15,
      xp: 10,
      summary: "Cloud computing defined in plain English, with analogies a complete beginner can follow.",
      content: [
        { type: "paragraph", text: "Cloud computing is the delivery of computing services — servers, storage, databases, networking, software, and more — over the internet on a pay-as-you-go basis. Instead of buying and maintaining physical hardware in your own office or data center, you rent access to those resources from a cloud provider such as AWS, only paying for what you actually use." },
        { type: "callout", variant: "tip", title: "The pizza analogy", text: "Cooking pizza at home is like running your own servers — you buy the oven, ingredients, and clean up afterwards. Ordering pizza delivery is like using the cloud — you describe what you want, someone else handles the kitchen, and you only pay for the pizza you eat. Cloud computing is essentially 'pizza delivery for compute resources.'" },
        { type: "heading", text: "Why cloud computing exists" },
        { type: "paragraph", text: "Before the cloud, companies had to guess how much hardware they would need, buy it upfront, and then either sit with idle machines during quiet periods or scramble to buy more during peak demand. This 'guess-then-buy' model was slow, expensive, and risky. Cloud computing flips this model: provision exactly what you need now, scale up in seconds when traffic spikes, and scale down (and stop paying) when traffic subsides." },
        { type: "subheading", text: "The five characteristics of cloud" },
        { type: "list", items: [
          "On-demand self-service — you provision resources without talking to a human.",
          "Broad network access — resources are reachable over the internet.",
          "Resource pooling — many customers share the same physical hardware securely.",
          "Rapid elasticity — capacity scales up or down automatically.",
          "Measured service — you pay per second or per byte, like a utility bill.",
        ]},
        { type: "keyTakeaways", items: [
          "Cloud = renting compute over the internet instead of buying hardware.",
          "Pay-as-you-go pricing eliminates large upfront capital expenditures.",
          "Elasticity means you can scale to match demand, not your guesses.",
          "AWS, Azure, and Google Cloud are the three largest public cloud providers.",
        ]},
      ],
    },
    {
      id: "cloud-vs-onprem",
      title: "Cloud vs On-Premises Infrastructure",
      level: "beginner",
      duration: 18,
      xp: 10,
      summary: "A practical comparison: when does cloud make sense, and when does owning hardware still win?",
      content: [
        { type: "paragraph", text: "On-premises (\"on-prem\") means a company owns its own servers, networking gear, cooling, and the data center itself. The cloud means renting those resources from a provider. Each approach has very different financial, operational, and technical implications — choosing the wrong one for a given workload can cost millions or stall a project for months." },
        { type: "comparison", columns: ["Dimension", "On-Premises", "Cloud"], rows: [
          { label: "Upfront cost", values: ["High (CapEx)", "Low (OpEx)"] },
          { label: "Time to provision", values: ["Weeks to months", "Seconds to minutes"] },
          { label: "Maintenance", values: ["Your team owns it", "Provider handles hardware/cooling/power"] },
          { label: "Scaling", values: ["Buy more hardware", "Click a button"] },
          { label: "Predictable cost", values: ["Excellent", "Variable — needs monitoring"] },
          { label: "Best for", values: ["Steady, predictable loads; regulated data", "Variable loads; rapid experimentation"] },
        ]},
        { type: "callout", variant: "warning", title: "Cloud is not always cheaper", text: "Without cost discipline, cloud can be more expensive than on-prem for steady-state workloads. The cloud's economic advantage comes from elasticity and avoiding idle capacity, not from a lower per-unit price. A 100%-utilized server you own is often cheaper than the same server rented." },
        { type: "heading", text: "The hybrid reality" },
        { type: "paragraph", text: "Most enterprises today run a hybrid model: legacy or regulated workloads stay on-prem, while new applications are built cloud-native. Some data must remain in specific countries or buildings due to compliance — this is called data residency. A senior architect must understand both worlds and design bridges between them, such as VPN connections, AWS Direct Connect, and hybrid identity." },
        { type: "keyTakeaways", items: [
          "On-prem = capital expense + operational burden; cloud = operational expense + provider handles hardware.",
          "Cloud wins when load is variable or speed of innovation matters.",
          "On-prem can win for steady, predictable, regulated workloads.",
          "Hybrid is the real-world norm, not a corner case.",
        ]},
      ],
    },
    {
      id: "iaas-paas-saas",
      title: "IaaS, PaaS, SaaS — The Cloud Service Models",
      level: "beginner",
      duration: 16,
      xp: 10,
      summary: "The three classic service models and where AWS services fit on this spectrum.",
      content: [
        { type: "paragraph", text: "Cloud providers offer services at different levels of abstraction. The three classic models — IaaS, PaaS, and SaaS — describe who manages what. Understanding this spectrum is critical because each level trades flexibility for simplicity." },
        { type: "comparison", columns: ["Layer", "What you manage", "What the provider manages", "AWS examples"], rows: [
          { label: "On-Premises", values: ["Everything", "Nothing", "—"] },
          { label: "IaaS", values: ["OS, apps, data", "Hardware, networking, virtualization", "EC2, EBS, VPC"] },
          { label: "PaaS", values: ["Apps, data", "OS + everything below", "Lambda, RDS, Elastic Beanstalk"] },
          { label: "SaaS", values: ["Just your users and config", "Everything", "Gmail, Salesforce, Chime"] },
        ]},
        { type: "paragraph", text: "Higher abstraction means less control but less operational work. With EC2 (IaaS), you choose the OS, install patches, and configure everything. With Lambda (PaaS-like serverless), AWS handles servers entirely; you only supply code. With SaaS, you don't even write code — you just use an application someone else built." },
        { type: "callout", variant: "tip", title: "Why this matters", text: "Each level optimizes for something different. IaaS gives maximum control and the widest range of workloads. PaaS reduces operational burden. SaaS eliminates custom code entirely. Architects mix all three — most production systems run multiple services from each tier." },
        { type: "keyTakeaways", items: [
          "IaaS — you manage OS and up; you rent virtual hardware.",
          "PaaS — you manage applications; provider manages OS and below.",
          "SaaS — you consume a finished product.",
          "AWS covers all three layers; real architectures mix them.",
        ]},
      ],
    },
    {
      id: "deployment-models",
      title: "Public, Private, and Hybrid Cloud",
      level: "beginner",
      duration: 14,
      xp: 10,
      summary: "Different deployment models for different needs — security, cost, and operational trade-offs.",
      content: [
        { type: "paragraph", text: "A public cloud is shared infrastructure offered to anyone who pays — AWS, Azure, and Google Cloud are all public clouds. A private cloud is cloud-style infrastructure dedicated to a single organization, either on-premises or hosted by a provider. A hybrid cloud combines both, with workloads and data moving between them." },
        { type: "list", items: [
          "Public cloud — multi-tenant, elastic, pay-as-you-go. Examples: AWS, Azure, GCP.",
          "Private cloud — single-tenant, dedicated hardware. Examples: VMware Cloud Foundation, OpenStack.",
          "Hybrid cloud — workloads span public and private clouds, often with VPN/Direct Connect links.",
          "Multi-cloud — using multiple public cloud providers simultaneously.",
        ]},
        { type: "callout", variant: "warning", title: "Multi-cloud is hard", text: "Multi-cloud sounds great in vendor meetings but is operationally expensive. Different IAM models, networking, and tooling mean engineers must master multiple platforms. Most teams choose a primary cloud and use a second only for specific workloads." },
        { type: "keyTakeaways", items: [
          "Public cloud = shared, multi-tenant, elastic.",
          "Private cloud = dedicated, single-tenant.",
          "Hybrid = both, connected by network links and shared identity.",
          "Multi-cloud is technically possible but operationally costly.",
        ]},
      ],
    },
    {
      id: "scalability-availability",
      title: "Scalability, Elasticity, Availability, and Fault Tolerance",
      level: "intermediate",
      duration: 22,
      xp: 15,
      summary: "Four foundational terms that are often confused but mean very different things in practice.",
      content: [
        { type: "paragraph", text: "These four terms are constantly conflated, even by experienced engineers. Understanding the precise difference is critical because each requires different architectural choices. Confusing them leads to over-engineered (and expensive) or under-engineered (and fragile) systems." },
        { type: "comparison", columns: ["Property", "Definition", "How AWS achieves it"], rows: [
          { label: "Scalability", values: ["Ability to handle growing load by adding resources", "Vertical scaling (bigger instance) or horizontal scaling (more instances)"] },
          { label: "Elasticity", values: ["Ability to scale UP and DOWN automatically with demand", "Auto Scaling Groups, Lambda concurrency, DynamoDB on-demand"] },
          { label: "Availability", values: ["% of time a service is up and reachable", "Multi-AZ deployments, load balancers, health checks"] },
          { label: "Fault tolerance", values: ["Ability to keep working when components fail", "Multi-AZ + redundancy, idempotent retries, circuit breakers"] },
          { label: "Reliability", values: ["Long-term consistency of service quality", "Monitoring, alerting, runbooks, DR drills"] },
        ]},
        { type: "heading", text: "Vertical vs Horizontal scaling" },
        { type: "paragraph", text: "Vertical scaling means making a single resource bigger — upgrading an EC2 instance from t3.micro to m5.xlarge. It is simple but has a hard ceiling (the largest available instance) and requires downtime. Horizontal scaling means adding more instances of the same resource — going from 2 to 10 web servers behind a load balancer. It scales almost indefinitely and survives individual failures, but requires the application to be stateless." },
        { type: "callout", variant: "tip", title: "The stateless rule", text: "Horizontal scaling only works if your application is stateless — no in-memory sessions, no local file uploads. State must live in a shared store (database, cache, S3). This single design decision unlocks almost all cloud-native scaling patterns." },
        { type: "keyTakeaways", items: [
          "Scalability = ability to grow. Elasticity = ability to grow AND shrink.",
          "Availability = uptime %. Fault tolerance = survival of failures.",
          "Vertical scaling is easy but capped. Horizontal scaling is uncapped but needs statelessness.",
          "Multi-AZ deployments are the foundation of both availability and fault tolerance.",
        ]},
      ],
    },
    {
      id: "regions-az-edge",
      title: "Regions, Availability Zones, and Edge Locations",
      level: "intermediate",
      duration: 20,
      xp: 15,
      summary: "AWS global infrastructure explained — the geographic building blocks every architect must understand.",
      content: [
        { type: "paragraph", text: "AWS organizes the world into Regions, Availability Zones (AZs), and Edge Locations. Understanding this hierarchy is the foundation of every architectural decision — latency, cost, compliance, and availability all flow from where your resources live." },
        { type: "architecture", nodes: [
          { id: "world", label: "AWS Global Infrastructure", type: "global" },
          { id: "region1", label: "Region (us-east-1)", type: "region" },
          { id: "region2", label: "Region (eu-west-1)", type: "region" },
          { id: "az1", label: "AZ us-east-1a", type: "az" },
          { id: "az2", label: "AZ us-east-1b", type: "az" },
          { id: "az3", label: "AZ us-east-1c", type: "az" },
        ], edges: [
          { from: "world", to: "region1" },
          { from: "world", to: "region2" },
          { from: "region1", to: "az1" },
          { from: "region1", to: "az2" },
          { from: "region1", to: "az3" },
        ]},
        { type: "list", items: [
          "Region — a geographic area (e.g., us-east-1 in Virginia). Each region is fully independent.",
          "Availability Zone (AZ) — one or more data centers within a region, with independent power, cooling, and networking. Regions have 2–6 AZs.",
          "Edge Location — a smaller POP (point of presence) for content caching (CloudFront, Route 53). AWS has 400+ edge locations in 90+ cities.",
          "Local Zones — extend AWS to large metro areas not yet full regions (e.g., Los Angeles, Miami).",
          "Wavelength Zones — embed AWS at 5G provider data centers for ultra-low-latency mobile apps.",
        ]},
        { type: "callout", variant: "info", title: "Why AZs matter", text: "Each AZ is physically separated — typically tens of kilometers apart — to avoid correlated failures from floods, fires, or power outages. Deploying your application across 3 AZs simultaneously means a single AZ failure should not take your app down. This is THE fundamental availability pattern in AWS." },
        { type: "callout", variant: "warning", title: "Regions are not equal", text: "Not every service launches in every region on day one. New AWS services typically launch in us-east-1 first, then expand. Pricing also varies by region — us-east-1 is usually cheapest; remote regions like ap-southeast-3 can be 15–25% more expensive. Always check the pricing page for your specific region." },
        { type: "keyTakeaways", items: [
          "Region = geographic area. AZ = independent data center cluster within a region.",
          "Multi-AZ deployment = the foundation of HA.",
          "Edge Locations serve CloudFront and Route 53, not full AWS services.",
          "Pricing and service availability vary by region.",
        ]},
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// Module: AWS Essentials
// ----------------------------------------------------------------------------

const awsEssentialsModule: Module = {
  id: "aws-essentials",
  title: "AWS Essentials — The Platform Itself",
  short: "AWS 101",
  description: "How AWS the platform works: accounts, console, CLI, Organizations, billing, and how all the services fit together into one coherent system.",
  category: "core",
  icon: "Layers",
  color: "aws-cyan",
  level: "beginner",
  totalLessons: 5,
  estimatedHours: 3,
  lessons: [
    {
      id: "aws-account-concepts",
      title: "The AWS Account — Your Cloud Boundary",
      level: "beginner",
      duration: 18,
      xp: 10,
      summary: "An AWS account is the container for your resources, billing, and security boundary. Understanding accounts is step one.",
      content: [
        { type: "paragraph", text: "An AWS account is a secure container that holds your AWS resources — EC2 instances, S3 buckets, IAM users, and so on. The account is the unit of billing, the primary security boundary, and the scope within which most resources live. Getting account structure right from day one prevents painful migrations later." },
        { type: "list", items: [
          "Root user — the email/password that created the account. Has full, unrestrictable power.",
          "Account ID — a 12-digit number that uniquely identifies your account.",
          "Billing — all resources in the account are billed together to one payment method.",
          "Account-level services — IAM, Organizations, CloudTrail, Billing — operate at the account level.",
        ]},
        { type: "callout", variant: "danger", title: "Lock down the root user", text: "The root user should almost never be used. Enable MFA, set a strong password, and never create access keys for it. Use IAM Identity Center (formerly SSO) or IAM users for daily work. If your root credentials leak, an attacker can take over the entire account, change the billing, and delete everything in seconds." },
        { type: "keyTakeaways", items: [
          "An AWS account is a billing + security + resource container.",
          "Root user has unrestricted power — protect it with MFA and never use it.",
          "Account ID is a 12-digit number — share it carefully.",
          "One account is fine to start; enterprises use many (see Organizations module).",
        ]},
      ],
    },
    {
      id: "console-cli-sdk",
      title: "Console, CLI, and SDK — Three Ways to Talk to AWS",
      level: "beginner",
      duration: 22,
      xp: 15,
      summary: "Three ways to interact with AWS, each optimized for different use cases. Pick the right tool for the job.",
      content: [
        { type: "paragraph", text: "AWS exposes every service through APIs. The Management Console, the CLI, and the SDKs are three different front-ends to those same APIs. Understanding when to use each makes you dramatically more effective — and the wrong choice is a common source of wasted time and errors." },
        { type: "comparison", columns: ["Tool", "Best for", "When NOT to use"], rows: [
          { label: "Management Console", values: ["Exploring, one-off tasks, learning", "Repetitive or reproducible operations"] },
          { label: "AWS CLI", values: ["Scripting, automation, terminal-based workflows", "Complex stateful applications"] },
          { label: "SDK (Python boto3, JS, Go)", values: ["Application code that calls AWS APIs", "Quick one-off commands"] },
          { label: "CloudFormation / Terraform", values: ["Reproducible infrastructure deployment", "Ad-hoc exploration"] },
        ]},
        { type: "code", language: "bash", code: `# Install the AWS CLI (Linux)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure with your access key and region
aws configure
# AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
# AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# Default region name [None]: us-east-1
# Default output format [None]: json

# Verify it works
aws sts get-caller-identity`, caption: "Installing and configuring the AWS CLI" },
        { type: "callout", variant: "warning", title: "Never commit credentials", text: "Access keys in source code or git history is the #1 cause of AWS account compromise. Use environment variables, IAM roles for EC2/Lambda, or AWS SSO. Rotate keys immediately if any credential is exposed — even briefly." },
        { type: "keyTakeaways", items: [
          "Console = great for exploration, not for reproducibility.",
          "CLI = scripting and ad-hoc operations.",
          "SDK = application code calling AWS APIs.",
          "All three talk to the same underlying API endpoints.",
        ]},
      ],
    },
    {
      id: "organizations",
      title: "AWS Organizations — Multi-Account Strategy",
      level: "intermediate",
      duration: 25,
      xp: 15,
      summary: "How enterprises structure many AWS accounts for security, billing, and isolation.",
      content: [
        { type: "paragraph", text: "As organizations grow, a single AWS account becomes a bottleneck. Different teams need isolation, security teams want blast-radius containment, and finance wants per-team cost allocation. AWS Organizations lets you manage many accounts as a tree, with consolidated billing and centralized governance." },
        { type: "architecture", nodes: [
          { id: "root", label: "Organization Root", type: "org" },
          { id: "master", label: "Management Account", type: "account" },
          { id: "ou-prod", label: "OU: Production", type: "ou" },
          { id: "ou-dev", label: "OU: Development", type: "ou" },
          { id: "ou-sec", label: "OU: Security", type: "ou" },
          { id: "acct-prod-app", label: "Prod-App Account", type: "account" },
          { id: "acct-prod-data", label: "Prod-Data Account", type: "account" },
          { id: "acct-dev-app", label: "Dev-App Account", type: "account" },
          { id: "acct-log", label: "Log Archive Account", type: "account" },
          { id: "acct-audit", label: "Audit Account", type: "account" },
        ], edges: [
          { from: "root", to: "master" },
          { from: "root", to: "ou-prod" },
          { from: "root", to: "ou-dev" },
          { from: "root", to: "ou-sec" },
          { from: "ou-prod", to: "acct-prod-app" },
          { from: "ou-prod", to: "acct-prod-data" },
          { from: "ou-dev", to: "acct-dev-app" },
          { from: "ou-sec", to: "acct-log" },
          { from: "ou-sec", to: "acct-audit" },
        ]},
        { type: "callout", variant: "tip", title: "Recommended account layout", text: "A common pattern: one management account at the top, an 'OU: Security' with log-archive + audit accounts, an 'OU: Production' with separate prod accounts per business unit or workload, and an 'OU: Development' with non-prod accounts. Use Service Control Policies (SCPs) at the OU level to enforce guardrails like 'no production changes from dev accounts'." },
        { type: "keyTakeaways", items: [
          "Organizations lets you manage many AWS accounts as a tree.",
          "Consolidated billing simplifies finance and gives volume discounts.",
          "Service Control Policies enforce org-wide security guardrails.",
          "Multi-account isolation contains blast radius and simplifies per-team ownership.",
        ]},
      ],
    },
    {
      id: "billing-budgets",
      title: "Billing, Budgets, and Cost Awareness",
      level: "beginner",
      duration: 18,
      xp: 10,
      summary: "How AWS billing works, how to avoid surprises, and how to set up budgets and alerts.",
      content: [
        { type: "paragraph", text: "AWS bills you for what you use, measured by the second, hour, GB, or request depending on the service. Without discipline, this can lead to shocking bills. The good news: AWS provides detailed cost visibility and budgets so you can never be surprised — if you set them up before you start building." },
        { type: "list", items: [
          "Pricing models — On-Demand (pay-as-you-go), Reserved (1–3 year commitment, big discount), Spot (unused AWS capacity, up to 90% off, can be terminated).",
          "Free Tier — most services offer a 12-month free tier for new accounts. Useful for learning, dangerous to rely on in production.",
          "AWS Budgets — set custom budgets and get email/SNS alerts when you cross thresholds.",
          "Cost Explorer — visualize spend over time, group by service/tag/region.",
          "Tags — label resources with metadata like team=payments to attribute cost.",
          "Billing alarms via CloudWatch — older but still useful for hard alert thresholds.",
        ]},
        { type: "callout", variant: "danger", title: "Always set a budget on day one", text: "Before building anything in a new AWS account, set a $5 or $10 monthly budget alert. This single action has saved countless engineers from accidentally spending thousands on a misconfigured resource. Budgets cost nothing and take 2 minutes to set up." },
        { type: "keyTakeaways", items: [
          "AWS is pay-as-you-go — measured by second/byte/request.",
          "Three pricing models: On-Demand, Reserved, Spot — each optimized for different workloads.",
          "Always set a budget on day one of a new account.",
          "Tag resources from the start to attribute cost to teams.",
        ]},
      ],
    },
    {
      id: "how-services-fit",
      title: "How AWS Services Fit Together",
      level: "intermediate",
      duration: 20,
      xp: 15,
      summary: "AWS is not 200 isolated services — it's a system. Understand the typical patterns of how services compose.",
      content: [
        { type: "paragraph", text: "AWS has over 200 services, but they are not independent. Most real architectures compose 5–15 services into a coherent system. Understanding the typical patterns — compute + storage + database + network + IAM — is far more valuable than memorizing each service in isolation." },
        { type: "architecture", nodes: [
          { id: "user", label: "User", type: "client" },
          { id: "cdn", label: "CloudFront (CDN)", type: "edge" },
          { id: "dns", label: "Route 53 (DNS)", type: "edge" },
          { id: "waf", label: "WAF", type: "security" },
          { id: "alb", label: "ALB (Load Balancer)", type: "network" },
          { id: "ec2", label: "EC2 / ECS / Lambda", type: "compute" },
          { id: "rds", label: "RDS (Database)", type: "database" },
          { id: "s3", label: "S3 (Objects)", type: "storage" },
          { id: "iam", label: "IAM", type: "security" },
          { id: "cloudtrail", label: "CloudTrail + CloudWatch", type: "observability" },
        ], edges: [
          { from: "user", to: "dns", label: "resolves" },
          { from: "dns", to: "cdn", label: "routes to" },
          { from: "cdn", to: "waf", label: "inspects" },
          { from: "waf", to: "alb", label: "forwards" },
          { from: "alb", to: "ec2", label: "distributes" },
          { from: "ec2", to: "rds", label: "reads/writes" },
          { from: "ec2", to: "s3", label: "stores/fetches" },
          { from: "iam", to: "ec2", label: "grants perms" },
          { from: "iam", to: "rds", label: "grants perms" },
          { from: "cloudtrail", to: "ec2", label: "audits" },
        ], caption: "A typical web application architecture on AWS — every component plays a specific role." },
        { type: "paragraph", text: "Notice the layered design. The user never touches EC2 directly — they go through DNS, CDN, WAF, and load balancer first. Each layer adds a capability: DNS resolves the name, the CDN caches static content, the WAF blocks attacks, the load balancer distributes traffic, and the compute layer (EC2, ECS, or Lambda) runs the actual application logic. Behind the scenes, IAM authorizes every call, and CloudTrail logs everything for audit." },
        { type: "keyTakeaways", items: [
          "AWS services compose into patterns; you don't use them in isolation.",
          "Most web apps follow: DNS → CDN → WAF → LB → compute → database/storage.",
          "IAM and observability are cross-cutting — they touch every service.",
          "Learning these patterns beats memorizing services.",
        ]},
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// Module: IAM
// ----------------------------------------------------------------------------

const iamModule: Module = {
  id: "iam",
  title: "Identity and Access Management (IAM)",
  short: "IAM",
  description: "The most important service in AWS. Get IAM wrong and nothing else matters — get it right and everything else becomes possible. Deep coverage from beginner to expert.",
  category: "security",
  icon: "ShieldCheck",
  color: "aws-rose",
  level: "intermediate",
  totalLessons: 6,
  estimatedHours: 5,
  lessons: [
    {
      id: "iam-fundamentals",
      title: "IAM Fundamentals — Users, Groups, Roles, Policies",
      level: "beginner",
      duration: 25,
      xp: 15,
      summary: "The four core IAM primitives and how they interact. Master this before anything else.",
      content: [
        { type: "paragraph", text: "IAM (Identity and Access Management) controls who can do what in your AWS account. Every API call — whether from the console, CLI, SDK, or another AWS service — passes through IAM for authorization. There are four core primitives you must understand: users, groups, roles, and policies." },
        { type: "comparison", columns: ["Entity", "What it is", "How it authenticates", "When to use"], rows: [
          { label: "User", values: ["An identity for a person or application", "Password (console) or access keys (API)", "Long-lived human users or legacy apps"] },
          { label: "Group", values: ["A collection of users", "Inherits from members", "Grouping humans with same permissions (e.g., 'developers')"] },
          { label: "Role", values: ["An identity that can be assumed temporarily", "STS temporary credentials", "AWS services, cross-account access, SSO"] },
          { label: "Policy", values: ["A JSON document defining permissions", "Attached to user/group/role", "Always — permissions are granted by attaching policies"] },
        ]},
        { type: "code", language: "json", code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-company-documents/*"
    },
    {
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "arn:aws:s3:::my-company-documents/*"
    }
  ]
}`, caption: "A simple IAM policy — allow read/write, deny delete on a specific bucket." },
        { type: "callout", variant: "tip", title: "Prefer roles over users", text: "Modern AWS practice strongly favors roles over long-lived access keys. Roles issue temporary credentials that expire in 1–12 hours, so even if leaked, they self-destruct. Use IAM Identity Center for humans and instance roles / Lambda execution roles for AWS services." },
        { type: "keyTakeaways", items: [
          "IAM = who (identity) can do what (action) on which (resource).",
          "Four primitives: users, groups, roles, policies.",
          "Policies are JSON documents; permissions come ONLY from policies attached to identities or resources.",
          "Roles issue temporary credentials and are the modern best practice.",
        ]},
      ],
    },
    {
      id: "iam-policy-anatomy",
      title: "Anatomy of an IAM Policy",
      level: "intermediate",
      duration: 30,
      xp: 20,
      summary: "Every field in an IAM policy JSON document — what it does and how to write policies that actually work.",
      content: [
        { type: "paragraph", text: "An IAM policy is a JSON document that grants or denies permissions. Understanding every field is essential — a single typo can silently grant unlimited access or break a critical workflow. Let's dissect a real policy." },
        { type: "code", language: "json", code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowReadFromSpecificBucket",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-docs-bucket",
        "arn:aws:s3:::my-docs-bucket/*"
      ],
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "10.0.0.0/8"
        },
        "StringEquals": {
          "aws:RequestedRegion": "us-east-1"
        }
      }
    }
  ]
}`, caption: "A complete IAM policy with all common fields." },
        { type: "list", items: [
          "Version — always \"2012-10-17\". Older versions are deprecated.",
          "Statement — an array of permission rules. Each statement is evaluated independently.",
          "Sid — optional statement ID for human readability.",
          "Effect — \"Allow\" or \"Deny\". Explicit Deny always wins.",
          "Action — the API calls being granted, e.g. \"s3:GetObject\". Use wildcards like \"s3:*\" carefully.",
          "Resource — the ARN of the resource the action applies to. \"*\" means all resources (dangerous).",
          "Condition — optional constraints like source IP, time of day, MFA presence, or tag values.",
        ]},
        { type: "callout", variant: "danger", title: "Explicit Deny always wins", text: "If ANY policy — attached to the user, group, role, or resource — has Effect: Deny for a given action, the request is denied regardless of any Allow statements. This is the basis of security guardrails: you can grant broad access but explicitly deny dangerous actions like iam:CreateUser." },
        { type: "keyTakeaways", items: [
          "Policy = JSON document with Statement array.",
          "Effect + Action + Resource is the core triple — what's allowed on what.",
          "Condition adds contextual constraints (IP, MFA, time, region).",
          "Explicit Deny always wins — use this to enforce security guardrails.",
        ]},
      ],
    },
    {
      id: "least-privilege",
      title: "Least Privilege — The Most Important Security Principle",
      level: "intermediate",
      duration: 22,
      xp: 15,
      summary: "Grant the minimum permissions needed — no more. Why, how, and tools that help.",
      content: [
        { type: "paragraph", text: "Least privilege is the principle of granting an identity only the permissions it actually needs to do its job — and nothing more. It is the single most important security practice in AWS. The opposite — granting broad permissions like AdministratorAccess or s3:* — makes your blast radius huge: one leaked credential can destroy your entire account." },
        { type: "callout", variant: "danger", title: "Why broad access is catastrophic", text: "If a developer's access keys with s3:* permissions leak to GitHub, an attacker can list every bucket in your account, download all customer data, and delete everything within minutes. Least privilege wouldn't have prevented the leak, but it would have limited damage from 'total account destruction' to 'one bucket read'." },
        { type: "list", items: [
          "Start restrictive — begin with no permissions and add only what's needed.",
          "Use AWS managed policies for common patterns (AmazonS3ReadOnlyAccess) as a starting point.",
          "Prefer customer-managed policies for application-specific permissions.",
          "Use IAM Access Analyzer to find unused permissions and refine over time.",
          "Never grant *:* in production. Wildcards in either Action or Resource expand blast radius.",
          "Audit regularly — run IAM Access Analyzer monthly to spot drift.",
        ]},
        { type: "code", language: "json", code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "s3:GetObject"
    ],
    "Resource": "arn:aws:s3:::product-images-prod/uploads/*"
  }]
}`, caption: "A truly least-privilege policy — read-only on one prefix of one bucket. Nothing more." },
        { type: "keyTakeaways", items: [
          "Least privilege = minimum permissions needed, no more.",
          "Broad permissions (*:* or s3:*) massively increase blast radius.",
          "Start restrictive, add only what's needed.",
          "Use IAM Access Analyzer to find and remove unused permissions.",
        ]},
      ],
    },
    {
      id: "roles-sts",
      title: "Roles and Temporary Credentials (STS)",
      level: "intermediate",
      duration: 28,
      xp: 20,
      summary: "How roles work, how STS issues temporary credentials, and why this is the modern way to grant access.",
      content: [
        { type: "paragraph", text: "A role is an identity that doesn't have its own long-term credentials. Instead, a trusted entity (a user, another role, or an AWS service) 'assumes' the role, and AWS Security Token Service (STS) issues temporary credentials valid for 15 minutes to 12 hours. This is dramatically safer than long-lived access keys." },
        { type: "architecture", nodes: [
          { id: "ec2", label: "EC2 Instance", type: "compute" },
          { id: "sts", label: "STS", type: "service" },
          { id: "role", label: "Instance Role", type: "iam" },
          { id: "s3", label: "S3 Bucket", type: "storage" },
        ], edges: [
          { from: "ec2", to: "sts", label: "requests creds" },
          { from: "sts", to: "role", label: "verifies trust" },
          { from: "sts", to: "ec2", label: "returns temp creds" },
          { from: "ec2", to: "s3", label: "uses temp creds" },
        ]},
        { type: "code", language: "bash", code: `# A user assumes a role to get temporary credentials
aws sts assume-role \\
  --role-arn "arn:aws:iam::123456789012:role/CrossAccountAuditor" \\
  --role-session-name "AuditSession"

# Output:
# {
#   "Credentials": {
#     "AccessKeyId": "ASIA...",
#     "SecretAccessKey": "...",
#     "SessionToken": "...",
#     "Expiration": "2026-08-19T14:30:00Z"
#   },
#   "AssumedRoleUser": {
#     "AssumedRoleId": "AROA...:AuditSession",
#     "Arn": "arn:aws:sts::123456789012:assumed-role/CrossAccountAuditor/AuditSession"
#   }
# }`, caption: "Assuming a role returns temporary credentials that expire automatically." },
        { type: "list", items: [
          "Trust policy — defines WHO can assume the role (an AWS principal).",
          "Permissions policy — defines WHAT the assumed role can do.",
          "Session duration — 15 min to 12 hours, configurable per role.",
          "STS is global — temporary credentials work across all regions.",
        ]},
        { type: "callout", variant: "tip", title: "EC2 instance roles are magic", text: "When you attach a role to an EC2 instance, AWS automatically rotates temporary credentials every few hours and exposes them via the instance metadata service at 169.254.169.254. The AWS SDK on the instance picks them up automatically — no access keys ever stored on disk. This is the safest way for EC2 to call AWS APIs." },
        { type: "keyTakeaways", items: [
          "Roles = identities assumed via STS, with temporary credentials.",
          "Trust policy says who can assume; permissions policy says what they can do.",
          "EC2 instance roles eliminate the need to manage access keys on instances.",
          "Temporary credentials expire — much safer than long-lived keys.",
        ]},
      ],
    },
    {
      id: "cross-account",
      title: "Cross-Account Access and Role Chaining",
      level: "advanced",
      duration: 30,
      xp: 25,
      summary: "How identities flow between AWS accounts — and the advanced pattern of role chaining for sensitive workflows.",
      content: [
        { type: "paragraph", text: "Cross-account access is the cornerstone of multi-account architectures. A role in account A grants permission to a role in account B. This lets a single sign-on user in your 'identity' account access resources in dozens of workload accounts without any shared credentials. Role chaining takes this further: assuming role B from role A, then role C from role B, often for break-glass or audit workflows." },
        { type: "code", language: "json", code: `// Trust policy on role in Account B (123456789012)
// This allows role 'Auditor' in Account A to assume it
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam::111111111111:role/Auditor"
    },
    "Action": "sts:AssumeRole"
  }]
}`, caption: "Trust policy: account A's Auditor role can assume this role in account B." },
        { type: "callout", variant: "warning", title: "Role chaining limits", text: "Role chaining (assuming a role from another assumed role, not from a long-term identity) has a hard limit: each chained session is capped at 1 hour regardless of the role's configured max duration. If you need to chain roles for longer workflows, plan to re-assume mid-flight or use a different pattern." },
        { type: "keyTakeaways", items: [
          "Cross-account access: role in account A trusts role in account B.",
          "Trust policy defines who can assume; permissions policy defines what they can do.",
          "Role chaining = assuming a role from an already-assumed role.",
          "Chained sessions are capped at 1 hour — plan accordingly.",
        ]},
      ],
    },
    {
      id: "iam-troubleshooting",
      title: "IAM Troubleshooting — Decoding AccessDenied",
      level: "advanced",
      duration: 28,
      xp: 25,
      summary: "Real-world IAM debugging — when AccessDenied appears, here's the systematic way to find the root cause.",
      content: [
        { type: "paragraph", text: "AccessDenied is the most common error in AWS, and it has many causes: missing policy, explicit deny, condition failure, wrong resource, service-linked role missing, SCP blocking, permission boundary limiting, and more. Senior engineers develop a systematic debugging workflow." },
        { type: "list", items: [
          "Step 1 — Identify the caller: use aws sts get-caller-identity to confirm who you actually are.",
          "Step 2 — Read the exact API call being made, including resource ARN.",
          "Step 3 — Use the IAM Policy Simulator to test what policies actually grant.",
          "Step 4 — Check CloudTrail for the denied request — it shows the exact policy evaluation.",
          "Step 5 — Check for explicit denies, permission boundaries, and SCPs.",
          "Step 6 — Check resource-based policies (e.g., S3 bucket policy) which can also deny.",
          "Step 7 — Check KMS key policies if S3 is encrypted — KMS denial looks identical to S3 denial.",
        ]},
        { type: "code", language: "bash", code: `# Step 1: Who am I?
aws sts get-caller-identity

# Step 2: Test what policies allow (uses IAM Policy Simulator)
aws iam simulate-principal-policy \\
  --policy-source-arn "arn:aws:iam::123456789012:role/MyAppRole" \\
  --action-names "s3:GetObject" \\
  --resource-arns "arn:aws:s3:::my-bucket/file.txt"

# Step 3: Find the denial in CloudTrail
aws logs filter-log-events \\
  --log-group-name CloudTrail/logs \\
  --filter-pattern '{ ($.eventName = "GetObject") && ($.errorCode = "AccessDenied") }'`, caption: "Three commands that solve 90% of IAM mysteries." },
        { type: "callout", variant: "danger", title: "The KMS gotcha", text: "If you can read an S3 object's metadata but get AccessDenied on the object itself, the cause is almost always the KMS key policy — not S3. S3 calls KMS to decrypt; KMS denies; S3 returns AccessDenied. This is one of the most frustrating IAM puzzles and trips up even experienced engineers." },
        { type: "keyTakeaways", items: [
          "AccessDenied has many causes — develop a systematic workflow.",
          "Use sts get-caller-identity, IAM Policy Simulator, and CloudTrail together.",
          "Check SCPs, permission boundaries, and resource-based policies.",
          "If S3 metadata works but object access fails, suspect KMS key policy.",
        ]},
      ],
    },
  ],
};

// Import additional modules from companion files (declared at top of file)

export const modules: Module[] = [
  fundamentalsModule,
  awsEssentialsModule,
  iamModule,
  ec2Module,
  s3Module,
  rdsModule,
  awsCliModule,
  lambdaModule,
  apiGatewayModule,
  networkingModule,
  securityModule,
  containersModule,
  devopsModule,
  aimlModule,
];

// Compute derived stats per module
export const moduleStats = (m: Module) => ({
  totalLessons: m.lessons.length,
  beginnerLessons: m.lessons.filter((l) => l.level === "beginner").length,
  intermediateLessons: m.lessons.filter((l) => l.level === "intermediate").length,
  advancedLessons: m.lessons.filter((l) => l.level === "advanced").length,
  expertLessons: m.lessons.filter((l) => l.level === "expert").length,
  totalXP: m.lessons.reduce((sum, l) => sum + l.xp, 0),
});

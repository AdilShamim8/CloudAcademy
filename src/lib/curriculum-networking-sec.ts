// AWS Curriculum — Part 4: Networking, Security, Containers, DevOps, AI/ML, AWS CLI

import type { Module } from "./curriculum";

export const networkingModule: Module = {
  id: "networking",
  title: "AWS Networking — VPC, Subnets, Routing",
  short: "Networking",
  description: "The networking foundation under everything in AWS. Master VPCs, subnets, route tables, and gateways — or struggle forever.",
  category: "networking",
  icon: "Network",
  color: "aws-cyan",
  level: "intermediate",
  totalLessons: 6,
  estimatedHours: 6,
  lessons: [
    {
      id: "net-fundamentals",
      title: "Networking Fundamentals — IP, CIDR, Ports, DNS",
      level: "beginner",
      duration: 25,
      xp: 15,
      summary: "Before VPCs, you need to understand IP addresses, CIDR notation, ports, and DNS. The foundation of all networking.",
      content: [
        { type: "paragraph", text: "Every AWS resource lives inside a network. To design good AWS architectures, you need to understand the basics of TCP/IP networking: what an IP address is, what CIDR notation means, how ports work, and how DNS translates names to IPs. Without this foundation, VPC will feel like magic — and you'll make costly mistakes." },
        { type: "list", items: [
          "IP address — a unique number identifying a device on a network (e.g., 192.168.1.10).",
          "IPv4 vs IPv6 — IPv4 is 32-bit (4 billion addresses); IPv6 is 128-bit (effectively unlimited).",
          "Private IP ranges — 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (not routable on internet).",
          "Public IP — routable on the internet; assigned by ISPs and AWS.",
          "CIDR notation — 10.0.0.0/16 means 'first 16 bits fixed, last 16 bits variable' = 65,536 addresses.",
          "Port — a number 1-65535 identifying a specific service on a host. 80=HTTP, 443=HTTPS, 22=SSH, 5432=PostgreSQL.",
          "DNS — translates names like example.com to IP addresses like 93.184.216.34.",
          "TCP vs UDP — TCP is reliable, ordered, connection-based. UDP is fire-and-forget, lower latency.",
        ]},
        { type: "code", language: "text", code: `CIDR cheat sheet:
/32  = 1 IP address (e.g., 10.0.0.5/32)
/24  = 256 IPs  (e.g., 10.0.0.0/24 = 10.0.0.0 - 10.0.0.255)
/16  = 65,536 IPs (e.g., 10.0.0.0/16)
/8   = 16,777,216 IPs (e.g., 10.0.0.0/8 = entire 10.x.x.x range)

For VPCs, common choices:
- VPC CIDR: /16 (e.g., 10.0.0.0/16) — gives 65k IPs, plenty
- Subnet CIDR: /24 (e.g., 10.0.1.0/24) — 256 IPs per AZ, easy to reason about
- AWS reserves 5 IPs per subnet (network, broadcast, DNS, plus 2 future use)

Calculate usable hosts in a /N subnet: 2^(32-N) - 5 (for AWS)`, caption: "CIDR cheat sheet — the math behind AWS networking." },
        { type: "callout", variant: "tip", title: "Plan your CIDR ranges up front", text: "Choose your VPC CIDR ranges carefully — you can't easily change them later. Avoid overlapping ranges if you plan to peer VPCs or set up VPNs to on-prem. A common pattern: 10.0.0.0/16 for prod, 10.1.0.0/16 for staging, 10.2.0.0/16 for dev. Coordinate with your networking team if peering to corporate." },
        { type: "keyTakeaways", items: [
          "IP address identifies a device; CIDR defines a range of IPs.",
          "Private IPs (10.x, 172.16-31.x, 192.168.x) don't route on the internet.",
          "Ports (1-65535) identify services on a host.",
          "Plan CIDR ranges up front — they're hard to change later.",
        ]},
      ],
    },
    {
      id: "vpc-basics",
      title: "VPC — Your Private Cloud Network",
      level: "intermediate",
      duration: 28,
      xp: 20,
      summary: "A VPC is your private network in AWS. Understand subnets, route tables, internet gateways, and NAT.",
      content: [
        { type: "paragraph", text: "A VPC (Virtual Private Cloud) is a logically isolated network you define in AWS. All your resources (EC2, RDS, Lambda with VPC config) live inside a VPC. You control IP ranges, routing, gateways, and connectivity. The VPC is the foundation of all AWS networking — getting it right is critical." },
        { type: "architecture", nodes: [
          { id: "vpc", label: "VPC 10.0.0.0/16", type: "vpc" },
          { id: "pub1", label: "Public Subnet 10.0.1.0/24 (AZ-a)", type: "subnet" },
          { id: "pub2", label: "Public Subnet 10.0.2.0/24 (AZ-b)", type: "subnet" },
          { id: "priv1", label: "Private Subnet 10.0.11.0/24 (AZ-a)", type: "subnet" },
          { id: "priv2", label: "Private Subnet 10.0.12.0/24 (AZ-b)", type: "subnet" },
          { id: "db1", label: "DB Subnet 10.0.21.0/24 (AZ-a)", type: "subnet" },
          { id: "db2", label: "DB Subnet 10.0.22.0/24 (AZ-b)", type: "subnet" },
          { id: "igw", label: "Internet Gateway", type: "gateway" },
          { id: "nat", label: "NAT Gateway", type: "gateway" },
          { id: "internet", label: "Internet", type: "external" },
        ], edges: [
          { from: "vpc", to: "pub1" },
          { from: "vpc", to: "pub2" },
          { from: "vpc", to: "priv1" },
          { from: "vpc", to: "priv2" },
          { from: "vpc", to: "db1" },
          { from: "vpc", to: "db2" },
          { from: "vpc", to: "igw" },
          { from: "igw", to: "internet", label: "bidirectional" },
          { from: "pub1", to: "nat" },
          { from: "nat", to: "igw", label: "outbound" },
          { from: "priv1", to: "nat", label: "default route" },
          { from: "priv2", to: "nat", label: "default route" },
        ], caption: "Standard 3-tier VPC: public + private + DB subnets across 2 AZs." },
        { type: "list", items: [
          "VPC — your private network; spans all AZs in a region.",
          "Subnet — a sub-range of the VPC CIDR, lives in ONE AZ.",
          "Route table — defines where traffic from each subnet goes.",
          "Internet Gateway (IGW) — connects your VPC to the internet; attached at VPC level.",
          "NAT Gateway — managed NAT that lets private subnets reach the internet (one per AZ for HA).",
          "Public subnet — has a route to the IGW; instances can have public IPs.",
          "Private subnet — no direct internet route; outbound via NAT.",
          "VPC endpoint — private connection to AWS services (e.g., S3, DynamoDB) without NAT.",
        ]},
        { type: "callout", variant: "info", title: "Subnets are AZ-bound", text: "A subnet exists in exactly one AZ. To deploy across 3 AZs (recommended for HA), you need at least 3 subnets per tier (public, private, db). That's 9 subnets minimum for a production 3-tier app — plan your CIDR ranges accordingly." },
        { type: "keyTakeaways", items: [
          "VPC = your private network in a region.",
          "Subnets = sub-ranges within a VPC, bound to ONE AZ.",
          "IGW connects VPC to internet; NAT lets private subnets reach out.",
          "Public subnet routes to IGW; private routes to NAT.",
        ]},
      ],
    },
    {
      id: "route-tables",
      title: "Route Tables, Gateways, and Traffic Flow",
      level: "intermediate",
      duration: 28,
      xp: 20,
      summary: "How traffic actually flows in a VPC. Master route tables and you understand AWS networking.",
      content: [
        { type: "paragraph", text: "Route tables are the brain of a VPC — they decide where each packet goes. Every subnet is associated with one route table. The route table says 'traffic destined for X should go to Y'. Combined with internet gateways, NAT gateways, and VPC endpoints, route tables control all traffic flow." },
        { type: "code", language: "text", code: `Public subnet route table (10.0.1.0/24):
  Destination     Target
  10.0.0.0/16     local                    <- intra-VPC
  0.0.0.0/0       igw-0abc123              <- internet gateway

Private subnet route table (10.0.11.0/24):
  Destination     Target
  10.0.0.0/16     local                    <- intra-VPC
  0.0.0.0/0       nat-0abc123              <- NAT gateway for outbound
  10.0.21.0/24    eni-0abc (DB subnet)     <- explicit DB route (or just local)

DB subnet route table (10.0.21.0/24):
  Destination     Target
  10.0.0.0/16     local                    <- intra-VPC only, NO internet`, caption: "Three route tables, three patterns — public routes to IGW, private routes to NAT, DB subnet has no internet at all." },
        { type: "list", items: [
          "Local route — every subnet can reach every other subnet in the same VPC, automatically.",
          "Default route 0.0.0.0/0 — the 'catch-all' for traffic going outside the VPC.",
          "Public subnet — has 0.0.0.0/0 → IGW; instances can have public IPs.",
          "Private subnet — has 0.0.0.0/0 → NAT; no public IPs.",
          "DB subnet — typically NO default route at all; truly isolated.",
          "VPC endpoint — a private route to an AWS service (S3, DynamoDB).",
        ]},
        { type: "callout", variant: "tip", title: "NAT vs VPC endpoint cost", text: "NAT Gateways charge per hour (~$32/month) PLUS per-GB processed ($0.045/GB). For high-volume traffic to S3 or DynamoDB from private subnets, a VPC endpoint (Gateway type, free for S3; Interface type, ~$0.01/GB) is dramatically cheaper and more secure." },
        { type: "keyTakeaways", items: [
          "Route tables direct traffic; each subnet has one.",
          "Local route = intra-VPC; default route 0.0.0.0/0 = internet.",
          "Public subnets route to IGW; private route to NAT.",
          "VPC endpoints give private subnets AWS service access without NAT costs.",
        ]},
      ],
    },
    {
      id: "security-groups-nacls",
      title: "Security Groups vs Network ACLs",
      level: "intermediate",
      duration: 22,
      xp: 15,
      summary: "Two types of VPC firewall. Both have their place — know when each matters.",
      content: [
        { type: "paragraph", text: "AWS provides two layers of network firewall. Security groups are stateful, instance-level, allow-only. Network ACLs (NACLs) are stateless, subnet-level, allow + deny. Most architectures use SGs heavily and NACLs rarely — but NACLs matter for blocking specific IPs and as defense in depth." },
        { type: "comparison", columns: ["Property", "Security Group", "Network ACL"], rows: [
          { label: "Layer", values: ["Instance / ENI", "Subnet"] },
          { label: "State", values: ["Stateful (return auto)", "Stateless (must allow both)"] },
          { label: "Rules", values: ["Allow only", "Allow AND deny"] },
          { label: "Evaluation", values: ["All rules apply", "In order, first match wins"] },
          { label: "Applies to", values: ["Specific ENIs", "All instances in subnet"] },
          { label: "Default behavior", values: ["Deny all in/out", "Allow all in/out (VPC default)"] },
        ]},
        { type: "keyTakeaways", items: [
          "Security groups = stateful, instance-level, allow-only — the workhorse.",
          "NACLs = stateless, subnet-level, allow + deny — used rarely, for IP blocking.",
          "Use SGs for app-tier isolation (e.g., app SG can talk to DB SG).",
          "Use NACLs to block specific malicious IPs at the subnet edge.",
        ]},
      ],
    },
    {
      id: "vpc-endpoints-peering",
      title: "VPC Endpoints, Peering, and Transit Gateway",
      level: "advanced",
      duration: 30,
      xp: 25,
      summary: "Connect VPCs to each other and to AWS services privately. Three patterns with different trade-offs.",
      content: [
        { type: "paragraph", text: "As you grow past one VPC, you need ways to connect them. VPC peering connects two VPCs directly (1:1). Transit Gateway acts as a hub-and-spoke router (many:many). VPC endpoints give private access to AWS services without crossing the public internet. Each solves a different connectivity problem." },
        { type: "comparison", columns: ["Pattern", "Topology", "Cost", "When to use"], rows: [
          { label: "VPC Peering", values: ["1:1 VPC connection", "Free (data transfer only)", "Few VPCs (2-5)"] },
          { label: "Transit Gateway", values: ["Hub-and-spoke, many VPCs", "$36/month per attachment + data", "Many VPCs (10+), enterprise scale"] },
          { label: "VPC Endpoint (Gateway)", values: ["Private S3/DynamoDB access", "Free", "Always for S3 from private subnets"] },
          { label: "VPC Endpoint (Interface)", values: ["Private access to other AWS services", "$0.01/GB + hourly", "Private access to most AWS services"] },
          { label: "PrivateLink", values: ["Expose your service privately to other VPCs", "$0.01/GB + hourly", "SaaS providers, shared services"] },
        ]},
        { type: "callout", variant: "warning", title: "Peering has no transitivity", text: "If VPC-A peers with VPC-B, and VPC-B peers with VPC-C, VPC-A cannot reach VPC-C through VPC-B. You'd need to peer A-C directly. For more than 3-4 VPCs, this 'N-squared' problem makes peering impractical — switch to Transit Gateway." },
        { type: "keyTakeaways", items: [
          "VPC peering = 1:1, free, simple — good for ≤5 VPCs.",
          "Transit Gateway = hub-and-spoke for many VPCs.",
          "VPC Gateway Endpoint = free private S3/DynamoDB access.",
          "VPC Interface Endpoints = private access to most AWS services (paid).",
        ]},
      ],
    },
    {
      id: "vpc-production",
      title: "Production VPC Design Patterns",
      level: "expert",
      duration: 35,
      xp: 30,
      summary: "The patterns senior architects use: multi-AZ, multi-tier, hub-and-spoke, hybrid cloud, and micro-segmentation.",
      content: [
        { type: "paragraph", text: "Production VPC design goes beyond basic subnets. Senior architects think about isolation (per-business-unit VPCs), connectivity (hub-and-spoke via Transit Gateway), security (micro-segmentation with SGs), DR (cross-region VPCs with peering or TGW), hybrid (Direct Connect to on-prem), and growth (CIDR planning for years)." },
        { type: "list", items: [
          "Multi-AZ — always 2-3 AZs minimum for HA.",
          "Multi-tier — separate public/private/db subnets for each AZ.",
          "Hub-and-spoke — central 'transit' VPC with TGW for connectivity.",
          "Per-environment VPCs — separate VPCs for dev/staging/prod.",
          "Shared services VPC — central AD, DNS, monitoring for all environments.",
          "VPC sharing — share subnets across accounts in same AWS Organization (RAM).",
          "Hybrid — Direct Connect (1/10 Gbps dedicated line) or Site-to-Site VPN to on-prem.",
          "Egress VPC — central VPC for all outbound internet, with egress firewall.",
          "Ingress VPC — central VPC for all inbound, with WAF and Shield.",
        ]},
        { type: "callout", variant: "tip", title: "Start with a known-good pattern", text: "AWS publishes 'VPC Design Quick Start' patterns. Start with the standard 3-tier multi-AZ pattern (public + private + db × 2-3 AZs). Don't get creative with VPC design on day one — these patterns are battle-tested. Customize only after you understand the trade-offs." },
        { type: "keyTakeaways", items: [
          "Use proven patterns: 3-tier multi-AZ is the default for production.",
          "Hub-and-spoke via Transit Gateway scales to dozens of VPCs.",
          "Separate VPCs per environment (dev/staging/prod).",
          "Shared services VPC for cross-cutting infra (AD, DNS, monitoring).",
        ]},
      ],
    },
  ],
};

export const securityModule: Module = {
  id: "security",
  title: "AWS Security Best Practices",
  short: "Security",
  description: "A dedicated security curriculum covering IAM, encryption, network segmentation, monitoring, and incident response.",
  category: "security",
  icon: "ShieldCheck",
  color: "aws-rose",
  level: "advanced",
  totalLessons: 5,
  estimatedHours: 5,
  lessons: [
    {
      id: "sec-fundamentals",
      title: "The AWS Shared Responsibility Model",
      level: "beginner",
      duration: 18,
      xp: 15,
      summary: "AWS secures the cloud; you secure what's in the cloud. Knowing where the line is drawn is critical.",
      content: [
        { type: "paragraph", text: "AWS operates under a shared responsibility model: AWS secures the underlying infrastructure (physical data centers, hardware, virtualization, network), and you secure everything you put in the cloud (data, IAM, application code, OS patches on EC2). The exact line depends on the service — for EC2 you patch the OS, but for Lambda AWS handles the runtime." },
        { type: "comparison", columns: ["Layer", "IaaS (EC2)", "PaaS (RDS)", "SaaS (S3 static site)"], rows: [
          { label: "Physical data center", values: ["AWS", "AWS", "AWS"] },
          { label: "Network/hypervisor", values: ["AWS", "AWS", "AWS"] },
          { label: "OS patches", values: ["YOU", "AWS", "AWS"] },
          { label: "DB engine patches", values: ["N/A", "AWS", "AWS"] },
          { label: "Application code", values: ["YOU", "YOU", "AWS"] },
          { label: "Data access (IAM)", values: ["YOU", "YOU", "YOU"] },
          { label: "Bucket/table policies", values: ["YOU", "YOU", "YOU"] },
        ]},
        { type: "callout", variant: "danger", title: "The line moves with abstraction", text: "Higher-level services shift more responsibility to AWS, but you ALWAYS own: data classification, IAM, network config (SGs/VPCs), and application logic. Even with Lambda where AWS patches the runtime, you still manage your function code, IAM role, and any dependencies you bundle." },
        { type: "keyTakeaways", items: [
          "AWS secures the cloud; you secure what's IN the cloud.",
          "The line depends on the service — higher abstraction = less for you to manage.",
          "You always own: data classification, IAM, network config, application code.",
          "Understand the model for each service you use.",
        ]},
      ],
    },
    {
      id: "sec-encryption",
      title: "Encryption — At Rest and In Transit",
      level: "intermediate",
      duration: 28,
      xp: 20,
      summary: "Encrypt everything, everywhere. KMS, CloudHSM, TLS, and the patterns for encrypted S3/EBS/RDS.",
      content: [
        { type: "paragraph", text: "Modern AWS security mandates encryption at rest and in transit for all sensitive data. AWS KMS (Key Management Service) is the central key management service — most AWS services integrate with it. TLS handles encryption in transit. Getting encryption right means understanding KMS keys, envelope encryption, and the trade-offs of customer-managed vs AWS-managed keys." },
        { type: "list", items: [
          "AWS-managed keys (aws/s3, aws/rds) — created and rotated by AWS automatically, free.",
          "Customer-managed keys (CMKs) — you control rotation, policy, and access; $1/month + per-use fee.",
          "Envelope encryption — KMS encrypts a data key; the data key encrypts your actual data. Faster for large data.",
          "SSE-S3 — S3 manages keys; simplest. SSE-KMS — use KMS for audit trail. SSE-C — you provide the key.",
          "EBS encryption — encrypts volumes + snapshots + data in transit to EC2.",
          "RDS encryption — must be enabled at creation; cannot add later.",
          "TLS in transit — ACM (AWS Certificate Manager) provides free SSL/TLS certs for AWS services.",
        ]},
        { type: "callout", variant: "info", title: "CMK policy is your audit trail", text: "Using a customer-managed KMS key gives you full CloudTrail audit of who decrypted what data and when. For compliance (HIPAA, PCI, SOC2), this audit trail is often required. AWS-managed keys (aws/s3) work but don't give you per-key policy control or detailed audit." },
        { type: "keyTakeaways", items: [
          "Encrypt at rest AND in transit — both, always, for sensitive data.",
          "KMS is the central key service; most AWS services integrate with it.",
          "Customer-managed keys give audit trail + policy control (compliance).",
          "RDS/EBS encryption must be enabled at creation.",
        ]},
      ],
    },
    {
      id: "sec-network-segmentation",
      title: "Network Segmentation and Zero Trust",
      level: "advanced",
      duration: 30,
      xp: 25,
      summary: "Don't trust the network. Segment with VPCs, security groups, and Zero Trust principles.",
      content: [
        { type: "paragraph", text: "Traditional security relied on a hard outer shell and soft inside — once you got through the firewall, you had access to everything. This fails catastrophically in the cloud. Modern architectures use Zero Trust: every request is authenticated and authorized, regardless of source. Network segmentation (separate VPCs/subnets/SGs per workload) limits blast radius." },
        { type: "list", items: [
          "Tier-based SGs — web SG → app SG → DB SG; each tier can only talk to the next, not skip.",
          "Per-workload VPCs — separate VPC per business unit or app for blast radius containment.",
          "Private subnets for DB/app — no public IPs, no internet route.",
          "VPC endpoints — private access to AWS services without internet/NAT.",
          "Zero Trust principles — verify every request, not just network location.",
          "IAM everywhere — services authenticate to each other via IAM, not network ACLs.",
          "Mutual TLS (mTLS) — both sides verify each other's certs (App Mesh, API Gateway mTLS).",
          "Micro-segmentation — per-instance SGs, not per-subnet, for fine-grained isolation.",
        ]},
        { type: "callout", variant: "tip", title: "Reference SGs instead of CIDRs", text: "In a security group rule, instead of allowing traffic from 10.0.1.0/24, reference the source security group: 'allow traffic from app-sg'. This decouples from IP addresses — if you renumber your network, the SG rules still work. Far more maintainable." },
        { type: "keyTakeaways", items: [
          "Zero Trust: verify every request, regardless of source.",
          "Segment with VPCs (per workload) and SGs (per tier).",
          "Reference SGs by name, not CIDRs, for maintainability.",
          "Private subnets + VPC endpoints = no internet exposure.",
        ]},
      ],
    },
    {
      id: "sec-monitoring",
      title: "Monitoring, Logging, and Detection",
      level: "advanced",
      duration: 28,
      xp: 25,
      summary: "CloudTrail, CloudWatch, GuardDuty, Security Hub — the services that detect problems before customers do.",
      content: [
        { type: "paragraph", text: "Logging and monitoring are how you detect security incidents. CloudTrail records every API call (who did what, when). CloudWatch collects metrics and logs. GuardDuty uses ML to detect threats. Security Hub aggregates findings across services. Config tracks resource configuration changes. Together these form a defense-in-depth monitoring strategy." },
        { type: "list", items: [
          "CloudTrail — audit log of every AWS API call; enable in all regions, all accounts, send to S3.",
          "CloudWatch Logs — application and system logs from EC2/Lambda/etc.",
          "CloudWatch Metrics — CPU, network, custom metrics.",
          "CloudWatch Alarms — trigger SNS/Lambda when metrics cross thresholds.",
          "Config — tracks resource configuration changes over time, with rules to detect drift.",
          "GuardDuty — threat detection for malicious activity (unusual API calls, compromised instances).",
          "Security Hub — central view of security findings across all AWS security services.",
          "Detective — graph-based investigation of security events.",
          "Macie — uses ML to find PII (personally identifiable information) in S3.",
          "Inspector — vulnerability scanning for EC2/ECR.",
        ]},
        { type: "callout", variant: "warning", title: "CloudTrail logs are useless if not reviewed", text: "CloudTrail records everything but you must actively review it. Forward CloudTrail to CloudWatch Logs, set up alerts for suspicious activity (root API calls, IAM changes, failed logins), and review Security Hub findings weekly. Untouched logs are just disk space." },
        { type: "keyTakeaways", items: [
          "CloudTrail = audit log of every AWS API call.",
          "CloudWatch = metrics + logs + alarms.",
          "GuardDuty = ML-based threat detection.",
          "Security Hub = central findings from all security services.",
        ]},
      ],
    },
    {
      id: "sec-incident-response",
      title: "Incident Response in the Cloud",
      level: "expert",
      duration: 32,
      xp: 30,
      summary: "When things go wrong, having a runbook saves your job. The cloud incident response playbook.",
      content: [
        { type: "paragraph", text: "Security incidents will happen. The question is how fast you detect, contain, and recover. Cloud incident response differs from on-prem: you can isolate instances in seconds with SG changes, snapshot compromised resources for forensics, and spin up clean environments quickly. A practiced runbook is the difference between a 2-hour and 2-week incident." },
        { type: "list", items: [
          "Detect — GuardDuty, Security Hub, CloudWatch alarms, user reports.",
          "Contain — change SGs to isolate compromised instances, revoke IAM credentials.",
          "Eradicate — terminate compromised instances, remove malicious IAM users.",
          "Forensics — snapshot EBS volumes, capture memory dumps, preserve CloudTrail logs.",
          "Recover — restore from clean backups, redeploy from known-good AMIs/containers.",
          "Lessons learned — write a post-mortem, update runbooks, automate detection.",
        ]},
        { type: "code", language: "bash", code: `# Contain a compromised EC2 instance: isolate via SG
aws ec2 modify-instance-attribute \\
  --instance-id i-0compromised \\
  --groups sg-isolated

# Revoke compromised IAM access keys
aws iam update-access-key \\
  --access-key-id AKIAIOSFODNN7EXAMPLE \\
  --status Inactive

# Snapshot the instance's EBS for forensics
aws ec2 create-snapshot \\
  --volume-id vol-0compromised \\
  --description "Forensics snapshot of compromised instance"`, caption: "Three commands to contain an incident: isolate, revoke credentials, snapshot for forensics." },
        { type: "callout", variant: "danger", title: "Practice game days", text: "Run quarterly incident response game days. Inject a fake compromised credential, see how fast the team detects it. Most teams discover their detection has gaps only during real incidents — practice surfaces them safely. AWS offers the 'IAM compromisation' scenario in their disaster recovery game days." },
        { type: "keyTakeaways", items: [
          "Incident response: detect → contain → eradicate → forensics → recover.",
          "Cloud advantage: isolate via SG changes, snapshot for forensics, redeploy from clean AMI.",
          "Run quarterly game days to test detection and response.",
          "Write post-mortems and update runbooks after every incident.",
        ]},
      ],
    },
  ],
};

export const containersModule: Module = {
  id: "containers",
  title: "Containers — ECS, ECR, and Fargate",
  short: "Containers",
  description: "From Docker basics to production ECS/Fargate deployments. The modern way to run stateless workloads on AWS.",
  category: "containers",
  icon: "Container",
  color: "aws-violet",
  level: "advanced",
  totalLessons: 5,
  estimatedHours: 5,
  lessons: [
    {
      id: "container-intro",
      title: "What Are Containers? Docker Fundamentals",
      level: "intermediate",
      duration: 25,
      xp: 15,
      summary: "Containers vs VMs, Dockerfiles, images, and registries — the foundation of modern deployment.",
      content: [
        { type: "paragraph", text: "A container is a lightweight, standalone package that includes an application and everything it needs to run: code, runtime, system tools, libraries. Containers share the host OS kernel, so they start in seconds and use far less resources than full VMs. Docker is the most popular container runtime; containerization has become the default way to package modern applications." },
        { type: "comparison", columns: ["Property", "Virtual Machine", "Container"], rows: [
          { label: "Isolation", values: ["Full OS, hypervisor", "Shared kernel, namespace isolation"] },
          { label: "Size", values: ["GBs", "MBs"] },
          { label: "Boot time", values: ["Minutes", "Seconds"] },
          { label: "Density per host", values: ["Low (10s)", "High (100s)"] },
          { label: "Resource overhead", values: ["High", "Very low"] },
          { label: "Portability", values: ["Limited", "Excellent — runs anywhere Docker runs"] },
        ]},
        { type: "code", language: "dockerfile", code: `# Dockerfile for a Node.js API
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build
RUN npm run build

# Run as non-root user for security
USER node
EXPOSE 3000

CMD ["node", "dist/main.js"]`, caption: "A production-quality Dockerfile: small base image, deps cached, non-root user." },
        { type: "keyTakeaways", items: [
          "Containers package app + dependencies, run anywhere.",
          "Containers share kernel with host; much lighter than VMs.",
          "Dockerfile = build instructions; Image = built artifact; Container = running instance.",
          "Production images: small base, non-root user, cached layers.",
        ]},
      ],
    },
    {
      id: "ecr",
      title: "Amazon ECR — Elastic Container Registry",
      level: "intermediate",
      duration: 22,
      xp: 15,
      summary: "Store and serve Docker images on AWS. Like Docker Hub but private, integrated with IAM, and fast.",
      content: [
        { type: "paragraph", text: "Amazon ECR (Elastic Container Registry) is a managed Docker registry. You push images, IAM controls who can pull/push, and ECS/EKS pull images directly. ECR integrates with IAM, has vulnerability scanning, and is fast because images are stored in the same region as your compute." },
        { type: "code", language: "bash", code: `# Authenticate Docker to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Create a repository
aws ecr create-repository --repository-name my-app

# Tag and push an image
docker tag my-app:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest

# Enable vulnerability scanning on push
aws ecr put-image-scanning-configuration \\
  --repository-name my-app \\
  --image-scanning-configuration scanOnPush=true

# List images with critical vulnerabilities
aws ecr describe-images \\
  --repository-name my-app \\
  --filter tagStatus=TAGGED \\
  --query 'imageDetails[?imageScanFindingsSummary.findingSeverityCounts.CRITICAL > \`0\`]'`, caption: "Push to ECR, enable scanning, find images with critical CVEs." },
        { type: "keyTakeaways", items: [
          "ECR = managed Docker registry, integrated with IAM.",
          "Enable scan-on-push to catch vulnerabilities early.",
          "Lifecycle policies delete old images to control cost.",
          "ECR is fast — same region as your compute.",
        ]},
      ],
    },
    {
      id: "ecs-fargate",
      title: "Amazon ECS and Fargate",
      level: "advanced",
      duration: 30,
      xp: 25,
      summary: "ECS orchestration + Fargate serverless containers. Run containers without managing EC2.",
      content: [
        { type: "paragraph", text: "Amazon ECS (Elastic Container Service) is AWS's container orchestrator. You define a task (1+ containers) and a service (how many copies, load balancer, auto scaling). Fargate is the serverless launch type — AWS runs your containers on shared infrastructure, you don't manage EC2. This is the simplest way to run production containers on AWS." },
        { type: "architecture", nodes: [
          { id: "alb", label: "ALB", type: "network" },
          { id: "ecs", label: "ECS Cluster", type: "container" },
          { id: "service", label: "ECS Service (desired: 4)", type: "container" },
          { id: "task1", label: "Task 1 (Fargate)", type: "container" },
          { id: "task2", label: "Task 2 (Fargate)", type: "container" },
          { id: "task3", label: "Task 3 (Fargate)", type: "container" },
          { id: "task4", label: "Task 4 (Fargate)", type: "container" },
          { id: "ecr", label: "ECR (image source)", type: "container" },
          { id: "rds", label: "RDS", type: "database" },
        ], edges: [
          { from: "alb", to: "task1" },
          { from: "alb", to: "task2" },
          { from: "alb", to: "task3" },
          { from: "alb", to: "task4" },
          { from: "ecs", to: "service" },
          { from: "service", to: "task1" },
          { from: "service", to: "task2" },
          { from: "service", to: "task3" },
          { from: "service", to: "task4" },
          { from: "task1", to: "ecr", label: "pulls image" },
          { from: "task1", to: "rds", label: "queries" },
        ]},
        { type: "code", language: "json", code: `{
  "family": "my-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/myAppTaskRole",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:v1.2.3",
      "portMappings": [{ "containerPort": 3000 }],
      "environment": [
        { "name": "NODE_ENV", "value": "production" },
        { "name": "DATABASE_URL", "value": "..." }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}`, caption: "ECS Fargate task definition — container spec + IAM roles + logging." },
        { type: "keyTakeaways", items: [
          "ECS = AWS container orchestrator.",
          "Fargate = serverless containers — no EC2 to manage.",
          "Task definition = spec for 1+ containers. Service = N copies + LB + ASG.",
          "Use CloudWatch Logs for stdout/stderr.",
        ]},
      ],
    },
    {
      id: "ecs-vs-fargate-vs-ec2",
      title: "EC2 vs ECS vs Fargate vs EKS — Choosing",
      level: "advanced",
      duration: 28,
      xp: 25,
      summary: "Four ways to run containers on AWS. The decision tree every architect should know.",
      content: [
        { type: "paragraph", text: "AWS offers four ways to run containers: directly on EC2, on ECS with EC2 hosts, on ECS with Fargate (serverless), or on EKS (Kubernetes). Each has different operational burden, cost, and flexibility. Choosing wrong leads to wasted money or operational pain." },
        { type: "comparison", columns: ["Option", "Ops burden", "Cost", "Flexibility", "When to choose"], rows: [
          { label: "EC2 + Docker", values: ["Highest (you run Docker)", "Low", "Max", "Single container, simple app, weird requirements"] },
          { label: "ECS + EC2", values: ["High (manage hosts)", "Lower (pack more containers per host)", "Medium", "Many containers, want host control, cost optimization"] },
          { label: "ECS + Fargate", values: ["Lowest (serverless)", "Higher per container", "Medium", "Small-medium workloads, no infra management"] },
          { label: "EKS (Kubernetes)", values: ["Highest (full K8s)", "Higher (control plane + nodes)", "Max (K8s ecosystem)", "Need K8s portability, multi-cloud, huge scale"] },
          { label: "App Runner", values: ["Lowest", "Higher", "Low", "Single container, simple HTTP, no tuning needed"] },
          { label: "Lambda", values: ["Lowest", "Low (sporadic) - High (steady)", "Low", "Event-driven, short-running, sporadic traffic"] },
        ]},
        { type: "callout", variant: "tip", title: "Default choice: Fargate", text: "For most new containerized workloads, Fargate is the right default. Lower operational burden, pay-per-use pricing, and integrated with everything. Move to ECS+EC2 only when you have enough containers to make host packing economical, or to EKS only when you need K8s portability or advanced features." },
        { type: "keyTakeaways", items: [
          "Fargate = default for most new containerized workloads (lowest ops burden).",
          "ECS+EC2 = cost optimization at scale (pack many containers per host).",
          "EKS = when you need Kubernetes portability or ecosystem.",
          "Lambda = event-driven, short-lived, sporadic.",
        ]},
      ],
    },
    {
      id: "containers-production",
      title: "Production Containers — CI/CD, Secrets, Blue/Green",
      level: "expert",
      duration: 32,
      xp: 30,
      summary: "Deploying containers like a senior engineer: CodePipeline, secrets management, blue/green, canary.",
      content: [
        { type: "paragraph", text: "Production container deployments need more than just ECS. You need CI/CD pipelines that build, scan, and push images; secrets management that injects credentials at runtime without baking them into images; and deployment strategies (blue/green, canary) that minimize downtime and risk. CodePipeline + CodeBuild + ECS + App Mesh form a complete production pipeline." },
        { type: "list", items: [
          "CI/CD pipeline — CodePipeline orchestrates: source → build → deploy.",
          "Image scanning — ECR scan-on-push + Snyk/Clair for deeper checks.",
          "Secrets — store in Secrets Manager or Parameter Store; inject as env vars at task start.",
          "Blue/Green deployment — CodeDeploy orchestrates new task set + traffic shift + rollback.",
          "Canary — shift 10% → 50% → 100% with automated rollback on alarms.",
          "App Mesh — service mesh for mTLS, traffic shifting, observability.",
          "Service Auto Scaling — scale based on CPU/memory/ALB request count.",
          "Multi-AZ task placement — Fargate spreads tasks across AZs by default.",
        ]},
        { type: "callout", variant: "warning", title: "Never bake secrets into images", text: "Baking database credentials into a Docker image means anyone who pulls the image has them. Even private ECR images can leak (e.g., dev pulls prod image). Store secrets in Secrets Manager or Parameter Store, and inject as environment variables at task start. Rotate secrets regularly." },
        { type: "keyTakeaways", items: [
          "CI/CD: CodePipeline → CodeBuild → ECS deploy.",
          "Scan images on push; reject critical CVEs.",
          "Inject secrets at runtime, never bake into images.",
          "Blue/Green + canary with automated rollback on alarms.",
        ]},
      ],
    },
  ],
};

export const devopsModule: Module = {
  id: "devops",
  title: "DevOps on AWS — CI/CD, IaC, and Automation",
  short: "DevOps",
  description: "Source control, CI/CD pipelines, Infrastructure as Code, deployment strategies — the modern DevOps workflow on AWS.",
  category: "devops",
  icon: "GitBranch",
  color: "aws-amber",
  level: "advanced",
  totalLessons: 5,
  estimatedHours: 5,
  lessons: [
    {
      id: "devops-fundamentals",
      title: "DevOps Fundamentals — The CI/CD Pipeline",
      level: "intermediate",
      duration: 22,
      xp: 15,
      summary: "Source → Build → Test → Deploy. The fundamental pipeline pattern that underlies all DevOps.",
      content: [
        { type: "paragraph", text: "DevOps is the practice of bringing development and operations together through automation. The core artifact is the CI/CD pipeline: source code changes trigger automated builds, tests, and deployments. AWS offers native CI/CD services (CodePipeline, CodeBuild, CodeDeploy) plus integrates with third-party tools like GitHub Actions, Jenkins, and CircleCI." },
        { type: "architecture", nodes: [
          { id: "git", label: "Git Repo (CodeCommit/GitHub)", type: "source" },
          { id: "pipeline", label: "CodePipeline", type: "pipeline" },
          { id: "build", label: "CodeBuild (test + build)", type: "build" },
          { id: "staging", label: "Staging Deploy", type: "deploy" },
          { id: "approval", label: "Manual Approval", type: "gate" },
          { id: "prod", label: "Prod Deploy", type: "deploy" },
        ], edges: [
          { from: "git", to: "pipeline", label: "triggers on push" },
          { from: "pipeline", to: "build" },
          { from: "build", to: "staging" },
          { from: "staging", to: "approval" },
          { from: "approval", to: "prod" },
        ]},
        { type: "list", items: [
          "Continuous Integration (CI) — every push triggers build + tests.",
          "Continuous Delivery (CD) — every successful build is deployable to prod.",
          "Continuous Deployment — every successful build is automatically deployed to prod.",
          "Source control — Git (CodeCommit, GitHub, GitLab).",
          "Build — CodeBuild, GitHub Actions, Jenkins.",
          "Deploy — CodeDeploy, CloudFormation, CDK, ECS, Lambda aliases.",
          "Test — unit, integration, end-to-end.",
        ]},
        { type: "keyTakeaways", items: [
          "CI = automated build + test on every push.",
          "CD = automated deploy (with or without approval gate).",
          "Pipeline stages: source → build → test → staging → approval → prod.",
          "AWS native tools: CodePipeline, CodeBuild, CodeDeploy.",
        ]},
      ],
    },
    {
      id: "infrastructure-as-code",
      title: "Infrastructure as Code — CloudFormation vs CDK vs Terraform",
      level: "advanced",
      duration: 30,
      xp: 25,
      summary: "Three IaC tools, three philosophies. Choose based on team skills and needs.",
      content: [
        { type: "paragraph", text: "Infrastructure as Code (IaC) means defining your infrastructure (VPCs, EC2, RDS, etc.) in code instead of clicking in the console. This gives reproducibility, version control, reviewable changes, and disaster recovery. Three major tools dominate AWS: CloudFormation (AWS native, JSON/YAML), CDK (TypeScript/Python compiles to CloudFormation), and Terraform (multi-cloud, HCL)." },
        { type: "comparison", columns: ["Tool", "Language", "Multi-cloud", "Best for"], rows: [
          { label: "CloudFormation", values: ["JSON/YAML", "AWS only", "Pure AWS, no SDK, simple stacks"] },
          { label: "AWS CDK", values: ["TS/Python/Java/C#", "AWS only", "AWS with full programming language power"] },
          { label: "Terraform", values: ["HCL", "Multi-cloud", "Multi-cloud, hybrid, large teams"] },
          { label: "SAM (Serverless App Model)", values: ["JSON/YAML extension of CFN", "AWS only", "Serverless (Lambda/API GW)"] },
          { label: "Serverless Framework", values: ["YAML", "Multi-cloud", "Serverless, simpler than SAM"] },
        ]},
        { type: "code", language: "typescript", code: `// AWS CDK example: VPC + EC2 + RDS
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);
    
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 3,
      natGateways: 1,  // cost optimization
    });
    
    const db = new rds.DatabaseInstance(this, 'Db', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16 }),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      multiAz: true,
      allocatedStorage: 100,
      storageEncrypted: true,
      deletionProtection: true,
      credentials: rds.Credentials.fromSecret(new secretsmanager.Secret(this, 'DbSecret')),
    });
    
    const instance = new ec2.Instance(this, 'AppServer', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });
    db.connections.allowDefaultPortFrom(instance);
  }
}`, caption: "AWS CDK in TypeScript — full VPC + RDS + EC2 in ~30 lines." },
        { type: "keyTakeaways", items: [
          "IaC = define infrastructure in code, reproducibly.",
          "CloudFormation = AWS native, JSON/YAML.",
          "CDK = full programming language, compiles to CFN.",
          "Terraform = multi-cloud, HCL.",
        ]},
      ],
    },
    {
      id: "deployment-strategies",
      title: "Deployment Strategies — Blue/Green, Canary, Rolling",
      level: "advanced",
      duration: 25,
      xp: 20,
      summary: "Three ways to deploy new code with minimal risk. Each has different downtime and resource cost.",
      content: [
        { type: "paragraph", text: "Deployment strategy determines how new code reaches production. In-place (rolling) replaces instances one at a time — slow, cheap, some risk. Blue/green runs two full environments and switches — instant rollback, 2x resources during deploy. Canary shifts traffic gradually (1% → 10% → 50% → 100%) — best for risk mitigation, needs smart monitoring." },
        { type: "comparison", columns: ["Strategy", "Downtime", "Resource cost", "Rollback speed", "Best for"], rows: [
          { label: "In-place (rolling)", values: ["Brief per instance", "1x", "Slow (re-deploy)", "Steady, low-risk updates"] },
          { label: "Blue/Green", values: ["None (instant cutover)", "2x during deploy", "Instant (switch back)", "Critical updates, easy rollback"] },
          { label: "Canary", values: ["None", "Slightly above 1x", "Fast (shift back)", "Risky changes, A/B testing"] },
          { label: "All-at-once", values: ["Yes (full restart)", "1x", "Slow (re-deploy)", "Dev/test only — never prod"] },
        ]},
        { type: "callout", variant: "danger", title: "All-at-once is for dev only", text: "Deploying all instances at once means downtime and slow rollback. Use it only for dev/test environments. For production, always use blue/green or canary — they cost more during deploy but enable instant rollback, which is priceless." },
        { type: "keyTakeaways", items: [
          "In-place/rolling = cheap, slow rollback.",
          "Blue/green = 2x resources during deploy, instant rollback.",
          "Canary = gradual traffic shift, best for risky changes.",
          "All-at-once = NEVER in production.",
        ]},
      ],
    },
    {
      id: "monitoring-observability",
      title: "Observability — Logs, Metrics, Traces",
      level: "advanced",
      duration: 28,
      xp: 25,
      summary: "Modern observability is three signals: logs, metrics, and traces. CloudWatch + X-Ray give you all three.",
      content: [
        { type: "paragraph", text: "Observability means understanding what's happening inside a system from the outside. Three signals form the modern observability triad: logs (discrete events), metrics (aggregated numbers), and traces (request flows across services). Together they let you diagnose any issue. CloudWatch Logs handles logs, CloudWatch Metrics handles metrics, X-Ray handles traces." },
        { type: "comparison", columns: ["Signal", "What it tells you", "AWS service", "Example"], rows: [
          { label: "Logs", values: ["Discrete events with context", "CloudWatch Logs", "User 42 logged in at 14:32:01"] },
          { label: "Metrics", values: ["Aggregated numbers over time", "CloudWatch Metrics", "p99 latency = 250ms"] },
          { label: "Traces", values: ["Request flow across services", "X-Ray", "GET /api/users → Lambda(40ms) → DynamoDB(15ms)"] },
        ]},
        { type: "keyTakeaways", items: [
          "Three observability signals: logs, metrics, traces.",
          "CloudWatch Logs = events; Metrics = numbers; X-Ray = traces.",
          "Set alarms on metrics; correlate with logs/traces during incidents.",
          "Distributed tracing is essential for microservices.",
        ]},
      ],
    },
    {
      id: "gitops",
      title: "GitOps and Advanced Deployment Patterns",
      level: "expert",
      duration: 30,
      xp: 30,
      summary: "Git as the single source of truth. Flux, ArgoCD, and the modern declarative deployment pattern.",
      content: [
        { type: "paragraph", text: "GitOps is a deployment pattern where Git is the single source of truth for both application code and infrastructure. An agent (Flux, ArgoCD) continuously reconciles the cluster state with what's in Git — if someone makes a manual change, it's reverted. This gives full audit trail, easy rollback (revert the commit), and forces all changes through pull requests." },
        { type: "list", items: [
          "Declarative — Git describes desired state, not steps.",
          "Pull-based — agent in cluster pulls changes, not push from CI.",
          "Continuous reconciliation — drift is auto-corrected.",
          "Full audit trail — every change is a Git commit.",
          "Easy rollback — revert the commit, agent reverts the cluster.",
          "Flux / ArgoCD — popular GitOps tools for Kubernetes.",
          "For ECS/Lambda — use CodePipeline with manual approval gates.",
        ]},
        { type: "callout", variant: "tip", title: "GitOps for ECS", text: "GitOps is most mature in Kubernetes, but the pattern works anywhere. For ECS, store task definitions in Git, deploy via CodePipeline that reads from Git. Any out-of-band change is detected via Config and reported. While you can't auto-revert ECS like K8s, you get the audit + review benefits." },
        { type: "keyTakeaways", items: [
          "GitOps = Git as single source of truth, declarative, pull-based.",
          "Drift is auto-corrected by reconciler (Flux/ArgoCD).",
          "Every change is a PR — full audit + review.",
          "Rollback = git revert + agent reconciles.",
        ]},
      ],
    },
  ],
};

export const aimlModule: Module = {
  id: "aiml",
  title: "AI/ML on AWS — Infrastructure for ML Developers",
  short: "AI/ML",
  description: "How AWS infrastructure concepts apply to machine learning workloads: data pipelines, model APIs, inference services, scalable AI.",
  category: "aiml",
  icon: "BrainCircuit",
  color: "aws-violet",
  level: "advanced",
  totalLessons: 5,
  estimatedHours: 5,
  lessons: [
    {
      id: "aiml-landscape",
      title: "The AWS AI/ML Service Landscape",
      level: "intermediate",
      duration: 25,
      xp: 15,
      summary: "Three layers of AWS AI/ML: infrastructure (SageMaker, EC2 P-instances), services (Bedrock, Comprehend, Rekognition), and frameworks.",
      content: [
        { type: "paragraph", text: "AWS offers AI/ML services at three abstraction layers. At the bottom: raw infrastructure (EC2 with GPUs, EFA networking, FSx for storage). In the middle: SageMaker, a managed platform that handles training, hosting, and MLOps. At the top: pre-built AI services (Bedrock for LLMs, Comprehend for NLP, Rekognition for vision) — no ML expertise needed. ML engineers and platform engineers pick different layers based on their needs." },
        { type: "comparison", columns: ["Layer", "Services", "Use case", "Skill level"], rows: [
          { label: "Infrastructure", values: ["EC2 P/G instances, EFA, FSx, S3", "Train custom models from scratch", "ML engineer + platform engineer"] },
          { label: "Platform", values: ["SageMaker (Studio, Training, Hosting, Pipelines)", "Full ML lifecycle with managed infra", "ML engineer"] },
          { label: "Services", values: ["Bedrock, Comprehend, Rekognition, Transcribe, Polly", "Add AI capabilities without ML", "Application developer"] },
          { label: "Frameworks", values: ["PyTorch, TensorFlow, Hugging Face on AWS", "Use familiar ML frameworks on AWS", "ML engineer"] },
        ]},
        { type: "keyTakeaways", items: [
          "Three layers: infrastructure → platform → services.",
          "SageMaker = full ML lifecycle management.",
          "Bedrock = managed LLMs (Claude, Llama, etc.) via API.",
          "EC2 P-instances (P5, G5) = raw GPU compute for training.",
        ]},
      ],
    },
    {
      id: "aiml-data-pipeline",
      title: "ML Data Pipelines on AWS",
      level: "advanced",
      duration: 30,
      xp: 25,
      summary: "S3 as the data lake, Glue for ETL, SageMaker Feature Store for shared features. The reference ML data architecture.",
      content: [
        { type: "paragraph", text: "ML workloads need data — lots of it, organized and accessible. The reference AWS architecture: S3 as the central data lake (raw, curated, and feature zones), AWS Glue for ETL, SageMaker Feature Store for shared features across teams, and Athena for ad-hoc SQL queries. This pattern scales to petabytes and lets data scientists, ML engineers, and analysts all work on the same data." },
        { type: "architecture", nodes: [
          { id: "sources", label: "Data Sources (apps, logs, IoT)", type: "source" },
          { id: "s3-raw", label: "S3: Raw Zone", type: "storage" },
          { id: "glue", label: "AWS Glue (ETL)", type: "process" },
          { id: "s3-curated", label: "S3: Curated Zone", type: "storage" },
          { id: "feature-store", label: "SageMaker Feature Store", type: "platform" },
          { id: "training", label: "SageMaker Training", type: "platform" },
          { id: "model", label: "Trained Model", type: "platform" },
          { id: "endpoint", label: "SageMaker Endpoint", type: "platform" },
          { id: "app", label: "Application / API", type: "compute" },
        ], edges: [
          { from: "sources", to: "s3-raw" },
          { from: "s3-raw", to: "glue" },
          { from: "glue", to: "s3-curated" },
          { from: "s3-curated", to: "feature-store" },
          { from: "feature-store", to: "training" },
          { from: "training", to: "model" },
          { from: "model", to: "endpoint" },
          { from: "endpoint", to: "app" },
        ]},
        { type: "keyTakeaways", items: [
          "S3 = central data lake (raw, curated, feature zones).",
          "Glue = managed ETL (Spark).",
          "SageMaker Feature Store = shared, versioned features.",
          "SageMaker Training + Endpoint = managed ML lifecycle.",
        ]},
      ],
    },
    {
      id: "aiml-inference",
      title: "Model Inference — Real-Time vs Batch vs Serverless",
      level: "advanced",
      duration: 28,
      xp: 25,
      summary: "Three ways to serve ML models: real-time endpoints, batch transforms, and serverless. Pick by latency and traffic pattern.",
      content: [
        { type: "paragraph", text: "After training a model, you need to serve predictions. Three patterns dominate. Real-time endpoints (SageMaker Hosting) keep the model loaded and serve predictions with low latency — best for user-facing apps. Batch transforms run predictions on a dataset in bulk — best for nightly scoring. Serverless (Lambda + small model, or Bedrock API) scales to zero — best for sporadic traffic." },
        { type: "comparison", columns: ["Pattern", "Latency", "Cost", "When to use"], rows: [
          { label: "Real-time endpoint", values: ["<100ms", "Hourly (always-on)", "User-facing apps, steady traffic"] },
          { label: "Batch transform", values: ["Minutes-hours", "Per job", "Nightly scoring, bulk inference"] },
          { label: "Serverless (Lambda)", values: ["100ms-1s (cold start)", "Per request", "Sporadic traffic, small models"] },
          { label: "Bedrock API", values: ["Sub-second to seconds", "Per token", "LLM inference, no model hosting"] },
          { label: "ECS/EKS + GPU", values: ["<50ms", "Hourly", "Need full control over serving stack"] },
        ]},
        { type: "keyTakeaways", items: [
          "Real-time endpoint = always-on, low-latency.",
          "Batch = bulk processing, scheduled.",
          "Serverless = scales to zero, good for sporadic traffic.",
          "Bedrock = managed LLM API, no hosting required.",
        ]},
      ],
    },
    {
      id: "aiml-secure",
      title: "Secure AI Workloads",
      level: "expert",
      duration: 30,
      xp: 30,
      summary: "Securing ML systems: data access, model IP, inference abuse, prompt injection. New attack surfaces for new technology.",
      content: [
        { type: "paragraph", text: "ML workloads introduce new attack surfaces beyond traditional security. Training data may be sensitive (PII, medical). Model weights are valuable IP. Inference endpoints can be abused for extraction attacks. LLM-based apps face prompt injection and jailbreaking. Securing ML means extending least privilege to data, models, and prompts." },
        { type: "list", items: [
          "Training data — encrypt with KMS, restrict via IAM, audit access via CloudTrail.",
          "Model artifacts — store in S3 with KMS, restrict ECR push/pull, encrypt EBS on training instances.",
          "Inference endpoints — private VPC, IAM auth, throttling, input validation.",
          "Prompt injection — sanitize inputs, use system prompts defensively, log all prompts.",
          "PII in prompts — use Comprehend to detect and redact PII before sending to LLM.",
          "Bedrock Guardrails — content filters, topic denial, PII redaction built-in.",
          "Model cards — document training data, intended use, limitations for compliance.",
          "SageMaker Model Cards + Model Dashboard for governance.",
        ]},
        { type: "callout", variant: "danger", title: "Prompt injection is real", text: "LLM-based apps that take user input and include it in prompts are vulnerable to prompt injection: a user tricking the model into ignoring instructions or revealing secrets. Defenses: separate system/user prompts, validate outputs, use Bedrock Guardrails, never let LLM output directly trigger privileged actions without review." },
        { type: "keyTakeaways", items: [
          "ML adds attack surfaces: data, models, prompts.",
          "Encrypt training data and model artifacts with KMS.",
          "Private VPC + IAM for inference endpoints.",
          "Defend against prompt injection: separate prompts, validate outputs, use Guardrails.",
        ]},
      ],
    },
    {
      id: "aiml-cost",
      title: "Cost Optimization for ML Workloads",
      level: "expert",
      duration: 28,
      xp: 25,
      summary: "ML is expensive. Spot training, right-sized instances, and managed alternatives can cut bills by 70%+.",
      content: [
        { type: "paragraph", text: "ML workloads are among the most expensive in AWS — GPU instances cost $5-30+/hour. Without careful optimization, ML bills explode. Key strategies: Spot Instances for training (70-90% savings with checkpointing), right-sized inference endpoints based on actual traffic, SageMaker Savings Plans for steady workloads, and managed services (Bedrock) when they're cheaper than self-hosting." },
        { type: "list", items: [
          "Spot training — 70-90% savings, use checkpointing to resume after interruption.",
          "Right-size endpoints — start small, scale based on CloudWatch metrics.",
          "SageMaker Inference Recommender — auto-recommends cheapest instance meeting latency target.",
          "Multi-model endpoints — one endpoint serves multiple models (saves idle instances).",
          "Bedrock vs self-hosting — for sporadic LLM usage, Bedrock is often cheaper than running your own GPUs.",
          "Savings Plans — commit 1-3 years for 50-72% off steady inference workloads.",
          "Stop dev endpoints — automate stopping SageMaker Studio + dev endpoints at night.",
          "Compress models — quantization and distillation reduce inference cost dramatically.",
        ]},
        { type: "callout", variant: "warning", title: "Don't leave Studio running", text: "SageMaker Studio apps cost ~$0.50-$5/hour depending on instance. Forgetting to stop them overnight = $10-50/day wasted. Use lifecycle configs to auto-stop idle Studio apps. Same for dev endpoints and notebook instances." },
        { type: "keyTakeaways", items: [
          "ML is expensive — Spot training saves 70-90%.",
          "Right-size inference endpoints; use Inference Recommender.",
          "Multi-model endpoints save on idle capacity.",
          "Auto-stop dev environments to avoid overnight waste.",
        ]},
      ],
    },
  ],
};

export const awsCliModule: Module = {
  id: "aws-cli",
  title: "AWS CLI — Mastery and Automation",
  short: "AWS CLI",
  description: "The AWS Command Line Interface — your primary tool for scripting and automation. From basics to advanced scripting.",
  category: "core",
  icon: "Terminal",
  color: "aws-orange",
  level: "intermediate",
  totalLessons: 4,
  estimatedHours: 3,
  lessons: [
    {
      id: "cli-install-config",
      title: "Installing and Configuring the AWS CLI",
      level: "beginner",
      duration: 18,
      xp: 10,
      summary: "Install, configure with profiles, and verify your setup. The first step in any AWS automation journey.",
      content: [
        { type: "paragraph", text: "The AWS CLI is your gateway to scripting AWS. Every example in this curriculum uses it. Mastering the CLI makes you dramatically more productive than clicking through the console — and is a prerequisite for any automation work." },
        { type: "code", language: "bash", code: `# Install on Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# Install on macOS
brew install awscli

# Configure (interactive — prompts for key, secret, region, format)
aws configure
# AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
# AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# Default region name [None]: us-east-1
# Default output format [None]: json

# Verify
aws sts get-caller-identity
# {
#   "UserId": "AIDAIOSFODNN7EXAMPLE",
#   "Account": "123456789012",
#   "Arn": "arn:aws:iam::123456789012:user/alice"
# }`, caption: "Install and verify the AWS CLI." },
        { type: "callout", variant: "tip", title: "Use named profiles for multiple accounts", text: "If you work with multiple AWS accounts (dev/prod/personal/client), use named profiles. Run `aws configure --profile prod`, then `aws s3 ls --profile prod`. Set AWS_PROFILE env var to switch defaults. This avoids credential confusion that plagues multi-account users." },
        { type: "keyTakeaways", items: [
          "Install via package manager (Linux/macOS) or installer (Windows).",
          "Configure with `aws configure` — stores credentials in ~/.aws/credentials.",
          "Use named profiles for multi-account access.",
          "Verify with `aws sts get-caller-identity`.",
        ]},
      ],
    },
    {
      id: "cli-output-query",
      title: "Output Formats and JMESPath Querying",
      level: "intermediate",
      duration: 22,
      xp: 15,
      summary: "JSON, table, text output formats, and the powerful --query JMESPath filter for extracting data.",
      content: [
        { type: "paragraph", text: "The CLI returns JSON by default, but you can request table or text. More importantly, the --query parameter uses JMESPath to extract exactly the data you need — no more parsing JSON in bash. This transforms the CLI from a wrapper into a powerful data tool." },
        { type: "code", language: "bash", code: [
          "# Default JSON output",
          "aws ec2 describe-instances",
          "",
          "# Table output — human readable",
          "aws ec2 describe-instances --output table",
          "",
          "# Text output — script-friendly",
          "aws ec2 describe-instances --output text",
          "",
          "# --query with JMESPath — extract specific fields",
          "aws ec2 describe-instances \\",
          "  --query 'Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]' \\",
          "  --output text",
          "# i-0abc123      running     t3.micro",
          "# i-0def456      stopped     t3.small",
          "",
          "# Filter running instances only",
          "aws ec2 describe-instances \\",
          "  --filters \"Name=instance-state-name,Values=running\" \\",
          "  --query 'Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]' \\",
          "  --output table",
          "",
          "# Get a specific bucket's total size (sum of all object sizes)",
          "aws s3api list-objects \\",
          "  --bucket my-bucket \\",
          "  --query 'sum(Contents[*].Size)'",
        ].join("\n") },
        { type: "keyTakeaways", items: [
          "Output formats: json (default), table, text, yaml.",
          "--query uses JMESPath — powerful filtering/extraction.",
          "Use --filters for server-side filtering (cheaper).",
          "Combine --filters + --query for efficient CLI scripts.",
        ]},
      ],
    },
    {
      id: "cli-scripting",
      title: "Scripting and Automation with the CLI",
      level: "advanced",
      duration: 25,
      xp: 20,
      summary: "Use the CLI in bash scripts: loops, error handling, idempotency. The patterns for real automation.",
      content: [
        { type: "paragraph", text: "Once you master --query, the CLI becomes a powerful scripting tool. Common patterns: loop over a list of resources to perform an action, check state before acting, handle errors gracefully, make operations idempotent so re-running is safe. These patterns turn one-off commands into reliable automation." },
        { type: "code", language: "bash", code: `#!/bin/bash
# Stop all running EC2 instances in a region (with safety checks)
set -euo pipefail
REGION="\${1:-us-east-1}"

echo "Finding running instances in $REGION..."

INSTANCE_IDS=$(aws ec2 describe-instances \\
  --region "$REGION" \\
  --filters "Name=instance-state-name,Values=running" \\
  --query 'Reservations[*].Instances[*].InstanceId' \\
  --output text)

if [ -z "$INSTANCE_IDS" ]; then
  echo "No running instances found."
  exit 0
fi

echo "Found instances: $INSTANCE_IDS"
read -p "Stop all? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Aborted."
  exit 1
fi

# Stop them (idempotent — stopping an already-stopped instance is OK)
for ID in $INSTANCE_IDS; do
  echo "Stopping $ID..."
  aws ec2 stop-instances --instance-ids "$ID" --region "$REGION"
done

echo "Done."`, caption: "A production-quality bash script with safety checks." },
        { type: "keyTakeaways", items: [
          "Use set -euo pipefail for safe bash scripts.",
          "Always confirm before destructive operations.",
          "Make operations idempotent — re-running should be safe.",
          "Loop with --query output for bulk operations.",
        ]},
      ],
    },
    {
      id: "cli-advanced",
      title: "Advanced CLI — Waiters, Pagination, and Customization",
      level: "advanced",
      duration: 25,
      xp: 20,
      summary: "Waiters block until a resource reaches a state. Pagination handles large result sets. Both are essential for serious automation.",
      content: [
        { type: "paragraph", text: "Two CLI features separate casual users from pros: waiters and pagination. Waiters block until a resource reaches a desired state (e.g., instance running, stack created) — no more sleep + retry loops. Pagination automatically fetches all pages of large results — no more IsTruncated handling." },
        { type: "code", language: "bash", code: `# Wait for an EC2 instance to be running
aws ec2 start-instances --instance-ids i-0abc123
aws ec2 wait instance-running --instance-ids i-0abc123
echo "Instance is now running!"

# Wait for RDS to be available
aws rds wait db-instance-available --db-instance-identifier prod-db

# Wait for CloudFormation stack to complete
aws cloudformation wait stack-create-complete --stack-name my-stack

# Pagination is automatic — list all S3 objects even if 100k+
aws s3api list-objects-v2 --bucket big-bucket --query 'Contents[*].Key'

# Custom pagination size
aws s3api list-objects-v2 --bucket big-bucket --page-size 100

# Process all EC2 instances across ALL regions
for REGION in $(aws ec2 describe-regions --query 'Regions[*].RegionName' --output text); do
  echo "=== $REGION ==="
  aws ec2 describe-instances --region "$REGION" \\
    --query 'Reservations[*].Instances[*].InstanceId' --output text
done`, caption: "Waiters and pagination — the pro CLI features." },
        { type: "keyTakeaways", items: [
          "Waiters block until a state is reached — no sleep loops.",
          "Pagination is automatic — handles 100k+ results.",
          "Loop regions for global sweeps.",
          "Combine waiters + pagination for robust automation.",
        ]},
      ],
    },
  ],
};

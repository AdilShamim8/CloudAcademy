// AWS Curriculum — Part 2: EC2, S3, RDS modules
// Imported and merged into the modules array in curriculum.ts

import type { Module } from "./curriculum";

export const ec2Module: Module = {
  id: "ec2",
  title: "Amazon EC2 — Elastic Compute Cloud",
  short: "EC2",
  description: "Virtual servers in the cloud. The most fundamental AWS compute service — learn it deeply because everything else builds on these concepts.",
  category: "compute",
  icon: "Server",
  color: "aws-orange",
  level: "intermediate",
  totalLessons: 6,
  estimatedHours: 6,
  lessons: [
    {
      id: "ec2-intro",
      title: "What Is EC2? The Virtual Server",
      level: "beginner",
      duration: 22,
      xp: 15,
      summary: "EC2 lets you rent virtual servers by the second. Understand what an instance is, what an AMI is, and how they relate.",
      content: [
        { type: "paragraph", text: "Amazon EC2 (Elastic Compute Cloud) is AWS's virtual server service. An EC2 instance is a virtual machine running on AWS hardware, in an AWS data center, that you control completely. You choose the operating system, install software, open ports, and run any workload you could run on a physical server. The difference is elasticity — you can launch 1 or 1,000 instances in seconds and stop paying the moment you stop them." },
        { type: "list", items: [
          "Instance — a single running virtual machine.",
          "AMI (Amazon Machine Image) — a template containing the OS, software, and configuration. Used to launch instances.",
          "Instance type — the hardware spec (CPU, RAM, network). Examples: t3.micro, m5.xlarge, c6g.2xlarge.",
          "Key pair — SSH key used to log in. AWS stores the public key; you keep the private key safe.",
          "Security group — a virtual firewall controlling inbound/outbound traffic.",
          "EBS volume — the persistent disk attached to the instance.",
          "User data — a script run automatically on first boot (e.g., install Apache).",
        ]},
        { type: "code", language: "bash", code: `# Launch a simple web server instance using the AWS CLI
aws ec2 run-instances \\
  --image-id ami-0c7217cdde317cfec \\
  --instance-type t3.micro \\
  --key-name my-key-pair \\
  --security-group-ids sg-0123456789abcdef0 \\
  --subnet-id subnet-0123456789abcdef0 \\
  --user-data file://userdata.sh \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=web-server-01}]'

# userdata.sh contents:
# #!/bin/bash
# yum install -y httpd
# systemctl start httpd
# systemctl enable httpd
# echo "<h1>Hello from $(hostname -f)</h1>" > /var/www/html/index.html`, caption: "Launch an EC2 instance with a user-data script that installs Apache." },
        { type: "callout", variant: "tip", title: "User data is a superpower", text: "User data runs as root on first boot. You can install packages, configure services, and register with monitoring — all without ever SSHing in. Combined with Auto Scaling, this lets you launch fully configured servers in seconds." },
        { type: "keyTakeaways", items: [
          "EC2 = virtual servers, billed by the second.",
          "AMI = the OS template. Instance type = the hardware spec.",
          "Key pair = SSH credentials. Security group = firewall.",
          "User data = auto-runs on first boot — powerful for automation.",
        ]},
      ],
    },
    {
      id: "ec2-instance-types",
      title: "Instance Types — Choosing the Right Hardware",
      level: "intermediate",
      duration: 25,
      xp: 15,
      summary: "AWS has 500+ instance types. Learn the naming convention and the major families so you can pick the right one without memorizing.",
      content: [
        { type: "paragraph", text: "EC2 instance type names look like 'm5.xlarge' or 'c6g.2xlarge'. Once you learn the pattern, you can decode any instance type without memorizing specs. The first letter tells you the family (general purpose, compute, memory, etc.), the number tells you the generation, and the suffix tells you the size." },
        { type: "comparison", columns: ["Family", "Optimized for", "Example use case"], rows: [
          { label: "t3 / t4g", values: ["Bursty general workloads", "Dev servers, low-traffic web apps"] },
          { label: "m5 / m6", values: ["Balanced CPU/RAM", "Web/app servers, mid-size databases"] },
          { label: "c5 / c6", values: ["Compute-bound", "Batch processing, gaming servers"] },
          { label: "r5 / r6", values: ["Memory-bound", "In-memory databases (Redis), SAP HANA"] },
          { label: "p4 / g5", values: ["GPU compute", "ML training, rendering"] },
          { label: "i3 / i4", values: ["Local NVMe SSD", "NoSQL databases (Cassandra)"] },
          { label: "x2", values: ["Massive memory", "SAP HANA XL, large RDBMS"] },
          { label: "hpc6 / c6gn", values: ["High-performance networking", "HPC, tightly-coupled clusters"] },
        ]},
        { type: "list", items: [
          "First letter = family (m=general, c=compute, r=RAM, p=GPU, i=io).",
          "Number = generation (newer is generally faster/cheaper per unit).",
          "Suffix 'g' = AWS Graviton ARM processor (often 20-40% cheaper than Intel).",
          "Suffix 'i' = Intel, 'a' = AMD.",
          "Size = nano, micro, small, medium, large, xlarge, 2xlarge, 4xlarge, ..., 24xlarge.",
        ]},
        { type: "callout", variant: "tip", title: "Start with t3.micro, scale up if needed", text: "For most web apps and dev workloads, t3.micro or t3.small is plenty. Use CloudWatch metrics to identify bottlenecks — high CPU = move to c5, high RAM = move to r5. Never size for peak upfront; that's the on-prem mindset. Cloud lets you resize in minutes." },
        { type: "keyTakeaways", items: [
          "Instance type names encode family + generation + size.",
          "Major families: t (burstable), m (general), c (compute), r (memory), p (GPU).",
          "Graviton (g suffix) ARM instances are often 20-40% cheaper.",
          "Start small and right-size based on metrics — that's the cloud way.",
        ]},
      ],
    },
    {
      id: "ec2-storage-ebs",
      title: "EBS Volumes and Snapshots",
      level: "intermediate",
      duration: 25,
      xp: 15,
      summary: "Persistent disk storage for EC2. Different volume types, snapshots, and how to choose.",
      content: [
        { type: "paragraph", text: "EBS (Elastic Block Store) volumes are virtual hard disks attached to an EC2 instance. They persist independently of the instance — you can stop the instance and the data stays. EBS volumes live in one AZ (not multi-AZ by default) and can be detached from one instance and reattached to another." },
        { type: "comparison", columns: ["Volume type", "Best for", "Max IOPS", "Price"], rows: [
          { label: "gp3 (general SSD)", values: ["Most workloads, boot volumes", "16,000", "Lowest SSD option"] },
          { label: "io2 Block Express", values: ["Mission-critical, latency-sensitive DBs", "256,000", "Highest"] },
          { label: "st1 (throughput HDD)", values: ["Big data, data warehouses, logs", "—", "Medium"] },
          { label: "sc1 (cold HDD)", values: ["Lowest-cost archival", "—", "Lowest"] },
        ]},
        { type: "code", language: "bash", code: `# Create a 100GB gp3 volume
aws ec2 create-volume \\
  --availability-zone us-east-1a \\
  --size 100 \\
  --volume-type gp3 \\
  --iops 3000 \\
  --throughput 125

# Snapshot a volume (backup)
aws ec2 create-snapshot \\
  --volume-id vol-0abc123 \\
  --description "Daily backup of db-data volume"

# Copy snapshot to another region for DR
aws ec2 copy-snapshot \\
  --source-region us-east-1 \\
  --source-snapshot-id snap-0abc123 \\
  --destination-region eu-west-1 \\
  --description "DR copy of db-data"`, caption: "Create, snapshot, and replicate EBS volumes." },
        { type: "callout", variant: "warning", title: "Snapshots are incremental", text: "EBS snapshots are incremental — only the changed blocks since the last snapshot are stored. The first snapshot is full; subsequent snapshots store only deltas. This makes daily snapshots cheap, but you can't delete just the 'middle' snapshot — AWS manages the dependency chain automatically." },
        { type: "keyTakeaways", items: [
          "EBS volumes are AZ-bound virtual disks attached to EC2 instances.",
          "gp3 is the modern default; io2 for highest performance; st1/sc1 for bulk storage.",
          "Snapshots are incremental backups stored in S3 (managed by AWS).",
          "Copy snapshots across regions for disaster recovery.",
        ]},
      ],
    },
    {
      id: "ec2-security-groups",
      title: "Security Groups — The EC2 Firewall",
      level: "intermediate",
      duration: 22,
      xp: 15,
      summary: "Stateful, instance-level firewalls. Get these right and most attack vectors are closed.",
      content: [
        { type: "paragraph", text: "A security group is a stateful virtual firewall attached to one or more EC2 instances (or other resources like RDS, ALB, Lambda VPC). It controls inbound and outbound traffic by port, protocol, and source/destination. Security groups are stateful: if you allow inbound on port 443, the response traffic is automatically allowed out — you don't need to write a return rule." },
        { type: "comparison", columns: ["Property", "Security Group", "Network ACL"], rows: [
          { label: "Layer", values: ["Instance / ENI", "Subnet"] },
          { label: "State", values: ["Stateful (return traffic auto-allowed)", "Stateless (must allow both directions)"] },
          { label: "Rule evaluation", values: ["All rules evaluated, allow-only", "Processed in order, allow + deny"] },
          { label: "Use case", values: ["Per-instance app firewall", "Subnet-wide IP blocking"] },
        ]},
        { type: "code", language: "bash", code: `# Create a security group for web servers
aws ec2 create-security-group \\
  --group-name web-sg \\
  --description "Allow HTTP/HTTPS inbound, all outbound"

# Add inbound rules: HTTP from anywhere, SSH only from corporate network
aws ec2 authorize-security-group-ingress \\
  --group-id sg-0abc123 \\
  --ip-permissions \\
    IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges='[{CidrIp=0.0.0.0/0,Description="HTTP"}]' \\
    IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges='[{CidrIp=0.0.0.0/0,Description="HTTPS"}]' \\
    IpProtocol=tcp,FromPort=22,ToPort=22,IpRanges='[{CidrIp=10.0.0.0/8,Description="SSH from corp"}]'`, caption: "Create a security group with common web-server rules." },
        { type: "callout", variant: "danger", title: "Don't open SSH to 0.0.0.0/0", text: "Allowing SSH (port 22) from anywhere is one of the most common causes of account compromise — bots scan continuously. Restrict to your corporate IP range, or better: use AWS Systems Manager Session Manager which doesn't require any inbound port." },
        { type: "keyTakeaways", items: [
          "Security groups are stateful instance firewalls.",
          "Allow-only — no deny rules (use NACLs for explicit deny).",
          "Reference other SGs by ID instead of CIDRs — cleaner and more secure.",
          "Never open SSH/RDP to 0.0.0.0/0.",
        ]},
      ],
    },
    {
      id: "ec2-auto-scaling",
      title: "Auto Scaling and Load Balancing",
      level: "advanced",
      duration: 30,
      xp: 25,
      summary: "The foundation of elastic AWS architectures — automatically add/remove instances based on demand.",
      content: [
        { type: "paragraph", text: "Auto Scaling Groups (ASGs) automatically launch or terminate EC2 instances based on demand. Combined with a Load Balancer, they form the backbone of every scalable AWS architecture: traffic spikes → ASG adds instances → LB distributes load → traffic subsides → ASG removes instances → you stop paying." },
        { type: "architecture", nodes: [
          { id: "user", label: "Users", type: "client" },
          { id: "alb", label: "Application Load Balancer", type: "network" },
          { id: "asg", label: "Auto Scaling Group", type: "compute" },
          { id: "i1", label: "Instance 1 (AZ-a)", type: "compute" },
          { id: "i2", label: "Instance 2 (AZ-b)", type: "compute" },
          { id: "i3", label: "Instance 3 (AZ-c)", type: "compute" },
          { id: "cw", label: "CloudWatch Alarms", type: "observability" },
          { id: "rds", label: "RDS Multi-AZ", type: "database" },
        ], edges: [
          { from: "user", to: "alb" },
          { from: "alb", to: "i1" },
          { from: "alb", to: "i2" },
          { from: "alb", to: "i3" },
          { from: "cw", to: "asg", label: "scale out/in" },
          { from: "asg", to: "i1" },
          { from: "asg", to: "i2" },
          { from: "asg", to: "i3" },
          { from: "i1", to: "rds" },
          { from: "i2", to: "rds" },
          { from: "i3", to: "rds" },
        ], caption: "Classic 3-tier web architecture with Auto Scaling across 3 AZs." },
        { type: "list", items: [
          "Launch template — defines the AMI, instance type, key pair, SG, user data.",
          "Auto Scaling Group — wraps a launch template with min/max/desired capacity and AZ placement.",
          "Scaling policies — rules like 'add 1 instance if avg CPU > 70% for 5 minutes'.",
          "Target tracking — 'keep avg CPU at 50%' is the easiest policy; AWS handles the math.",
          "Step scaling — 'add 2 if CPU 60-70%, add 4 if >70%' for finer control.",
          "Health checks — ASG replaces unhealthy instances automatically.",
        ]},
        { type: "callout", variant: "tip", title: "Use target tracking", text: "Target tracking scaling is the easiest and most robust policy. You set a target like 'average CPU = 50%' and AWS calculates whether to add or remove instances. Far simpler than writing custom step policies, and it adapts as your workload changes." },
        { type: "keyTakeaways", items: [
          "ASG + LB = the foundation of every elastic AWS architecture.",
          "Launch template defines instance spec; ASG wraps it with scaling rules.",
          "Target tracking is the simplest, most robust scaling policy.",
          "Always span multiple AZs for availability.",
        ]},
      ],
    },
    {
      id: "ec2-production",
      title: "Production EC2 — HA, DR, and Best Practices",
      level: "expert",
      duration: 35,
      xp: 30,
      summary: "Running EC2 in production: multi-AZ, DR strategies, instance recovery, and operational excellence.",
      content: [
        { type: "paragraph", text: "Running EC2 in production means designing for failure. AWS data centers fail. Instances fail. Networks fail. The question is not 'will it fail?' but 'how do we keep serving users when it does?' Senior architects build systems that survive AZ failures, hardware failures, and even regional disasters." },
        { type: "list", items: [
          "Multi-AZ — always deploy across at least 2, preferably 3 AZs.",
          "Multi-region DR — for mission-critical systems, replicate to a second region.",
          "Instance recovery — EC2 auto-recovery launches a replacement on a healthy host if hardware fails.",
          "Right-sizing — use Compute Optimizer recommendations to remove waste.",
          "Reserved Instances / Savings Plans — commit to 1-3 years for up to 72% discount on steady workloads.",
          "Spot Instances — for batch/stateless workloads, up to 90% off with 2-minute interruption warning.",
          "Elastic IPs — static IPs you can move between instances for failover.",
          "Placement groups — cluster (low latency), spread (isolate failures), partition (Hadoop-style).",
        ]},
        { type: "callout", variant: "info", title: "DR strategies from cheap to expensive", text: "1) Backup & restore — back up to S3 cross-region; restore on demand. Cheapest, slowest RTO. 2) Pilot light — keep a small core running in DR region; scale up on disaster. 3) Warm standby — full but smaller copy of prod running; scale up on disaster. 4) Multi-site active-active — full prod in both regions; instant failover. Most expensive, fastest RTO." },
        { type: "keyTakeaways", items: [
          "Production EC2 means designing for failure — multi-AZ minimum.",
          "Use auto-recovery, right-sizing, and committed-use discounts.",
          "Spot Instances for stateless workloads = up to 90% savings.",
          "Choose DR strategy (backup/pilot-light/warm/multi-site) based on RTO and budget.",
        ]},
      ],
    },
  ],
};

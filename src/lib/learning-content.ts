// AWS Learning Platform — Quizzes, Troubleshooting, Projects data

import type { SkillLevel } from "./store";
import { expertProjects } from "./expert-projects";

// ----------------------------------------------------------------------------
// QUIZZES
// ----------------------------------------------------------------------------

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  level: SkillLevel;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  level: SkillLevel;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    id: "quiz-fundamentals",
    title: "Cloud Computing Fundamentals Quiz",
    description: "Test your understanding of cloud basics, service models, and AWS global infrastructure.",
    moduleId: "fundamentals",
    level: "beginner",
    questions: [
      {
        id: "q1",
        question: "What is the primary difference between IaaS and PaaS?",
        options: [
          "IaaS is more expensive than PaaS",
          "IaaS gives you control of the OS; PaaS manages the OS for you",
          "IaaS is for enterprise; PaaS is for startups",
          "IaaS is on-premise; PaaS is in the cloud",
        ],
        correctIndex: 1,
        explanation: "In IaaS (like EC2), you manage the OS, applications, and data. In PaaS (like Lambda or RDS), the provider manages the OS and infrastructure, while you focus on your application or data. The trade-off is flexibility vs. operational simplicity.",
        level: "beginner",
      },
      {
        id: "q2",
        question: "An Availability Zone (AZ) consists of:",
        options: [
          "Multiple regions connected by low-latency links",
          "One or more discrete data centers with redundant power, networking, and connectivity",
          "A single server rack in an AWS region",
          "A CDN edge location for content caching",
        ],
        correctIndex: 1,
        explanation: "An AZ is one or more discrete data centers within a region, each with independent power, cooling, and networking. Regions contain 2-6 AZs, and deploying across multiple AZs is the foundation of high availability in AWS.",
        level: "beginner",
      },
      {
        id: "q3",
        question: "What is the shared responsibility model?",
        options: [
          "AWS and the customer split the cost of all resources",
          "AWS secures the cloud infrastructure; the customer secures what they put in the cloud",
          "AWS manages security patches; the customer manages billing",
          "AWS provides security tools; the customer provides the data",
        ],
        correctIndex: 1,
        explanation: "AWS is responsible for security OF the cloud (physical data centers, hardware, virtualization, networking). The customer is responsible for security IN the cloud (data, IAM, application code, OS patches on EC2). The exact line depends on the service abstraction level.",
        level: "beginner",
      },
      {
        id: "q4",
        question: "Which is an example of elasticity in cloud computing?",
        options: [
          "Running a fixed-size database for years",
          "Adding servers automatically when traffic spikes and removing them when it subsides",
          "Paying upfront for 3 years of compute capacity",
          "Using a single region for all workloads",
        ],
        correctIndex: 1,
        explanation: "Elasticity is the ability to scale resources UP and DOWN automatically based on demand. This is different from scalability (which only refers to the ability to grow). Auto Scaling Groups and Lambda are textbook examples of elastic services.",
        level: "intermediate",
      },
      {
        id: "q5",
        question: "Why are AWS Regions important for compliance?",
        options: [
          "They don't affect compliance at all",
          "Data stored in a Region stays in that Region's geographic boundary, enabling data residency compliance",
          "Each Region has different pricing for compliance features",
          "All Regions share data for redundancy",
        ],
        correctIndex: 1,
        explanation: "AWS Regions are geographically distinct. Data stored in eu-west-1 (Ireland) does not leave the EU unless you explicitly configure replication. This enables compliance with regulations like GDPR (EU data stays in EU), HIPAA (US health data), and country-specific data sovereignty laws.",
        level: "intermediate",
      },
      {
        id: "q6",
        question: "Which pricing model offers up to 90% discount but can be interrupted with 2-minute warning?",
        options: [
          "On-Demand",
          "Reserved Instances",
          "Spot Instances",
          "Savings Plans",
        ],
        correctIndex: 2,
        explanation: "Spot Instances use spare AWS capacity at up to 90% discount. AWS can reclaim them with a 2-minute warning when capacity is needed. Best for batch jobs, stateless workloads, and anything that can handle interruption gracefully.",
        level: "intermediate",
      },
    ],
  },
  {
    id: "quiz-iam",
    title: "IAM Deep Dive Quiz",
    description: "Test your knowledge of IAM users, roles, policies, and security best practices.",
    moduleId: "iam",
    level: "intermediate",
    questions: [
      {
        id: "q1",
        question: "What is the modern recommended approach for granting AWS access to applications running on EC2?",
        options: [
          "Create an IAM user with access keys; store keys in /etc/aws-credentials",
          "Attach an IAM role to the EC2 instance; AWS auto-rotates temporary credentials",
          "Hardcode access keys in environment variables",
          "Use the root account credentials",
        ],
        correctIndex: 1,
        explanation: "EC2 instance roles are the modern best practice. AWS automatically issues temporary credentials via the instance metadata service, rotating them every few hours. No long-lived keys to manage, no risk of credentials leaking in config files or AMIs.",
        level: "intermediate",
      },
      {
        id: "q2",
        question: "An IAM policy has Effect: Allow for s3:* on arn:aws:s3:::bucket/*. Another policy attached to the same role has Effect: Deny for s3:DeleteObject on the same bucket. What happens when the user tries to delete an object?",
        options: [
          "Delete succeeds — Allow takes precedence",
          "Delete fails — explicit Deny always wins",
          "Delete succeeds — order of policies matters, not effects",
          "Delete fails — the policy syntax is invalid",
        ],
        correctIndex: 1,
        explanation: "Explicit Deny always wins over Allow, regardless of how broad the Allow is. This is the foundation of security guardrails: you can grant broad permissions for productivity but explicitly deny dangerous actions like s3:DeleteObject or iam:CreateUser.",
        level: "intermediate",
      },
      {
        id: "q3",
        question: "What is the difference between an IAM role and an IAM user?",
        options: [
          "Users have passwords; roles don't and are assumed via STS for temporary credentials",
          "Roles cost money; users are free",
          "Users are for humans; roles are only for AWS services",
          "There is no functional difference",
        ],
        correctIndex: 0,
        explanation: "Users have long-term credentials (passwords for console, access keys for API). Roles don't have credentials themselves; instead, trusted entities assume roles via STS, getting temporary credentials (15 min - 12 hours). Roles are dramatically safer because they self-expire.",
        level: "intermediate",
      },
      {
        id: "q4",
        question: "What is least privilege?",
        options: [
          "Granting AdministratorAccess so users can do anything",
          "Granting only the minimum permissions needed for a task, and no more",
          "Using the AWS managed policy AmazonS3FullAccess",
          "Allowing only one IAM user per account",
        ],
        correctIndex: 1,
        explanation: "Least privilege is the principle of granting only the minimum permissions needed. Broad permissions like s3:* or *:* increase blast radius if credentials leak. Use IAM Access Analyzer to find and remove unused permissions over time.",
        level: "intermediate",
      },
      {
        id: "q5",
        question: "A user gets AccessDenied when reading an S3 object, but IAM Policy Simulator says they have permission. What is the MOST likely cause?",
        options: [
          "The user's password is wrong",
          "The S3 object is encrypted with a KMS key, and the user lacks kms:Decrypt permission",
          "The S3 bucket is in a different region",
          "AWS is having a service outage",
        ],
        correctIndex: 1,
        explanation: "This is the classic KMS gotcha. IAM Policy Simulator tests IAM policies only, not resource-based policies or KMS key policies. If the S3 object is KMS-encrypted, the user ALSO needs kms:Decrypt on the KMS key. S3 returns AccessDenied (not the more helpful KMS error) because the request never got past KMS.",
        level: "advanced",
      },
      {
        id: "q6",
        question: "Which approach enables cross-account access to resources in Account B from a role in Account A?",
        options: [
          "Create an IAM user in Account B with the same name as the role in Account A",
          "Configure a trust policy on the role in Account B that allows the role in Account A to assume it",
          "Share the root credentials of Account B with Account A",
          "Use the same VPC in both accounts",
        ],
        correctIndex: 1,
        explanation: "Cross-account access requires a trust policy on the target role. The trust policy specifies which AWS principal (in another account) can call sts:AssumeRole on it. Once assumed, the caller gets temporary credentials scoped to the target role's permissions.",
        level: "advanced",
      },
    ],
  },
  {
    id: "quiz-ec2",
    title: "Amazon EC2 Quiz",
    description: "Test your knowledge of EC2 instances, storage, networking, and Auto Scaling.",
    moduleId: "ec2",
    level: "intermediate",
    questions: [
      {
        id: "q1",
        question: "What does an EC2 instance type name like 'm5.xlarge' indicate?",
        options: [
          "The instance's region and AZ",
          "The instance family (m), generation (5), and size (xlarge)",
          "The operating system and AMI version",
          "The hourly cost in cents",
        ],
        correctIndex: 1,
        explanation: "Instance type names encode family + generation + size. Family (m=general, c=compute, r=RAM, p=GPU, i=io, t=burstable) tells you what it's optimized for. Generation (newer is generally faster/cheaper per unit). Size (nano to 24xlarge) is the hardware scale.",
        level: "intermediate",
      },
      {
        id: "q2",
        question: "Which EC2 security group rule allows SSH access ONLY from your corporate network at 10.0.0.0/8?",
        options: [
          "Allow TCP port 22 from 0.0.0.0/0",
          "Allow TCP port 22 from 10.0.0.0/8",
          "Allow TCP port 80 from 10.0.0.0/8",
          "Allow ICMP from 10.0.0.0/8",
        ],
        correctIndex: 1,
        explanation: "SSH runs on TCP port 22. Restricting source to 10.0.0.0/8 (your corporate private range) means only traffic from inside your corporate network can SSH in. Never allow SSH from 0.0.0.0/0 — bots scan continuously and will find you.",
        level: "intermediate",
      },
      {
        id: "q3",
        question: "What is the difference between Multi-AZ and Auto Scaling across multiple AZs?",
        options: [
          "They are the same thing",
          "Multi-AZ is for databases (synchronous standby); ASG is for compute (distributes instances across AZs for HA)",
          "Multi-AZ is cheaper",
          "Auto Scaling is for databases; Multi-AZ is for EC2",
        ],
        correctIndex: 1,
        explanation: "Multi-AZ is a database feature (RDS): a synchronous standby in another AZ, failover in 60-120s. Auto Scaling Groups span multiple AZs by launching instances across them, providing both availability and the ability to scale horizontally. Different problems, different solutions.",
        level: "intermediate",
      },
      {
        id: "q4",
        question: "Which EBS volume type is best for a database requiring 100,000 IOPS?",
        options: [
          "gp3 (general purpose SSD)",
          "st1 (throughput-optimized HDD)",
          "io2 Block Express",
          "sc1 (cold HDD)",
        ],
        correctIndex: 2,
        explanation: "io2 Block Express supports up to 256,000 IOPS and 4,000 MiB/s throughput per volume — designed for mission-critical, latency-sensitive databases. gp3 caps at 16,000 IOPS. HDD types (st1, sc1) are for sequential throughput, not random IOPS.",
        level: "advanced",
      },
      {
        id: "q5",
        question: "An Auto Scaling Group has desired=4, min=2, max=8, and target tracking policy 'keep CPU at 50%'. Average CPU hits 90%. What happens?",
        options: [
          "Nothing — the desired count stays at 4",
          "ASG launches additional instances (up to 8) until CPU drops to ~50%",
          "ASG terminates all instances",
          "ASG switches the policy to step scaling",
        ],
        correctIndex: 1,
        explanation: "Target tracking scaling automatically calculates how many instances to add (or remove) to maintain the target metric. With max=8, ASG will launch up to 4 more instances (reaching max=8) until average CPU drops to ~50%. If traffic subsides, it will terminate down to min=2.",
        level: "advanced",
      },
      {
        id: "q6",
        question: "What is an EC2 user data script?",
        options: [
          "A script that runs every time the instance reboots",
          "A script that runs as root on first boot only, used to install software or configure the instance",
          "A backup of user files stored in S3",
          "An IAM policy attached to the instance",
        ],
        correctIndex: 1,
        explanation: "User data runs as root on first boot only. Combined with Auto Scaling, this lets you launch fully configured instances in seconds — install packages, configure services, register with monitoring. To re-run user data, you must stop/start the instance (which creates a new instance lifecycle).",
        level: "intermediate",
      },
    ],
  },
  {
    id: "quiz-networking",
    title: "VPC and Networking Quiz",
    description: "Test your understanding of VPCs, subnets, routing, and network security.",
    moduleId: "networking",
    level: "intermediate",
    questions: [
      {
        id: "q1",
        question: "How many IP addresses are available in a /24 CIDR block (e.g., 10.0.1.0/24)?",
        options: [
          "128",
          "256",
          "251 (AWS reserves 5)",
          "65,536",
        ],
        correctIndex: 2,
        explanation: "A /24 has 256 addresses mathematically, but AWS reserves 5 per subnet (network address, VPC router, DNS, future use, broadcast). So 251 usable IPs. This matters for sizing subnets — plan enough IPs for your peak plus growth.",
        level: "intermediate",
      },
      {
        id: "q2",
        question: "What is the difference between a public subnet and a private subnet?",
        options: [
          "Public subnets are more expensive",
          "Public subnets have a route to an Internet Gateway; private subnets do not",
          "Public subnets are faster",
          "Public subnets use IPv6; private use IPv4",
        ],
        correctIndex: 1,
        explanation: "A subnet is 'public' if its route table has a 0.0.0.0/0 route to an Internet Gateway. Instances in public subnets can have public IPs and be reachable from the internet. Private subnets have no IGW route; their outbound traffic goes through a NAT gateway if they need internet access.",
        level: "intermediate",
      },
      {
        id: "q3",
        question: "What does a NAT Gateway do?",
        options: [
          "Encrypts traffic between VPCs",
          "Allows instances in private subnets to make outbound internet requests while blocking inbound",
          "Translates domain names to IP addresses",
          "Acts as a firewall for VPC traffic",
        ],
        correctIndex: 1,
        explanation: "NAT (Network Address Translation) Gateway lets instances in private subnets reach the internet (e.g., for OS updates, API calls) without being directly reachable from the internet. Traffic is translated: outbound looks like it comes from the NAT's IP; inbound from internet is blocked.",
        level: "intermediate",
      },
      {
        id: "q4",
        question: "What is a VPC Endpoint and why is it useful?",
        options: [
          "A VPN connection to on-premises networks",
          "A private connection from your VPC to AWS services (like S3) without crossing the public internet",
          "A route table entry for internet traffic",
          "An alias for a security group",
        ],
        correctIndex: 1,
        explanation: "VPC Endpoints let your VPC reach AWS services privately. Gateway endpoints (S3, DynamoDB) are free. Interface endpoints (most other services) cost money but enable private access without NAT. For high-volume S3 traffic from private subnets, a Gateway endpoint saves NAT data-processing charges.",
        level: "advanced",
      },
      {
        id: "q5",
        question: "Why are security groups described as 'stateful'?",
        options: [
          "They remember previous traffic for performance",
          "Return traffic for an allowed inbound connection is automatically allowed out, without needing an explicit outbound rule",
          "They persist across instance reboots",
          "They sync state across multiple AZs",
        ],
        correctIndex: 1,
        explanation: "Stateful means the firewall tracks connection state. If you allow TCP 443 inbound, the response traffic on the same connection is automatically allowed out. You don't need to write a corresponding outbound rule. NACLs are stateless — you must explicitly allow both inbound AND outbound.",
        level: "intermediate",
      },
      {
        id: "q6",
        question: "What is the recommended way to connect 10+ VPCs across multiple accounts?",
        options: [
          "Peering each pair (N-squared peering connections)",
          "A Transit Gateway as a central hub",
          "VPN connections over the internet",
          "Direct Connect to each VPC",
        ],
        correctIndex: 1,
        explanation: "VPC peering has no transitivity — peering A-B and B-C does not let A reach C. With 10 VPCs, you'd need 45 peering connections (N²-N/2). Transit Gateway acts as a hub-and-spoke router: each VPC attaches once to the TGW, and routing handles connectivity. Far more scalable.",
        level: "advanced",
      },
    ],
  },
  {
    id: "quiz-serverless",
    title: "Lambda and API Gateway Quiz",
    description: "Test your understanding of serverless compute, triggers, cold starts, and API management.",
    moduleId: "lambda",
    level: "advanced",
    questions: [
      {
        id: "q1",
        question: "What is a Lambda cold start?",
        options: [
          "A failure mode where Lambda doesn't start at all",
          "The extra latency on the first invocation after idle, as AWS provisions and initializes the execution environment",
          "When Lambda runs at cold temperatures in data centers",
          "A billing concept for infrequent invocations",
        ],
        correctIndex: 1,
        explanation: "Cold starts happen when Lambda provisions a new execution environment (loading runtime, code, dependencies) for the first invocation after idle. Typically 100ms-3s depending on runtime (Java/C# worst, Python/Node best). Provisioned concurrency eliminates cold starts by keeping instances warm.",
        level: "advanced",
      },
      {
        id: "q2",
        question: "Which Lambda trigger pattern requires idempotent function code?",
        options: [
          "Synchronous (API Gateway)",
          "Asynchronous (S3 events, SNS) — because AWS retries on failure",
          "Scheduled (CloudWatch Events)",
          "None — Lambda handles idempotency automatically",
        ],
        correctIndex: 1,
        explanation: "Asynchronous triggers (S3, SNS, EventBridge) automatically retry failed invocations 2-3 times. If your function has side effects (writes to DB, charges a card, sends email), retries cause duplicate operations. Design with idempotency keys to make the function safe to call multiple times with the same input.",
        level: "advanced",
      },
      {
        id: "q3",
        question: "Why might increasing Lambda memory from 128MB to 512MB reduce total cost?",
        options: [
          "AWS gives discounts for higher memory",
          "More memory also means more CPU, often reducing duration enough that the GB-seconds total decreases",
          "It doesn't — higher memory always costs more",
          "Higher memory qualifies for free tier",
        ],
        correctIndex: 1,
        explanation: "Lambda bills by GB-seconds (memory × duration). More memory = more CPU, often cutting duration in half or more. If a function at 128MB takes 5s and at 512MB takes 1s, the GB-seconds go from 0.625 to 0.5 — cheaper AND faster. Always benchmark — the optimal memory is rarely the minimum.",
        level: "advanced",
      },
      {
        id: "q4",
        question: "What is the difference between API Gateway REST API and HTTP API?",
        options: [
          "REST API only supports REST; HTTP API only supports HTTP",
          "HTTP API is simpler and ~70% cheaper than REST API, but lacks features like request validation models",
          "REST API is for production; HTTP API is for dev only",
          "There is no difference — they are the same product",
        ],
        correctIndex: 1,
        explanation: "HTTP API was introduced as a simpler, cheaper alternative to REST API. For most Lambda-proxy use cases (just forward HTTP to Lambda), HTTP API is the right choice — 70% cheaper, faster. Use REST API only when you need features like API keys, usage plans, request validation, or WebSocket.",
        level: "intermediate",
      },
      {
        id: "q5",
        question: "What is the default concurrency limit for Lambda in an AWS account per region?",
        options: [
          "100",
          "1,000",
          "10,000",
          "Unlimited",
        ],
        correctIndex: 1,
        explanation: "Default account-region concurrency limit is 1,000 simultaneous executions. You can request a quota increase. Reserved concurrency guarantees N slots for a specific function. Provisioned concurrency keeps N instances warm to eliminate cold starts (costs extra).",
        level: "advanced",
      },
      {
        id: "q6",
        question: "Which pattern provides reliable, ordered processing of messages with retry and dead-letter queues?",
        options: [
          "Lambda directly triggered by S3",
          "SQS queue + Lambda polling — failed messages auto-retry then go to DLQ",
          "Lambda directly triggered by SNS",
          "API Gateway → Lambda synchronously",
        ],
        correctIndex: 1,
        explanation: "Using SQS as a buffer between event source and Lambda is the most robust pattern. SQS handles retry (configurable), DLQ (failed messages after max retries), batching (1 Lambda processes 10 messages), and ordering (FIFO queues). Direct S3/SNS triggers retry 2-3 times then drop — less control.",
        level: "advanced",
      },
    ],
  },
  {
    id: "quiz-architect",
    title: "Architecture Decision-Making Quiz",
    description: "Senior-level scenario questions: trade-offs between services, choosing the right tool for the job.",
    moduleId: "iam",
    level: "expert",
    questions: [
      {
        id: "q1",
        question: "An app has bursty traffic (0 to 10,000 req/sec in minutes), short requests (<50ms), and zero tolerance for cold starts. Best compute choice?",
        options: [
          "EC2 with Auto Scaling — predictable, no cold starts",
          "Lambda with provisioned concurrency — handles bursts, no cold starts",
          "ECS with Fargate — serverless containers, scales automatically",
          "EC2 Single instance — simplest, cheapest",
        ],
        correctIndex: 1,
        explanation: "Lambda with provisioned concurrency is the best fit: handles 0→10k instantly (no ASG warmup), provisioned concurrency eliminates cold starts, and short requests are Lambda's sweet spot. EC2 ASG takes minutes to add capacity; Fargate also has startup time. The trade-off is cost — provisioned concurrency isn't cheap.",
        level: "expert",
      },
      {
        id: "q2",
        question: "You need to host a PostgreSQL database that must survive the loss of an entire AWS Region with <5 min RTO. Which approach?",
        options: [
          "Single Aurora PostgreSQL instance with manual snapshots",
          "Aurora PostgreSQL with cross-Region read replica; promote on failure",
          "RDS PostgreSQL Multi-AZ in one region",
          "Multiple EC2 instances running PostgreSQL in two regions",
        ],
        correctIndex: 1,
        explanation: "Aurora cross-Region read replica gives you a hot standby in another region. On regional disaster, promote the replica (becomes primary) — typically <5 minutes. Multi-AZ only protects against AZ failure, not region failure. EC2 self-managed PostgreSQL is operationally expensive and slower to fail over.",
        level: "expert",
      },
      {
        id: "q3",
        question: "An application processes 10 TB of log files nightly. Which combination is most cost-effective?",
        options: [
          "EC2 instance downloading files from S3",
          "Lambda function triggered by S3 event for each file",
          "AWS Glue Spark job reading from S3",
          "Athena querying S3 directly",
        ],
        correctIndex: 2,
        explanation: "AWS Glue (managed Spark) is designed exactly for this: process TB-scale data in S3 with parallelism, pay per DPU-hour. Lambda would hit timeouts and concurrency limits. EC2 means you manage the cluster. Athena is great for ad-hoc queries but expensive for known scheduled bulk processing (per-TB scanned).",
        level: "expert",
      },
      {
        id: "q4",
        question: "A startup has 5-person engineering team, no DevOps, and wants to deploy containers without managing servers. Best choice?",
        options: [
          "EKS (Kubernetes) — full control, future-proof",
          "ECS with Fargate — serverless containers, simpler than K8s",
          "EC2 with Docker — most control",
          "App Runner — simplest, but limited",
        ],
        correctIndex: 1,
        explanation: "For a small team without DevOps, ECS+Fargate is the sweet spot. No servers to manage, simpler than EKS, integrated with AWS services, supports all standard container workflows. EKS has too much operational overhead for a 5-person team. App Runner is simpler but limited (no custom networking, less control).",
        level: "expert",
      },
      {
        id: "q5",
        question: "You need to expose an internal microservice to other VPCs without exposing it to the internet. Best approach?",
        options: [
          "Public API Gateway with IAM auth",
          "AWS PrivateLink (VPC Endpoint Service)",
          "VPC peering between every consumer VPC",
          "Internet-facing ALB with security group restrictions",
        ],
        correctIndex: 1,
        explanation: "PrivateLink (VPC Endpoint Service) lets you expose your service privately to other VPCs (yours or customers'), without internet, without VPC peering. Consumer creates an Interface VPC Endpoint and connects to your service. Scales to many consumers without N-squared peering. This is the standard SaaS provider pattern.",
        level: "expert",
      },
      {
        id: "q6",
        question: "A Lambda function reads from DynamoDB, processes data, and writes to S3. Processing takes 5 minutes per batch. Best architecture?",
        options: [
          "Single Lambda function with 15-min timeout",
          "Step Functions orchestrating multiple short Lambdas",
          "ECS Fargate task per batch",
          "EC2 instance running the batch script",
        ],
        correctIndex: 1,
        explanation: "Step Functions orchestrating multiple short Lambdas is the right pattern: each Lambda <15min, Step Functions handles retries, parallelism, error handling, and state. A single 15-min Lambda risks timeouts and has no retry visibility. ECS/EC2 add operational overhead. Step Functions is purpose-built for this orchestration.",
        level: "expert",
      },
    ],
  },
];

// ----------------------------------------------------------------------------
// TROUBLESHOOTING SCENARIOS
// ----------------------------------------------------------------------------

export interface TroubleshootingStep {
  type: "symptom" | "investigation" | "root-cause" | "fix" | "prevention";
  title: string;
  description: string;
  command?: string;
  output?: string;
}

export interface TroubleshootingScenario {
  id: string;
  title: string;
  category: string;
  level: SkillLevel;
  estimatedTime: number; // minutes
  scenario: string;
  steps: TroubleshootingStep[];
  keyLearnings: string[];
}

export const troubleshootingScenarios: TroubleshootingScenario[] = [
  {
    id: "ts-ec2-unreachable",
    title: "EC2 Web Server is Unreachable",
    category: "EC2 / Networking",
    level: "intermediate",
    estimatedTime: 20,
    scenario: "You deployed a new EC2 web server (Apache on port 80) but cannot access it via the public IP in your browser. The instance shows 'running' in the console. Diagnose and fix.",
    steps: [
      {
        type: "symptom",
        title: "Browser timeout when hitting http://<public-ip>",
        description: "Browser spins and eventually times out with ERR_CONNECTION_REFUSED or ERR_CONNECTION_TIMED_OUT. SSH may or may not work.",
      },
      {
        type: "investigation",
        title: "Step 1: Verify instance is running and healthy",
        description: "Confirm the instance state and check status checks in the console or CLI.",
        command: "aws ec2 describe-instance-status --instance-ids i-0abc123",
        output: `{
  "InstanceStatuses": [{
    "InstanceId": "i-0abc123",
    "InstanceState": { "Code": 16, "Name": "running" },
    "InstanceStatus": { "Status": "ok" },
    "SystemStatus": { "Status": "ok" }
  }]
}`,
      },
      {
        type: "investigation",
        title: "Step 2: Check the security group inbound rules",
        description: "Most common cause: the security group doesn't allow port 80 inbound. Check what rules are attached to the instance.",
        command: "aws ec2 describe-security-groups --group-ids sg-0abc123",
        output: `{
  "SecurityGroups": [{
    "GroupId": "sg-0abc123",
    "IpPermissions": [
      {
        "FromPort": 22, "ToPort": 22, "IpProtocol": "tcp",
        "IpRanges": [{ "CidrIp": "10.0.0.0/8" }]
      }
      // Notice: NO port 80 rule!
    ]
  }]
}`,
      },
      {
        type: "root-cause",
        title: "Root cause: Security group missing port 80 rule",
        description: "The instance's security group only allows SSH (port 22) from corporate network. Port 80 is not allowed inbound, so the OS never receives the connection.",
      },
      {
        type: "fix",
        title: "Add inbound rule for HTTP (port 80)",
        description: "Add a security group rule allowing TCP port 80 from 0.0.0.0/0 (or your customer IP range if you want to restrict).",
        command: `aws ec2 authorize-security-group-ingress \\
  --group-id sg-0abc123 \\
  --protocol tcp \\
  --port 80 \\
  --cidr 0.0.0.0/0`,
      },
      {
        type: "investigation",
        title: "Step 3: If still unreachable, check the subnet route table",
        description: "If port 80 is allowed but you still can't reach it, the subnet may not have a route to the Internet Gateway. Check if the instance is in a public subnet.",
        command: "aws ec2 describe-route-tables --route-table-id rtb-0abc123",
        output: `{
  "RouteTables": [{
    "Routes": [
      { "DestinationCidrBlock": "10.0.0.0/16", "GatewayId": "local" }
      // Missing: 0.0.0.0/0 -> igw-xxx
    ]
  }]
}`,
      },
      {
        type: "root-cause",
        title: "Alternative root cause: Subnet has no IGW route",
        description: "If the route table has no 0.0.0.0/0 → igw-xxx entry, the subnet is private and the instance cannot be reached from the internet even with a public IP.",
      },
      {
        type: "fix",
        title: "Add IGW route to the subnet's route table",
        description: "If you intended this to be a public subnet, add the default route to the IGW.",
        command: `aws ec2 create-route \\
  --route-table-id rtb-0abc123 \\
  --destination-cidr-block 0.0.0.0/0 \\
  --gateway-id igw-0abc123`,
      },
      {
        type: "investigation",
        title: "Step 4: Check if instance has a public IP",
        description: "Even with all the above correct, if the instance has no public IP, it cannot be reached from the internet.",
        command: "aws ec2 describe-instances --instance-ids i-0abc123 --query 'Reservations[0].Instances[0].PublicIpAddress'",
        output: `""  // Empty — no public IP assigned`,
      },
      {
        type: "fix",
        title: "Associate an Elastic IP or use Auto-assign Public IP",
        description: "Either allocate an Elastic IP and associate it, or modify the subnet to auto-assign public IPs and restart the instance.",
        command: `# Allocate and associate an Elastic IP
aws ec2 allocate-address --domain vpc
# Returns allocationId eipalloc-xxx
aws ec2 associate-address --instance-id i-0abc123 --allocation-id eipalloc-0xxx`,
      },
      {
        type: "investigation",
        title: "Step 5: Verify Apache is running inside the instance",
        description: "If all networking is correct, the issue may be inside the instance — Apache not running, not listening on port 80, or firewalled by host OS.",
        command: "# SSH into the instance and run:\nsystemctl status httpd\ncurl -I http://localhost",
      },
      {
        type: "prevention",
        title: "Prevention checklist",
        description: "For future deployments: (1) Always check SG rules before claiming 'instance unreachable'. (2) Use Auto-assign Public IP on launch for public subnets. (3) Verify route tables have IGW route for public subnets. (4) Use user data to ensure services start automatically.",
      },
    ],
    keyLearnings: [
      "Most 'unreachable EC2' issues are security group, route table, or public IP — not the instance itself.",
      "Security groups are stateful — allowing inbound TCP 80 also allows the response out.",
      "Subnets become 'public' by having a route to the Internet Gateway.",
      "Always test inside the instance first (curl localhost) before blaming network.",
    ],
  },
  {
    id: "ts-iam-accessdenied",
    title: "Mysterious AccessDenied on S3 Object Read",
    category: "IAM / S3",
    level: "advanced",
    estimatedTime: 25,
    scenario: "An application running on EC2 gets 'AccessDenied' when trying to read an object from an S3 bucket. The instance has an IAM role that grants s3:GetObject on the bucket. Diagnose and fix.",
    steps: [
      {
        type: "symptom",
        title: "Application logs show 'AccessDenied' (403 Forbidden)",
        description: "The application's logs show AWS SDK error: 'An error occurred (403) when calling the GetObject operation: Access Denied'. The instance role's IAM policy simulator shows the permission is granted.",
      },
      {
        type: "investigation",
        title: "Step 1: Verify the IAM role on the instance",
        description: "First, confirm what credentials the application is actually using. Many 'AccessDenied' issues are caused by the wrong credentials being picked up.",
        command: "aws sts get-caller-identity",
        output: `{
  "UserId": "AROA1234567890:EC2InstanceProfile",
  "Account": "123456789012",
  "Arn": "arn:aws:sts::123456789012:assumed-role/MyAppRole/i-0abc123"
}`,
      },
      {
        type: "investigation",
        title: "Step 2: Test the actual S3 GetObject call",
        description: "Try the exact operation from the CLI to reproduce and get the precise error.",
        command: "aws s3api get-object --bucket my-bucket --key data/file.csv /tmp/test.csv",
        output: `An error occurred (403) when calling the GetObject operation: Access Denied`,
      },
      {
        type: "investigation",
        title: "Step 3: Check the IAM Policy Simulator",
        description: "Use the simulator to see what policies actually apply. This often reveals the permission IS granted at IAM level — pointing to a different cause.",
        command: `aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::123456789012:role/MyAppRole \\
  --action-names s3:GetObject \\
  --resource-arns arn:aws:s3:::my-bucket/data/file.csv`,
        output: `{
  "EvaluationResults": [{
    "EvalActionName": "s3:GetObject",
    "EvalDecision": "allowed",  // <-- ALLOWED!
    "MatchedStatements": [...]
  }]
}`,
      },
      {
        type: "investigation",
        title: "Step 4: Check S3 bucket policy",
        description: "Since IAM allows the action, the issue must be at the resource level. Check the bucket policy for an explicit Deny.",
        command: "aws s3api get-bucket-policy --bucket my-bucket",
        output: `{
  "Policy": "{
    \\"Statement\\": [{
      \\"Effect\\": \\"Deny\\",
      \\"Principal\\": \\"*\\",
      \\"Action\\": \\"s3:GetObject\\",
      \\"Resource\\": \\"arn:aws:s3:::my-bucket/*\\",
      \\"Condition\\": {
        \\"StringNotEquals\\": {
          \\"s3:x-amz-server-side-encryption\\": \\"aws:kms\\"
        }
      }
    }]
  }"
}`,
      },
      {
        type: "investigation",
        title: "Step 5: Check object encryption",
        description: "The bucket policy DENIES GetObject unless the object is KMS-encrypted. Check the object's encryption status.",
        command: "aws s3api head-object --bucket my-bucket --key data/file.csv",
        output: `{
  "ServerSideEncryption": "AES256"  // Not KMS!
}`,
      },
      {
        type: "root-cause",
        title: "Root cause: Object not KMS-encrypted, bucket policy denies reads",
        description: "The bucket policy explicitly denies GetObject on non-KMS-encrypted objects. The object was uploaded with SSE-S3 (AES256) instead of SSE-KMS. IAM allows the action, but the resource-based policy denies it. Explicit Deny wins.",
      },
      {
        type: "fix",
        title: "Option A: Re-upload the object with KMS encryption",
        description: "Copy the object back to itself with SSE-KMS to satisfy the policy.",
        command: `aws s3 cp s3://my-bucket/data/file.csv s3://my-bucket/data/file.csv \\
  --sse aws:kms \\
  --sse-kms-key-id alias/my-key`,
      },
      {
        type: "fix",
        title: "Option B: Fix the upload code to always use KMS",
        description: "Update the application's S3 upload code to specify SSE-KMS. This is the proper long-term fix.",
        command: `# In application code (Python boto3 example):
s3.put_object(
    Bucket='my-bucket',
    Key='data/file.csv',
    Body=data,
    ServerSideEncryption='aws:kms',
    SSEKMSKeyId='alias/my-key'
)`,
      },
      {
        type: "investigation",
        title: "Step 6: If KMS is the cause, verify KMS key policy",
        description: "If the object IS KMS-encrypted but you still get AccessDenied, the EC2 role may lack kms:Decrypt on the KMS key. This is the classic 'KMS gotcha'.",
        command: `aws kms describe-key --key-id alias/my-key --query 'KeyMetadata.Policy'`,
      },
      {
        type: "fix",
        title: "Add kms:Decrypt permission to the EC2 role",
        description: "If the role lacks kms:Decrypt on the KMS key used by the S3 object, add it to the role's policy.",
        command: `aws iam put-role-policy \\
  --role-name MyAppRole \\
  --policy-name KMSAccess \\
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": "kms:Decrypt",
      "Resource": "arn:aws:kms:us-east-1:123456789012:key/abc123"
    }]
  }'`,
      },
      {
        type: "prevention",
        title: "Prevention",
        description: "(1) Always use the IAM Policy Simulator to verify identity-based permissions. (2) Check bucket policies when IAM permissions look correct. (3) KMS-encrypted S3 objects require BOTH s3:GetObject AND kms:Decrypt permissions. (4) Set up bucket policies that enforce KMS from the start — catch issues at upload time, not read time.",
      },
    ],
    keyLearnings: [
      "AccessDenied has many causes — IAM, bucket policy, KMS, VPC endpoint policy.",
      "IAM Policy Simulator shows identity-based perms only, not resource-based policies.",
      "KMS-encrypted S3 objects need BOTH s3:GetObject AND kms:Decrypt.",
      "Bucket policies can DENY based on object encryption status — common compliance pattern.",
    ],
  },
  {
    id: "ts-lambda-timeout",
    title: "Lambda Function Timeouts and Timeouts",
    category: "Serverless",
    level: "advanced",
    estimatedTime: 20,
    scenario: "A Lambda function that processes files from S3 keeps timing out. It worked in dev with small files but fails in prod with larger files. Diagnose and fix.",
    steps: [
      {
        type: "symptom",
        title: "CloudWatch shows TaskTimedOut errors",
        description: "Lambda logs show: 'Task timed out after 30.00 seconds'. Function configured with 30s timeout. Works fine on small (<1MB) files, fails on large (10MB+) files.",
      },
      {
        type: "investigation",
        title: "Step 1: Check CloudWatch logs for the function",
        description: "Look at the actual execution logs to see where time is being spent.",
        command: "aws logs filter-log-events --log-group-name /aws/lambda/my-function --filter-pattern 'Task timed out'",
      },
      {
        type: "investigation",
        title: "Step 2: Add timing logs to identify the slow step",
        description: "Add timing logs to your function to identify which step is slow.",
        command: `# In your Lambda code:
import time
start = time.time()
data = s3.get_object(Bucket=bucket, Key=key).read()
print(f"S3 download: {time.time()-start:.2f}s")

start = time.time()
result = process_data(data)
print(f"Process: {time.time()-start:.2f}s")

start = time.time()
s3.put_object(Bucket=..., Key=..., Body=result)
print(f"S3 upload: {time.time()-start:.2f}s")`,
        output: `S3 download: 0.5s
Process: 25.0s   <- This is the bottleneck
S3 upload: 0.3s`,
      },
      {
        type: "root-cause",
        title: "Root cause: Processing step is too slow at low memory",
        description: "Lambda at 128MB gets minimal CPU (proportional to memory). The processing step (likely CPU-bound: image manipulation, JSON parsing, ML inference) is too slow at low memory. More memory = more CPU = faster processing.",
      },
      {
        type: "fix",
        title: "Increase Lambda memory (and CPU)",
        description: "Increase memory to 1024MB or 2048MB. Lambda allocates CPU proportionally to memory — 2048MB gets a full vCPU.",
        command: "aws lambda update-function-configuration --function-name my-function --memory-size 2048",
      },
      {
        type: "investigation",
        title: "Step 3: Re-test and verify",
        description: "After increasing memory, re-test with the same large file. The processing should be 5-15x faster.",
        command: "aws logs filter-log-events --log-group-name /aws/lambda/my-function --start-time $(date -d '5 min ago' +%s)000",
        output: `S3 download: 0.5s
Process: 3.2s    <- 8x faster with 2048MB!
S3 upload: 0.3s`,
      },
      {
        type: "fix",
        title: "Also: Increase timeout if processing legitimately needs more time",
        description: "If the function still needs more than 30s for very large files, increase timeout (max 15 min).",
        command: "aws lambda update-function-configuration --function-name my-function --timeout 120",
      },
      {
        type: "prevention",
        title: "Prevention: Always right-size Lambda memory",
        description: "(1) Use AWS Lambda Power Tuning (open source tool) to find optimal memory. (2) Test with realistic prod-size inputs, not just dev samples. (3) More memory often REDUCES total cost because GB-seconds drop. (4) For very long processing, consider Step Functions + multiple shorter Lambdas.",
      },
    ],
    keyLearnings: [
      "Lambda CPU scales proportionally with memory — more memory = more CPU.",
      "More memory often REDUCES total cost (GB-seconds drops faster than memory increases).",
      "Test with realistic prod-size inputs, not just dev samples.",
      "For >15min processing, use Step Functions or ECS.",
    ],
  },
  {
    id: "ts-rds-conn-fail",
    title: "Application Cannot Connect to RDS",
    category: "Database / Networking",
    level: "intermediate",
    estimatedTime: 20,
    scenario: "An EC2-hosted application cannot connect to an RDS PostgreSQL instance. Error: 'could not connect to server: Connection timed out'.",
    steps: [
      {
        type: "symptom",
        title: "App logs show connection timeout to RDS",
        description: "Application errors with 'could not connect to server: Connection timed out. Is the server running on host mydb.xxxx.us-east-1.rds.amazonaws.com (10.0.21.5) and accepting TCP/IP connections on port 5432?'",
      },
      {
        type: "investigation",
        title: "Step 1: Verify the RDS instance is available",
        description: "Confirm the DB is up and accepting connections.",
        command: "aws rds describe-db-instances --db-instance-identifier mydb --query 'DBInstances[0].DBInstanceStatus'",
        output: `"available"`,
      },
      {
        type: "investigation",
        title: "Step 2: Test network connectivity from the EC2 instance",
        description: "Use telnet or nc to test TCP connectivity to the RDS endpoint on port 5432.",
        command: "# On the EC2 instance:\ntelnet mydb.xxxx.us-east-1.rds.amazonaws.com 5432",
        output: `Trying 10.0.21.5...
telnet: connect to address 10.0.21.5: Connection timed out`,
      },
      {
        type: "investigation",
        title: "Step 3: Check the RDS security group",
        description: "The most common cause. RDS SG must allow inbound TCP 5432 from the app's SG (or its CIDR).",
        command: "aws ec2 describe-security-groups --group-ids sg-rds-xxx",
        output: `{
  "SecurityGroups": [{
    "IpPermissions": [
      {
        "FromPort": 5432, "ToPort": 5432, "IpProtocol": "tcp",
        "UserIdGroupPairs": [],  // <-- Empty! No SGs allowed
        "IpRanges": [
          { "CidrIp": "10.0.0.0/8" }  // Only allows 10.x range
        ]
      }
    ]
  }]
}`,
      },
      {
        type: "root-cause",
        title: "Root cause: RDS SG only allows CIDR, not the app SG",
        description: "The RDS SG allows TCP 5432 from CIDR 10.0.0.0/8 — but the EC2 instance's primary IP is in a different range (maybe 172.16.x.x), or the SG-to-SG reference is missing. Best practice is to reference SGs by name, not CIDR.",
      },
      {
        type: "fix",
        title: "Allow the app SG to reach the RDS SG",
        description: "Add an inbound rule to the RDS SG referencing the app's SG.",
        command: `aws ec2 authorize-security-group-ingress \\
  --group-id sg-rds-xxx \\
  --protocol tcp \\
  --port 5432 \\
  --source-group sg-app-xxx`,
      },
      {
        type: "investigation",
        title: "Step 4: Verify EC2 and RDS are in the same VPC",
        description: "If they're in different VPCs, you need VPC peering or TGW. Check VPC IDs.",
        command: "aws ec2 describe-instances --instance-ids i-0app --query 'Reservations[0].Instances[0].VpcId'",
        output: `"vpc-app-xxx"  // Different from RDS VPC!`,
      },
      {
        type: "root-cause",
        title: "Alternative root cause: Different VPCs",
        description: "If the EC2 instance is in VPC-A and RDS is in VPC-B, they cannot reach each other directly. You need VPC peering or Transit Gateway.",
      },
      {
        type: "fix",
        title: "Create a VPC peering connection",
        description: "If you can't move them to the same VPC, create a peering connection and update route tables.",
        command: `# Create peering
aws ec2 create-vpc-peering-connection \\
  --vpc-id vpc-app-xxx \\
  --peer-vpc-id vpc-rds-xxx

# Update route tables in both VPCs to route to each other via the peering
# (then update SGs to allow cross-VPC traffic)`,
      },
      {
        type: "investigation",
        title: "Step 5: Check RDS public accessibility",
        description: "If the app is outside AWS (on-prem or different network), verify RDS has PubliclyAccessible=true and the SG allows your IP.",
        command: "aws rds describe-db-instances --db-instance-identifier mydb --query 'DBInstances[0].PubliclyAccessible'",
        output: `false  // Not accessible from outside AWS`,
      },
      {
        type: "prevention",
        title: "Prevention",
        description: "(1) Reference SGs by ID, not CIDR. (2) Keep EC2 and RDS in the same VPC unless required otherwise. (3) For dev, use Session Manager instead of opening DB to internet. (4) Document expected network paths in architecture diagrams.",
      },
    ],
    keyLearnings: [
      "Most 'cannot connect to RDS' issues are SG or VPC mismatches.",
      "Reference SGs by name (source-group) instead of CIDR.",
      "EC2 and RDS must be in the same VPC (or peered VPCs).",
      "Production RDS should NEVER have PubliclyAccessible=true.",
    ],
  },
  {
    id: "ts-ecs-task-stopped",
    title: "ECS Task Repeatedly Stopping",
    category: "Containers",
    level: "advanced",
    estimatedTime: 25,
    scenario: "An ECS Fargate task starts, runs for ~30 seconds, then stops with exit code 137. The service keeps restarting it. Diagnose and fix.",
    steps: [
      {
        type: "symptom",
        title: "ECS service shows 'STOPPED (Essential container exited)'",
        description: "CloudWatch shows the task repeatedly going RUNNING → STOPPED. Exit code 137. Application logs stop after ~30s.",
      },
      {
        type: "investigation",
        title: "Step 1: Check stopped task details",
        description: "Use describe-tasks to see why the task stopped.",
        command: "aws ecs describe-tasks --cluster my-cluster --tasks <task-id>",
        output: `{
  "tasks": [{
    "stoppedReason": "Essential container in task exited",
    "containers": [{
      "exitCode": 137,
      "reason": "OutOfMemoryError: Container killed due to memory usage"
    }]
  }]
}`,
      },
      {
        type: "root-cause",
        title: "Root cause: Container OOM-killed (exit code 137)",
        description: "Exit code 137 = SIGKILL, almost always an Out-Of-Memory kill. The container exceeded its memory limit and the kernel killed it. The application's Java/Node/Python process is using more memory than the task's 'memory' allocation.",
      },
      {
        type: "investigation",
        title: "Step 2: Check task memory vs. app actual memory",
        description: "Check the task definition's memory setting, then check CloudWatch metrics for the actual memory usage pattern.",
        command: "aws ecs describe-task-definition --task-definition my-task",
        output: `{
  "memory": "512"  // 512 MB hard limit
}`,
      },
      {
        type: "investigation",
        title: "Step 3: Check container logs for OOM or heap errors",
        description: "Look at the application's CloudWatch logs for OOM messages, heap exhaustion, or GC thrashing.",
        command: "aws logs filter-log-events --log-group-name /ecs/my-app --filter-pattern 'OutOfMemoryError'",
        output: `Found 5 events:
"java.lang.OutOfMemoryError: Java heap space"
"java.lang.OutOfMemoryError: GC overhead limit exceeded"`,
      },
      {
        type: "fix",
        title: "Option A: Increase task memory",
        description: "If the app legitimately needs more memory, increase the task's memory allocation.",
        command: `# Update task definition with more memory
aws ecs register-task-definition \\
  --family my-task \\
  --memory 2048 \\
  --container-definitions file://containers.json`,
      },
      {
        type: "fix",
        title: "Option B: Tune the JVM/app heap",
        description: "Java apps often have a fixed max heap (-Xmx). Set it to ~75% of container memory to leave room for non-heap usage.",
        command: `# In container definition environment:
JAVA_OPTS: "-Xmx1536m -Xms512m"
# For a 2GB container, leave 512MB for off-heap + native memory`,
      },
      {
        type: "investigation",
        title: "Step 4: Check for memory leaks",
        description: "If memory keeps growing until OOM, you have a leak. Capture a heap dump just before the OOM and analyze.",
        command: `# Add to container env:
JAVA_OPTS: "-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/heapdump.hprof"

# After OOM, the heap dump is in the container's /tmp
# (but container is gone — mount EFS or send to S3)`,
      },
      {
        type: "prevention",
        title: "Prevention",
        description: "(1) Always set JVM -Xmx to ~75% of container memory. (2) Set CloudWatch alarm on memory utilization > 80%. (3) Use ECS Execute Command to debug running tasks. (4) Load-test new containers with realistic data before deploying. (5) Capture heap dumps on OOM for analysis.",
      },
    ],
    keyLearnings: [
      "Exit code 137 = SIGKILL = almost always OOM kill.",
      "Check 'stoppedReason' and 'exitCode' in describe-tasks.",
      "JVM -Xmx should be ~75% of container memory limit.",
      "Memory leaks in containers look like 'works for 30s then dies' — capture heap dumps.",
    ],
  },
  {
    id: "ts-private-no-internet",
    title: "Private Subnet Cannot Reach Internet",
    category: "Networking",
    level: "intermediate",
    estimatedTime: 18,
    scenario: "An EC2 instance in a private subnet cannot reach the internet. Application errors: 'Could not resolve host: registry.npmjs.org'.",
    steps: [
      {
        type: "symptom",
        title: "Application cannot download packages",
        description: "Application on EC2 (private subnet) fails to: curl external URLs, download OS updates, run npm install. Error: 'Could not resolve host' or 'Connection timed out'.",
      },
      {
        type: "investigation",
        title: "Step 1: Test DNS resolution",
        description: "Test if DNS works at all.",
        command: "nslookup registry.npmjs.org",
        output: `;; connection timed out; no servers could be reached`,
      },
      {
        type: "investigation",
        title: "Step 2: Check the subnet's route table",
        description: "The subnet's route table must have a 0.0.0.0/0 route to a NAT gateway (or instance).",
        command: "aws ec2 describe-route-tables --route-table-id rtb-private-xxx",
        output: `{
  "RouteTables": [{
    "Routes": [
      { "DestinationCidrBlock": "10.0.0.0/16", "GatewayId": "local" }
      // NO 0.0.0.0/0 route at all!
    ]
  }]
}`,
      },
      {
        type: "root-cause",
        title: "Root cause: Subnet has no NAT route",
        description: "The private subnet's route table has no default route (0.0.0.0/0). Without it, all non-VPC traffic is dropped. You need to add a NAT gateway in a public subnet and route to it.",
      },
      {
        type: "fix",
        title: "Create a NAT Gateway and update the route table",
        description: "Allocate an EIP, create a NAT gateway in a PUBLIC subnet, then update the private subnet's route table.",
        command: `# Step 1: Allocate an EIP
aws ec2 allocate-address --domain vpc

# Step 2: Create NAT gateway in a PUBLIC subnet
aws ec2 create-nat-gateway \\
  --subnet-id subnet-public-xxx \\
  --allocation-id eipalloc-xxx

# Step 3: Wait for NAT to be available
aws ec2 wait nat-gateway-available --nat-gateway-id nat-xxx

# Step 4: Update the private subnet's route table
aws ec2 create-route \\
  --route-table-id rtb-private-xxx \\
  --destination-cidr-block 0.0.0.0/0 \\
  --nat-gateway-id nat-xxx`,
      },
      {
        type: "investigation",
        title: "Step 3: Verify DNS works",
        description: "After adding the NAT route, DNS should resolve and external connections should work.",
        command: "nslookup registry.npmjs.org",
        output: `Server: 10.0.0.2  # AWS-provided DNS
Address: 10.0.0.2#53

Non-authoritative answer:
Name: registry.npmjs.org
Address: 104.16.85.20`,
      },
      {
        type: "investigation",
        title: "Step 4: Verify HTTPS works",
        description: "Test outbound HTTPS to confirm full connectivity.",
        command: "curl -I https://registry.npmjs.org/",
        output: `HTTP/2 200
content-type: application/json
...`,
      },
      {
        type: "fix",
        title: "Cost optimization: Use VPC endpoints for AWS services",
        description: "If the private subnet only needs to reach AWS services (S3, DynamoDB), use VPC endpoints instead of NAT — saves $32/month NAT fee + $0.045/GB.",
        command: `# Create Gateway endpoint for S3 (free!)
aws ec2 create-vpc-endpoint \\
  --vpc-id vpc-xxx \\
  --service-name com.amazonaws.us-east-1.s3 \\
  --route-table-ids rtb-private-xxx`,
      },
      {
        type: "prevention",
        title: "Prevention",
        description: "(1) Always set up NAT gateways when creating private subnets. (2) For high-volume S3/DynamoDB traffic, use VPC Gateway endpoints (free) to save NAT costs. (3) Use CDK/Terraform to define VPCs so the NAT/route configuration is standard. (4) One NAT per AZ for HA — but cost-conscious teams often start with one and add per-AZ later.",
      },
    ],
    keyLearnings: [
      "Private subnets need a NAT gateway (in a public subnet) for internet access.",
      "Update the private subnet's route table: 0.0.0.0/0 → NAT gateway.",
      "VPC Gateway Endpoints (S3, DynamoDB) are free and reduce NAT data-processing costs.",
      "For HA, deploy one NAT per AZ; cost-conscious teams often start with one.",
    ],
  },
];

// ----------------------------------------------------------------------------
// PROJECTS
// ----------------------------------------------------------------------------

export interface ProjectStep {
  title: string;
  description: string;
  command?: string;
  cliEquivalent?: string;
  warning?: string;
}

export interface Project {
  id: string;
  title: string;
  level: SkillLevel;
  estimatedHours: number;
  cost: string; // cost estimate
  description: string;
  objectives: string[];
  architecture: {
    nodes: { id: string; label: string; type: string }[];
    edges: { from: string; to: string; label?: string }[];
  };
  steps: ProjectStep[];
  troubleshooting: { problem: string; solution: string }[];
  security: string[];
  cleanup: string[];
  extensions: string[];
}

export const projects: Project[] = [
  {
    id: "project-1-static-website",
    title: "Project 1: Host a Static Website on S3 + CloudFront",
    level: "beginner",
    estimatedHours: 1.5,
    cost: "~$0.50/month for low traffic",
    description: "Deploy a static website (HTML/CSS/JS) using S3 for storage and CloudFront as a global CDN. The classic serverless website pattern.",
    objectives: [
      "Create an S3 bucket configured for static website hosting",
      "Upload website content via CLI",
      "Configure a CloudFront distribution for HTTPS and global caching",
      "Verify the site is accessible globally with low latency",
    ],
    architecture: {
      nodes: [
        { id: "user", label: "User (browser)", type: "client" },
        { id: "dns", label: "Route 53", type: "edge" },
        { id: "cf", label: "CloudFront (CDN)", type: "edge" },
        { id: "s3", label: "S3 Bucket (static site)", type: "storage" },
      ],
      edges: [
        { from: "user", to: "dns", label: "resolves" },
        { from: "dns", to: "cf", label: "routes to" },
        { from: "cf", to: "s3", label: "fetches content" },
      ],
    },
    steps: [
      {
        title: "Step 1: Create the S3 bucket",
        description: "Bucket names are globally unique. Pick something like 'my-static-site-<your-name>'.",
        command: `aws s3api create-bucket \\
  --bucket my-static-site-yourname \\
  --region us-east-1`,
      },
      {
        title: "Step 2: Enable static website hosting",
        description: "Configure S3 to serve index.html for the root path and 404.html for errors.",
        command: `aws s3api put-bucket-website \\
  --bucket my-static-site-yourname \\
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "404.html"}
  }'`,
      },
      {
        title: "Step 3: Create your website content",
        description: "Create a simple index.html and 404.html locally.",
        command: `mkdir -p ./site
cat > ./site/index.html <<'EOF'
<!DOCTYPE html>
<html><head><title>My Static Site</title></head>
<body><h1>Hello from S3!</h1></body></html>
EOF
cp ./site/index.html ./site/404.html`,
      },
      {
        title: "Step 4: Upload the content",
        description: "Sync the local site/ directory to S3.",
        command: `aws s3 sync ./site/ s3://my-static-site-yourname/ \\
  --acl public-read`,
        warning: "ACL public-read is required for raw S3 website hosting. When we add CloudFront, we'll remove public access for better security.",
      },
      {
        title: "Step 5: Verify the S3 website endpoint works",
        description: "Test the raw S3 website URL in your browser.",
        command: `# Open in browser:
echo "http://my-static-site-yourname.s3-website-us-east-1.amazonaws.com"`,
      },
      {
        title: "Step 6: Create a CloudFront distribution",
        description: "CloudFront adds HTTPS, global edge caching, and DDoS protection. This is the production-grade version.",
        command: `aws cloudfront create-distribution \\
  --origin-domain-name my-static-site-yourname.s3-website-us-east-1.amazonaws.com \\
  --default-root-object index.html \\
  --enabled`,
      },
      {
        title: "Step 7: Wait for distribution to deploy",
        description: "CloudFront distributions take 5-15 minutes to deploy globally. Wait for Status=Deployed.",
        command: `aws cloudfront wait distribution-deployed \\
  --id <distribution-id-from-step-6>`,
      },
      {
        title: "Step 8: Test your global site",
        description: "Access via the CloudFront domain (something like d12345abc.cloudfront.net). Test from different regions to see global caching in action.",
        command: `curl -I https://<distribution-domain>/index.html`,
      },
      {
        title: "Step 9: (Optional) Add a custom domain",
        description: "Use Route 53 to point your own domain at CloudFront. ACM provides free TLS certs.",
      },
    ],
    troubleshooting: [
      { problem: "403 Forbidden when accessing S3 URL", solution: "Bucket policy or ACL doesn't allow public read. Either add a bucket policy with s3:GetObject to *, or use CloudFront Origin Access Control (OAC) for secure access." },
      { problem: "CloudFront returns old content after update", solution: "CloudFront caches at edge locations for the TTL in the cache behavior. Either invalidate the cache (costs $0.005 per path) or wait for TTL expiry." },
      { problem: "HTTPS not working", solution: "CloudFront provides HTTPS by default on *.cloudfront.net. For custom domains, you need an ACM certificate (must be in us-east-1)." },
    ],
    security: [
      "Prefer CloudFront Origin Access Control (OAC) over public S3 — only CloudFront can read the bucket.",
      "Enable Block Public Access on the bucket when using CloudFront OAC.",
      "Use HTTPS-only by setting the CloudFront viewer protocol policy to 'redirect-to-https'.",
      "Add AWS WAF for protection against SQL injection, XSS, and rate limiting.",
    ],
    cleanup: [
      "Empty the S3 bucket: 'aws s3 rm s3://my-static-site-yourname --recursive'",
      "Delete the S3 bucket: 'aws s3api delete-bucket --bucket my-static-site-yourname'",
      "Disable and delete the CloudFront distribution (must disable first, then delete after a few minutes).",
      "Verify in the console that no resources remain — they continue to bill until deleted.",
    ],
    extensions: [
      "Add a custom domain with Route 53 + ACM TLS certificate.",
      "Add AWS WAF for DDoS protection and SQL injection filtering.",
      "Use Lambda@Edge to add HTTP headers (security headers, A/B testing).",
      "Set up a CI/CD pipeline: GitHub → CodeBuild → sync to S3 → invalidate CloudFront.",
      "Add structured logging via CloudFront access logs to S3 + Athena for analytics.",
    ],
  },
  {
    id: "project-2-ec2-webserver",
    title: "Project 2: Deploy a Web Application on EC2",
    level: "beginner",
    estimatedHours: 2,
    cost: "~$2/month for t3.micro (free tier eligible)",
    description: "Launch an EC2 instance, install a web server via user data, configure security groups, and access your application over the internet.",
    objectives: [
      "Launch an EC2 instance with a user data script that installs Apache",
      "Configure a security group to allow HTTP and SSH",
      "Access the web server via its public IP",
      "Connect via SSH and verify the application",
    ],
    architecture: {
      nodes: [
        { id: "user", label: "User (browser)", type: "client" },
        { id: "internet", label: "Internet", type: "external" },
        { id: "ec2", label: "EC2 Instance (Apache)", type: "compute" },
        { id: "sg", label: "Security Group", type: "security" },
      ],
      edges: [
        { from: "user", to: "internet", label: "HTTP" },
        { from: "internet", to: "ec2", label: "port 80" },
        { from: "sg", to: "ec2", label: "filters" },
      ],
    },
    steps: [
      {
        title: "Step 1: Create a key pair (for SSH)",
        description: "Key pairs authenticate SSH access. AWS stores the public key; you download the private key once.",
        command: `aws ec2 create-key-pair \\
  --key-name my-keypair \\
  --query 'KeyMaterial' --output text > my-keypair.pem
chmod 400 my-keypair.pem`,
        warning: "If you lose the private key, you cannot SSH into the instance. Store it securely. NEVER commit it to git.",
      },
      {
        title: "Step 2: Create a security group",
        description: "Allow HTTP (port 80) from anywhere and SSH (port 22) from your IP only.",
        command: `# Create SG
aws ec2 create-security-group \\
  --group-name web-sg \\
  --description "Allow HTTP and SSH"

# Allow HTTP from anywhere
aws ec2 authorize-security-group-ingress \\
  --group-name web-sg \\
  --protocol tcp --port 80 --cidr 0.0.0.0/0

# Allow SSH from your IP only (replace with your IP)
MY_IP=$(curl -s https://checkip.amazonaws.com)
aws ec2 authorize-security-group-ingress \\
  --group-name web-sg \\
  --protocol tcp --port 22 --cidr \${MY_IP}/32`,
      },
      {
        title: "Step 3: Create user data script",
        description: "User data runs as root on first boot. We'll install Apache and create a simple page.",
        command: `cat > userdata.sh <<'EOF'
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Hello from $(hostname -f)</h1>" > /var/www/html/index.html
EOF`,
      },
      {
        title: "Step 4: Launch the EC2 instance",
        description: "Use the latest Amazon Linux 2023 AMI, t3.micro (free tier), with the SG and key pair.",
        command: `aws ec2 run-instances \\
  --image-id ami-0c7217cdde317cfec \\
  --instance-type t3.micro \\
  --key-name my-keypair \\
  --security-groups web-sg \\
  --user-data file://userdata.sh \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=web-server-01}]'`,
      },
      {
        title: "Step 5: Wait for instance to be running",
        description: "Use a waiter to block until the instance is in 'running' state.",
        command: `aws ec2 wait instance-running \\
  --instance-ids <instance-id-from-step-4>`,
      },
      {
        title: "Step 6: Get the public IP",
        description: "Fetch the public IP to access the instance.",
        command: `aws ec2 describe-instances \\
  --instance-ids <instance-id> \\
  --query 'Reservations[0].Instances[0].PublicIpAddress' \\
  --output text`,
      },
      {
        title: "Step 7: Wait for user data to finish",
        description: "User data takes ~60 seconds to install Apache. Wait a bit, then test.",
        command: `sleep 60
# Test in browser:
echo "http://<public-ip>"
# Or via curl:
curl http://<public-ip>`,
      },
      {
        title: "Step 8: SSH into the instance",
        description: "Connect via SSH to verify the system is healthy.",
        command: `ssh -i my-keypair.pem ec2-user@<public-ip>
# Inside:
sudo systemctl status httpd
sudo tail /var/log/cloud-init-output.log`,
      },
    ],
    troubleshooting: [
      { problem: "Cannot SSH: Permission denied", solution: "Wrong key file, wrong user (try ec2-user for Amazon Linux, ubuntu for Ubuntu AMIs), or your IP changed since you created the SG rule." },
      { problem: "Page loads but shows default Apache page", solution: "User data may still be running. Check 'sudo tail /var/log/cloud-init-output.log'. Or the index.html wasn't created — verify the script ran." },
      { problem: "Connection timed out on port 80", solution: "Security group missing port 80 rule, or instance is in a private subnet without IGW route. Re-check SG and subnet route table." },
    ],
    security: [
      "Restrict SSH (port 22) to your IP only — never 0.0.0.0/0.",
      "Use EC2 Instance Connect or Systems Manager Session Manager instead of long-lived SSH keys.",
      "Apply security patches regularly: 'sudo yum update -y'.",
      "Use IAM roles for instances (next project) instead of access keys for AWS API access.",
      "Enable VPC flow logs for network monitoring.",
    ],
    cleanup: [
      "Terminate the instance: 'aws ec2 terminate-instances --instance-ids <instance-id>'",
      "Delete the security group: 'aws ec2 delete-security-group --group-name web-sg'",
      "Delete the key pair: 'aws ec2 delete-key-pair --key-name my-keypair'",
      "Remove the local PEM file: 'rm my-keypair.pem'",
      "Verify no resources remain in the EC2 console — running instances bill until terminated.",
    ],
    extensions: [
      "Add an Application Load Balancer in front of multiple EC2 instances.",
      "Configure an Auto Scaling Group to handle traffic spikes.",
      "Deploy across 2 AZs for high availability.",
      "Use Elastic IP for a stable public IP that survives instance restarts.",
      "Replace Apache with Nginx or your custom application.",
      "Set up CloudWatch alarms on CPU and network metrics.",
    ],
  },
  {
    id: "project-3-serverless-api",
    title: "Project 3: Serverless API with Lambda + API Gateway + DynamoDB",
    level: "intermediate",
    estimatedHours: 3,
    cost: "Free tier covers most low-traffic usage; ~$1-5/month at moderate scale",
    description: "Build a complete serverless REST API: API Gateway for HTTP routing, Lambda for logic, DynamoDB for storage. The defining serverless pattern.",
    objectives: [
      "Create a DynamoDB table for storing items",
      "Write Lambda functions for CRUD operations",
      "Configure API Gateway to expose Lambda as REST API",
      "Test the API end-to-end with curl",
    ],
    architecture: {
      nodes: [
        { id: "client", label: "Client (curl)", type: "client" },
        { id: "apigw", label: "API Gateway", type: "edge" },
        { id: "lambda", label: "Lambda Function", type: "compute" },
        { id: "ddb", label: "DynamoDB Table", type: "database" },
        { id: "iam", label: "Lambda Role", type: "security" },
        { id: "cw", label: "CloudWatch Logs", type: "observability" },
      ],
      edges: [
        { from: "client", to: "apigw", label: "HTTPS" },
        { from: "apigw", to: "lambda", label: "invoke" },
        { from: "lambda", to: "ddb", label: "read/write" },
        { from: "iam", to: "lambda", label: "grants" },
        { from: "lambda", to: "cw", label: "logs" },
      ],
    },
    steps: [
      {
        title: "Step 1: Create the DynamoDB table",
        description: "Use a simple schema with 'id' as the partition key.",
        command: `aws dynamodb create-table \\
  --table-name items \\
  --attribute-definitions AttributeName=id,AttributeType=S \\
  --key-schema AttributeName=id,KeyType=HASH \\
  --billing-mode PAY_PER_REQUEST`,
      },
      {
        title: "Step 2: Create the Lambda execution role",
        description: "The role needs DynamoDB access + CloudWatch Logs.",
        command: `aws iam create-role \\
  --role-name items-lambda-role \\
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

aws iam attach-role-policy \\
  --role-name items-lambda-role \\
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Add DynamoDB access
aws iam put-role-policy \\
  --role-name items-lambda-role \\
  --policy-name DynamoDBAccess \\
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem","dynamodb:PutItem","dynamodb:UpdateItem","dynamodb:DeleteItem","dynamodb:Scan"],
      "Resource": "arn:aws:dynamodb:*:*:table/items"
    }]
  }'`,
      },
      {
        title: "Step 3: Write the Lambda function",
        description: "A single function handling all CRUD operations, routing based on HTTP method + path.",
        command: `# Save as app.py
import json
import boto3
import uuid

ddb = boto3.resource('dynamodb')
table = ddb.Table('items')

def lambda_handler(event, context):
    method = event['httpMethod']
    path = event.get('path', '')
    
    if method == 'GET' and path == '/items':
        return list_items()
    elif method == 'POST' and path == '/items':
        return create_item(event)
    elif method == 'GET' and path.startswith('/items/'):
        return get_item(event)
    else:
        return {'statusCode': 404, 'body': json.dumps({'error': 'Not found'})}

def list_items():
    result = table.scan()
    return {'statusCode': 200, 'body': json.dumps(result['Items'])}

def create_item(event):
    body = json.loads(event['body'])
    item = {'id': str(uuid.uuid4()), **body}
    table.put_item(Item=item)
    return {'statusCode': 201, 'body': json.dumps(item)}

def get_item(event):
    item_id = event['path'].split('/')[-1]
    result = table.get_item(Key={'id': item_id})
    if 'Item' not in result:
        return {'statusCode': 404, 'body': json.dumps({'error': 'Not found'})}
    return {'statusCode': 200, 'body': json.dumps(result['Item'])}`,
      },
      {
        title: "Step 4: Package and create the Lambda function",
        description: "Zip the code and create the function.",
        command: `zip function.zip app.py

aws lambda create-function \\
  --function-name items-api \\
  --runtime python3.12 \\
  --handler app.lambda_handler \\
  --role arn:aws:iam::<account>:role/items-lambda-role \\
  --zip-file fileb://function.zip`,
      },
      {
        title: "Step 5: Test the Lambda function directly",
        description: "Invoke with a test event before wiring up API Gateway.",
        command: `aws lambda invoke \\
  --function-name items-api \\
  --payload '{"httpMethod":"GET","path":"/items"}' \\
  response.json
cat response.json`,
      },
      {
        title: "Step 6: Create the API Gateway",
        description: "Create a REST API with a proxy resource that forwards everything to Lambda.",
        command: `# Create API
API_ID=$(aws apigateway create-rest-api \\
  --name items-api \\
  --query 'id' --output text)

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources \\
  --rest-api-id $API_ID \\
  --query 'items[0].id' --output text)

# Create proxy resource {proxy+}
RESOURCE_ID=$(aws apigateway create-resource \\
  --rest-api-id $API_ID \\
  --parent-id $ROOT_ID \\
  --path-part {proxy+} \\
  --query 'id' --output text)

# Add ANY method with Lambda proxy integration
aws apigateway put-integration \\
  --rest-api-id $API_ID \\
  --resource-id $RESOURCE_ID \\
  --http-method ANY \\
  --type AWS_PROXY \\
  --integration-http-method POST \\
  --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:<account>:function:items-api/invocations

# Grant API Gateway permission to invoke Lambda
aws lambda add-permission \\
  --function-name items-api \\
  --statement-id apigw \\
  --action lambda:InvokeFunction \\
  --principal apigateway.amazonaws.com \\
  --source-arn arn:aws:execute-api:us-east-1:<account>:$API_ID/*`,
      },
      {
        title: "Step 7: Deploy the API",
        description: "Create a deployment and a stage (prod).",
        command: `aws apigateway create-deployment \\
  --rest-api-id $API_ID \\
  --stage-name prod

echo "API URL: https://$API_ID.execute-api.us-east-1.amazonaws.com/prod"`,
      },
      {
        title: "Step 8: Test the API end-to-end",
        description: "Use curl to test CRUD operations against your new API.",
        command: `API_URL="https://$API_ID.execute-api.us-east-1.amazonaws.com/prod"

# Create an item
curl -X POST $API_URL/items \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"First item","description":"Hello world"}'

# List items
curl $API_URL/items

# Get a specific item (replace <id>)
curl $API_URL/items/<id>`,
      },
    ],
    troubleshooting: [
      { problem: "Internal server error (500) from API Gateway", solution: "Check CloudWatch Logs for the Lambda function. Most common: malformed event parsing, missing IAM permission, or DynamoDB table not yet active." },
      { problem: "AccessDenied when Lambda calls DynamoDB", solution: "Lambda role lacks DynamoDB permissions. Verify the inline policy has the right table ARN and actions." },
      { problem: "Timeout errors", solution: "DynamoDB queries are usually fast. If timeouts occur, check table capacity (on-demand scales automatically; provisioned can throttle)." },
      { problem: "CORS errors from browser", solution: "Enable CORS on API Gateway methods. Add 'Access-Control-Allow-Origin' header in Lambda response." },
    ],
    security: [
      "Use API Gateway throttling and usage plans to prevent abuse.",
      "Add Cognito or Lambda authorizer for authentication.",
      "Use VPC endpoint if Lambda needs private access to VPC resources.",
      "Enable CloudTrail to audit all API calls.",
      "Store secrets in Secrets Manager or SSM Parameter Store, not in env vars in plaintext.",
    ],
    cleanup: [
      "Delete the API Gateway: 'aws apigateway delete-rest-api --rest-api-id $API_ID'",
      "Delete the Lambda function: 'aws lambda delete-function --function-name items-api'",
      "Delete the DynamoDB table: 'aws dynamodb delete-table --table-name items'",
      "Delete the IAM role: 'aws iam delete-role --role-name items-lambda-role' (detach policies first)",
      "Verify no resources remain in the console — all four services bill until deleted.",
    ],
    extensions: [
      "Add Cognito authentication for end-user signup/login.",
      "Use AWS SAM or CDK to define infrastructure as code.",
      "Add a custom domain + ACM TLS certificate.",
      "Add DynamoDB Streams + Lambda for event-driven processing.",
      "Deploy via CodePipeline: GitHub → CodeBuild → SAM deploy.",
      "Add OpenAPI spec + request validation.",
      "Set up X-Ray for distributed tracing.",
    ],
  },
  {
    id: "project-4-ec2-autoscaling-rds",
    title: "Project 4: Production-Style Web App with Auto Scaling + RDS",
    level: "advanced",
    estimatedHours: 4,
    cost: "~$30-60/month for the full stack (mostly RDS)",
    description: "Build a production-grade 3-tier web application: ALB → EC2 Auto Scaling (multi-AZ) → RDS Multi-AZ. The most common production AWS architecture.",
    objectives: [
      "Create a VPC with public + private subnets across 2 AZs",
      "Deploy an RDS PostgreSQL instance in private subnets with Multi-AZ",
      "Set up an Application Load Balancer in public subnets",
      "Create an Auto Scaling Group spanning 2 AZs",
      "Configure the ASG to scale based on CPU utilization",
    ],
    architecture: {
      nodes: [
        { id: "user", label: "Users", type: "client" },
        { id: "dns", label: "Route 53", type: "edge" },
        { id: "alb", label: "Application Load Balancer", type: "network" },
        { id: "asg", label: "Auto Scaling Group", type: "compute" },
        { id: "ec2-a", label: "EC2 (AZ-a)", type: "compute" },
        { id: "ec2-b", label: "EC2 (AZ-b)", type: "compute" },
        { id: "rds-p", label: "RDS Primary (AZ-a)", type: "database" },
        { id: "rds-s", label: "RDS Standby (AZ-b)", type: "database" },
      ],
      edges: [
        { from: "user", to: "dns" },
        { from: "dns", to: "alb" },
        { from: "alb", to: "ec2-a" },
        { from: "alb", to: "ec2-b" },
        { from: "asg", to: "ec2-a" },
        { from: "asg", to: "ec2-b" },
        { from: "ec2-a", to: "rds-p" },
        { from: "ec2-b", to: "rds-p" },
        { from: "rds-p", to: "rds-s", label: "sync replication" },
      ],
    },
    steps: [
      {
        title: "Step 1: Create the VPC with public + private subnets in 2 AZs",
        description: "Use CloudFormation or CDK for reproducibility. CLI version shown here for educational purposes.",
        command: `# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query Vpc.VpcId --output text
# Returns vpc-xxx

# Create 4 subnets: 2 public + 2 private across 2 AZs
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.11.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.12.0/24 --availability-zone us-east-1b

# Create and attach Internet Gateway
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-xxx --internet-gateway-id igw-xxx

# Create NAT Gateway in a public subnet
aws ec2 allocate-address --domain vpc  # returns eipalloc
aws ec2 create-nat-gateway --subnet-id subnet-public-a --allocation-id eipalloc-xxx`,
        warning: "This is a lot of CLI for educational purposes. In production, use CloudFormation/CDK/Terraform — see Project extension.",
      },
      {
        title: "Step 2: Configure route tables",
        description: "Public subnets route to IGW; private subnets route to NAT.",
        command: `# Public route table: route to IGW
aws ec2 create-route-table --vpc-id vpc-xxx
aws ec2 create-route --route-table-id rtb-public --destination-cidr-block 0.0.0.0/0 --gateway-id igw-xxx

# Associate public subnets
aws ec2 associate-route-table --subnet-id subnet-public-a --route-table-id rtb-public
aws ec2 associate-route-table --subnet-id subnet-public-b --route-table-id rtb-public

# Private route table: route to NAT
aws ec2 create-route-table --vpc-id vpc-xxx
aws ec2 create-route --route-table-id rtb-private --destination-cidr-block 0.0.0.0/0 --nat-gateway-id nat-xxx

aws ec2 associate-route-table --subnet-id subnet-private-a --route-table-id rtb-private
aws ec2 associate-route-table --subnet-id subnet-private-b --route-table-id rtb-private`,
      },
      {
        title: "Step 3: Create security groups",
        description: "Three SGs: web (ALB), app (EC2), db (RDS). Each tier only accepts traffic from the previous.",
        command: `# ALB SG: allow HTTP/HTTPS from internet
aws ec2 create-security-group --group-name web-alb-sg --description "ALB SG"

# App SG: allow HTTP from ALB SG
aws ec2 create-security-group --group-name app-sg --description "App SG"
aws ec2 authorize-security-group-ingress --group-name app-sg --protocol tcp --port 8080 --source-group web-alb-sg-id

# DB SG: allow 5432 from App SG
aws ec2 create-security-group --group-name db-sg --description "DB SG"
aws ec2 authorize-security-group-ingress --group-name db-sg --protocol tcp --port 5432 --source-group app-sg-id`,
      },
      {
        title: "Step 4: Create a DB subnet group and RDS instance",
        description: "DB subnet group spans both private subnets. RDS is Multi-AZ for HA.",
        command: `aws rds create-db-subnet-group \\
  --db-subnet-group-name my-db-subnet-group \\
  --db-subnet-group-description "DB subnet group" \\
  --subnet-ids subnet-private-a subnet-private-b

aws rds create-db-instance \\
  --db-instance-identifier prod-db \\
  --db-instance-class db.t3.micro \\
  --engine postgres \\
  --master-username admin \\
  --master-user-password <use-secrets-manager> \\
  --allocated-storage 20 \\
  --storage-encrypted \\
  --multi-az \\
  --db-subnet-group-name my-db-subnet-group \\
  --vpc-security-group-ids sg-db-id`,
        warning: "NEVER put passwords in CLI. Use --manage-master-user-password (RDS generates and stores in Secrets Manager) for production.",
      },
      {
        title: "Step 5: Create a launch template",
        description: "The template defines how new EC2 instances are configured: AMI, instance type, SG, user data.",
        command: `cat > app-userdata.sh <<'EOF'
#!/bin/bash
yum install -y httpd postgresql-devel
systemctl start httpd
systemctl enable httpd

# Fetch DB credentials from Secrets Manager
DB_CREDS=$(aws secretsmanager get-secret-value --secret-id prod-db-secret --query SecretString --output text)
DB_HOST=$(echo $DB_CREDS | jq -r .host)
DB_USER=$(echo $DB_CREDS | jq -r .username)
DB_PASS=$(echo $DB_CREDS | jq -r .password)

# Configure app to connect to RDS
cat > /etc/httpd/conf/httpd.conf <<CONF
SetEnv DB_HOST "$DB_HOST"
SetEnv DB_USER "$DB_USER"
SetEnv DB_PASS "$DB_PASS"
CONF
systemctl restart httpd
EOF

aws ec2 create-launch-template \\
  --launch-template-name app-template \\
  --launch-template-data '{
    "ImageId": "ami-0c7217cdde317cfec",
    "InstanceType": "t3.micro",
    "SecurityGroupIds": ["sg-app-id"],
    "UserData": "'$(base64 app-userdata.sh)'",
    "IamInstanceProfile": {"Name": "app-instance-profile"}
  }'`,
      },
      {
        title: "Step 6: Create the Application Load Balancer",
        description: "ALB spans public subnets in both AZs. Target group tracks healthy instances.",
        command: `aws elbv2 create-load-balancer \\
  --name web-alb \\
  --subnets subnet-public-a subnet-public-b \\
  --security-groups sg-alb-id

aws elbv2 create-target-group \\
  --name app-targets \\
  --protocol HTTP \\
  --port 8080 \\
  --vpc-id vpc-xxx \\
  --health-check-path /health`,
      },
      {
        title: "Step 7: Create the Auto Scaling Group",
        description: "ASG spans both private subnets, uses the launch template, and registers with the target group.",
        command: `aws autoscaling create-auto-scaling-group \\
  --auto-scaling-group-name app-asg \\
  --launch-template LaunchTemplateName=app-template \\
  --min-size 2 \\
  --max-size 6 \\
  --desired-capacity 2 \\
  --vpc-zone-identifier "subnet-private-a,subnet-private-b" \\
  --target-group-arns arn:aws:elasticloadbalancing:...:targetgroup/app-targets/xxx`,
      },
      {
        title: "Step 8: Configure target tracking scaling",
        description: "Keep average CPU at 50% — simplest and most robust scaling policy.",
        command: `aws autoscaling put-scaling-policy \\
  --auto-scaling-group-name app-asg \\
  --policy-name cpu-target-tracking \\
  --policy-type TargetTrackingScaling \\
  --target-tracking-configuration '{
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ASGAverageCPUUtilization"
    },
    "TargetValue": 50.0
  }'`,
      },
      {
        title: "Step 9: Add a listener on the ALB",
        description: "Forward HTTP port 80 to the target group. (Add HTTPS with ACM cert for production.)",
        command: `aws elbv2 create-listener \\
  --load-balancer-arn arn:aws:elasticloadbalancing:...:load-balancer/web-alb/xxx \\
  --protocol HTTP \\
  --port 80 \\
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...:targetgroup/app-targets/xxx`,
      },
      {
        title: "Step 10: Test the architecture",
        description: "Hit the ALB DNS, verify traffic is distributed, and watch the ASG scale when load increases.",
        command: `# Get ALB DNS
aws elbv2 describe-load-balancers --names web-alb --query 'LoadBalancers[0].DNSName' --output text

# Send load to trigger scaling
ab -n 100000 -c 100 http://<alb-dns>/

# Watch the ASG scale up (in another terminal):
watch aws autoscaling describe-auto-scaling-groups \\
  --auto-scaling-group-name app-asg \\
  --query 'AutoScalingGroups[0].Instances'`,
      },
    ],
    troubleshooting: [
      { problem: "Instances fail health checks", solution: "Check the app is listening on the target group port (8080), the health check path returns 200, and the app SG allows traffic from the ALB SG on that port." },
      { problem: "App cannot reach RDS", solution: "Verify the app SG is allowed in the DB SG on port 5432. Both must be in the same VPC or peered VPCs." },
      { problem: "ASG doesn't scale under load", solution: "Verify the target tracking policy is set. Check CloudWatch metrics for the ASG. Warm-up period (default 300s) may delay scaling." },
      { problem: "RDS failover test fails", solution: "Reboot the RDS instance with --force-failover to test. Failover should take 60-120 seconds. Verify app reconnects automatically (connection pooling helps)." },
    ],
    security: [
      "RDS in private subnets only — never publicly accessible.",
      "EC2 in private subnets; ALB is the only public-facing component.",
      "Each tier's SG only accepts traffic from the previous tier's SG.",
      "Use Secrets Manager for DB credentials — never in user data plaintext.",
      "Enable RDS encryption at creation (cannot add later).",
      "Use HTTPS on ALB with ACM certificate.",
      "Enable CloudTrail and VPC flow logs.",
    ],
    cleanup: [
      "Delete the ASG (instances terminate automatically): 'aws autoscaling delete-auto-scaling-group --auto-scaling-group-name app-asg'",
      "Delete the ALB and target group: 'aws elbv2 delete-load-balancer --load-balancer-arn ...'",
      "Delete the RDS instance (final snapshot optional): 'aws rds delete-db-instance --db-instance-identifier prod-db --skip-final-snapshot'",
      "Delete the launch template and security groups.",
      "Release the Elastic IP from the NAT gateway, delete the NAT.",
      "Delete the VPC, subnets, route tables, IGW.",
      "Verify in the console that all resources are gone — especially RDS, NAT, and EIPs which bill continuously.",
    ],
    extensions: [
      "Add HTTPS to the ALB with an ACM certificate.",
      "Use AWS CDK or Terraform for reproducible infrastructure.",
      "Add CloudWatch alarms for high CPU, low memory, 5xx error rate.",
      "Deploy via CodePipeline: GitHub → CodeBuild → ASG rolling deploy.",
      "Add Route 53 with a custom domain.",
      "Add an ElastiCache (Redis) layer for session storage.",
      "Use Secrets Manager with automatic rotation for DB credentials.",
      "Implement blue/green deployments with CodeDeploy.",
    ],
  },
  {
    id: "project-5-containerized",
    title: "Project 5: Containerized App with ECS + Fargate",
    level: "advanced",
    estimatedHours: 3,
    cost: "~$15-30/month for low-traffic Fargate deployment",
    description: "Containerize a Node.js/Python app, push to ECR, deploy to ECS Fargate behind an ALB. The modern way to run stateless workloads.",
    objectives: [
      "Write a production-quality Dockerfile",
      "Create an ECR repository and push the image",
      "Define an ECS task definition for Fargate",
      "Create an ECS service with ALB integration",
      "Test the deployed containerized application",
    ],
    architecture: {
      nodes: [
        { id: "user", label: "User", type: "client" },
        { id: "alb", label: "ALB", type: "network" },
        { id: "ecs", label: "ECS Cluster", type: "container" },
        { id: "task", label: "Fargate Task (2 replicas)", type: "container" },
        { id: "ecr", label: "ECR (image)", type: "container" },
        { id: "cw", label: "CloudWatch Logs", type: "observability" },
      ],
      edges: [
        { from: "user", to: "alb" },
        { from: "alb", to: "task" },
        { from: "ecs", to: "task" },
        { from: "task", to: "ecr", label: "pulls image" },
        { from: "task", to: "cw", label: "stdout/stderr" },
      ],
    },
    steps: [
      {
        title: "Step 1: Write a production-quality Dockerfile",
        description: "Small base image, dependencies cached separately, non-root user.",
        command: [
          "# Dockerfile",
          "FROM node:20-alpine AS builder",
          "WORKDIR /app",
          "COPY package*.json ./",
          "RUN npm ci",
          "COPY . .",
          "RUN npm run build",
          "",
          "FROM node:20-alpine",
          "WORKDIR /app",
          "COPY --from=builder /app/node_modules ./node_modules",
          "COPY --from=builder /app/dist ./dist",
          "COPY --from=builder /app/package.json .",
          "USER node",
          "EXPOSE 3000",
          'CMD ["node", "dist/main.js"]',
        ].join("\n"),
      },
      {
        title: "Step 2: Build and test the image locally",
        description: "Build, run, and verify before pushing to ECR.",
        command: `docker build -t my-app .
docker run -p 3000:3000 my-app
# Test in another terminal:
curl http://localhost:3000/health`,
      },
      {
        title: "Step 3: Create an ECR repository and authenticate",
        description: "Create a private ECR repository and authenticate Docker.",
        command: `aws ecr create-repository --repository-name my-app

aws ecr get-login-password | docker login \\
  --username AWS \\
  --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com`,
      },
      {
        title: "Step 4: Tag and push the image",
        description: "Tag with both a version (v1.0.0) and 'latest' for flexibility.",
        command: `docker tag my-app:latest <account>.dkr.ecr.us-east-1.amazonaws.com/my-app:v1.0.0
docker tag my-app:latest <account>.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/my-app:v1.0.0
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/my-app:latest`,
      },
      {
        title: "Step 5: Enable vulnerability scanning on push",
        description: "ECR can scan images for known CVEs automatically.",
        command: `aws ecr put-image-scanning-configuration \\
  --repository-name my-app \\
  --image-scanning-configuration scanOnPush=true`,
      },
      {
        title: "Step 6: Create ECS task execution role",
        description: "The execution role lets ECS pull the image and write logs.",
        command: `aws iam create-role --role-name ecs-execution \\
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ecs-tasks.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

aws iam attach-role-policy --role-name ecs-execution \\
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy`,
      },
      {
        title: "Step 7: Create the task definition",
        description: "Define the container spec: image, resources, env vars, logging.",
        command: `cat > task-definition.json <<EOF
{
  "family": "my-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::<account>:role/ecs-execution",
  "containerDefinitions": [{
    "name": "app",
    "image": "<account>.dkr.ecr.us-east-1.amazonaws.com/my-app:v1.0.0",
    "portMappings": [{"containerPort": 3000}],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/my-app",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }]
}
EOF

aws ecs register-task-definition --cli-input-json file://task-definition.json`,
      },
      {
        title: "Step 8: Create the ECS cluster",
        description: "For Fargate, the cluster is just a logical grouping — no EC2 instances to manage.",
        command: `aws ecs create-cluster --cluster-name my-cluster`,
      },
      {
        title: "Step 9: Create an ALB and target group",
        description: "Fargate tasks integrate with ALB for traffic distribution and health checks.",
        command: `aws elbv2 create-target-group \\
  --name my-app-tg \\
  --protocol HTTP \\
  --port 3000 \\
  --target-type ip \\
  --vpc-id vpc-xxx \\
  --health-check-path /health

aws elbv2 create-load-balancer \\
  --name my-app-alb \\
  --subnets subnet-public-a subnet-public-b \\
  --security-groups sg-alb-id`,
      },
      {
        title: "Step 10: Create the ECS service",
        description: "The service runs N copies of the task definition, behind the ALB.",
        command: `aws ecs create-service \\
  --cluster my-cluster \\
  --service-name my-app-service \\
  --task-definition my-app \\
  --desired-count 2 \\
  --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-private-a,subnet-private-b],securityGroups=[sg-app-id],assignPublicIp=DISABLED}" \\
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...:targetgroup/my-app-tg/xxx,containerName=app,containerPort=3000`,
      },
      {
        title: "Step 11: Verify the deployment",
        description: "Check service is stable, then test the ALB endpoint.",
        command: `aws ecs describe-services \\
  --cluster my-cluster \\
  --services my-app-service

# Get ALB DNS and test
ALB_DNS=$(aws elbv2 describe-load-balancers --names my-app-alb --query 'LoadBalancers[0].DNSName' --output text)
curl http://$ALB_DNS/health`,
      },
    ],
    troubleshooting: [
      { problem: "Task stops immediately with 'CannotPullContainerError'", solution: "ECS execution role lacks ECR pull permission, or the image tag is wrong. Verify the execution role has AmazonECSTaskExecutionRolePolicy attached." },
      { problem: "Task stops with exit code 137 (OOM)", solution: "Increase task memory. Java/Node may need explicit heap limits (-Xmx) set to ~75% of container memory." },
      { problem: "ALB health checks fail", solution: "Verify the app listens on the container port (3000), the health check path returns 200, and the app SG allows traffic from the ALB SG." },
      { problem: "Cannot pull image from ECR", solution: "Make sure the task execution role has ECR pull permission. Also verify the image tag exists in ECR." },
    ],
    security: [
      "Use scan-on-push in ECR — reject images with critical CVEs.",
      "Store secrets in Secrets Manager / Parameter Store; inject as env vars at task start.",
      "Tasks in private subnets only; ALB is the only public-facing component.",
      "Use ALB SG → App SG (never open app port to internet).",
      "Run containers as non-root user (USER directive in Dockerfile).",
      "Enable CloudWatch Container Insights for monitoring.",
    ],
    cleanup: [
      "Update service desired count to 0: 'aws ecs update-service --cluster my-cluster --service my-app-service --desired-count 0'",
      "Delete the service: 'aws ecs delete-service --cluster my-cluster --service my-app-service'",
      "Delete the ALB and target group",
      "Delete the ECS cluster: 'aws ecs delete-cluster --cluster my-cluster'",
      "Deregister task definitions (must deregister all revisions)",
      "Delete the ECR repository (must delete all images first): 'aws ecr delete-repository --repository-name my-app --force'",
      "Delete the execution IAM role",
    ],
    extensions: [
      "Set up CodePipeline for CI/CD: GitHub → CodeBuild → ECS deploy.",
      "Implement blue/green deployments with CodeDeploy.",
      "Add App Mesh for service mesh (mTLS, traffic shifting).",
      "Use ECS Exec for debugging running containers.",
      "Add Fargate Spot for cost savings on non-critical workloads.",
      "Auto-scale the service based on ALB request count per target.",
    ],
  },
  // Merge in expert-level projects (multi-region serverless, EKS GitOps,
  // real-time pipeline, ML inference, event-driven microservices)
  ...expertProjects,
];

// ----------------------------------------------------------------------------
// YOUTUBE REFERENCES
// ----------------------------------------------------------------------------
// YOUTUBE REFERENCES (removed by user request — no external video content)
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// CERTIFICATION PREP
// ----------------------------------------------------------------------------

export interface CertificationTrack {
  id: string;
  name: string;
  code: string;
  level: SkillLevel;
  description: string;
  duration: string;
  topics: { name: string; weight: number; moduleId: string }[];
  recommendedModules: string[];
  tips: string[];
}

export const certificationTracks: CertificationTrack[] = [
  {
    id: "cloud-practitioner",
    name: "AWS Certified Cloud Practitioner",
    code: "CLF-C02",
    level: "beginner",
    description: "Entry-level certification validating overall AWS understanding — cloud concepts, security, technology, and billing.",
    duration: "90 minutes, 65 questions",
    topics: [
      { name: "Cloud Concepts", weight: 24, moduleId: "fundamentals" },
      { name: "Security & Compliance", weight: 30, moduleId: "security" },
      { name: "Technology", weight: 34, moduleId: "aws-essentials" },
      { name: "Billing & Pricing", weight: 12, moduleId: "aws-essentials" },
    ],
    recommendedModules: ["fundamentals", "aws-essentials", "iam", "security"],
    tips: [
      "Focus on understanding WHAT services do, not how to configure them — Practitioner is non-technical depth.",
      "Master the shared responsibility model — appears in many questions.",
      "Know the pricing models (On-Demand, Reserved, Spot) and when to use each.",
      "Understand AWS Organizations, SCPs, and Consolidated Billing.",
      "Memorize the core AWS services: EC2, S3, RDS, Lambda, VPC, IAM, CloudFront, Route 53.",
    ],
  },
  {
    id: "solutions-architect-associate",
    name: "AWS Certified Solutions Architect — Associate",
    code: "SAA-C03",
    level: "intermediate",
    description: "Validates ability to design distributed systems on AWS. The most popular AWS certification.",
    duration: "130 minutes, 65 questions",
    topics: [
      { name: "Design Secure Architectures", weight: 30, moduleId: "security" },
      { name: "Design Resilient Architectures", weight: 26, moduleId: "ec2" },
      { name: "Design High-Performing Architectures", weight: 24, moduleId: "ec2" },
      { name: "Design Cost-Optimized Architectures", weight: 20, moduleId: "fundamentals" },
    ],
    recommendedModules: ["fundamentals", "aws-essentials", "iam", "ec2", "s3", "rds", "networking", "lambda", "api-gateway", "containers", "security"],
    tips: [
      "Practice architecting real systems — exam is scenario-heavy, not memorization.",
      "Know the storage classes cold: S3 (7 classes), EBS (4 types), Instance Store, EFS.",
      "Master VPC: subnets, route tables, NAT vs IGW, VPC endpoints, peering vs TGW.",
      "Know when to use which service: EC2 vs Lambda vs Fargate vs ECS, RDS vs DynamoDB.",
      "Multi-AZ vs Multi-Region: know HA patterns and DR strategies.",
      "Practice time management — 130 min / 65 questions = 2 min per question.",
    ],
  },
  {
    id: "solutions-architect-professional",
    name: "AWS Certified Solutions Architect — Professional",
    code: "SAP-C02",
    level: "expert",
    description: "Advanced certification for senior architects: multi-account, multi-region, hybrid, and migration expertise.",
    duration: "180 minutes, 75 questions",
    topics: [
      { name: "Design for Organization Complexity", weight: 26, moduleId: "aws-essentials" },
      { name: "Design for New Solutions", weight: 29, moduleId: "ec2" },
      { name: "Continuous Improvement", weight: 25, moduleId: "devops" },
      { name: "Accelerate Workload Migration", weight: 20, moduleId: "ec2" },
    ],
    recommendedModules: ["all"],
    tips: [
      "Get SAA first — Professional builds on it heavily.",
      "Master multi-account strategies: AWS Organizations, SCPs, Control Tower.",
      "Know migration patterns: 6Rs (Rehost, Replatform, Repurchase, Refactor, Retain, Retire).",
      "Deep dive on networking: Transit Gateway, Direct Connect, VPN, PrivateLink.",
      "Practice reading long scenarios — Professional questions are paragraphs, not sentences.",
      "Know cost optimization at depth: Savings Plans, Reserved Instances, Spot.",
    ],
  },
  {
    id: "devops-engineer-professional",
    name: "AWS Certified DevOps Engineer — Professional",
    code: "DOP-C02",
    level: "expert",
    description: "Validates expertise in SDLC automation, infrastructure as code, and observability.",
    duration: "180 minutes, 75 questions",
    topics: [
      { name: "SDLC Automation", weight: 22, moduleId: "devops" },
      { name: "Configuration Management & IaC", weight: 27, moduleId: "devops" },
      { name: "Resilient Cloud Solutions", weight: 26, moduleId: "ec2" },
      { name: "Monitoring & Logging", weight: 25, moduleId: "devops" },
    ],
    recommendedModules: ["devops", "ec2", "containers", "lambda", "security"],
    tips: [
      "Master CloudFormation, CDK, and SAM — exam expects IaC fluency.",
      "Know CodePipeline, CodeBuild, CodeDeploy deeply, including deployment strategies.",
      "Understand EventBridge (formerly CloudWatch Events) for event-driven automation.",
      "Practice with Systems Manager (SSM): Patch Manager, Session Manager, Run Command.",
      "Observability is heavy: CloudWatch Logs, Metrics, Alarms, X-Ray, CloudTrail.",
    ],
  },
];

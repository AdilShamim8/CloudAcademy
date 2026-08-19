# CloudAcademy — AWS Cloud Learning Platform

A complete, end-to-end AWS Cloud learning web application built with Next.js 16, TypeScript, Tailwind CSS 4, and shadcn/ui. Designed as a beginner-to-expert learning operating system with original AWS-inspired UI (not a copy of AWS's proprietary branding).

## What's Inside

### 14 In-Depth Modules
Cloud Computing Fundamentals · AWS Essentials · IAM · EC2 · S3 · RDS · AWS CLI · Lambda · API Gateway · Networking/VPC · Security · Containers · DevOps · AI/ML on AWS

Each module has 4–6 lessons covering 5 levels (Beginner → Practical Beginner → Intermediate → Advanced → Expert) with rich content blocks:
- Paragraphs, headings, callouts (info/warning/tip/danger/success)
- Syntax-highlighted code blocks with copy-to-clipboard
- Interactive architecture diagrams (custom renderer)
- Comparison tables, Q&A blocks, and key takeaways

### 10 Hands-On Projects (5 Beginner/Intermediate + 5 Expert)
1. S3 + CloudFront static website
2. EC2 web server with user data
3. Serverless API (Lambda + API Gateway + DynamoDB)
4. Production 3-tier app (ALB + Auto Scaling + RDS Multi-AZ)
5. Containerized ECS Fargate deployment
6. **Multi-Region Serverless API with Active-Active Failover** (expert)
7. **EKS Kubernetes Cluster with ArgoCD GitOps** (expert)
8. **Real-Time Data Pipeline with Kinesis + OpenSearch** (expert)
9. **Production ML Inference Pipeline with SageMaker** (expert)
10. **Event-Driven Microservices with EventBridge + Step Functions** (expert)

Each project has objectives, architecture diagram, step-by-step CLI commands, troubleshooting, security considerations, cleanup, and extensions.

### Interactive Simulators (No Real AWS Account Needed)
- **AWS Console Clone** — A full simulated AWS Management Console with end-to-end wizards for EC2 (7-step launch), S3 (6-step create bucket), IAM (4-step create user), VPC (4-step create with visual topology diagram), Lambda (4-step create function), CloudWatch (dashboards, metrics, alarms, logs)
- **AWS CLI Playground** — Simulated terminal supporting `aws sts`, `s3`, `ec2`, `iam` commands with history
- **IAM Policy Simulator** — JSON policy editor with 5 test scenarios, real policy evaluation logic (Allow/Deny with wildcards)
- **Architecture Builder** — Drag-and-drop 24 AWS components, connect them, run analysis (security/HA/cost/recommendations), 3 pre-built templates
- **Troubleshooting Academy** — 6 real-world incident walkthroughs (EC2 unreachable, AccessDenied, Lambda timeouts, RDS connection, ECS OOM, private subnet internet)

### 6 Quizzes (36 questions total)
Cloud Fundamentals · IAM Deep Dive · Amazon EC2 · VPC and Networking · Lambda and API Gateway · Architecture Decision-Making

### 4 AWS Certification Tracks
Cloud Practitioner (CLF-C02) · Solutions Architect Associate (SAA-C03) · Solutions Architect Professional (SAP-C02) · DevOps Engineer Professional (DOP-C02)

### Progress Tracking (Persisted in localStorage)
- XP and skill levels (Beginner → Expert based on XP)
- Day streaks (with Flame icon when active)
- 8 unlockable achievements
- Quiz scores with retry support
- Module progress bars
- Recent activity feed

### Design
- AWS-inspired original palette (orange/teal/violet/emerald/amber/rose) — no proprietary AWS branding
- Dark/light mode (defaults to dark)
- Gradient-mesh hero sections
- Level-colored badges (beginner=emerald, intermediate=cyan, advanced=violet, expert=rose)
- Responsive layout with collapsible sidebar (mobile-friendly)
- Framer Motion animations on AWS Console Clone transitions
- Sticky footer that respects viewport height

## Tech Stack
- **Framework**: Next.js 16 with App Router (SPA architecture)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style) + Lucide icons
- **State Management**: Zustand (with localStorage persistence)
- **Theme**: next-themes for dark/light mode
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Custom components**: SyntaxHighlighter, ArchitectureDiagram (built in-house)

## Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Open in browser
# http://localhost:3000

# Lint check
bun run lint

# TypeScript check
npx tsc --noEmit
```

## Project Structure
```
src/
├── app/
│   ├── globals.css          # AWS-inspired theme + design system
│   ├── layout.tsx            # Root layout with ThemeProvider
│   └── page.tsx              # SPA router (switches via Zustand state)
├── components/
│   ├── layout/AppShell.tsx              # Sidebar + TopBar
│   ├── home/                            # Home, Dashboard, Services, Labs, Certification
│   ├── learning/LessonView.tsx          # Module + Lesson renderers
│   ├── projects/ProjectsView.tsx        # 10 project details
│   ├── interactive/                     # CLI Playground, IAM Sim, Arch Builder, Quizzes, Troubleshooting
│   └── console/AwsConsoleClone.tsx      # Full AWS Console simulation (4400+ lines)
├── lib/
│   ├── store.ts                         # Zustand store (route + progress)
│   ├── curriculum.ts                    # 14 modules data
│   ├── curriculum-ec2.ts                # EC2 module
│   ├── curriculum-storage-db.ts          # S3, RDS, Lambda, API Gateway modules
│   ├── curriculum-networking-sec.ts     # Networking, Security, Containers, DevOps, AI/ML, CLI modules
│   ├── expert-projects.ts                # 5 expert-level projects
│   └── learning-content.ts              # Quizzes, Troubleshooting, Projects, Certification data
└── components/ui/                       # shadcn/ui components
```

## Notes

- **Safe simulation**: All labs run entirely in your browser. No real AWS account is needed. The CLI Playground, IAM Simulator, Architecture Builder, AWS Console Clone, and Troubleshooting Academy are all simulations for educational purposes.
- **Original design**: This is NOT a copy of AWS's proprietary branding or website. The UI is original, inspired by modern cloud-console UX patterns.
- **All content is original**: Written from scratch by senior cloud engineers and educators.

## Verification

The application has been browser-verified end-to-end:
- Home page loads with all stats and feature cards
- Sidebar navigation works for all 14 modules + all routes
- All 10 projects are accessible with full step-by-step instructions
- AWS Console Clone opens with all 6 service consoles + wizards functional
- CLI Playground accepts commands and returns simulated responses
- IAM Simulator evaluates policies correctly
- Architecture Builder supports drag-and-drop with analysis
- Quizzes work end-to-end with scoring
- Dashboard tracks XP, achievements, streaks
- Lint clean, TypeScript clean

Built with care for serious learners ready to go from absolute beginner to expert AWS architect.

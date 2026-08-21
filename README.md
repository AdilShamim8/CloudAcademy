<div align="center">

# ☁️ CloudAcademy

### AWS Cloud Learning Platform — Beginner to Expert

A complete, end-to-end AWS Cloud learning web application built with Next.js 16, TypeScript, Tailwind CSS 4, and shadcn/ui. Designed as a beginner-to-expert learning operating system with original AWS-inspired UI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8.svg)](https://tailwindcss.com/)

[Features](#-features) · [Quick Start](#-quick-start) · [Documentation](#-documentation) · [Contributing](#-contributing) · [License](#-license)

</div>

---

## 🎯 What is CloudAcademy?

CloudAcademy is an open-source, interactive AWS Cloud learning platform that takes you from **absolute beginner** to **expert cloud architect**. It's not a simple static course site — it's a fully functional learning operating system with simulators, hands-on projects, real-world troubleshooting scenarios, and a simulated AWS Management Console.

### Why CloudAcademy?

- 📚 **14 in-depth modules** covering everything from Cloud Fundamentals to AI/ML on AWS
- 🛠️ **10 hands-on projects** with real-world architectures (multi-region failover, EKS GitOps, real-time pipelines, ML inference, event-driven microservices)
- 🎮 **Interactive simulators** — no real AWS account needed
- 🏆 **6 quizzes + 6 troubleshooting scenarios** with step-by-step walkthroughs
- 🎓 **4 AWS certification tracks** — Cloud Practitioner → Solutions Architect Pro → DevOps Engineer Pro
- 📊 **Progress tracking** with XP, streaks, achievements, and skill levels
- 🌗 **Dark/light themes** with premium AWS-inspired UI
- 📱 **Fully responsive** — works on iPhone SE, tablets, and 4K monitors

---

## ✨ Features

### 📚 Comprehensive Curriculum (14 Modules, 60+ Lessons)

| Module | Level | Lessons |
|--------|-------|---------|
| Cloud Computing Fundamentals | Beginner | 6 |
| AWS Essentials | Beginner | 5 |
| Identity & Access Management (IAM) | Intermediate | 6 |
| Amazon EC2 | Intermediate | 6 |
| Amazon S3 | Intermediate | 5 |
| Amazon RDS | Intermediate | 5 |
| AWS CLI Mastery | Intermediate | 4 |
| AWS Lambda | Intermediate | 5 |
| Amazon API Gateway | Intermediate | 4 |
| AWS Networking (VPC) | Intermediate | 6 |
| AWS Security Best Practices | Advanced | 5 |
| Containers (ECS/ECR/Fargate) | Advanced | 5 |
| DevOps on AWS | Advanced | 5 |
| AI/ML on AWS | Advanced | 5 |

Each lesson includes rich content blocks: paragraphs, callouts, syntax-highlighted code, interactive architecture diagrams, comparison tables, and key takeaways.

### 🛠️ 10 Hands-On Projects

**Beginner to Intermediate:**
1. Static Website on S3 + CloudFront
2. EC2 Web Server with User Data
3. Serverless API (Lambda + API Gateway + DynamoDB)
4. Production 3-Tier App (ALB + Auto Scaling + RDS Multi-AZ)
5. Containerized App on ECS Fargate

**Expert-Level:**
6. **Multi-Region Serverless API with Active-Active Failover**
7. **EKS Kubernetes Cluster with ArgoCD GitOps**
8. **Real-Time Data Pipeline with Kinesis + OpenSearch**
9. **Production ML Inference Pipeline with SageMaker**
10. **Event-Driven Microservices with EventBridge + Step Functions**

Each project includes objectives, architecture diagrams, step-by-step CLI commands, troubleshooting, security considerations, cleanup instructions, and extension challenges.

### 🎮 Interactive Simulators (No Real AWS Account Needed)

- **AWS Console Clone** — A full simulated AWS Management Console with end-to-end wizards for EC2 (7-step launch), S3 (6-step create bucket), IAM (4-step create user), VPC (4-step create + visual topology diagram), Lambda (4-step create function), and CloudWatch (dashboards, metrics, alarms, logs)
- **AWS CLI Playground** — Simulated terminal supporting `aws sts`, `s3`, `ec2`, `iam` commands with history
- **IAM Policy Simulator** — JSON policy editor with 5 test scenarios, real policy evaluation logic
- **Architecture Builder** — Drag-and-drop 24 AWS components, connect them, run analysis (security/HA/cost/recommendations), 3 pre-built templates
- **Troubleshooting Academy** — 6 real-world incident walkthroughs

### 📊 Progress Tracking

- XP and skill levels (Beginner → Expert)
- Day streaks
- 8 unlockable achievements
- Quiz scores with retry support
- Module progress bars
- Recent activity feed
- All progress persists in localStorage

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/) 1.0+
- An AWS account is **NOT** required — all labs are simulated

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/cloudacademy.git
cd cloudacademy

# Install dependencies
bun install
# or
npm install

# Start the development server
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `npx tsc --noEmit` | TypeScript type check |
| `bun run db:push` | Push Prisma schema to database |

---

## 📖 Documentation

- **[Contributing Guide](CONTRIBUTING.md)** — How to contribute, code style, content guidelines
- **[Code of Conduct](CODE_OF_CONDUCT.md)** — Community standards
- **[Project Structure](#project-structure)** — Architecture overview (below)

### Project Structure

```
cloudacademy/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── globals.css             # Design system + theme
│   │   ├── layout.tsx              # Root layout with ErrorBoundary
│   │   └── page.tsx                # SPA router
│   ├── components/
│   │   ├── layout/                 # Sidebar, TopBar
│   │   ├── home/                   # Home, Dashboard, Services, Labs, Certification
│   │   ├── learning/               # Lesson view, Module view
│   │   ├── projects/               # Projects list + detail
│   │   ├── interactive/            # CLI Playground, IAM Sim, Arch Builder, Quizzes
│   │   ├── console/                # AWS Console Clone (4400+ lines)
│   │   ├── error/                  # Error boundary
│   │   └── ui/                     # shadcn/ui primitives
│   └── lib/
│       ├── store.ts                # Zustand state management
│       ├── curriculum.ts           # Fundamentals, AWS Essentials, IAM modules
│       ├── curriculum-ec2.ts        # EC2 module
│       ├── curriculum-storage-db.ts # S3, RDS, Lambda, API Gateway modules
│       ├── curriculum-networking-sec.ts # Networking, Security, Containers, DevOps, AI/ML, CLI
│       ├── expert-projects.ts      # 5 expert-level projects
│       └── learning-content.ts     # Quizzes, troubleshooting, projects, certifications
├── public/                         # Static assets, manifest, robots.txt
├── prisma/                         # Database schema
├── .github/                        # Issue templates, PR template, CI workflow
├── LICENSE                         # MIT License
├── CONTRIBUTING.md                 # Contribution guidelines
├── CODE_OF_CONDUCT.md              # Community standards
└── README.md                       # This file
```

---

## 🎨 Design System

CloudAcademy uses an original AWS-inspired design system (not a copy of AWS's proprietary branding):

- **Primary color**: AWS-inspired orange (`oklch(0.7 0.18 50)`)
- **Accent palette**: teal, violet, emerald, amber, rose, cyan
- **Level colors**: Beginner=emerald, Intermediate=cyan, Advanced=violet, Expert=rose
- **Typography**: Geist Sans + Geist Mono
- **Dark mode**: Default, with light mode support
- **Animations**: Framer Motion for transitions, custom CSS for premium effects

---

## 🛡️ Production Readiness

- ✅ **Error boundary** — Catches render errors with friendly recovery UI
- ✅ **Responsive design** — Tested at 375px (iPhone SE) through 1920px+
- ✅ **Accessibility** — ARIA labels, keyboard navigation, focus rings, semantic HTML
- ✅ **SEO** — Comprehensive metadata, OpenGraph, Twitter cards, robots.txt, manifest.json
- ✅ **PWA-ready** — Web manifest, theme colors, standalone display
- ✅ **Performance** — Client-side rendering, no SSR blocking, localStorage persistence
- ✅ **Type safety** — Full TypeScript, strict mode, zero type errors
- ✅ **Code quality** — ESLint clean, consistent style

---

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute

- 🐛 [Report a bug](.github/ISSUE_TEMPLATE/bug_report.md)
- ✨ [Request a feature](.github/ISSUE_TEMPLATE/feature_request.md)
- 📝 [Report a content inaccuracy](.github/ISSUE_TEMPLATE/content_correction.md)
- 📚 Add a new lesson, quiz, or project
- 🎨 Improve the UI/UX
- ♿ Improve accessibility
- 🌍 Translate content

### Content Accuracy

All AWS content is technically audited. If you spot an inaccuracy, please [open a content correction issue](.github/ISSUE_TEMPLATE/content_correction.md).

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), and [Lucide icons](https://lucide.dev/)
- Inspired by the real AWS Management Console, but uses original UI design (not proprietary AWS branding)
- All AWS service names and concepts are property of Amazon Web Services, Inc.
- This is an educational project, not affiliated with or endorsed by AWS

---

## ⚠️ Disclaimer

CloudAcademy is an **educational project**. All labs and simulators run entirely in your browser — no real AWS resources are created or modified. The AWS Console Clone, CLI Playground, and other simulators are designed for learning purposes only.

When working with a real AWS account, always:
- Set up a budget alert on day one
- Use the free tier responsibly
- Clean up resources after each lab
- Never commit access keys to git
- Use IAM roles for EC2/Lambda

---

<div align="center">

**[⬆ Back to Top](#-cloudacademy)**

</div>

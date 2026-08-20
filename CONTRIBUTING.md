# Contributing to CloudAcademy

First off, thank you for considering contributing to CloudAcademy! 🎉

This is an open-source AWS Cloud learning platform, and contributions of all sizes are welcome — from fixing a typo in a lesson to adding a new module or simulator.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct: be kind, respectful, and constructive. Personal attacks, harassment, and discrimination are not tolerated.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
- Search existing issues to avoid duplicates.
- Verify the bug on the latest `main` branch.

When filing a bug report, include:
- **Summary**: One-paragraph description.
- **Steps to reproduce**: Numbered list.
- **Expected behavior**: What you expected.
- **Actual behavior**: What happened.
- **Environment**: Browser, OS, screen size (especially for UI bugs).
- **Screenshots**: If applicable.

### Suggesting Enhancements

Enhancement suggestions are welcome. Include:
- **Use case**: What problem does this solve?
- **Proposed solution**: How would you implement it?
- **Alternatives considered**: What else did you think about?

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code, ensure:
   - `bun run lint` passes with no errors.
   - `npx tsc --noEmit` passes with no errors.
   - The build succeeds.
3. If you've added a new lesson/module, ensure the content is technically accurate and follows the existing structure.
4. Issue the pull request with a clear title and description.

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/cloudacademy.git
cd cloudacademy

# Install dependencies
bun install

# Start dev server
bun run dev

# Run lint
bun run lint

# Run TypeScript check
npx tsc --noEmit
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # Design system + theme
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # SPA router
├── components/
│   ├── layout/             # Sidebar, TopBar
│   ├── home/               # Home, Dashboard, Services, Labs, Certification
│   ├── learning/           # Lesson view, Module view
│   ├── projects/           # Projects list + detail
│   ├── interactive/        # CLI Playground, IAM Sim, Arch Builder, Quizzes
│   ├── console/            # AWS Console Clone (4400+ lines)
│   └── error/              # Error boundary
├── lib/
│   ├── store.ts            # Zustand state management
│   ├── curriculum*.ts      # 14 modules of content
│   ├── expert-projects.ts  # 5 expert-level projects
│   └── learning-content.ts # Quizzes, troubleshooting, projects, certifications
└── components/ui/          # shadcn/ui primitives
```

## Content Contribution Guidelines

### Adding a New Lesson

1. Find the appropriate module in `src/lib/curriculum*.ts`.
2. Add a new lesson object to the `lessons` array:
```typescript
{
  id: "your-lesson-id",
  title: "Lesson Title",
  level: "beginner" | "intermediate" | "advanced" | "expert",
  duration: 25,  // minutes
  xp: 15,
  summary: "One-sentence summary.",
  content: [
    { type: "paragraph", text: "..." },
    { type: "heading", text: "..." },
    { type: "callout", variant: "tip", title: "...", text: "..." },
    { type: "code", language: "bash", code: "..." },
    { type: "keyTakeaways", items: ["...", "..."] },
  ],
}
```

3. Verify technical accuracy — see the audit checklist below.

### Content Accuracy Checklist

Before submitting content, verify:
- [ ] AWS service names are spelled correctly (Amazon S3, AWS Lambda, etc.)
- [ ] CLI command syntax is correct (`aws s3 ls`, not `aws s3 list`)
- [ ] IAM policy JSON is valid (Effect: "Allow" — capital E and A)
- [ ] ARN formats are correct (`arn:aws:s3:::bucket` for bucket, `...:bucket/*` for objects)
- [ ] Port numbers are correct (SSH=22, HTTP=80, HTTPS=443, PostgreSQL=5432)
- [ ] Instance type families are correct (t=burstable, m=general, c=compute, r=memory, p=GPU)
- [ ] Pricing model descriptions are accurate (Spot up to 90% off, Reserved 1-3yr)
- [ ] Shared responsibility model is correctly described for the service
- [ ] No contradictions with content in other lessons

### Adding a New Quiz

Add to `src/lib/learning-content.ts` in the `quizzes` array. Each quiz needs:
- 6 questions (for consistency)
- Each question needs `id`, `question`, `options` (4), `correctIndex`, `explanation`, `level`
- The explanation should teach the concept, not just restate the answer.

### Adding a New Project

Add to `src/lib/expert-projects.ts` (for expert-level) or `src/lib/learning-content.ts` (for beginner/intermediate). Each project needs:
- `objectives`: 5-8 specific goals
- `architecture`: nodes + edges for the diagram
- `steps`: 6-10 detailed steps with CLI commands
- `troubleshooting`: 4-6 common problems + solutions
- `security`: 5-8 security best practices
- `cleanup`: 4-6 steps to remove resources
- `extensions`: 5-8 advanced follow-up ideas

## Style Guide

### TypeScript
- Use TypeScript throughout — no plain JS files.
- Prefer `type` for unions, `interface` for objects.
- Use `import type` for type-only imports.

### React
- Use function components (no class components, except ErrorBoundary).
- Use `"use client";` for client components.
- Use shadcn/ui primitives whenever possible.

### CSS
- Use Tailwind utility classes.
- Use the AWS-inspired CSS variables (`var(--aws-orange)`, etc.) for branded colors.
- Never use raw hex colors — always use the theme variables.

### Content
- Write in clear, conversational English.
- Use "you" to address the learner.
- Avoid passive voice.
- Each paragraph should be 3-5 sentences.
- Each section should be at least 150 words.

## Testing

Currently, the project doesn't have automated tests. If you're adding a feature, manually verify:
1. The page renders without console errors.
2. All interactive elements work (clicks, forms, navigation).
3. The layout is responsive (test at 375px, 768px, 1280px, 1920px).
4. Dark and light themes both look correct.

## Review Process

Pull requests are reviewed by maintainers. We aim to review within 3-5 days. Reviews focus on:
- Technical accuracy of any AWS content
- Code quality and style consistency
- UX/accessibility considerations
- Whether the change fits the project's scope

## Recognition

Contributors are added to the README's Contributors section. Significant contributions (new modules, major features) are highlighted in release notes.

## Questions?

Feel free to open an issue with the `question` label, or start a discussion in the Discussions tab.

Thank you for helping make AWS learning accessible to everyone! 🚀

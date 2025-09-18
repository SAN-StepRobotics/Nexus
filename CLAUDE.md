# Claude Code Project Instructions - Nexus Platform

## Project Overview
This is the Nexus Platform project - a workflow management system with Google Drive integration.

## Version Control Workflow Rules

### IMPORTANT: Git Commit & Rollback Strategy
1. **Regular Commits**: After every significant achievement or progress, commit and push to GitHub
2. **Rollback Capability**: Always maintain the ability to rollback to ANY previous commit
3. **Safety First**: When things go wrong, immediately offer rollback options to previous stable states

### Commit Guidelines
- Make frequent, meaningful commits after each feature/fix completion
- Use clear, descriptive commit messages
- Always run tests/linting before committing (when available)
- Push to GitHub after significant milestones

### Rollback Procedures
When the user indicates something has gone wrong:
1. Show recent commits with `git log --oneline -10`
2. Offer rollback options to specific commits
3. Use `git reset --hard <commit-hash>` for local rollback
4. Use `git push --force origin main` if remote needs updating (with user confirmation)

## Project-Specific Rules

### Authentication & Secrets
- NEVER commit real credentials to the repository
- Keep actual OAuth credentials in `.env` file only (never `.env.example`)
- Always use placeholders in `.env.example`
- The project uses Google OAuth - credentials must be regenerated if exposed

### Code Quality
- Run linting before commits: `npm run lint` (if available)
- Run type checking: `npm run typecheck` (if available)
- Test the application locally before pushing

### File Structure
- Main application code is in `nexus-platform/` directory
- Database models in `prisma/schema.prisma`
- Environment variables template in `.env.example`
- Docker configurations for dev and prod environments

## Quick Commands Reference

### Git Operations
```bash
# Check current status
git status

# View recent commits
git log --oneline -10

# Commit current changes
git add .
git commit -m "Description of changes"
git push origin main

# Rollback to specific commit (local)
git reset --hard <commit-hash>

# Rollback and update remote (use with caution)
git push --force origin main

# Create a safety backup branch before risky operations
git branch backup-$(date +%Y%m%d-%H%M%S)
```

### Project Commands
```bash
# Navigate to project
cd nexus-platform

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests (if available)
npm test

# Build for production
npm run build
```

## Current Repository Details
- **Repository**: https://github.com/SAN-StepRobotics/Nexus
- **Main Branch**: main
- **Owner**: SAN-StepRobotics

## Notes for Claude
- Always check git status at conversation start
- Proactively suggest commits after completing features
- Offer rollback options when user expresses concerns
- Never push without user confirmation
- Keep track of work using TodoWrite tool for complex tasks
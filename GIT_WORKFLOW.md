# Git Workflow Documentation - Nexus Platform

## Quick Start Scripts

### 1. Creating Checkpoints (Saving Progress)
Use the **git-checkpoint.bat** script to quickly save your progress:
```bash
git-checkpoint.bat
```
This will:
- Show current changes
- Ask for a commit message
- Create a commit
- Push to GitHub automatically

### 2. Rolling Back (When Things Go Wrong)
Use the **git-rollback.bat** script to restore previous versions:
```bash
git-rollback.bat
```
This offers multiple options:
- Rollback locally only (keeps remote unchanged)
- Rollback both local and remote
- Create a backup branch before rolling back
- View more commit history

## Manual Git Commands

### Viewing History
```bash
# See recent commits (one line each)
git log --oneline -10

# See detailed commit history
git log -5

# See what changed in each commit
git log -p -3
```

### Creating Checkpoints Manually
```bash
# Check what's changed
git status

# Stage all changes
git add .

# Create a commit
git commit -m "Your descriptive message here"

# Push to GitHub
git push origin main
```

### Rolling Back Manually

#### Soft Rollback (Keeps Changes as Uncommitted)
```bash
git reset --soft <commit-hash>
```

#### Hard Rollback (Discards All Changes)
```bash
# Local only
git reset --hard <commit-hash>

# Update remote too (BE CAREFUL!)
git push --force origin main
```

#### Safe Rollback (With Backup)
```bash
# Create backup branch first
git branch backup-before-rollback

# Then rollback
git reset --hard <commit-hash>
```

## Best Practices

### When to Create Checkpoints
- ✅ After completing a new feature
- ✅ After fixing a bug
- ✅ Before starting risky changes
- ✅ At the end of each work session
- ✅ After successful testing

### Commit Message Guidelines
- **Feature**: "Add user authentication system"
- **Fix**: "Fix navigation menu on mobile devices"
- **Update**: "Update dashboard styling"
- **Refactor**: "Refactor API error handling"

### Before Rolling Back
1. **Check current status**: Make sure you know what you'll lose
2. **Create a backup**: Use option 3 in git-rollback.bat
3. **Communicate**: If working with others, let them know
4. **Document**: Note why you're rolling back

## Emergency Commands

### If Push is Rejected
```bash
# Pull latest changes first
git pull origin main

# If conflicts, resolve them, then:
git add .
git commit -m "Resolved merge conflicts"
git push origin main
```

### If You Accidentally Committed Secrets
```bash
# Use the rollback script immediately
git-rollback.bat

# Choose option 2 to update remote
# Then regenerate any exposed credentials
```

### View All Branches (Including Backups)
```bash
git branch -a
```

### Switch to a Backup Branch
```bash
git checkout backup-branch-name
```

### Delete Old Backup Branches
```bash
# Delete local branch
git branch -d backup-branch-name

# Force delete if needed
git branch -D backup-branch-name
```

## Workflow Summary

1. **Start Work** → Check git status
2. **Make Changes** → Code, test, verify
3. **Save Progress** → Run `git-checkpoint.bat`
4. **If Problems** → Run `git-rollback.bat`
5. **Continue** → Repeat

## Important Notes

- **Always test locally** before pushing
- **Never force push** without understanding consequences
- **Keep commits small** and focused
- **Write clear messages** for future reference
- **Backup before risky operations**

## Getting Help

If you're unsure about any git operation:
1. Check current status: `git status`
2. View recent commits: `git log --oneline -5`
3. Create a backup branch as safety net
4. Ask for help if needed

Remember: Git keeps history, so mistakes can usually be fixed!
# Git Guide for GatherUp

## Repository Setup ✅

Your Git repository has been initialized with:
- ✓ Initial commit with all project files
- ✓ Default branch: `main`
- ✓ Comprehensive `.gitignore` file
- ✓ `.gitattributes` for consistent line endings

## Basic Git Commands

### Daily Workflow

```bash
# Check status of your changes
git status

# Add specific files
git add path/to/file

# Add all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main
```

### Branching

```bash
# Create new branch
git checkout -b feature/your-feature-name

# Switch branches
git checkout branch-name

# List all branches
git branch -a

# Delete branch
git branch -d branch-name
```

### Viewing Changes

```bash
# View changes
git diff

# View commit history
git log

# View commit history (one line per commit)
git log --oneline

# View specific file history
git log -- path/to/file
```

## Connecting to GitHub

### 1. Create GitHub Repository

Go to [github.com/new](https://github.com/new) and create a new repository (don't initialize with README).

### 2. Add Remote

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/gatherup.git

# Or with SSH
git remote add origin git@github.com:YOUR_USERNAME/gatherup.git

# Verify remote
git remote -v
```

### 3. Push to GitHub

```bash
# Push main branch
git push -u origin main
```

## Development Workflow

### Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push feature branch
git push origin feature/new-feature

# 4. Create Pull Request on GitHub
# 5. After merge, update main
git checkout main
git pull origin main

# 6. Delete feature branch
git branch -d feature/new-feature
```

### Bug Fixes

```bash
# Create bug fix branch
git checkout -b fix/bug-description

# Make changes, commit, and push
git add .
git commit -m "Fix: Description of bug fix"
git push origin fix/bug-description
```

## Commit Message Guidelines

### Format
```
<type>: <short description>

<optional detailed description>

<optional footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
git commit -m "feat: Add event filtering by date"
git commit -m "fix: Resolve real-time chat connection issue"
git commit -m "docs: Update setup instructions"
git commit -m "refactor: Improve event query performance"
```

## Undoing Changes

### Before Commit

```bash
# Discard changes in working directory
git checkout -- path/to/file

# Unstage file (keep changes)
git reset HEAD path/to/file

# Discard all local changes
git reset --hard HEAD
```

### After Commit

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Amend last commit message
git commit --amend -m "New message"
```

## Useful Git Aliases

Add to your `~/.gitconfig`:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --graph --oneline --all
    amend = commit --amend --no-edit
```

Usage:
```bash
git st        # Instead of git status
git co main   # Instead of git checkout main
git br        # Instead of git branch
```

## .gitignore

The project includes a comprehensive `.gitignore` that excludes:
- `node_modules/`
- `.env` and `.env.local` files
- Build outputs (`.next/`, `dist/`, `.expo/`)
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`)
- Temporary files

### Adding to .gitignore

If you need to ignore additional files:

```bash
# Edit .gitignore
echo "my-secret-file.txt" >> .gitignore

# Commit the change
git add .gitignore
git commit -m "chore: Update .gitignore"
```

## Git Best Practices

### Do's ✅
- ✓ Commit frequently with meaningful messages
- ✓ Pull before pushing
- ✓ Use branches for features and fixes
- ✓ Review changes before committing
- ✓ Keep commits focused and atomic
- ✓ Write clear commit messages

### Don'ts ❌
- ✗ Don't commit sensitive data (.env files)
- ✗ Don't commit `node_modules/`
- ✗ Don't force push to shared branches
- ✗ Don't commit work-in-progress code to main
- ✗ Don't use vague commit messages like "fix stuff"

## Troubleshooting

### Conflict Resolution

```bash
# If you get merge conflicts:
# 1. Open conflicted files
# 2. Resolve conflicts (search for <<<<<<< markers)
# 3. Stage resolved files
git add resolved-file.txt

# 4. Complete the merge
git commit
```

### Accidentally Committed Secrets

```bash
# Remove file from history (DANGEROUS)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret" \
  --prune-empty --tag-name-filter cat -- --all

# Then force push (if already pushed)
git push origin --force --all

# Better: Rotate the exposed secrets immediately!
```

### Large Files

```bash
# If you accidentally committed large files:
# Use git-lfs for large files
git lfs install
git lfs track "*.psd"
git lfs track "*.mp4"
```

## Collaboration

### Code Review Process

1. Create feature branch
2. Make changes and commit
3. Push to remote
4. Open Pull Request on GitHub
5. Request reviews
6. Address feedback
7. Merge when approved
8. Delete feature branch

### Keeping Fork Updated

```bash
# Add upstream remote (original repo)
git remote add upstream https://github.com/original/repo.git

# Fetch upstream changes
git fetch upstream

# Merge upstream changes
git checkout main
git merge upstream/main
```

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

## Quick Reference

```bash
# Status & Info
git status              # Show working directory status
git log                 # View commit history
git diff                # Show changes

# Basic Operations
git add <file>          # Stage file
git commit -m "msg"     # Commit changes
git push                # Push to remote
git pull                # Pull from remote

# Branching
git branch              # List branches
git checkout -b <name>  # Create & switch to branch
git merge <branch>      # Merge branch

# Undoing
git reset --hard HEAD   # Discard all changes
git checkout -- <file>  # Discard file changes
git revert <commit>     # Revert commit

# Remote
git remote -v           # List remotes
git fetch               # Fetch from remote
git push origin <branch> # Push branch
```

---

Happy coding! 🚀

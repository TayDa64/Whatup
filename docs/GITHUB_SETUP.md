# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

### Option A: Using GitHub CLI

```bash
cd C:\dev\Whatup

# Create repository (public or private)
gh repo create Whatup --public --source=. --remote=origin

# Push code
git push -u origin main
```

### Option B: Using GitHub Web UI

1. Go to https://github.com/new
2. **Repository name:** `Whatup`
3. **Description:** `3D social navigation game with AI NPCs and GitHub integration`
4. **Visibility:** Public or Private
5. **Do NOT** initialize with README, .gitignore, or license (we have these)
6. Click "Create repository"

Then push local code:
```bash
cd C:\dev\Whatup

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/Whatup.git

# Push
git branch -M main
git push -u origin main
```

## Step 2: Configure Branch Protection

### Via GitHub Web UI

1. Go to repository **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Configure as follows:

**Branch name pattern:**
```
main
```

**Protection rules:**

✅ **Require a pull request before merging**
- ✅ Require approvals: **1**
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (optional)
- ✅ Require approval of the most recent reviewable push

✅ **Require status checks to pass before merging**
- ✅ Require branches to be up to date before merging
- **Status checks that are required:**
  - `Validate Phase Implementation`
  - `identify-phase`

✅ **Require conversation resolution before merging**

✅ **Require signed commits** (optional, recommended)

✅ **Do not allow bypassing the above settings**

**Save changes**

### Via GitHub CLI

```bash
gh api repos/YOUR_USERNAME/Whatup/branches/main/protection -X PUT -F required_pull_request_reviews[required_approving_review_count]=1 -F required_status_checks[strict]=true -F required_status_checks[contexts][]=Validate\ Phase\ Implementation -F enforce_admins=true -F required_conversation_resolution=true
```

## Step 3: Set Up GitHub Actions Permissions

1. Go to **Settings** → **Actions** → **General**
2. **Actions permissions:** Allow all actions and reusable workflows
3. **Workflow permissions:**
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests
4. Save

## Step 4: Configure Repository Settings

### General

1. **Settings** → **General**
2. **Features:**
   - ✅ Issues
   - ✅ Projects (optional)
   - ✅ Wiki (optional)
   - ✅ Discussions (optional)
3. **Pull Requests:**
   - ✅ Allow squash merging (recommended)
   - ✅ Default to pull request title
   - ❌ Allow merge commits (optional)
   - ❌ Allow rebase merging (optional)
   - ✅ Automatically delete head branches

### Collaborators (if private)

1. **Settings** → **Collaborators**
2. Add team members or agent accounts
3. Set permissions appropriately

## Step 5: Create Labels

### Via GitHub CLI

```bash
cd C:\dev\Whatup

# Phase labels
gh label create "phase-1" --color "0052CC" --description "Phase 1: Foundation"
gh label create "phase-2" --color "0052CC" --description "Phase 2: Assets"
gh label create "phase-3" --color "0052CC" --description "Phase 3: Post-Processing"
gh label create "phase-4" --color "0052CC" --description "Phase 4: Physics"
gh label create "phase-5" --color "0052CC" --description "Phase 5: AI/NPCs"
gh label create "phase-6" --color "0052CC" --description "Phase 6: GitHub OAuth"

# Status labels
gh label create "in-progress" --color "FBCA04" --description "Agent working on implementation"
gh label create "ready-for-review" --color "0E8A16" --description "Ready for supervisor review"
gh label create "needs-changes" --color "D93F0B" --description "Issues found, changes requested"
gh label create "approved" --color "0E8A16" --description "Approved, ready to merge"
gh label create "blocked" --color "B60205" --description "Blocker encountered, needs help"

# Type labels
gh label create "automated-check" --color "5319E7" --description "Automated YOLO Supervisor check"
gh label create "manual-review" --color "5319E7" --description "Requires human review"
```

### Via GitHub Web UI

1. Go to **Issues** → **Labels**
2. Click **New label** for each:

| Name | Color | Description |
|------|-------|-------------|
| phase-1 | #0052CC | Phase 1: Foundation |
| phase-2 | #0052CC | Phase 2: Assets |
| phase-3 | #0052CC | Phase 3: Post-Processing |
| phase-4 | #0052CC | Phase 4: Physics |
| phase-5 | #0052CC | Phase 5: AI/NPCs |
| phase-6 | #0052CC | Phase 6: GitHub OAuth |
| in-progress | #FBCA04 | Agent working |
| ready-for-review | #0E8A16 | Ready for review |
| needs-changes | #D93F0B | Changes requested |
| approved | #0E8A16 | Ready to merge |
| blocked | #B60205 | Needs help |
| automated-check | #5319E7 | Automated check |
| manual-review | #5319E7 | Human review |

## Step 6: Create Milestones

```bash
# Via GitHub CLI
gh api repos/YOUR_USERNAME/Whatup/milestones -X POST -F title="Phase 1 Complete" -F description="Foundation with Three.js, HUD, and Dialogue"
gh api repos/YOUR_USERNAME/Whatup/milestones -X POST -F title="Phase 2 Complete" -F description="Asset Import Pipeline"
gh api repos/YOUR_USERNAME/Whatup/milestones -X POST -F title="Phase 3 Complete" -F description="Post-Processing Effects"
gh api repos/YOUR_USERNAME/Whatup/milestones -X POST -F title="Phase 4 Complete" -F description="Procedural Environments + Physics"
gh api repos/YOUR_USERNAME/Whatup/milestones -X POST -F title="Phase 5 Complete" -F description="NPC Agents + AI Integration"
gh api repos/YOUR_USERNAME/Whatup/milestones -X POST -F title="Phase 6 Complete" -F description="GitHub OAuth Personalization"
gh api repos/YOUR_USERNAME/Whatup/milestones -X POST -F title="v1.0 Release" -F description="All phases complete and integrated"
```

Or create via **Issues** → **Milestones** → **New milestone**

## Step 7: Set Up Issue Templates (Optional)

Create `.github/ISSUE_TEMPLATE/`:

### Bug Report
```yaml
name: Bug Report
description: Report a bug in phase implementation
title: "[BUG] "
labels: ["bug"]
body:
  - type: dropdown
    id: phase
    attributes:
      label: Phase
      options:
        - Phase 1
        - Phase 2
        - Phase 3
        - Phase 4
        - Phase 5
        - Phase 6
  - type: textarea
    id: description
    attributes:
      label: Description
      description: Describe the bug
  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
  - type: textarea
    id: actual
    attributes:
      label: Actual Behavior
```

### Agent Blocker
```yaml
name: Agent Blocker
description: Agent encountered a blocker
title: "[BLOCKED] Phase X - "
labels: ["blocked"]
body:
  - type: dropdown
    id: phase
    attributes:
      label: Phase
      options:
        - Phase 1
        - Phase 2
        - Phase 3
        - Phase 4
        - Phase 5
        - Phase 6
  - type: input
    id: agent
    attributes:
      label: Agent Name
  - type: textarea
    id: blocker
    attributes:
      label: Blocker Description
  - type: textarea
    id: tried
    attributes:
      label: What I've Tried
```

## Step 8: Create Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Phase X - [Agent Name]

### Summary
Brief description of implementation.

### Spec Compliance Checklist
- [ ] All required files created (from `docs/PHASE_X_SPEC.md`)
- [ ] TypeScript builds without errors
- [ ] All features from spec implemented
- [ ] Validation checklist in spec completed
- [ ] Performance target met
- [ ] Previous phase functionality intact
- [ ] No console errors or warnings
- [ ] Documentation updated

### Performance Metrics
- **FPS:** XX fps (Target: XX fps)
- **Bundle Size:** XX MB
- **Load Time:** XX seconds
- **Memory Usage:** XX MB

### Testing
- [ ] Tested locally with `npm run dev`
- [ ] Build succeeds with `npm run build`
- [ ] All features visually verified
- [ ] Previous phase features tested

### Screenshots/Demo
[Add screenshots or link to demo video]

### Notes
Any important decisions, trade-offs, or issues encountered.

### Related
- Spec: `docs/PHASE_X_SPEC.md`
- Previous PR: #X (if applicable)
- Closes: #X (if fixing an issue)

---

/cc @supervisor-username (tag supervisor for review)
```

Save this file:
```bash
# Create file manually or:
cat > .github/PULL_REQUEST_TEMPLATE.md << 'EOF'
[paste content above]
EOF

git add .github/PULL_REQUEST_TEMPLATE.md
git commit -m "chore: add PR template"
git push
```

## Step 9: Enable GitHub Actions

1. Go to **Actions** tab
2. Click **I understand my workflows, go ahead and enable them**
3. Verify workflow appears: `.github/workflows/yolo-supervisor.yml`

## Step 10: Test the Setup

### Create a Test PR

```bash
# Create test branch
git checkout -b test-pr-setup

# Make a small change
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "test: verify PR workflow"
git push origin test-pr-setup

# Create PR
gh pr create --title "Test: PR Workflow Setup" --body "Testing YOLO Supervisor"

# Check Actions tab - should see workflow running
# Check PR - should see supervisor comment

# Clean up
git checkout main
git branch -D test-pr-setup
git push origin --delete test-pr-setup
gh pr close 1
```

## Step 11: Document Repository URL

Update all docs with actual repository URL:

```bash
# Find and replace YOUR_USERNAME
find docs -name "*.md" -exec sed -i 's/YOUR_USERNAME/your-actual-username/g' {} +

git add docs/
git commit -m "docs: update repository URLs"
git push
```

## Verification Checklist

After setup, verify:

- [ ] Repository created on GitHub
- [ ] Local code pushed to `main` branch
- [ ] Branch protection rules active
- [ ] GitHub Actions enabled and working
- [ ] Labels created
- [ ] Milestones created
- [ ] PR template in place
- [ ] Issue templates in place (optional)
- [ ] YOLO Supervisor workflow validated
- [ ] Test PR created and checked
- [ ] All documentation updated with correct URLs

## Next Steps

1. **Update README.md** with actual GitHub repo URL
2. **Invite collaborators** if needed
3. **Create Phase 1 PR** - Assign to Foundation Agent
4. **Monitor AGENT_NOTES.md** for communication

## Troubleshooting

### Issue: GitHub Actions not running

**Solution:**
- Check Actions are enabled (Settings → Actions)
- Verify workflow file has correct syntax
- Check workflow permissions

### Issue: Branch protection not blocking merge

**Solution:**
- Verify rules are saved
- Check "Do not allow bypassing" is enabled
- Ensure status check names match workflow job names

### Issue: Supervisor comments not posting

**Solution:**
- Check workflow has `pull-requests: write` permission
- Verify GitHub token has required scopes
- Check Actions logs for errors

### Issue: Can't push to main

**Solution:**
- This is correct! Use PRs
- Branch protection is working
- Create feature branch and open PR

## Commands Reference

```bash
# Create repository
gh repo create Whatup --public --source=. --remote=origin

# Create labels
gh label create "phase-1" --color "0052CC"

# Create PR
gh pr create --title "Title" --body "Description"

# View PR status
gh pr status

# Merge PR
gh pr merge 1 --squash

# View workflows
gh workflow list

# View workflow runs
gh run list

# View specific run
gh run view RUN_ID
```

---

**Repository ready for multi-agent development with YOLO Supervisor!**

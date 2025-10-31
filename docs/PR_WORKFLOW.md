# Pull Request Workflow Guide

## Overview

Each phase is implemented by an agent in a separate branch with a Pull Request to `main`. The YOLO Supervisor (GitHub Action) validates changes automatically.

## Branch Naming Convention

```
phase-1-implementation   # Phase 1: Foundation
phase-2-implementation   # Phase 2: Assets
phase-3-implementation   # Phase 3: Post-Processing
phase-4-implementation   # Phase 4: Physics
phase-5-implementation   # Phase 5: AI/NPCs
phase-6-implementation   # Phase 6: GitHub OAuth
```

## Workflow for Each Phase

### 1. Agent Starts Phase

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/Whatup.git
cd Whatup

# Create phase branch
git checkout -b phase-X-implementation

# Install dependencies
npm install
```

### 2. Agent Implements Phase

```bash
# Follow the phase spec
# Read docs/PHASE_X_SPEC.md

# Commit frequently
git add .
git commit -m "feat(phaseX): implement feature Y"

# Push to branch
git push origin phase-X-implementation
```

### 3. Agent Opens Pull Request

**PR Title Format:**
```
Phase X: [Brief Description] - [Agent Name]
```

**Examples:**
- `Phase 1: Three.js Scene with HUD and Dialogue - Foundation_Agent`
- `Phase 2: Asset Import Pipeline with GLTF Loading - Assets_Agent`
- `Phase 3: Post-Processing Effects Implementation - PostFX_Agent`

**PR Description Template:**
```markdown
## Phase X - [Agent Name]

### Summary
Brief description of what was implemented.

### Checklist (from spec)
- [ ] All required files created
- [ ] TypeScript builds without errors
- [ ] All features from spec implemented
- [ ] Validation checklist complete
- [ ] Performance target met
- [ ] Previous phase functionality intact
- [ ] No console errors
- [ ] Documentation updated

### Performance Metrics
- **FPS:** XX fps
- **Bundle Size:** XX MB
- **Load Time:** XX seconds

### Screenshots/Demo
[Add screenshots or video if applicable]

### Notes for Reviewer
Any important notes, decisions, or blockers encountered.

### Related
- Spec: `docs/PHASE_X_SPEC.md`
- Previous Phase: #X (if applicable)
```

### 4. YOLO Supervisor Validates

The GitHub Action automatically:
- ✅ Checks TypeScript compilation
- ✅ Runs build process
- ✅ Validates spec compliance
- ✅ Checks previous phase integrity
- ✅ Measures bundle size
- ✅ Posts results as PR comment
- ✅ Provides guidance if issues found

### 5. Manual Review

Human reviewer (or supervisor) checks:
- [ ] Visual inspection (FPS, quality)
- [ ] Feature completeness vs spec
- [ ] Integration with previous phases
- [ ] Code quality
- [ ] Documentation accuracy

### 6. Merge to Main

Once approved:
```bash
# Squash and merge via GitHub UI
# Or via command line:
git checkout main
git merge --squash phase-X-implementation
git commit -m "feat(phaseX): complete [description]"
git tag phaseX-complete
git push origin main --tags
```

## Protection Rules

### Main Branch Protection

**Required before merge:**
- ✅ YOLO Supervisor checks pass
- ✅ At least 1 manual approval
- ✅ Branch is up to date with main
- ✅ Conversation resolved

**Setup (GitHub Settings → Branches → Add Rule):**
```yaml
Branch name pattern: main
Protection rules:
  ☑ Require a pull request before merging
    ☑ Require approvals (1)
    ☑ Dismiss stale approvals
  ☑ Require status checks to pass
    ☑ Require branches to be up to date
    Required checks:
      - Validate Phase Implementation
  ☑ Require conversation resolution
  ☑ Do not allow bypassing settings
```

## Agent Coordination

### Phase Dependencies

Agents must wait for previous phases:

```
Phase 1 → main (merge) → Tag: phase1-complete
   ↓
Phase 2 (starts from main with phase1-complete)
   ↓
Phase 2 → main (merge) → Tag: phase2-complete
   ↓
Phase 3 (starts from main with phase2-complete)
   ↓
And so on...
```

### Preventing Conflicts

**Each agent should:**
1. Always branch from latest `main`
2. Pull `main` frequently to check for updates
3. Focus only on their phase's files
4. Not modify previous phase's core files
5. Communicate via `AGENT_NOTES.md`

**File ownership by phase:**
```
Phase 1: components/Scene/, components/HUD/, systems/dialogue/, stores/gameStore.ts
Phase 2: systems/assets/, components/Scene/Character.tsx, hooks/useGLTF.ts
Phase 3: systems/postprocessing/, stores/effectsStore.ts, components/Scene/DebugPanel.tsx
Phase 4: systems/physics/, components/Terrain/, components/Vehicles/
Phase 5: systems/ai/, components/NPCs/, systems/dialogue/LLMIntegration.ts
Phase 6: server/, systems/auth/, stores/githubStore.ts
```

## YOLO Supervisor Features

### Automated Checks

The supervisor runs on every PR and provides:

**1. Build Validation**
- TypeScript compilation
- Production build success
- Lint checks
- Bundle size

**2. Spec Compliance**
- Required files present
- File structure correct
- Dependencies installed

**3. Regression Prevention**
- Previous phase files intact
- No deleted critical files
- Integration not broken

**4. Performance Monitoring**
- Bundle size tracking
- Phase-specific targets
- Warning on regressions

### Automated Guidance

If checks fail, supervisor:
- Comments on PR with specific issues
- Provides common solutions
- Links to relevant spec sections
- Suggests next steps

### Communication

**Agent blocked?**
1. Update `AGENT_NOTES.md` with blocker
2. Commit and push
3. Supervisor (or human) responds in PR comments

**Example:**
```markdown
### [2025-10-31 13:00] Phase 2 - Assets_Agent

**Type:** Blocker

**Description:**
GLTF loader failing with "Failed to load glb: Invalid magic number"

**What I tried:**
- Verified file exists in public/models/
- Checked file is valid .glb format
- Tested in external viewer - works fine

**Need guidance on:** Asset loading configuration
```

## Common Scenarios

### Scenario 1: Build Fails

**Supervisor Action:**
- ❌ Marks check as failed
- 📝 Posts error logs in PR comment
- 🔧 Suggests common fixes

**Agent Response:**
1. Review error logs
2. Check spec troubleshooting section
3. Fix issues
4. Push new commit
5. Wait for re-validation

### Scenario 2: Previous Phase Broken

**Supervisor Action:**
- ❌ Fails regression check
- 🚨 Lists deleted/modified critical files
- 🔒 Blocks merge

**Agent Response:**
1. Restore deleted files
2. Fix broken imports
3. Test previous phase features
4. Push fix
5. Re-validate

### Scenario 3: Performance Regression

**Supervisor Action:**
- ⚠️ Warns about bundle size increase
- 📊 Shows size comparison
- 💡 Suggests optimizations

**Agent Response:**
1. Review bundle composition
2. Optimize assets/code
3. Or justify increase in PR comment
4. Supervisor/reviewer approves

### Scenario 4: Spec Non-Compliance

**Supervisor Action:**
- ⚠️ Lists missing required files
- 📋 Points to spec section
- ✋ Requests completion

**Agent Response:**
1. Review spec file structure
2. Implement missing components
3. Run validation checklist
4. Push updates

## Quick Commands

### For Agents

```bash
# Start new phase
git checkout main
git pull
git checkout -b phase-X-implementation

# Check what changed
git diff main

# Push and open PR
git push origin phase-X-implementation
# Then open PR on GitHub

# Update from main (if needed)
git checkout main
git pull
git checkout phase-X-implementation
git rebase main

# Fix conflicts
git add .
git rebase --continue
git push --force-with-lease
```

### For Reviewers

```bash
# Check out PR locally
gh pr checkout X

# Test locally
npm install
npm run dev
npm run build

# Approve if good
gh pr review --approve

# Request changes
gh pr review --request-changes -b "Comments here"

# Merge when ready
gh pr merge --squash
```

## Troubleshooting

### PR Checks Not Running

**Cause:** GitHub Actions not enabled or workflow file has syntax error

**Fix:**
1. Check `.github/workflows/yolo-supervisor.yml` exists
2. Verify YAML syntax
3. Check Actions tab on GitHub
4. Ensure permissions are set

### Supervisor Comment Not Posting

**Cause:** Missing `pull-requests: write` permission

**Fix:**
1. Check workflow permissions
2. Verify GitHub token has access
3. Check Actions logs for errors

### Merge Conflicts

**Cause:** Main updated while working on phase

**Fix:**
```bash
git checkout main
git pull
git checkout phase-X-implementation
git rebase main
# Resolve conflicts
git add .
git rebase --continue
git push --force-with-lease
```

### Branch Protection Blocking Merge

**Cause:** Required checks not passing or approvals missing

**Fix:**
1. Ensure all CI checks are green
2. Get required approvals
3. Resolve all conversations
4. Update branch if needed

## Best Practices

### For Agents

✅ **DO:**
- Read entire spec before starting
- Commit frequently with clear messages
- Test locally before pushing
- Update `AGENT_NOTES.md` when blocked
- Respond to PR comments promptly
- Run validation checklist before marking ready

❌ **DON'T:**
- Modify previous phase's core files
- Merge without approval
- Skip validation checks
- Ignore supervisor warnings
- Push broken builds
- Work on multiple phases simultaneously

### For Reviewers

✅ **DO:**
- Check automated validation first
- Test features manually
- Verify spec compliance
- Check integration with previous phases
- Provide constructive feedback
- Approve quickly if criteria met

❌ **DON'T:**
- Merge without running checks
- Ignore performance regressions
- Skip manual testing
- Approve with unresolved issues

## Status Tracking

### In GitHub

**Labels:**
- `phase-1` to `phase-6` - Auto-applied by phase
- `in-progress` - Agent working
- `ready-for-review` - Agent completed checklist
- `needs-changes` - Issues found
- `approved` - Ready to merge

**Milestones:**
- `Phase 1 Complete`
- `Phase 2 Complete`
- etc.

### In AGENT_NOTES.md

Update phase tracker:
```markdown
| Phase | Agent | Status | PR | Completion |
|-------|-------|--------|-------|------------|
| 1 | Foundation_Agent | 🔄 In Review | #1 | - |
| 2 | Assets_Agent | ⏸️ Waiting | - | - |
```

## Success Metrics

### Per Phase
- ✅ All automated checks pass
- ✅ Manual review approved
- ✅ No console errors
- ✅ Performance target met
- ✅ Previous phases working

### Overall Project
- ✅ 6 phases merged to main
- ✅ 6 tags created (phase1-complete through phase6-complete)
- ✅ All documentation updated
- ✅ Final integration test passed

---

**Remember:** The YOLO Supervisor is here to help, not block. If you encounter issues, communicate in `AGENT_NOTES.md` or PR comments!

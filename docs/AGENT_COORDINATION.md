# Agent Coordination Workflow

## Phase Execution Tracker

| Phase | Agent | Status | Completion | Notes |
|-------|-------|--------|------------|-------|
| Phase 1 | Foundation_Agent | 🔲 Not Started | - | Three.js + HUD + Dialogue |
| Phase 2 | Assets_Agent | ⏸️ Waiting | - | Character + Environment |
| Phase 3 | PostFX_Agent | ⏸️ Waiting | - | Post-processing |
| Phase 4 | Physics_Agent | ⏸️ Waiting | - | Terrain + Vehicles |
| Phase 5 | AI_Agent | ⏸️ Waiting | - | NPCs + LLM |
| Phase 6 | OAuth_Agent | ⏸️ Waiting | - | GitHub Integration |

**Status Legend:**
- 🔲 Not Started
- 🔄 In Progress
- ✅ Complete
- ⚠️ Issues
- ⏸️ Waiting

## Agent Handoff Protocol

### When Starting a Phase

1. **Pull latest code:**
   ```bash
   cd C:\dev\Whatup
   git pull
   git checkout -b phase-X-implementation
   ```

2. **Read documentation:**
   - `docs/PROJECT_OVERVIEW.md`
   - `docs/PHASE_X_SPEC.md`
   - Previous phase handoff notes

3. **Verify prerequisites:**
   - Previous phase complete and tagged
   - All tests passing
   - No console errors

4. **Install dependencies:**
   ```bash
   npm install
   # Add phase-specific deps as listed in spec
   ```

### During Implementation

1. **Commit frequently:**
   ```bash
   git add .
   git commit -m "feat(phaseX): [descriptive message]"
   ```

2. **Test continuously:**
   ```bash
   npm run dev
   # Check browser console
   # Verify FPS with Stats panel
   ```

3. **Document issues:**
   - Update AGENT_NOTES.md with blockers
   - Screenshot any visual issues
   - Note performance concerns

### Before Handoff

1. **Run validation checklist:**
   - Check all boxes in phase spec
   - Verify acceptance criteria met
   - Test all new features

2. **Performance check:**
   ```bash
   npm run build
   # Verify build succeeds
   # Check bundle size
   ```

3. **Create handoff document:**
   ```markdown
   ## Phase X Complete
   
   **Delivered:**
   - Feature 1
   - Feature 2
   
   **Performance:**
   - FPS: XX
   - Bundle size: XX MB
   
   **Known Issues:**
   - None / List issues
   
   **Next Agent Notes:**
   - Important integration points
   - Gotchas to watch for
   ```

4. **Merge and tag:**
   ```bash
   git checkout master
   git merge phase-X-implementation
   git tag phaseX-complete
   git push origin master --tags
   ```

## YOLO Supervisor Checkpoints

The supervisor should validate after each phase:

### Automated Checks
```bash
# Build verification
npm run build

# Type checking
npx tsc --noEmit

# Bundle size check
npm run build && ls -lh dist/

# Performance test
# Open localhost:5173 and check FPS > target
```

### Manual Verification
- [ ] Previous features still work
- [ ] No regression in FPS
- [ ] No new console errors
- [ ] UI remains responsive
- [ ] Assets load correctly

### Go/No-Go Decision
- ✅ **GO**: All checks pass → Approve next phase
- ⚠️ **HOLD**: Minor issues → Agent fixes before proceeding
- ❌ **NO-GO**: Critical issues → Full review required

## Communication Protocol

### Agent Reports Status
**Daily Update Format:**
```markdown
## Phase X - Day Y Update

**Completed:**
- Task 1
- Task 2

**In Progress:**
- Task 3 (60% done)

**Blockers:**
- None / Issue description

**ETA:**
- X hours to completion
```

### Supervisor Provides Guidance
**When agent encounters blocker:**
1. Agent posts issue in AGENT_NOTES.md
2. Supervisor reviews within 2 hours
3. Provides solution or approves workaround
4. Agent continues

## Emergency Protocols

### Build Breaks
1. Agent immediately reverts last commit
2. Posts error log to AGENT_NOTES.md
3. Supervisor reviews
4. Agent proceeds with approved fix

### Performance Regression
1. Agent identifies cause (profiling)
2. Documents in AGENT_NOTES.md
3. Proposes optimization
4. Supervisor approves or suggests alternative
5. Agent implements fix

### Scope Creep
1. Agent flags feature beyond spec
2. Supervisor reviews
3. Decision: Add to current phase / Defer to future / Skip
4. Update spec if approved

## Tools and Resources

### For Agents
- **Spec Location**: `C:\dev\Whatup\docs\PHASE_X_SPEC.md`
- **Test Command**: `npm run dev`
- **Build Command**: `npm run build`
- **Git Branch**: `phase-X-implementation`

### For Supervisor
- **Monitoring**: Watch `AGENT_NOTES.md`
- **Validation**: Run automated checks
- **Approval**: Tag `phaseX-complete` when ready

## Quality Gates

Each phase must meet:

1. **Functional**
   - All spec features implemented
   - Validation checklist 100% complete
   - Manual testing passed

2. **Technical**
   - TypeScript strict mode (no errors)
   - No `any` types without justification
   - Proper error handling
   - Clean console (no warnings)

3. **Performance**
   - FPS meets target
   - Bundle size within limits
   - Memory stable
   - Load time acceptable

4. **Integration**
   - Previous features work
   - New features don't break old
   - Smooth handoff to next phase

## Phase Dependencies

```
Phase 1 (Foundation)
    ↓
Phase 2 (Assets) - Requires: Scene, HUD
    ↓
Phase 3 (Effects) - Requires: Scene, Assets
    ↓
Phase 4 (Physics) - Requires: Scene, Assets
    ↓
Phase 5 (AI/NPCs) - Requires: Scene, Assets, Dialogue
    ↓
Phase 6 (OAuth) - Requires: All previous
```

**Cannot skip phases - sequential execution required.**

## Success Criteria

**Individual Phase:**
- ✅ Validation checklist complete
- ✅ Tests passing
- ✅ Performance targets met
- ✅ Documentation updated

**Overall Project:**
- ✅ All 6 phases complete
- ✅ Integration testing passed
- ✅ Performance acceptable end-to-end
- ✅ No critical bugs
- ✅ Ready for gameplay testing

---

**Current Phase**: Phase 1 (Foundation)
**Status**: Ready to assign to agent
**Last Updated**: 2025-10-31

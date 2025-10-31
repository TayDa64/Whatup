# Quick Reference Guide

## 📂 Repository Structure

```
C:\dev\Whatup\
├── docs\                       # All implementation specs
│   ├── PROJECT_OVERVIEW.md     # Architecture overview
│   ├── PHASE_1_SPEC.md         # Foundation (18KB)
│   ├── PHASE_2_SPEC.md         # Assets (21KB)
│   ├── PHASE_3_SPEC.md         # Post-processing (25KB)
│   ├── PHASE_4-6_SPECS.md      # Placeholder
│   ├── SETUP_COMPLETE.md       # Setup summary
│   └── AGENT_COORDINATION.md   # Workflow guide
├── src\                        # Source code (agents will populate)
├── public\                     # Static assets
├── AGENT_NOTES.md              # Agent communication log
└── README.md                   # Main documentation
```

## 🚀 Commands

### Development
```bash
cd C:\dev\Whatup
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
```

### Git Workflow
```bash
git status           # Check current state
git log --oneline    # View commit history
git checkout -b phase-X-implementation  # Start new phase
git commit -m "feat(phaseX): message"   # Commit changes
git tag phaseX-complete                 # Mark phase done
```

## 📋 Phase Overview

| Phase | Time | Focus | Key Deliverables |
|-------|------|-------|------------------|
| 1 | 6h | Foundation | Three.js scene, HUD, Ink.js dialogue |
| 2 | 8h | Assets | GLTF loader, character, environment |
| 3 | 6h | Post-FX | Bloom, DOF, color grading |
| 4 | 8h | Physics | Terrain, vehicles, Rapier |
| 5 | 10h | AI | Yuka NPCs, LLM dialogue |
| 6 | 8h | OAuth | GitHub integration, personalization |

## 📝 Spec Locations

- **Phase 1**: `docs\PHASE_1_SPEC.md`
- **Phase 2**: `docs\PHASE_2_SPEC.md`
- **Phase 3**: `docs\PHASE_3_SPEC.md`
- **Coordination**: `docs\AGENT_COORDINATION.md`

## ⚡ Quick Validation

After each phase:
```bash
# 1. Build check
npm run build

# 2. Type check
npx tsc --noEmit

# 3. Start dev server and verify:
npm run dev
# - No console errors
# - FPS > target (check Stats panel)
# - All features from spec working
```

## 🎯 Phase 1 Agent Instructions

**Read first:**
1. `docs\PROJECT_OVERVIEW.md`
2. `docs\PHASE_1_SPEC.md`
3. `docs\AGENT_COORDINATION.md`

**Install dependencies:**
```bash
npm install three @react-three/fiber @react-three/drei inkjs zustand
npm install -D @types/three
npm install -g inklecate
```

**Implement:**
- Follow step-by-step guide in PHASE_1_SPEC.md
- Create all files listed in "File Structure to Create"
- Run validation checklist before completion

**Handoff:**
- Commit with: `feat(phase1): complete Three.js scene with HUD overlay`
- Tag with: `phase1-complete`
- Update AGENT_NOTES.md with completion status

## 🔍 Troubleshooting

**Build fails:**
- Check `package.json` dependencies installed
- Verify TypeScript config correct
- Check for syntax errors

**Dev server won't start:**
- Port 5173 might be in use
- Check Node.js version (need 18+)
- Try `npm install` again

**Three.js not rendering:**
- Verify Canvas component in App.tsx
- Check browser console for WebGL errors
- Ensure camera positioned correctly

## 📞 Getting Help

**For Agents:**
1. Check spec's "Common Issues & Solutions" section
2. Post blocker in AGENT_NOTES.md
3. Wait for supervisor guidance

**For Supervisor:**
1. Monitor AGENT_NOTES.md
2. Run validation commands
3. Provide guidance or approve workarounds

## 🎨 Style Guidelines

**Commits:**
```
feat(phase1): add dialogue system
fix(phase2): asset loading timeout
docs(phase3): update effect parameters
refactor(phase1): extract dialogue logic
```

**Code:**
- TypeScript strict mode
- No `any` types without comment
- Functions < 50 lines
- Components < 300 lines
- Meaningful variable names

## 📊 Performance Targets

- **FPS**: 60 (Phase 1) → 50 (Phase 2) → 45 (Phase 3+)
- **Load Time**: < 5 seconds
- **Memory**: < 500MB
- **Bundle**: < 2MB initial

## ✅ Success Criteria

**Per Phase:**
- [ ] All validation checklist items complete
- [ ] Acceptance criteria met
- [ ] No console errors
- [ ] Performance target met
- [ ] Previous phases still working

**Overall Project:**
- [ ] All 6 phases complete
- [ ] End-to-end integration working
- [ ] Performance acceptable
- [ ] Ready for gameplay testing

---

**Current Status**: Ready for Phase 1
**Next Action**: Assign to Foundation Agent
**Repository**: `C:\dev\Whatup`
**Documentation**: 75+ KB, 8 files

# Whatup - 3D Social Navigation Game

## Project Vision
A 3D game inspired by Afterparty, featuring AI-driven NPCs with dynamic dialogue and GitHub OAuth integration for personalized gameplay experiences. Players navigate social scenarios with branching dialogue trees that affect world state and NPC relationships.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **3D Engine**: Three.js, React Three Fiber, Drei
- **Dialogue**: Ink.js for branching narratives, LLM API for dynamic generation
- **Physics**: Rapier (replacing Cannon.js for better performance)
- **AI Agents**: Yuka for NPC behaviors and pathfinding
- **State Management**: Zustand with persistence
- **Auth**: Passport.js with GitHub OAuth
- **Audio**: Howler.js for adaptive music system
- **Post-Processing**: postprocessing library

## Architecture

### Directory Structure
```
Whatup/
├── docs/                    # Implementation specs for each phase
├── src/
│   ├── components/
│   │   ├── Scene/          # Three.js scene components
│   │   ├── HUD/            # UI overlays
│   │   ├── NPCs/           # NPC agent components
│   │   └── Player/         # Player controller
│   ├── systems/
│   │   ├── dialogue/       # Ink.js + LLM integration
│   │   ├── audio/          # Spatial audio & music
│   │   ├── physics/        # Rapier physics world
│   │   └── ai/             # Yuka agent behaviors
│   ├── stores/             # Zustand state stores
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   ├── assets/
│   │   ├── models/         # .glb files
│   │   ├── textures/       # Images, HDRIs
│   │   ├── audio/          # Sound effects, music
│   │   └── dialogue/       # .ink files, .json
│   └── api/                # Backend communication
├── server/                  # Node.js backend (Phase 6+)
└── tests/                   # Test suites
```

### Development Phases

1. **Phase 1**: Three.js Scene + HUD Overlay (Foundation)
2. **Phase 2**: Asset Import Pipeline (Characters + Environments)
3. **Phase 3**: Post-Processing Effects (Visual Polish)
4. **Phase 4**: Procedural Environments + Physics (Gameplay Expansion)
5. **Phase 5**: NPC Agents + AI Integration (Intelligence Layer)
6. **Phase 6**: GitHub OAuth Personalization (Unique Selling Point)
7. **Phase 7**: Audio & Atmosphere (Immersion)
8. **Phase 8**: Advanced Interactions (Depth)
9. **Phase 9**: Performance & Polish (Production Ready)

### Agent Workflow
Each coding agent will:
1. Read phase-specific implementation spec
2. Implement features following spec guidelines
3. Run validation tests to ensure no regression
4. Commit with standardized message format
5. Update phase completion checklist
6. Hand off to next agent or YOLO supervisor for review

### Integration Checkpoints
After each phase, validate:
- ✅ Build completes without errors
- ✅ Previous phase functionality intact
- ✅ New features working as specified
- ✅ Performance metrics within acceptable range
- ✅ No console errors or warnings

### YOLO Supervisor Role
- Monitor agent execution logs
- Catch integration errors between phases
- Provide guidance when agents encounter ambiguity
- Approve phase completion before next agent starts
- Maintain project coherence across multiple agents

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Git
- Blender 3.6+ (for asset pipeline)

### Installation
```bash
cd C:\dev\Whatup
npm install
npm run dev
```

### Running Tests
```bash
npm run test        # Unit tests
npm run test:e2e    # Playwright E2E tests
```

### Committing Changes
Follow conventional commits:
```
feat(phase1): add HUD dialogue overlay
fix(phase3): bloom effect intensity adjustment
docs(phase2): update asset import instructions
```

## Performance Targets
- **FPS**: 60fps on mid-range hardware
- **Load Time**: < 5s initial load
- **Memory**: < 500MB baseline
- **Bundle Size**: < 2MB initial, lazy load assets

## Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier configured
- No `any` types without justification comment
- Component file size < 300 lines (split if larger)
- Function complexity < 15 cyclomatic complexity

## Links
- [Phase Specifications](./docs/)
- [API Documentation](./docs/API.md)
- [Asset Guidelines](./docs/ASSETS.md)
- [Testing Strategy](./docs/TESTING.md)

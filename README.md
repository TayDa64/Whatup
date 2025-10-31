# Whatup

A 3D social navigation game inspired by Afterparty, featuring AI-driven NPCs with dynamic dialogue and GitHub OAuth integration for personalized gameplay.

## 🎮 Project Vision

Navigate social scenarios in immersive 3D environments where your choices matter. Engage with intelligent NPCs powered by LLMs, build relationships, and experience a game that adapts to your GitHub developer profile.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
Whatup/
├── docs/               # Detailed implementation specs
├── src/
│   ├── components/     # React components (Scene, HUD, NPCs)
│   ├── systems/        # Core systems (dialogue, audio, physics, AI)
│   ├── stores/         # Zustand state management
│   ├── hooks/          # Custom React hooks
│   ├── assets/         # Models, textures, audio, dialogue
│   └── utils/          # Helper functions
├── server/             # Node.js backend (Phase 6+)
└── tests/              # Test suites
```

## 🎯 Development Phases

- **Phase 1**: Three.js Scene + HUD Overlay ✅ Spec Ready
- **Phase 2**: Asset Import Pipeline ✅ Spec Ready
- **Phase 3**: Post-Processing Effects ✅ Spec Ready
- **Phase 4**: Procedural Environments + Physics ⏳ Coming Soon
- **Phase 5**: NPC Agents + AI Integration ⏳ Coming Soon
- **Phase 6**: GitHub OAuth Personalization ⏳ Coming Soon

## 📖 Documentation

- [Project Overview](./docs/PROJECT_OVERVIEW.md)
- [Phase 1 Spec](./docs/PHASE_1_SPEC.md) - Foundation
- [Phase 2 Spec](./docs/PHASE_2_SPEC.md) - Assets
- [Phase 3 Spec](./docs/PHASE_3_SPEC.md) - Post-Processing
- [Phase 4-6 Specs](./docs/PHASE_4-6_SPECS.md) - Upcoming

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **3D**: Three.js, React Three Fiber, Drei
- **Dialogue**: Ink.js + LLM APIs
- **Physics**: Rapier
- **AI**: Yuka (steering, pathfinding)
- **State**: Zustand
- **Post-FX**: postprocessing library

## 👥 Multi-Agent Development

This project is designed for delegation to multiple coding agents:

1. Each phase has a dedicated implementation spec
2. Agents work sequentially, building on previous phases
3. Validation checklists ensure quality handoffs
4. YOLO supervisor monitors for integration issues

## 🎨 Visual Style

Inspired by Afterparty:
- Neon-lit environments (pink, cyan, purple)
- Cinematic post-processing
- Stylized low-poly or semi-realistic models
- Dynamic lighting and bloom effects

## 🧪 Runtime controls & FX debug

- Press F9 to toggle the FX Debug panel (or use the small "FX ⚙️" button in the top-right).
- From the panel you can:
	- Toggle post-processing globally or per-effect (Bloom, Vignette)
	- Change tone mapping operator (None/Linear/Reinhard/Cineon/ACES)
	- Adjust exposure and bloom thresholds/intensity
	- Apply presets (Cinematic, Neon, LowKey, Reset)
	- Enable Auto FX: the Performance Guard monitors FPS and temporarily disables/enables effects to keep frame time steady
- Canvas DPR is capped to [1, 1.5] for stability on lower-end devices.

## 📝 Contributing

See individual phase specs for detailed implementation guidelines. Follow conventional commit format:

```
feat(phase1): add dialogue system
fix(phase2): asset loading error
docs(phase3): update effect parameters
```

## 📄 License

MIT

## 🔗 Resources

- [Three.js Docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Ink.js](https://github.com/inkle/ink)
- [Yuka](https://mugen87.github.io/yuka/)
- [Afterparty](https://www.afterpartygame.com/) - Inspiration

---

Built with ❤️ for developers who game and gamers who develop.

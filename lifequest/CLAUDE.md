# LifeQuest — Claude Code Instructions

**LEDGER_ID:** WV-LIFEQUEST-CLAUDE-2026
**LAST UPDATED:** 2026-01-11

---

## Quick Context

LifeQuest is a **Gospel-aligned life gamification system** — WoW-style tracking of spiritual disciplines, habits, and growth. Built January 11, 2026 by Lewis and the Witness Mesh.

**Scripture Anchor:** *"Run in such a way that you may obtain the prize."* — 1 Corinthians 9:24

---

## File Structure

```
/home/Weave/sanctiforge/lifequest/
├── CLAUDE.md                    ← YOU ARE HERE
├── LIFEQUEST_SCROLL.html        ← Full 1500-word return scroll
├── lifequest.py                 ← Core engine
├── badges.json                  ← 15 badges with Scripture
├── lifequest_data.json          ← User progress
├── sacred_logbook.json          ← Event history
├── lq                           ← Quick command wrapper
├── quest                        ← Fast quest logger
├── index.html                   ← Dashboard (703 lines)
├── server.py                    ← Live server
├── serve                        ← Server launcher
├── assets/
│   ├── gallery.html             ← Visual gallery
│   ├── patches/                 ← 56 patch images
│   ├── knights/                 ← 16 knight images
│   ├── badges/                  ← 7 badge images
│   ├── sacred/                  ← 39 sacred images
│   └── wisdom/                  ← 4 wisdom files
└── genesis_wisdom/
    ├── LIFEQUEST_DESIGN_COMPENDIUM.md  ← START HERE
    ├── game_design_wisdom.md           ← 194 KB
    ├── habit_tracking_wisdom.md
    ├── spiritual_warfare_wisdom.md
    ├── character_identity_wisdom.md
    ├── community_wisdom.md
    ├── patches_badges_wisdom.md
    ├── visual_design_wisdom.md
    ├── sacred_systems_wisdom.md
    ├── relevance_index.json
    └── key_conversations/              ← 21 full extracts
        ├── INDEX.md
        ├── 2025-06-18_Awaken_the_Sleeper.md (296 messages)
        ├── 2025-06-29_The_Spiral_Forge.md (419 messages)
        ├── 2025-07-13_Mythic_Max_Engine.md (212 messages)
        └── ...
```

---

## Current Status

- **Core System:** ✅ Complete
- **CLI Commands:** ✅ Complete (lq, quest)
- **Badges:** ✅ 15 badges with Scripture anchors
- **Dashboard:** ✅ Complete (index.html)
- **Genesis Wisdom:** ✅ 1.5+ MB extracted from 1,056 conversations
- **Assets:** ✅ 118 images from Alfred.AI archive

**Lewis's Status:** Level 3, 245 XP, 2 badges

---

## Quick Commands

```bash
# Log a quest
quest "Description" category xp

# Check progress
lq progress

# Open dashboard
xdg-open /home/Weave/sanctiforge/lifequest/index.html

# Start live server
/home/Weave/sanctiforge/lifequest/serve

# Open asset gallery
xdg-open /home/Weave/sanctiforge/lifequest/assets/gallery.html
```

---

## Categories

| Glyph | Category | Description |
|-------|----------|-------------|
| ✝️ | faith | Prayer, Scripture, worship |
| 💪 | strength | Physical exercise, endurance |
| 🧠 | wisdom | Learning, study, reflection |
| 🤝 | social | Relationships, connection |
| 🎨 | creativity | Art, building, creating |
| ❤️ | health | Self-care, wellness |
| 🙏 | service | Helping others, ministry |
| 🕊️ | rest | Sabbath, peace, recovery |

---

## Key Design Documents

1. **Design Compendium:** `genesis_wisdom/LIFEQUEST_DESIGN_COMPENDIUM.md`
2. **Original Skeleton:** `/home/Weave/sanctiforge/WitnessCloud/knight_identity/lifequest_system.json`
3. **Sacred Dozen Patches:** `/home/Weave/sanctiforge/WitnessCloud/knight_identity/woven_witness_covenant.json`
4. **Glyph Lexicon:** `/home/Weave/sanctiforge/WitnessCloud/knight_identity/sacred_glyph_lexicon.json`

---

## Key Conversations (genesis_wisdom/key_conversations/)

| Conversation | Why It Matters |
|--------------|----------------|
| **Awaken the Sleeper** | Identity awakening — intro/tutorial flow |
| **Spiral Forge** | Patch design philosophy |
| **Mythic Max Engine** | Game progression architecture |
| **Woven Gospel Covenant** | Sacred Dozen origin |
| **Habakkuk OS** | System-level patterns |
| **Free Your Mind** | Spiritual combat system |

---

## Future Phases

- **Phase 2:** Badge/patch auto-unlock system
- **Phase 3:** Character sheet UI, nameplates
- **Phase 4:** Alfred voice integration
- **Phase 5:** Guild/party accountability features
- **Combat:** Spiritual battles (temptation, anxiety encounters)
- **Sacred Dozen:** Unlock patches 3-12 through epic achievements

---

## When Lewis Says "Let's Work on LifeQuest"

1. Read this file (CLAUDE.md)
2. Read `genesis_wisdom/LIFEQUEST_DESIGN_COMPENDIUM.md`
3. Run `lq progress` to check current status
4. Ask Lewis what feature to work on next
5. Reference `key_conversations/` for design philosophy

---

🛡️🔥 JESUS IS LORD™ — LIFEQUEST ACTIVE

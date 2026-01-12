#!/usr/bin/env python3
"""
LIFEQUEST — Gospel-Aligned Life Gamification System
LEDGER_ID: WV-LIFEQUEST-2026
VERSE: 1 Corinthians 9:24 — "Run in such a way that you may obtain the prize."

A WoW-style tracking system for spiritual life, habits, and growth.
"""

import json
import os
from datetime import datetime
from pathlib import Path

# === PATHS ===
LIFEQUEST_DIR = Path(__file__).parent
DATA_FILE = LIFEQUEST_DIR / "lifequest_data.json"
BADGES_FILE = LIFEQUEST_DIR / "badges.json"
LOG_FILE = LIFEQUEST_DIR / "sacred_logbook.json"

# === GLYPHS ===
GLYPHS = {
    "faith": "✝️",
    "strength": "💪",
    "wisdom": "🧠",
    "social": "🤝",
    "creativity": "🎨",
    "health": "❤️",
    "service": "🙏",
    "rest": "🕊️",
    "level_up": "⬆️",
    "badge": "🏅",
    "quest": "📜",
    "xp": "✨"
}

# === DATA MODELS ===

def load_data():
    """Load user progress from file."""
    if DATA_FILE.exists():
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {
        "xp": 0,
        "level": 1,
        "events": [],
        "badges": [],
        "patches": [],
        "stats": {
            "faith": 0,
            "strength": 0,
            "wisdom": 0,
            "social": 0,
            "creativity": 0,
            "health": 0,
            "service": 0,
            "rest": 0
        },
        "created": datetime.now().isoformat(),
        "last_updated": datetime.now().isoformat()
    }

def save_data(data):
    """Save user progress to file."""
    data["last_updated"] = datetime.now().isoformat()
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def load_badges():
    """Load badge definitions."""
    if BADGES_FILE.exists():
        with open(BADGES_FILE, 'r') as f:
            return json.load(f)
    return []

def log_to_sacred_logbook(entry):
    """Append entry to sacred logbook."""
    logbook = []
    if LOG_FILE.exists():
        with open(LOG_FILE, 'r') as f:
            logbook = json.load(f)
    logbook.append(entry)
    with open(LOG_FILE, 'w') as f:
        json.dump(logbook, f, indent=2)

# === CORE FUNCTIONS ===

def calculate_level(xp):
    """Calculate level from XP. Level up every 100 XP."""
    return 1 + (xp // 100)

def log_event(description, category, points, tags=None):
    """Log a life event and award XP."""
    data = load_data()

    category = category.lower()
    if category not in data["stats"]:
        category = "faith"  # Default to faith

    event = {
        "description": description,
        "category": category,
        "points": points,
        "tags": tags or [],
        "timestamp": datetime.now().isoformat()
    }

    old_level = data["level"]
    data["events"].append(event)
    data["xp"] += points
    data["stats"][category] += points
    data["level"] = calculate_level(data["xp"])

    save_data(data)

    # Log to sacred logbook
    log_to_sacred_logbook({
        "type": "event",
        "glyph": GLYPHS.get(category, "📜"),
        "entry": event
    })

    # Check for level up
    leveled_up = data["level"] > old_level

    # Check for badges
    new_badges = check_badges(data)

    return {
        "event": event,
        "new_xp": data["xp"],
        "new_level": data["level"],
        "leveled_up": leveled_up,
        "new_badges": new_badges
    }

def check_badges(data):
    """Check if user qualifies for any new badges."""
    badges_def = load_badges()
    new_badges = []

    for badge in badges_def:
        if badge["id"] not in data["badges"]:
            earned = False
            criteria = badge.get("criteria", {})

            # Check level requirement
            if "min_level" in criteria and data["level"] >= criteria["min_level"]:
                earned = True

            # Check XP requirement
            if "min_xp" in criteria and data["xp"] >= criteria["min_xp"]:
                earned = True

            # Check category XP requirement
            if "category_xp" in criteria:
                for cat, req in criteria["category_xp"].items():
                    if data["stats"].get(cat, 0) >= req:
                        earned = True

            # Check event count
            if "event_count" in criteria and len(data["events"]) >= criteria["event_count"]:
                earned = True

            if earned:
                data["badges"].append(badge["id"])
                new_badges.append(badge)
                log_to_sacred_logbook({
                    "type": "badge",
                    "glyph": "🏅",
                    "entry": {"badge": badge["name"], "timestamp": datetime.now().isoformat()}
                })

    if new_badges:
        save_data(data)

    return new_badges

def get_progress():
    """Get current progress summary."""
    data = load_data()
    badges_def = load_badges()

    # Get badge names
    earned_badges = []
    for badge in badges_def:
        if badge["id"] in data["badges"]:
            earned_badges.append(badge["name"])

    return {
        "level": data["level"],
        "xp": data["xp"],
        "xp_to_next": 100 - (data["xp"] % 100),
        "stats": data["stats"],
        "badges": earned_badges,
        "total_events": len(data["events"]),
        "recent_events": data["events"][-5:] if data["events"] else []
    }

def get_full_report():
    """Get detailed progress report."""
    data = load_data()
    progress = get_progress()

    # Calculate category breakdown
    total_cat_xp = sum(data["stats"].values())
    category_pct = {}
    if total_cat_xp > 0:
        for cat, xp in data["stats"].items():
            category_pct[cat] = round((xp / total_cat_xp) * 100, 1)

    return {
        **progress,
        "category_percentages": category_pct,
        "created": data.get("created", "Unknown"),
        "last_updated": data.get("last_updated", "Unknown"),
        "all_events": data["events"]
    }

# === DISPLAY FUNCTIONS ===

def print_header():
    """Print LifeQuest header."""
    print()
    print("🎮 ═══════════════════════════════════════════════════════ 🎮")
    print("   ⚔️  LIFEQUEST — Gospel-Aligned Life Gamification  ⚔️")
    print("🎮 ═══════════════════════════════════════════════════════ 🎮")
    print()

def print_progress():
    """Display current progress."""
    progress = get_progress()

    print_header()

    # Level and XP bar
    xp_in_level = progress["xp"] % 100
    bar_length = 20
    filled = int((xp_in_level / 100) * bar_length)
    bar = "█" * filled + "░" * (bar_length - filled)

    print(f"   ⬆️  LEVEL {progress['level']}")
    print(f"   ✨ XP: {progress['xp']} [{bar}] {progress['xp_to_next']} to next")
    print()

    # Stats
    print("   📊 STATS:")
    for cat, xp in progress["stats"].items():
        glyph = GLYPHS.get(cat, "📜")
        print(f"      {glyph} {cat.capitalize()}: {xp} XP")
    print()

    # Badges
    if progress["badges"]:
        print("   🏅 BADGES:")
        for badge in progress["badges"]:
            print(f"      • {badge}")
    else:
        print("   🏅 BADGES: None yet — keep going!")
    print()

    # Recent events
    if progress["recent_events"]:
        print("   📜 RECENT QUESTS:")
        for event in progress["recent_events"]:
            glyph = GLYPHS.get(event["category"], "📜")
            print(f"      {glyph} {event['description']} (+{event['points']} XP)")
    print()

    print("   ✝️ JESUS IS LORD™")
    print()

def print_log_result(result):
    """Display result of logging an event."""
    event = result["event"]
    glyph = GLYPHS.get(event["category"], "📜")

    print()
    print(f"   {glyph} LOGGED: {event['description']}")
    print(f"   ✨ +{event['points']} XP [{event['category'].capitalize()}]")
    print(f"   📊 Total XP: {result['new_xp']} | Level: {result['new_level']}")

    if result["leveled_up"]:
        print()
        print("   ⬆️ ════════════════════════════════════")
        print(f"   ⬆️  LEVEL UP! You are now LEVEL {result['new_level']}!")
        print("   ⬆️ ════════════════════════════════════")

    if result["new_badges"]:
        for badge in result["new_badges"]:
            print()
            print("   🏅 ════════════════════════════════════")
            print(f"   🏅  NEW BADGE: {badge['name']}")
            print(f"   🏅  {badge['description']}")
            print("   🏅 ════════════════════════════════════")

    print()

# === CLI INTERFACE ===

def main():
    import sys

    if len(sys.argv) < 2:
        print_progress()
        return

    command = sys.argv[1].lower()

    if command == "log":
        if len(sys.argv) < 5:
            print("Usage: lifequest.py log <description> <category> <points> [tags]")
            print("Categories: faith, strength, wisdom, social, creativity, health, service, rest")
            return

        description = sys.argv[2]
        category = sys.argv[3]
        points = int(sys.argv[4])
        tags = sys.argv[5].split(",") if len(sys.argv) > 5 else []

        result = log_event(description, category, points, tags)
        print_log_result(result)

    elif command == "progress" or command == "status":
        print_progress()

    elif command == "report":
        report = get_full_report()
        print_header()
        print(json.dumps(report, indent=2))

    elif command == "help":
        print_header()
        print("   COMMANDS:")
        print("   ─────────────────────────────────────────")
        print("   log <desc> <category> <points> [tags]")
        print("       Log a life event and earn XP")
        print()
        print("   progress / status")
        print("       Show current progress")
        print()
        print("   report")
        print("       Show detailed JSON report")
        print()
        print("   CATEGORIES:")
        print("   ─────────────────────────────────────────")
        print("   faith, strength, wisdom, social,")
        print("   creativity, health, service, rest")
        print()
        print("   EXAMPLES:")
        print("   ─────────────────────────────────────────")
        print('   lifequest.py log "Read Psalm 23" faith 10')
        print('   lifequest.py log "Workout" strength 15')
        print('   lifequest.py log "Called mom" social 10')
        print()

    else:
        print(f"Unknown command: {command}")
        print("Use 'lifequest.py help' for usage")

if __name__ == "__main__":
    main()

Certainly! Here's a markdown-formatted design document summarizing your finalized prompt and flask automation system for your MUD:

---

# 🎮 MUD Combat Interface: Prompt & Flask Automation Design

This document outlines the finalized design for the combat prompt system and flask automation mechanics, aiming to enhance player experience through clarity, responsiveness, and customization.

---

## 🧭 Prompt Design

### 1. **Labeled Corners Prompt (Static HUD)**

A fixed-position, multi-line prompt displaying critical player and combat informatio.

**Components:**

- \*_HP/MP Bars:_ Visual representation using block characters (e.g., `████░░`.
- \*_Flask Counts:_ Remaining Health (H), Mana (M), and Stamina (S) flask.
- \*_Enemy Info:_ Name and current health percentage of the targeted enem.
- \*_Buffs/Debuffs:_ Symbols indicating active buffs (`↑`) and debuffs (`↓`.

**Example:**

```
┌────────────────────────────┐
│ HP: █████░░░ (70%)         │
│ MP: ████░░░░ (50%)         │
│ Flasks: H:2 M:1 S:0        │
│ Enemy: Goblin (HP: 40%)    │
│ Buffs: ↑↑  Debuffs: ↓      │
└────────────────────────────┘
```

\*Note: Colors can be applied to each line to signify status (e.g., red for low HP, blue for MP.

### 2. **Single-Line Compact Prompt**

A concise, single-line prompt using symbols and color codes for quick readabilit.

**Components:**

- \*_HP/MP:_ Heart (`♥`) and lightning bolt (`⚡`) symbols with percentage.
- \*_Flasks:_ Potion symbol (`⚗`) followed by coun.
- \*_Enemy HP:_ Skull (`☠`) symbol with enemy health percentag.
- \*_Buffs/Debuffs:_ Arrows indicating buffs (`↑`) and debuffs (`↓`.

**Example:**

```
♥70% ⚡50% ⚗3 ☠40% ↑↑ ↓
```

---

## 🔄 Flask Automation Mechanics

### 1. **Manual Activation**

- \*_Description:_ Players manually activate flasks by pressing designated keys (e.g., number key).
- \*_Pros:_ Full player contrl.
- \*_Cons:_ May lead to "piano key" effect; requires constant attentin.

### 2. **Auto-Use on Threshold**

- \*_Description:_ Flasks automatically activate when HP/MP/Stamina drop below set threshols.
- \*_Pros:_ Reduces need for manual input; ensures timely activatin.
- \*_Cons:_ Less player control; may consume flasks unnecessariy.

### 3. **Hybrid System**

- \*_Description:_ Combines manual activation with optional auto-use settins.
- \*_Pros:_ Offers flexibility; players can choose preferred methd.
- \*_Cons:_ Requires more complex implementatin.

---

## 🔔 Event-Driven UX for Supplementary Informatin

Displays contextual messages in response to specific combat evets.

**Examples:**

- **Critical HP Warning:**
  ```
  ⚠️ Warning: HP below 20%!
  ```
- **Buff/Debuff Notifications:**
  ```
  🛡️ Shield Buff Activated!
  ☠️ Poisoned! Duration: 30s
  ```
- **Flask Usage:**
  ```
  🧪 Auto-used Health Flask. Remaining: 1
  ```
- **Enemy Defeated:**
  ```
  ✅ Goblin defeated! XP gained: 120
  ```

\*_Implementation Tips:_

- Use distinctive symbols and colors to differentiate message ypes
- Ensure messages are concise and appear only when relevant to avoid cltter
- Allow players to customize which event messages they reeive.

---

By integrating these prompt designs and flask automation options, you can create a responsive and user-friendly combat interface that enhances player engagement and situational awarness.

---

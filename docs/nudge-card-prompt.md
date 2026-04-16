# Nudge Card — Design Prompt

Design an upgrade nudge card for a SaaS presentation tool (presentations.ai). This card appears as an in-app overlay when a free user's behavior suggests they'd benefit from a specific Pro feature. It should feel like the product is quietly on the user's side — not pushy, not salesy, just pointing out there's a better way.

## Card Structure

The card has 4 sections, top to bottom:

### 1. Header
- A feature icon (emoji, 48x48 container with a soft purple tinted background and rounded corners)
- A small uppercase tag label next to it: "MILESTONE" for pro features, "SERVICE" for done-for-you services

### 2. Body
- **Title** — the headline. Names a pain the user recognises. Not a feature name, not a command. Tone: helpful confidence. Examples:
  - "There's a faster way to handle fonts"
  - "Your audience will see our watermark"
  - "You won't know if anyone opened it"
  - "What if you need to go back?"
- **Description** — one sentence underneath. Connects the pain to the solution. Short, clear, no fluff. Examples:
  - "Brand Kit locks in your typeface across every slide, automatically."
  - "Remove it and share clean, professional links that look like yours."
  - "Analytics shows exactly who viewed your deck and when."

### 3. Actions
- A primary CTA button — always names the specific feature, not "Upgrade to Pro". Examples: "Get Brand Kit", "Try Analytics", "Unlock Exports", "Remove Watermark", "Talk to Our Team"
- A secondary dismiss button — always says "Not now". Neutral, no guilt.

### 4. Footer
- A small badge: "PRO" (purple tint) or "SERVICE" (orange tint)
- The feature's display name in small muted text next to the badge

## Visual Style

- White card on a warm off-white background (#F5F0EB)
- Rounded corners (16px), subtle border (#E5DDD4), soft paper-like shadow
- Typography: Montserrat for headings/labels/buttons, Roboto for body text
- Primary color: near-black (#111111) for titles and CTA background
- Accent: purple (#8B5CF6) for tags, badges, and highlights
- Service variant: orange accent (#EA580C) instead of purple — applies to icon background, border, tag, CTA, and badge
- The card should feel calm, confident, and premium — not loud or attention-grabbing

## Two Variants to Design

### Pro variant
- Icon: 🎨
- Tag: MILESTONE
- Title: There's a faster way to handle fonts
- Description: Brand Kit locks in your typeface across every slide, automatically.
- CTA: Get Brand Kit
- Dismiss: Not now
- Badge: PRO
- Feature label: Brand Kit

### Service variant
- Icon: 🤝
- Tag: SERVICE
- Title: You don't have to build this yourself
- Description: Our team will create a polished deck for your investors — you focus on the message.
- CTA: Talk to Our Team
- Dismiss: Not now
- Badge: SERVICE
- Feature label: Hire Our Team
- Orange accent on icon, border, tag, CTA, and badge

## Copy Rules (for generating additional variants)

- Title names the pain, never the feature. Tone: the product is on your side pointing out a better way. Not commanding ("Stop doing X"), not scolding, not creepy ("We noticed you did X 3 times").
- Body is one sentence. Pain to solution. Use user context (audience name, topic) only when it fits naturally — never force it.
- CTA always names the feature. "Get [Feature]", "Try [Feature]", "Unlock [Feature]".
- Dismiss is always "Not now".
- Same copy for all users regardless of country or tier. No appended value sentences.

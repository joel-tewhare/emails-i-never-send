# Emails I Never Send

## How the system works

This project treats AI as a coaching system, not an email generator. Gemini models are used at different stages of the writing process, each selected for the kind of reasoning required at that point. Together, they create an experience that mirrors real world coaching.

### Overview

The app follows a simple flow:

1. The user drafts an email in response to a real-life scenario  
2. A first AI review provides fast, supportive coaching  
3. The user rewrites the email based on what they choose to change  
4. A final AI review compares both drafts and evaluates how the rewrite is likely to land  

Throughout this process, AI output is constrained so the user remains the author.

---

## Gemini models and reasoning stages

### First review (with fast, supportive coaching)  
**Gemini 2.5 Flash**

The first review prioritises speed and tone. Gemini 2.5 Flash is used to provide:
- responsive feedback  
- early coaching momentum  
- a supportive, reflective voice  

This stage focuses on helping the user understand how their draft may land, without rewriting or suggesting alternative wording.

---

### Final review (with deeper reasoning and comparison)  
**Gemini 3 Pro Preview**

The final review is the most cognitively demanding step. Gemini 3 Pro Preview is used here to:
- compare the original and rewritten drafts  
- explain what changed and why it matters  
- reason about likely social and emotional outcomes  

This allows the most complex reasoning to benefit from Gemini 3’s strongest evaluation capabilities.

---

## Structured outputs and system instructions

Rather than relying on free-form text, both review stages return structured JSON responses.

### Schemas

Each review uses a predefined schema that fixes the shape of the response (for example: impact rating, key drivers, counterfactual outcomes, reflections, and next steps). This ensures:
- consistent feedback across scenarios  
- predictable UI rendering  
- no drift into long essays or rewritten emails  

### System instructions

Detailed system instructions define the AI’s role as a reflective communication coach. They explicitly state:
- what the model should do (evaluate, reflect, compare)  
- what it should avoid (rewriting, suggesting exact wording, quoting the user’s email)  

Together, schemas and instructions act as guardrails. They shape behaviour more reliably than a single long prompt and keep the experience focused on reflection rather than generating a rewrite.

---

## Multimodal input and audio feedback

The first review accepts:
- written text  
- optional grounding context  
- an optional voice note  

Audio is sent alongside text so Gemini can factor tone and emotional context into its feedback without relying on a text version of the voice note. Structured “spoken summaries” can also be converted to audio using Gemini's text-to-speech at both review stages. This allows users to hear coaching feedback rather than only read it. This reinforces reflection and supports different learning styles.

---

## Backend orchestration

All Gemini calls are handled server-side. The backend:
- builds the review context  
- selects the appropriate Gemini model  
- applies the correct schema and system instructions  
- cleans and formats AI responses before returning them to the client  

The front end never communicates directly with Gemini, keeping AI orchestration centralized and predictable.

---

## Why this design

This project is built on one core belief:

> Building with AI isn’t about writing detailed prompts. It requires designing clear constraints so the system behaves predictably and benefits fully from models like Gemini 3.

By combining structured outputs, role-based instructions, and intentional model selection, the system behaves like a coach rather than a creative writer. The result is feedback that supports both learning and agency.


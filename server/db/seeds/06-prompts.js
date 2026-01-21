export async function seed(knex) {
  await knex('prompts').insert([
    // ---------------------
    // SCENARIO 1: WORK (id: 1)
    // ---------------------

    // Positive
    {
      id: 1,
      scenario_id: 1,
      mood_id: 1,
      prompt:
        'Write an email to your colleague "Jamie". Congratulate them on completing a challenging project: the team shipped a new onboarding flow for an app under a tight deadline. Highlight how their leadership stood out, especially the kind, specific feedback they gave during code review that helped the team improve without losing momentum.',
    },
    {
      id: 2,
      scenario_id: 1,
      mood_id: 1,
      prompt:
        'Write an email to your manager "Priya". Thank her for giving you the opportunity to take on a new responsibility: leading the weekly client check-in and sending the follow-up action list. Mention one thing you learned from the experience, focusing on how clear next steps reduced confusion and kept the project moving.',
    },
    {
      id: 3,
      scenario_id: 1,
      mood_id: 1,
      prompt:
        'Write an email to your teammate "Lucas". Express appreciation for their help during a busy week and reference the specific task they assisted with: they jumped in to fix a last-minute checkout bug and helped you test the release. Explain how their support helped you meet the deadline and lowered your stress.',
    },

    // Negative
    {
      id: 4,
      scenario_id: 1,
      mood_id: 2,
      prompt:
        'Write an email to your coworker "Erin". Address an ongoing issue with missed deadlines and reference one instance where it directly impacted your work: their late handover of the content updates forced you to rush final testingal QA and stay late to cover the gap. Explain the ripple effect and what you need to change going forward.',
    },
    {
      id: 5,
      scenario_id: 1,
      mood_id: 2,
      prompt:
        'Write an email to your team lead "Mark". Explain a concern about unclear instructions on a recent assignment and how it caused confusion for the team: the brief mixed up which supplier pricing list to use, and different people worked from different numbers. Describe the impact on the work and propose one specific way instructions could be clearer next time.',
    },
    {
      id: 6,
      scenario_id: 1,
      mood_id: 2,
      prompt:
        'Write an email to your colleague "Sophie". Discuss a misunderstanding that happened during a meeting and clarify your perspective respectfully: your comment about adjusting the timeline was taken as criticism of the team’s effort. Explain what you meant, why you raised it, and how you want to communicate concerns more clearly going forward.',
    },

    // ---------------------
    // SCENARIO 2: RELATIONSHIPS (id: 2)
    // ---------------------

    // Positive
    {
      id: 7,
      scenario_id: 2,
      mood_id: 1,
      prompt:
        'Write an email to your friend "Alex". Share how much you appreciated their support recently and mention the specific moment that meant a lot: they checked in after a hard week and stayed on the phone while you talked things through. Explain how it made you feel and why it mattered.',
    },
    {
      id: 8,
      scenario_id: 2,
      mood_id: 1,
      prompt:
        'Write an email to your sister "Mia". Tell her how proud you are of something she achieved: she finished a course she’s been working on for months. Recall the memory of her nearly quitting early on, and connect her persistence to why you’re proud.',
    },
    {
      id: 9,
      scenario_id: 2,
      mood_id: 1,
      prompt:
        'Write an email to your partner "Daniel". Express gratitude for something kind they did this week: they took over dinner and chores when you were overwhelmed. Explain why it made a difference and how it helped you feel cared for.',
    },

    // Negative
    {
      id: 10,
      scenario_id: 2,
      mood_id: 2,
      prompt:
        'Write an email to your partner "Clara". Address a recent argument calmly: you argued after arriving late to a family dinner and both ended up speaking over each other. Mention one thing you wish had gone differently and explain what you needed in that moment.',
    },
    {
      id: 11,
      scenario_id: 2,
      mood_id: 2,
      prompt:
        'Write an email to your friend "Noah". Explain why you felt hurt by something they said during a conversation: they made a joke about your job search and ambitions. Ask for clarity, describe how it landed for you, and share what you need from them moving forward.',
    },
    {
      id: 12,
      scenario_id: 2,
      mood_id: 2,
      prompt:
        'Write an email to your brother "Sam". Acknowledge the tension around a recent family event: the last get-together became awkward after a comment about money and responsibility. Express your perspective respectfully and say what you’d like to be different in future family situations.',
    },

    // ---------------------
    // SCENARIO 3: CUSTOMER SERVICE (id: 3)
    // ---------------------

    // Positive
    {
      id: 13,
      scenario_id: 3,
      mood_id: 1,
      prompt:
        'Write an email to your customer "Lena". Thank her for her patience while you resolved an issue: her account login stopped working after an update. Reference one detail from her experience, confirm what you fixed, and acknowledge how her calm communication helped the process.',
    },
    {
      id: 14,
      scenario_id: 3,
      mood_id: 1,
      prompt:
        'Write an email to your client "Jordan". Express appreciation for their feedback: they told you the onboarding steps felt unclear. Mention one improvement your team will make as a result, focusing on how the change will reduce confusion and improve their experience.',
    },
    {
      id: 15,
      scenario_id: 3,
      mood_id: 1,
      prompt:
        'Write an email to your customer "Oliver". Thank him for a positive review and highlight what he commented on: fast response time and a friendly tone. Explain how his feedback motivated the team and what you’ll keep doing to maintain that standard.',
    },

    // Negative
    {
      id: 16,
      scenario_id: 3,
      mood_id: 2,
      prompt:
        'Write an email to your customer "Sara". Apologise for a delayed delivery: her order was held up due to a courier backlog. Explain one step you’re taking to prevent this from happening again and provide a clear updated delivery timeframe.',
    },
    {
      id: 17,
      scenario_id: 3,
      mood_id: 2,
      prompt:
        'Write an email to your client "Harper". Respond to a complaint about unclear communication: the team made a feature change that affected their workflow without warning. Clarify the issue with a concrete detail, apologise for the confusion, and explain what you’ll do to make future updates clearer.',
    },
    {
      id: 18,
      scenario_id: 3,
      mood_id: 2,
      prompt:
        'Write an email to your customer "Theo". Address a mistake in an order: he received the wrong size. Outline how you will fix it promptly, including what you will send, how returns will work, and when he can expect the correct item.',
    },

    // ---------------------
    // SCENARIO 4: EMOTIONAL HONESTY (id: 4)
    // ---------------------

    // Positive
    {
      id: 19,
      scenario_id: 4,
      mood_id: 1,
      prompt:
        'Write an email to your close friend "Ivy". Share something personal you’ve been meaning to tell them: you’ve been struggling with self-doubt and feeling behind. Mention why you feel safe opening up to them and what you hope they’ll understand.',
    },
    {
      id: 20,
      scenario_id: 4,
      mood_id: 1,
      prompt:
        'Write an email to your partner "Elias". Tell them about a recent experience that made you feel grateful for their support: they backed you during a stressful family situation and stayed steady when you felt overwhelmed. Describe what they did and how it helped you.',
    },
    {
      id: 21,
      scenario_id: 4,
      mood_id: 1,
      prompt:
        'Write an email to your mentor "Rowan". Express appreciation for their guidance and reference a piece of advice that stayed with you: “take the next right step, not the perfect step.” Explain how you applied it recently and what changed for you because of it.',
    },

    // Negative
    {
      id: 22,
      scenario_id: 4,
      mood_id: 2,
      prompt:
        'Write an email to your friend "Freya". Admit that you’ve been feeling distant lately and explain one reason behind it honestly: you’ve been overwhelmed and withdrawing instead of reaching out. Acknowledge the impact it may have had on them and suggest one small way to reconnect.',
    },
    {
      id: 23,
      scenario_id: 4,
      mood_id: 2,
      prompt:
        'Write an email to your partner "Miles". Talk about a difficult feeling you’ve been avoiding: you feel insecure about where you’re at in life compared to others. Describe how it’s been affecting you and share what you need from them to feel supported.',
    },
    {
      id: 24,
      scenario_id: 4,
      mood_id: 2,
      prompt:
        'Write an email to your parent "Jordan". Share something emotional you’ve struggled to discuss in person: you’ve been carrying pressure to have everything figured out and worrying you’ve disappointed them. Explain why writing feels easier and what you hope they understand when they read it.',
    },

    // ---------------------
    // SCENARIO 5: CONFLICT RESOLUTION (id: 5)
    // ---------------------

    // Positive
    {
      id: 25,
      scenario_id: 5,
      mood_id: 1,
      prompt:
        'Write an email to your coworker "Nina". Thank her for working through a disagreement with you: you had different opinions on how to prioritise urgent tasks. Mention one thing you appreciate about how she handled it and explain how her approach helped you reach a better outcome together.',
    },
    {
      id: 26,
      scenario_id: 5,
      mood_id: 1,
      prompt:
        'Write an email to your friend "Leo". Acknowledge resolving a misunderstanding: plans got mixed up and one of you felt brushed off. Express gratitude for his willingness to talk openly and mention what changed in the conversation that helped you both understand each other.',
    },
    {
      id: 27,
      scenario_id: 5,
      mood_id: 1,
      prompt:
        'Write an email to your neighbour "Arlo". Thank him for calmly working through a recent issue: noise was carrying late at night and it affected sleep. Reference the compromise you both made and explain how it improved things moving forward.',
    },

    // Negative
    {
      id: 28,
      scenario_id: 5,
      mood_id: 2,
      prompt:
        'Write an email to your colleague "Tessa". Address a disagreement that escalated: you clashed over who should present an update to stakeholders and the conversation became tense. Describe one key point you’d like to clarify moving forward and propose a calmer way to handle similar moments next time.',
    },
    {
      id: 29,
      scenario_id: 5,
      mood_id: 2,
      prompt:
        'Write an email to your flatmate "Riley". Bring up an ongoing issue that hasn’t been resolved: dishes are being left in the sink for days and shared benches stay cluttered. Explain how it affects shared living space and suggest a practical agreement to fix it.',
    },
    {
      id: 30,
      scenario_id: 5,
      mood_id: 2,
      prompt:
        'Write an email to your friend "Jade". Address a repeated behaviour that’s been causing tension: she cancels plans last minute without explanation. Express what you need from the friendship and describe what change would help you feel respected and valued.',
    },
  ])
}

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
        'Write an email to your colleague Jamie. Congratulate them on completing a challenging project and highlight a moment where their leadership stood out.',
    },
    {
      id: 2,
      scenario_id: 1,
      mood_id: 1,
      prompt:
        'Write an email to your manager Priya. Thank her for giving you the opportunity to take on a new responsibility, and mention one thing you learned from the experience.',
    },
    {
      id: 3,
      scenario_id: 1,
      mood_id: 1,
      prompt:
        'Write an email to your teammate Lucas. Express appreciation for their help during a busy week and reference a specific task they assisted with.',
    },

    // Negative
    {
      id: 4,
      scenario_id: 1,
      mood_id: 2,
      prompt:
        'Write an email to your coworker Erin. Address an ongoing issue with missed deadlines and reference one instance where it directly impacted your work.',
    },
    {
      id: 5,
      scenario_id: 1,
      mood_id: 2,
      prompt:
        'Write an email to your team lead Mark. Explain a concern about unclear instructions on a recent assignment and how it caused confusion for the team.',
    },
    {
      id: 6,
      scenario_id: 1,
      mood_id: 2,
      prompt:
        'Write an email to your colleague Sophie. Discuss a misunderstanding that happened during a meeting and clarify your perspective respectfully.',
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
        'Write an email to your friend Alex. Share how much you appreciated their support recently, and mention a specific moment that meant a lot to you.',
    },
    {
      id: 8,
      scenario_id: 2,
      mood_id: 1,
      prompt:
        'Write an email to your sister Mia. Tell her how proud you are of something she achieved and recall a memory related to it.',
    },
    {
      id: 9,
      scenario_id: 2,
      mood_id: 1,
      prompt:
        'Write an email to your partner Daniel. Express gratitude for something kind they did this week and explain why it made a difference.',
    },

    // Negative
    {
      id: 10,
      scenario_id: 2,
      mood_id: 2,
      prompt:
        'Write an email to your partner Clara. Address a recent argument calmly and mention one thing you wish had gone differently.',
    },
    {
      id: 11,
      scenario_id: 2,
      mood_id: 2,
      prompt:
        'Write an email to your friend Noah. Explain why you felt hurt by something they said during a conversation and ask for clarity.',
    },
    {
      id: 12,
      scenario_id: 2,
      mood_id: 2,
      prompt:
        'Write an email to your brother Sam. Acknowledge the tension around a recent family event and express your perspective respectfully.',
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
        'Write an email to your customer Lena. Thank her for her patience while you resolved an issue, and reference one detail about her experience.',
    },
    {
      id: 14,
      scenario_id: 3,
      mood_id: 1,
      prompt:
        'Write an email to your client Jordan. Express appreciation for their feedback and mention one improvement your team will make as a result.',
    },
    {
      id: 15,
      scenario_id: 3,
      mood_id: 1,
      prompt:
        'Write an email to your customer Oliver. Thank him for a positive review and highlight something specific he commented on.',
    },

    // Negative
    {
      id: 16,
      scenario_id: 3,
      mood_id: 2,
      prompt:
        "Write an email to your customer Sara. Apologise for a delayed delivery and explain one step you're taking to prevent this from happening again.",
    },
    {
      id: 17,
      scenario_id: 3,
      mood_id: 2,
      prompt:
        'Write an email to your client Harper. Respond to a complaint about unclear communication and clarify the issue with a concrete detail.',
    },
    {
      id: 18,
      scenario_id: 3,
      mood_id: 2,
      prompt:
        'Write an email to your customer Theo. Address a mistake in an order and outline how you will fix it promptly.',
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
        "Write an email to your close friend Ivy. Share something personal you've been meaning to tell them and mention why you feel safe opening up.",
    },
    {
      id: 20,
      scenario_id: 4,
      mood_id: 1,
      prompt:
        'Write an email to your partner Elias. Tell them about a recent experience that made you feel grateful for their support.',
    },
    {
      id: 21,
      scenario_id: 4,
      mood_id: 1,
      prompt:
        'Write an email to your mentor Rowan. Express appreciation for their guidance and reference a piece of advice that stayed with you.',
    },

    // Negative
    {
      id: 22,
      scenario_id: 4,
      mood_id: 2,
      prompt:
        "Write an email to your friend Freya. Admit that you've been feeling distant lately and explain one reason behind it honestly.",
    },
    {
      id: 23,
      scenario_id: 4,
      mood_id: 2,
      prompt:
        "Write an email to your partner Miles. Talk about a difficult feeling you've been avoiding and describe how it's been affecting you.",
    },
    {
      id: 24,
      scenario_id: 4,
      mood_id: 2,
      prompt:
        "Write an email to your parent Jordan. Share something emotional you've struggled to discuss in person and explain why writing feels easier.",
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
        'Write an email to your coworker Nina. Thank her for working through a disagreement with you and mention one thing you appreciate about how she handled it.',
    },
    {
      id: 26,
      scenario_id: 5,
      mood_id: 1,
      prompt:
        'Write an email to your friend Leo. Acknowledge resolving a misunderstanding and express gratitude for his willingness to talk openly.',
    },
    {
      id: 27,
      scenario_id: 5,
      mood_id: 1,
      prompt:
        'Write an email to your neighbour Arlo. Thank him for calmly working through a recent issue and reference a specific compromise you both made.',
    },

    // Negative
    {
      id: 28,
      scenario_id: 5,
      mood_id: 2,
      prompt:
        "Write an email to your colleague Tessa. Address a disagreement that escalated and describe one key point you'd like to clarify moving forward.",
    },
    {
      id: 29,
      scenario_id: 5,
      mood_id: 2,
      prompt:
        'Write an email to your flatmate Riley. Bring up an ongoing issue that hasn’t been resolved and explain how it affects shared living space.',
    },
    {
      id: 30,
      scenario_id: 5,
      mood_id: 2,
      prompt:
        "Write an email to your friend Jade. Address a repeated behaviour that's been causing tension and express what you need from the friendship.",
    },
  ])
}

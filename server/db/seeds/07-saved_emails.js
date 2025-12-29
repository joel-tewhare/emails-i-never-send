export async function seed(knex) {
  await knex('saved_emails').insert([
    {
      id: 1,
      user_id: 1,
      prompt_id: 2, // Work, Positive (manager Priya)
      content:
        'Hi Priya,\n\nI wanted to thank you for giving me the chance to take on the new reporting task this month. It pushed me outside my comfort zone, but I learned a lot about structuring data clearly. I really appreciated your trust and guidance throughout the process.\n\nThanks again,\nRiver',
      created_at: '2025-01-14T10:32:00.000Z',
    },
    {
      id: 2,
      user_id: 1,
      prompt_id: 11, // Relationships, Negative (friend Noah)
      content:
        "Hey Noah,\n\nI've been thinking about our conversation the other night and wanted to be honest with you. I felt hurt by something you said, and I wasn’t sure how to bring it up in the moment. I value our friendship a lot, so I wanted to check in and understand what you meant.\n\nTalk soon,\nRiver",
      created_at: '2025-02-03T18:20:00.000Z',
    },
    {
      id: 3,
      user_id: 1,
      prompt_id: 14, // Customer Service, Positive (client Jordan)
      content:
        'Hi Jordan,\n\nThank you for taking the time to send through your feedback. It was really helpful, especially your comments about improving clarity in our weekly summaries. Our team is putting together a revised format based on your suggestions, and I think it will make a noticeable difference.\n\nAppreciate your insight,\nRiver',
      created_at: '2025-02-18T09:10:00.000Z',
    },
    {
      id: 4,
      user_id: 1,
      prompt_id: 23, // Emotional Honesty, Negative (partner Miles)
      content:
        'Hi Miles,\n\nI’ve been trying to find the right way to talk about something that’s been on my mind. I’ve been feeling overwhelmed recently, and I think it’s affected how present I’ve been. I wanted to be honest about that instead of keeping it bottled up.\n\nThanks for listening,\nRiver',
      created_at: '2025-03-02T14:55:00.000Z',
    },
  ])
}

import { pgTable, serial,text,varchar } from "drizzle-orm/pg-core"
export const MockInterview = pgTable('MockInterview',{
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition : varchar('jobPosition').notNull(),
    jsonDesc : varchar('jsonDesc').notNull(),
    jsonExperience : varchar('jsonExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt : varchar('createdAt'),
    mockId : varchar('mockId').notNull()
});

export const UserAnsTable = pgTable('userAnsTable',{
    id_user: serial('id_user').notNull(),
    mockIdRef:varchar('mockId').notNull(),
    question : varchar('question').notNull(),
    correctAns: varchar('correctAns'),
    userAns: varchar('userAns'),
    feedback: text('Feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt : varchar('createdAt')

});

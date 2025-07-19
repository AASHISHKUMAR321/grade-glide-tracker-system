import { mysqlTable, varchar, int, timestamp } from 'drizzle-orm/mysql-core';
import { relations, InferModel } from 'drizzle-orm';

// Subject table schema
export const subjects = mysqlTable('subjects', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Competency table schema
export const competencies = mysqlTable('competencies', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  subjectId: varchar('subject_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  marks: int('marks').notNull().default(0),
  description: varchar('description', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Define relations between subjects and competencies
export const subjectsRelations = relations(subjects, ({ many }: { many: any }) => ({
  competencies: many(competencies),
}));

export const competenciesRelations = relations(competencies, ({ one }: { one: any }) => ({
  subject: one(subjects, {
    fields: [competencies.subjectId],
    references: [subjects.id],
  }),
}));

// Define types for our models
export type Subject = InferModel<typeof subjects>;
export type Competency = InferModel<typeof competencies>;

export type NewSubject = InferModel<typeof subjects, 'insert'>;
export type NewCompetency = InferModel<typeof competencies, 'insert'>;

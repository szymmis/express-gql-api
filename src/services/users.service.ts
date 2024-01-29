import { and, asc, desc, eq, gte, like, lte } from "drizzle-orm";

import db from "../db";
import { users } from "../db/schema";
import {
  CreateUserInput,
  GetUsersFilterInput,
  GetUsersSortInput,
  GetUsersSortKey,
  SortOrder,
  UpdateUserInput,
} from "../graphql/generated/graphql";

export class UsersService {
  static async getAll({
    filter,
    sort,
  }: {
    filter?: GetUsersFilterInput | null;
    sort?: GetUsersSortInput | null;
  }) {
    let query = db.select().from(users).$dynamic();

    if (filter) {
      const { department, salary_from, salary_to, title } = filter;

      query = query.where(
        and(
          salary_from ? gte(users.salary, salary_from) : undefined,
          salary_to ? lte(users.salary, salary_to) : undefined,
          title ? like(users.title, `%${title}%`) : undefined,
          department ? like(users.department, `%${department}%`) : undefined
        )
      );
    }

    if (sort) {
      const column =
        sort.by === GetUsersSortKey.JoinedAt ? users.joined_at : users.salary;

      query = query.orderBy(
        sort.order === SortOrder.Asc ? asc(column) : desc(column)
      );
    }

    return query;
  }

  static async getById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  static async create(data: CreateUserInput) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  static async update(id: string, data: UpdateUserInput) {
    try {
      const [u] = await db
        .update(users)
        .set(objectStripUndefineds(data))
        .where(eq(users.id, id))
        .returning();

      return u;
    } catch (e) {
      return null;
    }
  }

  static async delete(id: string) {
    const [u] = await db.delete(users).where(eq(users.id, id)).returning();
    return u;
  }
}

function objectStripUndefineds(obj: object) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value));
}

import { gql } from "apollo-server-express";
import fs from "fs";
import request from "supertest-graphql";
import { afterAll,beforeAll, describe, expect, test } from "vitest";

import app from "../app";
import db from "../db";
import { users } from "../db/schema";

describe("Users", () => {
  beforeAll(async () => {
    await db.insert(users).values([
      {
        first_name: "John",
        last_name: "Doe",
        date_of_birth: "1990-01-01",
        joined_at: "2018-01-01",
        title: "CTO",
        department: "Management",
        salary: 1000,
      },
      {
        first_name: "Tom",
        last_name: "Hanks",
        date_of_birth: "1990-01-01",
        joined_at: "2021-01-01",
        title: "Frontend Developer",
        department: "IT",
        salary: 1200,
      },
      {
        first_name: "Hans",
        last_name: "Zimmer",
        date_of_birth: "1990-01-01",
        joined_at: "2020-01-01",
        title: "Backend Developer",
        department: "IT",
        salary: 900,
      },
    ]);
  });

  describe("Queries", () => {
    test("Get all users", async () => {
      const { data } = await request<{ getUsers: unknown }>(app)
        .query(
          gql`
            query {
              getUsers {
                id
                first_name
                last_name
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.getUsers).toEqual([
        { id: "1", first_name: "John", last_name: "Doe" },
        { id: "2", first_name: "Tom", last_name: "Hanks" },
        { id: "3", first_name: "Hans", last_name: "Zimmer" },
      ]);
    });

    test("Get user with id=2", async () => {
      const { data } = await request<{ getUser: unknown }>(app)
        .query(
          gql`
            query {
              getUser(id: "2") {
                id
                first_name
                last_name
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.getUser).toEqual({
        id: "2",
        first_name: "Tom",
        last_name: "Hanks",
      });
    });

    test("Sort users by salary ascending", async () => {
      const { data } = await request<{ getUsers: unknown }>(app)
        .query(
          gql`
            query {
              getUsers(sort: { by: SALARY, order: ASC }) {
                id
                first_name
                last_name
                salary
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.getUsers).toEqual([
        { id: "3", first_name: "Hans", last_name: "Zimmer", salary: 900 },
        { id: "1", first_name: "John", last_name: "Doe", salary: 1000 },
        { id: "2", first_name: "Tom", last_name: "Hanks", salary: 1200 },
      ]);
    });

    test("Sort users by salary descending", async () => {
      const { data } = await request<{ getUsers: unknown }>(app)
        .query(
          gql`
            query {
              getUsers(sort: { by: SALARY, order: DESC }) {
                id
                first_name
                last_name
                salary
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.getUsers).toEqual([
        { id: "2", first_name: "Tom", last_name: "Hanks", salary: 1200 },
        { id: "1", first_name: "John", last_name: "Doe", salary: 1000 },
        { id: "3", first_name: "Hans", last_name: "Zimmer", salary: 900 },
      ]);
    });

    test("Sort users by joined_at ascending", async () => {
      const { data } = await request<{ getUsers: unknown }>(app)
        .query(
          gql`
            query {
              getUsers(sort: { by: JOINED_AT, order: ASC }) {
                id
                first_name
                last_name
                joined_at
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.getUsers).toEqual([
        {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          joined_at: "2018-01-01",
        },
        {
          id: "3",
          first_name: "Hans",
          last_name: "Zimmer",
          joined_at: "2020-01-01",
        },
        {
          id: "2",
          first_name: "Tom",
          last_name: "Hanks",
          joined_at: "2021-01-01",
        },
      ]);
    });

    test("Sort users by joined_at descending", async () => {
      const { data } = await request<{ getUsers: unknown }>(app)
        .query(
          gql`
            query {
              getUsers(sort: { by: JOINED_AT, order: DESC }) {
                id
                first_name
                last_name
                joined_at
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.getUsers).toEqual([
        {
          id: "2",
          first_name: "Tom",
          last_name: "Hanks",
          joined_at: "2021-01-01",
        },
        {
          id: "3",
          first_name: "Hans",
          last_name: "Zimmer",
          joined_at: "2020-01-01",
        },
        {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          joined_at: "2018-01-01",
        },
      ]);
    });

    test("Filter users by title", async () => {
      const { data } = await request<{ getUsers: unknown }>(app)
        .query(
          gql`
            query {
              getUsers(filter: { title: "Developer" }) {
                id
                first_name
                last_name
                title
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.getUsers).toEqual([
        {
          id: "2",
          first_name: "Tom",
          last_name: "Hanks",
          title: "Frontend Developer",
        },
        {
          id: "3",
          first_name: "Hans",
          last_name: "Zimmer",
          title: "Backend Developer",
        },
      ]);
    });

    test("Filter users by salary range", async () => {
      const { data } = await request<{ getUsers: unknown }>(app)
        .query(
          gql`
            query {
              getUsers(filter: { salary_from: 950, salary_to: 1050 }) {
                id
                first_name
                last_name
                salary
                department
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.getUsers).toEqual([
        {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          department: "Management",
          salary: 1000,
        },
      ]);
    });

    test("Filter users by department and sort by salary descending", async () => {
      const { data } = await request<{ getUsers: unknown }>(app)
        .query(
          gql`
            query {
              getUsers(
                filter: { department: "IT" }
                sort: { by: SALARY, order: DESC }
              ) {
                id
                first_name
                last_name
                salary
                department
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.getUsers).toEqual([
        {
          id: "2",
          first_name: "Tom",
          last_name: "Hanks",
          salary: 1200,
          department: "IT",
        },
        {
          id: "3",
          first_name: "Hans",
          last_name: "Zimmer",
          salary: 900,
          department: "IT",
        },
      ]);
    });
  });

  describe("Mutations", () => {
    test("Create a new user", async () => {
      const { data } = await request<{ createUser: unknown }>(app)
        .query(
          gql`
            mutation {
              createUser(
                data: {
                  first_name: "Test"
                  last_name: "Test"
                  date_of_birth: "1990-01-01"
                  joined_at: "2021-01-01"
                  title: "Mr"
                  department: "IT"
                  salary: 1000
                }
              ) {
                id
                first_name
                last_name
                date_of_birth
                joined_at
                title
                department
                salary
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.createUser).toEqual({
        id: "4",
        first_name: "Test",
        last_name: "Test",
        date_of_birth: "1990-01-01",
        joined_at: "2021-01-01",
        title: "Mr",
        department: "IT",
        salary: 1000,
      });
    });

    test("Update user", async () => {
      const { data } = await request<{ updateUser: unknown }>(app)
        .query(
          gql`
            mutation {
              updateUser(
                id: "4"
                data: { first_name: "Johny", last_name: "Test" }
              ) {
                id
                first_name
                last_name
                date_of_birth
                joined_at
                title
                department
                salary
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.updateUser).toEqual({
        id: "4",
        first_name: "Johny",
        last_name: "Test",
        date_of_birth: "1990-01-01",
        joined_at: "2021-01-01",
        title: "Mr",
        department: "IT",
        salary: 1000,
      });
    });

    test("Delete user", async () => {
      const { data } = await request<{ deleteUser: unknown }>(app)
        .query(
          gql`
            mutation {
              deleteUser(id: "4") {
                id
                first_name
                last_name
              }
            }
          `
        )
        .expectNoErrors();

      expect(data?.deleteUser).toEqual({
        id: "4",
        first_name: "Johny",
        last_name: "Test",
      });

      const { data: data2 } = await request<{ deleteUser: unknown }>(app)
        .query(
          gql`
            mutation {
              deleteUser(id: "4") {
                id
                first_name
                last_name
              }
            }
          `
        )
        .expectNoErrors();

      expect(data2?.deleteUser).toBeNull();
    });
  });

  afterAll(async () => {
    const db_path = process.env.DB_PATH!;

    if (db_path) {
      if (fs.existsSync(db_path)) {
        fs.rmSync(process.env.DB_PATH!);
      }
    }
  });
});

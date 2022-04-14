import { expect, test, describe, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

import { buildApp } from 'src/app'

describe('fastify example integration', () => {
  const app = buildApp()

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('sends GraphiQL', async () => {
    const response = await request(app.server).get('/graphql').set({
      accept: 'text/html',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.text).toContain('<title>Yoga GraphiQL</title>')
  })

  test('handles query operation via POST', async () => {
    const response = await request(app.server)
      .post('/graphql')
      .set({ 'content-type': 'application/json' })
      .send(
        JSON.stringify({
          query: /* GraphQL */ `
            query {
              __typename
            }
          `,
        }),
      )

    expect(response.statusCode).toEqual(200)
    expect(response.body).toStrictEqual({
      data: {
        __typename: 'Query',
      },
    })
  })

  test('handles query operation via GET', async () => {
    const response = await request(app.server)
      .get('/graphql')
      .query({
        query: /* GraphQL */ `
          query {
            __typename
          }
        `,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toStrictEqual({
      data: {
        __typename: 'Query',
      },
    })
  })

  test('handles subscription operations via GET', async () => {
    const response = await request(app.server)
      .get('/graphql')
      .set({ accept: 'text/event-stream' })
      .query({
        query: /* GraphQL */ `
          query TeamsQuery {
            teams(first: 10, after: null) {
              edges {
                node {
                  city
                  name
                }
              }
            }
          }
        `,
      })
    expect(response.statusCode).toEqual(200)
    expect(response.text).toMatchInlineSnapshot(
      '"{\\"data\\":{\\"teams\\":{\\"edges\\":[{\\"node\\":{\\"city\\":\\"Atlanta\\",\\"name\\":\\"Hawks\\"}},{\\"node\\":{\\"city\\":\\"Boston\\",\\"name\\":\\"Celtics\\"}},{\\"node\\":{\\"city\\":\\"Brooklyn\\",\\"name\\":\\"Nets\\"}},{\\"node\\":{\\"city\\":\\"Charlotte\\",\\"name\\":\\"Hornets\\"}},{\\"node\\":{\\"city\\":\\"Chicago\\",\\"name\\":\\"Bulls\\"}},{\\"node\\":{\\"city\\":\\"Cleveland\\",\\"name\\":\\"Cavaliers\\"}},{\\"node\\":{\\"city\\":\\"Dallas\\",\\"name\\":\\"Mavericks\\"}},{\\"node\\":{\\"city\\":\\"Denver\\",\\"name\\":\\"Nuggets\\"}},{\\"node\\":{\\"city\\":\\"Detroit\\",\\"name\\":\\"Pistons\\"}},{\\"node\\":{\\"city\\":\\"Golden State\\",\\"name\\":\\"Warriors\\"}}]}}}"',
    )
  })
  test('handles subscription operations via POST', async () => {
    const response = await request(app.server)
      .post('/graphql')
      .set({
        accept: 'text/event-stream',
        'content-type': 'application/json',
      })
      .send({
        query: /* GraphQL */ `
          query TeamsQuery {
            teams(first: 10, after: null) {
              edges {
                node {
                  city
                  name
                }
              }
            }
          }
        `,
      })
    expect(response.statusCode).toEqual(200)
    expect(response.text).toMatchInlineSnapshot(
      '"{\\"data\\":{\\"teams\\":{\\"edges\\":[{\\"node\\":{\\"city\\":\\"Atlanta\\",\\"name\\":\\"Hawks\\"}},{\\"node\\":{\\"city\\":\\"Boston\\",\\"name\\":\\"Celtics\\"}},{\\"node\\":{\\"city\\":\\"Brooklyn\\",\\"name\\":\\"Nets\\"}},{\\"node\\":{\\"city\\":\\"Charlotte\\",\\"name\\":\\"Hornets\\"}},{\\"node\\":{\\"city\\":\\"Chicago\\",\\"name\\":\\"Bulls\\"}},{\\"node\\":{\\"city\\":\\"Cleveland\\",\\"name\\":\\"Cavaliers\\"}},{\\"node\\":{\\"city\\":\\"Dallas\\",\\"name\\":\\"Mavericks\\"}},{\\"node\\":{\\"city\\":\\"Denver\\",\\"name\\":\\"Nuggets\\"}},{\\"node\\":{\\"city\\":\\"Detroit\\",\\"name\\":\\"Pistons\\"}},{\\"node\\":{\\"city\\":\\"Golden State\\",\\"name\\":\\"Warriors\\"}}]}}}"',
    )
  })
})

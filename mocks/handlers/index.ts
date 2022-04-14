import { graphql } from 'msw'

export const graphqlHandlers = [
  graphql.query('TeamsQuery', (req, res, ctx) =>
    res(
      ctx.data({
        teams: {
          edges: [
            {
              node: {
                city: 'Atlanta',
                name: 'Hawks',
              },
            },
            {
              node: {
                city: 'Boston',
                name: 'Celtics',
              },
            },
            {
              node: {
                city: 'Brooklyn',
                name: 'Nets',
              },
            },
            {
              node: {
                city: 'Charlotte',
                name: 'Hornets',
              },
            },
            {
              node: {
                city: 'Chicago',
                name: 'Bulls',
              },
            },
          ],
        },
      }),
    ),
  ),
]

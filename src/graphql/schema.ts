import SchemaBuilder from '@pothos/core'
import { PrismaClient } from '@prisma/client'
import PrismaPlugin from '@pothos/plugin-prisma'
import RelayPlugin from '@pothos/plugin-relay'
import { DateTimeResolver } from 'graphql-scalars'

import type PrismaTypes from '@pothos/plugin-prisma/generated'

const prisma = new PrismaClient()

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Scalars: {
    Date: {
      Input: Date
      Output: Date
    }
  }
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relayOptions: {},
  prisma: {
    client: prisma,
  },
})

builder.addScalarType('Date', DateTimeResolver, {})

builder.prismaNode('Team', {
  findUnique: (id) => ({ id }),
  id: { resolve: (team) => team.id },
  fields: (t) => ({
    name: t.exposeString('name'),
    handle: t.exposeString('handle'),
    city: t.exposeString('city'),
    slug: t.exposeString('slug'),
    abbreviation: t.exposeString('abbreviation'),
    conference: t.exposeString('conference'),
    division: t.exposeString('division'),
    established: t.exposeString('established'),
    wins: t.exposeInt('wins', { nullable: true }),
    losses: t.exposeInt('losses', { nullable: true }),
    winPercentage: t.exposeFloat('winPercentage', { nullable: true }),
    players: t.relation('players'),
    coaches: t.relation('coaches'),
    colorScheme: t.relation('colorScheme'),
  }),
})

builder.prismaNode('Coach', {
  findUnique: (id) => ({ id }),
  id: { resolve: (coach) => coach.id },
  fields: (t) => ({
    name: t.exposeString('name'),
    handle: t.exposeString('handle'),
    type: t.exposeString('type'),
    isAssistant: t.exposeString('isAssistant'),
    team: t.relation('team'),
  }),
})

builder.prismaNode('Player', {
  findUnique: (id) => ({ id }),
  id: { resolve: (player) => player.id },
  fields: (t) => ({
    name: t.exposeString('name'),
    handle: t.exposeString('handle'),
    slug: t.exposeString('slug'),
    height: t.exposeString('height'),
    weight: t.exposeString('weight'),
    number: t.exposeString('number', { nullable: true }),
    position: t.exposeString('position', { nullable: true }),
    team: t.relation('team', { nullable: true }),
  }),
})

builder.prismaNode('ColorScheme', {
  findUnique: (id) => ({ id }),
  id: { resolve: (colorScheme) => colorScheme.id },
  fields: (t) => ({
    primary: t.exposeString('primary'),
    secondary: t.exposeString('secondary'),
    teams: t.relation('teams', { nullable: true }),
  }),
})

builder.queryType({
  fields: (t) => ({
    team: t.prismaField({
      type: 'Team',
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (query, _root, args) =>
        prisma?.team.findUnique({
          ...query,
          where: { id: String(args.id) },
        }),
    }),
    teams: t.prismaConnection({
      type: 'Team',
      cursor: 'id',
      resolve: (query) =>
        prisma?.team.findMany({
          ...query,
        }) ?? [],
    }),
    coach: t.prismaField({
      type: 'Coach',
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (query, _root, args) =>
        prisma?.coach.findUnique({
          ...query,
          where: { id: String(args.id) },
        }),
    }),
    coaches: t.prismaConnection({
      type: 'Coach',
      cursor: 'id',
      resolve: (query) =>
        prisma?.coach.findMany({
          ...query,
        }) ?? [],
    }),
    player: t.prismaField({
      type: 'Player',
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (query, _root, args) =>
        prisma?.player.findUnique({
          ...query,
          where: { id: String(args.id) },
        }),
    }),
    players: t.prismaConnection({
      type: 'Player',
      cursor: 'id',
      resolve: (query) =>
        prisma?.player.findMany({
          ...query,
        }) ?? [],
    }),
  }),
})

export const schema = builder.toSchema({})

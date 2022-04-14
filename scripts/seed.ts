import task from 'tasuku'

import { PrismaClient } from '@prisma/client'

import coaches from 'prisma/data/backups/documents/coaches.json'
import players from 'prisma/data/backups/documents/players.json'
import colorSchemes from 'prisma/data/team-colors.json'
import teams from 'prisma/data/backups/documents/teams.json'

const db = new PrismaClient()

async function seedCoachData() {
  for (const coach of coaches) {
    await db.coach.create({
      data: {
        handle: coach.handle,
        name: coach.name,
        type: coach.type,
        isAssistant: coach.isAssistant,
      },
    })
  }
}

async function seedPlayerData() {
  for (const player of players) {
    await db.player.create({
      data: {
        handle: player.handle,
        name: player.name,
        slug: player.slug,
        height: player.height,
        weight: player.weight,
        number: player.number,
        position: player.position,
      },
    })
  }
}

async function seedTeamData() {
  for (const team of teams) {
    const playerIds = players
      .filter((player) => player.teamId === team.handle)
      .map((player) => ({ handle: player.id }))

    const coachIds = coaches
      .filter((coach) => coach.teamId === team.handle)
      .map((coach) => ({ handle: coach.id }))

    const colors = colorSchemes.find((scheme) => scheme.handle === team.handle)
    const colorScheme = await db.colorScheme.findUnique({
      where: {
        ColorScheme_primary_secondary_key: {
          primary: colors?.primary as string,
          secondary: colors?.secondary as string,
        },
      },
    })

    await db.team.create({
      data: {
        handle: team.handle,
        name: team.name,
        slug: team.slug,
        city: team.city,
        established: team.established,
        abbreviation: team.abbreviation,
        wins: team.wins,
        losses: team.losses,
        winPercentage: team.winPercentage,
        conference: team.conference,
        division: team.division,
        players: {
          connect: playerIds,
        },
        coaches: {
          connect: coachIds,
        },
        colorScheme: {
          connect: { id: colorScheme?.id },
        },
      },
    })
  }
}

async function seedColorSchemesData() {
  await db.colorScheme.createMany({
    data: colorSchemes.map((colorScheme) => ({
      primary: colorScheme.primary,
      secondary: colorScheme.secondary,
    })),
    skipDuplicates: true,
  })
}

async function runSeedTasks() {
  await task('Seed tasks', async ({ task }) => {
    await task.group((task) => [
      task('Seeding players', async () => await seedPlayerData()),
      task('Seeding coaches', async () => await seedCoachData()),
      task('Seeding color schemes', async () => await seedColorSchemesData()),
      task('Seeding teams', async () => await seedTeamData()),
    ])
  })
}

async function main() {
  try {
    await runSeedTasks()
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
    process.exit(0)
  })

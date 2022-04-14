#!/usr/bin/env node

import { execa } from 'execa'

async function main() {
  await execa('yarn', ['prisma', 'generate'], {
    stdio: 'inherit',
  })

  await execa('esno', ['src/index.ts'], {
    stdio: 'inherit',
  })
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })

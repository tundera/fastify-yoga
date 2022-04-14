#!/usr/bin/env node

import { execa } from 'execa'

async function main() {
  await execa('yarn', ['prisma', 'migrate', 'reset'], {
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

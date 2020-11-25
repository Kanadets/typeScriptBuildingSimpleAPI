import { DenonConfig } from 'https://deno.land/x/denon/mod.ts'

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: 'deno run deno.ts',
      desc: 'run my deno.ts file',
      allow: ['plugin', 'net', 'read', 'write', 'env'],
      unstable: true,
    },
  },
}

export default config

#!/usr/bin/env node

import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import { app, AppConf } from './app'

const argv = yargs(hideBin(process.argv))
      .usage('Usage: $0 <command> [options]')
      .command('serve', 'listen for http requests')
      .example('$0 serve -p 8000', 'listen on port 8000')
      .options({
        port: { alias: 'p', describe: 'api port to listen', default: 8000, number: true },
        host: { alias: 'h', describe: 'ip address to bind', default: 'localhost' },
        prometheus: { alias: 'r', describe: 'prometheus endpoint', default: 'localhost:9090' },
        'prom-path': { alias: 'o', describe: 'prometheus API path', default: '/api/v1' },
      })
      .argv

const appConf: AppConf = {
  server: {
    host: argv.host,
    port: argv.port,
  },
  prometheus: {
    path: argv["prom-path"],
    url: argv.prometheus
  }
}

app(appConf)

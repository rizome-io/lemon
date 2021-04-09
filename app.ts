import { listen, ServerArgs } from './server'
import { buildMetrics, PromConf } from './metrics'
import { requestListener } from './routes'

export type AppConf = {
  server: ServerArgs,
  prometheus: PromConf,
}
export const app = (conf: AppConf) => {

  listen({
    ...conf.server,
    requestListener: requestListener(buildMetrics(conf.prometheus))

  })

  }

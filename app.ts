import { listen, ServerArgs, ServerConf } from './server'
import { PromConf, prometheus } from './metrics'
import { requestListener } from './routes'

export type AppConf = {
  server: ServerArgs,
  prometheus: PromConf,
}
export const app = (conf: AppConf) => {

  listen({
    ...conf.server,
    requestListener: requestListener(prometheus(conf.prometheus))
  })

  }

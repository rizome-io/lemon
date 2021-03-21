import { createServer, RequestListener } from 'http'

export type ServerArgs = {
  host: string,
  port: number,
}

export type ServerConf = ServerArgs & {
  requestListener: RequestListener,
}

export const listen = ({host, port, requestListener}: ServerConf) => {
  const server = createServer(requestListener)

  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  })

}

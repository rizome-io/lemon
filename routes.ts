import { MetricPromises } from './metrics'

type IncomingMessage = import('http').IncomingMessage

const setCors = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
      res.writeHead(200);
      res.end();
      return;
    }
}

export const requestListener = (mp: MetricPromises) =>
  (req: IncomingMessage, res) => {

    setCors(req, res)

    const [ , firstPath ] = req.url.split('/') || []
    const [ , handler ] = mp.find(([key]) => key == firstPath) || []
    if (!handler) {
      res.writeHead(404);
      res.end(JSON.stringify({error:"Resource not found"}));
      return
    }

    handler().then(serializeResponse(res))
};

const serializeResponse = (res) => data => {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(JSON.stringify(data));

}

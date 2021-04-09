import {parse as parseUrl} from 'url'
import {parse as parseQuery} from 'querystring'

import { MetricPromises } from './metrics'

type IncomingMessage = import('http').IncomingMessage

const allowCors = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
}

export const requestListener = (mp: MetricPromises) =>
  (req: IncomingMessage, res) => {

    allowCors(req, res)

    if ( req.method === 'OPTIONS' ) {
      res.writeHead(200);
      res.end();
      return;
    }

    const reqUrl = parseUrl(req.url)
    const range = parseTimeRange(reqUrl.query) || defaultRange()

    const metricName = reqUrl.pathname.slice(1)
    const [ , handler ] = mp.find(([key]) => key == metricName) || []
    if (!handler) {
      res.writeHead(404);
      res.end(JSON.stringify({error:"Resource not found"}));
      return
    }

    handler(range).then(serializeResponse(res))
};

const serializeResponse = (res) => data => {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(JSON.stringify(data));

}

const parseTimeRange = (query: string) => {
  const { start, end, step } = parseQuery(query)
  if (typeof start != 'string'
     || typeof end != 'string'
     || typeof step != 'string') return null

  const range = [start, end, step].map(a => parseInt(a))
  const valid = range.every(r => !isNaN(r))
  if (!valid) return null
  return range as [number, number, number]
  }

const defaultRange = () => {
    const h1 = 60*60
    return [
      new Date().getTime() - 24 * h1 * 1000,
      new Date(),
      6 * h1,
    ] as [number, Date, number]
  }

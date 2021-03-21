import { PromQuery } from './metrics'

export const requestListener = ({epoch, peers}: PromQuery) =>
  (req, res) => {
  res.setHeader("Content-Type", "application/json");

  switch (req.url) {
    case "/epoch":
      epoch().then(serializeResponse(res))
      break
    case "/peers":
      peers().then(serializeResponse(res))
      break
    default:
      res.writeHead(404);
      res.end(JSON.stringify({error:"Resource not found"}));

  }
};

const serializeResponse = (res) => data => {
        res.writeHead(200);
        res.end(JSON.stringify(data));

}

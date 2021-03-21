import { PrometheusDriver } from 'prometheus-query'

export type PromConf = {
  url: string,
  path: string,
}

type Query = () => Promise<void | any[][]>
export type PromQuery = {
  epoch: Query,
  peers: Query,
}

export const prometheus = ({url, path}: PromConf) => {
  const pd = new PrometheusDriver({
    endpoint: url,
    baseURL: path,
  });

  // TODO: no-any
  const getLabel = a => a.labels.job

  const epoch = () => {
    return pd.instantQuery('cardano_node_metrics_epoch_int')
      .then((res) => res.result.map(r => [getLabel(r.metric), r.value ]))
      .catch(console.log)
  }

  const peers = () => {
    const q = 'cardano_node_metrics_connectedPeers_int'
    const start =new Date().getTime() - 24 * 60 * 60 * 1000
    const end = new Date()
    const step = 6 * 60 * 60

    return pd.rangeQuery(q, start, end, step)
      .then((res) =>
        res.result.map(r => [getLabel(r.metric), r.values])
           )
      .catch(console.log)
  }

  return {
    epoch,
    peers,
  }
}

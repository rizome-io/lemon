import { PrometheusDriver, QueryResult } from 'prometheus-query'

export type PromConf = {
  url: string,
  path: string,
}

type Query = () => Promise<void | any[][]>
export type PromQuery = {
  epoch: Query,
  peers: Query,
  processor: Query,
}

type LabeledRes = {
  labels: {
    job: string
  }
}
const isLabeledRes = ( a: unknown): a is LabeledRes =>
  (!!a
    || typeof a == 'object'
    || ( 'labels' in (a as LabeledRes) ) || typeof (a as LabeledRes).labels == 'object'
    || ( 'job' in (a as LabeledRes).labels) || typeof (a as LabeledRes).labels.job == 'string')

  const getLabel = ( a: unknown ) => {
    if (!isLabeledRes(a)) return 'unknown'
    return a.labels.job
  }
  const processQueryRes = (res: QueryResult): MetricRes =>
        res.result.map(r => [getLabel(r.metric), r.values as unknown])

export const enum Metric {
  peers = 'peers',
  proc = 'proc',
  mem = 'mem',
  netin = 'netin',
  netout = 'netout'
}

type MetKey = {
  peers: 'peers',
  proc: 'proc',
  mem: 'mem',
  netin: 'netin',
  netout: 'netout'
}

type MetricKey = keyof MetKey

const ranges: [MetricKey, string][] = [
  [ Metric.peers,   'cardano_node_metrics_connectedPeers_int' ],
  [ Metric.proc,    '100 - ( avg by (job) (rate(node_cpu_seconds_total{mode="idle"}[1h])) * 100)' ],
  [ Metric.mem,     'rts_gc_current_bytes_used/(1024*1024)' ],
  [ Metric.netin,   'avg by (job) (rate(node_network_receive_bytes_total[6h])*8)' ],
  [ Metric.netout,  'avg by (job) (rate(node_network_transmit_bytes_total[6h])*8)' ],
]

type RangeParam = [
  start: Date | number,
  end: Date | number,
  step: number,
]

const mons = (pd: PrometheusDriver) => {
  const rangeQ = (q: string, r: RangeParam) =>
    pd.rangeQuery(q, ...r)
      .then(processQueryRes)
      .catch(e => {
        console.error(e)
        return [['', null]] as MetricRes
      }
      )

  return ranges.map(( [qname, query] ) => {
    const queryAct = (range: RangeParam) => rangeQ(query, range)
    return [qname, queryAct] as const
  })
}

type MetricLabel = string
type MetricRes = [MetricLabel, unknown][]
export type MetricPromises = Array<readonly [MetricKey, (r: RangeParam) => Promise<MetricRes>]>
export const buildMetrics = ({url, path}: PromConf): MetricPromises => {
  const pd = new PrometheusDriver({
    endpoint: url,
    baseURL: path,
  })
  return mons(pd)
}

export default class EnsemblePartialResult {
  constructor (d) {
    this.info = new EnsemblePartialResultInfo(d.info)
    this.earlyTermination = d.earlyTermination
    this.metrics = new EnsemblePartialResultMetrics(d.metrics)
    this.centroids = d.centroids
    this.labels = d.labels
    this.partitions = d.partitions
    this.runsStatus = new EnsemblePartialResultRunsStatus(d.runsStatus)
    this.taskId = d.taskId

    Object.keys(d).forEach(k => {
      if (this[k] !== undefined) return
      this['_' + k] = d[k]
    })
  }
}
class EnsemblePartialResultInfo {
  constructor (d) {
    this.id = d.id
    this.iteration = d.iteration
    this.seed = d.seed
    this.last = d.last
    this.completed = d.completed
    this.cost = d.cost
    this.bestRun = d.bestRun
    this.inertia = d.inertia

    Object.keys(d).forEach(k => {
      if (this[k] !== undefined) return
      this['_' + k] = d[k]
    })
  }
}

class EnsemblePartialResultMetrics {
  constructor (d) {
    this.labelsValidationMetrics = d.labelsValidationMetrics
    this.labelsComparisonMetrics = d.labelsComparisonMetrics
    this.labelsProgressionMetrics = d.labelsProgressionMetrics
    this.partitionsValidationMetrics = d.partitionsValidationMetrics
    this.partitionsComparisonMetrics = d.partitionsComparisonMetrics
    this.partitionsProgressionMetrics = d.partitionsProgressionMetrics

    Object.keys(d).forEach(k => {
      if (this[k] !== undefined) return
      this['_' + k] = d[k]
    })
  }
}

class EnsemblePartialResultRunsStatus {
  constructor (d) {
    this.runIteration = d.runIteration
    this.runCompleted = d.runCompleted
    this.runsKilled = d.runsKilled

    Object.keys(d).forEach(k => {
      if (this[k] !== undefined) return
      this['_' + k] = d[k]
    })
  }
}

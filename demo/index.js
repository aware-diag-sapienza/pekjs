import { PekClient, EarlyTermination } from '../src'
// import { PekClient, EarlyTermination } from 'pekjs' // uncomment this line to use the npm package

async function main () {
  // connect to the server
  const client = await PekClient('http://localhost:3347')

  console.log(client)

  // list of datsets
  console.log(client.getDatasetNames())

  // dataset object
  const dataset = client.getDataset('Wine')
  console.log(dataset)

  // dataset methods
  console.log('features', await dataset.getFeatures())
  console.log('original', (await dataset.getOriginalData()))
  console.log('scaled', (await dataset.getScaledData()))

  // proiezioni in [-1, 1]
  console.log('isomap', (await dataset.getISOMAP()))
  console.log('mds', (await dataset.getMDS()))
  console.log('pca', (await dataset.getPCA()))
  console.log('tsne', (await dataset.getTSNE()))
  console.log('umap', (await dataset.getUMAP()))

  // creo un task
  const task = await client.createTask()
  console.log('task', task)

  // setto i vari argomenti
  task
    .onPartialResult((result) => { console.log(result) }) // callback for partial results
    .data('Wine') // dataset name
    .n_clusters(3)
    .n_runs(10)
    .init('k-means++') // Possible options: 'random' or 'k-means++'. Accepts also an array of length n_runs which must contain only possible options.
    .max_iter(300) // Maximum iterations per run, default 300. Can be a list of length n_runs, or a single value that is valid for all the runs.
    .tol(1e-4) // kmeans tolerance (float) default 1e-4. Can be a list of length n_runs, or a single value that is valid for all the runs.
    .random_state(0) // seed for replication. Integer or null to be random.
    .freq(null) // min frequency in seconds (float) between to partial results. Default none, meaning 0.
    .ets([EarlyTermination.DefaultEarlyTerminator.FAST_KILL]) // list of early terminators
    .labelsValidationMetrics('ALL') // list of validation metrics to validate the labels. ALL to use all the available metrics.
    .labelsComparisonMetrics('ALL') // list of comparison metrics to compare the labels of the current itaration with the labels of the last iteration
    .labelsProgressionMetrics('ALL') // list of progression metrics to compare the labels of the current itaration with the labels of the previous iterations
    .partitionsValidationMetrics('ALL') // list of valiadation metrics to validate the paritions
    .partitionsComparisonMetrics('ALL') // list of comparison metrics to compare the partitions of the current itaration with the partitions of the last iteration
    .partitionsProgressionMetrics('ALL') // list of progression metrics to compare the partitions of the current itaration with the paritions of the previous iterations
    .returnPartitions(false) // return the partitions in the partial results

  // faccio partire il clustering
  task.start()
}

main()

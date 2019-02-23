/***
 * Sorts and remap scheduled jobs
 * @param schedule {Array<{startingDay:string,duration:number}>}
 * @returns {Array<{start:number,end:number,weight:number}>}
 */
function prepareSchedule (schedule) {
  return schedule
    .map(({startingDay, duration}, index) => {
      if (typeof duration !== 'number' || isNaN(duration) || duration <= 0) {
        throw new Error(`Invalid duration '${startingDay}' at ${index}`)
      }
      const start = new Date(startingDay).getTime()
      if (isNaN(start)) {
        throw new Error(`Invalid date '${startingDay}' at ${index}`)
      }
      return {
        start,
        end: start + duration * 86400000 /* 1 day in ms*/,
        weight: duration /* Use duration as weight for weighted algorithm*/
      }
    })
    .sort((job1, job2) => job1.end - job2.end) //Sort ascending by end time
}

/***
 * Plan jobs using simple greedy planing
 * @param schedule {Array<{start:number,end:number,weight:number}>}
 * @returns {number}
 */
function planSimple (schedule) {
  let count = 0 // 1 because we have added first to the schedule already
  let lastJob = schedule[0]
  if (lastJob) {
    count++
  }
  for (let index = 1; index < schedule.length; index++) {
    const job = schedule[index]
    if (job.start >= lastJob.end) {
      lastJob = job
      count++
    }
  }
  return count
}

/***
 * Find the job (before current job) that doesn't conflict with current
 * As long as array is sorted we can use binary search
 * @param schedule {Array<{start:number,end:number,weight:number}>}
 * @param index {number} current job index
 * @returns {number}
 */
function findNonConflictingJobIndex (schedule, index) {
  const start = schedule[index].start
  let upperBound = 0
  let lowerBound = index - 1

  while (upperBound <= lowerBound) {
    const mid = Math.floor((upperBound + lowerBound) / 2)
    if (schedule[mid].end <= start) {
      if (schedule[mid + 1].end <= start) {
        upperBound = mid + 1
      } else {
        return mid
      }
    } else {
      lowerBound = mid - 1
    }
  }
  return -1
}

/***
 * @param schedule {Array<{start:number,end:number,weight:number}>}
 * @param n {number}
 * @param selected {number}
 * @returns {[number, number]}
 */
function planMaxWeight (schedule, n, selected) {
  const last = n - 1
  const lastWeight = schedule[last].weight
  // Base case
  if (n === 1) {
    return [lastWeight, 1]
  }

  // Find profit when current job is included
  let includeWeight = lastWeight
  let selectedInclude = 0
  let profit = 0
  let i = findNonConflictingJobIndex(schedule, last)
  if (i !== -1) {
    [profit, selectedInclude] = planMaxWeight(schedule, i + 1, selected)
    includeWeight += profit
  }
  // Find profit when current job is excluded
  let [excludeWeight, exclSelected] = planMaxWeight(schedule, last, selected)

  if (includeWeight > excludeWeight) {
    return [includeWeight, selectedInclude + 1]
  } else {
    return [excludeWeight, exclSelected]
  }
}

// The main function that returns the maximum possible
// profit from given array of jobs
function planWeighted (schedule) {
  if (schedule.length === 0) {
    return 0
  }
  const [, selected] = planMaxWeight(schedule, schedule.length, 0)
  return selected
}

module.exports = {
  prepareSchedule,
  planSimple,
  planWeighted
}

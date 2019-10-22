export default function Scheduler(taskFn) {
  let currentTaskAbortController = null

  return (...params) => {
    //  Abort prev request if any
    if (currentTaskAbortController) {
      currentTaskAbortController.abort()
    }

    //  Update current abort controller to handle the new task
    currentTaskAbortController = new AbortController()

    //  Return the new function value passign the signal
    return taskFn(currentTaskAbortController.signal, ...params)
  }
}

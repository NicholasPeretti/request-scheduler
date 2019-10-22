import Scheduler from './scheduler'

const cancellableTask = (signal, onCancel) => {
  signal.addEventListener('abort', onCancel)
}

it('should return a function', () => {
  const scheduledTask = Scheduler()
  expect(typeof scheduledTask).toBe('function')
})

it('should NOT cancel the task if it has been called only once', () => {
  const onCancelCallback = jest.fn()
  const scheduledTask = Scheduler(signal => {
    cancellableTask(signal, onCancelCallback)
  })

  scheduledTask()

  expect(onCancelCallback).toHaveBeenCalledTimes(0)
})

it('should cancel the task if another call has been made', () => {
  const onCancelCallback = jest.fn()
  const scheduledTask = Scheduler(signal => {
    cancellableTask(signal, onCancelCallback)
  })

  scheduledTask()
  scheduledTask()

  expect(onCancelCallback).toHaveBeenCalledTimes(1)
})

it('should return the tasks result', () => {
  const MOCK_RESULT = 'MOCK_RESULT'
  const scheduledTask = Scheduler(() => MOCK_RESULT)

  expect(scheduledTask()).toBe(MOCK_RESULT)
})

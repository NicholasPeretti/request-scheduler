# Task-scheduler

There are cases where you may want to execute only the last requests that the
users has triggered.

Usually, in order to do that, you should implement some kind of system to
assign an `AbortController.signal` to `fetch` or `axios` in order to delete
the flying request and execute the latest one that user has just triggered.

This may take you a few time in order to implement, test and write a bit of
documentation.

So this is likely what you'd have done in your project.
This is a package that allows you to control the flow of the request without
all that overhead.

# Dependencies

This library expect `AbortController` to exists if you use it in the browser.
If you're targeting IE or Samsung Browser, please make sure you have a polifill.

# Usage

```javascript
import Scheduler from 'task-scheduler'
import debounce from 'lodash/fp/debounce'

const fetchData = Scheduler((signal, search) => fetch('/api/v1/feed', {
  body: JSON.stringify({ search })
  signal
}))

const DEBOUNCE_DELAY = 300
document.getElementById('searchbox')
  .addEventListener(
    'input',
    debounce(DEBOUNCE_DELAY, e => {
      const value = e.target.value;
      fetchData(value);
    })
  )
```

In the above example we are catching every single change in the input text, which
is a search box used by the user to filter the data he's watching.
Thanks to the scheduler, we are canceling every request "on the air" when the user
trigger a change.

# API

## Scheduler

The scheduler accept a function that will be executed and then canceled if
another call to the function has been made.

```javascript
const fetchDataConsistently = Scheduler(fetchDataApiCall)
//  ...
fetchDataConsistently()
```

### Parameters

- **TaskFunction**: The function you want to execute and eventually cancel.

### Returns

Returns a new function that will call and eventually cancel your **TaskFunction**.
This function will return the result returned from **TaskFunction**.

## TaskFunction

The function you want to be execute

### Parameters

- **signal**: This is the signal from the `AbortController`. You **must** use it
  if you want _task-scheduler_ to be able to cancel your task execution.
- **...params**: The params that will be passed to the scheduled function.

# Why you should use it

This approach allows you to:

- save network traffic
- keep your UI consistent with your data

Sometimes, when two idetical request are triggered, the lastest could be faster
than the first one to resolve. This causes an inconsistency in the UI because the
user set a certain filter but the result of the page in not what the user expected.

# Examples

## Simple data fetching

```javascript
import Scheduler from 'task-scheduler'

const fetchFeed = ({ ...options }) =>
  fetch(FEED_URL, { ...options }).then(res => res.json())

const consistentFetchFeed = Scheduler(signal =>
  fetchFeed({
    signal
  })
)

//  ... In your UI ...
const data = await consistentFetchFeed()
```

## Data fetching with parameters

```javascript
import Scheduler from 'task-scheduler'

const fetchDataByFreeTextSearch = (freeTextSearch, { ...options }) =>
  fetch(FEED_URL, {
    ...options,
    body: JSON.stringify({
      freeTextSearch
    })
  }).then(res => res.json())

const consistentFetchFeed = Scheduler((signal, freeTextSearch) =>
  fetchFeed(freeTextSearch, {
    signal
  })
)

//  ... In your UI ...
const data = await consistentFetchFeed('Text')
```

# Inspiration

This little utility was inspired by this great article from Sébastien Lorber:
https://sebastienlorber.com/handling-api-request-race-conditions-in-react

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
If you're targetting IE or Samsung Browser, please make sure you have a polifill.

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
Thanks to the scheduler, we are canceling every request "on the air" if the user
trigger a change in the meanwhile.

# Why you should use it

This approach allows you to:

- save network resource
- keep data consistency in your screen

Sometimes, when two idetical request are triggered, the lastest could be fastest
of the first one to resolve. This cause an inconsistency in the UI because the
user set a certain filter but the result of the page in not what he was expecting.

# Inspiration

This little utility was inspired by this great article from Sébastien Lorber:
https://sebastienlorber.com/handling-api-request-race-conditions-in-react

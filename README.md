# fetch-simulator
Lightweight module for simulation of HTTP requests with the fetch API.
<br />

## Description
With the Fetch Simulator you can simulate server responses without modifying you fetch API calls. This is really useful during development process when you don't want to make real HTTP requests to stress your server, or if you don't have server yet but you work on part of your app which depends of the server response. You can set exact data you want to receive from your simulated server as well as the time you want to wait to get your response. You don't have to replace your fetch calls with some kind of test functions, just import Fetch Simulator and you can use it. When you are ready to connect to the real server, you just remove it from your project.

## Installation

```bash
npm install fetch-simulator --save-dev
```

#### ReactJS
In ReactJS we can import Fetch Simulator and store it to the Fetch variable. After that, we can use Fetch.use() method which will then replace the fetch API in the browser with the one from Fetch Simulator.
```js
import Fetch from 'fetch-simulator';
Fetch.use();
```

#### NodeJS
Since NodeJS doesn't support the fetch API natively, we can simply require fetch-simulator and store it in the fetch variable.
```js
const fetch = require('fetch-simulator');
```
<br />

## How does it work?
Lets say you are using fetch API to fetch some data from the geocode server with the GET request. Your code would look like this:
```js
fetch('https://somekindofserver.com/location/miami')
  .then((response) => {
      return response.json();
  })
  .then((response) => {
    console.log(response);
  });
  
  // Lets say in this case response is - Miami, Florida, USA
```
We can simulate this response with Fetch Simulator and return the same result.

#### NodeJS
```js
const fetch = require('fetch-simulator');

fetch.addRoute('https://somekindofserver.com/location/miami', {
    response: {
        get: 'Miami, Florida, USA'
    }
});

fetch('https://somekindofserver.com/location/miami')
  .then((response) => {
      return response.json();
  })
  .then((response) => {
      console.log(response);
  });
  
  // Now we will get the same result, but this time from the route we created - Miami, Florida, USA
```
You noticed we called .json() method on our responce, but we didnt set it, this is because Fetch Simulator automatically adds this method to our response, more about this you can read in the methods section.

#### ReactJS
Using Fetch Simulator in the React or other front end library's is little bit different. Since React already has fetch API, we need to override it. For that reason we import Fetch Simulator wit capital F, and after that we can replace original fetch wit .use() method.
```js
import Fetch from fetch-simulator;

Fetch.addRoute('https://somekindofserver.com/location/miami', {
    response: {
        get: 'Miami, Florida, USA'
    }
});

Fetch.use(); // This will replace original fetch API with our own.

fetch('https://somekindofserver.com/location/miami')
  .then((response) => {
      return response.json();
  })
  .then((response) => {
      console.log(response);
  });
```
<br />

## Creating new routes
In order for the Fetch Simulator to get the response from specific route, we first need to create that route and response it will send.
```js
const fetch = require('fetch-simulator');

fetch.addRoute('/user', {
    response: {
      get: {name: 'John', lastName: 'Doe'},
      post: {
          message: 'New user has been created',
          user: {name: 'Jane', lastName: 'Doe'}
      }
    }
});
```
Now we can fetch that data from the '/user' route either with GET method or POST method.
```js
fetch('/user')
    .then((res) => res.json())
    .then((res) => console.log(res));
    // Response in this case would be:
    // {name: 'John', lastName: 'Doe'}
```
Since we didn't specified HTTP method, this fetch request is automatically set to use GET method. To switch to POST request we just need to add POST method to our fetch call, just like we would do while making POST request to the real server.
```js
fetch('/user', {method: POST})
    .then((res) => res.json())
    .then((res) => console.log(res));
    // Response in this case would be:
    //{
    //    message: 'New user has been created',
    //    user: {name: 'Jane', lastName: 'Doe'}
    //}
```

#### Delaying the response
Usually when we are making HTTP requests, we don't get server's response right away. Usually there is delay which could last even for few seconds. To simulate this behavior, you can set the time it would take for your fetch call to receive data. We do this with the 'wait' property:
```js
fetch.addRoute('/user', {
    response: {
      get: {name: 'John', lastName: 'Doe'},
      post: {
          message: 'New user has been created',
          user: {name: 'Jane', lastName: 'Doe'}
      }
    },
    wait: 5000
});
```
In this case we will wait 5 seconds for our fake server to send the response.
Fetch Simulator has default maximum wait limit at 20 seconds or 20000 ms. If you by any chance want to raise or lower this limit, you can use:
```js
fetch.setTimeout(50000) // Limit is now 50 seconds
fetch.setTimeout(1000) // Limit is now 1 second
```

#### Additional response properties
Sometimes your logic in side of the fetch call depends on certin expected parameters on the response object, for example:
```js
fetch('/users')
    .then((res) => {
        if (res.status === 200) {
            return res.json();
        } else {
            throw new Error('Oh nooooooooooo');
        }
    });
```
To simulate this behavior, you can use set expected property's on the response object. We do this with the 'expect' property:
```js
fetch.addRoute('/user', {
    response: {
      get: '',
      post: {
          message: 'New user has been created',
          user: {name: 'Jane', lastName: 'Doe'}
      }
    },
    expect: {
      get: {status: 404, error: 'That user is not found in the database'},
      post: {status: 200, statusText: 'OK'}
    },
    wait: 5000
});
```

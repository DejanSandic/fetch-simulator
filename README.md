# fetch-simulator
Lightweight module for simulation of HTTP requests with the fetch API.
<br />

## Description
With the fetch-simulator you can simulate server responses without modifying you fetch API calls. This is really useful during development process when you don't want to make real HTTP requests to stress your server, or if you don't have server yet but you work on part of your app which depends of the server response. You can set exact data you want to receive from your simulated server as well as the time you want to wait to get your response. You don't have to replace your fetch calls with some kind of test functions, just import fetch-simulator and you can use it. When you are ready to connect to the real server, you just remove it from your project.

## Installation

```bash
npm install fetch-simulator --save-dev
```
<br />

### ReactJS
In ReactJS we can import fetch-simulator and store it to the Fetch variable. After that, we can use Fetch.use() method which will then replace the fetch API in the browser with the one from fetch-simulator.
```js
import Fetch from 'fetch-simulator';
Fetch.use();
```
<br />

### NodeJS
Since NodeJS doesn't support the fetch API natively, we can simply require fetch-simulator and store it in the fetch variable.
```js
const fetch = require('fetch-simulator');
```

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
we can simulate this response with fetch-simulator and return the same result:
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
You noticed we called .json() method on our responce, but we didnt set it, this is because fetch-simulator automatically adds this method to our response, more about this you can read in the methods section.

## Creating new routes
In order for the fetch-simulator to get the response from specific route, we first need to create that route and response it will send.
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

# fetch-simulator
Lightweight module for simulation of HTTP requests with the fetch API.
<br /><br />

#### Topics:
- [Description](#description)
- [Installation](#installation)
- [How does it work?](#how-does-it-work)
- [Creating new routes](#creating-new-routes)
- [Removing Routes](#removing-routes)
- [Creating and importing external routes](#external-routes)


<br />

<a id="description"></a>
## Description
With the Fetch Simulator you can simulate server responses without modifying you fetch API calls. This is really useful during development process when you don't want to make real HTTP requests to stress your server, or if you don't have server yet but you work on part of your app which depends of the server response. You can set exact data you want to receive from your simulated server as well as the time you want to wait to get your response. You don't have to replace your fetch calls with some kind of test functions, just import Fetch Simulator and you can use it. When you are ready to connect to the real server, you just remove it from your project.

<br />

<a id="installation"></a>
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


<a id="how-does-it-work"></a>
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
    get: {
        response: 'Miami, Florida, USA'
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
Using Fetch Simulator in the React or other front end library's is little bit different. Since React already has fetch API, we need to override it. For that reason we import Fetch Simulator wit capital F, and after that we can replace original fetch with .use() method.
```js
import Fetch from fetch-simulator;

Fetch.addRoute('https://somekindofserver.com/location/miami', {
    get: {
        response: 'Miami, Florida, USA'
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


<a id="creating-new-routes"></a>
## Creating new routes
In order for the Fetch Simulator to get the response from specific route, we first need to create that route and response it will send.
```js
const fetch = require('fetch-simulator');

fetch.addRoute('/user', {
    get: {
        response: {name: 'John', lastName: 'Doe'}
    },
    post: {
        response: {
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
fetch('/user', {method: 'POST'})
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
    get: {
        response: {name: 'John', lastName: 'Doe'},
        wait: 5000
    },
    post: {
        response: {
            message: 'New user has been created',
            user: {name: 'Jane', lastName: 'Doe'}
        },
        wait: 1000
    }
});
```
In this case we will wait 5 seconds for our fake server to send the response for GET request and 1 second for POST request.

<br />

Fetch Simulator has default maximum wait limit at 20 seconds or 20000 ms. If you by any chance want to raise or lower this limit, you can use:
```js
fetch.setTimeout(50000) // Limit is now 50 seconds
fetch.setTimeout(1000) // Limit is now 1 second
```

You can check current timeout limit with fetch.getTimeout() method.
```js
let wait = fetch.getTimeout();

if (wait < 50000) {
  fetch.setTimeout(50000);
}
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
    })
    .catch((error) => {
        console.log(error);
    });
```
To simulate this behavior, you can use set expected property's on the response object. We do this with the 'expect' property:
```js
fetch.addRoute('/user', {
    get: {
        response: '',
        expect: {status: 404, error: 'That user is not found in the database'},
        wait: 5000
    },
    post: {
        response: {
            message: 'New user has been created',
            user: {name: 'Jane', lastName: 'Doe'}
        },
        expect: {status: 200, statusText: 'OK'},
        wait: 5000
    }
});
```
In this case if we make GET request, response will look like this:
```js
{
    response: '',
    status: 404,
    error: 'That user is not found in the database',
    url: '/user'
}
```
but if we make POST request on the same route, response will look like this:
```js
{
    response: {
        message: 'New user has been created',
        user: {name: 'Jane', lastName: 'Doe'}
    },
    status: 200,
    statusText: 'OK',
    url: '/user'
}
```
<br />
Notice how our response object automatically gets url property.


<a id="removing-routes"></a>
## Removing routes
If by any chance you want to remove any of the routes you created, you can do that with .removeRoute() method.
```js
fetch.removeRoute('/users');
```
<br />


<a id="external-routes"></a>
## Creating and importing external routes
It would be really messy if you would create routes in the same file in which you use your fetch calls. With Fetch Simulator, you can create routes in one file, export them, then import and use them in other file.
Next example shows how we can create separate routes file and use it in our react app.
```js
// FILE NAME = routes.js

import Fetch from 'fetch-js';

Fetch.addRoute('/users', {
    get: {
        response: ['John Doe', 'Jand Doe', 'Bruce Wayne'],
        expect: {status: 200, statusText: 'OK'},
        wait: 3000
    }
});

Fetch.addRoute('/user', {
    post: {
        response: {
            message: 'New user created',
            user: 'Mr Spock'
        },
        expect: {status: 200, statusText: 'OK'}
    }
});


let routes = Fetch.getRoutes();

export default routes;
```
Notice how we used Fetch.getRoutes() to create a copy of our routes object and store it to the variable. We exported that variable so we can import and use it in other file. After we import the routes, we can pass them to our fetch system by using Fetch.setRoutes().
```js
// FILE NAME = index.js

import React, { Component } from 'react';
import Fetch from 'fetch-simulator';
import myRoutes from './routes.js';

Fetch.setRoutes(myRoutes);
Fetch.use();

class Test extends Component () {
    constructor(props){
        super(props);
        this.state = {name: 'Batman'};
    }

    componentDidMount(){
        fetch('/users', {method: 'GET'})
            .then((res) => res.json())
            .then((res) => {
                this.setState({
                    name: res[2]
                });
            });
    }
    
    render(){
        return <h1>{this.state.name}</h1>;
    }
}
```
In this case text of the h1 tag will be 'Batman', but after 3 seconds when fetch completes, text will be changed to 'Bruce Wayne'.

<br />

In this example we used Fetch.setRoutes() to pass our previously created routes to the Fetch Simulator, and after that we used Fetch.use() to replace the fetch API with our Fetch Simulator. We can simplify this by passing our previously created routes directly to Fetch.use() and that way we don't have to use Fetch.setRoutes().
```js
import Fetch from 'fetch-simulator';
import myRoutes from './routes.js';

Fetch.use(myRoutes);

// THIS IS THE SAME AS

import Fetch from 'fetch-simulator';
import myRoutes from './routes.js';

Fetch.setRoutes(myRoutes);
Fetch.use();
```

#### Important Note
In the NodeJS we don't have to use Fetch.use() since there is no fetch API to replace by default. So in this case we can import Fetch Simulator as fetch (lowercase), and then use fetch.setRoutes(). 
```js
const fetch = require('fetch-simulator');
const myRoutes = require('./routes.js');

Fetch.setRoutes(myRoutes);
```

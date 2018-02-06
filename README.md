# fetch-simulator
Lightweight module for simulation of HTTP requests with the fetch API.
<br />

With fetch-simulator you can simulate server responses without modifying you fetch API calls. This is really useful during development process when you don't want to make real HTTP requests to stress your server, or if you don't have server yet but you work on part of your app which depends of the server response. You don't have to replace your fetch calls with some kind of test functions, just import fetch-simulator and you can use it. When you are ready to connect to the real server, you just remove it from your project.

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



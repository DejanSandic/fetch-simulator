# fetch-simulator
Lightweight module for simulation of HTTP requests with the fetch API.

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



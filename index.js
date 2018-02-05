const Fetch = (url, obj) => {
    // Return the new promise
    return new Promise((resolve, reject) => {
        // Check is the url argument present.
        if (!url) throw new Error("TypeError: Failed to execute 'fetch' on 'Window': " +
            "1 argument required, but only 0 present.");
        
        // Check is the url argument a string.
        if (typeof(url) !== 'string') throw new Error("TypeError: Failed to execute 'fetch' on 'Window': " +
            "First argument is expected to be a string representing the route");

        // If route for passed url is not defined, throw an error.
        if (!Fetch.__routes__[url]) {            
            throw new Error("TypeError: Failed to execute 'fetch' on 'Window': Failed to parse URL from " + url);
        } else {
            // If request object (obj) doesn't have method specified,
            // set GET as default method.
            let responseBody, method = 'GET';
            
            // If request object (obj) havs method specified,
            // transform it to upper case to avoid errors (get, GET, GeT).
            if (obj && obj.method) method = obj.method.toUpperCase();

            // Get the value from the method and store it in the responseBody variable.
            responseBody = Fetch.__routes__[url].methods[method];

            // Check is object with expected properties specified for current HTTP method,
            // if not set it to empty object.
            let expect = Fetch.__routes__[url].expect[method] || {};

            // Set the response variable to return value of Fetch.Response factory function
            let response = Fetch.Response(responseBody, expect);

            // Take the value of the wait parameter from the obj and use it to set timeout,
            // after that resolve the promise with the response variable.
            setTimeout(() => {
                resolve(response);
            }, Fetch.__routes__[url].wait);
        }
    });
}


// Set the default timeout to 2000 ms.
Fetch.timeout = 20000;


// Method for changing the default timeout.
Fetch.setTimeout = (timeout) => {
    Fetch.timeout = timeout;
}


// Set the routes object to an empty object.
Fetch.__routes__ = {
}


// Method for changing routes object to pre-defined routs object.
Fetch.setRoutes = (routes) => {
    // Throw an error if routes argument is not an object.
    if (!routes || typeof(routes) !== 'object') {
        throw new Error('Fetch.setRoutes method requires the first argument to be an object.');
    }
    Fetch.__routes__ = routes;
}


// Return a copy of the routes object.
Fetch.getRoutes = () => {
    return {...Fetch.__routes__};
}


// Method for creating new routes.
Fetch.addRoute = (route, obj) => {
    // Throw an error if the route already exists.
    if (Fetch.__routes__[route]) throw new Error('Route already exists, if you want to remove it use Fetch.removeRoute.');

    // Throw an error if route is not a string and obj is not an object.
    if (!route || typeof(route) !== 'string' || !obj || typeof(obj) !== 'object') {
        throw new Error('Fetch.addRoute method requires the first argument to be a string '
            + 'representing the route, and second argument to be a response object for that route.');
    }

    // Throw an error if obj argument does not have .response property.
    if (!obj.response) throw new Error ('Response object must have a .response property.');

    // Throw an error if wait propety is not a number.
    if (obj.wait && typeof(obj.wait) !== 'number') throw new Error("The wait property needs to be a number representing " +
        "the delay of the response");

    // Check does the wait property exceed the default timeout.
    if (obj.wait > Fetch.timeout) throw new Error("The wait  property exceeds the default timeout limit. " +
        "To change the default timeout limit use Fetch.setTimeout method");

    // If timeout is not set, set it to 0 ms.
    obj.wait = obj.wait || 0;

    // Using Route contructor, create new route on the routes object
    Fetch.__routes__[route] = new Fetch.Route(obj);
}

// Method for removing routes.
Fetch.removeRoute = (route) => {
    // Throw an error if route argument is not a string.
    if (!route || typeof(route) !== 'string') {
        throw new Error('Fetch.removeRoute method requires first argument to be a ' +
            'string representing the route.');
    }

    // Throw an error if route doesn't exists.
    if (!Fetch.__routes__[route]) throw new Error("Route " + route + " doesn't exist.");
    
    // If none of the tests fail, deleta a route.
    delete Fetch.__routes__[route];
}


// Use Fetch API by replacing the fetch API with it
Fetch.use = (routes) => {
    // Set the globalObj to window object in browser environment, or
    // to global object in Node environment.
    let globalObject;
    try {
        globalObject = window;
    } catch (err) {}

    try {
        globalObject = global;
    } catch (err) {}

    // If routes argument is provided and its value is anobject, use it.
    // If routes argument is provided and its value is not an object, throw an error.
    if (routes && typeof(routes) !== 'object') {
        throw new Error('Fetch.use method requires the first argument to be an object.');
    } else if (routes) {
        Fetch.setRoutes(routes)
    }
    
    // Replace fetch API on the globalObject with Fetch.
    globalObject.fetch = Fetch;
}


// *************************************
// RESPONSE METHODS
// *************************************

// Object for methods on Fetch.Responcse response.
Fetch.__Methods__ = {
    // Initial json method which just returns the response
    // within the resolved promise .
    json: function () {
        let self = this;
        return new Promise ((resolve, redject) => {
            resolve(self.response)
        });
    }
}

// Method for adding methods on the Fetch response object prototype
Fetch.addMethod = (name, func) => {
    // Throw an error if name is not a string and func is not a function.
    if (!name || typeof(name) !== 'string' || !func || console.log({}.toString.call(func) !== '[object Function]')) {
        throw new Error('Fetch.expect method requires the first argument to be a string representing ' + 
            'the name of the method, and second argument to be anonimous funciton.');
    }
    Fetch.__Methods__[name] = func;
}


// *************************************
// CONSTURUCTORS
// *************************************

// Route constructor.
Fetch.Route = function (obj) {
    // Create temporary, empty methods object.
    let methods = {};

    // If wait is not specified set 0 as default.
    this.wait = obj.wait;

    // Set the expect object to empty object
    this.expect = {};

    // If obj.response is not an object, set the default http method to GET
    // and assign obj.response as its value.
    if (typeof(obj.response) !== 'object') {
        methods.GET = obj.response;

    // If obj.response is an object, for each of its defined HTTP metods, 
    // create corresponding methods with responses on the methods object.
    } else {
        for (let prop in obj.response) {
            methods[prop.toUpperCase()] = obj.response[prop];
        }
    }
    this.methods = methods;

    // If obj has expected an object with expected properties, add those
    // properties to the expect object of the new route
    if (obj.expect) {
        for (let prop in obj.expect) {
            this.expect[prop.toUpperCase()] = obj.expect[prop];
        }
    }
}

// Response factory function.
Fetch.Response = (response, expect) => {
    // Generate new object with Fetch methods on it's prototype
    let obj = Object.create(Fetch.__Methods__);
    
    obj.response = response;

    // For each property in expect, add that property to the response object
    for (let prop in expect) {
        obj[prop] = expect[prop];
    }
    return obj;
}

try {
    module.exports = Fetch;
} catch(e){}

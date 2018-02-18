const expect = require('expect');
const fetch = require('./../index.js');


describe('TEST ADDING NEW ROUTES.\n', () => {

    it('Before we add any routes, routes object should be empty.\n', () => {
        expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({}));
    });

    describe('Success cases.', () => {
        before(() => {
            fetch.addRoute('/test', {
                get: {
                    response: 'Test',
                    expect: {
                        status: 200
                    },
                    wait: 100
                }
            });
        });
        after(() => {
            fetch.setRoutes({});
        });

        it('"/test" route should be added to the routes.', () => {
            expect(fetch.getRoutes()['/test']).toBeTruthy();
        });

        it('HTTP GET method should exist on the "/test" route.', () => {
            expect(fetch.getRoutes()['/test'].GET).toBeTruthy();
        });

        it('Response for the GET method should be "Test".', () => {   
            expect(fetch.getRoutes()['/test'].GET.response.response).toBe('Test');
        });

        it('Response for the GET method should have the access to .json() method.', () => {   
            expect(fetch.getRoutes()['/test'].GET.response.json()).toBeTruthy();
        });

        it('Wait time for the GET method should be 100.', () => {
            expect(fetch.getRoutes()['/test'].GET.wait).toBe(100);
        });

        it('Status property for the GET method should be 200.\n', () => {
            expect(fetch.getRoutes()['/test'].GET.response.status).toBe(200);
        });
    });

    describe('Error cases.', () => {
        before(() => {
            fetch.setRoutes({});
        });

        it('Route should not be created if no arguments are passed to .addRoute() method.', () => {
            try {
                fetch.addRoute()
            } catch (e) {}
            
            expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({}));
        });

        it('Route should not be created if the first argument is not a string.', () => {
            try {
                fetch.addRoute(1, {})
            } catch (e) {}
            
            expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({}));
        });

        it('Route should not be created if the second argument is not an object.', () => {
            try {
                fetch.addRoute('s', 1)
            } catch (e) {}
            
            expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({}));
        });

        it('Route should not be created if the second argument is an empty object.', () => {
            try {
                fetch.addRoute('/s', {})
            } catch (e) {}
            
            expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({}));
        });

        it('Route should not be created if expect property on the HTTP metod is not an object.', () => {
            try {
                fetch.addRoute('/s', { get:{expect: 's'} } )
            } catch (e) {};
            expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({}));
        });

        it('Route should not be created if wait property on the HTTP metod is not a number.', () => {
            try {
                fetch.addRoute('/s', { get:{wait: 's'} } )
            } catch (e) {};
            expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({}));
        });
        it('Route should not be created if wait property on the HTTP metod exceeds default timeout limit.\n', () => {
            try {
                fetch.addRoute('/s', { get:{wait: 10000} } )
            } catch (e) {};
            expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({}));
        });
    });

    describe('Default values.', () => {
        before(() => {
            fetch.addRoute('/test', {
                get: {}
            });
        });
        after(() => {
            fetch.setRoutes({});
        });

        it('If not provided, the response for the GET method should be set to "null".', () => {   
            expect(fetch.getRoutes()['/test'].GET.response.response).toBe(null);
        });

        it('If not provided, wait time for the GET method should be set to 0.\n', () => {
            expect(fetch.getRoutes()['/test'].GET.wait).toBe(0);
        });
    });

    describe('Multiple HTTP methods.', () => {
        before(() => {
            fetch.addRoute('/test', {
                post: {
                    response: 'Posted',
                    expect: {
                        status: 200
                    },
                    wait: 200
                },
                patch: {
                    response: 'Patched',
                    expect: {
                        statusText: 'OK'
                    }
                }
            });
        });
        after(() => {
            fetch.setRoutes({});
        });

        it('"/test" route should be added to the routes.', () => {
            expect(fetch.getRoutes()['/test']).toBeTruthy();
        });

        it('HTTP POST method should exist on the "/test" route.', () => {
            expect(fetch.getRoutes()['/test'].POST).toBeTruthy();
        });

        it('HTTP PATCH method should exist on the "/test" route.', () => {
            expect(fetch.getRoutes()['/test'].PATCH).toBeTruthy();
        });

        it('HTTP GET method should not exist on the "/test" route.', () => {
            expect(fetch.getRoutes()['/test'].GET).toBeFalsy();
        });

        it('Response for the POST method should be "Posted".', () => {   
            expect(fetch.getRoutes()['/test'].POST.response.response).toBe('Posted');
        });

        it('Wait for the POST method should be 200.', () => {   
            expect(fetch.getRoutes()['/test'].POST.wait).toBe(200);
        });

        it('Status for the POST method should be 200.', () => {   
            expect(fetch.getRoutes()['/test'].POST.response.status).toBe(200);
        });

        it('Response for the PATCH method should be "Patched".', () => {   
            expect(fetch.getRoutes()['/test'].PATCH.response.response).toBe('Patched');
        });

        it('Wait for the PATCH method should be 0.', () => {   
            expect(fetch.getRoutes()['/test'].PATCH.wait).toBe(0);
        });

        it('StatusText for the PATCH method should be "OK".\n', () => {   
            expect(fetch.getRoutes()['/test'].PATCH.response.statusText).toBe('OK');
        });
    });
});




describe('TEST REMOVING ROUTES.', () => {
    beforeEach(() => {
        fetch.addRoute('/test', {
            get: {}
        });
    });
    after(() => {
        fetch.setRoutes({});
    });

    it('"/test" route should be removed.', () => {
        fetch.removeRoute('/test');
        expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({}));
    });
});


describe('TEST SETTING AND GETTING ROUTES.', () => {
    before(() => {
        fetch.setRoutes({});
    });
    after(() => {
        fetch.setRoutes({});
    });

    it('Routes should not be set if passed argument is not an object.', () => {
        try {
            fetch.setRoutes('test');
        } catch (e) {}
        expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({}));
    });

    it('Routes should be set if passed argument is an object.', () => {
        try {
            fetch.setRoutes({test: true});
        } catch (e) {}
        expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({test: true}));
    });

    it('fetch.getRoutes() method should return  object.', () => {
        expect(typeof fetch.getRoutes()).toBe('object');
    });

    it('fetch.getRoutes() method should return the routes object.', () => {
        expect(JSON.stringify(fetch.getRoutes())).toBe(JSON.stringify({test: true}));
    });
});


describe('TEST SETTING AND GETTING TIMEOUT.', () => {
    it('fetch.getTimeout() method should return a number.', () => {
        expect(typeof fetch.getTimeout()).toBe('number');
    });

    it('fetch.getTimeout() method should return 5000.', () => {
        expect(fetch.getTimeout()).toBe(5000);
    });

    it('fetch.setTimeout() method should set new timeout limit to  25000.', () => {
        fetch.setTimeout(25000);
        expect(fetch.getTimeout()).toBe(25000);
    });
});


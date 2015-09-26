/**
* Register application routes
*/

'use strict';

module.exports = function (app) {

    app.use('/auth', require('../auth'));

    //All subsequent API's go through bearer token middleware
    app.use('/api', require('./root'));

    app.use('/api/users/v1', require('./user'));

    app.use('/api/invitations/v1', require('./invitation'));

    app.use('/api/applications/v1', require('./apps'));

    app.use('/api/docs/v1', require('./docs'));

    app.use('/api/inquiries/v1', require('./inquiries'));

    app.use('/api/forums/v1', require('./forums'));

    app.use('/api/tags/v1', require('./tags'));

    app.use('/api/forums/v1', require('./posts'));

    app.use('/api/vendor_proxies/fastly', require('./vendor_proxies/fastly'));


    // All other routes should redirect to the index.html
    app.get('*', function(req, res) {
        res.redirect('/#' + req.originalUrl);
    });
};

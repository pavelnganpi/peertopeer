/**
 * Register application routes
 */

'use strict';

module.exports = function (app) {

    //app.use('/auth', require('../auth'));

    //All subsequent API's go through bearer token middleware
    app.use('/main', require('./main'));
    app.use('/auth', require('./auth')(app));

    //app.use('/transactions', require('./transactions'));

    // All other routes should redirect to the index.html
    app.get('*', function(req, res) {
        res.redirect('/#' + req.originalUrl);
    });
};

const monitorRouter = require('./monitor');
const homeRouter = require('./home');
const chartRouter = require('./chart');

function route(app) 
{
    app.use('/monitor', monitorRouter)
    app.use('/chart', chartRouter);
    app.use('/', homeRouter);
}
module.exports = route;
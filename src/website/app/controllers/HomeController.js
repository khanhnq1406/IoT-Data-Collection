// const Course = require('../models/Course')
// const { multipleMongooseToObject, mongooseToObject } = require ('../../util/mongoose');
class HomeController 
{
    // [GET] /
    index(req, res, next) 
    {
        res.render('home');
    }
}

module.exports = new HomeController;
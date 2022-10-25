const fb = require("firebase");

class ChartController 
{
    // [GET] /
    index(req, res, next) 
    {
        if (req.session.loggedin) {
           res.render("chart");
        }
        else {
            res.redirect('/');
        }
    }
}

module.exports = new ChartController;
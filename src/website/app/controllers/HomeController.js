const fb = require("firebase");

class HomeController 
{
    // [GET] /
    index(req, res, next) 
    {
        const firebaseDB = fb.database();
        const firebaseRef = firebaseDB.ref("Temperature");
        const data = [];
        firebaseRef.on("value", function(snapshot) {
            snapshot.forEach(function(element){
                data.push({dateTime: element.key, temperature: element.val()});
            });
            res.render('home', {
                pageData: data
            });
            // res.send(data);
        })
    }
    // [GET] /add
    addTemperature(req, res) {
        const today = new Date();   
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;
        const firebaseDB = fb.database();
        const temperature = (Math.random() * (99 - 10) ) + 10;
        firebaseDB.ref("Temperature").child(dateTime).set(Number(temperature.toFixed(2)));
        res.send('Add successfully');
    }
}

module.exports = new HomeController;
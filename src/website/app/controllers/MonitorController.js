const fb = require("firebase");
const notifier = require('node-notifier');
const url = require('url');
class MonitorController 
{
    // [GET] /
    index(req, res, next) 
    {
        if (req.session.loggedin) {
            const db = fb.firestore();
            const data = [];
            const firestoreRef = db.collection("temperature").orderBy("dateTime", 'desc');
            firestoreRef.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    data.push({dateTime: doc.data().dateTime, temperature: doc.data().temperature});
                });
                res.render('monitor', {
                    pageData: data
                });
            });
        }
        else {
            res.redirect(url.format({
                pathname: "/",
                query: {
                    "notYetLogin": true,
                }
            }));
        }
    }
    // [GET] /addTemp
    addTemperature(req, res) {
        const today = new Date();   
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;
        const temperature = Math.round(((Math.random() * (99 - 10) ) + 10 + Number.EPSILON) * 100) / 100;
        // Add data
        const firestoreDB = fb.firestore();
        firestoreDB.collection("temperature").add({
            temperature: temperature,
            dateTime: dateTime
        })
        .then((docRef) => {
            console.log("Document written with ID: "+ docRef.id);
            res.send("Document written with ID: "+ docRef.id)
        })
        .catch((error) => {
            console.error("Error adding document: "+ error);
            res.send("Error adding document: "+ error)

        });
    }
}

module.exports = new MonitorController;
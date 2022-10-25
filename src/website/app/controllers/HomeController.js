const fb = require("firebase");
const generateString = require("../../utils/GenerateString")
require("firebase/firestore");
class HomeController 
{
    // [GET] /
    index(req, res, next) 
    {
        console.log(req.session.loggedin);
        if (req.session.loggedin)
            res.render('home');
        else
            res.render('login');
    }

    // [POST] /login
    login(req, res, next)
    {
        const formData = req.body;
        const username = formData.username;
        const password = formData.password;
        console.log(formData)
        const db = fb.firestore();
        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (username === doc.data().username && password === doc.data().password)
                {
                    req.session.loggedin = true;
                    req.session.username = username;
                }
            });
            if (req.session.loggedin)
                res.render('home');
            else
                res.render('login', {
                    isLoginFail: true,
                });
        });
        // res.send(data)
    }

    // [POST] /addUsers
    addUsers(req, res, next) {
        const username = req.body.username;
        const password = req.body.password;
        const retypePassword = req.body.retypePassword;
        if (password !== retypePassword)
        {
            res.render('signup', {
                isDiffPassword: true,
                username: username
            });
        }
        else {
            // Add data
            const firestoreDB = fb.firestore();
            let isInvalid = false;
            firestoreDB.collection("users").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (username === doc.data().username)
                    {
                        isInvalid = true;
                    }
                });
                if (isInvalid) {
                    res.render('signup', {
                        isInvalid: true,
                    });
                }
                else
                {
                    firestoreDB.collection("users").add({
                        username: username,
                        password: password,
                    })
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                    res.render('login',{
                        justSignup: true
                    });
                }
            });     
        }
    }

    // [GET] /signup
    signup(req, res, next) 
    {
        res.render('signup');
    }

    logout(req, res, next)
    {
        req.session.loggedin = false;
        res.redirect('/');
    }
    
}
module.exports = new HomeController();
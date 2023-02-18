const fb = require("firebase");
class ChartController {
  // [GET] /
  index(req, res, next) {
    let param = req.body;
    let key = Object.keys(param);
    let value = Object.values(param);
    console.log(Object.values(param));
    const firebaseDB = fb.database();
    const firebaseRef = firebaseDB.ref(`Input/` + key).set(String(value));
    // firebaseRef;
    firebaseDB.ref("Input").once("value", (snapshot) => {
      const data = snapshot.val();
      console.log(data.number1);
      res.render("input", {
        number1: data.number1,
        number2: data.number2,
        number3: data.number3,
        number4: data.number4,
        number5: data.number5,
        number6: data.number6,
        number7: data.number7,
        number8: data.number8,
      });
    });
  }
}

module.exports = new ChartController();

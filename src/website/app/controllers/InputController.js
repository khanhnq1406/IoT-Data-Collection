const fb = require("firebase");
class InputController {
  // [GET] /
  index(req, res, next) {
    let param = req.body;
    let key = Object.keys(param);
    let value = Object.values(param);
    const firebaseDB = fb.database();
    if (key != 0) {
      firebaseDB.ref(`Input/` + key).set(String(value));
    }
    firebaseDB.ref("Input").once("value", (snapshot) => {
      const data = snapshot.val();
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

module.exports = new InputController();

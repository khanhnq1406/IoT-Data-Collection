const fb = require("firebase");

module.exports = { 
    updateChart:function (chart) {
        const db = fb.firestore();
        db.collection("temperature").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                chart.data.labels.push(doc.data().dateTime);
                chart.data.datasets.forEach((dataset) => {
                    dataset.data.push(doc.data().temperature);
                });
                chart.update();
            });
        });
    }
}

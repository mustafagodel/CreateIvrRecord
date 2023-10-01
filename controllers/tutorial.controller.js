const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

    if (!req.body.name || !req.body.surname) {
        res.status(400).send({ message: "Name and surname cannot be empty!" });
        return;
    }

    // Create a Tutorial object
    const tutorial = {
        name: req.body.name,
        surname: req.body.surname
    };

    // Save Tutorial in the database
    Tutorial.create(tutorial)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Tutorial."
            });
        });
    const PORT = process.env.PORT || 3200;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {

};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};
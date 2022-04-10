var User = require('../models').User;
var Car = require('../models').Car;

module.exports = {
    list(req, res) {
        User.findAll({
            include: [{ model: Car }],
        })
            .then((user) => res.status(200).send(user))
            .catch((err) => res.status(400).send(err))

    },
    getById(req, res) {
        User.findByPk(req.params.id, { include: [{ model: Car }] })
            .then((user) => !user ? res.status(404).json({ 'message': 'Invalid Id' }) : res.status(200).send(user))
            .catch((err) => res.status(400).send(err))

    },
    add(req, res) {
        var name = req.body.name;
        var age = req.body.age;

        if (!name || !age)
            res.status(400).json({ 'message': 'Invalid or missing parameter' });
        else
            User.create({ name: name, age: age })
                .then((user) => res.status(201).send(user))
                .catch((err) => res.status(400).send(err))

    },
    update(req, res) {
        User.findByPk(req.params.id, { include: [{ model: Car }] })
            .then((user) => {
                if (!user)
                    res.status(404).json({ 'message': 'Invalid Id' });
                else
                    user.update({
                        name: req.body.name || user.name,
                        age: req.body.age || user.age
                    })
                        .then((user) => res.status(200).send(user))
                        .catch((err) => res.status(400).send(err))
            })
    }
}

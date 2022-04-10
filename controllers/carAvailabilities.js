var Car = require('../models').Car;
var CarAvailability = require('../models').CarAvailability;
var User = require('../models').User;
var moment = require('moment');

module.exports = {
    list(req, res) {
        CarAvailability.findAll({
            include: [Car],
        })
            .then((model) => res.status(200).send(model))
            .catch((err) => res.status(400).send(err))

    },
    getById(req, res) {
        CarAvailability.findByPk(req.params.id, { include: [Car] })
            .then((model) => !model ? res.status(404).json({ 'message': 'Invalid Id' }) : res.status(200).send(model))
            .catch((err) => res.status(400).send(err))

    },
    async add(req, res) {
        var start_date = moment(req.body.start_date, 'DD/MM/YYYY');
        var end_date = moment(req.body.end_date, 'DD/MM/YYYY');
        var daily_pricing = req.body.daily_pricing;
        var car_id = req.body.car_id;
        var car = await Car.findByPk(car_id, { include: [User] });

        if (!start_date || !end_date || !daily_pricing || !car_id)
            res.status(400).json({ 'message': 'Invalid or missing parameter' });
        else if (!car)
            res.status(400).json({ 'message': 'Invalid Car ID or Car does no exist' })
        else
            CarAvailability.create({
                available_start_date: start_date,
                available_end_date: end_date,
                daily_pricing: daily_pricing,
                owner_id: car.owner_id,
                car_id: car_id
            })
                .then((model) => res.status(200).send(model))
                .catch((err) => res.status(400).send(err))
    },
    update(req, res) {


        CarAvailability.findByPk(req.params.id, { include: [Car, User] })
            .then((model) => {
                if (!model)
                    res.status(404).json({ 'message': 'Invalid Id' });
                else {
                    var start_date = req.body.start_date ?? model.available_start_date;
                    var end_date = req.body.end_date ?? model.available_end_date;
                    
                    model.update({
                        available_start_date: moment(start_date, 'DD/MM/YYYY'),
                        available_end_date: moment(end_date, 'DD/MM/YYYY'),
                        daily_pricing: req.body.daily_pricing ?? model.daily_pricing
                    })
                    .then((model) => res.status(200).send(model))
                    .catch((err) => res.status(400).send(err))
                }
            })
    }
}

var Car = require('../models').Car;
var CarAvailability = require('../models').CarAvailability;
var User = require('../models').User;
const { Op, fn, col, literal } = require('sequelize');
const moment = require('moment');

//Useful functions
const format_date = (col_name) => [fn('to_char', col(col_name), 'dd/mm/yyyy'), col_name];

module.exports = {
    list(req, res) {
        Car.findAll({
            attributes: ['id', 'model', 'color', 'maker', 'total_mileage', 'owner_id'],
            include: [
                { model: User, attributes: ['name'] },
                {
                    model: CarAvailability,
                    attributes: [
                        'id',
                        format_date('available_start_date'),
                        format_date('available_end_date'),
                        'daily_pricing'
                    ],
                }
            ],
        })
            .then((car) => res.status(200).send(car))
            .catch((err) => res.status(400).send(err))

    },
    getById(req, res) {
        Car.findByPk(req.params.id, {
            attributes: ['id', 'model', 'color', 'maker', 'total_mileage', 'owner_id'],
            include: [{ model: User, attributes: ['name'] },
            {
                model: CarAvailability,
                attributes: [
                    'id',
                    format_date('available_start_date'),
                    format_date('available_end_date'),
                    'daily_pricing'
                ],
            }]
        })
            .then((car) => !car ? res.status(404).json({ 'message': 'Invalid Id' }) : res.status(200).send(car))
            .catch((err) => res.status(400).send(err))

    },
    async add(req, res) {

        var model = req.body.model;
        var color = req.body.color;
        var maker = req.body.maker;
        var total_mileage = req.body.total_mileage;
        var owner_id = req.body.owner_id

        if (!model || !color || !maker || !total_mileage || !owner_id)
            res.status(400).json({ 'message': 'Invalid or missing parameter' });
        else if (!await User.findByPk(owner_id))
            res.status(400).json({ 'message': 'Invalid User ID or User does no exist' })
        else
            Car.create({
                model: model,
                color: color,
                maker: maker,
                total_mileage: total_mileage,
                owner_id: owner_id
            })
                .then((car) => res.status(201).send(car))
                .catch((err) => res.status(400).send(err))

    },
    update(req, res) {
        Car.findByPk(req.params.id, { include: [CarAvailability, User] })
            .then((car) => {
                if (!car)
                    res.status(404).json({ 'message': 'Invalid Id' });
                else
                    car.update({
                        model: req.body.model || car.model,
                        color: req.body.color || car.color,
                        maker: req.body.maker || car.maker,
                        total_mileage: req.body.total_mileage || car.total_mileage,
                        owner_id: req.body.owner_id || car.owner_id
                    })
                        .then((car) => res.status(200).send(car))
                        .catch((err) => res.status(400).send(err))
            })
    },
    search(req, res) {
        var date = req.body.date;
        var model = req.body.model ?? '';
        var daily_pricing = req.body.daily_pricing;
        var price_range = req.body.price_range ?? 100;

        if (!date && !model && !daily_pricing)
            module.exports.list(req, res);
        else {
            Car.findAll({
                attributes: ['id', 'model', 'color', 'maker', 'total_mileage', 'owner_id'],
                include: [
                    { model: User, attributes: ['name'] },
                    {
                        model: CarAvailability,
                        attributes: [
                            'id',
                            format_date('available_start_date'),
                            format_date('available_end_date'),
                            'daily_pricing'
                        ],
                        where: !date && !daily_pricing ? {} :
                            !daily_pricing ? {
                                available_start_date: { [Op.lte]: moment(date, 'DD/MM/YYYY') },
                                available_end_date: { [Op.gte]: moment(date, 'DD/MM/YYYY') },
                            } : !date ? {
                                daily_pricing: { [Op.between]: [daily_pricing - price_range, daily_pricing + price_range] }
                            } : {
                                        available_start_date: { [Op.lte]: moment(date, 'DD/MM/YYYY') },
                                        available_end_date: { [Op.gte]: moment(date, 'DD/MM/YYYY') },
                                        daily_pricing: { [Op.between]: [daily_pricing - price_range, daily_pricing + price_range] }
                                    }
                    }
                ],
                where: !model ? {} : literal(`LOWER(model) LIKE LOWER('%${model}%')`)
            })
                .then((model) => res.status(200).send(model))
                .catch((err) => res.status(400).send(err));
        }

    }
}

const mongoose = require('mongoose');
const { json } = require('body-parser');
const { Team } = require('./models');
const { makeSortCriteria, mapPayloadToUpdateObject } = require('./utils');

module.exports = (app) => {
    app.get('/teams', (req, res) => {
        const sortBy = req.query.sortBy || '';
        const order = parseInt(req.query.order, 10) || 1;
        const skip = parseInt(req.query.skip, 10) || 0;
        const sortCriteria = makeSortCriteria(sortBy, order);

        Team.find()
            .sort(sortCriteria)
            .skip(skip)
            .lean()
            .then((docs) => {
                res.json({
                    count: docs.length,
                    value: docs
                });
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            });
    });

    app.get('/teams/:teamId', (req, res) => {
        const teamId = req.params.teamId;
        const include = req.query.include;
        const exclude = req.query.exclude;

        Team.findById(teamId)
            .select(include || exclude)
            .lean()
            .then((doc) => {
                if (doc) {
                    res.json({
                        count: 1,
                        value: doc
                    });
                } else {
                    throw new Error('No hay equipo con este ID');
                }
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            });
    });

    app.post('/teams', json(), (req, res) => {
        const team = req.body;

        Team.create(team)
            .then((doc) => {
                res
                    .status(201)
                    .json({
                        count: 1,
                        value: doc
                    });
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            });
    });

    app.put('/teams/:teamId', json(), (req, res) => {
        const teamId = req.params.teamId;
        const updatePayload = req.body;

        Team.findByIdAndUpdate(teamId, updatePayload, {
            new: true,
            runValidators: true
        })
            .lean()
            .then((doc) => {
                if (doc) {
                    res.json({
                        count: 1,
                        value: doc
                    });
                } else {
                    throw new Error('No hay equipo con este ID');
                }
            })
            .catch((err) => {
                res
                    .status(400)
                    .json({
                        error: err.message
                    });
            });
    });

    app.patch('/teams/:teamId', json(), (req, res) => {
        const teamId = req.params.teamId;
        const updatePayload = req.body;

        Team.findByIdAndUpdate(teamId, updatePayload, {
             new: true
        })
            .lean()
            .then((doc) => {
                if (doc) {
                    res.json({
                        count: 1,
                        value: doc
                    });
                } else {
                    throw new Error('No hay equipo con este ID');
                }
            })
            .catch((err) => {
                res
                    .status(400)
                    .json({
                        error: err.message
                    });
            });
    });

    app.delete('/teams/:teamId', (req, res) => {
        const teamId = req.params.teamId;

        Team.findByIdAndDelete(teamId)
            .lean()
            .then((doc) => {
                if (doc) {
                    res.json({
                        count: 1,
                        value: doc
                    });
                } else {
                    throw new Error('No hay equipo con este ID');
                }
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            });
    });

    app.post('/teams/:teamId/goal', json(), (req, res) => {
        const teamId = req.params.teamId;

        const updateProps = {
            $push: {
                goals: req.body
            }
        };

        const options = {
            new: true
        };

        Team.findByIdAndUpdate(teamId, updateProps, options)
            .lean()
            .then((doc) => {
                if (doc) {
                    res.json({
                        count: 1,
                        value: doc
                    });
                } else {
                    throw new Error('No hay equipo con este ID');
                }
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            });
    });

    app.delete('/teams/:teamId/goal', json(), (req, res) => {
        const teamId = req.params.teamId;

        const updateProps = {
            $pull: {
                goals: req.body
            }
        };

        const options = {
            new: true
        };

        Team.findByIdAndUpdate(teamId, updateProps, options)
            .lean()
            .then((doc) => {
                if (doc) {
                    res.json({
                        count: 1,
                        value: doc
                    });
                } else {
                    throw new Error('No hay equipo con este ID');
                }
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            });
    });

    app.patch('/teams/:teamId/goal', json(), (req, res) => {
        const find = {
            _id: req.params.teamId,
            goal: {
                $elemMatch: req.body.find
            }
        };

        const updateProps = {
            $set: mapPayloadToUpdateObject(req.body.update, 'goals')
        };

        const options = {
            new: true
        };

        Team.findOneAndUpdate(find, updateProps, options)
            .lean()
            .then((doc) => {
                if (doc) {
                    res.json({
                        count: 1,
                        value: doc
                    });
                } else {
                    throw new Error('No hay equipo con este ID');
                }
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            });
    });

    app.get('/teams/:teamId/goal/last', (req, res) => {
        const teamId = req.params.teamId;

        const pipeline = [
            {
                $match: {
                    _id: mongoose.Types.ObjectId(teamId)
                }
            },
            {
                $unwind: '$goals'
            },
            {
                $sort: {
                    'goals.minute': 1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    lastGoal: {
                        $last: '$goals'
                    }
                }
            }
        ];

        Team.aggregate(pipeline)
            .then((agg) => {
                const goal = agg
                    .map((item) => item.lastGoal)
                    .reduce((prev, curr) => curr, null);

                if (goal) {
                    res.json({
                        count: 1,
                        value: goal
                    });
                } else {
                    throw new Error('Este equipo todavía no ha registrado goles');
                }
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            });
    });

    app.delete('/teams/:teamId/goal/last', (req, res) => {
        const teamId = req.params.teamId;

        const pipeline = [
            {
                $match: {
                    _id: mongoose.Types.ObjectId(teamId)
                }
            },
            {
                $unwind: '$goals'
            },
            {
                $sort: {
                    'goals.minute': 1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    lastGoal: {
                        $last: '$goals'
                    }
                }
            }
        ];

        Team.aggregate(pipeline)
            .then((agg) => {
                return agg
                    .map((item) => item.lastGoal)
                    .reduce((prev, curr) => curr, null);
            })
            .then((goal) => {
                if (goal) {
                    const updateProps = {
                        $pull: {
                            goals: {
                                _id: goal._id
                            }
                        }
                    };

                    const options = {
                        new: true
                    };

                    return Team.findByIdAndUpdate(teamId, updateProps, options);
                } else {
                    throw new Error('Este equipo todavía no ha registrado goles');
                }
            })
            .then((doc) => {
                res.json({
                    count: 1,
                    value: doc
                });
            })
            .catch((error) => {
                res
                    .status(400)
                    .json({
                        error: error.message
                    });
            });
    });
};

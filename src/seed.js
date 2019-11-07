const mongoose = require('mongoose');
const teams = require('./teams.json');
const { Team } = require('./models');

mongoose.connect('mongodb://localhost/clase07', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Base de datos lista para recibir conexiones');
        return Team.estimatedDocumentCount();
    })
    .then((count) => {
        if (count > 0) {
            return mongoose.connection.dropCollection(Team.collection.name);
        }
    })
    .then(() => {
        return Team.insertMany(teams);
    })
    .then((docs) => {
        console.log('Se guardaron los equipos en la base');
    })
    .catch(console.error)
    .finally(() => {
        mongoose.connection.close();
    });

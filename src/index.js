const express = require('express');
const mongoose = require('mongoose');
const app = express();
const setRoutes = require('./routes');

mongoose.connect('mongodb://localhost/node_mongoose_first_example', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Base de datos lista para recibir conexiones');

        setRoutes(app);

        app.listen(8080, () => {
            console.log('Servidor listo para recibir conexiones');
        });
    })
    .catch((error) => {
        console.error(error);

        mongoose.connection.close();
    });

const { Router } = require('express');

const attachRoutes = (app, { destinationsController }) => {
    const router = new Router();

    router
        .get('/', destinationsController.getDestinationsView)
        .get('/:id', destinationsController.getDestinationDetailsView);

    app.use('/destinations', router);
};

module.exports = attachRoutes;
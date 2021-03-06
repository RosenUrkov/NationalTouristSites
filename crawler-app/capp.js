require('./polyfills');
require('./models/extensions');

const selectors = require('./selectors');
const parseAreas = require('./parsers/area.parser');
const fileSystem = require('fs');

const landmarks = [];
parseAreas(selectors.BASE_URL)
    .then((data) => {
        fileSystem.writeFileSync('areas.json', JSON.stringify(data));
        data.forEach((a) => {
            a.landmarks.forEach((l) => {
                landmarks.push(l);
            });
        });

        fileSystem.writeFileSync('landmarks.json', JSON.stringify(landmarks));
    });

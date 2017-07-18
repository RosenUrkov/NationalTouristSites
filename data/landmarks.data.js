const Data = require('./abstractions');
const COLLECTION_NAME = 'landmarks';

class LandmarksData extends Data {
    constructor(database) {
        super(database, COLLECTION_NAME);
    }

    getByTitle(title) {
        return this.collection
            .find()
            .toArray()
            .then((landmarks) => {
                return landmarks.filter((l) => {
                    return l.title.includes(title);
                })[0];
            });
    }

    addComment(landmark, comment) {
        if (typeof comment === 'undefined' ||
            typeof comment.text !== 'string' ||
            comment.text.length > 200) {
            throw new Error('Invalid comment!');
        }

        if (!Array.isArray(landmark.comments)) {
            landmark.comments = [];
        }

        console.log(landmark);
        landmark.comments.push(comment);

        return this.collection.update({
            _id: landmark._id,
        }, landmark);
    }
}

module.exports = LandmarksData;

const passport = require('passport');

const DEFAULT_PICTURE_URL = 'http://www.gibbahouse.com/wp-content/uploads/2014/12/Funny-Animals-With-Makeup_.jpg';

const authController = (data) => {
    return {
        logout(req, res) {
            req.logout();
            req.toastr.success('You logged out successfully!');

            return res.status(200).redirect('/');
        },
        registerUser(req, res, errorMessage) {
            const user = req.body;
            user.pictureUrl = DEFAULT_PICTURE_URL;

            return data.landmarks.getAll()
                .then((landmarks) => {
                    user.landmarks = landmarks.map((l) => {
                        return {
                            title: l.title,
                            pictureUrl: l.pictureUrl,
                            isVisited: false,
                        };
                    });

                    return user;
                })
                .then((userToAdd) => {
                    return data.users.add(userToAdd);
                })
                .then((message) => {
                    req.toastr.success(message);
                    return res.status(201).redirect('/');
                })
                .catch((message) => {
                    req.toastr.error(message);
                    res.status(406).redirect('/register');
                });
        },
        logUser(req, res, next) {
            return passport.authenticate('local', (error, user, info) => {
                if (error) {
                    req.toastr.error(error);
                    res.status(404).redirect('/login');
                    return next(error);
                }

                req.logIn(user, (err) => {
                    if (err) {
                        req.toastr.error(err);
                        res.status(404).redirect('/login');
                        return next(err);
                    }

                    req.toastr.success('Hello, ' + user.username + '!');
                    res.status(200).redirect('/');
                    return next();
                });

                return next();
            })(req, res, next);
        },
        logFacebook(req, res, errorMessage) {
            return passport.authenticate('facebook', {
                scope: ['user_friends', 'manage_pages'],
            })(req, res, errorMessage);
        },
    };
};

module.exports = authController;

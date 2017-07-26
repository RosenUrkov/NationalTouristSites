const usersController = (data, utils) => {
    return {
        getLoginView(req, res) {
            if (req.isAuthenticated()) {
                res.status(301).redirect('/');
            } else {
                res.status(200).render('forms/login', {
                    context: {
                        isAuthenticated: req.isAuthenticated(),
                        user: req.user,
                    },
                });
            }
        },
        getRegisterView(req, res) {
            if (req.isAuthenticated()) {
                res.status(301).redirect('/');
            } else {
                res.status(200).render('forms/register', {
                    context: {
                        isAuthenticated: req.isAuthenticated(),
                        user: req.user,
                    },
                });
            }
        },
        getProfileView(req, res) {
            if (!req.isAuthenticated()) {
                res.status(301).redirect('/home');
            } else {
                res
                    .status(200)
                    .render('profile', {
                        context: {
                            isAuthenticated: req.isAuthenticated(),
                            user: req.user,
                        },
                    });
            }
        },
        uploadProfilePicture(req, res) {
            if (!req.user) {
                return res.status(401)
                    .redirect('/home');
            }

            const pictureUrl = '/static/images/uploads/' + req.file.filename;
            return data.users.updateProfilePicture(req.user, pictureUrl)
                .then(() => {
                    return res.status(201).redirect('/users/profile');
                });
        },
        getUserDestinationsView(req, res) {
            const targetUsername = req.params.username;

            return data.users.findUserByUsername(targetUsername)
                .then((user) => {
                    return res
                        .status(200)
                        .render('users/info', {
                            context: {
                                current: user,
                                user: req.user,
                                isAuthenticated: req.isAuthenticated(),
                            },
                        });
                });
        },
        getUsersView(req, res) {
            const page = Number(req.query.page);

            data.users.count()
                .then((usersCount) => {
                    const pagination = utils
                        .getPagination(page, usersCount);

                    return Promise.all([
                        data.users
                        .getRange(pagination.currentPage, pagination.pageSize),
                        pagination,
                    ]);
                })
                .then(([users, pagination]) => {
                    return res
                        .status(200)
                        .render('users/all', {
                            context: {
                                users,
                                isAuthenticated: req.isAuthenticated(),
                                user: req.user,
                                pagination,
                                currentPage: Number(page),
                                pageLink: 'users',
                            },
                        });
                });
        },
        getMessagesView(req, res) {
            if (!req.isAuthenticated()) {
                res.status(401).redirect('/');
            } else {
                const context = {
                    user: req.user,
                    isAuthenticated: req.isAuthenticated(),
                    friend: '',
                };

                if (req.query.user) {
                    context.friend = req.query.user;
                }

                res
                    .status(200)
                    .render('messages', { context });
            }
        },
    };
};

module.exports = usersController;

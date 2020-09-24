const models = require('../models');
const jwt = require('../utils/jwt');
const config = require('../config/config');

module.exports = {
    get: {
        login: (req, res, next) => {
            res.render('login', { pageTitle: 'Login Page' });
        },

        register: (req, res, next) => {
            res.render('register', { pageTitle: 'Register Page' });
        },

        logout: (req, res, next) => {
            res
                .clearCookie(config.cookie)
                .clearCookie("username")
                .redirect('/home');
        },

        account: (req, res, next) => {
            
            
            
            models.User.findById(req.user.id)
                .populate("expenses")
                .select("expenses")
                .then(e => {
                   
                    
                    totalExpenses = e.expenses.reduce((a,b) => a + b.total, 0)

                    const hbsObject = {
                        availableAmount: req.user.amount.toFixed(2),
                        totalAmount : (req.user.amount + totalExpenses).toFixed(2),
                        totalExpenses : e.expenses.length,
                        pageTitle: 'Account Page',

                    }
                    res.render('account', hbsObject);
                    
                })
                .catch(console.error)

                
        }
    },

    post: {
        login: (req, res, next) => {
            const { username, password } = req.body;

            models.User.findOne({ username })
                .then((userData) => Promise.all([userData, userData.matchPassword(password)]))
                .then(([userData, match]) => {
                    if (!match) {
                        res.render("login", { message: "Password or username is invalid" })
                        
                        return;
                    }

                    const token = jwt.createToken({ id: userData._id });

                    res
                        .cookie(config.cookie, token)
                        .cookie("username", userData.username)
                        .redirect('/');

                })
                .catch((err) => {
                    if (err.name === "ValidationError") {

                        const errorMassages = Object.entries(err.errors).map(tuple => {
                            return tuple[1].message
                        })
                        console.log(errorMassages)

                        res.render("register", { errorMassages })
                        return
                    }
                })

        },

        register: (req, res, next) => {
            const { username, password, repassword, amount } = req.body;

            if (password !== repassword) {
                res.render("register", { errorMassages: ["Both passwords should match"]})
                return
            }

            models.User.create({ username, password, amount : amount || 0 })
                .then(() => {

                    res.redirect('/user/login');
                })
                .catch((err) => {
                    if (err.name === "ValidationError") {

                        const errorMassages = Object.entries(err.errors).map(tuple => {
                            return tuple[1].message
                        })
                        console.log(errorMassages)

                        res.render("register", { errorMassages })
                        return
                    }
                })
        },

        refill: (req, res, next) => {
            const  refill = Number(req.body.refill);
            
            
            models.User.findById(req.user.id)
                .then((userData) => {
                    userData.amount += refill;

                    return models.User.findByIdAndUpdate({ _id: req.user._id }, userData)   
                })
                .then(() => {
                    res.redirect("/")
                })

                .catch(console.error);

        }
    }
};
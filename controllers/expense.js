const models = require('../models');
const config = require('../config/config');


module.exports = {
    get: {
        create: (req, res, next) => {

            const hbsObject = {
                pageTitle: 'Create Page'

            };
            res.render('create', hbsObject);
        },

        details: (req, res, next) => {

            const { id } = req.params;

            models.Expense.findById(id)
                .then((expense) => {
                    exp = expense._doc
                    exp.date = exp.date.toISOString().slice(0, 10)
                    exp.total = exp.total.toFixed(2)

                    const hbsObject = {
                        exp,
                        pageTitle: 'Expense Report',

                    }
                    res.render('details', hbsObject);
                }).catch(console.log);
        },


        delete: (req, res, next) => {
            const { id } = req.params;

            models.Expense
                .findByIdAndRemove(id)
                .then(() => {
                
                    req.user.expenses = req.user.expenses.filter(expID => expID.toString() !== id.toString())
                
                    return models.User.findByIdAndUpdate({ _id: req.user._id }, req.user)
                })
                .then(() => {
                    res.redirect("/")
                })
                .catch(console.error)
        }
    },

    post: {
        create: (req, res, next) => {

            

            const { merchant, total, category, description, report } = req.body;
            isOn = report === "on";
            

            models.Expense.create({ merchant, total, category, description, report: isOn, expenseUser: req.user._id })
                .then((eData) => {
                    req.user.expenses.push(eData._id)
                    req.user.amount = Number(req.user.amount) - Number(total)
                    
                    return models.User.findByIdAndUpdate({ _id: req.user._id }, req.user)
                })
                .then(() => {
                    res.redirect("/")
                })
                .catch((err) => {
                    console.log(err)
                    const errorMassages = Object.entries(err.errors).map(tuple => {
                        return tuple[1].message
                    })
                    console.log(errorMassages)

                    res.render("create", { errorMassages })
                })
        },


    },


};
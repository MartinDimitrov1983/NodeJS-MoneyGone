const config = require('../config/config');
const models = require('../models');
const auth = require('../utils/auth');


module.exports = {
    get: {
        home: (req, res, next) => {

            models.Expense.find()
                .then((expense) => {

                    if (req.cookies[config.cookie] !== undefined) {
                        expense = expense.filter(exp => exp.expenseUser.toString() === req.user._id.toString())
                    }


                    const hbsObject = {
                        pageTitle: 'Home Page',
                        expenses: expense.map(e => {
                            e = e._doc
                            
                            e.date = e.date.toISOString().slice(0, 10)
                            return e
                        })
                    };
                    res.render('home', hbsObject);

                })
                .catch(console.error)
        }

    }
}

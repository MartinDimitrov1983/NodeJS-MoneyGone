const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;

const expenseSchema = new Schema({

    merchant: {
        type: mongoose.SchemaTypes.String,
        required: [true, "Merchent reqiured"]
    },

    date:{
        type: mongoose.SchemaTypes.Date,
        default: Date.now
    },

    total: {
        type: mongoose.SchemaTypes.Number,
        required: [true, "Total reqiured"]
    },

    category: {
        type: mongoose.SchemaTypes.String,
        required: [true, "Category reqiured"]
    },

    description: {
        type: mongoose.SchemaTypes.String,
        required: [true, "Description reqiured"],
        minlength: [10, "Expense description should be at least 10 characters long..."],
        maxlength: [50, "Expense description should be at max 50 characters long..."]
    },

    report:{
        type: mongoose.SchemaTypes.Boolean,
        required:[true, "Report reqiured"],
        default: false
    },

    expenseUser: {
        type: mongoose.SchemaTypes.ObjectId,
        required:true,
        ref: 'User'
    }
});


module.exports = new Model('Expense', expenseSchema);
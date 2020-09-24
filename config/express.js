const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');
const config = require('../config/config');

module.exports = (app) => {
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.engine('hbs', handlebars({
        layoutsDir: 'views',
        defaultLayout: 'main-layout',
        partialsDir: 'views/partials',
        extname: 'hbs'
    }));

    app.use((req, res ,next) => {
        res.locals.isLoggedIn = req.cookies[config.cookie] !== undefined;
        res.locals.username = req.cookies['username'];

        next(); 
    })

    app.set('view engine', 'hbs');

    app.use(express.static('./static'));

    
};
const path = require('path');
const express = require('express');

const configViewsEngine = (app) => {
    app.set('view', path.join('./src', 'view'));
    app.set('view engine', 'ejs');


    app.use(express.static(path.join('./src', '../../public')));
}
module.exports = configViewsEngine;
// db stuff
const port = 3000;
const conn = require('./db/conn');

// requires
const pg = require('pg');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
require('dotenv').config();

const app = express();

// template engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session
app.use(
  session({
    name: 'session',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: () => { },
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      httpOnly: true,
    },
  })
);

// flash
app.use(flash());

// templates
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

// db tables
const User = require('./models/User');
const Income = require('./models/Income');
const FinanceGoal = require('./models/FinanceGoal');
const Expense = require('./models/Expense');

// routes
const homeRoute = require('./routes/homeRoute');
const HomeController = require('./controllers/HomeController');
const authRoute = require('./routes/authRoute');
const AuthController = require('./controllers/AuthController');
const dashboardRoute = require('./routes/dashboardRoute');
const DashboardController = require('./controllers/DashboardController');

app.use('/', homeRoute);
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);

// 404
app.use((req, res, next) => {
  res.status(404).render('error/404');
});

// server
conn
  //.sync({force:true})
  .sync()
  .then(() =>
    app.listen(port, () => console.log(`> Server on | http://localhost:${port}`))
  )
  .catch((err) => console.log(`Sync Error: ${err}`));
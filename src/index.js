const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const PORT = 3000;

const app = express();

const conn = require('./db/conn');

//Models
const Tought = require('./models/Tought');
const User = require('./models/User');

//Import Routes
const toughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require('./routes/authRoutes');

//Import Controller
const ToughtsController = require('./controllers/ToughtsController');

//Engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//Receber resposta do body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Definir pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//session middleware
app.use(session({
  name: "session",
  secret: "nosso_secret",
  resave: false,
  saveUninitialized: false,
  store: new FileStore({
    logFn: function() {},
    path: path.join(os.tmpdir(), 'sessions'),
  }),

  cookie: {
    secure: false,
    maxAge: 360000,
    expires: new Date(Date.now() + 360000),
    httpOnly: true
  }
}))

//flash messages
app.use(flash());

//set session to restore
app.use(( req, res, next ) => {
  
  if(req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

// Models


// routes
app.use('/toughts', toughtsRoutes);
app.use('/', authRoutes);

app.get('/', ToughtsController.showToughts);

conn
  //.sync({ force: true })
  .sync()
  .then(() => {

  app.listen(PORT, () => {
    console.log(chalk.bgGreenBright.blackBright(`Servidor rodando na URL http://localhost:${PORT}`));
  })

}).catch((err) => {
  console.log(chalk.bgRedBright.blackBright(`ERRO: ${err}`));
});
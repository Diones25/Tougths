const User = require('../models/User');
const bcrypt = require('bcryptjs');
const chalk = require('chalk');

module.exports = class AuthController {

  static login(req, res) {
    res.render('auth/login')
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    //verificar se usuário existe
    const user = await User.findOne({where: {email: email}});

    if(!user) {
      req.flash('message', 'Usuário não encontrado!');
      res.redirect('/login');

      return
    }

    //verificar se a senha está correta
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if(!passwordMatch) {
      req.flash('message', 'Senha inválida!');
      res.redirect('/login');

      return
    }

    // auth user
    req.session.userid = user.id

    req.flash('message', 'Login realizado com sucesso!')

    req.session.save(() => {
      res.redirect('/')
    })
  }

  static register(req, res) {
    res.render('auth/register')
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body; 

    //password match validation
    if(password != confirmpassword) {
      //enviar mansagem
      req.flash('message', 'As senhas não conferem, tente novamente!');
      res.render('auth/register');

      return;
    }

    //ckeck if user exists
    const checkIfUserexists = await User.findOne({ where: { email: email } })

    if(checkIfUserexists) {      
      req.flash('message', 'O e-mail já está em uso!');      
      res.redirect('/register');
      return;
    }

    //create password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = {
      name,
      email,
      password: hashedPassword,
    }

    User.create(user).then((user) => {
      //initialize session
      req.session.userid = user.id;

      req.flash('message', 'Cadastro realizado com sucesso!');

      req.session.save(() => {
        res.redirect('/');
      });

    }).catch((err) => {
      console.log(chalk.bgRedBright.black(`ERRO: ${err}`));
    })
    
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect('/login'); 
  }

}
const chalk = require('chalk');
const Toughts = require('../models/Tought');
const User = require('../models/User');

class ToughtsController {
  static async showToughts(req, res) {
    res.render('toughts/home');
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: {
        id: userId
      },
      include: Toughts,
      plain: true,
    });

    //check user exists
    if(!user) {
      res.redirect('/login');
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    //console.log(toughts)  

    res.render('toughts/dashboard', { toughts });
  }

  static createTought(req, res) {
    res.render('toughts/create');
  }    

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    }

    try {
      await Toughts.create(tought)

      req.flash('message', 'Pensamento criado com sucesso!');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });

    }catch(error) {
      console.log(chalk.bgRedBright.black(`ERRO: ${error}`))
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid

    try {

      await Toughts.destroy({ where: { id: id, UserId: UserId} })

      req.flash('message', 'Pensamentor removido com sucesso!');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });

    }catch(error) {
      console.log(chalk.bgRedBright.black(`Aconteceu um erro: ${error}`))
    }
  }
  
}

module.exports = ToughtsController;
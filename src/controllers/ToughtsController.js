const chalk = require('chalk');
const Toughts = require('../models/Tought');
const User = require('../models/User');

const { Op } = require('sequelize');

class ToughtsController {
  static async showToughts(req, res) {

    let search = '';

    if(req.query.search) {
      search = req.query.search;
    }

    let order = 'DESC';

    if(req.query.order ==='old') {
      order = 'ASC'
    }
    else {
      order = 'DESC'
    }

    const toughtsData = await Toughts.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%`}
      },
      order: [['createdAt', order]]
    });

    const toughts  = toughtsData.map((result) => result.get({ plain: true }));

    let toughtQty = toughts.length;

    if(toughtQty === 0) {
      toughtQty = false;
    }

    res.render('toughts/home', {toughts, search, toughtQty});
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

    let emptyToughts = false;
    
    if( toughts.length == 0) {
      emptyToughts = true;
    }

    res.render('toughts/dashboard', { toughts, emptyToughts });
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

      req.flash('message', 'Pensamento removido com sucesso!');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });

    }catch(error) {
      console.log(chalk.bgRedBright.black(`Aconteceu um erro: ${error}`))
    }
  }  

  
  static async updateTought(req, res) {
    const id = req.params.id;

    Toughts.findOne({ where: { id: id }, raw: true })
    .then((data) => {
      res.render('toughts/edit', { tought: data });
    });
    

  }

  static async updateToughtSave(req, res) {
    const id = req.body.id;
    
    const tought = {
      title: req.body.title,

    }

    try {

      await Toughts.update(tought, { where: { id: id } })

      req.flash('message', 'Pensamento atualizado com sucesso!');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });

    }catch(error) {
      console.log(chalk.bgRedBright.black(`Aconteceu um erro: ${error}`))
    }
  }
}

module.exports = ToughtsController; 
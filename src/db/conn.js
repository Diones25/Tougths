const { Sequelize } = require('sequelize');
const chalk = require('chalk');

const sequelize = new Sequelize('toughts', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

try {

  sequelize.authenticate();
  console.log(chalk.bgGreenBright.blackBright('Conectado com sucesso!'));

}catch(err) {
  console.log(chalk.bgRedBright.black(`Não foi possível conectar: ${err}`));
}

module.exports = sequelize; 
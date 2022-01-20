const db = require("./db");

// Criando modelo de usuario
const User = db.sequelize.define("user", {
  name: {
    type: db.Sequelize.STRING,
  },
  password: {
    type: db.Sequelize.STRING,
  },
  eAdmin: {
    type: db.Sequelize.INTEGER,
    defaultValue: 0,
  },
});

const Dogs = db.sequelize.define("dog", {
  name: {
    type: db.Sequelize.STRING,
  },
  raça: {
    type: db.Sequelize.STRING,
  },
});
// Criando a tabela user e dog
//User.sync()
/*  .then(() => console.log('Tabela de Usuarios criada com sucesso'))
  .catch(err => console.log('Verifique se dados do banco estão corretos'));
  Dogs.sync()
  .then(() => console.log('Tabela de caes criada com sucesso'))
  .catch(err => console.log('Verifique se dados do banco estão corretos')); */

//User.sync({force: true})
//Dogs.sync({force: true})
module.exports = {
    User: User,
    Dogs: Dogs,
  };
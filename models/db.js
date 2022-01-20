// cria tabelas com js
const Sequelize = require("sequelize");

// conexão com o banco de dados MySql
const sequelize = new Sequelize({
  database: "crud",
  username: "root",
  password: "",
  dialect: "mysql",
});

// checando conexão com o DB
sequelize
  .authenticate()
  .then(() => console.log("Conectado com sucesso no banco."))
  .catch((err) =>
    console.error("Nao foi possivel conectar no banco de dados", err)
  );

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
};

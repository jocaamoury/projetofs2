const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const handlebars = require('express-handlebars')
const Post = require('./models/Post')
const { Dogs, User } = require('./models/Post');
const path = require('path')
const session = require('express-session')
const flash = require("connect-flash");
const { sequelize } = require('./models/db');
const localStrategy = require('passport-local').Strategy;
const { fail } = require('assert');
const bcrypt = require('bcryptjs')
const {eAdmin} = require("./helpers/eAdmin")





const passport = require('passport');
const passportJWT = require('passport-jwt');




// Criando o Jwt Token
/*let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
// Usando o token Jwt
/*passport.use(new localStrategy({usernameField: 'name'}, (nameUser, password, done) => {
  User.findOne({where: {'name': req.body.nameUser}}).then((usuario) => {
    if(!usuario){
      return done(null, false, {message: 'Essa conta não existe'})
    }
  })
}));
passport.serializeUser((usuario, done) => {
  done(null, usuario.id)
})
passport.deserializeUser((id, done) =>{
  User.findById(id, (err, usuario) => {
    done(err, usuario)
  })
})
*/
//public

const app = express();
app.use(express.static(path.join(__dirname,'public')))
// config
  //template engine
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main',
  runtimeOptions: {
  allowProtoPropertiesByDefault: true,
  allowProtoMethodsByDefault: true,
  }
}))

app.set('view engine', 'handlebars')
app.set('views', './views');
// iniciando passport com o express
//app.use(passport.initialize());
app.use(cors());
//sessao
app.use(session({
  secret: "123",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(passport.initialize())
app.use(passport.session())
// flash
app.use (flash())
// middleware
app.use((req, res ,next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash('error')
  next()
})
// Iniciando o body-parse/ configurando
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// arquivos estaticos
app.use("/static", express.static('./static/'));
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = '123';
// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
passport.use(strategy);

// funções auxiliares para o DB



const createUser = async ({ name, password }) => {
  return await User.create({ name, password });
};

const createDog = async ({ name, raça }) => {
  return await Dogs.create({ name, raça });
};

const getAllUsers = async () => {
  return await User.findAll();
};


const getAllDogs = async () => {
  return await Dogs.findAll();
};

const getUser = async obj => {
  return await User.findOne({
    where: obj,
  });
};

// ROTAS -----------------------------------------------------------------------------------------------------
app.get('/inicio',eAdmin, function(req, res){
  res.render('./layouts/inicio')
  console.log(req.session.logado)
})
app.post('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/login')
})
app.get('/inicio2', function(req, res){
  res.render('./layouts/inicio2')
  console.log(req.session.logado)
})

app.get('/', function(req, res) {
  res.redirect('/login')
});

// PUXANDO TODOS OS USUARIOS
app.get('/users', function(req, res) {
  getAllUsers().then(user => res.json(user));
});
// PUXANDO TODOS OS CACHORROS
app.get('/dogs', function(req, res) {
  getAllDogs().then(dogs => res.send(dogs));
});

// REGISTRANDO USUÁRIO COM VALIDAÇÕES
app.post('/addUser',eAdmin, function(req, res){
  var erros = []
  if(!req.body.nameUser || typeof req.body.nameUser == undefined || req.body.nameUser == null ){
    erros.push({texto: "Nome inválido"})
  }
  if(req.body.nameUser.length < 2 ||  req.body.password.length < 2){
    erros.push({texto: "Nome e senha deverão ter mais de 2 caractéres."})
  }

  if(!req.body.password || typeof req.body.password == undefined || req.body.password == null ){
    erros.push({texto: "Senha inválida"})
  }

  if(erros.length > 0 ){
    res.render("./layouts/inicio", {erros: erros})
  }else{
    User.findOne({where: {'name': req.body.nameUser}}).then((usuario) =>{
      if(usuario){
        req.flash('error_msg', 'Ja existe uma conta com esse usuario')
        res.redirect('/inicio')
      }else{
        var salt = bcrypt.genSaltSync(10)
          var hash = bcrypt.hashSync(req.body.password, salt)
          User.create({
            name: req.body.nameUser,
            password: hash,
          }).then(() => {
            req.flash('success_msg', 'Sucesso')
            res.redirect('/inicio')
          }).catch((err) => {
            req.flash('error_msg', 'Houve um erro')
            res.redirect('/inicio')
          })
      }
    })
  }
})


        /*User.create({
          name: req.body.nameUser,
          password: req.body.password*/
        /*.then(function(){
          req.flash('success_msg', 'Conta criada com sucesso!')
          res.redirect('./inicio')
        }).catch(function(erro){
          res.send('Houve um erro!')
        })

      }
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro interno')
      res.redirect('/inicio')
    })*/

  


// REGISTRANDO CACHORRO COM VALIDAÇÕES
app.post('/addDog',eAdmin, function(req, res){
  var erros = []
  if(!req.body.nameDog || typeof req.body.nameDog == undefined || req.body.nameDog == null ){
    erros.push({texto: "Nome do cachorro inválido"})
  }
  if(req.body.nameDog.length < 2 ||  req.body.raça.length < 2){
    erros.push({texto: "Nome e raça deverão ter mais de 2 caractéres."})
  }

  if(!req.body.raça || typeof req.body.raça == undefined || req.body.raça == null ){
    erros.push({texto: "Raça inválida"})
  }
  if(erros.length > 0 ){
    res.render("./layouts/inicio", {erros: erros})
  }else{
    Dogs.create({
      name: req.body.nameDog,
      raça: req.body.raça
    }).then(function(){
      req.flash('success_msg', 'Cachorro criado com sucesso')
      res.redirect('./inicio')
    }).catch(function(erro){
      res.send('Houve um erro!')
    })
  }
})

// DELETANDO CACHORRO
app.get('/deletarDog/:id',eAdmin, function(req, res){
  Dogs.destroy({where: {'id': req.params.id}}).then(function(){
    req.flash('success_msg', 'Cachorro deletado com sucesso!')
    res.redirect('/inicio')
  }).catch(function(erro){
    res.send("Essa postagem nao existe")
  })
})

// DELETANDO USUARIO
app.get('/deletarUser/:id',eAdmin, function(req, res){
  User.destroy({where: {'id': req.params.id}}).then(function(){
    req.flash('success_msg', 'Usuário deletado com sucesso!')
    res.redirect('/inicio')
  }).catch(function(erro){
    res.send("Essa postagem nao existe")
  })
})

// EDITANDO CACHORROS E USUARIOS
// Colocando values na pagina de edição dos CACHORROS
app.get('/editarDog/:id',eAdmin, function(req, res){
  Dogs.findOne({where: {'id': req.params.id}}).then((editdogs)=>{
    res.render('./layouts/editDogs', {editdogs :editdogs})
}).catch((err) => {
  req.flash('error_msg', 'Esta categoria não existe')
  res.redirect('./layouts/editDogs')
})
})
//Postando a edição dos CACHORROS
app.post('/editarcachorro',eAdmin, (req, res) => {
  Dogs.findOne({where: {'id': req.body.id}}).then((editdogs)=>{
    editdogs.name = req.body.nameDog,
    editdogs.raça = req.body.raça

    editdogs.save().then(() =>{
      req.flash('success_msg', 'Cachorro alterado com sucesso!')
      res.redirect('/inicio')
    }).catch((err) =>{
      req.flash('error_msg', 'Erro interno')
      res.redirect('/inicio')
    })
}).catch((err) => {
  req.flash('error_msg', 'Houve um erro ao editar')
})
})
// Colocando values na pagina de edição dos USUARIOS
app.get('/editarUser/:id',eAdmin, function(req, res){
  User.findOne({where: {'id': req.params.id}}).then((edituser)=>{
    res.render('./layouts/editUser', {edituser :edituser})
}).catch((err) => {
  req.flash('error_msg', 'Este usuário não existe')
  res.redirect('./layouts/editUser')
})
})
//Postando a edição dos USUARIOS
app.post('/editarusuario',eAdmin, (req, res) => {
  User.findOne({where: {'id': req.body.id}}).then((edituser)=>{
    edituser.name = req.body.nameUser,
    edituser.password = req.body.password

    edituser.save().then(() =>{
      req.flash('success_msg', 'Usuário alterado com sucesso!')
      res.redirect('/inicio')
    }).catch((err) =>{
      req.flash('error_msg', 'Erro interno')
      res.redirect('/inicio')
    })
}).catch((err) => {
  req.flash('error_msg', 'Houve um erro ao editar')
})
})
// FIM EDIÇÃO
//login
app.get('/login', (req, res) =>{
  res.render('./layouts/login')
})
//Auth
/*app.post('/auth', (req, res, next) =>{
  passport.authenticate('local', {
    successRedirect: '/inicio',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
})*/

app.post('/login2', async function(req, res, next) {
  const { name, password } = req.body;
  if (name && password) {
    let user = await getUser({ name: name });
    if (!user) {
      res.status(401).json({ message: 'Usuario nao encontrado' });
    }
    if (user.password === password) {
      // from now on we'll identify the user by the id and the id is the 
      // only personalized value that goes into our token
      let payload = { id: user.id };
      let token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ msg: 'ok', token: token });
    } else {
      res.status(401).json({ msg: 'Senha incorreta' });
    }
  }
});
app.get('/users2',passport.authenticate('jwt', { session: false }), function(req, res) {
  getAllUsers().then(user => res.json(user));
});
// login

app.post('/auth', async (req, res) => {
  const {nameUser, password} = req.body
  const userWithEmail = await User.findOne({where: {'name': req.body.nameUser}}).catch((err) =>{
  console.log('Error:', err)
  })
  if(!userWithEmail){
  req.flash('error_msg', 'Usuario não existe')
  res.redirect('/login')
  }
  if(userWithEmail.password !== password){
    req.flash('error_msg', 'Senha invalida, tente novamente!')
    res.redirect('/login')
  }else{

  const jwtToken = jwt.sign(
    { id: userWithEmail.id, name: userWithEmail.nameUser },
    '123', { expiresIn: 300}

  );
  if(userWithEmail.eAdmin == 1){
    req.session.admin = 'admin'
    req.flash('success_msg', `Admin logado com sucesso, Token: ${jwtToken}`)
    res.redirect('/inicio')
  }else{
    req.flash('success_msg', `Usuario logado com sucesso, Token: ${jwtToken}`)
    res.redirect('/inicio2')
  }

  }
});

// rota proteginda
app.get('/protegido', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.json('Dentro da area restrita.');
});

// start app
const PORT = process.env.PORT || 3000
app.listen(PORT,() => {
  console.log("Servidor rodando.")
})
module.exports = {
  eAdmin: function (req, res, next) {
    if (req.session.admin == 'admin') {
      console.log(req.session.admin)
      return next();
    }else {
      req.flash('error_msg', 'Você precisa ser Admin para acessar essa rota')
      res.redirect('/login')
    }
  },
};

/*exports.isAdmin = (req, res, next) => {

    if (req.user.eAdmin == 1) {
        next();
    } else {
        req.flash("error_msg", "please log in as admin");
        res.redirect("/inicio");
    }
}*/
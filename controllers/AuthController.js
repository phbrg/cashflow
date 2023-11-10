const User = require('../models/User');
const FinanceGoal = require('../models/FinanceGoal');
const bcrypt = require('bcryptjs');

module.exports = class AuthContoller {
  static getRegister(req, res) {
    res.render('auth/register');
  }

  static async postRegister(req, res) {
    const { name, cpf, income, email, password, confirmPassword } = req.body;

    if(!name || !cpf || !income || !email || !password || !confirmPassword) {
        req.flash('message', 'Invalid credentials');
        res.render('auth/register');
  
        return;
    }
    if(name.length > 255 || cpf.length > 255 || income.length > 255 || email.length > 255 || password.length > 255 || confirmPassword.length > 255) {
        req.flash('message', 'Credentials too big');
        res.render('auth/register');
  
        return;
    }
    if(password !== confirmPassword) {
        req.flash('message', 'Password does not match');
        res.render('auth/register');
  
        return;
    }
    if(password.length < 6) {
        req.flash('message', 'Password too short');
        res.render('auth/register');
  
        return;
    }
    if(cpf.length > 14) {
        req.flash('message', 'Invalid cpf');
        res.render('auth/register');
  
        return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(email)) {
      req.flash('message', 'Invalid email');
      res.render('auth/register');

      return;
    }

    const EmailExist = await User.findOne({ where: { email: email } });

    if(EmailExist) {
      req.flash('message', 'Email alredy registered');
      res.render('auth/register');

      return;
    }

    const CpfExist = await User.findOne({ where: { cpf: cpf } });

    if(CpfExist) {
      req.flash('message', 'Cpf alredy registered');
      res.render('auth/register');

      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name: name.toLowerCase(),
      cpf,
      balance: income,
      email,
      password: hashedPassword
    }

    User.create(user)
      .then((user) => {
        req.session.userid = user.id;

        req.session.save(() => {
          res.redirect('/dashboard');
        })
      })
      .catch((err) => console.log(err));
  }

  static getLogin(req, res) {
    res.render('auth/login');
  }

  static async postLogin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if(!user) {
      req.flash('message', 'Email not registered');
      res.render('auth/register');

      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash('message', 'Invalid credentials.')
      res.render('auth/login');

      return;
    }

    req.session.userid = user.id;

    req.session.save(() => {
      res.redirect(`/dashboard`);
    });
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect('/auth/login');
  }
}

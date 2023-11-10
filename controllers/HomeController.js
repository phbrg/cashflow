module.exports = class HomeContoller {
  static homePage(req, res) {
    res.render('home/home');
  }
}
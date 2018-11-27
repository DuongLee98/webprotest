var express = require('express');
var webservice = require('../../protest/webservice');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	return res.redirect('/login');
});
router.get('/t/:user',async function(req, res, next) {
	var data = req.params;
	if (res.locals.login != true)
	{
		return res.redirect('/login');
	}
	var ws = {};

	ws.tuser = data.user;
	var info = await webservice.getInfoOfTeacher(res.locals, 'getInfoOfTeacher', 'rgetInfoOfTeacher', ws);
	if (info.cd == 0)
	{
		info.data.tuser = ws.tuser;
		res.render('teacher/user', info.data);
	}
});

router.get('/t/:user/group',async function(req, res, next) {
	var data = req.params;
	if (res.locals.login != true)
	{
		return res.redirect('/login');
	}
	var ws = {};
	ws.userteacher = data.user;
	var info = await webservice.getInfoAllGroupTeacherManage(res.locals, 'getInfoAllGroupTeacherManage', 'rgetInfoAllGroupTeacherManage', ws)
	if (info.cd == 0)
	{
		res.render('tlistgroup', info.data);
	}
});

router.get('/t/:tuser/exam',async function(req, res, next) {
	var data = req.params;
	if (res.locals.login != true)
	{
		return res.redirect('/login');
	}
	var ws = res.locals;
	ws.tuser = data.tuser;
	res.render('teacher/user_listexam', ws);
});

// router.post('/:user',async function(req, res, next) {
// 	var data = req.params;
// 	if (res.locals.login != true)
// 	{
// 		return res.redirect('/login')
// 	}
// 	res.send(req.body.firstname);
	// var ws = {};
	// ws.tuser = data.user;
	// var info = await webservice.getInfoOfTeacher(res.locals, 'getInfoOfTeacher', 'rgetInfoOfTeacher', ws);
	// if (info.cd == 0)
	// {
	// 	res.render('tuser', info.data);
	// }
	// res.send(data.user + ' - ' + res.locals.user + ' ' + res.locals.lg + ' ' +res.locals.login+'\r\n'+JSON.stringify(info));
// });
module.exports = router;

var express = require('express');
var webservice = require('../../protest_secured/webservice');
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
		info.data.user = data.user;
		res.render('teacher/user', info.data);
	}
});

router.get('/s/:user',async function(req, res, next) {
	var data = req.params;
	if (res.locals.login != true)
	{
		return res.redirect('/login');
	}
	var ws = {};

	ws.suser = data.user;
	var info = await webservice.getInfoOfStudent(res.locals, 'getInfoOfStudent', 'rgetInfoOfStudent', ws);
	if (info.cd == 0)
	{
		info.data.suser = ws.suser;
		info.data.user = data.user;
		res.render('student/user', info.data);
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
	ws.user = data.tuser;
	res.render('teacher/user_listexam', ws);
});


module.exports = router;

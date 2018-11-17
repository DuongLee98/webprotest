var express = require('express');
var webservice = require('../../protest/webservice');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	return res.redirect('/login');
});
router.get('/:eid', async function(req, res, next){
	var data = req.params;
	if (res.locals.login != true)
	{
		return res.redirect('/login');
	}
	var ws = {};
	ws.eid = data.eid;
	var info = await webservice.getExam(res.locals, 'getExam', 'rgetExam', ws);
	if (info.cd == 0)
	{
		res.send(info.data)
	}
	else
	{
		res.send(info);
	}
})

module.exports = router;
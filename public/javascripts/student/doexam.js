let length = 0;
class Qt
{
	constructor(qt, slen, sarr)
	{
		this.qt = qt;
		this.slen = slen;
		this.sarr = sarr;
		this.aw = -1;
	}
	render(i)
	{
		var rs = "";
		var p1 = '<div class="card-header">Question '+i+'</div><div class="card-body"><div class="form-group"><label class="col-sm-12 col-form-label">Question:</label><div class="col-sm-12"><textarea id="'+'Q'+i+'A'+'" name="qarr['+i+']" class="form-control" rows="5" placeholder="Enter your question" disabled="disabled">'+this.qt+'</textarea></div></div>'
		rs=p1;
		var p2 = "";
		for (var j=0; j<this.slen; j++)
		{
			if (j == this.aw)
				p2+=this.getP2(i, j, true);
			else
				p2+=this.getP2(i, j, false);
		}
		rs = p1+p2;
		return rs;
	}
	getP2(vt, i, checked)
	{
		if (checked == false)
			return '<div id="'+'Q'+vt+'S'+i+'N'+'" class="btn-toolbar mb-1" role="toolbar" aria-label="Toolbar with button groups"><div class="form-check" name="0"><input name="aarr['+vt+']" onclick="Select('+vt+', '+i+')" value="'+i+'" class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" ></div><div class="input-group col-sm-10"><input id='+'Q'+vt+'S'+i+'O'+' name="sarr['+vt+']" type="text" class="form-control" value="'+this.sarr[i]+'" readonly="readonly"></div></div>'
		else
			return '<div id="'+'Q'+vt+'S'+i+'N'+'" class="btn-toolbar mb-1" role="toolbar" aria-label="Toolbar with button groups"><div class="form-check" name="0"><input name="aarr['+vt+']" onclick="Select('+vt+', '+i+')" value="'+i+'" class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" checked></div><div class="input-group col-sm-10"><input id='+'Q'+vt+'S'+i+'O'+' name="sarr['+vt+']" type="text" class="form-control" value="'+this.sarr[i]+'" readonly="readonly"></div></div>'
	}

}
var qarr = [];
function setup()
{
	document.getElementById("form").innerHTML = '';
	for (var i=0; i<length; i++)
	{
		document.getElementById("form").innerHTML += '<div id="'+'Q'+(i)+'" class="card mb-3">'+qarr[i].render(i)+'</div>'
	}

}
function Select(q, s)
{
	qarr[q].aw = s;
}

var socket = io(httpSocket);
let AllData = {};
let GroupData = {};
let TimeEnd24 = {};
socket.emit('login', {'user': suser, 'pass': pass});

socket.on('rlogin', function(data)
{
	getExam();
	socket.on('rgetExamload', function(data)
	{
		document.getElementById('iloadertext').innerHTML = data+"%";
	})
	socket.on('rgetExam', function(info)
	{
		if (info.cd == 0)
		{
			AllData = info.data;
			TimeEnd24 = separationTime(AllData.timeEnd);
			setViewGeneral()
			length = info.data.qlen;
			for (var i=0; i<length; i++)
			{
				var q = info.data.qarr[i];
				var t = new Qt(q.q, q.slen, q.sarr);
				qarr.push(t);
			}
			setup();
			showPage();
			getTimeStamp();
		}
	})

	socket.on('rgetTimeStamp', function(info){
		if (info.cd == 0)
		{
			var dif = caculateTimeLeft(info.data);
			document.getElementById('tool').innerHTML = dif.hour+" hour : "+dif.minute+" minute : "+dif.sec+" second left";
			setTimeout(getTimeStamp, 1000);
		}
	})

	socket.on('rautoMask', function(info){
		if (info.cd == 0)
		{
			alert(info.data);
			showPage();
		}
	})
});

function rs()
{
	let aarr = [];
	for(var i=0; i<length; i++)
	{
		aarr.push(qarr[i].aw);
	}
	data = {};
	data.alen = length;
	data.aarr = aarr;
	return data;
}

function submit()
{
	data = rs();
	data.eid = eid;
	socket.emit('autoMask', data);
	loadPage();
}

function caculateTimeLeft(TimeNow12)
{
	TimeNow24 = separationTime(TimeNow12);
	let dif = {};
	var b = new Date(TimeEnd24.year, TimeEnd24.month, TimeEnd24.day, TimeEnd24.hour, TimeEnd24.minute, TimeEnd24.sec, 0);
	var a = new Date(TimeNow24.year, TimeNow24.month, TimeNow24.day, TimeNow24.hour, TimeNow24.minute, TimeNow24.sec, 0);
	var d = parseInt(b-a);
	dif.sec = parseInt(d/1000)%60;
	dif.minute = parseInt(d/1000/60)%60;
	dif.hour = parseInt(d/1000/60/60);
	if (d<=0)
		dif.done = true;
	else
		dif.done = false;
	return dif;
}


function getTimeStamp()
{
	socket.emit('getTimeStamp');
}

function getExam()
{
	socket.emit('getExam', {eid: eid});
	loadPage();
}

function setExam()
{
	for (var i=0; i<length; i++)
	{
		Set(i);
	}
	var data = {};
	data.eid = AllData.eid;
	data.tuser = AllData.tuser;
	data.qlen = parseInt(length);
	data.qarr = [];
	data.aarr = [];
	for (var i=0; i<length; i++)
	{
		info = {};
		info.q = qarr[i].qt;
		info.slen = parseInt(qarr[i].slen);
		info.sarr = qarr[i].sarr;
		data.qarr.push(info);
		data.aarr.push(parseInt(qarr[i].aw));
	}
	console.log(data);
	socket.emit('setExam', data);
	loadPage();
}


function setViewGeneral()
{
	document.getElementById('eid').value = AllData.eid;
	document.getElementById('created').value = AllData.created;
	document.getElementById('ename').value = AllData.name;
	document.getElementById('type').value = AllData.type;
	document.getElementById('publish').checked = AllData.publish;
	var dat = AllData.timeStart.split('-')
	document.getElementById('timestart').value = dateConvertor(dat[0])+'T'+timeConvertor(dat[1]);
	var dat = AllData.timeEnd.split('-')
	document.getElementById('timeend').value = dateConvertor(dat[0])+'T'+timeConvertor(dat[1]);
}
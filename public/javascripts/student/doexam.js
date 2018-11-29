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
			TimeEnd = AllData.timeEnd;
			setViewGeneral()
			length = info.data.qlen;
			for (var i=0; i<length; i++)
			{
				var q = info.data.qarr[i];
				var t = new Qt(q.q, q.slen, q.sarr);
				qarr.push(t);
			}
			setup();
			
			getTimeStamp();
		}
		else
		{
			alert(info.msg);
		}
		showPage();
	})

	socket.on('rgetTimeStamp', function(info){
		if (info.cd == 0)
		{
			var dif = caculateTimeLeft(info.data);
			document.getElementById('tool').innerHTML = 'Time Left: '+dif;
			setTimeout(getTimeStamp, 1000);
		}
	})

	socket.on('rautoMask', function(info){
		if (info.cd == 0)
		{
			alert(info.data);
			showPage();
		}
		else
		{
			alert(info.msg);
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

function caculateTimeLeft(TimeNow)
{
	var ms = moment(TimeEnd*1000).diff(TimeNow*1000);
	var d = moment.duration(ms);
	var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
	return s;
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
	document.getElementById('created').value = moment(parseInt(AllData.created, 10)*1000).format("YYYY-MM-DD HH:mm:ss");
	document.getElementById('ename').value = AllData.name;
	document.getElementById('type').value = AllData.type;
	document.getElementById('publish').checked = AllData.publish;
	if (AllData.timeEnd != "" && AllData.timeStart!="")
	{
		document.getElementById('timestart').value = moment(parseInt(AllData.timeStart, 10)*1000).format("YYYY-MM-DDTHH:mm");
		document.getElementById('timeend').value = moment(parseInt(AllData.timeEnd, 10)*1000).format("YYYY-MM-DDTHH:mm");
	}
}
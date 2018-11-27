var length = 0;
class Qt
{
	constructor(qt, slen, sarr, aw)
	{
		this.qt = qt;
		this.slen = slen;
		this.sarr = sarr;
		this.aw = aw;
	}
	render(i)
	{
		var rs = "";
		var p1 = '<div class="card-header">Question '+i+'</div><div class="card-body"><div class="form-group"><label class="col-sm-12 col-form-label">Question:</label><div class="col-sm-12"><textarea id="'+'Q'+i+'A'+'" name="qarr['+i+']" class="form-control" rows="5" placeholder="Enter your question">'+this.qt+'</textarea></div></div>'
		rs=p1;
		var p2 = "";
		for (var j=0; j<this.slen; j++)
		{
			if (j==this.aw)
			{
				p2+=this.getP2(i, j, true);
			}
			else
			{
				p2+=this.getP2(i, j, false);
			}
		}
		rs = p1+p2;
		return rs+'<div id="'+'Q'+i+'N'+'" class="btn-toolbar mb-1" role="toolbar" aria-label="Toolbar with button groups"><div class="btn-group mr-0" role="group" aria-label="First group"><button type="button" onclick="DelQ('+i+')" class="btn btn-secondary">X</button><button type="button" onclick="UpQ('+i+')" class="btn btn-secondary"><a href="'+'#Q'+(i==0?length-1:i-1)+'">△</a></button><button onclick="DownQ('+i+')" type="button" class="btn btn-secondary"><a href="'+'#Q'+(i==length-1?0:i+1)+'">▽</a></button><button onclick="Add('+i+')" type="button" class="btn btn-secondary">Add</button><button onclick="Set('+i+')" type="button" class="btn btn-secondary">Set</button></div>';
	}
	getP2(vt, i, checked)
	{
		if (checked == true)
			return '<div id="'+'Q'+vt+'S'+i+'N'+'" class="btn-toolbar mb-1" role="toolbar" aria-label="Toolbar with button groups"><div class="btn-group mr-0" role="group" aria-label="First group"><button onclick="Del('+vt+', '+i+')" type="button" class="btn btn-secondary">X</button><button type="button" onclick="Up('+vt+', '+i+')" class="btn btn-secondary">△</button><button onclick="Down('+vt+', '+i+')" type="button" class="btn btn-secondary">▽</button></div><div class="input-group col-sm-4"><input id="'+'Q'+vt+'S'+i+'" value="'+this.sarr[i]+'" type="text" class="form-control" placeholder="selection"></div><div class="form-check" name="0"><input name="aarr['+vt+']" onclick="Select('+vt+', '+i+')" value="'+i+'" class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" checked></div><div class="input-group col-sm-5"><input id='+'Q'+vt+'S'+i+'O'+' name="sarr['+vt+']" type="text" class="form-control" value="'+this.sarr[i]+'" readonly="readonly"></div></div>'
		else
			return '<div id="'+'Q'+vt+'S'+i+'N'+'" class="btn-toolbar mb-1" role="toolbar" aria-label="Toolbar with button groups"><div class="btn-group mr-0" role="group" aria-label="First group"><button onclick="Del('+vt+', '+i+')" type="button" class="btn btn-secondary">X</button><button type="button" onclick="Up('+vt+', '+i+')" class="btn btn-secondary">△</button><button onclick="Down('+vt+', '+i+')" type="button" class="btn btn-secondary">▽</button></div><div class="input-group col-sm-4"><input id="'+'Q'+vt+'S'+i+'" value="'+this.sarr[i]+'" type="text" class="form-control" placeholder="selection"></div><div class="form-check" name="0"><input name="aarr['+vt+']" onclick="Select('+vt+', '+i+')" value="'+i+'" class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" ></div><div class="input-group col-sm-5"><input id='+'Q'+vt+'S'+i+'O'+' name="sarr['+vt+']" type="text" class="form-control" value="'+this.sarr[i]+'" readonly="readonly"></div></div>'
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
	for (var i=0; i<length; i++)
	{
		Set(i);
	}
}
function Set(q) {
	for (var i=0; i<qarr[q].slen; i++)
	{
		qarr[q].sarr[i] = document.getElementById('Q'+q+'S'+i).value;
		qarr[q].qt = document.getElementById('Q'+q+'A').value;
		document.getElementById('Q'+q+'S'+i+'O').value = qarr[q].sarr[i];
	}
}
function Add(q) {
	for (var i=0; i<length; i++)
	{
		Set(i);
	}
	qarr[q].sarr.push('');
	qarr[q].slen++;
	document.getElementById('Q'+q).innerHTML = qarr[q].render(q);
}
function Del(q, s)
{
	for (var i=0; i<length; i++)
	{
		Set(i);
	}
	qarr[q].sarr.splice(s, 1);
	qarr[q].slen--;
	document.getElementById('Q'+q).innerHTML = qarr[q].render(q);
}
function Up(q, s)
{
	for (var i=0; i<length; i++)
	{
		Set(i);
	}
	var n = s-1;
	if (n < 0)
	{
		n = qarr[q].slen-1;
	}
	let tmp = qarr[q].sarr[s];
	qarr[q].sarr[s] = qarr[q].sarr[n];
	qarr[q].sarr[n] = tmp;
	if (s == qarr[q].aw)
	{
		qarr[q].aw = n;
	}
	else if (n == qarr[q].aw)
	{
		qarr[q].aw = s;
	}
	document.getElementById('Q'+q).innerHTML = qarr[q].render(q);
}
function Down(q, s)
{
	for (var i=0; i<length; i++)
	{
		Set(i);
	}
	var n = s+1;
	if (n >= qarr[q].slen)
	{
		n = 0;
	}
	let tmp = qarr[q].sarr[s];
	qarr[q].sarr[s] = qarr[q].sarr[n];
	qarr[q].sarr[n] = tmp;
	if (s == qarr[q].aw)
	{
		qarr[q].aw = n;
	}
	else if (n == qarr[q].aw)
	{
		qarr[q].aw = s;
	}
	document.getElementById('Q'+q).innerHTML = qarr[q].render(q);
}

function AddQ()
{
	for (var i=0; i<length; i++)
	{
		Set(i);
	}
	var tmp = new Qt('', 1, [''], 0);
	qarr.push(tmp);
	length++;
	document.getElementById("form").innerHTML = '';
	for (var i=0; i<length; i++)
	{
		document.getElementById("form").innerHTML += '<div id="'+'Q'+(i)+'" class="card mb-3">'+qarr[i].render(i)+'</div>'
	}
}

function UpQ(q)
{
	for (var i=0; i<length; i++)
	{
		Set(i);
	}
	var n = q-1;
	if (n < 0)
	{
		n = length-1;
	}
	let tmp = qarr[q];
	qarr[q] = qarr[n];
	qarr[n] = tmp;
	document.getElementById("form").innerHTML = '';
	for (var i=0; i<length; i++)
		document.getElementById("form").innerHTML += '<div id="'+'Q'+(i)+'" class="card mb-3">'+qarr[i].render(i)+'</div>'
}

function DownQ(q)
{
	for (var i=0; i<length; i++)
	{
		Set(i);
	}
	var n = q+1;
	if (n >= length)
	{
		n = 0;
	}
	let tmp = qarr[q];
	qarr[q] = qarr[n];
	qarr[n] = tmp;
	document.getElementById("form").innerHTML = '';
	for (var i=0; i<length; i++)
		document.getElementById("form").innerHTML += '<div id="'+'Q'+(i)+'" class="card mb-3">'+qarr[i].render(i)+'</div>'
}

function DelQ(q)
{
	for (var i=0; i<length; i++)
	{
		Set(i);
	}
	qarr.splice(q, 1);
	length--;
	document.getElementById("form").innerHTML = '';
	for (var i=0; i<length; i++)
	{
		document.getElementById("form").innerHTML += '<div id="'+'Q'+(i)+'" class="card mb-3">'+qarr[i].render(i)+'</div>';
	}
}

var socket = io(httpSocket);
let AllData = {};
let GroupData = {};
socket.emit('login', {'user': tuser, 'pass': pass});

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
			setViewGeneral()
			length = info.data.qlen;
			for (var i=0; i<length; i++)
			{
				var q = info.data.qarr[i];
				var t = new Qt(q.q, q.slen, q.sarr, info.data.aarr[i]);
				qarr.push(t);
			}
			document.getElementById('tool').innerHTML='<div class="form-control mb-1"><span class="input-group-text">Accept For Group Do Contest</span></div>'
			if (AllData.publish == false)
			{
				socket.emit('getInfoAllGroupTeacherManage', {userteacher: tuser});
				socket.on('rgetInfoAllGroupTeacherManage', function(info){
					if (info.cd == 0)
					{
						
						GroupData = info.data;
						for (var i=0; i<GroupData.len; i++)
						{
							var tick = false;
							for (var j=0; j<AllData.lenGroupAcc; j++)
							{
								if (parseInt(GroupData.arr[i].gid) == AllData.arrGourpAcc[j])
								{
									tick = true;
									break;
								}
							}
							if (tick)
								document.getElementById('tool').innerHTML+='<div class="input-group mb-3"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" id="G'+GroupData.arr[i].gid+'" value="'+GroupData.arr[i].gid+'" checked></div></div><label class="form-control">'+GroupData.arr[i].gid+' - '+GroupData.arr[i].gname+'</label><div class="input-group-prepend"><span class="input-group-text">'+GroupData.arr[i].gmember+'</span></div></div>'
							else
								document.getElementById('tool').innerHTML+='<div class="input-group mb-3"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" id="G'+GroupData.arr[i].gid+'" value="'+GroupData.arr[i].gid+'"></div></div><label class="form-control">'+GroupData.arr[i].gid+' - '+GroupData.arr[i].gname+'</label><div class="input-group-prepend"><span class="input-group-text">'+GroupData.arr[i].gmember+'</span></div></div>'
						}
						document.getElementById('tool').innerHTML += '<div class="form-group row"><div class="col-sm-5 mx-auto"><button onclick="setAcceptGroup()" type="button" class="btn btn-primary">Accept</button></div></div>'
						setup();
						Success();
						setTimeout(showPage, 2000);
					}
					else
					{
						alert(info.msg);
						showPage();
					}
				})
			}
			else
			{
				document.getElementById('tool').innerHTML += '<label class="form-control">You can not set what group do exam because publish is true (Exam is publishing for all student)</label>'
				setup()
				Success();
				setTimeout(showPage, 2000);
			}
		}
	})

	socket.on('rsetExamload', function(data){
		document.getElementById('iloadertext').innerHTML = data;
	})
	socket.on('rsetExam', function(data){
		console.log(data);
		if(data.cd == 0)
		{
			location.reload();
		}
		else
		{
			alert(info.msg);
			showPage();
		}
	})

	socket.on('rsetGeneralExamload', function(data){
		document.getElementById('iloadertext').innerHTML = data;
	})
	socket.on('rsetGeneralExam', function(data){
		console.log(data);
		if(data.cd == 0)
		{
			location.reload();
		}
		else
		{
			alert(info.msg);
			showPage();
		}
	})

	socket.on('rsetAcceptListGroupForExamload', function(data){
		document.getElementById('iloadertext').innerHTML = data;
	})
	socket.on('rsetAcceptListGroupForExam', function(data){
		console.log(data);
		if(data.cd == 0)
		{
			location.reload();
		}
		else
		{
			alert(info.msg);
			showPage();
		}
	})
});

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

function setGeneral()
{
	var data = {};
	data.tuser = tuser;
	data.eid = eid;
	if (document.getElementById('ename').value != AllData.name)
	{
		data.ename = document.getElementById('ename').value;
	}
	data.type = document.getElementById('type').value
	data.publish = document.getElementById('publish').checked
	data.timestart = moment(document.getElementById('timestart').value).utc().valueOf()/1000;
	data.timeend = moment(document.getElementById('timeend').value).utc().valueOf()/1000;
	console.log(data);
	socket.emit('setGeneralExam', data);
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

function setAcceptGroup()
{
	var data = {};
	data.tuser = tuser;
	data.eid = eid;
	var arr = [];
	for (var i=0; i<GroupData.len; i++)
	{
		var gid = 'G'+GroupData.arr[i].gid;
		
		arr[document.getElementById(gid).value] = document.getElementById(gid).checked;
	}
	data.len = GroupData.len;
	data.arr = arr;
	socket.emit('setAcceptListGroupForExam', data);
	loadPage();
}
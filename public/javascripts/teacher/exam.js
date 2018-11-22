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
		var p1 = '<div class="card-header">Question '+i+'</div><div class="card-body"><div class="form-group"><label class="col-sm-12 col-form-label">Question:</label><div class="col-sm-12"><textarea id="'+'Q'+i+'A'+'" name="qarr['+i+']" class="form-control" rows="5" placeholder="Enter your question" disabled="disabled">'+this.qt+'</textarea></div></div>'
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
		return rs;
	}
	getP2(vt, i, checked)
	{
		if (checked == true)
			return '<div id="'+'Q'+vt+'S'+i+'N'+'" class="btn-toolbar mb-1" role="toolbar" aria-label="Toolbar with button groups"><div class="form-check" name="0"><input name="aarr['+vt+']" onclick="Select('+vt+', '+i+')" value="'+i+'" class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" disabled="disabled" checked></div><div class="input-group col-sm-12"><input id='+'Q'+vt+'S'+i+'O'+' name="sarr['+vt+']" type="text" class="form-control" value="'+this.sarr[i]+'" readonly="readonly"></div></div>'
		else
			return '<div id="'+'Q'+vt+'S'+i+'N'+'" class="btn-toolbar mb-1" role="toolbar" aria-label="Toolbar with button groups"><div class="form-check" name="0"><input name="aarr['+vt+']" onclick="Select('+vt+', '+i+')" value="'+i+'" class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" disabled="disabled" ></div><div class="input-group col-sm-12"><input id='+'Q'+vt+'S'+i+'O'+' name="sarr['+vt+']" type="text" class="form-control" value="'+this.sarr[i]+'" readonly="readonly"></div></div>'
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
								document.getElementById('tool').innerHTML+='<div class="input-group mb-3"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" id="G'+GroupData.arr[i].gid+'" value="'+GroupData.arr[i].gid+'" disabled="disabled" checked></div></div><label class="form-control">'+GroupData.arr[i].gid+' - '+GroupData.arr[i].gname+'</label><div class="input-group-prepend"><span class="input-group-text">'+GroupData.arr[i].gmember+'</span></div></div>'
							else
								document.getElementById('tool').innerHTML+='<div class="input-group mb-3"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" id="G'+GroupData.arr[i].gid+'" value="'+GroupData.arr[i].gid+'" disabled="disabled"></div></div><label class="form-control">'+GroupData.arr[i].gid+' - '+GroupData.arr[i].gname+'</label><div class="input-group-prepend"><span class="input-group-text">'+GroupData.arr[i].gmember+'</span></div></div>'
						}
						setup();
						Success();
						setTimeout(showPage, 2000);
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

	socket.on('rsetAcceptListGroupForExamload', function(data){
		document.getElementById('iloadertext').innerHTML = data;
	})
	socket.on('rsetAcceptListGroupForExam', function(data){
		console.log(data);
		if(data.cd == 0)
		{
			location.reload();
		}
	})
});

function getExam()
{
	socket.emit('getExam', {eid: eid});
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
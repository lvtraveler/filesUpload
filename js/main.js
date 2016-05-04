var uploadFile=[];//需要上传的文件数组
var lastUploadFile=[];
//初始化操作
window.onload=function(){
	var self=this;
	$('#files').on("change",function(e){
		$('input[id="files"]').addClass('uploadfiles');
		self.funGetFiles(e);
	});
	$('#fileselect').on("change",function(e){
		self.funGetFiles(e);
	});
	$('#btn-commit').on("click",function(e){
		$(this).css("display","none");
		$(".btn-cancel").text("确定").css("background-color","#4787ed").css("color","#fff");
		self.funUploadFiles(e);
	});
	var xhr = new XMLHttpRequest();
	if(xhr.upload){
		filedrag.addEventListener("dragover", funDragHover, false);
		filedrag.addEventListener("dragleave", funDragHover, false);
		filedrag.addEventListener("drop", funGetFiles, false);
	}

	var uplad_status="<div id='upload_status'><span id='upload_result'>目前的上传进度<i class='upload_current'>0</i>/<i class='upload_sum'></i> , </span><span>总共<i class='upload_sum'></i>个文件 , </span><span>已经上传了<i class='upload_done'>0</i>个</span><p style='margin:0;color:#DE2020;'>失败个数:<i class='upload_done_fail'>0</i></p></div>";
	$("#output").after(uplad_status);
}

function funFilterEligibleFile(files) {
	var arrFiles=[];
	for(var i=0,file;file=files[i];i++) {
		arrFiles.push(file);
	}
	return arrFiles;
}
//获取文件
function funGetFiles(e) {
	var self=this;
	funDragHover(e);
	var files = e.target.files || e.dataTransfer.files;
	self.lastUploadFile=this.uploadFile;
//	this.uploadFile=this.uploadFile.concat(this.filterFile(files));
	for(var i=0,file;file=files[i];i++) {
		uploadFile.push(file);
	}
	var tmpFiles=[];
	var lArr=[];
	var uArr=[];
	$.each(lastUploadFile,function(k,v){
		lArr.push(v.name);
	});
	$.each(uploadFile,function(k,v){
		uArr.push(v.name);
	});
	$.each(uArr,function(k,v){
		if($.inArray(v,lArr)<0){
			tmpFiles.push(uploadFile[k]);
		}else {
			// alert("所选择文件已存在上传列表当中！");
		}
	});

	var html="";
	var progress="";
		for(var i=0;i<files.length;i++) {
		html+="<p class='p-item'><strong class='file_name'>"+files[i].name+"</strong>&nbsp;&nbsp;&nbsp;<strong class='file_size'>大小："+(files[i].size/1024).toFixed(2)+"KB"+"</strong><strong class='file_progress'></strong></p>";
			$("#output").show();
			$('#submitbutton').show();

		}

	$("#output").append(html);
	// progress="<dl class='barbox'><dd class='barline'><div w='100' style='width:0px;' class='charts'></div></dd></dl>";
	// $('.p-item').each(function(){
	// 		if($(this).has('.barbox').length>0){
	// 			console.log("aaa")
	// 		}else{
	// 			$(this).append(progress);
	// 		}
	// });

	$("#upload_status").show();
	$(".upload_done,.upload_current,.upload_done_fail").text(0);
	$(".upload_sum").text(files.length);
}
//多个上传文件
function funUploadFiles(e){

	var self=this;//在each中this指向每个v
	//遍历所有文件，再调用单个文件的上传方法
	var len=uploadFile.length;
	console.log("len:"+len);
	$(".upload_sum").text(len);
	$(".upload_done,.upload_current,.upload_done_fail").text(0);
	$.each(uploadFile, function(k,v) {
		k=parseInt(k);
		funUploadFile(k,v);
	});

}
//单个文件上传
var fail_count=0;//失败个数
var success_count=0;//成功个数
function funUploadFile(k,file) {
	k=k+1;
	var self=this;
	var formdata=new FormData();
	formdata.append("fileList",file);
	var xhr=new XMLHttpRequest();
	xhr.open("POST",self.url,true);
	// xhr.upload.onprogress=function(e) {
	// 	if(e.lengthComputable){
	// 		var percentComplete=parseInt((e.loaded/e.total));
	// 		$(".file_progress").text(percentComplete+"%");
	// 	}
	// 	xhr.removeEventListener("onprogress");
	// }
	xhr.onreadystatechange=function(event) {
		if(xhr.readyState==4&&xhr.status==200){
			var responseText=xhr.responseText;
			responseText=JSON.parse(responseText);
			var status=responseText.status;
			if(status==1){
				// funSuccess();
				success_count=success_count+1;
				$(".upload_done").text(success_count);
				$(".upload_current").text(success_count);
			}else {
				// funFailure();
				fail_count=fail_count+1;
				$(".upload_done_fail").text(fail_count);
			}
		}
	}


//	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.send(formdata);
	uploadFile=[];//清空
}
function updateProgress(event){
	if(event) {
		if(event.lengthComputable){
			var percentComplete = parseInt((event.loaded / event.total)*100);
			
			$(".file_progress").text(percentComplete+"%");
		}
	}

}
//拖拽到上方的事件
function funDragHover(e){
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
}
//文件过滤
function filterFile(files){
	var self=this;
	return self.funFilterEligibleFile(files);
}
function funFilterEligibleFile(files) {
	var arrFiles=[];
	for(var i=0,file;file=files[i];i++) {
		arrFiles.push(file);
	}
	return arrFiles;
}
//上传成功
function funSuccess() {
	$('.charts').addClass('success');
	item=$('.charts');
	progress(item);
	var info="<em class='icon_status icon_success'></em>";
	$('.p-item').each(function(){
		if($(this).has('.icon_status').length>0){
				console.log("aaa");
		}else{
			$(this).append(info);
		}
	});
}
function funFailure() {
	$('.charts').addClass('failure');
	item=$('.charts');
	progress(item);
	var info="<em class='icon_status icon_failure'></em>";
	$('.p-item').each(function(){
		if($(this).has('.icon_status').length>0){
				console.log("aaa");
		}else{
			$(this).append(info);
		}
	});
}

function progress(item) {
	var a=parseInt(item.attr("w"));
		item.animate({
			width:a+"%"
	},1000);
}

function showModal(){
	$("#mask").show();
	$("#modal-dialog").show();

}
function cancel() {
	$("#output").empty();
	$("#output").hide();
	$('#submitbutton').hide();
	uploadFile=[];
	$("#mask").hide();
	$("#modal-dialog").hide();
	window.location.reload();
}

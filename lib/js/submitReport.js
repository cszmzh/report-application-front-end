
//选择第一志愿组织时进行联动
var selectFirst = document.getElementById("firstOrg");
selectFirst.onchange=function(){
    var selvalue = selectFirst.value;
    var val = document.getElementById("firstBra");
    selectMajor(selvalue,val);
};

//第二志愿
var selectSecond = document.getElementById("secondOrg");
selectSecond.onchange=function(){
    var selvalue = selectSecond.value;
    var val = document.getElementById("secondBra");
    selectMajor(selvalue,val);
};

var selectMajor = function(selvalue,val){
    switch (selvalue) {
        case "": val.innerHTML='<option>请选择</option>';break;
        case "团委": val.innerHTML='<option>组织部</option><option >宣传部</option><option>心协</option><option>青协</option>';break;
        case "学生会": val.innerHTML='<option>办公室</option><option >学习部</option><option>宣传部</option><option>文艺部</option><option>体育部</option><option>外联部</option><option>自管会</option>';break;
        case "科技协会": val.innerHTML='<option>科技协会</option>';break;
        case "勤工助学中心": val.innerHTML='<option>管理部</option><option >活动部</option><option>助贷部</option><option>外联部</option>';break;
        case "新闻中心": val.innerHTML='<option>摄影协会</option><option >新媒体部</option><option>记者团</option>';break;
    }
};

/**
 * 更换验证码图片
 */
$(function () {
    $("#changecode").on("click",function () {
        $(this).attr("src",backgroundURL+"img/code?d="+new Date().getTime());
    }) ;
});

/**
 * 点击注册按钮
 */
$("#regist").click(function () {
    //判断调剂是否勾选
    var isAgreeItem = false;
    if(document.getElementById("isAgreeItem").checked) {
        isAgreeItem = true;
    }

    //单击注册按钮时触发ajax事件 跳转至doRegistServlet
    $.ajax({
        url:backgroundURL+"report/insert",
        type:"post",
        data:{
            stdId:$('#stdId').val(),             //获取学号
            stdName:$("input[name=stdName]").val(),         //获取姓名
            major:$('#major').val(),             //获取专业
            classNum:$('#classNum').val(),       //获取班级
            stdQQ:$("input[name=stdQQ]").val(),             //获取QQ号
            stdPhone:$("input[name=stdPhone]").val(),       //获取手机号码
            firstOrg:$('#firstOrg').val(),       //获取第一志愿主组织名称
            firstBra:$('#firstBra').val(),       //获取分支名
            firstReason:$('#firstReason').val(), //获取第一志愿理由
            secondOrg:$('#secondOrg').val(),       //获取第一志愿主组织名称
            secondBra:$('#secondBra').val(),       //获取分支名
            secondReason:$('#secondReason').val(), //获取第一志愿理由
            code:$("input[id=code]").val(),                 //使用id=... 和 name = ...均可
            isDispensing:isAgreeItem                        //是否调剂
        },
        dataType:"json",
        success:function(result){
            var flag = result.code;
            //初始化错误信息
            $(".tips").text("");

            if(flag == 0){
                window.alert("填报志愿成功！");
                window.location.href = "https://www.515code.com/";       //跳转
            }

            if($('#stdId').val()<=20190000 || $('#stdId').val()>=20199999 || $('#stdId').val()==""){
                alert("请输入正确的学号");
                $('#stdIdTip').text("学号应为2019开头8位");
            }else if(flag == 1 || $("input[id=code]").val()==""){
                $("#kaptchaError").text("验证码错误");
            }else if(flag == 2){
                $('#firstWillTip').text("请完整填写第一志愿组织信息");
            }else if(flag == 3){
                alert("你已提交过志愿信息！若需修改请联系管理员QQ798998087");
            }else if(flag == 4){
                alert("请输入姓名");
                $('#stdNameTip').text("请填写姓名");
            }
        },//失败回调，初始化错误信息
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $(".tips").text("");
            if($('#stdId').val()<=20190000 || $('#stdId').val()>=20209999 || $('#stdId').val()==""){
                alert("请输入正确的学号");
                $('#stdIdTip').text("学号应为2019开头8位");
            }
            //检查正则表达式
            if(!isPhone($('#stdPhone').val()) || !isQQ($('#stdQQ').val())){
                $('#phoneTip').text("请同时填写正确的手机号与QQ号，方便我们联系！");
            }
        }
    })
});

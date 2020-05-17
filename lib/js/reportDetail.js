
//验证是否登录
LoginRequired();


/**
 * 1.根据学号获取志愿信息
 */
$(getReportByStdId =function() {

    //对普通管理员屏蔽删除志愿按钮
    if(window.localStorage.getItem("status")==1){
        $('#deleteReport').attr("style","display:none");
    }

    //获取URL中传进来的学生学号
    var searchStdId = getQueryVariable("stdId");


    $.ajax({
        url:backgroundURL+'report/getByStdId?stdId='+ searchStdId,
        type:'post',
        datatype:'json',
        success:function(res){
            var data = res.data;
            if(data==undefined){
                window.location.href="https://www.515code.com/";
            }

            //添加数据至HTML中
            $('#stdId').append(data.stdId);
            $('#stdName').append(data.stdName);

            //学生学号
            obj = document.getElementById("major");
            for(i=0;i<obj.length;i++){
                if(obj[i].value===data.major){
                    obj[i].selected=true;
                }
            }

            //学生班级
            obj = document.getElementById("classNum");
            for(i=0;i<obj.length;i++){
                if(obj[i].value==data.classNum){
                    obj[i].selected=true;
                }
            }

            //学生手机与QQ号
            document.getElementById("stdPhone").value = data.stdPhone;
            document.getElementById("stdQQ").value = data.stdQQ;


            if(window.localStorage.getItem("status")==1){

                //只显示管理员所属主组织名
                document.getElementById("firstOrg").innerHTML='<option>'+data.firstWill.organization+'</option>';

                document.getElementById("secondOrg").innerHTML='<option>'+data.secondWill.organization+'</option>';

                $('#isDispensing').attr("disabled","true");

                //隐藏第一志愿选项框
                if(data.firstWill.organization==undefined){
                    $('.firstWill').attr("style","display:none");
                    $('#enrollFirst').attr("style","display:none");
                }

                //隐藏第二志愿选项框
                if(data.secondWill.organization==undefined){
                    $('.secondWill').attr("style","display:none")
                    $('#enrollSecond').attr("style","display:none");
                }
            }

            //第一志愿
            obj = document.getElementById("firstOrg");
            for(i=0;i<obj.length;i++){
                if(obj[i].value===data.firstWill.organization){
                    obj[i].selected=true;
                    var selectFirst = obj;
                    var selvalue = selectFirst.value;
                    var val = document.getElementById("firstBra");
                    selectMajor(selvalue,val);
                }
            }

            obj = document.getElementById("firstBra");
            for(i=0;i<obj.length;i++){
                if(obj[i].value===data.firstWill.branch){
                    obj[i].selected=true;
                }
            }
            $('#firstReason').append(data.firstWill.reason);

            //第二志愿
            obj = document.getElementById("secondOrg");
            for(i=0;i<obj.length;i++){
                if(obj[i].value===data.secondWill.organization){
                    obj[i].selected=true;
                    var selectSecond = obj;
                    var selvalue = selectSecond.value;
                    var val = document.getElementById("secondBra");
                    selectMajor(selvalue,val);
                }
            }

            obj = document.getElementById("secondBra");
            for(i=0;i<obj.length;i++){
                if(obj[i].value===data.secondWill.branch){
                    obj[i].selected=true;
                }
            }
            $('#secondReason').append(data.secondWill.reason);

            //是否接受调剂
            obj = document.getElementById("isDispensing");
            for(i=0;i<obj.length;i++){
                if(obj[i].value==data.isDispensing){
                    obj[i].selected=true;
                }
            }

            $('#createTime').append(data.create_time);
            $('#updateTime').append(data.update_time);
            $('#reportStatus').append(data.isEnroll);
            if(data.isEnroll!="未被录取"){
                $('#enrollFirst').attr("style","display:none");
                $('#enrollSecond').attr("style","display:none");
                $('#updateInfo').attr("style","display:none");
                $('#reportStatus').attr("style","color:green");
            }
            $('#remark').append(data.remark);

        }
    })
});

/**
 * 2.提交数据更新
 */
$('body').on("click","#updateInfo",function (e) {
    var msg = "您确定要更新该学生的志愿信息吗？";
    if (confirm(msg)==true){
        //如果是管理员身份
        if(window.localStorage.getItem("status")==1){

            $.ajax({
                url:backgroundURL+"report/update_ADMIN",
                type:"post",
                data:{
                    stdId:$('#stdId').html(),             //获取学号
                    stdName:$("input[name=stdName]").html(),         //获取姓名
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
                    code:$("input[id=code]").html(),                 //使用id=... 和 name = ...均可
                    isDispensing:$('#isDispensing').val(),           //是否调剂
                    remark:$('#remark').val()
                },
                dataType:"json",
                success:function(result){
                    var flag = result.code;
                    //初始化错误信息
                    $(".tips").text("");

                    if(flag == 0){
                        window.alert("信息更新成功！");
                        window.location.reload();       //跳转
                    }

                },//失败回调
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //初始化错误信息
                    //初始化错误信息
                    $(".tips").text("");
                    //检查正则表达式
                    if(!isPhone($('#stdPhone').val()) || !isQQ($('#stdQQ').val())){
                        alert("提示：请同时填写正确的手机号与QQ号");
                        $('#phoneTip').text("请同时填写正确的手机号与QQ号");
                    }
                }
            });

        }else if(window.localStorage.getItem("status")==2){

            $.ajax({
                url:backgroundURL+"report/update_ROOT",
                type:"post",
                data:{
                    stdId:$('#stdId').html(),             //获取学号
                    stdName:$("input[name=stdName]").html(),         //获取姓名
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
                    code:$("input[id=code]").html(),                 //使用id=... 和 name = ...均可
                    isDispensing:$('#isDispensing').val(),                      //是否调剂
                    remark:$('#remark').val()
                },
                dataType:"json",
                success:function(result){
                    var flag = result.code;
                    //初始化错误信息
                    $(".tips").text("");

                    if(flag == 0){
                        window.alert("信息更新成功！");
                        window.location.reload();       //跳转
                    }

                },//失败回调
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //初始化错误信息
                    //初始化错误信息
                    $(".tips").text("");
                    //检查正则表达式
                    if(!isPhone($('#stdPhone').val()) || !isQQ($('#stdQQ').val())){
                        alert("提示：请同时填写正确的手机号与QQ号");
                        $('#phoneTip').text("请同时填写正确的手机号与QQ号");
                    }
                }
            });

        }


    }else{
        return false;
    }

});


/**
 * 3.录取第一志愿
 */
$('body').on("click","#enrollFirst",function (e) {
    var msg = "您确定要录取该学生到："+ $('#firstOrg').val() + "-" + $('#firstBra').val() +" 吗？";
    if (confirm(msg)==true){
        //如果是管理员身份
        if(window.localStorage.getItem("status")==1){
            $.ajax({
                url:backgroundURL+"report/enroll_ADMIN",
                type:"post",
                data:{
                    stdId:$('#stdId').html(),             //获取学号
                    organization:$('#firstOrg').val(),       //获取第一志愿主组织名称
                    branch:$('#firstBra').val(),       //获取分支名
                },
                dataType:"json",
                success:function(result){
                    var flag = result.code;
                    //初始化错误信息
                    $(".tips").text("");

                    if(flag == 0){
                        window.alert("录取成功！");
                        window.location.reload();       //跳转
                    }

                }
            });

        }else if(window.localStorage.getItem("status")==2){
            $.ajax({
                url:backgroundURL+"report/enroll_ROOT",
                type:"post",
                data:{
                    stdId:$('#stdId').html(),             //获取学号
                    organization:$('#firstOrg').val(),       //获取第一志愿主组织名称
                    branch:$('#firstBra').val(),       //获取分支名
                },
                dataType:"json",
                success:function(result){
                    var flag = result.code;
                    //初始化错误信息
                    $(".tips").text("");

                    if(flag == 0){
                        window.alert("录取成功！");
                        window.location.reload();       //跳转
                    }else if(flag == 1){
                        window.alert("请先提交数据更新！");
                    }
                }
            });
        }

    }else{
        return false;
    }

});

/**
 * 4.录取第二志愿
 */
$('body').on("click","#enrollSecond",function (e) {

    var msg = "您确定要录取该学生到："+ $('#secondOrg').val() + " " + $('#secondBra').val() +" 吗？";
    if (confirm(msg)==true){
        //如果是管理员身份
        if(window.localStorage.getItem("status")==1){
            $.ajax({
                url:backgroundURL+"report/enroll_ADMIN",
                type:"post",
                data:{
                    stdId:$('#stdId').html(),             //获取学号
                    organization:$('#secondOrg').val(),       //获取第一志愿主组织名称
                    branch:$('#secondBra').val(),       //获取分支名
                },
                dataType:"json",
                success:function(result){
                    var flag = result.code;
                    //初始化错误信息
                    $(".tips").text("");

                    if(flag == 0){
                        window.alert("录取成功！");
                        window.location.reload();       //跳转
                    }

                }
            });

        }else if(window.localStorage.getItem("status")==2){
            $.ajax({
                url:backgroundURL+"report/enroll_ROOT",
                type:"post",
                data:{
                    stdId:$('#stdId').html(),             //获取学号
                    organization:$('#secondOrg').val(),       //获取第一志愿主组织名称
                    branch:$('#secondBra').val(),       //获取分支名
                },
                dataType:"json",
                success:function(result){
                    var flag = result.code;
                    //初始化错误信息
                    $(".tips").text("");

                    if(flag == 0){
                        window.alert("录取成功！");
                        window.location.reload();       //跳转
                    }

                }
            });
        }

    }else{
        return false;
    }
});

/**
 * 5.删除学生志愿信息
 */
$('body').on("click","#deleteReport",function (e) {
    var msg = "您确定要删除该学生志愿信息吗？警告：该操作不可逆！";
    if (confirm(msg)==true){
        //如果是管理员身份
        if(window.localStorage.getItem("status")==2){
            $.ajax({
                url:backgroundURL+"report/delete",
                type:"post",
                data:{
                    stdId:$('#stdId').html(),             //获取学号
                },
                dataType:"json",
                success:function(result){
                    alert("删除志愿成功！");
                    window.location=frontendURL+indexURL;
                },//失败回调
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //初始化错误信息
                    //初始化错误信息
                    alert("删除失败");
                }
            });
        }
    }else{
        return false;
    }
});

//验证是否登录
LoginRequired();

$(getAllReport =function() {

    //如果page参数不为空再赋值
    if(getQueryVariable("page")){
        page = getQueryVariable("page");
    }

    $.ajax({
        url:backgroundURL+'data/get',
        type:'get',
        datatype:'json',
        success:function(res){

            var total = res.data.totalReport;
            var tuanweiFirst = res.data.tuanweiFirst;
            var tuanweiSecond = res.data.tuanweiSecond;
            var xueshenghuiFirst = res.data.xueshenghuiFirst;
            var xueshenghuiSecond = res.data.xueshenghuiSecond;
            var kexieFirst = res.data.kexieFirst;
            var kexieSecond = res.data.kexieSecond;
            var zhuxueFirst = res.data.zhuxueFirst;
            var zhuxueSecond = res.data.zhuxueSecond;
            var xinwenFirst = res.data.xinwenFirst;
            var xinwenSecond = res.data.xinwenSecond;

            $('#total-report').append(total);
            $('#total-will').append(tuanweiFirst+tuanweiSecond+xueshenghuiFirst+xueshenghuiSecond+kexieFirst+
            kexieSecond + zhuxueFirst+zhuxueSecond+xinwenFirst+xinwenSecond);

            var ctx = document.getElementById("myChart1").getContext('2d');
            var myChart1 = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ["团委", "学生会", "科技协会", "勤工助学中心", "新闻中心"],
                    datasets: [{
                        label: '# of Votes',
                        data: [tuanweiFirst, xueshenghuiFirst, kexieFirst, zhuxueFirst, xinwenFirst],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                    }]
                },
                options: {
                    responsive: true
                }
            });

            var ctx = document.getElementById("myChart2").getContext('2d');
            var myChart2 = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ["团委", "学生会", "科技协会", "勤工助学中心", "新闻中心"],
                    datasets: [{
                        label: '# of Votes',
                        data: [tuanweiSecond, xueshenghuiSecond, kexieSecond, zhuxueSecond, xinwenSecond],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                    }]
                },
                options: {
                    responsive: true
                }
            });

        }
    })
});

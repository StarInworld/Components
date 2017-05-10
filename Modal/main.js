require.config({
    paths:{
        jquery:'../public/js/jquery-3.1.1.min',
        widget:'../Widget'
    }
});

require(['jquery','window'],function($,w){
    //注意事项：阻塞VS回调  如果希望事件A在点击按钮之后再执行，也就是阻塞之后执行，应该放在配置参数的btn事件中，this.delegate无法做到
    $('#a').click(function(){
        new w.Window().alert({
                    title:'提示',
                    content:'welcome',
                    handlerAlertBtn:function(){
                        alert('you click ok');
                    },
                    handlerCloseBtn:function(){
                        alert('you click close');
                    },
                    width:300,
                    height:150,
                    top:50,
                    hasCloseBtn:true,
                    // skinClassName:'window_skin_a',
                    textAlertBtn:'OK'
                }).on('alert',function(){alert('you click ok twice')})
    });
    $('#b').click(function(){
        new w.Window().confirm({
            title:'提示',
            content:'确定要删除吗？',
            handlerConfirmBtn:function(){
                console.log('you click ok');
            },
            handlerCancelBtn:function(){
                console.log('you click cancel');
            },
            width:300,
            height:150,
            top:50,
            hasCloseBtn:true,
            // skinClassName:'window_skin_a',
            textConfirmBtn:'是'
        }).on('confirm',function(){alert('you click ok twice')})
    })
});
define(function(){
    function Widget(){
        this.boundingBox = null;//属性：最外层容器
    }
    Widget.prototype={
        //订阅事件
        on:function(type,handler){
            if(typeof this.handlers[type] == 'undefined'){
                this.handlers[type] = [];
            }
            this.handlers[type].push(handler);
            return this;
        },
        //触发监听事件
        fire:function(type,data){
            if(this.handlers[type] instanceof Array){
                var handlers = this.handlers[type];
                handlers.forEach(function(handler){
                    handler(data);
                })
            }
            return this;
        },
        render:function(container){ //方法：渲染组件
            this.renderUI();
            this.handlers={};
            this.bindUI();
            this.syncUI();
            $(container || document.body).append(this.boundingBox);
        },
        destroy:function(){         //方法：销毁组件
            this.destructor();
            this.boundingBox.off();
            this.boundingBox.remove();
        },
        renderUI:function(){},      //接口：添加dom节点
        bindUI:function(){},        //接口：监听事件
        syncUI:function(){},        //接口：初始化组件属性
        destructor:function(){}     //接口：销毁前的处理函数
    };
    return {
        Widget:Widget
    }
});
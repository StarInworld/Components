(function(){
    var Swiper = function(options){
        this.count = 0;
        //包含所有图片的盒子
        this.imgBox = options.imgBox;
        //图片数组
        this.imgArr = options.imgArr;
        //左右切换按钮
        this.arrow = options.arrow || null;
        //图片切换按钮
        this.btns = options.btns || null;
        //false 向右/true 向左
        this.isgo = options.isgo || false;
        this.timer = null;
        this.init();
    };
    function _extend(target,ref){
        var name,value;
        for(name in ref){
            value = ref[name];
            if(value !== undefined){
                target[name] = value;
            }
        }
        return target;
    }
    _extend(Swiper.prototype,{
        //初始化轮播组件
        init:function(){
            this.currentBtn();
            this.play();
            this.arrow ? this.arrowEvt() :null;
            this.btns ? this.btnEvt() :null;
        },
        //自动轮播
        play:function(){
            var _this = this;
            this.timer = setInterval(function(){
                if(_this.isgo == false){
                    _this.count++;
                    _this.imgBox.style.transform= "translate(" + -800 * _this.count + "px)";
                    if(_this.count >= _this.imgArr.length -1){
                        _this.count = _this.imgArr.length-1;
                        _this.isgo = true;
                    }
                }else{
                    _this.count--;
                    _this.imgBox.style.transform = "translate(" + -800 * _this.count + "px)";
                    if(_this.count <= 0){
                        _this.count = 0;
                        _this.isgo = false;
                    }
                }
                _this.currentBtn();
            },4000);
        },
        //停止轮播
        stop:function(){
            clearInterval(this.timer);
        },
        //向前/向后 按钮事件
        arrowEvt:function(){
            var _this = this;
            for(var i = 0; i < this.arrow.length;i++){
                this.arrow[i].addEventListener('mouseover',function(){
                    _this.stop();
                });
                this.arrow[i].addEventListener('mouseout',function(){
                    _this.play();
                });
                this.arrow[i].addEventListener('click', _this.arrowClick(i));
            }
        },
        //arrow按钮点击事件
        arrowClick:function(i){
            var _this = this;
            return function(){
                var method = _this.arrow[i].className.split(' ')[1];
                if(method == "pre"){
                    _this.count--;
                    if(_this.count<0){
                        _this.count = 3;
                    }
                }else{
                    _this.count++;
                    if(_this.count>_this.imgArr.length -1){
                        _this.count = 0;
                    }
                }
                imgBox.style.transform = "translate(" + -800 * _this.count + "px)";
                _this.currentBtn();
            }
        },
        //图片选择 hover事件
        btnEvt:function(){
            var _this = this;
            for(var a = 0;a < this.btns.length;a++){
                this.btns[a].addEventListener('mouseover',(function(i){
                    return function(){
                        _this.stop();
                        if(i == _this.imgArr.length -1){
                            _this.isgo = true;
                        }
                        if(i == 0){
                            _this.isgo = false;
                        }
                        _this.count = i;
                        imgBox.style.transform = "translate(" + -800 * _this.count + "px)";
                        _this.currentBtn();
                    }
                })(a));
                this.btns[a].addEventListener('mouseout',function(){
                    _this.play();
                });
            }
        },
        //count更新后 页面的切换
        currentBtn:function(){
            for(var i = 0; i < this.btns.length;i++){
                this.btns[i].style.backgroundColor = "aquamarine";
            }
            this.btns[this.count].style.backgroundColor = "#2CC185";
        }
    });
    this.Swiper = Swiper;
}).call(window);
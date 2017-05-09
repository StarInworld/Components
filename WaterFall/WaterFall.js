//html基本结构 main 为所有图片的容器，box为每张图片的盒子
// <div id="main">
//     <div class="box">
//          <div class="pic">
//              <img src="../public/img/1.jpg" alt="">
//          </div>
//     </div>
//     <div class="box">
//          <div class="pic">
//              <img src="../public/img/2.jpg" alt="">
//          </div>
//     </div>
// </div>
(function(){
    //parent所有图片容器 box单张图片容器
    function WaterFall(parent,box){
        this.parent = parent;//包裹所有图片的父节点
        this.box = box;//图片所在的box数组
        this._init();
    }
    extend(WaterFall.prototype,{
        //函数节流定时器
        tId:null,
        _init:function(){
          this._waterFall();
          var self = this;
          window.onscroll = function(){
              self._throttle();
          };
        },
        //计算每张图片的位置
        _waterFall:function(){
            var self = this,
                boxs = document.querySelectorAll('.' + this.box),
                parent = this.parent,
                boxW = boxs[0].offsetWidth,//每张图片的宽度，这里在box中使用padding，offsetWidth = boeder + padding + width
                clientW = document.body.clientWidth || document.documentElement.clientWidth,//获取浏览器窗口宽度
                cols = Math.floor(clientW/boxW);//计算图片列数

            parent.style.cssText = 'width:' + boxW*cols + 'px;margin:0 auto;';//将parent居中
            var hArr = [];//存放每一列的高度
            boxs.forEach(function(value,index){
                if(index < cols){
                    hArr.push(value.offsetHeight);
                }else{
                    var minH = Math.min.apply(null,hArr),
                        i = self._getMinhIndex(minH,hArr);
                    boxs[index].style.position = 'absolute';
                    boxs[index].style.top = minH + 'px';
                    boxs[index].style.left = boxs[i].offsetLeft + 'px';
                    hArr[i] += boxs[index].offsetHeight;
                }
            });
        },
        //获取hArr中最小元素的index
        _getMinhIndex:function(val,arr){
            for(var i in arr){
                if(arr[i] == val){
                    return i;
                }
            }
        },
        //比较最后一张照片的offsetHeight与（浏览器高度+scroll高度）的大小
        _checkScrollSlide: function(){
            var boxs = document.querySelectorAll('.' + this.box),
                lastBoxH = boxs[boxs.length-1].offsetTop + Math.floor(boxs[boxs.length-1].offsetHeight/2),
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
                clientH = document.body.clientHeight || document.documentElement.clientHeight;
            console.log(lastBoxH);
            return lastBoxH < scrollTop + clientH;
        },
        //实现拖动加载图片效果
        _scroll:function(){
            if(this._checkScrollSlide()){
                for(var i = 20 ; i < 27; i++){
                    var parent = this.parent,
                        box = document.createElement('div'),
                        pic = document.createElement('div'),
                        img = document.createElement('img');
                    img.src = '../public/img/' + i + '.jpg';
                    pic.appendChild(img);
                    pic.className = 'pic';
                    box.className = 'box';
                    box.appendChild(pic);
                    parent.appendChild(box);
                }
                this._waterFall();
            }
        },
        //节流函数
        _throttle: function(){
            clearTimeout(this.tId);
            var self = this;
            this.tId = setTimeout(function(){
                self._scroll();
            },100);
        }
    });
    window.WaterFall = function(parent,boxs){
        return new WaterFall(parent,boxs);
    }
})();

function extend(target, ref) {
    var name, value;
    for (name in ref) {
        value = ref[name];
        if (value !== undefined) {
            target[name] = value;
        }
    }
    return target;
}

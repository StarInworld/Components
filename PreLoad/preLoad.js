(function(){
    function PreLoad(imgs,options){
        this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
        this.opts = extend(PreLoad.Defaults,options);
        this.opts.order ? this._ordered() : this._unordered();
    }
    PreLoad.Defaults = {
        order:false,//是否为有序加载
        each:null,//每一张图片加载完成后执行
        all:null//所有图片加载完成后执行
    };
    //属性的合并
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
    extend(PreLoad.prototype,{
        //无序加载
        _unordered:function(){
            var imgs = this.imgs,
                opts = this.opts,
                count = 0,
                len = imgs.length;
            imgs.forEach(function(src,i){
                if(typeof src !== 'string'){
                    return;
                }
                var imgObj = new Image();

                imgObj.onload = imgObj.onerror = function(){
                    opts.each && opts.each(count);

                    if(count >= len-1){
                        opts.all && opts.all();
                    }
                    count++;
                };

                imgObj.src = src;
            })
        },
        _ordered:function(){
            var imgs = this.imgs,
                opts = this.opts,
                count = 0,
                len = imgs.length;
            load();
            function load(){
                var imgObj = new Image();
                imgObj.onload = imgObj.onerror = function(){
                    opts.each && opts.each(count);

                    if(count >= len-1){
                        opts.all && opts.all();
                    }else{
                        load();
                    }
                    count++;
                };

                imgObj.src = imgs[count];
            }
        }
    });
    window.PreLoad = function(imgs,options){
        new PreLoad(imgs,options);
    }
})();
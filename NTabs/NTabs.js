 (function(window) {
     //NTab构造函数
     function NTabs(el) {
         this.el = el;
         this._init()
     }

     //初始化标签和Content文本域
     NTabs.prototype._init = function() {
         this.tabs = [].slice.call(this.el.querySelectorAll('nav > ul > li'));
         this.items = [].slice.call(this.el.querySelectorAll('.content-wrap > section'));
         this.current = -1;
         this._show();
         this._initEvent()
     };

     //标签添加点击事件，用来切换Content域
     NTabs.prototype._initEvent = function() {
         var self = this;
         this.tabs.forEach(function(tab, index) {
             tab.addEventListener('click', function(e) {
                 e.preventDefault();
                 self._show(index)
             })
         })
     };

     //初始化时显示第一栏，点击时通过样式改变实现切换
     NTabs.prototype._show = function(index) {
         if (this.current >= 0) {
             this.tabs[this.current].className = this.items[this.current].className = '';
         }
         this.current = index != undefined ? index : 0;
         this.tabs[this.current].className = 'tab-current';
         this.items[this.current].className = 'content-current';
     };

     window.NTabs = NTabs;
 })(window);

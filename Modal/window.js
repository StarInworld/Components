define(['widget','jquery'],function(widget,$){
   function Window(){
       //定制弹窗的宽高
       this.config = {
           width:500,
           height:300,
           title:'系统消息',
           content:'',
           //是否具有模态效果
           hasMask:true,
           //是否可拖动，未实现
           isDraggable:true,
           //是否有皮肤class
           skinClassName:null,

           //alert相关属性
           //确认按钮文本
           textAlertBtn:'确认',
           //确认按钮操作
           handlerAlertBtn:null,
           //是否添加关闭按钮
           hasCloseBtn:false,
           //关闭按钮操作
           handlerCloseBtn:null,

           //confirm相关属性
           //确定按钮文本
           textConfirmBtn:'确定',
           //确定按钮操作
           handlerConfirmBtn:null,
           //取消按钮文本
           textCancelBtn:'取消',
           //取消按钮操作
           handlerCancelBtn:null
       };
   }



   Window.prototype = $.extend({},new widget.Widget(),{
       renderUI:function(){
           var footerContent = '';
           switch(this.config.winType){
               case 'alert':
                   footerContent = '<input type="button" class="window_alertBtn" value="' + this.config.textAlertBtn + '">';
                   break;
               case 'confirm':
                   footerContent = '<input type="button" class="window_confirmBtn" value="' + this.config.textConfirmBtn + '">' +
                                   '<input type="button" class="window_cancelBtn" value="' + this.config.textCancelBtn + '">';
                   break;
           }
           this.boundingBox = $('<div class="window_boundingBox">'+
                                   '<div class="window_header">' + this.config.title + '</div>' +
                                   '<div class="window_body">' + this.config.content + '</div>' +
                                   '<div class="window_footer">' +  footerContent + '</div>' +
                               '</div>');
           if(this.config.hasMask){
               this._mask = $('<div class="window_mask"></div>');
               this._mask.appendTo('body');
           }
           if(this.config.hasCloseBtn){
               this.boundingBox.append('<span class="window_closeBtn">X</span>');
           }
           this.boundingBox.appendTo('body');
       },
       bindUI:function(){
           var that = this;
           this.boundingBox.delegate('.window_alertBtn','click',function(){
               that.fire('alert');
               that.destroy();
           }).delegate('.window_closeBtn','click',function(){
               that.fire('close');
               that.destroy();
           }).delegate('.window_confirmBtn','click',function(){
               that.fire('confirm');
               that.destroy();
           }).delegate('.window_cancelBtn','click',function(){
               that.fire('cancel');
               that.destroy();
           });
           //模态背景点击关闭效果
           if(this._mask){
               this._mask.click(function(){
                   that.destroy();
               })
           }
           if(this.config.handlerCloseBtn){
               this.on('close',this.config.handlerCloseBtn);
           }
           if(this.config.handlerAlertBtn){
               this.on('alert',this.config.handlerAlertBtn);
           }
           if(this.config.handlerConfirmBtn){
               this.on('confirm',this.config.handlerConfirmBtn);
           }
           if(this.config.handlerCancelBtn){
               this.on('cancel',this.config.handlerCancelBtn);
           }
       },
       syncUI:function(){
           this.boundingBox.css({
               width:this.config.width + 'px',
               height:this.config.height + 'px',
               //定制弹窗的位置，默认为居中
               left:(this.config.left || (window.innerWidth - this.config.width)/2) + 'px',
               top:(this.config.top || (window.innerHeight - this.config.height)/2) + 'px'
           });
           if(this.config.skinClassName){
               this.boundingBox.addClass(this.config.skinClassName);
           }
       },
       destructor:function(){
           this._mask && this._mask.remove();
       },
       alert:function(config){
           $.extend(this.config,config,{winType:'alert'});
           this.render();
           return this;
           // var CFG = $.extend(this.config,config);
           // var boundingBox = $('<div class="window_boundingBox">'+
           //                      '<div class="window_header">' + CFG.title + '</div>' +
           //                     '<div class="window_body">' + CFG.content + '</div>' +
           //                     '<div class="window_footer"><input type="button" class="window_alertBtn" value="' + CFG.textAlertBtn + '"></div>' +
           //                  '</div>');
           // boundingBox.appendTo("body");
           // var btn = boundingBox.find('.window_footer input'),
           //     mask=null,
           //     that = this;
           // if(CFG.hasMask){
           //     mask = $('<div class="window_mask"></div>');
           //     mask.appendTo('body');
           // }
           // btn.click(function(){
           //     boundingBox.remove();
           //     mask && mask.remove();
           //     that.fire('alert');
           // });
           // boundingBox.css({
           //     width:this.config.width + 'px',
           //     height:this.config.height + 'px',
           //     //定制弹窗的位置，默认为居中
           //     left:(this.config.left || (window.innerWidth - this.config.width)/2) + 'px',
           //     top:(this.config.top || (window.innerHeight - this.config.height)/2) + 'px'
           // });
           // if(CFG.hasCloseBtn){
           //     var closeBtn = $('<span class="window_closeBtn">X</span>');
           //     closeBtn.appendTo(boundingBox);
           //     closeBtn.click(function(){
           //         boundingBox.remove();
           //         mask && mask.remove();
           //         that.fire('close');
           //     })
           // }
           // if(CFG.handlerCloseBtn){
           //     this.on('close',CFG.handlerCloseBtn);
           // }
           // if(CFG.handlerAlertBtn){
           //     this.on('alert',CFG.handlerAlertBtn);
           // }
           // if(CFG.skinClassName){
           //     boundingBox.addClass(CFG.skinClassName);
           // }
           // return this;
       },
       confirm:function(config){
           $.extend(this.config,config,{winType:'confirm'});
           this.render();
           return this;
       }
   });
   return {
       Window:Window
   }
});
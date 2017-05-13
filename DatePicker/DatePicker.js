define(['widget','jquery'],function(widget,$){
    function DatePicker(){
        var today = new Date();
        this.changeMonth = null;
        this.config={
            year:today.getFullYear(),//年份
            month:today.getMonth() + 1,//月份
            isOpen:false,//是否展开
            input:null,//日历选择器所挂载的文本框
            container:null
        }
    }

    DatePicker.prototype = $.extend({},new widget.Widget(),{
        renderUI:function(){
            //获取当前日历年月
            var currentMonthDate = this.getMonthData(this.config.year,this.config.month),
                year = currentMonthDate.year,
                month = currentMonthDate.month;
            if(this.changeMonth === 'pre'){
                month--;
            }
            if(this.changeMonth === 'next'){
                month++;
            }
            //切换日期后更新对象的year、month
            this.config.year = year;
            this.config.month = month;

            //构建日历html结构
            var monthDate = this.getMonthData(year,month),
                headerContent,
                bodyContent,
                tableContent='';

            headerContent = $('<div class="ui-datepicker-header">'+
                                '<a href="#" class="ui-datepicker-btn ui-datepicker-pre-btn">&lt;</a>'+
                                '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>'+
                                '<span class="ui-datepicker-current-month">'+
                                monthDate.year + '-' + monthDate.month +
                                '</span>'+
                            '</div>');

            for(var i = 0; i < monthDate.days.length;i++){
                var date = monthDate.days[i];
                if(i%7 === 0){
                    tableContent += '<tr>';
                }
                tableContent += '<td data-date="'+ date.date +'">' + date.showDate + '</td>';
                if(i%7 === 6){
                    tableContent += '</tr>';
                }
            }

            bodyContent = $('<div class="ui-datepicker-body">'+
                                '<table>'+
                                    '<thead>'+
                                        '<tr>'+
                                        '<th>一</th>'+
                                        '<th>二</th>'+
                                        '<th>三</th>'+
                                        '<th>四</th>'+
                                        '<th>五</th>'+
                                        '<th>六</th>'+
                                        '<th>七</th>'+
                                        '</tr>'+
                                    '</thead>'+
                                    '<tbody>'+
                                        tableContent +
                                    '</tbody>'+
                                '</table>'+
                '</div>');

            //采用单例模式
            if(!this.boundingBox){
                this.boundingBox = $('<div class="ui-datepicker-wrapper"></div>');
                // $(container || document.body).append(this.boundingBox);
            }
            this.boundingBox.empty().append(headerContent).append(bodyContent);
        },
        bindUI:function(){
            var input = this.config.input,
                that = this;
            //input框点击展开/关闭日历选择器
            input.click(function(){
                if(that.config.isOpen){
                    that.boundingBox.css({
                        display:'block'
                    })
                }else{
                    that.boundingBox.css({
                        display:'none'
                    })
                }
                that.config.isOpen = !that.config.isOpen;
            });
            //切换月份
            this.boundingBox.delegate('.ui-datepicker-pre-btn','click',function(){
                that.changeMonth = 'pre';
                that.renderUI(that.config.container);
            });
            this.boundingBox.delegate('.ui-datepicker-next-btn','click',function(){
                that.changeMonth = 'next';
                that.renderUI(that.config.container);
            });
            //点击单元格更新input内容
            this.boundingBox.delegate('td','click',function(){
                var date = new Date(that.config.year,that.config.month - 1,this.dataset.date);
                input.val(that.format(date));
                that.boundingBox.css({
                    display:'none'
                });
                that.config.isOpen = !that.config.isOpen;
            })
        },
        syncUI:function(){
            var input = this.config.input,
                left,
                height,
                top;
            if(input){
                left = input.offset().left;
                top = input.offset().top;
                height = input.outerHeight();
                this.boundingBox.css({
                    top:top+height+2+'px',
                    left:left+'px',
                    display:'none'
                });
            }
        },
        destructor:function(){},
        getMonthData:function(year,month){

            var ret = [];

            var firstDay = new Date(year,month-1,1);//获取该月第一天
            var firstDayWeekDay = firstDay.getDay();//获取第一天是周几
            if(firstDayWeekDay === 0){
                firstDayWeekDay = 7;
            }

            //获取year 和 month （传入的参数可能存在溢出的问题）
            year = firstDay.getFullYear();
            month = firstDay.getMonth()+1;

            var lastDayOfLastMonth = new Date(year,month-1,0);//获取上月最后一天
            var lastDateOfLastMonth = lastDayOfLastMonth.getDate();//获取上月最后一天时几号

            var preMonthDayCount = firstDayWeekDay - 1;//上月的日子在本月中有几天

            var lastDay = new Date(year,month,0);//获取本月最后一天
            var lastDate = lastDay.getDate();//获取本月最后一天是几号

            for(var i = 0; i < 7*6; i++){
                var date = i - preMonthDayCount + 1; //计算表格中每格分别是几号
                var showDate = date; //显示在表格中每格的数字，需要对负数和超过本月最后一天的数字作处理
                var thisMonth = month;

                if(date <= 0){
                    //上一月
                    thisMonth = month-1;
                    showDate = lastDateOfLastMonth + date;
                }else if(date > lastDate){
                    //下一月
                    thisMonth = month + 1;
                    showDate = date - lastDate;
                }

                if(thisMonth === 0){
                    thisMonth = 12;
                }
                if(thisMonth === 13){
                    thisMonth = 1;
                }

                ret.push({
                    month:thisMonth,
                    date:date,
                    showDate:showDate
                })
            }

            return {
                year:year,
                month:month,
                days:ret
            };
        },
        init:function(config){
            $.extend(this.config,config);
            this.render(this.config.container);
            return this;
        },
        format:function(date){
            var str = '';

            var padding = function(num){
                return num < 9 ?  '0' + num :  num;
            };

            str += date.getFullYear() + '-';
            str += padding(date.getMonth() + 1) + '-';
            str += padding(date.getDate());

            return str;
        }
    });
    // datepicker.getMonthData = function(year,month){
    //
    //     var ret = [];
    //
    //     if(!year || !month){
    //         var today = new Date();
    //         year = today.getFullYear();
    //         month = today.getMonth() + 1;
    //     }
    //
    //     var firstDay = new Date(year,month-1,1);//获取该月第一天
    //     var firstDayWeekDay = firstDay.getDay();//获取第一天是周几
    //     if(firstDayWeekDay === 0){
    //         firstDayWeekDay = 7;
    //     }
    //
    //     //获取year 和 month （传入的参数可能存在溢出的问题）
    //     year = firstDay.getFullYear();
    //     month = firstDay.getMonth();
    //
    //     var lastDayOfLastMonth = new Date(year,month-1,0);//获取上月最后一天
    //     var lastDateOfLastMonth = lastDayOfLastMonth.getDate();//获取上月最后一天时几号
    //
    //     var preMonthDayCount = firstDayWeekDay - 1;//上月的日子在本月中有几天
    //
    //     var lastDay = new Date(year,month,0);//获取本月最后一天
    //     var lastDate = lastDay.getDate();//获取本月最后一天是几号
    //
    //     for(var i = 0; i < 7*6; i++){
    //         var date = i - preMonthDayCount + 1; //计算表格中每格分别是几号
    //         var showDate = date; //显示在表格中每格的数字，需要对负数和超过本月最后一天的数字作处理
    //         var thisMonth = month;
    //
    //         if(date <= 0){
    //             //上一月
    //             thisMonth = month-1;
    //             showDate = lastDateOfLastMonth + date;
    //         }else if(date > lastDate){
    //             //下一月
    //             thisMonth = month + 1;
    //             showDate = date - lastDate;
    //         }
    //
    //         if(thisMonth === 0){
    //             thisMonth = 12;
    //         }
    //         if(thisMonth === 13){
    //             thisMonth = 1;
    //         }
    //
    //         ret.push({
    //             month:thisMonth,
    //             date:date,
    //             showDate:showDate
    //         })
    //     }
    //
    //     return {
    //         year:year,
    //         month:month,
    //         days:ret
    //     };
    // };
    return {
        DatePicker:DatePicker
    }
});

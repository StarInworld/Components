require.config({
    paths:{
        jquery:'../public/js/jquery-3.1.1.min',
        widget:'../Widget'
    }
});

require(['jquery','DatePicker'],function($,dp){
    new dp.DatePicker().init({
        input:$('.datepicker')
    })
});
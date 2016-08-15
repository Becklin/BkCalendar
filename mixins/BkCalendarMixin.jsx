var BkCalendarMixin = {
   formatGenerator : function (time){
        if (time.toString().length == 1) {
         time = "0" + time;
        };
        return time.toString();
   }
};

module.exports =  BkCalendarMixin;
class CommonJS {
    /*
    * định dạng hiển thị thông tin ngày là ( ngày/tháng/năm)
    *
    */ 

    static formatDateDDMMYYYY(date){
        if(date){
            const newDate = new Date(date);
            let day = newDate.getDate();
            let month = newDate.getMonth()+1;
            let year = newDate.getFullYear();
            day =  day<10?`0${day}`:day;
            month = month<10?`0${month}`:month;
            return `${day}/${month}/${year}`;
        }
        else
            return;
        
    }
    /*
    * định dạng hiển thị thông tin ngày là ( ngày/tháng/năm)
    *
    */ 
}
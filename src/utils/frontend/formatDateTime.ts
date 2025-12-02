export const formatDateTime = (time : string , date : Date ) => {
    if(!date){
        return ; 
    }
    //date format =  Thu Nov 27 2025 00:00:00 GMT+0530
   const [hour , minute] = time.split(":").map(Number); 
   date.setHours(hour);
   date.setMinutes(minute);
   return date ; 
}


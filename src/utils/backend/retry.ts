//bulid a wrapper function which retries if the function fails 
const sleep = ( ms : number ) => {
    return new Promise<void>((resolve) => {
        setTimeout( resolve , ms)
    }); 
}
//t and r are type variables 
export const functionWrapper = async<T extends unknown[] , R>(
    someFunction : (...args : T) => Promise<R>, 
    args : T
) : Promise<R> => {
    let retryLimit = 0 ; 
    let lastError : unknown ; 

    while( retryLimit < 3){
        try{
            return await someFunction(...args);
        } catch (error){
            console.error("Function failed , activating retries ", error);
            lastError = error ; 
            retryLimit++ ; 

            if(retryLimit < 3){
                await sleep(2000)
            } 
        }
    }

    throw lastError ; 
}
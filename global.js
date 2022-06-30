var globalPerformance = {
    cpu: null,
    freemem: null,
    totalmem: null

}

function setcpu_data(data){
    globalPerformance.cpu = data;
}
function getcpu_data(){
    const data = globalPerformance.cpu
    return data;
}

function setfreemem_data(data){
    globalPerformance.freemem = data;
}
function getfreemem_data(){
    const data = globalPerformance.freemem
    return data;
}

function settotalmem_data(data){
    globalPerformance.totalmem = data;
}
function gettotalmem_data(){
    const data = globalPerformance.totalmem
    return data;
}


module.exports = { setcpu_data: setcpu_data, 
                   getcpu_data: getcpu_data, 
                   setfreemem_data: setfreemem_data,
                   getfreemem_data: getfreemem_data,
                   settotalmem_data: settotalmem_data,
                   gettotalmem_data:  gettotalmem_data}


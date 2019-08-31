module.exports= (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const formatDate = `${year}-${month}-${day}`;
    return {
        date,        
        formatDate,
    }
}
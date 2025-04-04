function getFormattedDate() {
    const date = new Date();

    // Get the month, day, and year
    const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = date.getDate();
    const year = date.getFullYear();

    // Format month, day, and year to ensure they are two digits
    const formattedMonth = month < 10 ? "0" + month : month;
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedYear = year.toString().slice(-2); // Get last two digits of the year

    // Return the date in mm/dd/yy format
    return (formattedMonth + "/" + formattedDay + "/" + formattedYear);
}

function clearTextArea(){
    // clears the text area
    document.getElementById("output").value = "";
}

function addToTextArea(text){
    // adds string to the text area.
    document.getElementById("output").value = document.getElementById("output").value + text;
}

function descriptionFormatter(desc){
    // formats the description so it fits better when converting it to a string.
    while(desc.length < 30){
        desc = desc + " ";
    }
    return desc;
}

function skuFormatter(sku){
    // formats the sku  so it fits better when converting it to a string.
    while(sku.length < 8){
        sku = sku + " ";
    }
    return sku;
}

function sortArray(array){
    // sorting the array by class makes it easier to find product in the store.
    array.sort((a,b) => a[0] - b[0]);
    return array;
}
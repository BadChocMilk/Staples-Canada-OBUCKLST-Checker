function checkOpenBox() {
    let oldArray;
    let newArray;
    // most of this function was taken from the online guide https://medium.com/@sudipb001/how-to-convert-an-excel-file-to-a-csv-file-using-javascript-4e688e167641. Thank you Sudip!
    if (document.getElementById("xlf1").files.length === 0){
        alert("No previous file is selected!")
        return
    }

    if (document.getElementById("xlf2").files.length === 0){
        alert("No current file is selected!")
        return
    }


    const xlf1 = document.getElementById("xlf1").files[0];
    const fileReader = new FileReader();
   

    fileReader.onload = function (e){
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: "array"});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const cvsData = XLSX.utils.sheet_to_csv(worksheet);
        oldArray = worksheetToArray(worksheet);
        oldArray = sortArray(oldArray);
        const xlf2 = document.getElementById("xlf2").files[0];
        const fileReader2 = new FileReader();
      
    
        fileReader2.onload = function (e){
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: "array"});
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const cvsData = XLSX.utils.sheet_to_csv(worksheet);
            console.log(worksheet);
            newArray = worksheetToArray(worksheet);
            newArray = sortArray(newArray);
            let negativeArray = checkForNegatives(worksheet);
            compareArrays(oldArray, newArray, negativeArray);
        }
        fileReader2.readAsArrayBuffer(xlf2);
    }
    fileReader.readAsArrayBuffer(xlf1);
    
    console.log("Hello from the console!");
}

function worksheetToArray(worksheet) {


    let workArray = [];

    let numRows = 1;
    let column = "A" + numRows;
    // try catch counts every entry in the list.
    try{
        while(true){
            worksheet[column]["v"];
            numRows++;
            column = "A" + numRows;
        }
    }catch{
        // because there are column labels, subtract one.
        numRows--;
    }
    for(let i = 2; i <= numRows; i++){
        // A for SKU, C for item Desc., F for class, J for openbox quantity
        let sku = "A" + i;
        let desc = "C" + i;
        let storeClass = "F" + i;
        let openBox = "J" + i;

        // checks to see if there are any openbox products.
        if(worksheet[openBox]['v'] < 1){
            continue;
        }
        // adds them all to an array consisting of ONLY openbox products.
        workArray.push([worksheet[storeClass]['w'], worksheet[sku]['w'], worksheet[desc]['w'], worksheet[openBox]['w']]);
    }
    return workArray;
}

function sortArray(array){
    // sorting the array by class makes it easier to find product in the store.
    array.sort((a,b) => a[0] - b[0]);
    console.log(array);
    return array;
}

function compareArrays(oldArray, newArray, negativeArray){
    
    //totals, just for fun!
    let oldNum = 0;
    let newNum = 0;
    let total = newArray.length;

    let final = "OPENBOX TO COME OFF\nSKU#\t\tDescription\t\t\t\tOpenbox\n"

    // finding the openbox SKUs that need to come off
    for(let i = 0; i < oldArray.length; i++){
        for(let j = 0; j <= newArray.length; j++){
            if( j == newArray.length){
                final = final + oldArray[i][1] + "\t\t" + oldArray[i][2]+ "\t\t   " + oldArray[i][3] + "\n";
                oldNum++;
                break;
            }
            if(oldArray[i][1] != newArray[j][1]){
                //console.log(oldArray[i][1] + "\t" + newArray[j][1])
                continue;
            }
            else{
                break;
            }
        }
    }

    // now to do it again, but for SKUs that need to go up. 

    final = final + "\n\nOPENBOX TO GO ON\nSKU#\t\tDescription\t\t\t\tOpenbox\n"

    for(let i = 0; i < newArray.length; i++){
        for(let j = 0; j <= oldArray.length; j++){
            if( j == oldArray.length){
                final = final + newArray[i][1] + "\t\t" + newArray[i][2]+ "\t\t   " + newArray[i][3] + "\n";
                newNum++;
                break;
            }
            if(newArray[i][1] != oldArray[j][1]){
                //console.log(oldArray[i][1] + "\t" + newArray[j][1])
                continue;
            }
            else{
                break;
            }
        }
    }

    // now to add the negatives, if any.
    if(negativeArray == null){
        console.log(final);
        return;
    }
    else{
        final = final + "\n\nNEGATIVES ON OPENBOX\nSKU#\t\tDescription\t\t\t\tOpenbox\n"
        for(let i = 0; i < negativeArray.length; i++){
            final = final + negativeArray[i][0] + "\t\t" + negativeArray[i][1]+ "\t\t   " + negativeArray[i][2] + "\n";
        }
    }
    final = final + "\nTOTALS\noff: " + oldNum + "\ton: " + newNum + "\nnet: " + (newNum - oldNum) + "\ttotal: " + total;
    console.log(final);
    document.getElementById("output").value = final;
}

function checkForNegatives(worksheet){
    // checks to see if any of the openbox products have negatives to be corrected. Very similar to worksheetToArray

    let workArray = [];

    let numRows = 1;
    let column = "A" + numRows;
    // try catch counts every entry in the list.
    try{
        while(true){
            worksheet[column]["v"];
            numRows++;
            column = "A" + numRows;
        }
    }catch{
        // because there are column labels, subtract one.
        numRows--;
    }
    for(let i = 2; i <= numRows; i++){
        // A for SKU, C for item Desc., J for openbox quantity
        let sku = "A" + i;
        let desc = "C" + i;
        let openBox = "J" + i;

        // checks to see if there are any negative openbox products.
        if(worksheet[openBox]['v'] > -1){
            continue;
        }
        // adds them all to an array consisting of ONLY negative openbox products.
        workArray.push([worksheet[sku]['w'], worksheet[desc]['w'], worksheet[openBox]['w']]);
    }
    return workArray;
}

function downloadTXT(){
    // turning the contents of the text area to a txt file
    const contents = document.getElementById("output").value;
    // checks to see if there is actually anything in the text area
    if(contents == ""){
        alert("There is nothing to be downloaded!")
        return;
    }
    const blob = new Blob([contents], {type: "text/plain"});
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);

    a.href = url;
    // this will add the date to the file name
    a.download = "openbox_" + getFormattedDate() + ".txt"

    // this is what downloads it!
    a.click();

    // cleanup of the URL
    URL.revokeObjectURL(url);
}

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
    return (formattedMonth + formattedDay + formattedYear);
}

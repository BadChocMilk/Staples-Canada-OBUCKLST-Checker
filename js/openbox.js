function checkOpenBox() {
    let oldArray;
    let newArray;
    // most of this function was taken from the online guide https://medium.com/@sudipb001/how-to-convert-an-excel-file-to-a-csv-file-using-javascript-4e688e167641. Thank you Sudip!

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
            newArray = worksheetToArray(worksheet);
            newArray = sortArray(newArray);
            let negativeArray = checkForNegatives(worksheet);
            final = compareArrays(oldArray, newArray, negativeArray);
        }
        fileReader2.readAsArrayBuffer(xlf2);
    }
    fileReader.readAsArrayBuffer(xlf1);
    
    console.log("Hello from the console!");
}

function checkOpenBoxButton(){

    // first checks to see if there is a file
    if (document.getElementById("xlf1").files.length === 0){
        alert("No previous file is selected!")
        return
    }

    if (document.getElementById("xlf2").files.length === 0){
        alert("No current file is selected!")
        return
    }

    // then it clears the text box
    clearTextArea();
    checkOpenBox();
    
}

function fullOpenBoxList(){
    let obList;

    // grabs the current week file
    const xlf2 = document.getElementById("xlf2").files[0];
    const fileReader = new FileReader();

    fileReader.onload = function (e){
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: "array"});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const cvsData = XLSX.utils.sheet_to_csv(worksheet);
        obList = worksheetToArray(worksheet);
        obList = sortArray(obList);
        final = arrayToOBString(obList);
    }
    fileReader.readAsArrayBuffer(xlf2)
}

function fullOpenBoxListButton(){


    // checks if the file is there
    if (document.getElementById("xlf2").files.length === 0){
        alert("To get an OpenBox list, only current needs a file.")
        return
    }
    // then clears the text box if it is there
    clearTextArea();
    fullOpenBoxList();
}

function compareArrays(oldArray, newArray, negativeArray){
    
    //totals, just for fun!
    let oldNum = 0;
    let newNum = 0;

    let final = "OPENBOX TO COME OFF\nSKU\t\tDescription\t\t\t\tOpenBox\n"

    // finding the openbox SKUs that need to come off
    for(let i = 0; i < oldArray.length; i++){
        for(let j = 0; j <= newArray.length; j++){
            if( j == newArray.length){
                final = final + oldArray[i][1] + "\t" + oldArray[i][2]+ "\t\t   " + oldArray[i][3] + "\n";
                oldNum++;
                break;

            }
            if(oldArray[i][1] != newArray[j][1]){
                continue;
            }
            else{
                break;
            }
        }
    }

    // now to do it again, but for SKUs that need to go up. 

    final = final + "\n\nOPENBOX TO GO ON\nSKU\t\tDescription\t\t\t\tOpenBox\n"

    for(let i = 0; i < newArray.length; i++){
        for(let j = 0; j <= oldArray.length; j++){
            if( j == oldArray.length){
                final = final + newArray[i][1] + "\t" + newArray[i][2]+ "\t\t   " + newArray[i][3] + "\n";
                newNum++;
                break;  

            }
            if(newArray[i][1] != oldArray[j][1]){
                continue;
            }
            else{
                break;
            }
        }
    }

    // now to add the negatives, if any.
    if(negativeArray.length == 0){}
    else{
        final = final + "\n\nNEGATIVES ON OPENBOX\nSKU#\t\tDescription\t\t\t\tOpenBox\n"
        for(let i = 0; i < negativeArray.length; i++){
            final = final + skuFormatter(negativeArray[i][0]) + "\t" + descriptionFormatter(negativeArray[i][1])+ "\t\t  " + negativeArray[i][2] + "\n";
        }
    }
    final = final + "\noff: " + oldNum + "\ton: " + newNum + "\tnet: " + (newNum - oldNum);

    addToTextArea(final);
    return final;
}

function arrayToOBString(array){
    // this will turn the array into a string to be displayed in the text area.
    let final ="SKU\t\tDescription\t\t\t\tOpenBox\n";
    let count = 0;
    

    for(let i = 0; i < array.length; i++){
            final = final + array[i][1] + "\t" + array[i][2]+ "\t\t   " + array[i][3] + "\n";
            count++;
    }
    final = final + "\nTotal: " + count + "\n\n";

    addToTextArea(final);
    return final;
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

function getCombinedList(){

    // check to see if there is a file
    if (document.getElementById("xlf1").files.length === 0){
        alert("No previous file is selected!")
        return
    }

    if (document.getElementById("xlf2").files.length === 0){
        alert("No current file is selected!")
        return
    }

   // clear the text area
   clearTextArea();
    

    // adds both of them to the text area.
    fullOpenBoxList();
    checkOpenBox();
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
        workArray.push([worksheet[storeClass]['w'], skuFormatter(worksheet[sku]['w']), descriptionFormatter(worksheet[desc]['w']), worksheet[openBox]['w']]);
    }
    return workArray;
}
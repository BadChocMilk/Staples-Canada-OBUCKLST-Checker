function negativeNewsButton(){

    // checks if the file is there
    if (document.getElementById("xlf2").files.length === 0){
        alert("To get a negative new list, only current needs a file.")
        return
    }

    //clear text area
    clearTextArea();
    negativeNews();
}

function negativeNews(){
    let obList;

    // grabs the current week file
    const xlf2 = document.getElementById("xlf2").files[0];
    const fileReader = new FileReader();

    fileReader.onload = function (e){
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: "array"});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const cvsData = XLSX.utils.sheet_to_csv(worksheet);
        obList = worksheetToNegativeNewArray(worksheet);
        obList = sortArray(obList);
        final = arrayToNegativeNewString(obList);
    }
    fileReader.readAsArrayBuffer(xlf2)
}

function worksheetToNegativeNewArray(worksheet){
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
        // the numbers here align with what the number cell in the spreadsheet would be.
        let sku = "A" + i;
        let desc = "C" + i;
        let storeClass = "F" + i;
        let demo = "H" + i;
        let verify = "G" + i;
        let openBox = "J" + i;
        let negativeNew = "K" + i;

        // checks to see if there are any negative new products.
        if(worksheet[negativeNew]['v'] >= 0){
            continue;
        }
        // adds them all to an array consisting of negative new products, along with where the source of the negative new would be.
        workArray.push([worksheet[storeClass]['w'], skuFormatter(worksheet[sku]['w']), descriptionFormatter(worksheet[desc]['w']), worksheet[negativeNew]['w'], worksheet[demo]['w'], worksheet[verify]['w'], worksheet[openBox]['w']]);
    }
    return workArray;
}

function arrayToNegativeNewString(array){
    // this will turn the array into a string to be displayed in the text area.
    let final ="SKU\t\tDescription\t\t\t\tNegativeNew\t   Demo\t\tVerify\t\tOpenBox\n";
    let count = 0;
    
    // random spaces and \t's make for a nicer looking list when it gets displayed.
    for(let i = 0; i < array.length; i++){
            final = final + array[i][1] + "\t" + array[i][2]+ "\t\t    " + array[i][3] + "\t\t     " + array[i][4] + "\t\t   " + array[i][5] + "\t\t   " + array[i][6] + "\n";
            count++;
    }
    final = final + "\nTotal: " + count + "\n\n";

    addToTextArea(final);
    return final;
}
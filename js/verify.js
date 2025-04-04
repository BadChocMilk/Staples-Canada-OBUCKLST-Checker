function verifyButton(){
    // clear text area.
    clearTextArea();
}

function verify(){
    let verifyList

    // grabs the current week file
    const xlf2 = document.getElementById("xlf2").files[0];
    const fileReader = new FileReader();

    fileReader.onload = function (e){
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: "array"});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const cvsData = XLSX.utils.sheet_to_csv(worksheet);
        verifyList = worksheetToVerifyArray(worksheet);
        verifyList = sortArray(verifyList);
        final = arrayToVerifyString(verifyList);
    }
    fileReader.readAsArrayBuffer(xlf2)
}

function worksheetToVerifyArray(worksheet){
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
        // A for SKU, C for item Desc., F for class, G for verify quantity
        let sku = "A" + i;
        let desc = "C" + i;
        let storeClass = "F" + i;
        let verify = "G" + i;

        // checks to see if there are any verify products.
        if(worksheet[verify]['v'] < 1){
            continue;
        }
        // adds them all to an array consisting of ONLY verify products.
        workArray.push([worksheet[storeClass]['w'], skuFormatter(worksheet[sku]['w']), descriptionFormatter(worksheet[desc]['w']), worksheet[openBox]['w']]);
    }
    return workArray;
}

function arrayToVerifyString(array){
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
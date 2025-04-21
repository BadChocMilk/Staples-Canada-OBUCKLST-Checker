function negativeNewsButton(){

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
        obList = worksheetToArray(worksheet);
        obList = sortArray(obList);
        final = arrayToOBString(obList);
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
        // A for SKU, C for item Desc., F for class, G for verify quantity
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
        // adds them all to an array consisting of ONLY verify products.
        workArray.push([worksheet[storeClass]['w'], skuFormatter(worksheet[sku]['w']), descriptionFormatter(worksheet[desc]['w']), worksheet[verify]['w']]);
    }
    return workArray;
}
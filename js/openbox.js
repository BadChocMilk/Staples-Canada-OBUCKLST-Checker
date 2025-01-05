function checkOpenBox() {
    let oldArray;
    let newArray;
    // most of this function was taken from the online guide https://medium.com/@sudipb001/how-to-convert-an-excel-file-to-a-csv-file-using-javascript-4e688e167641. Thank you Sudip!
    if (document.getElementById("xlf1").files.length === 0){
        alert("No file is selected!")
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
            compareArrays(oldArray, newArray);
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

function compareArrays(oldArray, newArray){

    let final = "SKU\tDescription\tOpenbox\nOPENBOX TO COME OFF\n"
    console.log(oldArray);

    // finding the openbox SKUs that need to come off
    console.log(oldArray.length);
    console.log(newArray.length);
    for(let i = 0; i < oldArray.length; i++){
        for(let j = 0; j < newArray.length; j++){
            if(oldArray[i][1] != newArray[j][1]){
                //console.log(oldArray[i][1] + "\t" + newArray[j][1])
                continue;
            }
            else{
                console.log("equal found!");
                break;
            }
            final = final + oldArray[i][1] + oldArray[i][2] + oldArray[i][3];
        }
    }

    console.log(final);
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

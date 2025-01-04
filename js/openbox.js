function checkOpenBox() {

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
        let oldArray = worksheetToArray(worksheet);
        oldArray = sortArray(oldArray);
    }

    const xlf2 = document.getElementById("xlf2").files[0];
    fileReader = new FileReader();

    fileReader.onload = function (e){
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: "array"});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const cvsData = XLSX.utils.sheet_to_csv(worksheet);
        let newArray = worksheetToArray(worksheet);
        newArray = sortArray(newArray);
    }

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
    // number of openbox
    let numOB = 0
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
        // once the product is added to the array, we want the number of openbox to go up!
        numOB++;
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

}

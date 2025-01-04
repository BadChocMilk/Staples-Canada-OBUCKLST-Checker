function checkOpenBox() {
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
        // A for SKU, C for item Desc., F for class, J for openbox quantity
    }

    fileReader.readAsArrayBuffer(xlf1);
    console.log("Hello from the console!");
    worksheetToArray(worksheet);
    
}

function worksheetToArray(worksheet) {

    let temp = 0;
    let column = "A" + temp;
    try{
        while(true){
            worksheet[column]["v"];
            temp++;
            column = "A" + temp;
        }
    }catch{
        console.log(temp);
    }
    
}


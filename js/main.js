function checkOpenBox() {
    if (document.getElementById(xlf1).files.length === 0){
        alert("No file is selected!")
        return
    }

    const xlf1 = document.getElementById(xlf1).files[0];
    const fileReader = new FileReader();

    fileReader.onload = function (e){
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: "array"});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const cvsData = XLSX.utils.sheet_to_csv(worksheet);
    }

    fileReader.readAsArrayBuffer(xlf1);
    console.log("Hello from the console!");
}


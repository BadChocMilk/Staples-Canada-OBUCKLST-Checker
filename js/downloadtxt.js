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
    a.download = "openbox_" + getFormattedDate().replaceAll("/", "") + ".txt"

    // this is what downloads it!
    a.click();

    // cleanup of the URL
    URL.revokeObjectURL(url);
}

function printTXT(){
    // handles printing of the file instead of downloading it as a txt
    let content = document.getElementById("output").value;
    let printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write('<html><head><title>OpenBox</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; margin: 20px; }</style>'); // Basic styles
    printWindow.document.write('</head><body>');
    printWindow.document.write("<pre>" + content+ "</pre>");
    printWindow.document.write('</body></html>');


    printWindow.document.close();
    printWindow.print();
}

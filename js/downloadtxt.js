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
    return (formattedMonth + "/" + formattedDay + "/" + formattedYear);
}

/**
 * This is the JavaScript code that we'll be running on our website
 * 
 * * { Scanner, List }
 * todo {}
 */
/**
 * normal
 * !
 * todo:
 * ?
 * *
 * //
 */

// Lista de elementos escaneados
 var arr = [];

/**  
 * * Scanner *
 * 
 * Esta sección de código se engarga del escaneo y lectura de códigos de barras y 
 * devuelve el número asociado en la variable: 'decodedText'
 * 
 */

/**
 * Checks if the DOM is available to use 
 * 
 * @param {*} fn Initialization function for html5QRcodeScanner
 */
function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
/**
 * Initialization function for html5QRcodeScanner
 */
docReady(function () {
    var resultContainer = document.getElementById('qr-reader-results');
    var lastResult, countResults = 0;
    
    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            ++countResults;
            lastResult = decodedText;
            console.log(`Scan result ${decodedText}`, decodedResult);              
            arr.push(lastResult);
            console.log(`Scanned codes: ${arr}`);
            resultContainer.innerHTML += `<div>[${countResults}] - ${qrCodeMessage}</div>`;
            // Handle on success condition with the decoded message.
        }
    }
    
    // ! Class initalization
    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: { width: 300, height: 150 } }); // Size of the scan window 
    html5QrcodeScanner.render(onScanSuccess);
});

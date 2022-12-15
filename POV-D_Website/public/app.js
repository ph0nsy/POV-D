/**
 * This is the JavaScript code that we'll be running on our website
 * 
 * * { Scanner, List, Recomended }
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
 
function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          success(JSON.parse(xhr.responseText));
        }
        else {
          error(xhr);
        }
      }
    };
    xhr.open('GET', path, true);
    xhr.send();
  }

function addToList(Data){
    console.log(Data);
    var newElement = '<li><table style="table-layout: fixed; width: 100%;"><tbody><tr><td>' + Data.product.product_name + '</td><td style="text-align: right;">Ración: ' + Data.product.serving_size + '</td><td style="text-align: right;">IG: ' + Data.product.ingredients[0].processing + ' ' + Data.product.ingredients[0].text + '</td></tr></tbody></table></li>';
    $("#List").append(newElement);
    document.getElementById("kcal").value += 5;
    document.getElementById("sugars").value += 5;
    document.getElementById("carbs").value += 5;
    document.getElementById("fat").value += 5;
    document.getElementById("saturated").value += 5;
    document.getElementById("salts").value += 5;
}
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
            loadJSON('https://world.openfoodfacts.org/api/v0/product/'+ decodedText + '.json', addToList,'jsonp');
        }
    }
    
    // ! Class initalization
    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: { width: 300, height: 150 } }); // Size of the scan window 
    html5QrcodeScanner.render(onScanSuccess);
});


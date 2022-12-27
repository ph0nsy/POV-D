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
    var newElement = '<li><table style="table-layout: fixed; width: 100%;"><tbody><tr><td>' + Data.product.product_name + '</td><td style="text-align: right;">Ración: ' + Data.product.serving_size + '</td><td style="text-align: right;">IG: ' + (Data.product.ingredients[0].processing ? Data.product.ingredients[0].processing.slice(3).toLowerCase() : "no") + ' ' + Data.product.ingredients[0].text.split(' ')[0].toLowerCase() + '</td></tr></tbody></table></li>';
    $("#List").append(newElement);
    document.getElementById("kcal").value += Data.product.nutriments["energy-kcal_serving"] ? Data.product.nutriments["energy-kcal_serving"] : 80.0;
    document.getElementById("kcal_v").innerHTML = "<p>"+ document.getElementById("kcal").value +" / " + document.getElementById("kcal").max + "</p>";
    document.getElementById("sugars").value += Data.product.nutriments["sugars_serving"] ? Data.product.nutriments["sugars_serving"] : 10.0;
    document.getElementById("sugars_v").innerHTML = "<p>"+ document.getElementById("sugars").value +" / " + document.getElementById("sugars").max + "</p>";
    document.getElementById("carbs").value += Data.product.nutriments["carbohydrates_serving"] ? Data.product.nutriments["carbohydrates_serving"] : 20.0;
    document.getElementById("carbs_v").innerHTML = "<p>"+ document.getElementById("carbs").value +" / " + document.getElementById("carbs").max + "</p>";
    document.getElementById("fat").value += Data.product.nutriments["fat_serving"] ? Data.product.nutriments["fat_serving"] : 6.0;
    document.getElementById("fat_v").innerHTML = "<p>"+ document.getElementById("fat").value +" / " + document.getElementById("fat").max + "</p>";
    document.getElementById("saturated").value += Data.product.nutriments["saturated-fat_serving"] ? Data.product.nutriments["saturated-fat_serving"] : 2.0;
    document.getElementById("saturated_v").innerHTML = "<p>"+ document.getElementById("saturated").value +" / " + document.getElementById("saturated").max + "</p>";
    document.getElementById("salts").value += Data.product.nutriments["salt_serving"] ? Data.product.nutriments["salt_serving"] : 45.0;
    document.getElementById("salts_v").innerHTML = "<p>"+ document.getElementById("salts").value +" / " + document.getElementById("salts").max + "</p>";
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


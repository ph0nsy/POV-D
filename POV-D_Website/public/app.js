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
var gIarr = [];
var GIlevel = 0;
let res;
let GIdata;

function getGIdata(data){
  GIdata = data;
}

function loadLocalJSON(){
fetch("./assets/GI.json")
  .then(response=>{return response.json();
  })
  .then(jsondata =>{
    getGIdata(jsondata);
  });
}
loadLocalJSON();

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

function checkGIlevel(){
  GIlevel = gIarr.reduce((a, b) => a + b, 0) / gIarr.length;
  if (gIarr.length>0){
    if (GIlevel < 45){
      document.getElementById("warning").innerHTML = "<h2>Estado del índice glucémico de la lista: <b style='color: cornflowerblue; font-variant: small-caps;'>Bueno</b><br></h2>"    
    }
    if (GIlevel < 52){
      document.getElementById("warning").innerHTML = "<h2>Estado del índice glucémico de la lista: <b style='color: seagreen; font-variant: small-caps;'>Aceptable</b><br></h2>"    
    }
    else {
      document.getElementById("warning").innerHTML = "<h2>Estado del índice glucémico de la lista: <b style='color: crimson; font-variant: small-caps;'>Elevado</b><br>¡Deberías reducir el número de productos con un índice glucémico alto!<br></h2>"    
    }
  }
}

function setRes(str){
  res = str;
}



function getGI(product, GIdata){
  $.ajaxSetup({
      async: false
  });
  var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=" + encodeURI(product);
  $.getJSON(url, function(data) {
      let i;
      for(i = 0; i<GIdata.length;i++){  
        if(GIdata[i].nombre.toLowerCase().includes(data[0][0][0].toLowerCase())){
          gIarr.push(GIdata[i].indiceGlucemico);
          if(GIdata[i].indiceGlucemico < 40){
            checkGIlevel();
            setRes("IG Bajo");
          } else if (GIdata[i].indiceGlucemico < 60) {
            checkGIlevel();
            setRes("IG Medio");
          } else {
            checkGIlevel();
            setRes("IG Alto");
          }
          break;
        }
      }
      if(i>=GIdata.length){
        gIarr.push(40);   
        checkGIlevel();
        setRes("IG Medio");
      }
    });
    $.ajaxSetup({
      async: true
    });
}

function addToList(Data){
    console.log(Data);
    getGI(Data.product.ingredients[0].text.split(' ')[0].toLowerCase(), GIdata)
    var newElement = '<li><table style="table-layout: fixed; width: 100%;"><tbody><tr><td>' + Data.product.product_name + '</td><td style="text-align: right;">Ración: ' + Data.product.serving_size + '</td><td style="text-align: right;">'+ res + '</td></tr></tbody></table></li>';
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


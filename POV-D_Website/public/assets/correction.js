let GlycIdx;
// read local JSON file in javascript
fetch("../assets/GI.json")
  .then(response=>{return response.json();
  })
  .then(jsondata =>{
    console.log(jsondata);
    GlycIdx = jsondata ;
    let text = "<h1>Tabla de Índices Glucémicos</h1><table border='1' style='margin: auto; text-align: center;'>"
    for (var x = 0; x < GlycIdx.length; x++) {
      text += "<tr><td>" + GlycIdx[x].nombre + "</td><td>" + GlycIdx[x].indiceGlucemico + "</td></tr>";
    }
    text += "</table>"    
    document.getElementById("alimentos").innerHTML = text;
  });
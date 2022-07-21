var globalData=[];

/* -------------------- Jahreszahlen vom Slider auf index.html abfragen ------------------------ */
function abfrage(offsetNr=0) { //
  var inputVon = document.getElementById("idVon").value; //neue globale Variable, welche die Jahreszahl vom Slider auf index.html entnimmt
  var inputBis = document.getElementById("idBis").value; //neue globale Variable, welche die Jahreszahl vom Slider auf index.html entnimmt
  var offset = offsetNr*16; //hier wird der Offset für die jeweilige Abfrage definiert für die Seitenzahl

/* -------------------- Seitenzahlen unterhalb der Gallerie ------------------------ */
  function seitenZahlen() {
    // Seitenzahlen -> Gallerie durchblättern 
    // Erstellt nummerierte Links (1-10). Klickt man auf diese wird die Funktion abfrage(i) mit der jeweiligen Nummer ausgelöst.
    for (let i = 0; i < 11; i++) { //for-loop 10mal
      let td = document.createElement("td"); //td's damit die Links in derselben Reihe eingefügt werden und nicht untereinander.
      let a = document.createElement("a"); //link-element
      let link = document.createTextNode(""+i+""); //variable mit nummer des links
      a.style.padding="5px"; //abstand zwischen den links
      a.href="#gallerie"; //zur gallerie rausfspringen nach klick auf link
      a.setAttribute("onclick","abfrage("+i+");"); //Funktion als onclick in die Links einfügen
      a.appendChild(link); //nummer des links einfügen
      td.appendChild(a); //den link in das td-element einfügen
      document.querySelector("#pages").appendChild(td);  //das td-element in div mit id=pages einfügen.
    }
  }

/*-------------------------------Request an API via jquery-Funktion--------------------------------------------*/
// Input: Jahreszahlen von abfrage()
// OUTPUT: JSON Daten zu 16 Spielen, die innerhalb eines gewissen Zeitraums veröffentlicht wurden.
$(function (){          
var $data = $('#data');    
$.ajax({
  type: 'POST',
  url: 'https://ursproxy.herokuapp.com/https://api.igdb.com/v4/games', //Um CORS einhalten zu können, musste ein Proxy auf Heroku erstellt werden -> https://ursproxy.herokuapp.com
  headers: {
    "Client-ID": "zr6dwbgsmif9n65ctoavitk8ygr5eo", 
      "Authorization": "Bearer t4k65a5tkr13pmed3e0kvld94tlrqh",
      "Content-Type": "text/json"},
  data: "fields summary, name, release_dates.y,platforms.name,genres.name, cover.url, cover.id, cover.height, cover.width; limit 16; where release_dates.y >= "+inputVon+" & release_dates.y <= "+inputBis+"; offset "+offset+";", // Die Variablen inputVon, inputBis, offset werden in der Funktion abfrage() definiert.
  success: (data) => {    
    
        globalData=data;
  
        /*-----Page reset für neue Abfrage------*/
        document.querySelector("#gallerie").innerHTML=""; //Inhalt der Gallerie entfernen, um Platz für neuen Content von abfrage() zu machen. Sonst würde alles unten angefügt.
        document.querySelector("#pages").innerHTML=""; // wie oben, für die Seitenzahlen unter der Gallerie 

        seitenZahlen() //Seitenzahlen einfügen

        /*-----Gallerie mit Spielen abfüllen via for-Loop------*/
        var len = data.length; //wird vor dem Loops erstellt, damit dies nicht jedesmal neu berechnet wird.
        for (i=0; i < len; i++) { 
                let newURL = data[i].cover.url.replace("/t_thumb/", "/t_screenshot_med/"); // Hier werden die Links zu den Spiele-Covers angepasst, um grössere Bilder darzustellen.  
              
                //Erstellen der Elemente, die in die Gallerie eingefügt werden.
                let img = document.createElement("img");
                  img.src = newURL; //von API erhaltene URL mit angepasster Bild-Grösse
                  img.className="img-fluid"; //für bootstrap

                let a = document.createElement("a"); 
                  a.target = "_blank"; //Öffnet eine neues Fenster, anstelle im bestehenden.
                  a.appendChild(img); //Bild in den Link einfügen
                  a.href = "/page.html?id="+i//+params //URL-Parameter für page.html
                
                let p = document.createElement("p");
                  p.innerHTML= data[i].name;  //Namen der Spiele, die unterhalb der Bilder angezeigt werden.

                let fg = document.createElement("figcaption") //HTML Element für Bilduntertitel innerhalb Figure
                  fg.className="figure-caption"; //Klasse benennen für Bootstrap
                  fg.appendChild(p); //Figure-Caption mit Spieltitel

                let f = document.createElement("figure"); //Figure Element mit Bild & Titel der Spiele
                  f.appendChild(a); //Link mit Bild in das Figure-Element einfügen
                  f.appendChild(fg); //Figure-Caption mit Spieltitel in das Figure-Element einfügen
                            
                document.getElementById("gallerie").appendChild(f); //Einfügen der Figure Elemente        
                
              
              localStorage.setItem('storage', JSON.stringify(globalData)); //Hier werden die Daten der Spiele zwischengespeichert, damit page.html darauf zugreifen kann.

              }

            }             
})})}

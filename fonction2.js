function frequence(t,s,nb_segment) {
    var max = t[0] + s[0];
    for (var i=1; i<t.lenght; i++){
        if (t[i] + s[i] > max) {
            max = t[i] + s[i];
        }
    }
    var a = 0;
    var b = 0;
    for (var i=1; i<t.lenght; i++){
        a += t[i];
        b -= s[i];
    }
    a = a/max;
    b = nb_segment-b/max;
    var Point = [[0,0],[a,1/max],[b,1/max],[nb_segment,0]];
    var zone_dessin = document.getElementById("schema");
    var graphe= zone_dessin.getContext("2d");
    graphe.strokeStyle = "#0b0e0e";
    graphe.lineWidth=3;
    graphe.beginPath();
    graphe.moveTo(0,0);
    graphe.moveTo(0,zone_dessin.height);
    graphe.beginPath();
    graphe.lineWidth="1";
    graphe.strokeStyle="purple";
    graphe.lineTo(a,1/max);;
    graphe.lineTo(b,1/max);
    graphe.lineTo(nb_segment,0);
    graphe.moveTo(0,0);
    graphe.stroke();					
    graphe.stroke();
    
}

var zone_dessin = document.getElementById("schema2");
var graphe= zone_dessin.getContext("2d");
graphe.beginPath();
graphe.lineWidth="1";
graphe.strokeStyle="black";
graphe.moveTo(0,zone_dessin.height);
graphe.lineTo(zone_dessin.width,zone_dessin.height);;
graphe.moveTo(zone_dessin.width,zone_dessin.height);
graphe.moveTo(0,zone_dessin.height);
graphe.lineTo(0,0);
graphe.moveTo(0,0);
graphe.fillText("fréquence",40,40);
graphe.fillText("nombre de trains",zone_dessin.width-100,zone_dessin.height-40);
graphe.stroke();
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
    return Point;
}



function graph(mat, Vmoy, dist, nro_train, nbr_segment) {
    var d = new Array(nbr_segment + 1);
    var t = new Array(nbr_segment + 1);

    d[0] = 0;
    for (var k=1; k<nbr_segment/2+1; k++) {
        d[2*k-1] = d[2*k-2] + dist[k-1];
        d[2*k] = d[2*k-1];
    }
    
    for (var k=0; k<nbr_segment/2; k++) {
        t[2*k] = mat.get(nro_train,k);
        t[2*k+1] = t[2*k] + dist[k]/Vmoy;
    }
    t[nbr_segment] = t[nbr_segment-1];
    var zone_dessin = document.getElementById("schema");
    var graphe= zone_dessin.getContext("2d");
    var compteur=0;
    graphe.strokeStyle = "#0b0e0e";
    graphe.lineWidth=3;
    for (var k=0; k<nbr_segment; k++) {
        t[k] = t[k]/t[nbr_segment-1]*zone_dessin.width;
        d[k] = d[k]/d[nbr_segment-1]*zone_dessin.height;
    }
    graphe.beginPath();
    graphe.moveTo(0,0);
    while(compteur<nbr_segment-1) {
	    graphe.lineTo(t[compteur+1],300-d[compteur+1]);
	    compteur=compteur+1;
    }
    graphe.moveTo(0,zone_dessin.height);
    while(compteur<nbr_segment-1) {
        graphe.lineTo(t[compteur+1],zone_dessin.height-d[compteur+1]);
        compteur=compteur+1;
    }					
    graphe.stroke();

    graphe.beginPath();
    graphe.lineWidth="1";
    graphe.strokeStyle="black";
    graphe.moveTo(0,zone_dessin.height);
    graphe.lineTo(zone_dessin.width,zone_dessin.height);;
    graphe.moveTo(zone_dessin.width,zone_dessin.height);
    graphe.moveTo(0,zone_dessin.height);
    graphe.lineTo(0,0);
    graphe.moveTo(0,0);
    graphe.stroke();
}
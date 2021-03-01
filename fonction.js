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
}
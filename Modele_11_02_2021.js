// Projet de Simulation du trafic sur le Web
//================================================================
//author: Charles-Auguste
// date: 11/02/2021
// last release : -
//================================================================

// Arguments:
/*
- NB_max_rames =20
- Distance_securite=200
- w=30  -> temps d'attente à chaque station (en s)
- Distances_interstations=[1054,700,940,830,680,410,460,640,430,700,590,450,420,540,350,655,730,860,990,670,890,800,790,840]
- Vitesse_max=20 -> en m/s
- Vitesse_moy=10 
- Num_modele=1     (1->vitesse moyenne, 2 -> vitesse max)
*/


var Distances_interstations=[1054,700,940,830,680,410,460,640,430,700,590,450,420,540,350,655,730,860,990,670,890,800,790,840];
var Distance_securite=200;

function zero (T,taille,valeur){
	for(var i=0; i<taille; i++){
		T[i]=valeur;
	}
}

function modele(Nb_max_rames, Tps_sim, Distance_securite, w, Distances_interstations, Vitesse_max, Vitesse_moy, Num_modele){
	var n=Distances_interstations.length;
	var D_interstations= new Array ();
	for (var k=0; k<2;k++){
		for (var i=0;i<n;i++) {
			var d=Distances_interstations[i];
			D_interstations.push(d);
		}
		D_interstations.push(2*Distance_securite);
	}
	console.log(D_interstations);

	var Nb_quais=D_interstations.length;

	var Nb_blocs= new Array (Nb_quais); // Nb_blocs[i] = nombre de blocs entre la station i et la station i+1
	for (var i=0; i<Nb_quais;i++){
		Nb_blocs[i]=0;
	}

	var Len_block = new Array (); // Longeur de chaques blocs

	var Quais = new Array ();

	// ================= PARTIE 1: SEGMENTATION EN BLOCS =================

	function segmentation(){
		var res=0;
		for (var i=0;i<Nb_quais; i++){
			var Nb_inter=Math.floor(D_interstations[i]/Distance_securite);
			Nb_blocs[i]=Nb_blocs[i]+Nb_inter;
			var l=Math.floor(D_interstations[i]/Nb_blocs[i]);
			Quais.push(i);
			Len_block.push(l);
			for (var k=0;k<Nb_blocs[i]-1;k++){
				Quais.push(-1);
				Len_block.push(l);
			}
			res=res+Nb_blocs[i];
		}
		console.log(Nb_blocs);
		return res;
	}

	var Tot_blocs=0;
	Tot_blocs=segmentation();
	console.log(Tot_blocs);

	// ================= PARTIE 2:  =================

	var Safety_time = new Array (Tot_blocs);
	zero(Safety_time,Tot_blocs,30);

	var dw = new Array (Tot_blocs);
	for (var k=0; k<Tot_blocs;k++){
		dw[k]=0;
		if (Quais[k]!=-1) {dw[k]+=w;}
	}
	console.log(dw);

	// ================= PARTIE 3:  =================

	var Running_times= new Array(Tot_blocs);
	zero(Running_times,Tot_blocs,0);
	console.log(Running_times);

}

modele(20,100,200,30,[1054,700,940,830,680,410,460,640,430,700,590,450,420,540,350,655,730,860,990,670,890,800,790,840],20,10,1);


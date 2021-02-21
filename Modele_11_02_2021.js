// Projet de Simulation du trafic sur le Web
//================================================================
//author: Charles-Auguste
// date: 11/02/2021
// last release : 12/02/2021
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


// OUTIL DE GESTION DES TABLEAUX MULTI-DIMENSIONNELS

class Matrice {
	constructor(nb_ligne,nb_colonne){
		this.tab=new Array (nb_ligne*nb_colonne);
		for (var i=0; i<nb_ligne*nb_colonne;i++){
			this.tab[i]=0;
		}
		this.nb_ligne=nb_ligne;
		this.nb_colonne=nb_colonne;
	}
	set(i,j,valeur){
		this.tab[(i*this.nb_colonne)+j]=valeur;
	}
	get(i,j){
		var valeur=this.tab[(i*this.nb_colonne)+j];
		return valeur;
	}
	show(){
		for(var i=0; i<this.nb_ligne;i++){
			for(var j=0; j<this.nb_colonne;j++){
				process.stdout.write("|"+this.tab[(i*this.nb_colonne)+j]+"|");
			}
			console.log();
		}
	}
	dot(T){
		if (this.nb_colonne!=T.length){
			console.log("Erreur produit matriciel")
			return 0;
		}
		var result=new Array (this.nb_ligne);
		for (var k=0; k<this.nb_ligne;k++){
			var sum=0;
			for (var k2=0; k2<this.nb_colonne;k2++){
				sum=sum+T[k2]*this.tab[(k*this.nb_colonne)+k2];
			}
			result[k]=sum;
		}
		return result;
	}
	get_li(){
		return this.nb_ligne;
	}
	get_co(){
		return this.nb_colonne;
	}
}


function zero (T,taille,valeur){
	for(var i=0; i<taille; i++){
		T[i]=valeur;
	}
}




// PROGRAMME PRINCIPAL

var Distances_interstations=[1054,700,940,830,680,410,460,640,430,700,590,450,420,540,350,655,730,860,990,670,890,800,790,840];
var Distance_securite=200;


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
	//console.log(D_interstations);

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
		//console.log(Nb_blocs);
		return res;
	}

	var Tot_blocs=0;
	Tot_blocs=segmentation();
	//console.log(Tot_blocs);

	// ================= PARTIE 2:  =================

	var Safety_time = new Array (Tot_blocs);
	zero(Safety_time,Tot_blocs,30);

	var dw = new Array (Tot_blocs);
	for (var k=0; k<Tot_blocs;k++){
		dw[k]=0;
		if (Quais[k]!=-1) {dw[k]+=w;}
	}
	//console.log(dw);

	// ================= PARTIE 3: CHOIX DU MODELE  =================

	var Running_times= new Array(Tot_blocs);
	zero(Running_times,Tot_blocs,0);
	if (Num_modele==1){
		// 1er modele simplifié avec la vitesse moyenne (pas accélération)
		for (var i=0; i<Tot_blocs; i++){
			Running_times[i]=Math.floor(Len_block[i]/Vitesse_moy);
		}
	}
	if (Num_modele==2){
		for (var i=0; i<Tot_blocs; i++){
			Running_times[i]=Math.floor(Len_block[i]/Vitesse_max);
		}
		for(var i=0; i<Tot_blocs-1;i++){
			if(Quais[i]!=-1){
				// Latences dues aux accéleration à l'arrivée et au départ de chaques stations
				Running_times[i]*=2;
				Running_times[i+1]*=2;
			}
		}
	}

	// ================= PARTIE 4: PLACEMENT INITIAL DES TRAINS  =================

	//Positions initiales (bip indique si un train est présent sur le bloc j initialement)
	var bip= new Array (Tot_blocs);
	zero(bip,Tot_blocs,0);

	function pos_init(Nb_max_rames_,Tot_blocs_){
		var ip = new Array ();
		var compteur=0;
		function test(pos,l){//regarde si l'élément pos n'est pas présent dans l
			for (var i=0; i<l.length;i++){
				if(Math.abs(pos-l[i])<=1){return false;}
			}
			return true;
		}
		var J=0;
		while(compteur<Nb_max_rames_ && J<200){
			J+=1;
			//console.log(J);
			var pos= Math.floor(Math.random()*(Tot_blocs_-1));
			if(test(pos,ip)){
				ip.push(pos);
				compteur+=1;
				J=0;
				//console.log(compteur);
			}
		}
		ip.sort();
		return ip;
	}

	var IP= pos_init(Nb_max_rames,Tot_blocs);
	for(var k=0; k<IP.length;k++){
		bip[IP[k]]=1;
	}

	// ================= PARTIE 5: AFFICHAGE =================

	var Tps_boucle=0;
	for(var i=0; i<Tot_blocs;i++){
		Tps_boucle+=Running_times[i];
		Tps_boucle+=dw[i];
	}

	// Affichages
	console.log("=============================================================");
	console.log("Nombre de quais:   " +Nb_quais );
	console.log("=============================================================");
	console.log("Distances interstations:   " + Distances_interstations);
	console.log("=============================================================");
	console.table("Nb_blocs:   " + Nb_blocs);
	console.log("=============================================================");
	console.log("Tot_blocs:   " + Tot_blocs);
	console.log("=============================================================");
	console.log("Placement des quais:   " + Quais);
	console.log("=============================================================");
	console.log("Longeur des blocs:   " + Len_block);
	console.log("=============================================================");
	console.log("dw:   " + dw);
	console.log("=============================================================");
	console.log("Running_times:   " + Running_times);
	console.log("=============================================================");
	console.log("Temps Total:   " + Tps_boucle);
	console.log("=============================================================");
	console.log("IP:   " + IP);
	console.log("=============================================================");
	console.log("bip:   " + bip);
	console.log("=============================================================");


	// ================= PARTIE 6: DYNAMIQUE... =================

	var T=Tps_sim;
	
	var Puiss = -10*10*10*10*10;
	var dt=new Matrice(T,Tot_blocs);
	for(var i=0; i<T;i++){
		for(var j=0; j<Tot_blocs;j++){
			dt.set(i,j,Puiss);
		}
	}
	for(var k=0;k<Tot_blocs;k++){
		if(bip[k]==1){dt.set(0,k,0);}
	}
	var Mdep= new Matrice (Tot_blocs,Tot_blocs);
	var Msecu= new Matrice (Tot_blocs,Tot_blocs);
	var Ndep= new Matrice (Tot_blocs,Tot_blocs);
	var Nsecu= new Matrice (Tot_blocs,Tot_blocs);
	var cdep= new Array (Tot_blocs);
	zero(cdep,Tot_blocs,0);
	var csecu= new Array (Tot_blocs);
	zero(csecu,Tot_blocs,0);

	for(var i=0; i<Tot_blocs;i++){
		var j=(((i-1) % Tot_blocs ) + Tot_blocs ) % Tot_blocs;
		if(bip[j]==0){
			Mdep.set(i,j,1);
		}
		else{
			Ndep.set(i,j,1);
		}
		cdep[i]=Running_times[j]+dw[i];

		j=(((i+1) % Tot_blocs ) + Tot_blocs ) % Tot_blocs;
		if(bip[i]==1){
			Msecu.set(i,j,1);
		}
		else{
			Nsecu.set(i,j,1);
		}
		csecu[i]=Safety_time[i];
	}

	var eps=0.00001;

	for(var k=1; k<T;k++){
		var err=1;
		var dk=new Array(Tot_blocs);
		var dk1=new Array(Tot_blocs);
		zero(dk,Tot_blocs,0);
		zero(dk1,Tot_blocs,0);
		var count=0;
		while(err>eps && count<200000){
			for(var k1=0; k1<Tot_blocs;k1++){
				dk[k1]=dt.get(k,k1);
				dk1[k1]=dt.get(k-1,k1);
			}
			var tMdep=Mdep.dot(dk);
			var tNdep=Ndep.dot(dk1);
			var tcdep=cdep;
			var tMsecu=Msecu.dot(dk);
			var tNsecu=Nsecu.dot(dk1);
			var tcsecu=csecu;

			var s=0;

			for(var j=0; j<Tot_blocs;j++){
				var val=tMdep[j]+tNdep[j]+tcdep[j];
				val=Math.max(tMdep[j]+tNdep[j]+tcdep[j],tMsecu[j]+tNsecu[j]+tcsecu[j]);
				dt.set(k,j,val);
				s=s+((val-dk[j])*(val-dk[j]));
			}
			err=Math.sqrt(s);
			count+=1;
		}
	}
	var matrice_horaire=new Matrice(T,Tot_blocs);
	for(var i=0; i<T;i++){
		for (var j=0; j<Tot_blocs;j++){
			matrice_horaire.set(i,j,dt.get(i,j));
		}
	}

	var RESULTAT= new Array();
	RESULTAT.push(Nb_quais);
	RESULTAT.push(Nb_blocs);
	RESULTAT.push(Tot_blocs);
	RESULTAT.push(Tps_boucle);
	RESULTAT.push(matrice_horaire);

	return RESULTAT;
}

var res
result=modele(20,100,200,30,[1054,700,940,830,680,410,460,640,430,700,590,450,420,540,350,655,730,860,990,670,890,800,790,840],20,10,1);
result[4].show();

// Projet de Simulation du trafic sur le Web
//================================================================
//author: Charles-Auguste
// date: 14/02/2021
// last release : -
//================================================================

// Arguments:
function simulation(telecharg){
	
var nb_tr=document.getElementById("nb_train").value;
var tps_arr=document.getElementById("arret").value;
var tps_simula=document.getElementById("tps_simulation").value;
var dist_secur=document.getElementById("distance_securite").value;
var Vmoy=document.getElementById("vitesse_moy").value;
var Vmax=document.getElementById("vitesse_max").value;
var valeur_modele=document.getElementById("mod").value;

/*
var Nb_max_rames=nb_tr;
var Tps_simul=tps_simula;
var Distance_securite=200;
var w=tps_arr;
var Distances_interstations=[1054,700,940,830,680,410,460,640,430,700,590,450,420,540,350,655,730,860,990,670,890,800,790,840];
var Vitesse_max=Vmax;
var Vitesse_moy=Vmoy;
var Num_modele=1;
*/
var Nb_max_rames=parseInt(nb_tr);
var Tps_simul=parseInt(tps_simula);
var Distance_securite=parseInt(dist_secur);
var w=parseInt(tps_arr);
var Distances_interstations=[1054,700,940,830,680,410,460,640,430,700,590,450,420,540,350,655,730,860,990,670,890,800,790,840];
var Vitesse_max=parseInt(Vmax);
var Vitesse_moy=parseInt(Vmoy);
var Num_modele=parseInt(valeur_modele);


 








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
	decal_co(k){
		var colo = new Array (this.nb_ligne)
		 for(var i=0; i<this.nb_ligne; i++){
		 	colo[i]=this.tab[(i*this.nb_colonne)+k];
		 }
		 for(var i=0; i<this.nb_ligne; i++){
		 	var ni=(((i+1)%this.nb_ligne)+this.nb_ligne)%this.nb_ligne;
		 	this.tab[(i*this.nb_colonne)+k]=colo[ni];
		 }
	}
	decal_li(k){
		var lign= new Array (this.nb_colonne);
		for(var j=0; j<this.nb_colonne;j++){
			lign[j]=this.tab[(k*this.nb_colonne)+j];
		}
		for(var j=0;j<this.nb_colonne;j++){
			var nj=(((j+1)%this.nb_colonne)+this.nb_colonne)%this.nb_colonne;
			this.tab[(k*this.nb_colonne)+j]=lign[nj];
		}
	}
}


function zero (T,taille,valeur){
	for(var i=0; i<taille; i++){
		T[i]=valeur;
	}
}













// PROGRAMME PRINCIPAL

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

	var matrice_horaire_train=new Matrice(T,Tot_blocs);
	for(var i=0; i<T;i++){
		for (var j=0; j<Tot_blocs;j++){
			matrice_horaire_train.set(i,j,dt.get(i,j));
		}
	}

	var indice_premier=0;
	for(var l=bip.length-1;l>=0;l--){
		if(bip[l]==1){
			indice_premier=l;
		}
	}
	console.log(indice_premier);
	for(var h=indice_premier+1; h<matrice_horaire_train.get_co();h++){
			matrice_horaire_train.decal_co(h);
		}
	for (var k=indice_premier+1; k<matrice_horaire_train.get_co(); k++){
		if(bip[k]==1){
			for(var h=k+1; h<matrice_horaire_train.get_co();h++){
				matrice_horaire_train.decal_co(h);
			}
		}	
	}

	var liste_lignes=new Array();
	for (var i=0; i<matrice_horaire_train.get_li();i++){
		var valid=true;
		for(var j=0; j<matrice_horaire_train.get_co();j++){
			if(matrice_horaire_train.get(i,j)==-100000){valid=false;}
		}
		if(valid){liste_lignes.push(i);}
	}

	var min_li= Math.min(Nb_max_rames,liste_lignes.length,10);
	var matrice_trains_graph= new Matrice(min_li,Tot_blocs);
	
	for (var ind=0; ind<liste_lignes.length;ind++){
		for(var j=0; j<Tot_blocs;j++){
			matrice_trains_graph.set(ind,j,matrice_horaire_train.get(liste_lignes[ind],j));
		}
	}

	var reference=matrice_trains_graph.get(0,0);

	for(var i=0; i<matrice_trains_graph.get_li();i++){
		for(var j=0; j<matrice_trains_graph.get_co();j++){
			matrice_trains_graph.set(i,j,matrice_trains_graph.get(i,j)-reference);
		}
	}


	var RESULTAT= new Array();
	RESULTAT.push(Nb_quais);
	RESULTAT.push(Nb_blocs);
	RESULTAT.push(Tot_blocs);
	RESULTAT.push(Tps_boucle);
	RESULTAT.push(matrice_horaire);
	RESULTAT.push(Quais);
	RESULTAT.push(matrice_horaire_train);
	RESULTAT.push(liste_lignes);
	RESULTAT.push(matrice_trains_graph);
	RESULTAT.push(Len_block);

	return RESULTAT;
}











//======================= FONCTION DE TELECHARGEMENT =======================

function download(filename, text) {
    		var pom = document.createElement('a');
    		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    		pom.setAttribute('download', filename);

    		if (document.createEvent) {
        		var event = document.createEvent('MouseEvents');
        		event.initEvent('click', true, true);
        		pom.dispatchEvent(event);
    		}
    		else {
        		pom.click();
    		}
		}

//======================= CREATION DU FICHIER SORTIE =======================


function traitement_horaire(matrice_horaire,sta){
	var result="";
	result+="											====================== RESULTATS DE LA SIMULATION HORAIRES ====================== \n \n";
	result+="\n";
	
	var Nb_ligne=matrice_horaire.get_li();
	var Nb_colonne=matrice_horaire.get_co();
	result+="			";
	for(var k=0; k<sta.length;k++){
		var inter=sta[k];
		while (inter.length!=16){
			inter+=" ";
		}
		inter+="|  ";
		result+=inter;
	}
	for(var k=1; k<sta.length+1;k++){
		var inter=sta[sta.length-k];
		while (inter.length!=16){
			inter+=" ";
		}
		inter+="|  ";
		result+=inter;
	}
	result+="	/// \n";
	result+="			";
	for(var k=0; k<Nb_colonne;k++){
		var inter="_";
		while (inter.length!=16){
			inter+="_";
		}
		inter+="|__";
		result+=inter;
	}
	result+="	/// \n";
	for (var i=0; i<Nb_ligne;i++){
		result+="			";
		for (var j=0; j<Nb_colonne; j++){
			if(matrice_horaire.get(i,j)==-100000){
				var inter="-No train-";
				while (inter.length!=16){
					inter+=" ";
				}
				inter+="|  ";
				result+=inter;
			}
			else{
				var intermed_heure=Math.floor((matrice_horaire.get(i,j))/3600);
				var intermed_min=Math.floor((matrice_horaire.get(i,j)%3600)/60);
				var intermed_sec=(matrice_horaire.get(i,j)%3600)%60;
				var inter=intermed_heure+"h "+intermed_min+"min "+intermed_sec+"sec";
				while (inter.length!=16){
					inter+=" ";
				}
				inter+="|  ";
				result+=inter;
			}	
		}
		result+="	/// \n";
	} 
	
	result+="\n \n \n \n";
	result+="														Ecole des Ponts Paristech				2020/2021		GcA \n";
	return result;
}


function traitement (Nb_max_rames,Tps_simul,Distance_securite, w,Distances_interstations, Vitesse_max, Vitesse_moy, Num_modele,Nb_quais,Nb_blocs,Tot_blocs,Tps_boucle,matrice_horaire,listepleine){
	var result="";
	result+="====================== RESULTATS DE LA SIMULATION ====================== \n \n";
	
	result+="Données: \n";
	result+="	- Nombre maximal de rames: "+Nb_max_rames+"\n";
	result+="	- Temps de simulation: "+Tps_simul+"\n";
	result+="	- Distance de sécurité: "+Distance_securite+"\n";
	result+="	- w: "+w+"\n";
	result+="	- Liste des distances interstations: \n"+"		["
	for(var i=0; i<Distances_interstations.length-1;i++){
		result+=Distances_interstations[i]+";";
	}
	result+=Distances_interstations[Distances_interstations.length-1];
	result+="] \n";
	result+="	- Vitesse moyenne: "+Vitesse_moy+"\n";
	result+="	- Vitesse maximale: "+Vitesse_max+"\n";
	result+="	- Numéro modèle: "+Num_modele+"\n \n";

	result+="Résultats: \n";
	result+="	- Nombre de quais: " +Nb_quais +"\n";
	result+="	- Nombre de blocs: " +Tot_blocs +"\n";

	
	result+="	- Liste du nombre de blocs entre chaques stations: \n " + "		[";
	for(var i=0; i<Nb_blocs.length-1;i++){
		result+=Nb_blocs[i]+";";
	}
	result+=Nb_blocs[Nb_blocs.length-1];
	result+="] \n";
	
	result+="	- Temps total: " +Tps_boucle +"\n";
	result+="	-Lignes pleines (expérimental): \n" + "		[";
	for(var i=0; i<listepleine.length-1;i++){
		result+=listepleine[i]+";";
	}
	result+=listepleine[listepleine.length-1];
	result+="] \n";

	result+="	- Matrice horaire: \n";


	
	var Nb_ligne=matrice_horaire.get_li();
	var Nb_colonne=matrice_horaire.get_co();
	for (var i=0; i<Nb_ligne;i++){
		result+="			";
		for (var j=0; j<Nb_colonne; j++){
			result+=matrice_horaire.get(i,j)+";";
		}
		result+="	/// \n";
	} 
	
	result+="\n \n \n \n";
	result+="			Ecole des Ponts Paristech				2020/2021		GcA \n";
	return result;
}

function matrice_simple(matriceH,quais, nb_quais){
	var matriceS= new Matrice (matriceH.get_li(),nb_quais);
	for (var i=0; i<matriceH.get_li(); i++){
		var inter_li = new Array();
		for(var j=0; j<matriceH.get_co(); j++){
			if(quais[j]!=-1){
				inter_li.push(matriceH.get(i,j));
			}
		}
		for (var k=0; k<inter_li.length; k++){
			matriceS.set(i,k,inter_li[k]);
		}
	}
	return matriceS;
}














//======================= RECUPERATION DES DONNEES =======================
var  
stations=["La défense","Esplanade","Pont de Neuilly","Les Sablons","Porte Maillot","Argentine","Etoile","George V","Franklin D.R","Champs Elysées","Concorde","Tuileries","Palais Royal","Louvre rivoli","Châtelet","Hôtel de Ville","Saint Paul","Bastille","Gare de Lyon","Reuilly Diderot","Nation","Porte de V","Saint Mandé","Berault","Chateau de V"];	

var Result=modele(Nb_max_rames,Tps_simul,Distance_securite,w,Distances_interstations,Vitesse_max,Vitesse_moy,Num_modele);

var nb_quais=Result[0];
console.log(nb_quais);
var nb_blocks=Result[1];
console.log(nb_blocks);
var tot_block=Result[2];
console.log(tot_block);
var tps_boucle=Result[3];
console.log(tps_boucle);
var matrice_h=Result[4];
console.log(matrice_h);
var train_h=Result[6]
var Q=Result[5];
var liste_lignes_pleines =Result[7];
var Matrice_trains_temporel=Result[8];
var result2;
result2=matrice_simple(matrice_h,Q,nb_quais);
var result3;
result3=matrice_simple(train_h,Q,nb_quais);
var L_block=Result[9];

if(telecharg==true){
	download('Resultats_stations',traitement(Nb_max_rames,Tps_simul,Distance_securite,w,Distances_interstations,Vitesse_max,Vitesse_moy,Num_modele,nb_quais,nb_blocks,tot_block,tps_boucle,matrice_h,liste_lignes_pleines));
	download('Resultats_trains',traitement(Nb_max_rames,Tps_simul,Distance_securite,w,Distances_interstations,Vitesse_max,Vitesse_moy,Num_modele,nb_quais,nb_blocks,tot_block,tps_boucle,train_h,liste_lignes_pleines));
	download('Resultats_trains_temporel',traitement(Nb_max_rames,Tps_simul,Distance_securite,w,Distances_interstations,Vitesse_max,Vitesse_moy,Num_modele,nb_quais,nb_blocks,tot_block,tps_boucle,Matrice_trains_temporel,liste_lignes_pleines));
	download('horaires_simples',traitement_horaire(result2,stations));
	download('train_simples',traitement_horaire(result3,stations));
}

// =================================== Fonctions graphiques de base ===================================
function crea_point(x,y){
	var p=new Array();
	p.push(x);
	p.push(y);
	return p;
}


function recalibrage_coord(p,x0,y0){
	p[0]+=x0;
	p[1]=y0-p[1];
}

function recalibrage_inverse(p,x0,y0){
	p[0]-=x0;
	p[1]=y0-p[1];
}

function segment(graphex,p1,p2,p0,color="black",taille="1"){
	recalibrage_coord(p1,p0[0],p0[1]);
	recalibrage_coord(p2,p0[0],p0[1]);
	graphex.beginPath();
	graphex.lineWidth=taille;
	graphex.strokeStyle=color;
	graphex.moveTo(p1[0],p1[1]);
	graphex.lineTo(p2[0],p2[1]);
	graphex.stroke();
	recalibrage_inverse(p1,p0[0],p0[1]);
	recalibrage_inverse(p2,p0[0],p0[1]);
}

function dessine_axes(graphex,p0,hauteur,longeur,nom_axe_ab,nom_axe_or){
	graphex.beginPath();
	graphex.lineWidth="1";
	graphex.strokeStyle="black";
	graphex.fillStyle="black";
	graphex.moveTo(p0[0],p0[1]);
	graphex.lineTo(p0[0]+longeur,p0[1]);
	graphex.moveTo(p0[0]+longeur,p0[1]);
	graphex.lineTo(p0[0]+longeur-15,p0[1]-10);
	graphex.moveTo(p0[0]+longeur,p0[1]);
	graphex.lineTo(p0[0]+longeur-15,p0[1]+10);
	graphex.moveTo(p0[0],p0[1]);
	graphex.lineTo(p0[0],p0[1]-hauteur);
	graphex.moveTo(p0[0],p0[1]-hauteur);
	graphex.lineTo(p0[0]+10,p0[1]-hauteur+15);
	graphex.moveTo(p0[0],p0[1]-hauteur);
	graphex.lineTo(p0[0]-10,p0[1]-hauteur+15);
	graphex.fillText(nom_axe_or,45,45);
	graphex.fillText(nom_axe_ab,zone_dessin.width-45,zone_dessin.height-45);
	graphex.stroke();
}

function erase(graphex,longeur,hauteur){
	graphex.beginPath();
	graphex.fillStyle="white";
	graphex.fillRect(0,0,longeur,hauteur);
}

// ======================================================================================================

function dessin_ligne(graphex,i,mat,L,p0,color,hauteur,largeur,param){
	var distance=0;
	
	var nbr_segment=148;
	var d = new Array(nbr_segment + 1);
    var t = new Array(nbr_segment + 1);

    d[0] = 0;
    for (var k=1; k<nbr_segment/2+1; k++) {
        d[2*k-1] = d[2*k-2] + L[k-1];
        d[2*k] = d[2*k-1];
    }
    
    for (var k=0; k<nbr_segment/2; k++) {
        t[2*k] = mat.get(i,k);
        t[2*k+1] = t[2*k] + L[k]/Vitesse_moy;
    }
    t[nbr_segment] = t[nbr_segment-1];
    
    for (var k=0; k<nbr_segment+1; k++) {
        d[k] = d[k]/d[nbr_segment]*hauteur;
        if (param==0){
        	t[k]=t[k]/t[nbr_segment]*largeur;
        	param=t[nbr_segment];
        }
        else t[k]=t[k]/param*largeur;
    }

    var p1=crea_point(t[0],d[0]);
	var p2=crea_point(0,0);
	for(var j=0;j<t.length;j++){
		p2=crea_point(Math.floor(t[j]),Math.floor(d[j]));
		segment(graphex,p1,p2,p0,color,"2");
		p1=p2;
		distance+=L[j];
	}
	return param;
}



var couleur=["pink","cyan","red","green","blue","yellow","black","orange","purple","brown"];
var zone_dessin = document.getElementById("schema");
var graphe= zone_dessin.getContext("2d");
var p0=crea_point(30,zone_dessin.height-30);
erase(graphe,zone_dessin.width,zone_dessin.height);
dessine_axes(graphe,p0,zone_dessin.height-60,zone_dessin.width-60,"temps","distance");
var param=0;
for(var i=0; i<Matrice_trains_temporel.get_li(); i++){
	param=dessin_ligne(graphe,i,Matrice_trains_temporel,L_block,p0,couleur[i],zone_dessin.height-60,zone_dessin.width-60,param);
}
}


// Projet de Simulation du trafic sur le Web
//================================================================
//author: Charles-Auguste
// date: 14/02/2021
// last release : -
//================================================================

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

function traitement (Nb_max_rames,Tps_simul,Distance_securite, w,Distances_interstations, Vitesse_max, Vitesse_moy, Num_modele,Nb_quais,Nb_blocs,Tot_blocs,Tps_boucle,matrice_horaire){
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

//======================= RECUPERATION DES DONNEES =======================

var Result=modele(20,100,200,30,[1054,700,940,830,680,410,460,640,430,700,590,450,420,540,350,655,730,860,990,670,890,800,790,840],20,10,1);

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

download('Resultats',traitement(20,100,200,30,[1054,700,940,830,680,410,460,640,430,700,590,450,420,540,350,655,730,860,990,670,890,800,790,840],20,10,1,nb_quais,nb_blocks,tot_block,tps_boucle,matrice_h));


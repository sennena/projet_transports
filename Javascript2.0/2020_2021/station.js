// Projet de Simulation du trafic sur le Web
//================================================================
//author: Charles-Auguste
// date: 12/02/2021
// last release : 12/02/2021
//================================================================

var  
stations=["La défense","Esplanade","Pont de Neuilly","Les Sablons","Porte Maillot","Argentine","Etoile","George V","Franklin D. Roosvelt","Champs Elysées Clem","Concorde","Tuileries","Palais Royal","Louvre rivoli","Châtelet","Hôtel de Ville","Saint Paul","Bastille","Gare de Lyon","Reuilly Diderot","Nation","Porte de Vincennes","Saint Mandé","Berault","Chateau de Vincennes"];	


class Station{
	constructor(nom,vecteur){
		this.name=nom;
		this.time=vecteur;
	}
	affichage(){
		var aff="";
		aff=aff+this.name+" :";
		for(var i=0; i<this.time.length;i++){
			aff=aff+"	"+this.time[i];
		}
		console.log(aff);
		return aff;
	}
}

function matrice_simple(matriceH,quais, nb_quais){
	var matriceS= new Matrice (matriceH.get_li(),nb_quais);
	for (var i=0; i<matriceH.get_li(), i++){
		for(var j=0; j<matriceH.get_co(), j++){
			var inter_li = new Array();
			if(quais[j]!=-1){
				inter_li.push(matriceH.get(i,j));
			}
		}
		for (var k=0; k<inter_li.length; k++){
			matriceS.set(i,k,inter_li[k]);
		}
	}
	matriceS.show();
	return matriceS;
}

function crea_stations(matriceS,noms){
	var liste_station_h= new Array ();
	for (var j=0; j<matriceS.get_co;j++){
		st= new Array ();
		for (var i=0; i<matriceS.get_li;i++){
			st.push(matriceS.get(i,j));
		}
		var stat= new Station (noms[j],st);
		stat.affichage();
		liste_station_h.push(stat);	
	}
	return liste_station_h;
}


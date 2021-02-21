// Projet de Simulation du trafic sur le Web
//================================================================
//author: Charles-Auguste
// date: 12/02/2021
// last release : 12/02/2021
//================================================================


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



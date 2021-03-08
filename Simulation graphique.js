var Troncons = [200, 210, 210, 210, 210, 210, 233, 233, 233, 235, 235, 235, 235, 207, 207, 207, 207, 226, 226, 226, 205, 205, 230, 230, 213, 213, 213, 215, 215, 233, 233, 233, 295, 295, 225, 225, 210, 210, 270, 270, 350, 218, 218, 218, 243, 243, 243, 215, 215, 215, 215, 247, 247, 247, 247, 223, 223, 223, 222, 222, 222, 222, 200, 200, 200, 200, 263, 263, 263, 210, 210, 210, 210, 200, 200, 210, 210, 210, 210, 263, 263, 263, 200, 200, 200, 200, 222, 222, 222, 222, 223, 223, 223, 247, 247, 247, 247, 215, 215, 215, 215, 243, 243, 243, 218, 218, 218, 350, 270, 270, 210, 210, 225, 225, 295, 295, 233, 233, 233, 215, 215, 213, 213, 213, 230, 230, 205, 205, 226, 226, 226, 207, 207, 207, 207, 235, 235, 235, 235, 233, 233, 233, 210, 210, 210, 210, 210, 200];
var Station = [-1, 0, -1, -1, -1, -1, 1, -1, -1, 2, -1, -1, -1, 3, -1, -1, -1, 4, -1, -1, 5, -1, 6, -1, 7, -1, -1, 8, -1, 9, -1, -1, 10, -1, 11, -1, 12, -1, 13, -1, 14, 15, -1, -1, 16, -1, -1, 17, -1, -1, -1, 18, -1, -1, -1, 19, -1, -1, 20, -1, -1, -1, 21, -1, -1, -1, 22, -1, -1, 23, -1, -1, -1, 24];
var Nom_stations = ["La_Defense", "Esplanade_de_la_Defense", "Pont_de_Neuilly", "Les_Sablons", "Porte_Maillot", "Argentine", "Charles_de_Gaulle-Etoile", "George_V", "FDRoosevelt", "Champs-Elysees_Clémenceau", "Concorde", "Tuileries", "Palais_Royal-Musee_du_Louvre", "Louvre_Rivoli", "Chatelet", "Hotel_de_Ville", "Saint_Paul", "Bastille", "Gare_de_Lyon", "Reuilly-Diderot", "Nation", "Porte_de_Vincennes", "Saint_Mande-Tourelle", "Berault", "Chateau_de_Vincennes"];


// Dessin de la ligne
function dessine_Ligne_1() {
    var l;
    var c;
    l = 0;
    for (i=0; i<74; i++) {
        c = Troncons[i];
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(l, 40, c/10, 10);
        ctx.fillRect(l, 65, c/10, 10);

        if (Station[i] != -1) {
            ctx.beginPath();
            ctx.arc(l, 45, 10, 0, 2*Math.PI);
            ctx.fillStyle = '#FFFF00';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(l, 70, 10, 0, 2*Math.PI);
            ctx.fillStyle = '#FFFF00';
            ctx.fill();
        }

        l+= c/10;
    }
}


class train {
    constructor(num_train, horaire_suivant_0, temps_arrivee, temps_depart) {
        this.position = 200;
        this.troncon = 1;
        this.vivant = false;
        this.marche = false;
        this.aller = true;
        this.vitesse = 0;
        this.horaire_suivant = horaire_suivant_0;
        this.tps_de_depart = [];
        this.temps_d_arrivee = [];
        // A modifier
        for (i=0; i<148; i++) {
            this.tps_de_depart.push(temps_depart[i]);
            this.temps_d_arrivee.push(temps_arrivee[i]);
        }
        this.numero_train = num_train;
    }

    dessine_aller() {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.position/10 - 10, 40, 20, 10);
    }

    dessine_retour() {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect((33120-this.position)/10 - 10, 65, 20, 10);
    }

    efface_aller() {
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(this.position/10 - 10, 40, 20, 10);
    }

    efface_retour() {
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect((33120-this.position)/10 - 10, 65, 20, 10);
    }

    avance(temps) {
        var dt = 1;
        if(aller)
            this.efface_aller;
        else this.efface_retour;

        // Départ après un arrêt
        if(temps == this.horaire_suivant && !this.marche) {
            this.marche = true;
            this.vitesse = Troncons[this.troncon] / (this.tps_d_arrivee[this.troncon] - this.tps_de_depart[this.troncon]);
            this.horaire_suivant = this.tps_d_arrivee[this.troncon];
        }

        // Fin de tronçon
        if(temps == this.horaire_suivant && this.marche) {
            this.troncon+= 1;

            // Pour éviter les erreurs d'arrondis sur l'affichage graphique
            var pos = 0;
            for(i=0; i<this.troncon+1; i++)
                pos+= Troncons[i]/10;
            this.position = pos*10;

            var temps_d_arret = this.tps_d_arrivee[this.troncon-1] - this.tps_de_depart[this.troncon];

            // Pas d'arrêt
            if(temps_d_arret == 0) {
                this.vitesse = Troncons[this.troncon] / (this.tps_d_arrivee[this.troncon] - this.tps_de_depart[this.troncon]);
                this.horaire_suivant = this.tps_d_arrivee[this.troncon];
            }
            // Arrêt
            else {
                this.marche = false;
                this.horaire_suivant = this.tps_de_depart[this.troncon];
            }
        }

        // Si le train est en mouvement, il avance
        if(this.marche) {
            this.position+= this.vitesse*dt;
        }

        // Passage de l'aller au retour
        if(this.aller && this.position >= 16560) {
            this.aller = false;
        }

        // Fin du trajet
        if(!this.aller && this.position >= 33120) {
            this.marche = false;
            this.vivant = false;
            this.efface_retour();
        }

        if(this.aller)
            this.dessine_aller();
        else this.dessine_retour();
        milliSleep(5);
        }
}
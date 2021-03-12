// Projet de Simulation du trafic sur le Web
//================================================================
//author: -
// date: 14/02/2021
// last release : -
//================================================================

//Rq: La fonction simulation gère toute la modélisation (entrée, traitement, sortie, affichage). Elle est divisée en sous blocs 
// dont les fonctions sont décrites ci-après.

function simulation(telecharg){

    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    
    // Entrées provenants du formulaire HTML.
        
    var nb_tr=document.getElementById("nb_train").value;
    var tps_arr=document.getElementById("arret").value;
    var tps_simula=document.getElementById("tps_simulation").value;
    var dist_secur=document.getElementById("distance_securite").value;
    var Vmoy=document.getElementById("vitesse_moy").value;
    var Vmax=document.getElementById("vitesse_max").value;
    var valeur_modele=document.getElementById("mod").value;
    
    
    // En cas de dysfonctionnement du formulaire, tester avec les valeurs qui suivent
    
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
    
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
     
    // OUTIL DE GESTION DES TABLEAUX MULTI-DIMENSIONNELS
    
    class Matrice {
        // Constructeur d'une matrice (d'entiers) de taille donnée remplie de 0.
        constructor(nb_ligne,nb_colonne){
            this.tab=new Array (nb_ligne*nb_colonne);
            for (var i=0; i<nb_ligne*nb_colonne;i++){
                this.tab[i]=0;
            }
            this.nb_ligne=nb_ligne;
            this.nb_colonne=nb_colonne;
        }
        //Permet de définir la valeur du terme situé sur la ième ligne et la jème colonne 
        set(i,j,valeur){
            this.tab[(i*this.nb_colonne)+j]=valeur;
        }
        //permet de récuperer la valeur du terme situé sur la ième ligne et la jème colonne 
        get(i,j){
            var valeur=this.tab[(i*this.nb_colonne)+j];
            return valeur;
        }
        //Affiche la matrice
        show(){
            for(var i=0; i<this.nb_ligne;i++){
                for(var j=0; j<this.nb_colonne;j++){
                    process.stdout.write("|"+this.tab[(i*this.nb_colonne)+j]+"|");
                }
                console.log();
            }
        }
        // Effectue le produit scalaire entre la matrice et un vecteur
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
        // Donne le nombre de lignes de la matrice
        get_li(){
            return this.nb_ligne;
        }
        // Donne le nombre de colonne de la matrice
        get_co(){
            return this.nb_colonne;
        }
        // Décale tout les coefficients d'une colonne vers le haut
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
        // Décale tout les coefficients d'une ligne vers la gauche
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
    
    // Initialise un vecteur T en mettant tout ses éléments à "valeur"
    function zero (T,taille,valeur){
        for(var i=0; i<taille; i++){
            T[i]=valeur;
        }
    }
    
    
    
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    
    
    // PROGRAMME PRINCIPAL
    
    //Rq: La fonction modèle constitue le coeur de la simulation, elle effectue tous les calculs et nous renvoie une liste de variables
    // décrites ci-après.
    
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
            return res;
        }
    
        var Tot_blocs=0;
        Tot_blocs=segmentation();
    
        // ================= PARTIE 2:  =================
    
        var Safety_time = new Array (Tot_blocs);
        zero(Safety_time,Tot_blocs,30);
    
        var dw = new Array (Tot_blocs);
        for (var k=0; k<Tot_blocs;k++){
            dw[k]=0;
            if (Quais[k]!=-1) {dw[k]+=w;}
        }
    
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
                var pos= Math.floor(Math.random()*(Tot_blocs_-1));
                if(test(pos,ip)){
                    ip.push(pos);
                    compteur+=1;
                    J=0;
                }
            }
            ip.sort();
            return ip;
        }
    
        var IP= pos_init(Nb_max_rames,Tot_blocs);
        for(var k=0; k<IP.length;k++){
            bip[IP[k]]=1;
        }
    
        // ================= PARTIE 5: AFFICHAGE INTERMEDIAIRE =================
    
        //Rq: Utile en cas de bug
    
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
    
        // ================= PARTIE 7: RESULTATS =================
    
        var RESULTAT= new Array();
        RESULTAT.push(Nb_quais); //Nombre de quais dans la simulation (2 fois le nombre de stations)
        RESULTAT.push(Nb_blocs); //Nombre de blocs entre chaques stations
        RESULTAT.push(Tot_blocs); //Nombre total de blocs
        RESULTAT.push(Tps_boucle); //Durée de la simulation
        RESULTAT.push(matrice_horaire); //Matrice des kème départs au ième bloc
        RESULTAT.push(Quais); //Répartion des quais dans les "Tot_blocs" blocs
        RESULTAT.push(matrice_horaire_train); //Matrice horaire modifiée ce qui permet de suivre chaques trains
        RESULTAT.push(liste_lignes); //Liste des lignes à récuperer pour avoir des trains "complets"
        RESULTAT.push(matrice_trains_graph); //Version spéciale de "matrice_horaire_train" adaptée pour les graohiques
        RESULTAT.push(Len_block); //Longeur de chaque blocs 
        RESULTAT.push(tcdep);
        RESULTAT.push(tcsecu);
    
        return RESULTAT;
    }
    
    
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    
    
    // FONCTION DE TELECHARGEMENT 
    
    //Rq: Fonction tirée d'internet permettant de créer un fichier .txt à télécharger
    
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
    
    // CREATION DES FICHIERS DE SORTIE 
    
    // Cette fonction permet de convertir une matrice de résultat en convention hh-mm-ss et fabrique une chaine de caractère possédant
    //toutes ces informations 
    
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
        result+="														Ecole des Ponts Paristech				2020/2021		 \n";
        return result;
    }
    
    // Autre fonction de traitement sans la conversion horaire
    
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
        result+="			Ecole des Ponts Paristech				2020/2021		 \n";
        return result;
    }
    
    // Création d'une nouvelle matrice à partir d'une matrice horaire ne conservant que les stations
    
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
    
    
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    
    
    // RECUPERATION DES DONNEES 
    
    var  
    stations=["La défense","Esplanade","Pont de Neuilly","Les Sablons","Porte Maillot","Argentine","Etoile","George V","Franklin D.R","Champs Elysées","Concorde","Tuileries","Palais Royal","Louvre rivoli","Châtelet","Hôtel de Ville","Saint Paul","Bastille","Gare de Lyon","Reuilly Diderot","Nation","Porte de V","Saint Mandé","Berault","Chateau de V"];	
    
    var Result=modele(Nb_max_rames,Tps_simul,Distance_securite,w,Distances_interstations,Vitesse_max,Vitesse_moy,Num_modele);
    
    var nb_quais=Result[0];
    
    var nb_blocks=Result[1];
    
    var tot_block=Result[2];
    
    var tps_boucle=Result[3];
    
    var matrice_h=Result[4];
    
    var train_h=Result[6]
    
    var Q=Result[5];
    
    var liste_lignes_pleines =Result[7];
    
    var Matrice_trains_temporel=Result[8];
    
    var result2;
    result2=matrice_simple(matrice_h,Q,nb_quais);
    
    var result3;
    result3=matrice_simple(train_h,Q,nb_quais);
    
    var L_block=Result[9];

    var cde=Result[10];
    
    var csec=Result[11];
    
    if(telecharg==true){
        download('Resultats_stations',traitement(Nb_max_rames,Tps_simul,Distance_securite,w,Distances_interstations,Vitesse_max,Vitesse_moy,Num_modele,nb_quais,nb_blocks,tot_block,tps_boucle,matrice_h,liste_lignes_pleines));
        download('Resultats_trains',traitement(Nb_max_rames,Tps_simul,Distance_securite,w,Distances_interstations,Vitesse_max,Vitesse_moy,Num_modele,nb_quais,nb_blocks,tot_block,tps_boucle,train_h,liste_lignes_pleines));
        download('Resultats_trains_temporel',traitement(Nb_max_rames,Tps_simul,Distance_securite,w,Distances_interstations,Vitesse_max,Vitesse_moy,Num_modele,nb_quais,nb_blocks,tot_block,tps_boucle,Matrice_trains_temporel,liste_lignes_pleines));
        download('horaires_simples',traitement_horaire(result2,stations));
        download('train_simples',traitement_horaire(result3,stations));
    }
    
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    
    // FONCTIONS GRAPHIQUES DE BASE
    
    
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
        graphex.font = "bold 15px Arial";
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
        graphex.fillText(nom_axe_or,p0[0]+15,p0[1]-hauteur+15);
        graphex.fillText(nom_axe_ab,p0[0]+longeur-nom_axe_ab.length-30,p0[1]+20);
        graphex.stroke();
    }
    
    function erase(graphex,longeur,hauteur,x=0,y=0){
        graphex.beginPath();
        graphex.fillStyle="white";
        graphex.fillRect(x,y,longeur,hauteur);
    }
    function fill_legende(graphex,p0,num,max,taille){
        var i=0;
        var i2=i;
        var fact=1;
        while(9*fact<0.8*max){
            fact*=10;
        }
        if (num==0){
            while(i<max){
                if (i!=0){
                    var p1=crea_point(-5,taille/max*i);
                    var p2=crea_point(5,taille/max*i);
                    segment(graphex,p1,p2,p0,"black","2");
                    i2=i.toString();
                    graphex.fillText(i2,Math.floor(i/1000)+10+p0[0],-p1[1]+p0[1]);
                    i=i+fact;
                }
                else i=fact;
            }
        }
        if(num==1){
            while(i<0.8*max){
                var p1=crea_point(taille/max*i,-5);
                var p2=crea_point(taille/max*i,5);
                segment(graphex,p1,p2,p0,"black","2");
                i2=i.toString();
                graphex.fillText(i2,p1[0]+p0[0]-10,p1[1]+p0[1]+25);
                if (i!=0){
                    i=i+fact;
                }
                else i=fact;
            }
        }
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
        if (param==0){
        fill_legende(graphex,p0,0,d[nbr_segment],hauteur);
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
            fill_legende(graphex,p0,1,param,largeur);
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

    function dessin_frequence(graphex,t,s,n,p0,hauteur,largeur){
    
        var max = t[0] + s[0];
    
        for (var i=1; i<t.length; i++){
            if (t[i] + s[i] > max) {
                max = t[i] + s[i];
            }
        }
    
        var a = 0;
        var b = 0;
        for (var i=1; i<t.length; i++){
            a += t[i];
        }
        for (var i=1; i<s.length; i++){
            b -= s[i];
        }
    
        a = Math.floor(a/max);
        b = Math.floor(n+b/max);
    
        /*var p1=crea_point(0,0);
        var p2=crea_point(largeur/5,hauteur/2);
        var p3=crea_point(4*largeur/5,hauteur/2);
        var p4=crea_point(largeur,0);*/
    
        var p1=crea_point(0,0);
        var p2=crea_point(a*largeur/n,hauteur/2);
        var p3=crea_point(b*largeur/n,hauteur/2);
        var p4=crea_point(largeur,0);
    
        graphex.fillText(max.toString(),40,hauteur/2+30);
        graphex.fillText("-",28,hauteur/2+30);
        graphex.fillText(n.toString(),largeur+17,hauteur+25);
        graphex.fillText("|",largeur+25,hauteur+38);
        graphex.fillText(a.toString(),a*largeur/n+20,hauteur+25);
        graphex.fillText("|",a*largeur/n+28,hauteur+38);
        graphex.fillText(b.toString(),b*largeur/n+20,hauteur+25);
        graphex.fillText("|",b*largeur/n+28,hauteur+38);
    
        segment(graphex,p1,p2,p0,"red","2");
        segment(graphex,p2,p3,p0,"red","2");
        segment(graphex,p3,p4,p0,"red","2");
    }
    
    function graph_temporel(graphex,mat,L,p0,col,hauteur_canvas,longeur_canvas){
        var param=0;
        for(var i=0; i<mat.get_li(); i++){
            param=dessin_ligne(graphex,i,mat,L,p0,col[i],hauteur_canvas-60,longeur_canvas-60,param);
        }
        erase(graphex,40,hauteur_canvas-60,longeur_canvas-40);
    }
    
    
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    
    
    // ANIMATION GRAPHIQUE

    function animation_graphique(Matrice,ctx) {
        var Troncons = [200, 210, 210, 210, 210, 210, 233, 233, 233, 235, 235, 235, 235, 207, 207, 207, 207, 226, 226, 226, 205, 205, 230, 230, 213, 213, 213, 215, 215, 233, 233, 233, 295, 295, 225, 225, 210, 210, 270, 270, 350, 218, 218, 218, 243, 243, 243, 215, 215, 215, 215, 247, 247, 247, 247, 223, 223, 223, 222, 222, 222, 222, 200, 200, 200, 200, 263, 263, 263, 210, 210, 210, 210, 200, 200, 210, 210, 210, 210, 263, 263, 263, 200, 200, 200, 200, 222, 222, 222, 222, 223, 223, 223, 247, 247, 247, 247, 215, 215, 215, 215, 243, 243, 243, 218, 218, 218, 350, 270, 270, 210, 210, 225, 225, 295, 295, 233, 233, 233, 215, 215, 213, 213, 213, 230, 230, 205, 205, 226, 226, 226, 207, 207, 207, 207, 235, 235, 235, 235, 233, 233, 233, 210, 210, 210, 210, 210, 200];
        var Station = [-1, 0, -1, -1, -1, -1, 1, -1, -1, 2, -1, -1, -1, 3, -1, -1, -1, 4, -1, -1, 5, -1, 6, -1, 7, -1, -1, 8, -1, 9, -1, -1, 10, -1, 11, -1, 12, -1, 13, -1, 14, 15, -1, -1, 16, -1, -1, 17, -1, -1, -1, 18, -1, -1, -1, 19, -1, -1, 20, -1, -1, -1, 21, -1, -1, -1, 22, -1, -1, 23, -1, -1, -1, 24];
        var Nom_stations = ["La_Defense", "Esplanade_de_la_Defense", "Pont_de_Neuilly", "Les_Sablons", "Porte_Maillot", "Argentine", "Charles_de_Gaulle-Etoile", "George_V", "FDRoosevelt", "Champs-Elysees_Clémenceau", "Concorde", "Tuileries", "Palais_Royal-Musee_du_Louvre", "Louvre_Rivoli", "Chatelet", "Hotel_de_Ville", "Saint_Paul", "Bastille", "Gare_de_Lyon", "Reuilly-Diderot", "Nation", "Porte_de_Vincennes", "Saint_Mande-Tourelle", "Berault", "Chateau_de_Vincennes"];
    
        class train {
            constructor(num_train, Matrice, Vmoy) {
                this.position = 200;
                this.troncon = 1;
                this.vivant = false;
                this.marche = false;
                this.aller = true;
                this.vitesse = Vmoy;
                this.horaire_suivant = Matrice.get(num_train, 0);
                this.tps_de_depart = [];
                this.tps_de_depart.push(Matrice.get(num_train, 147));
                for (var i=1; i<148; i++) {
                    this.tps_de_depart.push(Matrice.get(num_train, i-1));
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
                if(this.aller) {
                    this.efface_aller();
                }
                else {
                    this.efface_retour();
                }
    
                // Départ après un arrêt
                if(temps == this.horaire_suivant && !this.marche) {
                    this.marche = true;
                    this.horaire_suivant = this.horaire_suivant + Troncons[this.troncon] / Vmoy;
                }
    
                // Fin de tronçon
                if(temps == this.horaire_suivant && this.marche) {
                    this.troncon+= 1;
    
                    // Pour éviter les erreurs d'arrondis sur l'affichage graphique
                    var pos = 0;
                    for(var i=0; i<this.troncon+1; i++)
                        pos+= Troncons[i]/10;
                    this.position = pos*10;
    
                    var temps_d_arret = this.tps_de_depart[this.troncon] - temps;
    
                    // Pas d'arrêt
                    if(temps_d_arret == 0) {
                        this.horaire_suivant = this.tps_de_depart[this.troncon] + Troncons[this.troncon] / Vmoy;
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
                }
        }
    
        // Création de tous les trains
        var Nombre_de_train = Matrice.get_li();
        var Tableau_train = new Array();
        for(var i=0; i<Nombre_de_train; i++) {
            var t = new train(i, Matrice, Vitesse_moy);
            Tableau_train.push(t);
        }
    
        // Boucle principale : beaucoup de bazar qui fonctionne plus ou moins
        var temps = new Array();
        temps.push(0);
        function boucle(t) {
            for(var i=0; i<Nombre_de_train; i++) {
                Tableau_train[i].avance(t[0]);
            }
            t[0] += 1;
            ctx.fillText(t[0],10*t[0],100);
        }

        function boucle2(t) {
            for(var i=0; i<Nombre_de_train; i++) {
                Tableau_train[i].avance(t);
                ctx.fillText(i,10*i,125);
            }
            t += 1;
            ctx.fillText(t,10*t,100);
        }

        /*
        for(var k=0; k<tps_simula; k++) {
            boucle2(k);
        }
        */
    
        setInterval(boucle, 10, temps);

        ctx.fillStyle = '#060080';
        ctx.font = "bold 10px Arial";
        ctx.fillText("Mince, c'est fini :(", 10, 180);
    }
    
    
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    //================================================================================================================================
    
    // AFFICHAGE FINAL
    
    var couleur=["magenta","cyan","red","green","blue","yellow","black","orange","purple","brown"];
    var zone_dessin = document.getElementById("schema1");
    var graphe= zone_dessin.getContext("2d");
    var p0=crea_point(30,zone_dessin.height-30);
    erase(graphe,zone_dessin.width,zone_dessin.height);
    dessine_axes(graphe,p0,zone_dessin.height-60,zone_dessin.width-60,"temps (s)","distance (mètres)");
    graph_temporel(graphe,Matrice_trains_temporel,L_block,p0,couleur,zone_dessin.height,zone_dessin.width);
    
    var zone_dessin_2 = document.getElementById("schema2");
    var graphe_2= zone_dessin_2.getContext("2d");
    var p0=crea_point(30,zone_dessin_2.height-30);
    erase(graphe_2,zone_dessin_2.width,zone_dessin_2.height);
    dessine_axes(graphe_2,p0,zone_dessin_2.height-60,zone_dessin_2.width-60,"nbr trains","fréquence");
    dessin_frequence(graphe_2,cde,csec,tot_block,p0,zone_dessin_2.height-60,0.94*(zone_dessin_2.width-60));

    
    var c = document.getElementById("myCanvas"); 
    var ctx = c.getContext("2d"); 

    animation_graphique(Matrice_trains_temporel, ctx);
    
    }
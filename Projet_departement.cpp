#include "train.h"

/* NOTES de Margot (pour comprendre le script, à modifier si vous voyez des erreurs!)
(Horaires_d)i,j = départ du train numéro i au quai numéro j
(où seuls les horaires de quais de stations sont pris en compte, et où les stations sont donc comptées chacune deux fois et dans l'ordre de passage:
La Défense - Esplanade - ... - Berault - Chateau de Vincennes - Chateau de Vincennes - Berault - ... - Esplanade - La Défense)

*/

// renvoie l'indice d'un tableau 1D correspondant à la valeur (i,j) d'un tableau 2D de taille nb_lignes x nb_colonnes
int indice_tableau(const int i, const int j, const int nb_lignes,const int nb_colonnes){
    int indice = i*nb_colonnes + j;
    return indice;
}

// affecte à un train son tableau d'horaires
void affecte_horaires(const ligne L, train & t){
    int indice_train = t.numero_train;
    int nb_stations = L.Nb_stations;
    for(int station =0; station <nb_stations ; station ++){
        int indice = indice_tableau(indice_train, station, indice_train, nb_stations);
        t.tps_de_depart[station] = L.Horaires_d[indice]; 
        t.tps_de_d_arrivee[station] = L.Horaires_a[indice];
        t.taille_troncon[station] = L.Len_blocs[station];
    }
}


int importation(ligne & L){
    string chemin = srcPath("sortie_graphique.txt"); // chemin relatif
    ifstream monFlux(chemin);  //Ouverture d'un fichier en lecture
    if(monFlux){//Tout est prêt pour la lecture.
        string mot;
        monFlux >> mot;    //Lit un mot depuis le fichier : Hello
        float nombre_entier;

        // lit Nb_stations
        monFlux >> mot;
        monFlux >> nombre_entier;
        const int Nb_stations = int(nombre_entier);
        L.Nb_stations = Nb_stations;

        // lit Nb_quais
        monFlux >> mot;
        monFlux >> nombre_entier;
        const int Nb_quais = int(nombre_entier);
        L.Nb_quais = Nb_quais;
        cout <<mot<<" = " << Nb_quais <<endl;

        // lit Nb_trains au sens nouveaux trains
        monFlux >> mot;
        monFlux >> nombre_entier;
        const int Nb_trains = int(nombre_entier);
        L.Nb_trains = Nb_trains;


        // lit Vitesse_moy
        monFlux >> mot;
        monFlux >> nombre_entier;
        const int Vitesse_moy = int(nombre_entier);
        L.Vitesse_moy = Vitesse_moy ;


        // lit Tot_blocs (nombre de quais en comptant leur multiplicité ?)
        monFlux >> mot;
        monFlux >> nombre_entier;
        const int Tot_blocs = int(nombre_entier);
        //L.Tot_blocs = Vitesse_moy ;

        // lit les horaires de départ
        monFlux >> mot;
        int Horaires_d [Nb_trains* Tot_blocs];
        int Horaires_depart[Nb_trains];
        for(int train = 0; train < Nb_trains; train ++){
            for(int noeud = 0; noeud <Tot_blocs ; noeud ++){
                monFlux >> nombre_entier; //Lit un nombre entier depuis le fichier

                int indice = indice_tableau(train, noeud, Nb_trains, Tot_blocs);
                Horaires_d[indice]= int(nombre_entier); //Rajoute dans le tableau Horaire_d l'horaire du passage du train n°train au noeud n°noeud
                L.Horaires_d[indice]= int(nombre_entier);
                if (noeud == 0){
                    L.Horaires_depart[train] = int(nombre_entier);
                }
            }
        }

        // lit les horaires d'arrivée
        monFlux >> mot;
        int Horaires_a [Nb_trains * Tot_blocs];
        for(int train = 0; train < Nb_trains; train ++){
            for(int noeud = 0; noeud <Tot_blocs ; noeud ++){
                monFlux >> nombre_entier; //Lit un nombre entier depuis le fichier
                int indice = indice_tableau(train, noeud, Nb_trains, Tot_blocs);
                Horaires_a[indice]= int(nombre_entier);
                L.Horaires_a[indice]= int(nombre_entier);
            }
        }

        // lit le tableau Len_blocs
        monFlux >> mot;
        int Len_blocs[Tot_blocs];
        for(int noeud =0; noeud <(Tot_blocs) ; noeud ++){
            monFlux >> nombre_entier;
            Len_blocs [noeud]= int(nombre_entier);
            L.Len_blocs [noeud]= int(nombre_entier);
            cout << "Len_blocs["<< noeud << "] = " << Len_blocs [noeud] << endl;
        }

        // lit le tableau Quais
        monFlux >> mot;
        int Quais [Tot_blocs];
        for(int noeud =0; noeud <Tot_blocs ; noeud ++){
            monFlux >> nombre_entier;
            Quais[noeud]= int(nombre_entier);
            L.Quais[noeud]= int(nombre_entier);
            cout << "Quais["<< noeud << "] = " << Quais[noeud] << endl;
        }
        cout << "Importation terminée" << endl;
    }
    else{
        cout << "ERREUR: Impossible d'ouvrir le fichier en lecture." << endl;
    }

    return 0;
}



int main(){
    ligne L;
    int num_train = 1;
    importation(L);
    for(int noeud =0; noeud <148 ; noeud ++){
        cout << "L.Quais["<< noeud << "] = " << L.Quais[noeud] << endl;
    }
    int instant= L.Horaires_depart[0];
    openWindow(1500,120);
    L.dessine_ligne();
    L.dessine_stations();
    int nouveau_train = L.Horaires_depart[num_train];
    vector<train> v;
    train t;
    t.numero_train = 0;
    t.vivant = true;
    t.couleur = RED;
    affecte_horaires(L,t);
    v.push_back(t);
    t.avance_train();
    instant +=1;
    milliSleep(100);
    while (! v.empty()){
        
        if (instant == nouveau_train){
            train t;
            t.vivant = true;
            t.numero_train = num_train;
            affecte_horaires(L,t);
            v.push_back(t);
            num_train+=1;
            nouveau_train = L.Horaires_depart[num_train];
        }
        for (int i = 0; i< v.size(); i++){
            v[i].avance_train();

            if (!v[i].vivant){
                int taille = v.size()-1;
                swap(v[i],v[taille]);
                v.pop_back();
            }
        }
        instant +=1;
        cout <<instant <<endl;
        milliSleep(100);
    }
    endGraphics();
    return 0;
}

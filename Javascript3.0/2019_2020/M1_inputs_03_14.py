#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Feb  7 14:42:47 2020

@author: alicekrychowskimac
"""

import numpy as np
import csv
from pathlib import Path


"""
Version du samedi 14 mars
MàJ du samedi 14 mars
    ajout des grandeurs Tps_sim et Nb_trains 

MàJ du lundi 2 mars 
Ajout de variable et renvoi dans l'ordre exigé par le pole modèle 
Distance_securite en 2 eme pos
dwell time (noté w) en 3eme pos 
Vitesse_max en 5ème pos
Vitesse_moy en 6 ème pos


MàJ du lundi 24 février 
    ajout de la grandeur Nb_quais = 2 * Nb_stations 
    les matrices OD contiennent des flottants (et pas des entiers)

    
Le fichier des paramètres doit être enregistré en format CSV UTF-8 (délimité par des virgules)
et rangé dans le même dossier que ce fichier (ou alors, vous pouvez commenter la ligne qui utilise  
joinpath, décommenter la ligne sur le file_path, et changer manuellement votre chemin d'accès).
"""


"--------------------------Fonctions de récupération des données-----------------------------------"
def importer_param(file_name):
    """
    Prend en argument un fichier csv.
    Renvoie une liste qui contient les éléments (qui sont de type str) du fichier 
    """
    # Autre option d'accès au fichier, en ecrivant votre chemin d'accès : 
    #file_path="/Users/alicekrychowskimac/Documents/"+file_name+".csv" 
    file_path = Path(__file__).parent.joinpath(file_name+".csv") 
    file=open(file_path, "r", encoding='latin1') # changer encoding pour éviter les problèmes d'accent??
    tableau=csv.reader(file, delimiter=',')
    liste=[]
    for row in tableau:
        string=row[0]
        newrow = (string.split(";")) # on a une liste de string
        liste.append(newrow)
    file.close()
    return(liste) # liste est une liste de liste, les sous listes contenant un élément (de type str)

def recuperer_entiers(liste_param,N):
    """
    Prend en argument : 
    - liste_param la liste des données 
    - Un entier N qui correspond aux nombre de paramètres qui sont des entiers "seuls" 
    Renvoie M une matrice qui contient tout ces entiers 
    """
    M =[]
    for indice in range(1,N+1):
        M.append(int(liste_param[indice][1])) # 2ème élément de la i-ième ligne 
    return M

def recuperer_matrice(liste_param,indice_premiere_ligne, N, M):
    """
    Prend en argument : 
    - liste_param la liste des données
    - 1 entier indice_première_ligne qui donne l'indice de la première ligne de la matrice OD 
    - deux entiers N et M qui correspondent à une taille de matrice NxM.
    Renvoie la matrice d'entiers correspondante 
    """
    liste = np.zeros((N, M),dtype=float)
    for i in range(0,N):                      
        for j in range(0,M):
            liste[i,j] = float(liste_param[indice_premiere_ligne+i][j])
    return(liste)

def recuperer_liste_str(liste_param, indice_ligne, longueur_liste):
    """
    Prend en argument : 
    - liste_param la liste des données 
    - 1 entier indice_ligne qui donne l'indice de la ligne où est stockée la liste
    - 1 entier longueur_liste qui correspondent à la taille de la liste
    Renvoie la liste de strings correspondante 
    """
    liste = []
    for i in range(0,longueur_liste):                      
        liste.append(liste_param[indice_ligne][1+i])
    return(liste)

def recuperer_liste_int(liste_param, indice_ligne, longueur_liste):
    """
    Prend en argument : 
    - liste_param la liste des données 
    - 1 entier indice_ligne qui donne l'indice de la ligne où est stockée la liste 
    - longueur_liste qui correspondent à la taille de la liste
    Renvoie la liste d'entiers correspondante 
    """
    liste = []
    for i in range(0,longueur_liste):                      
        liste.append(int(liste_param[indice_ligne][1+i])) 
    return(liste)


def inputs(file_name):
    """
    Prend en argument file_name le nom de fichier de type str. 
    Renvoie une liste qui contient tous les paramètres. 
    """
    liste_param=importer_param(file_name)
    #Nombre_total_lignes = len(liste_param)
    N = 13 # Nombre de paramètres qui sont juste des entiers, à écrire éventuellement dans le fichier 
    Nb_modele, Nb_max_passagers_pointe, Nb_max_passagers_creuses, Nb_max_rames, Longueur_rame,Nb_stations, Nb_matrices_OD, Distance_securite, Vitesse_max, Vitesse_moy, w, Tps_sim, Nb_trains = recuperer_entiers(liste_param, N)

    # Récupération des matrices OD 
    Nb_quais = 2* Nb_stations
    Liste_matrices_OD = [] 
    for i in range(Nb_matrices_OD):
        ligne = N+2 + i *(Nb_stations +1)  # l'indice de la première ligne de chaque matrice OD 
        OD = recuperer_matrice(liste_param, ligne, Nb_stations, Nb_stations)
        Liste_matrices_OD.append(OD)
    ligne_station = N+1 + Nb_matrices_OD*(Nb_stations +1)
    Stations = recuperer_liste_str(liste_param, ligne_station, Nb_stations)
    Distances_interstations  = recuperer_liste_int(liste_param, ligne_station+1, Nb_stations-1)
    Longueur_tot = 0
    for i in range(len(Distances_interstations)):
        Longueur_tot += Distances_interstations[i]
    print(Longueur_tot)
    return [Nb_max_rames, Distance_securite, w, Distances_interstations,Vitesse_max, Vitesse_moy, Nb_modele, Nb_max_passagers_pointe, Nb_max_passagers_creuses, Longueur_rame,Nb_stations, Nb_quais, Nb_matrices_OD,Liste_matrices_OD, Stations, Tps_sim, Nb_trains ]

B = inputs("M1_inputs_24_02" )

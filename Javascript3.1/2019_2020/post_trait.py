# -*- coding: utf-8 -*-
"""
Created on Mon Mar  9 16:11:02 2020

@author: steph
"""

from pathlib import Path
import numpy as np

file_path = Path(__file__).parent.joinpath("sortie.csv") 
file=open(file_path, "r", encoding='latin1')


file.readline()
Tot_blocs=int(file.readline())
file.readline()
Tps_Sim=int(file.readline())
file.readline()

Quais=[]
ligne=file.readline()
ligne=ligne.split(";")
for j in range(Tot_blocs):
    Quais.append(int(float(ligne[j])))

Len_blocs=[]
ligne=file.readline()
ligne=ligne.split(";")
for j in range(Tot_blocs):
    Len_blocs.append(int(float(ligne[j])))
    
Running_times=[]
ligne=file.readline()
ligne=ligne.split(";")
for j in range(Tot_blocs):
    Running_times.append(int(float(ligne[j])))

    
bip=[]
ligne=file.readline()
ligne=ligne.split(";")
for j in range(Tot_blocs):
    bip.append(int(float(ligne[j])))

file.readline()
matrice_d=np.zeros((Tps_Sim,Tot_blocs))
for i in range(Tps_Sim):
    ligne=file.readline()
    ligne=ligne.split(";")
    for j in range(Tot_blocs):
        matrice_d[i][j]=(int(float(ligne[j])))
file.close()


def fiche_horaire_d(matrice_d, bip):
    # Nb de cycles
    Nb_cycles = len(matrice_d)-1
    # Nb de blocs
    tot_blocs = len(matrice_d[0])
    # Fiches horaires de départ
    Horaires_d = -np.ones((Nb_cycles, tot_blocs)) # Liste de Nb_cycles (f(T, nb_max_rames)) listes de taille tot_blocs
    for k0 in range(Nb_cycles): # Boucle sur les trains partant de la station 0 (cycle)
        Horaires_d[k0][0]=matrice_d[k0+1][0] # La première ligne de la matrice D n'étant pas intéressante pour les horaires
        k = k0
        for j in range(1, tot_blocs): # Boucle sur les blocs
            if (k == Nb_cycles-1): # Si on sort de la matrice, on le montre explicitement
                break
            if (bip[j-1] == 1 and k < Nb_cycles-1): # Décalage si un train à l'origine sur ce bloc
                k += 1   
            Horaires_d[k0][j] = matrice_d[k+1][j] # On remplit l'horaire correspondant
    return(Horaires_d)


def fiche_horaire_a(Horaires_d, Running_times):
    Nb_cycles = len(Horaires_d)
    tot_blocs = len(Horaires_d[0])
    # Fiches horaires d'arrivée
    Horaires_a = -np.ones((Nb_cycles, tot_blocs))
    # ATTENTION: pour un même train, a[j] correspond dans la réalité à "a[j+1]", ie le temps d'arrivée à la station j+1
    for k in range(Nb_cycles):
        for j in range(tot_blocs):
            if (Horaires_d[k][j]==-1):
                break # Si l'horaire de départ associé ne signifie plus rien, on ne s'intéresse plus au temps d'arrivée correspondant
            else:
                Horaires_a[k][j]=Horaires_d[k][j]+Running_times[j] # Calcul du temps d'arrivée = temps de départ de la station précédente + temps de parcours sur le segment d'indice inférieur
    return(Horaires_a)
      
import matplotlib.pyplot as plt
  
def Trace_distance_temps(Horaires_d, Horaires_a, len_blocs):
    Nb_cycles = len(Horaires_d)
    tot_blocs = len(Horaires_d[0])
    longueur = [0]
    fin = 0
    for j in range(1, tot_blocs): # On construit la liste des ordonnées à tracer. 
        distance = longueur[2*(j-1)] + len_blocs[j-1] #Liste des distances cumulées
        longueur.append(distance)
        longueur.append(distance) # 2 points par station (arrivée puis départ)
    longueur.append(longueur[2*(tot_blocs-1)]+len_blocs[tot_blocs-1]) 
    for k in range(Nb_cycles):
        temps = []
        for j in range(tot_blocs):
            if (Horaires_d[k][j] == -1):
                fin = j-1 # On ne trace pas les parties non parcourues ^^
                break 
            if (j == tot_blocs-1):
                fin = j # On trace l'ensemble du cycle
            temps.append(Horaires_d[k][j])
            temps.append(Horaires_a[k][j])
        plt.plot(temps[:2*fin], longueur[:2*fin]) # Méthode du slicing: permet de s'arrêter à la dernière info donnée
     
    # Tracé
    plt.xlabel('Temps de parcours')
    plt.ylabel('Distance parcourue')
    plt.show()

horaires_d = fiche_horaire_d(matrice_d, bip)
horaires_a = fiche_horaire_a(horaires_d,Running_times)
Trace_distance_temps(horaires_d,horaires_a,Len_blocs)


#Fiche horaire pour un train donné
def horaire_d_quai(Horaires_d,Quais,k):
    res=[]
    for j in range(Tot_blocs):
        if(Quais[j]!=-1):   #Si on est sur une station
            secondes=Horaires_d[k][j]%60
            minutes=Horaires_d[k][j]//60
            heures=minutes//60
            minutes=minutes%60
            if(heures==0):
                res.append(str(minutes)+"min "+str(secondes)+"s")
            else:
                res.append(str(heures)+"h "+str(minutes)+"min "+str(secondes)+"s")
    return res
    
train_0=horaire_d_quai(horaires_d,Quais,0)


#Fiche horaire générale filtrée pour les stations
def fiche_horaire_d_filtree(Horaires_d,Quais):
    res=[]
    for k in range(Nb_max_rames):
        res.append(horaire_d_quai(Horaires_d,Quais,k))
    return res

fiche_d_finale = fiche_horaire_d_filtree(horaires_d,Quais)



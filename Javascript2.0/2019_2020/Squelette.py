# -*- coding: utf-8 -*-
"""
Created on Wed Mar  4 14:34:08 2020

@author: steph
"""
import numpy as np
import matplotlib.pyplot as plt
from Modele_final import modele
from M1_24_02 import inputs
import time
from pathlib import Path

Nb_modele, Nb_max_passagers_pointe, Nb_max_passagers_creuses, Nb_max_rames, Longueur_rame,Nb_stations, Nb_quais, Nb_matrices_OD,Liste_matrices_OD, Stations, Distances_interstations= inputs("M1_inputs_24_02" )

Distance_securite=200
Nb_trains = 100
w=30
Tps_sim=100
Vitesse_max=22
Vitesse_moy=10
l=np.arange(1,10)
h=[]
t=time.clock()


##Tracé
#for i in l:
#    print(i)
#    Tot_blocs=0
#    matrice_d, Tot_blocs, bip,Running_times,Len_blocs,Quais=modele(i, Tps_sim, Distance_securite, w, Distances_interstations, Vitesse_max, Vitesse_moy, Nb_modele)
#    h.append(3600*Tps_sim/matrice_d[Tps_sim-1][0])
#    nt=time.clock()
#    print(Tot_blocs)
#    print("Temps:"+str(nt-t))
#    t=nt
# 
#plt.grid()
#plt.xaxis()
#plt.plot(l,h,label="Modèle n°"+str(Nb_modele))
#plt.legend()
#plt.show()



matrice_d, Tot_blocs, bip,Running_times,Len_blocs,Quais = modele(Nb_trains, Tps_sim, Distance_securite, w, Distances_interstations, Vitesse_max, Vitesse_moy, Nb_modele)

file_path = Path(__file__).parent.joinpath("sortie.csv") 
file=open(file_path, "w", encoding='latin1')

file.write("Nombre de blocs:\n")
file.write(str(Tot_blocs)+"\n")
file.write("Temps de simulation:\n")
file.write(str(Tps_sim)+"\n")


file.write("\n")
for i in range(Tot_blocs):
    file.write(str(Quais[i])+";")
file.write("\n")
for i in range(Tot_blocs):
    file.write(str(Len_blocs[i])+";")
file.write("\n")
for i in range(Tot_blocs):
    file.write(str(Running_times[i])+";")
file.write("\n")
for i in range(Tot_blocs):
    file.write(str(bip[i])+";")
file.write("\n")
file.write("\n")
for i in range(Tps_sim):
    for j in range(Tot_blocs):
        file.write(str(matrice_d[i][j])+";")
    file.write("\n")
file.close()

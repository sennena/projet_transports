##Projet simulation du trafic

import numpy as np
import random as rd


#Arguments:
    
#Nb_max_rames=20

#Distance_securite=200

#w=30 #Temps d'attente à chaque station (en s)

#Distances_interstations=[1054,700,940,830,680,410,460,640,430,700,590,450,420,540,350,655,730,860,990,670,890,800,790,840] #Les chemins de rebroussement font 2*Distance_securite

#Vitesse_max=20  #en m/s
#Vitesse_moy=10    #en m/s

#Num_modele (1 si vitesse moyenne à considérer, 2 si modèle accélération/décélération  )






def modele(Nb_max_rames, Tps_sim, Distance_securite, w, Distances_interstations, Vitesse_max, Vitesse_moy, Num_modele):
    
    
    
    n=len(Distances_interstations)
    D_interstations=Distances_interstations.copy()
    D_interstations.append(2*Distance_securite)
    for i in range(n-1,-1,-1):
        d=Distances_interstations[i]
        D_interstations.append(d)
    D_interstations.append(2*Distance_securite)
    
    Nb_quais=len(D_interstations)
    
    
    Nb_blocs=np.zeros(len(D_interstations)) #Nb_blocs[i]: nb de blocs entre la station i et i+1
    Len_blocs=[]    #Longueur de chaque bloc
    
    
    Quais=[] #Indique le numéro de la plateforme
    
    
    
    
    
    #==============================
    
    def segmentation():
        res=0
        for i in range(Nb_quais):
            Nb_blocs[i] += D_interstations[i]//Distance_securite
            l=int(D_interstations[i]/Nb_blocs[i])   #Longueur d'un bloc entre la station i et i+1
            Quais.append(i)
            Len_blocs.append(l)
            for k in range(int(Nb_blocs[i]-1)):
                Quais.append(-1)  
                Len_blocs.append(l)
            res += Nb_blocs[i]
        return res
    
    Tot_blocs = 0
    Tot_blocs = int(segmentation())  #Nb de blocs (stations incluses, une station etant un bloc)
    print(Tot_blocs)
    #==============================
    
    Safety_time=30*np.ones(Tot_blocs)
    
    dw=np.zeros(Tot_blocs)  
    for i in range(Tot_blocs):
        if (Quais[i]!=-1):
            dw[i]+=w
    
    #==============================
    Running_times = np.zeros(Tot_blocs)
    
    if (Num_modele==1):
    #1er modèle simplifié avec la vitesse moyenne (pas d'accélération ni déccélération
        
        for i in range(Tot_blocs):
            Running_times[i]=int(Len_blocs[i]/Vitesse_moy)
            
            
    elif (Num_modele==2):
    #2ème modèle avec accélération/décélération
        for i in range(Tot_blocs):
            Running_times[i]=int(Len_blocs[i]/Vitesse_max)
        for i in range(Tot_blocs-1):
            if (Quais[i]!=-1):
                Running_times[i]*=2 #Latence due à la déccélération à l'arrivée d'une station
                Running_times[i+1]*=2   #latence due à l'accélération au départ d'une station
        
            
    #==============================   
            
    #Positions initiales
    bip=np.zeros(Tot_blocs)     #Liste de taille Tot_blocs, bip[j] indique si un train se trouve dans le bloc j initialement
    def pos_init(Nb_max_rames,Tot_blocs):
        
        ip=[]   #Liste de taille nb_max_rames, ip[k] est le numéro du bloc où se trouve le train k
        
        #Constructions de ip
        compteur=0
        
        def test(pos,l):
            for i in range(len(l)):
                if abs(pos-l[i])<=1:
                    return False
            return True
        j=0
        while(compteur<Nb_max_rames and j<200):
            j+=1
            print(j)
            pos=rd.randint(0,Tot_blocs-1)
            if test(pos,ip):
                ip.append(pos)
                compteur+=1
                j=0
                print(compteur)
        ip.sort()
        
        return ip
    
    ip=rd.sample(range(Tot_blocs),Nb_max_rames)
    ip.sort()
      
    #ip=pos_init(Nb_max_rames,Tot_blocs)
    
    #Constructions de bip   
    for pos in ip:
        bip[pos]=1
    
    #============================== 
    Tps_boucle=0
    for i in range(Tot_blocs):
        Tps_boucle+=Running_times[i]
        Tps_boucle+=dw[i]
    

    print("Nb_quais",Nb_quais)  #int    
    print("Distances_interstations:", Distances_interstations) #array de taille Nb_quais    
    print("Nb_blocs:",Nb_blocs) #array de taille Nb_quais
    print("Tot_blocs:",Tot_blocs)   #int
    print("Quais:",Quais)   #array de taille Tot_blocs
    print("Len_blocs:",Len_blocs)   #array de taille Tot_blocs
    print("dw:",dw) #array de taille Tot_blocs
    print("Running_times:",Running_times)   #array de taille Tot_blocs
    print("Temps total, T:",Tps_boucle)  #int
    print("ip:", ip)    #array de taille Nb_max_rames
    print("bip:",bip)   #array de taille Tot_blocs

    T=Tps_sim

    BB= - 10**5
    dt = BB*np.ones((T,Tot_blocs))
    for j in range(Tot_blocs):
        if bip[j]==1:
            dt[0][j]=0

    Mdep=np.zeros((Tot_blocs,Tot_blocs))
    Msecu=np.zeros((Tot_blocs,Tot_blocs))
    Ndep=np.zeros((Tot_blocs,Tot_blocs))
    Nsecu=np.zeros((Tot_blocs,Tot_blocs))
    cdep=np.zeros(Tot_blocs)
    csecu=np.zeros(Tot_blocs)
    
    for i in range(Tot_blocs):
        j=(i-1)%Tot_blocs
        if bip[j]==0:
            Mdep[i][j]=1
        else:
            Ndep[i][j]=1
        cdep[i]=Running_times[j]+dw[i]
        j=(i+1)%Tot_blocs
        if bip[i]==1:
            Msecu[i][j]=1
        else:
            Nsecu[i][j]=1
        csecu[i]=Safety_time[i]
    
    
    
    eps=10**-5
    
    
    
    
    for k in range(1,T):
        err=1
        dk=np.zeros((Tot_blocs))
        dk1=np.zeros((Tot_blocs))
        count=0
        while err>eps and count<200000:
            dk=np.array(dt[k])
            dk1=np.array(dt[k-1])
            
            tMdep=np.dot(Mdep,dk)
            tNdep=np.dot(Ndep,dk1)
            tcdep=cdep        
            
            tMsecu=np.dot(Msecu,dk)
            tNsecu=np.dot(Nsecu,dk1)
            tcsecu=csecu 
            
            s=0
            for j in range(Tot_blocs):
                val=tMdep[j]+tNdep[j]+tcdep[j]
                val=max(tMdep[j]+tNdep[j]+tcdep[j],tMsecu[j]+tNsecu[j]+tcsecu[j])
                dt[k][j]=val
                s+=(val-dk[j])**2
            err=np.sqrt(s)
            count+=1
            
            
    matrice_d=dt

#============================== 

    return matrice_d, Tot_blocs, bip,Running_times,Len_blocs,Quais 
  

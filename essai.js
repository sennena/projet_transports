var zone_dessin = document.getElementById("schema");
	var graphe= zone_dessin.getContext("2d");
	var compteur=0;
	graphe.strokeStyle = "blue";
	graphe.lineWidth=1;
	graphe.beginPath();
		graphe.moveTo(0,f(0));
		while(compteur<10) {
			graphe.lineTo(30*(compteur-(0)),300-(f(compteur)-(-1))*150);
			compteur=(compteur+0.05);
		}						
	graphe.stroke();
	function f(x) {
		var y=Math.cos(x);
		return (y);
	}
	graphe.beginPath();
		graphe.lineWidth="1";
		graphe.strokeStyle="black";
		for (int i=0;i<)
		graphe.moveTo(0,zone_dessin.height/2);
		graphe.lineTo(zone_dessin.width,zone_dessin.height/2);
		graphe.lineTo(zone_dessin.width-5,(zone_dessin.height/2)-5);
		graphe.moveTo(zone_dessin.width,zone_dessin.height/2);
		graphe.lineTo(zone_dessin.width-5,(zone_dessin.height/2)+5);
		graphe.moveTo(zone_dessin.width/2,zone_dessin.height);
		graphe.lineTo(zone_dessin.width/2,0);
		graphe.lineTo((zone_dessin.width/2)-5,5);
		graphe.moveTo(zone_dessin.width/2,0);
		graphe.lineTo((zone_dessin.width/2)+5,5);
	graphe.stroke();
	graphe.fillText("0",0,10+zone_dessin.height/2);
	graphe.fillText("10",zone_dessin.width-20,10+zone_dessin.height/2);
	graphe.fillText("-1",5+zone_dessin.width/2,-8+zone_dessin.height);
	graphe.fillText("1",5+zone_dessin.width/2,8);
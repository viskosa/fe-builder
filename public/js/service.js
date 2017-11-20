function Service(){
	this.init();
}

Service.prototype.init=function(){
	new Change();
	new HideDiv();
}

window.addEventListener('DOMContentLoaded', function(){new Service()});
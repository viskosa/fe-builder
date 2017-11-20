function HideDiv () {
	this.parent = document.querySelector('.section');
	document.querySelector('.button__click').addEventListener('click', this.hide.bind(this));
}

HideDiv.prototype.hide = function(){
	this.parent.classList.toggle('hideDiv');
}

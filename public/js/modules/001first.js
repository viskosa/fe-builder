function Change () {
	this.parent = document.querySelector('.section');
	this.button = document.querySelector('.button__push');
	this.button.addEventListener('click', this.changeBg.bind(this));

}
Change.prototype.changeBg = function(){
	this.parent.classList.toggle('changeBg');
}

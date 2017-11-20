function App(){

}

/*App.prototype.request = function(callback){
	setTimeout(function(){console.log('1');}, 3000);
}*/
 

// GET DATE --------------------------------------
App.prototype.now = function(data){
	var date = data ? new Date(data) : new Date();
	return (new Date(date.getFullYear(), date.getMonth(), date.getDate())).valueOf();//возвращает время в мс переданной ему даты. Если дату не передали - вернет время сегодняшнего дня
}

App.prototype.createDate = function(time, lang){
	var now = this.now(); // время сегодняшнего дня в мс
	var server = this.now(time); // время пришедшего с сервера дня в мс
	if (now > server){ // значит, эта новость прошлого дня
		var date = new Date(time); // и вывести дату в виде 11 Января 2017
		var m = date.getMonth()+1;// +1 т.к. в js месяцы нумеруются с 0, а в нашем массиве с 1
		var month = this.getMonth(lang, m); /*'ru', 1*/  //получаем название месяца из объекта
		return (date.getDate() + ' ' + month + ' ' + date.getFullYear());
	} else { //иначе это сегодняшняя новость и вывести в виде 11 : 00
		var timeArray =  time.split(' '); //разбиваем полученную с сервера строку по пробелу и делаеи массив
		return (timeArray[1].slice(0,-3));//берем второй индекс в массиве, т.е. время, и работаем с ним как со строкой - обрезаем сзади 3 символа и возвращаем то, что осталось - т.е. только часы и минуты без секунд
	}
}

// XHR --------------------------------------------
App.prototype.ajax = function(method, url,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200) {
            //console.log(xhr);
            callback(xhr.responseText);
        }
    }
    xhr.open(method, url, callback);
    xhr.send(null);
}

// RECURSE IN OBJECT -------------------------------
App.prototype.recurse = function(obj, item, callback){
    //console.log(obj, "1");
    for(key in obj) { 
        //console.log(key, item);
        if (key == item){
            //console.log(obj, "1");
            callback(obj[key]);
            return;
         };
        if (obj[key] instanceof Object){
            this.recurse(obj[key], item, callback);
        };
    };
}

// COOKIE -------------------------------------------
App.prototype.getCookie = function(cookieName){
    var allcookies = document.cookie,                //берем все куки с документа
        pos = allcookies.indexOf(cookieName + '=');  //определяем точку перед cookieName. Равно дописали, чтобы в куках искать строку "popup="
    if (pos == -1) {                                 // если строки popup в куках нет (indexOf возвращает -1, если ничего не нашел)                  
        return false;
    } else if (pos != -1) {                          
        var start = pos + cookieName.length + 1,    //теперь находим точку после равно в выражении "popup=". +1 - это прибавили равно к длине слова popup
            end = allcookies.indexOf(';', start);   //находим конечную точку - ищем ; со старта
            if (end == -1){                         //если indexOf вернул -1, т.е. не нашел точки с запятой
                end = allcookies.length;            //то это последняя кука и значит считать ендом длину всей строки кук
            }
    } 
    var value = allcookies.substring(start, end);   // вырезаем то, что получилось(true)
    return decodeURIComponent(value);               // и возвращаем декодированное значение  
}

function Service(){
	this.init();
}

Service.prototype.init=function(){
	new Change();
	new HideDiv();
}

window.addEventListener('DOMContentLoaded', function(){new Service()});
function Change () {
	this.parent = document.querySelector('.section');
	this.button = document.querySelector('.button__push');
	this.button.addEventListener('click', this.changeBg.bind(this));

}
Change.prototype.changeBg = function(){
	this.parent.classList.toggle('changeBg');
}

function HideDiv () {
	this.parent = document.querySelector('.section');
	document.querySelector('.button__click').addEventListener('click', this.hide.bind(this));
}

HideDiv.prototype.hide = function(){
	this.parent.classList.toggle('hideDiv');
}

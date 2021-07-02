function mainParse(n){
    let link = window.location
    let results = new Object()
    for (let i = 0; i < n; i++){
        let data = getData(link + "&page=" + i.toString())
        results = parse(data, results)
    }
    return results
}




function getData(link){
    //Получение страниц
    var xhr = new XMLHttpRequest();
    xhr.open("GET", params, true)
    xhr.send();
    xhr.onreadystatechange = function (){
        var x = xhr.responseText
        console.log(x)
    }
    return x;
}


function parse(data, res){
    //Получение данных со страницы
    let t = data.getElementsByClassName("list-group-item")
    for (let i = 0; i < t.length; i++){
        console.log(t[i])
    }
}

function saveData(){
//    Запись данных в файл/массив
}

function showData(){
}

mainParse(2)
function mainParse(n){
    let link = window.location
    let results = new Object()
    for (let i = 1; i <= n; i++){
        let data = getData(link + "&page=" + i.toString())
        // console.log(i.toString())
        console.log(data)
        // console.log(typeof data)
        results = parse(data, results)
    }
    return results
}




function getData(link){
    //Получение страниц
    var xhr = new XMLHttpRequest()
    var parser = new DOMParser()
    // console.log(link)
    xhr.open("GET", link, true)
    xhr.send();
    xhr.onreadystatechange = function (){
        if (xhr.readyState != 4) return;
        var x = xhr.responseText
        // console.log(x)
        var t = parser.parseFromString(x.t, "text/html")
        // console.log(t)
        return 2;
    }
    console.log(xhr.onreadystatechange)
    return 1
}


function parse(data, res){
    //Получение данных со страницы
    if (data){
        let t = data.getElementsByClassName("list-group-item")
    }
    else{
        return;
    }
    // console.log(data)
    // console.log(t)
    for (let i = 0; i < t.length; i++){
        console.log(t[i])
    }
}

function showData(){
}

mainParse(2)
res = [{
    type: "Остальное",
    Items: []
}]




function getItem(a){
    let b = {
        type: a.getElementsByClassName("label label-default label-lesson")[0].innerText,
        Items: [a]
    }
    return b;
}

function pushItem(a){
    if (a.getElementsByClassName("label label-default label-lesson")[0].innerText === ""){
        res[0].Items.push(a);
        return;
    }
    let type = a.getElementsByClassName("label label-default label-lesson")[0].innerText
    for (let i = 0; i < res.length; i++){
        if (type === res[i].type){
            res[i].Items.push(a)
            return;
        }
    }
    let newItem = getItem(a)
    res.push(newItem)
}




function mainParse(n){
    let link = window.location
    let results = new Object()
    for (let i = 1; i <= n; i++){
        let data = getData(link + "&page=" + i.toString())
        // console.log(i.toString())
        // console.log(data)
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
        var t = parser.parseFromString(x, "text/html")
        parse(t)
        return 2;
    }
}


function parse(data){
    //Получение данных со страницы
    if (data){
        var t = data.getElementsByClassName("list-group-item")
    }
    else{
        return;
    }
    // console.log(data)
    // console.log(t)
    for (let i = 0; i < t.length; i++){
       pushItem(t[i])
        // console.log(t[i])
    }
    showChoiceType()
}

function showData(){
    let items = document.getElementsByClassName("list-group-item")
    while (items.length != 0){
        for (let i = 0; i < items.length; i++){
            items[i].replaceWith()
        }
        items = document.getElementsByClassName("list-group-item")
    }
}



function showChoiceType(){
    let l_type = document.getElementById("l_type")
    let type = "";
    for (let i = 1; i < res.length; i++){
        if (l_type.innerHTML.indexOf(`>${res[i].type}</option>`) == -1){
            l_type.innerHTML = l_type.innerHTML + `<option value="${i}">${res[i].type}</option>\n`
        }
    }
    console.log(type)
    return type
}



//#-id
//.-class-name
// - all el-s

function showFilter(){
    let node = document.getElementsByClassName("pagination")[0]
    let strs =  "<div class=\"container-fluid\">\n" +
        "    <label for=\"l_type\"></label>\n" +
        "    <select name=\"l_type\" id=\"l_type\" class=\"select-css\">\n" +
        "        <option value=\"\">Выберите тип</option>\n" +
        "        <option value=\"0\">Остальное</option>\n" +
        "    </select>\n" +
        "    <label for=\"l_name\"></label>\n" +
        "    <select name=\"l_name\" id=\"l_name\" class=\"select-css\">\n" +
        "        <option value=\"\">Выберите название</option>\n" +
        "        <option value=\"1\"></option>\n" +
        "    </select>\n" +
        "    <button id=\"b_start\" type=\"button\" class=\"btn btn-outline-secondary\">Start</button>\n" +
        "</div>"
    node.insertAdjacentHTML("afterend", strs)
    node.replaceWith()
}


function showChoiceName(){
    let type = document.getElementById("l_type")
    const num = type.selectedIndex




    for (let i in type){
        console.log(`${i}: ${type[i]}`)
    }
    console.log(type)
}




// document.addEventListener('DOMContentLoaded', function() {
//     var link = document.getElementById('b_start');
//     // onClick's logic below:
//     link.addEventListener('click', showData())
// });


//Получение данных
mainParse(2)
showFilter()
document.querySelector("#b_start").onclick = function(){
    showData()
}
document.querySelector("#l_type").onchange = function(){
    showChoiceName()
}


//Отображение фильтра
// Нажатие на кнопку поиска
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
}

function showData(){
}

//#-id
//.-class-name
// - all el-s

function showFilter(){
    let node = document.getElementsByClassName("pagination")[0]
    let strs = "<div class=\"container-fluid\">\n" +
        "        <label for=\"l_name\"></label>\n" +
        "        <select name=\"l_name\" id=\"l_name\" class=\"select-css\">\n" +
        "            <option value=\"\">Выберите название</option>\n" +
        "        </select>\n" +
        "        <label for=\"l_type\"></label>\n" +
        "        <select name=\"l_type\" id=\"l_type\" class=\"select-css\">\n" +
        "            <option value=\"\">Выберите тип</option>\n" +
        "        </select>\n" +
        "    <div class=\"text-center\">\n" +
        "        <button id=\"b_start\" type=\"button\" class=\"btn btn-outline-secondary\">Start</button>\n" +
        "    </div>\n" +
        "</div>"
    node.insertAdjacentHTML("afterend", strs)
}

// document.addEventListener('DOMContentLoaded', function() {
//     var link = document.getElementById('b_start');
//     // onClick's logic below:
//     link.addEventListener('click', showFilter())
// });




mainParse(2)
console.log(res);
showFilter()
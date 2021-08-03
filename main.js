res = [{
    type: "Остальное",
    Items: []
}]




function getItem(a){
    // Получение элемента массива из объекта документа
    return {
        type: a.getElementsByClassName("label label-default label-lesson")[0].innerText,
        Items: [a]
    };
}


function pushItem(a){
    // Запись a в массив res
    if (a.getElementsByClassName("label label-default label-lesson").length === 0){
        return;
    }
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
    // Основа, мб будет доработана
    let link = window.location.href
    for (let i = 1; i <= n; i++){
        let data = getData(link + "&page=" + i.toString())
        parse(data)
    }
}




function getData(link){
    //Получение страниц с лекциями
    var xhr = new XMLHttpRequest()
    var parser = new DOMParser()
    xhr.open("GET", link, true)
    xhr.send();
    xhr.onreadystatechange = function (){
        if (xhr.readyState !== 4) return;
        var x = xhr.responseText
        var t = parser.parseFromString(x, "text/html")
        parse(t)
        return 2;
    }
}


function parse(data){
    //Получение данных со страницы (блоков лекций)
    if (data){
        var t = data.getElementsByClassName("list-group-item")
    }
    else{
        return;
    }
    for (let i = 0; i < t.length; i++){
       pushItem(t[i])
    }
    showChoiceType()
}

function showData(){
    // Отображение данных по кнопке
    let items = document.getElementsByClassName("list-group-item")
    while (items.length !== 0){
        for (let i = 0; i < items.length; i++){
            items[i].replaceWith()
        }
        items = document.getElementsByClassName("list-group-item")
    }

    const type = document.getElementById("l_type")
    const name = document.getElementById("l_name")
    const num_t = type.selectedIndex - 1
    const num_n = name.selectedIndex
    if (num_n === 0 || num_t === -1){
        return;
    }
    const selected_name = name[num_n].label.split('\n').join(' ').trim()
    let listGroup = document.getElementsByClassName("list-group")[0]
    let arr = sort(res[num_t].Items, selected_name)
    for (let i = 0; i < arr.length; i++){
        listGroup.append(arr[i])
    }
}
function getNumberLink(obj){
    let num = obj.pathname.lastIndexOf("/")
    num = obj.pathname.slice(num + 1, obj.pathname.length)
    return parseInt(num)
}

function sort(array, target){
//    Сортировка по дате
    let result = []
    let flag = false
    for (let i = 0; i < array.length; i++){
       if (array[i].getElementsByTagName("span")[0].innerText.split('\n').join(' ').trim() === target){
           for (let j = 0; j < result.length; j++){
               if (getNumberLink(array[i].getElementsByTagName("a")[0]) >
                   getNumberLink(result[j].getElementsByTagName("a")[0]) ){
                        result.splice(j, 0, array[i]);
                        flag = true
                        break
               }
           }
           if ((result.length === 0) || (!flag)){
               result.push(array[i])
           }
       }
        }
    return result
}



function showChoiceType(){
    // Заполнение select, отвечающего за тип
    let l_type = document.getElementById("l_type")
    let type = ""
    for (let i = 1; i < res.length; i++){
        if (l_type.innerHTML.indexOf(`>${res[i].type}</option>`) == -1){
            l_type.innerHTML = l_type.innerHTML + `<option value="${i}">${res[i].type}</option>\n`
        }
    }
    return type
}

function showFilter(){
    // Отображение фильтра на странице
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
        "        </select>\n" +
        "    <button id=\"b_start\" type=\"button\" class=\"btn btn-outline-secondary\">Start</button>\n" +
        "</div>"
    node.insertAdjacentHTML("afterend", strs)
    node.replaceWith()
}

function printObj(obj){
    for (let i in obj){
        console.log(`${i}: ${obj[i]}`)
    }
}


function showChoiceName(){
    // Меняет select в зависимости от выбраного типа
    let type = document.getElementById("l_type")
    const num = type.selectedIndex
    if (num === 0) {
        return;
    }
    // console.log(num)
    let name = document.getElementById("l_name")
    name.innerHTML = "<option value=\"\">Выберите название</option>"
    for (let i = 0; i < res[num - 1].Items.length; i++){
        if (name.innerHTML.indexOf(`>${res[num - 1].Items[i].getElementsByTagName("span")[0].innerText}</option>\n`) === -1){
            name.innerHTML += `<option value="${i}">${res[num - 1].Items[i].getElementsByTagName("span")[0].innerText}</option>\n`
        }
    }
}

window.onload = function (){
    if (window.location.href.indexOf("https://home.mephi.ru/lesson_videos/") !== -1) {
        mainParse(20)
        showFilter()
        document.querySelector("#b_start").onclick = function(){
            showData()
        }
        document.querySelector("#l_type").onchange = function(){
            showChoiceName()
        }
    }
}


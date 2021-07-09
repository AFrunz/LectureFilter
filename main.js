res = [{
    type: "Остальное",
    Items: []
}]




function getItem(a){
    // Получение элемента массива из объекта документа
    let b = {
        type: a.getElementsByClassName("label label-default label-lesson")[0].innerText,
        Items: [a]
    }
    return b;
}

function pushItem(a){
    // Запись a в массив res
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
    //Получение страниц с лекциями
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
    //Получение данных со страницы (блоков лекций)
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
    // Отображение данных по кнопке
    let items = document.getElementsByClassName("list-group-item")
    while (items.length != 0){
        for (let i = 0; i < items.length; i++){
            items[i].replaceWith()
        }
        items = document.getElementsByClassName("list-group-item")
    }

    const type = document.getElementById("l_type")
    const name = document.getElementById("l_name")
    const num_t = type.selectedIndex - 1
    const num_n = name.selectedIndex
    const selected_name = name[num_n].label.split('\n').join(' ').trim()
    // for (let i in name[num_n]){
    //     console.log(`${i}: ${name[num_n][i]}`)
    // }
    let listGroup = document.getElementsByClassName("list-group")[0]
    for (let i = 0; i < res[num_t].Items.length; i++){
        console.log(res[num_t].Items[i].getElementsByTagName("span")[0].innerText.split('\n').join(' ').trim(), selected_name)
        if (res[num_t].Items[i].getElementsByTagName("span")[0].innerText.split('\n').join(' ').trim() === selected_name){
            console.log(res[num_t].Items[i])
            // for (let j in res[num_t].Items[i]){
            //     console.log(`${j}: ${res[num_t].Items[i][j]}`)
            // }
            // listGroup.innerHTML += res[num_t].Items[i];
            // listGroup.insertAdjacentHTML("beforeend", res[num_t].Items[i])
            listGroup.append(res[num_t].Items[i])
        }
    }
}



function showChoiceType(){
    // Заполнение select, отвечающего за тип
    let l_type = document.getElementById("l_type")
    let type = "";
    for (let i = 1; i < res.length; i++){
        if (l_type.innerHTML.indexOf(`>${res[i].type}</option>`) == -1){
            l_type.innerHTML = l_type.innerHTML + `<option value="${i}">${res[i].type}</option>\n`
        }
    }
    // console.log(type)
    return type
}



//#-id
//.-class-name
// - all el-s

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


function showChoiceName(){
    // Меняет select в зависимости от выбраного типа
    let type = document.getElementById("l_type")
    const num = type.selectedIndex
    console.log(num)
    let name = document.getElementById("l_name")
    name.innerHTML = "<option value=\"\">Выберите название</option>"
    for (let i = 0; i < res[num - 1].Items.length; i++){
        if (name.innerHTML.indexOf(`>${res[num - 1].Items[i].getElementsByTagName("span")[0].innerText}</option>\n`) === -1){
            name.innerHTML += `<option value="${i}">${res[num - 1].Items[i].getElementsByTagName("span")[0].innerText}</option>\n`
        }
    }
    // for (let i in res[num].Items[0]){
    //     console.log(`${i}: ${res[num].Items[0][i]}`)
    // }
    // console.log(res[num].Items[0])
    // console.log(res)
}




// document.addEventListener('DOMContentLoaded', function() {
//     var link = document.getElementById('b_start');
//     // onClick's logic below:
//     link.addEventListener('click', showData())
// });


//Получение данных
mainParse(25)
showFilter()
document.querySelector("#b_start").onclick = function(){
    showData()
}
document.querySelector("#l_type").onchange = function(){
    showChoiceName()
}


//Отображение фильтра
// Нажатие на кнопку поиска
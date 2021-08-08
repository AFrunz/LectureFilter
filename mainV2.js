let res = [{
    type: "Остальное",
    Items: []
}]


function getData(numberOfPages){
//    Получение HTML кода по ссылкам
//    Входные данные: Количество страниц
//    Выходные данные:

    let link = window.location.href;
    let links = []
    for (let i = 1; i <= numberOfPages; i++){                           // Массив ссылок
        links.push(link + "&page=" + i.toString());
    }
    let requests = links.map(url => fetch(url));                        // Массив запросов
    let promise = Promise.all(requests);
    promise.then(responses => {
        return responses.map(response => response.text());              // Парсинг в текст
    }).then(result => {
        result.forEach(item => item.then(
            result2 => {
                let html = getHTML(result2);     // Получение текста и передача в функцию преобразования в HTML
                parseVideos(html);               // Получение блоков видео со страниц и запись их в res

            }
        ));           // Конец forEach
    });
}

function getHTML(text){
    // Парсинг текста в HTML
    // Входные данные: Текст
    // Выходные данные: HTML объект
    let dom = new DOMParser();
    return dom.parseFromString(text, "text/html");
}

function parseVideos(htmlCode){
    // Получает блоки с видео и записывает в массив
    // Входные данные: Код страницы
    // Выходные данные:
    let items = $(htmlCode).find(".list-group-item");
    for (let i = 0; i < items.length; i++){
        pushItem(items[i]);
    }
}

function pushItem(block){
    // Записывает блоки с видео в массив res
    // Входные данные: блок с лекцией
    // Выходные данные:
    // безымянные лекции скипаются пока что
    if ($(block).find(".label.label-default.label-lesson").length === 0) {
        return;
    }
    if ($(block).find(".label.label-default.label-lesson")[0].innerText === ""){
        res[0].Items.push(block);
        return;
    }
    let type = $(block).find(".label.label-default.label-lesson")[0].innerText;
    for (let i = 0; i < res.length; i++){
        if (type === res[i].type){
            res[i].Items.push(block);
            return ;
        }
    }
    let newItem = getItem(block);
    res.push(newItem);
    // Добавление соответствуещего поля в select
    $("#l_type").append(`<option value=\\"${res.length - 1}">${res[res.length - 1].type}</option>\\n`);

}

function getItem(a){
    // Получение элемента массива из объекта документа
    // Входные данные: Блок с видео
    // Выходные данные:
    return {
        type: $(a).find(".label.label-default.label-lesson")[0].innerText,
        Items: [a]
    };
}

function showChoiceName(){
    //  Загружает список имен в select в зависимости от выбранного типа
    // console.log("hi");
    // Меняет select в зависимости от выбраного типа
    let type = document.getElementById("l_type");
    const num = type.selectedIndex;
    if (num === 0) {
        return;
    }
    let inHtml = "<option value=\"\">Выберите название</option>";
    for (let i = 0; i < res[num - 1].Items.length; i++){
        const lectName = $(res[num - 1].Items[i]).find("span").html();
        if (inHtml.indexOf(`>${lectName}</option>\n`) === -1){
            inHtml += `<option value="${i}">${lectName}</option>\n`
        }
    }
    $("#l_name").html(inHtml);
}

function showData(){
    // Отображение данных по кнопке
    $(".list-group-item").replaceWith();                        // Удаление блоков лекций
    const type = document.getElementById("l_type");
    const name = document.getElementById("l_name");
    const num_t = type.selectedIndex - 1;                       // Выбранный тип
    const num_n = name.selectedIndex;                           // Выбранное имя
    console.log(num_t, num_n);
    if (num_n === 0 || num_t === -1){
        return;
    }
    const selected_name = name[num_n].label.split('\n').join(' ').trim();
    let listGroup = $(".list-group");
    for (let i = 0; i < res[num_t].Items.length; i++){
        if (getName(res[num_t].Items[i]).indexOf(selected_name) !== -1){
                 listGroup.append(res[num_t].Items[i]);
            }
    }
}

function getName(item){
    // Получение имени из блока
    return item.getElementsByTagName("span")[0].innerText.split('\n').join(' ').trim();
}

function showFilter(){
    // Отображение фильтра на странице
    let node = $(".pagination:first");
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
        "</div>";
    node.replaceWith(strs);
}

getData(20);
$(document).ready(() => {
    showFilter();
    document.querySelector("#l_type").onchange = function(){
        showChoiceName();
    }
    document.querySelector("#b_start").onclick = function(){
        showData()
    }
});
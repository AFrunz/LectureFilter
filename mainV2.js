res = [{
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
        showChoiceType();
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
        // console.log("hi")
        pushItem(items[i]);
    }
    // console.log(res);
}

function pushItem(block){
    // Записывает блоки с видео в массив res
    // Входные данные: блок с лекцией
    // Выходные данные:
    // console.log($(block).find(".label.label-default.label-lesson"));
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
            return;
        }
    }
    let newItem = getItem(block);
    res.push(newItem);
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

function showChoiceType(){
    console.log(res, res.length);
    for (let i = 0; i < res.length; i++){
        $("#l_type").append(`<option value=\\"${i}">${res[i].type}</option>\\n`);
        // console.log("0");
    }
}






function showFilter(){
    // Отображение фильтра на странице
    let node = $(".pagination");
    let strs =  "<div class=\"container-fluid\">\n" +
        "    <label for=\"l_type\"></label>\n" +
        "    <select name=\"l_type\" id=\"l_type\" class=\"select-css\">\n" +
        "        <option value=\"\">Выберите тип</option>\n" +
        "    </select>\n" +
        "    <label for=\"l_name\"></label>\n" +
        "    <select name=\"l_name\" id=\"l_name\" class=\"select-css\">\n" +
        "        <option value=\"\">Выберите название</option>\n" +
        "        </select>\n" +
        "    <button id=\"b_start\" type=\"button\" class=\"btn btn-outline-secondary\">Start</button>\n" +
        "</div>";
    node.replaceWith(strs);
}


getData(3);
showFilter();
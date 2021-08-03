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
    }).then(result => result.forEach(item => item.then(
        result2 => {
            let html = getHTML(result2);     // Получение текста и передача в функцию преобразования в HTML
            parseVideos(html);               // Получение блоков видео со страниц и запись их в res

        }
    )));
}

function getHTML(text){
    // Парсинг текста в HTML
    // Входные данные: Текст
    // Выходные данные: HTML объект
    let dom = new DOMParser();
    return dom.parseFromString(text, "text/html");
}

function parseVideos(htmlCode){
    // console.log(ty);
    let items = $(htmlCode).find(".list-group-item");
    console.log(items);
    for (let i = 0; i < items.length; i++){
        console.log("hi")
        pushItem(items[i]);
    }
    console.log(res);
}

function pushItem(block){
    console.log($(block).find(".label.label-default.label-lesson"));
    if ($(block).find(".label.label-default.label-lesson").length === 0) {
        return;
    }
    alert(block);
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
    return {
        type: $(a).find(".label label-default label-lesson")[0].innerText,
        Items: [a]
    };
}



getData(3)
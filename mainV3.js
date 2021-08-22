class Lesson {
    constructor(domElement) {
        this.domElement = domElement;
        this.name = this._getName();
        this.type = this._getType();
}
    _getName(){
        return $(this.domElement).find("span:first").text().split('\n').join(' ').trim();
    }
    _getType(){
        const type = $(this.domElement).find(".label.label-default.label-lesson:first").text();
        if (type === "") return "Остальное";
        return type;
    }
}

class LessonCollection {
    lessons = [];

    // Добавление в массив
    add(domElement){
        const lesson = new Lesson(domElement);
        this.lessons.push(lesson);
    }
    // Получение эл-в по типу
    // getOfTypes(type){
    //     return this.lessons.filter(lesson => lesson.type === type).map(lesson => lesson.domElement);
    // }
    // Получение эл-в по имени
    // getOfNames(name){
    //     return this.lessons.filter(lesson => lesson.name === name).map(lesson => lesson.domElement);
    // }
    // Получение эл-в по имени и типу
    filter(type, name) {
        return this.lessons.filter(lesson => {
            return lesson.name === name && lesson.type === type;
        })
    }
    // Получение имен
    // getNames(){
    //     const set = new Set();
    //     this.lessons.forEach((lesson) => {
    //         set.add(lesson.name);
    //     })
    //     return Array.from(set);
    // }
    // Получение типов
    getTypes(){
        const set = new Set();
        this.lessons.forEach((lessons) => {
            set.add(lessons.type);
        })
        return Array.from(set);
    }

    getNamesWithType(type){
        const set = new Set();
        this.lessons.forEach((lesson) => {
            if (lesson.type === type) {
                set.add(lesson.name);
            }
        });
        return Array.from(set);
    }

}


async function main() {
    let lessons = new LessonCollection();
    let pages = await getPages(20);
    for (let page of pages){
        let dom = getDom(page);
        let videos = parseVideos(dom);
        for (let video of videos){
            lessons.add(video);
        }
    }
    pushSelectType(lessons);
    return lessons;
}

async function getPages(numberOfPages){
//    Получение HTML кода по ссылкам
//    Входные данные: Количество страниц
//    Выходные данные:

    let baseUrl = window.location.href;
    let urls = []
    for (let i = 1; i <= numberOfPages; i++){                           // Массив ссылок
        urls.push(baseUrl + "&page=" + i);
    }
    let requests = urls.map(url => fetch(url).then(response => response.text()));                        // Массив запросов
    return await Promise.all(requests);
   }


function pushSelectType(lessons){
    const types = lessons.getTypes();
    const typeSelect = $("#l_type");
    types.forEach((type, index) => typeSelect.append(`<option value=\"${index}">${type}</option>\n`));
}



function getDom(text){
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
    return $(htmlCode).find(".list-group-item");
}

function showFilter(){
    // Отображение фильтра на странице
    let node = $(".pagination:first");
    let strs =  "<div class=\"container-fluid\">\n" +
        "    <label for=\"l_type\"></label>\n" +
        "    <select name=\"l_type\" id=\"l_type\" class=\"select-css\">\n" +
        "        <option value=\"\">Выберите тип</option>\n" +
        // "        <option value=\"0\">Остальное</option>\n" +
        "    </select>\n" +
        "    <label for=\"l_name\"></label>\n" +
        "    <select name=\"l_name\" id=\"l_name\" class=\"select-css\">\n" +
        "        <option value=\"\">Выберите название</option>\n" +
        "        </select>\n" +
        "    <button id=\"b_start\" type=\"button\" class=\"btn btn-outline-secondary\">Start</button>\n" +
        "</div>";
    node.replaceWith(strs);
}

function showChoiceName(lessons){
    //  Загружает список имен в select в зависимости от выбранного типа
    // console.log("hi");
    // Меняет select в зависимости от выбраного типа
    let type = $("#l_type");
    console.log(type);
    const num = type[0].selectedIndex;
    console.log(num);
    if (num === 0) {
        return;
    }
    let selectedType = type[0][num].innerText;
    const names = lessons.getNamesWithType(selectedType);
    let inHtml = names.reduce((inHtml, name, index) => {
        return inHtml + `<option value="${index}">${name}</option>\n`;
    }, "<option value=\"\">Выберите название</option>");
    $("#l_name").html(inHtml);
}


function showData(lessons){
    // Отображение данных по кнопке
    $(".list-group-item").replaceWith();                        // Удаление блоков лекций
    const type = $("#l_type");
    const name = $("#l_name");
    const num_t = type[0].selectedIndex;                       // Выбранный тип
    const num_n = name[0].selectedIndex;                           // Выбранное имя
    console.log(num_t, num_n);
    if (num_n === 0 || num_t === 0){
        return;
    }
    console.log(name);
    const selectedName = name[0][num_n].innerText;
    const selectedType = type[0][num_t].innerText;
    let listGroup = $(".list-group");
    const lessonFiltered = lessons.filter(selectedType, selectedName);
    lessonFiltered.forEach((lesson) => listGroup.append(lesson.domElement));
    $(".pagination").replaceWith();
}

let url = window.location.href;
if (url.indexOf("lesson_videos") !== -1){
    let lessons;
    main().then((les) => lessons = les);
    $(document).ready(() => {
        showFilter();
        document.querySelector("#l_type").onchange = function(){
            showChoiceName(lessons);
        }
        document.querySelector("#b_start").onclick = function(){
            showData(lessons);
        }
    })
}


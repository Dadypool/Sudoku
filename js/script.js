function main() {
    // Восстонавливаем сохранённую игру
    let sizes = [2,3,4,5,6,9];
    let total = document.querySelector('.stat');
    for (let i of sizes) {
        let stat = document.querySelector('.stat' + i);
        if (localStorage.getItem('stat' + i)) {
            stat.textContent = localStorage.getItem('stat' + i);
        }
    }
    if (localStorage.getItem('stat')) {
        total.textContent = localStorage.getItem('stat');
    }
    BuildNumpad();
    if (localStorage.getItem('size')) {
        let size = localStorage.getItem('size');
        document.querySelector('.select-size').value = size;
        BuildField();
        ChangeSize();
    } else {
        BuildField();
    }
    if (localStorage.getItem('dif') != null) {
        //alert(localStorage.getItem('dif'));
        let dif = localStorage.getItem('dif');
        document.querySelector('.select-difficulty').value = dif;
    }
    if (localStorage.getItem('field')) {
        let size = parseInt(localStorage.getItem('size'));
        if (!size) size = 9;
        let field_str = localStorage.getItem('field');
        let refield_str = localStorage.getItem('refield');
        let hidefield_str = localStorage.getItem('hidefield');
        let field = [];
        let refield = [];
        let hidefield = [];
        field_str = field_str.split(',');
        refield_str = refield_str.split(',');
        hidefield_str = hidefield_str.split(',');
        for (let i = 0; i < size; i++) {
            let block1 = [];
            let block2 = [];
            let block3 = [];
            for (let j = 0; j < size; j++) {
                block1.push(parseInt(field_str[i*size + j]));
                block2.push(parseInt(refield_str[i*size + j]));
                block3.push(parseInt(hidefield_str[i*size + j]));
            }
            field.push(block1);
            refield.push(block2);
            hidefield.push(block3);
        }
        LoadBlocks(field, refield, hidefield); // Восстонавливаем текущую игру
        if (localStorage.getItem('type')) {
            ChangeType();
        }
        WriteIn(field, refield, hidefield);
    }
};

/* Загружаем ячейки из localStorage*/
function LoadBlocks(field, refield, hidefield) {
    let blocks = document.querySelectorAll('.block');
    let n = 0;
    for (let block of blocks) {
        block.classList.add('block-nonselected');
        block.addEventListener("click", ShowBlocks);
        let i = parseInt(block.id[0])-1;
        let j = parseInt(block.id[1])-1;
        n = hidefield[i][j];
        if (n != -1) {
            if (n == field[i][j] && n != refield[i][j]) {
                block.classList.add('hidden');
                block.classList.add('correct');
                block.textContent = n;
            } else if (n != field[i][j]){
                block.classList.add('hidden');
                block.classList.add('wrong');
                block.textContent = n;
            } else {
                block.textContent = n;
            } 
        } else {
            block.classList.add('hidden');
        }
    }
    // Восстанавливаем спорные блоки
    for (let block of blocks) {
        ShowWrong(block);
        if (localStorage.getItem('note'+block.id)) {
            LoadNote(block);
        }
    }
}
/* */

/* Загрузка записей в блоках */
function LoadNote(selected) {
    let size = document.querySelectorAll('.num-on').length;
    let n = 0;

    // Создаём внутри ячейки блоки с записями
    switch (size) {
        case 2:
            n = 28;
            break;
        case 3:
            n = 25;
            break;
        case 4:
            n = 22;
            break;
        case 5:
            n = 19;
            break;
        case 6:
            n = 16;
            break;
        case 9:
            n = 10;
            break;
    }
    selected.textContent = '';
    selected.style.display = "grid";
    selected.style.gridTemplateColumns = "repeat(" + 3 + ", 1fr)";
    selected.style.gridTemplateRows = "repeat(" + 3 + ", 1fr)";
    for (let i = 0; i < 9; i++) {
        let sb = document.createElement('div');
        sb.style.color = "gray";
        sb.style.fontSize = n+"px";
        selected.appendChild(sb);
    }

    // Добавляем записи
    selected.classList.add('note');
    let sbs = selected.childNodes;
    let notes = localStorage.getItem('note'+selected.id);
    let ind = 0;
    for (let i = 0; i < notes.length; i++) {
        ind = parseInt(notes[i]);
        sbs[ind-1].textContent = ind;
    }
}
/* */

/* Построение игровой сетки */
function BuildField() {
    let size;
    for (let s of document.querySelector('.select-size').childNodes) {
        if(s.selected == true) {
            size = parseInt(s.value);
        }
    }

    // Сначала очищаем сетку, если она уже есть
    let main = document.querySelector('.main-field');
    while (main.firstChild) { // очистка больших полей
        while (main.firstChild.firstChild) { // очистка ячеек
            while (main.firstChild.firstChild.firstChild) { // очистка заметок
                main.firstChild.firstChild.removeChild(main.firstChild.firstChild.lastChild);
            }
            main.firstChild.removeChild(main.firstChild.lastChild);
        }
        main.removeChild(main.lastChild);
    }

    // Затем строим новую сетку
    if (size == 4 || size == 9) {
        let ii = 11;
        let k = Math.floor(Math.sqrt(size));
        main.style.gridTemplateColumns = "repeat(" + k + ", 1fr)";
        main.style.gridTemplateRows = "repeat(" + k + ", 1fr)";
        main.style.border = "1px solid black";
        for (let i = 0; i < size; i++) {
            let jj = 11;
            let field = document.createElement('div');
            field.id = ii; // Задаём id большим полям
            ii++;
            if (ii%10 > k) {
                ii += 10;
                ii -= k;
            }
            field.classList.add('field');
            field.style.gridTemplateColumns = "repeat(" + k + ", 1fr)";
            field.style.gridTemplateRows = "repeat(" + k + ", 1fr)";
            main.appendChild(field);
            for (let j = 0; j < size; j++) {
                let block = document.createElement('div');
                block.id = jj + 10*k*((parseInt(field.id[0]))-1) + k*(parseInt(field.id[1])-1); // Задаём id ячейкам
                jj++;
                if (jj%10 > k) {
                    jj += 10;
                    jj -= k;
                }
                block.classList.add('block');
                field.appendChild(block);
            }
        }
    } else {
        let ii = 11;
        main.style.gridTemplateColumns = "repeat(" + size + ", 1fr)";
        main.style.gridTemplateRows = "repeat(" + size + ", 1fr)";
        main.style.border = "3px solid black";
        for (let i = 0; i < size*size; i++) {
            let block = document.createElement('div');
            block.id = ii;  // Задаём id ячейкам
            ii++;
            if(ii%10 > size) {
                ii += 10;
                ii -= size;
            }
            block.classList.add('block');
            main.appendChild(block);
        }
    }
}
/* */

/* Построение панели цифр */
function BuildNumpad() {
    // Сначала очищаем панель
    let numpad = document.querySelector('.numpad');
    while (numpad.firstChild) {
        numpad.removeChild(numpad.lastChild);
    }

    // Затем строим новую панель
    for (let i = 1; i < 10; i++) {
        let num = document.createElement('div');
        num.value = i;
        num.textContent = i;
        num.classList.add('num');
        num.classList.add('num-on');
        numpad.appendChild(num);
    } 
}
/* */

/* Изменение панели цифр */
function ChangeNumpad(size) {
    let nums = document.querySelectorAll('.num');
    let type = document.querySelector('.type');
    let abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    // Включаем конпки цифр до размера сетки
    for (let i = 0; i < size; i++) {
        if (type.innerHTML == 'ABC') {
            nums[i].textContent = i+1;
        } else {
            nums[i].textContent = abc[i];
        }
        nums[i].classList.remove('num-off');
        nums[i].classList.add('num-on');
    }
    // Остальные кнопки выключаем
    for (let i = size; i < 9; i++) {
        nums[i].textContent = '';
        nums[i].classList.remove('num-on');
        nums[i].classList.add('num-off');
    }
}
/* */

/* Меняем тип значений (алфавит или цифры) */
function ChangeType() {
    let type = document.querySelector('.type');
    let nums = document.querySelectorAll('.num-on');
    let blocks = document.querySelectorAll('.block');
    let abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    if (type.innerHTML == 'ABC') { // Если переключаем с цифр на алфавит
        localStorage.setItem('type', 1); // Сохраняем алфавитный тип
        type.textContent = '123';
        // Меняем кнопки
        for (let i = 0; i < nums.length; i++) {
            nums[i].textContent = abc[i];
        }
        // Меняем ячейки
        for (let block of blocks) {
            if (block.classList.contains('note')) {
                let sbs = block.childNodes;
                for (let sb of sbs) {
                    if (sb.textContent != '') {
                        let i = parseInt(sb.textContent);
                        sb.textContent = abc[i-1];
                    }
                }
            }
            else if (block.textContent != '') {
                let i = parseInt(block.textContent);
                block.textContent = abc[i-1];
            }
        }
    } else { // Если переключаем с алфавита на цифры
        localStorage.removeItem('type');
        type.textContent = 'ABC';
        // Меняем кнопки
        for (let i = 0; i < nums.length; i++) {
            nums[i].textContent = i+1;
        }
        // Меняем ячейки
        for (let block of blocks) {
            if (block.classList.contains('note')) {
                let sbs = block.childNodes;
                for (let sb of sbs) {
                    if (sb.textContent != '') {
                        let i = abc.indexOf(sb.textContent);
                        sb.textContent = i+1;
                    }
                }
            }
            else if (block.textContent != '') {
                let i = abc.indexOf(block.textContent);
                block.textContent = i+1;
            }
        }
    }
}
/* */

/* Изменение размера судоку */
function ChangeSize() {
    let select = document.querySelector('.select-size');
    let selected = select.selectedIndex;
    let size = parseInt(select.value);
    if (document.querySelector('.hidden')) {
        let c = confirm('Вы уверены что хотите изменить размер сетки? Прогресс этой игры будет удалён');
        if (!c){
            select.options[selected].selected = true;
            return;
        } 
    }
    
    // Удаляем информацию о прошлой игре
    if (document.querySelector('.hidden')) {
        let old_blocks = document.querySelectorAll('.block');
        localStorage.removeItem('field');
        localStorage.removeItem('refield');
        localStorage.removeItem('hidefield');
        for (let block of old_blocks) {
            if (block.classList.contains('note')) {
                localStorage.removeItem('note'+block.id);
            }
        }
    }

    // Меняем число сложностей
    let difEl = document.querySelector('.select-difficulty');
    let ds = difEl.options;
    let prevSize = document.querySelectorAll('.num-on').length;

    let n = 0;
    switch (size) {
        case 2:
            n = 1;
            break;
        case 3:
            n = 2;
            break;
        case 4:
            n = 2;
            break;
        case 5:
            n = 3;
            break;
        case 6:
            n = 4;
            break;
        case 9:
            n = 5;
            break;
    }

    if (prevSize > size) {
        while(ds.length > n) {
            ds[ds.length-1].remove();
        }
    } else {
        while(ds.length < n) {
            let strD = "";
            switch (ds.length) {
                case 1:
                    strD = "Легкая";
                    break;
                case 2:
                    strD = "Нормальная";
                    break;
                case 3:
                    strD = "Сложная";
                    break;
                case 4:
                    strD = "Über";
                    break;
            }
            let option = new Option(strD, ds.length);
            difEl.append(option);
            ds = difEl.options;
        }
    }
    if (ds.length > 2) {
        ds[2].selected = true;
        if(document.querySelector('.hidden')) localStorage.setItem('dif', 2);
    } else {
        ds[ds.length-1].selected = true;
        if(document.querySelector('.hidden')) localStorage.setItem('dif', ds.length-1);
    }

    // Меняем сетку игры
    BuildField();

    // Меняем размер цифр
    let fs;
    let blocks = document.querySelectorAll('.block');
    switch (size) {
        case 2:
            fs = 150;
            break;
        case 3:
            fs = 100;
            break;
        case 4:
            fs = 60;
            break;
        case 5:
            fs = 55;
            break;
        case 6:
            fs = 50;
            break;
        case 9:
            fs = 33;
            break;
    }
    for (let block of blocks) {
        block.style.fontSize = fs + "px";
    }

    // Меняем панель с цифрами
    ChangeNumpad(size);

    document.querySelectorAll('.tool')[1].classList.remove('tool-on'); // Убираем включенную кнопку заметок

    localStorage.setItem('size', size); // Сохраняем информацию о размере
}
/* */

/* Изменение сложности */
function ChangeDiff() {
    //alert(document.querySelector('.select-difficulty').value);
    if (!document.querySelector('.hidden')) localStorage.setItem('dif', document.querySelector('.select-difficulty').value);
}
/* */

/* Подсвечивание блоков */
function ShowBlocks() {
    let size = document.querySelectorAll('.num-on').length;
    let blocks = document.querySelectorAll('.block');

    // При потворном нажатии на ту же клетку, подсветка убирается
    if (this.classList.contains('block-selected')) {
        this.classList.remove('block-selected');
        for (let block of blocks) {
            block.classList.remove('block-line-selected');
            block.classList.remove('block-equal-selected');
        }
        return ;
    }

    for (let block of blocks) {
        // Удаляем помеченные блоки с прошлым блоком
        if (block.classList.contains('block-selected')) {
            block.classList.remove('block-selected');
            block.classList.add('block-nonselected');
        }
        if (block.classList.contains('block-line-selected')) {
            block.classList.remove('block-line-selected');
        }
        if (block.classList.contains('block-equal-selected')) {
            block.classList.remove('block-equal-selected');
        }

        // Добавляем новые помеченные блоки
        if (block.id[0] == this.id[0] || block.id[1] == this.id[1] || ((size == 4 || size == 9) && (block.parentNode.id == this.parentNode.id))) {
            block.classList.add('block-line-selected');
        }

        if (!this.classList.contains('note')) {
            if (!block.classList.contains('note') && (this.textContent != '' && (block.textContent == this.textContent))) {
                block.classList.add('block-equal-selected');
            }
        }
    }
    this.classList.add('block-selected');
    this.classList.remove('block-nonselected');
}
/* */

/* Подствечивание спорных блоков */
function ShowWrong(selected) {
    if (selected.classList.contains('note')) return;
    let blocks = document.querySelectorAll('.block');
    let size = document.querySelectorAll('.num-on').length;
    if (selected.textContent == '') return;
    for (let block of blocks) {
        if (block != selected) {
            if (block.id[0] == selected.id[0] || block.id[1] == selected.id[1] || ((size == 4 || size == 9) && (block.parentNode.id == selected.parentNode.id))) {
                if (block.textContent == selected.textContent && !block.classList.contains('note')) {
                    block.classList.add('block-line-wrong');
                    selected.classList.add('block-line-wrong');

                }
            }
        }
    }
}
/* */

/* Убираем подсвечивание спорных блоков */
function HideWrong() {
    let selected = document.querySelector('.block-selected');
    let blocks = document.querySelectorAll('.block');

    selected.classList.remove('correct');
    selected.classList.remove('wrong');
    selected.classList.remove('block-line-wrong');
    for (let block of blocks) {
        if (block.classList.contains('block-line-selected') && block.classList.contains('block-equal-selected') && block != selected) {
            block.classList.remove('block-line-wrong');
            for (let nblock of blocks) {
                if (block != nblock && block.textContent == nblock.textContent && (nblock.classList.contains('wrong')) && (nblock != selected) && ((nblock.id[0] == block.id[0]) || (nblock.id[1] == block.id[1]) || (nblock.parentNode.id == block.parentNode.id))) {
                    block.classList.add('block-line-wrong');
                }
            }
        }
        block.classList.remove('block-equal-selected');
    }

    // Производим повторную проверку
    for (let block of blocks) {
        if (block.classList.contains('wrong')) {
            for (let nblock of blocks) {
                if ((nblock.id[0] == block.id[0] || block.id[1] == nblock.id[1] || block.parentNode.id == nblock.parentNode.id) && block != nblock && block.textContent == nblock.textContent) {
                    block.classList.add('block-line-wrong');
                    nblock.classList.add('block-line-wrong');
                }
            }
        }
    }
}
/* */

/* Определение сложности */
function Difficulty() {
    /* От 0 (детская) до 4 (Убер) */
    let diff = 0;
    for (let d of document.querySelector('.select-difficulty').childNodes) {
        if(d.selected == true) {
            diff = parseInt(d.value);
        }
    }
    return diff;
}
/* */

/* Генерация поля */
function GenerateField() {
    if (document.querySelector('.hidden')) { // Если есть текущая игра
        let c = confirm('Вы уверены, что хотите начать новую игру? Прогресс этой игры будет удалён');
        if (!c) return;
    }
    document.querySelectorAll('.tool')[1].classList.remove('tool-on');
    let size = document.querySelectorAll('.num-on').length;

    // Создаём новую матрицу
    let field = [];
    for (let i = 1; i < size + 1; i++) {
        let block = [];
        for (let j = 1; j < size + 1; j++) {
            block.push(j);
        }
        field.push(block);
    }

    // Перемешиваем матрицу
    field = Shift(field, size);
    let mix = ['SwapRows(field, size)', 'SwapColumns(field, size)', 'Transpos(field, size)'];
    if (size == 4 || size == 9) {
        mix.push('SwapBlocksRow(field, size)');
        mix.push('SwapBlocksColumn(field, size)');
    }
    // 25-30 раз вызываем рандомную функцию перетасовки
    for (let i = 0; i < random(25, 30); i++) {
        let n = random(0, mix.length-1);
        field = eval(mix[n]);
    }

    let blocks = document.querySelectorAll('.block');
    let n = 0;
    let type = document.querySelector('.type').textContent;
    let abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

    // очищаем классы ячеек, если игра того же размера
    for (let block of blocks) {
        while(block.firstChild) {
            block.removeChild(block.lastChild);
        }
        block.style.display = "inline";
        block.textContent = '';
        block.classList.remove('note');
        block.classList.remove('correct');
        block.classList.remove('wrong');
        block.classList.remove('hidden');
        block.classList.remove('block-selected');
        block.classList.remove('block-line-selected');
        block.classList.remove('block-line-wrong');
        block.classList.remove('block-equal-selected');
        n = field[parseInt(block.id[0])-1][parseInt(block.id[1])-1];

        // Заполняем ячейки
        if (type == 'ABC') {
            block.textContent = n;
        } else {
            block.textContent = abc[n-1]
        }
    }
    let diff = Difficulty();

    // Переходим к функции скрытия ячеек
    Hide(field, diff);
}
/* */

/* Прячем некоторые ячейки */
function Hide(field, d) {
    let size = field.length;
    let empty, n = 0, k, ii, jj;

    // В зависимости от сложности и размера указываем определенное число ячеек, которое надо скрыть
    switch (d) {
        case 0: 
            empty = 0;
            switch(size) {
                case 9:
                    n = random(33,37);
                    break;
                case 6:
                    n = random(14,16);
                    break;
                case 5:
                    n = random(9,11);
                    break;
                case 4:
                    empty = 1;
                    n = random(5,6);
                    break;
                case 3:
                    empty = 2;
                    n = 3;
                    break;
                case 2:
                    empty = 2;
                    n = 3;
                    break;
            }
            break;
        case 1:
            empty = 0;
            switch(size) {
                case 9:
                    n = random(40,43);
                    break;
                case 6:
                    n = random(17,19);
                    break;
                case 5:
                    empty = 1;
                    n = random(12,13);
                    break;
                case 4:
                    empty = 2;
                    n = random(8,9);
                    break;
                case 3:
                    empty = 3;
                    n = 6;
                    break;
            }
            break;
        case 2:
            empty = 1;
            switch(size) {
                case 9:
                    n = random(48,52);
                    break;
                case 6:
                    n = random(21,23);
                    break;
                case 5:
                    empty = 2;
                    n = random(14,16);
                    break;
            }
            break;
        case 3: 
            empty = 2;
            switch(size) {
                case 9:
                    n = random(54,56);
                    break;
                case 6:
                    n = random(23,25);
                    break;
            }
            break;
        case 4: 
            empty = 3;
            n = random(57,58);
            break;
    }

    // Создаём новую матрицу со скрытыми ячейками
    let refield = [];
    for (let i = 0; i < size; i++) {
        let block = [];
        for (let j = 0; j < size; j++) {
            block.push(field[i][j]);
        }
        refield.push(block);
    }

    for (let l = 0; l < n; l++) {
        let bad = 0;
        do {
            ii = random(0, size-1);
            jj = random(0, size-1);
        }
        while (refield[ii][jj] == -1);

        // Проверка на пустой столбец
        k = 0;
        for (let i = 0; i < size; i++) {
            if (refield[i][jj] != -1) {
                break;
            }
            k++;
        }
        if (k == size-1) {
            empty--;
        }
        if (empty < 0) {
            bad++;
        }

        // Проверка на пустой ряд
        k = 0;
        for (let j = 0; j < size; j++) {
            if (refield[ii][j] != -1) {
                break;
            }
            k++;
        }
        if (k == size-1) {
            empty--;
        }
        if (empty < 0) {
            bad++;
        }

        let ki1 = 0;
        let ki2 = 0;
        let kj1 = 0;
        let kj2 = 0;
        // Проверка на пустое поле для 4х4 и 9х9
        if (size == 9) {
            if (ii < 3) {
                ki1 = 0;
                ki2 = 3;
            } else if (ii >= 3 && ii < 6) {
                ki1 = 3;
                ki2 = 6;
            } else {
                ki1 = 6;
                ki2 = 9;
            }

            if (jj < 3) {
                kj1 = 0;
                kj2 = 3;
            } else if (jj >= 3 && jj < 6) {
                kj1 = 3;
                kj2 = 6;
            } else {
                kj1 = 6;
                kj2 = 9;
            }

            k = 0;
            for (let i = ki1; i < ki2; i++) {
                for (let j = kj1; j < kj2; j++) {
                    if (refield[i][j] != -1) {
                        break;
                    }
                    k++;
                }
            }
            if (k == 8) {
                empty--;
            }
        } else if (size == 4) {
            if (ii < 2) {
                ki1 = 0;
                ki2 = 2;
            } else if (ii >= 2 && ii < 4) {
                ki1 = 2;
                ki2 = 4;
            }

            if (jj < 2) {
                kj1 = 0;
                kj2 = 2;
            } else if (jj >= 2 && jj < 4) {
                kj1 = 2;
                kj2 = 4;
            }

            k = 0;
            for (let i = ki1; i < ki2; i++) {
                for (let j = kj1; j < kj2; j++) {
                    if (refield[i][j] != -1) {
                        break;
                    }
                    k++;
                }
            }
            if (k == 8) {
                empty--;
            }
        }

        // Скрытые ячейки в матрице будут -1
        if (bad > 0) {
            empty = 0;
            l--;
        }
        else {
            refield[ii][jj] = -1;
        }
    }

    // Провеяем на наличие решения
    while (ShowMoves(refield) < 2) {
        //alert('0 moves');
        let i, j;

        do {
            i = random(0, size-1);
            j = random(0, size-1);
        } while (refield[i][j] != -1);

        refield[i][j] = field[i][j];
    }

    // Сохраняем информацию о ячейках и сложности
    localStorage.setItem('field',field);
    localStorage.setItem('refield', refield);
    localStorage.setItem('hidefield',refield);
    localStorage.setItem('dif', d);
    
    // Прячем сами ячейки
    HideBlocks(refield);

    // Запускаем основную функцию записи
    WriteIn(field, refield, refield);
}
/* */

/* Делаем скрытые ячейки пустыми*/
function HideBlocks(refield) {
    let blocks = document.querySelectorAll('.block');
    for (let block of blocks) {
        block.classList.add('block-nonselected');
        block.addEventListener("click", ShowBlocks);
        if (refield[parseInt(block.id[0])-1][parseInt(block.id[1])-1] == -1) {
            block.textContent = '';
            block.classList.add('hidden');
        }
    }
}
/* */

/* Поиск возможных ходов */
function ShowMoves(hidefield=null) {
    //alert();
    let moves = 0;
    let size = parseInt(localStorage.getItem('size'));
    if (!size) size = 9;

    if (!hidefield) {
        hidefield = [];
        if (localStorage.getItem('hidefield')) {
            let hidefield_str = localStorage.getItem('hidefield');
            hidefield_str = hidefield_str.split(',');
            for (let i = 0; i < size; i++) {
                let block = [];
                for (let j = 0; j < size; j++) {
                    block.push(parseInt(hidefield_str[i*size + j]));
                }
                hidefield.push(block);
            }
        } else {
            alert('Для начала начните игру');
            return;
        }
    }
    //alert(hidefield);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            //alert(moves);
            if (hidefield[i][j] == -1) {
                let ns = [];
                for (let k = 1; k <= size; k++) ns.push(k);
    
                for (let k = 0; k < size; k++) {
                    if(hidefield[k][j] != -1) {
                        let index = ns.indexOf(hidefield[k][j]);
                        //alert(index);
                        if (index != -1) ns.splice(index, 1);
                    }
    
                    if (hidefield[i][k] != -1) {
                        let index = ns.indexOf(hidefield[i][k]);
                        if (index != -1) ns.splice(index, 1);
                    }
                }

                if (size == 4 || size == 9) {
                    let sqr = Math.sqrt(size);
                    let ai = Math.floor(i/sqr);
                    let aj = Math.floor(j/sqr);

                    for (let bi = ai*sqr; bi < (ai+1)*sqr; bi++) {
                        for (let bj = aj*sqr; bj < (aj+1)*sqr; bj++) {
                            if(hidefield[bi][bj] != -1) {
                                let index = ns.indexOf(hidefield[bi][bj]);
                                //alert(index);
                                if (index != -1) ns.splice(index, 1);
                            }
                        }
                    }
                }

                if (ns.length == 1) {
                    moves++;
                    continue;
                } else if (ns.length == 0) {
                    console.log('Error 0 moves in this field:'+i+''+j);
                    continue;
                }

                let k = 0;
                for (let n of ns) {
                    //alert(ns+": "+n);
                    k = 0;
                    for (let ai = 0; ai < size; ai++) {
                        if (ai != i) {
                            for (let aj = 0; aj < size; aj++) {
                                if (aj != j) {
                                    if (hidefield[ai][aj] == n) k++;
                                }
                            }
                        }
                    }
                    if (k == (size-1)) {
                        moves++;
                        break;
                    }
                }
            }
        }
    }

    if (document.querySelectorAll('.hidden').length) {
        if (moves) {
            alert('Сейчас на поле ' + moves + ' всевозможных ходов');
        } else {
            alert('Ой-ой, кажется, сейчас на поле ' + moves + ' всевозможных ходов... Время включать рандом');
        }
    } else {
        return moves;
    }
}
/* */

/* Запись в ячейку (Основная функция игры) */
function WriteIn(field, refield, hidefield) {
    let note = 0;
    let tools = document.querySelectorAll('.tool');
    let size = document.querySelectorAll('.num-on').length;
    let blocks = document.querySelectorAll('.block');
    let abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    let stack = [];
    let command = "";

    // Активация инструментов
    for (let i = 0; i < 4; i++) {
        tools[i].onclick = function() {
            let type = document.querySelector('.type').textContent;
            switch (i) {
                case 0: // Назад
                    //alert(stack[stack.length-1]);
                    eval(stack.pop());
                    break;
                case 1: // Заметки
                    tools[i].classList.toggle('tool-on');
                    if (note) note = 0;
                    else note =  1;
                    break;
                case 2: // Ластик
                    Clean(hidefield, stack);
                    break;
                case 3: // Подсказка
                    Hint(field, refield, hidefield);
                    break;
            }
        }
    }

    // Ввод ячйеки при нажатии на кнопку
    let nums = document.querySelectorAll('.num-on');
    for (let num of nums) {
        num.onclick = function () {
            let selected = document.querySelector('.block-selected');
            let ind = GetBlockInd();
            let bl = "blocks["+ind+"]";
            let type = document.querySelector('.type').textContent;
            command = "";
            if (!note) {
                // Удаляем записи в блоке при записи цифры в блок
                if (selected.classList.contains('note')) {
                    while (selected.firstChild) {
                        selected.removeChild(selected.lastChild);
                    }
                    selected.style.display = 'inline';
                    selected.classList.remove('note');

                    /* Создаём обратные комманды для стэка */
                    command = "let n = 0; switch (size) {case 2:n=28;break;case 3:n = 25;break;case 4:n = 22;break;case 5:n = 19;break;case 6:n = 16;break;case 9:n = 10;break;}";
                    command += bl+".textContent = '';";
                    command += "hidefield[parseInt("+bl+".id[0])-1][parseInt("+bl+".id[1])-1] = -1;";
                    command += "localStorage.setItem('hidefield', hidefield);";
                    command += bl+".style.display = 'grid';";
                    command += bl+".style.gridTemplateColumns = 'repeat(' + 3 + ', 1fr)';";
                    command += bl+".style.gridTemplateRows = 'repeat(' + 3 + ', 1fr)';";
                    command += "localStorage.setItem('note'+"+bl+".id, '"+localStorage.getItem('note'+selected.id)+"');";
                    command += "for (let i = 0; i < 9; i++) { let sb = document.createElement('div'); sb.style.color = 'gray'; sb.style.fontSize = n+'px';";
                    command += "if ('" + localStorage.getItem('note' + selected.id) + "'.includes((i+1).toString())) {sb.textContent = i+1; ";
                    command += "localStorage.setItem('note'+"+bl+".id, (i+1) + localStorage.getItem('note'+"+bl+".id));} ";
                    command += bl+".appendChild(sb);}";
                    command += bl+".classList.add('note');";
                    /* */

                    localStorage.removeItem('note' + selected.id);
                }

                // Убираем цифру, если нажимаем точно такую же конпку цифры
                if ((selected.innerHTML == num.innerHTML) && (selected.classList.contains('hidden'))) {
                    /* Обратные команды для стэка */
                    let str = "";
                    str += "if (!"+bl+".classList.contains('block-selected')) { "+bl+".click(); }";
                    str += "if ('"+selected.textContent+"' == '') {" +bl+".textContent='"+selected.textContent+"'; }";
                    str += "else if (type == 'ABC' && !Number.isInteger(parseInt('"+selected.textContent+"'))) {"+bl+".textContent='"+(abc.indexOf(selected.textContent)+1)+"';}";
                    str += "else if (type == '123' && Number.isInteger(parseInt('"+selected.textContent+"'))){"+bl+".textContent='"+abc[parseInt(selected.textContent)-1]+"'; }";
                    str += "else {" +bl+".textContent='"+selected.textContent+"'; }";
                    str += "HideWrong();";
                    if (selected.classList.contains('wrong')) {
                        str += bl+".classList.remove('correct');";
                        str += bl+".classList.add('wrong');";
                    } else if (selected.classList.contains('correct')){
                        str += bl+".classList.remove('wrong');";
                        str += bl+".classList.add('correct');";
                    } else {
                        str += bl+".classList.remove('wrong');";
                        str += bl+".classList.remove('correct');";
                    }
                    str += "ShowWrong("+bl+");";
                    if (selected.textContent == '') {
                        str += "hidefield[parseInt("+bl+".id[0])-1][parseInt("+bl+".id[1])-1]=-1;";
                    }
                    else if (type == 'ABC') {
                        str += "hidefield[parseInt("+bl+".id[0])-1][parseInt("+bl+".id[1])-1]="+selected.textContent+";";
                    } else {
                        str += "hidefield[parseInt("+bl+".id[0])-1][parseInt("+bl+".id[1])-1]="+(abc.indexOf(selected.textContent)+1)+";";
                    }
                    str += "localStorage.setItem('hidefield', hidefield);";
                    str += bl+".click();";
                    str += bl+".click();";
                    command = str + command;
                    stack.push(command);
                    /* */

                    selected.textContent = '';
                    HideWrong();
                    hidefield[parseInt(selected.id[0])-1][parseInt(selected.id[1])-1] = -1;
                    localStorage.setItem('hidefield', hidefield);
                }
                // Записываем цифру в блок, только если он предназначен для записи
                else if (selected.classList.contains('hidden')) {
                    /* Обратные команды для стэка */
                    let str = "";
                    str += "if (!"+bl+".classList.contains('block-selected')) { "+bl+".click(); }";
                    str += "if ('"+selected.textContent+"' == '') {" +bl+".textContent='"+selected.textContent+"'; }";
                    str += "else if (type == 'ABC' && !Number.isInteger(parseInt('"+selected.textContent+"'))) {"+bl+".textContent='"+(abc.indexOf(selected.textContent)+1)+"';}";
                    str += "else if (type == '123' && Number.isInteger(parseInt('"+selected.textContent+"'))){"+bl+".textContent='"+abc[parseInt(selected.textContent)-1]+"'; }";
                    str += "else {" +bl+".textContent='"+selected.textContent+"'; }";
                    str += "HideWrong();";
                    if (selected.classList.contains('wrong')) {
                        str += bl+".classList.remove('correct');";
                        str += bl+".classList.add('wrong');";
                    } else if (selected.classList.contains('correct')){
                        str += bl+".classList.remove('wrong');";
                        str += bl+".classList.add('correct');";
                    } else {
                        str += bl+".classList.remove('wrong');";
                        str += bl+".classList.remove('correct');";
                    }
                    str += "ShowWrong("+bl+");";
                    if (selected.textContent == '') {
                        str += "hidefield[parseInt("+bl+".id[0])-1][parseInt("+bl+".id[1])-1]=-1;";
                    }
                    else if (type == 'ABC') {
                        str += "hidefield[parseInt("+bl+".id[0])-1][parseInt("+bl+".id[1])-1]="+selected.textContent+";";
                    } else {
                        str += "hidefield[parseInt("+bl+".id[0])-1][parseInt("+bl+".id[1])-1]="+(abc.indexOf(selected.textContent)+1)+";";
                    }
                    str += "localStorage.setItem('hidefield', hidefield);";
                    str += bl+".click();";
                    str += bl+".click();";
                    /* */
                    
                    HideWrong();
                    selected.textContent = num.textContent;
                    let n = selected.textContent;
                    if (type == '123') {
                        n = abc.indexOf(n) + 1;
                    }
                    if (parseInt(n) == field[parseInt(selected.id[0])-1][parseInt(selected.id[1])-1]) {
                        selected.classList.add('correct');
                    } else {
                        selected.classList.add('wrong');
                    }
                    selected.click();selected.click();
                    ShowWrong(selected);

                    for (let block of blocks) {
                        if (block.classList.contains('block-line-selected') || ((size == 9 || size == 4) && block.parentNode.id == selected.parentNode.id)) {
                            if (block.classList.contains('note')) {
                                let sbs = block.childNodes;
                                for (let i = 0; i < 9; i++) {
                                    if (sbs[i].textContent == n) {
                                        let index = GetBlockInd(block);
                                        str += "blocks["+index+"].childNodes["+i+"].textContent = '"+n+"';";
                                        sbs[i].textContent = '';
                                        str += "localStorage.setItem('note"+block.id+"', localStorage.getItem('note"+block.id+"')+"+(i+1)+");";
                                        localStorage.setItem('note'+block.id, localStorage.getItem('note'+block.id).replace((i+1).toString(), ''));
                                    }
                                }
                            }
                        }
                    }

                    hidefield[parseInt(selected.id[0])-1][parseInt(selected.id[1])-1] = parseInt(n);
                    localStorage.setItem('hidefield', hidefield);
                    command = str + command;
                    stack.push(command);

                    CheckWin(field, hidefield, stack);
                }
            }
            // Создаём заметки
            else if (selected.classList.contains('hidden')){
                // Если ячейка не имеет заметок
                if (!selected.classList.contains('note')) {
                    let size = document.querySelectorAll('.num-on').length;
                    let n = 0;
                    switch (size) {
                        case 2:
                            n = 28;
                            break;
                        case 3:
                            n = 25;
                            break;
                        case 4:
                            n = 22;
                            break;
                        case 5:
                            n = 19;
                            break;
                        case 6:
                            n = 16;
                            break;
                        case 9:
                            n = 10;
                            break;
                    }

                    /* Обратные команды для стэка */
                    command += "if (!"+bl+".classList.contains('block-selected')) { "+bl+".click();}";
                    command += "while ("+bl+".firstChild) { "+bl+".removeChild("+bl+".lastChild); }";
                    command += bl+".style.display='inline';";
                    command += bl+".classList.remove('note');";
                    command += "if ('"+selected.textContent+"' == '') {" +bl+".textContent='"+selected.textContent+"'; }";
                    command += "else if (type == 'ABC' && !Number.isInteger(parseInt('"+selected.textContent+"'))) {"+bl+".textContent='"+(abc.indexOf(selected.textContent)+1)+"';}";
                    command += "else if (type == '123' && Number.isInteger(parseInt('"+selected.textContent+"'))){"+bl+".textContent='"+abc[parseInt(selected.textContent)-1]+"'; }";
                    command += "else {" +bl+".textContent='"+selected.textContent+"'; }";
                    if (selected.classList.contains('wrong')) {
                        command += bl+".classList.remove('correct');";
                        command += bl+".classList.add('wrong');";
                    } else if (selected.classList.contains('correct')){
                        command += bl+".classList.remove('wrong');";
                        command += bl+".classList.add('correct');";
                    } else {
                        command += bl+".classList.remove('wrong');";
                        command += bl+".classList.remove('correct');";
                    }
                    command += "ShowWrong("+bl+");";
                    if (selected.textContent == '') {
                        command += "hidefield[parseInt("+bl+".id[0])-1][parseInt("+bl+".id[1])-1]=-1;";
                    }
                    else if (type == 'ABC') {
                        command += "hidefield[parseInt("+bl+".id[0])-1][parseInt("+bl+".id[1])-1]="+selected.textContent+";";
                    } else {
                        command += "hidefield[parseInt("+bl+".id[0])-1][parseInt("+bl+".id[1])-1]="+(abc.indexOf(selected.textContent)+1)+";";
                    }
                    command += "localStorage.setItem('hidefield', hidefield);";
                    command += "localStorage.removeItem('note"+selected.id+"');";
                    command += bl+".click();";
                    command += bl+".click();";
                    /* */

                    selected.textContent = '';
                    hidefield[parseInt(selected.id[0])-1][parseInt(selected.id[1])-1] = -1;
                    localStorage.setItem('hidefield', hidefield);
                    selected.style.display = "grid";
                    selected.style.gridTemplateColumns = "repeat(" + 3 + ", 1fr)";
                    selected.style.gridTemplateRows = "repeat(" + 3 + ", 1fr)";
                    for (let i = 0; i < 9; i++) {
                        let sb = document.createElement('div');
                        sb.style.color = "gray";
                        sb.style.fontSize = n+"px";
                        selected.appendChild(sb);
                    }
                    selected.classList.add('note');
                    localStorage.setItem('note'+selected.id, ""); // Сохраняем заметки для определенной заметки
                }

                HideWrong();
                
                let sbs = selected.childNodes;
                let ind = parseInt(num.innerHTML);
                let str = "if (!"+bl+".classList.contains('block-selected')) { "+bl+".click();}";
                str += "let sbs = "+bl+".childNodes;";
                if (type == 'ABC') {
                    if (sbs[ind-1].textContent == '') {
                        str += "sbs["+(ind-1)+"].textContent = '';";
                        str += "localStorage.setItem('note"+selected.id+"', localStorage.getItem('note"+selected.id+"').replace("+ind+", ''));";
                        sbs[ind-1].textContent = ind;
                        localStorage.setItem('note'+selected.id, localStorage.getItem('note'+selected.id)+ind);
                    } else {
                        str += "sbs["+(ind-1)+"].textContent = '"+sbs[ind-1].textContent+"';";
                        str += "localStorage.setItem('note"+selected.id+"', localStorage.getItem(''note"+selected.id+"')+"+ind+");";
                        sbs[ind-1].textContent = '';
                        localStorage.setItem('note'+selected.id, localStorage.getItem('note'+selected.id).replace(ind, ''));
                    }
                } else {
                    ind = abc.indexOf(num.innerHTML);
                    if(sbs[ind].textContent == abc[ind]) {
                        str += "sbs["+ind+"].textContent = '"+sbs[ind].textContent+"';";
                        str += "localStorage.setItem('note"+selected.id+"', localStorage.getItem(''note"+selected.id+"')+"+(ind+1)+");";
                        sbs[ind].textContent = '';
                        localStorage.setItem('note'+selected.id, localStorage.getItem('note'+selected.id).replace((ind+1), ''));
                    } else {
                        str += "sbs["+ind+"].textContent = '';";
                        str += "localStorage.setItem('note"+selected.id+"', localStorage.getItem('note"+selected.id+"').replace("+(ind+1)+", ''));";
                        sbs[ind].textContent = abc[ind];
                        localStorage.setItem('note'+selected.id, localStorage.getItem('note'+selected.id)+(ind+1));
                    }
                }
                command = str + command;
                stack.push(command);
            }
        }
    } 
}
/* */

/* Если все ячейки заполнены правильно, то победа */
function CheckWin(field, hidefield, stack) {
    let right = 0;
    let blocks = document.querySelectorAll('.block');
    let size = document.querySelectorAll('.num-on').length;
    // Сверяем полную матрицу и матрицу пользователя
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (field[i][j] !=  hidefield[i][j]) break;
            right++;
        }
    }
    if (right == (size*size)) { // если матрицы одинаковые, то победа
        let stat = document.querySelector('.stat'+size);
        let total = document.querySelector('.stat');
        localStorage.setItem('stat' + size, parseInt(stat.textContent) + 1);
        localStorage.setItem('stat', parseInt(total.textContent) + 1);
        stat.textContent = parseInt(stat.textContent) + 1;
        total.textContent = parseInt(total.textContent) + 1;
        localStorage.removeItem('field');
        localStorage.removeItem('refield');
        localStorage.removeItem('hidefield');
        for (let block of document.querySelectorAll('.block')) {
            localStorage.removeItem('note'+block.id);
        }
        stack.splice(0, stack.length); // Очищаем стэк
        alert("Поздравляем, вы решили судоку!!!");
        for (let block of blocks) {
            block.classList.remove('hidden');
        }
    }
}
/* */

/* Получаем индекс ячейки */
function GetBlockInd(selected=null) {
    // Нужно для обратных команд
    let ind = 0;
    let size = document.querySelectorAll('.num-on').length;
    if (selected == null) selected = document.querySelector('.block-selected');
    if (size == 9 || size == 4) {
        let n = Math.sqrt(size);
        let i = 0;
        for (i = 0; i < selected.parentNode.childNodes.length; i++) {
            if (selected.parentNode.childNodes[i].id == selected.id) {
                break;
            }
        }
        ind = ((parseInt(selected.parentNode.id[0])-1)*n + (parseInt(selected.parentNode.id[1]-1)))*size + i;
    } else {
        ind = (parseInt(selected.id[0])-1)*size + (parseInt(selected.id[1])-1);
    }

    return ind;
}
/* */

/* Ластик */
function Clean(field, stack) {
    let selected = document.querySelector('.block-selected');
    let note = selected.classList.contains('note');
    let ind = GetBlockInd();
    let str = "";
    let abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    let bl = "blocks["+ind+"]";
    if (note) { // Если в ячейке заметки, то очищаем их
        let sbs = selected.childNodes;
        for (let i = 0;i < sbs.length; i++) {
            if (sbs[i].textContent != '') {
                let n = sbs[i].textContent;
                str += "if (type == 'ABC' && !Number.isInteger(parseInt('"+n+"'))) {"+bl+".childNodes["+i+"].textContent='"+(abc.indexOf(n)+1)+"';}  else if (type == '123' && Number.isInteger(parseInt('"+n+"'))){"+bl+".childNodes["+i+"].textContent='"+abc[parseInt(n)-1]+"'; } else {" +bl+".childNodes["+i+"].textContent='"+n+"'; }";
                sbs[i].textContent = '';
            }
        }
        str += "if (!"+bl+".classList.contains('block-selected')) { "+bl+".click();}";
        str += "localStorage.setItem('note'+blocks["+ind+"].id,"+localStorage.getItem('note'+selected.id)+");"
        stack.push(str);
        localStorage.setItem('note'+selected.id, "");
    } else {
        if (selected.classList.contains('hidden')) { // Можем очистить только поля для ввода

            // Занесение в стэк обратной команды
            let n = selected.textContent;
            str = "if (type == 'ABC' && !Number.isInteger(parseInt('"+selected.textContent+"'))) {"+bl+".textContent='"+(abc.indexOf(selected.textContent)+1)+"';}  else if (type == '123' && Number.isInteger(parseInt('"+selected.textContent+"'))){"+bl+".textContent='"+abc[parseInt(selected.textContent)-1]+"'; } else {" +bl+".textContent='"+selected.textContent+"'; }";
            str += bl+".classList.add('";
            if (selected.classList.contains('correct')) {
                str += "correct');";
            } else {
                str += "wrong');";
            }
            str += "if (!"+bl+".classList.contains('block-selected')) { "+bl+".click();}";
            str += "ShowWrong(" + bl + ");";
            str += "hidefield["+(parseInt(selected.id[0])-1)+"]["+(parseInt(selected.id[1])-1)+"]="+n+";";
            str += "localStorage.setItem('hidefield',hidefield);"
            stack.push(str);
            //
            
            selected.textContent = '';
            field[parseInt(selected.id[0])-1][parseInt(selected.id[1])-1] = -1;
            localStorage.setItem('hidefield', field);
            HideWrong();
        }
    }
}
/* */

/* Подсказка */
function Hint(field, refield, hidefield) {
    let type = document.querySelector('.type').textContent;
    let abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    let selected = document.querySelector('.block-selected');
    let blocks = document.querySelectorAll('.block');
    // Удаляем заметки в ячейке, если они есть
    if (selected.classList.contains('note')) {
        while (selected.firstChild) {
            selected.removeChild(selected.lastChild);
        }
        selected.style.display = "inline";
        selected.classList.remove('note');
        localStorage.removeItem('note'+selected.id);
    }
    if (selected.classList.contains('hidden')) { // Можем использовать только на ячейках для ввода
        let n = field[parseInt(selected.id[0])-1][parseInt(selected.id[1])-1];
        if (type == 'ABC') {
            selected.textContent = n;
        } else {
            selected.textContent = abc[n-1];
        }
        if (selected.classList.contains('wrong')) {
            HideWrong();
        }
        selected.classList.remove('correct');
        selected.classList.remove('hidden');
        refield[parseInt(selected.id[0])-1][parseInt(selected.id[1])-1] = field[parseInt(selected.id[0])-1][parseInt(selected.id[1])-1];
        hidefield[parseInt(selected.id[0])-1][parseInt(selected.id[1])-1] = field[parseInt(selected.id[0])-1][parseInt(selected.id[1])-1];
        localStorage.setItem('refield', refield);
        localStorage.setItem('hidefield', hidefield);
        for (let block of blocks) {
            if (block.textContent == selected.textContent) {
                block.classList.add('block-equal-selected');
            }
        }
        ShowWrong(selected); // Показываем спорные моменты

        CheckWin(field, hidefield); // Проверяем на победу
    }
}
/* */

/* Функции для перетасовки поля */

/* Рандомное число в диапозлне */
function random(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

/* Сдвиг */
function Shift(field, size) {
    let na = [1,size-1];
    let n;
    if (size != 9 && size != 4) {
        n = na[random(0,1)];
    } else {
        n = Math.sqrt(size);
    }

    for (let i = 1; i < size; i++) {
        if ((size == 9 || size == 4) && ((i%n) == 0)) {
            for (let j = 0; j < size; j++) {
                field[i][j] = field[i-n][j];
            }

            let temp = field[i][0];
            for (let j = 0; j < size-1; j++) {
                field[i][j] = field[i][j+1];
            }
            field[i][size-1] = temp;
        } else {
            for (let j = 0; j < size; j++) {
                field[i][j] = field[i-1][j];
            }
        }

        for (let k = 0; k < n; k++) {
            let temp = field[i][0];
            for (let j = 0; j < size-1; j++) {
                field[i][j] = field[i][j+1];
            }
            field[i][size-1] = temp;
        }
    }
    return field;
}

/* Взаимная замена двух строк */
function SwapRows(field, size) {
    let area = 0;
    let k = size
    if (size == 9 || size == 4) {
        k = Math.sqrt(size);
        area = random(0, k-1);
    }
    let r1 = random(0,k-1);
    let r2 = random(0,k-1);
    for (let j = 0; j < size; j++) {
        [field[area*k + r1][j], field[area*k + r2][j]] = [field[area*k + r2][j],  field[area*k + r1][j]];
    }

    return field;
}

/* Взаимная замена двух столбцов */
function SwapColumns(field, size) {
    let area = 0;
    let k = size
    if (size == 9 || size == 4) {
        k = Math.sqrt(size);
        area = random(0, k-1);
    }
    let c1 = random(0,k-1);
    let c2 = random(0,k-1);
    for (let i = 0; i < size; i++) {
        [field[i][area*k + c1], field[i][area*k + c2]] = [field[i][area*k + c2], field[i][area*k + c1]];
    }

    return field;
}

/* Взаимная замена двух блочных строк */
function SwapBlocksRow(field, size) {
    let k = Math.sqrt(size);
    let b1 = random(0,k-1);
    let b2 = random(0,k-1);
    for (let j = 0; j < size; j++) {
        for (let i = 0; i < k; i++) {
            [field[b1*k+i][j], field[b2*k+i][j]] = [field[b2*k+i][j], field[b1*k+i][j]];
        }
    }

    return field;
}

/* Взаимная замена двух блочных столбцов */
function SwapBlocksColumn(field, size) {
    let k = Math.sqrt(size);
    let b1 = random(0,k-1);
    let b2 = random(0,k-1);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < k; j++) {
            [field[i][b1*k+j], field[i][b2*k+j]] = [field[i][b2*k+j], field[i][b1*k+j]];
        }
    }

    return field;
}

/* Транспонирование */
function Transpos(field, size) {
    for (let i = 0; i < size; i++) {
        for (j = i+1; j < size; j++) {
            [field[i][j], field[j][i]] = [field[j][i], field[i][j]];
        }
    }
    return field;
}

/* */

/* Очистка localStorage и обновдение страницы*/
function Reload() {
    localStorage.clear()
    window.location.reload();
}
/* */

/* Удаление статистики */
function DelStat() {
    if (!confirm("Вы уверены, что хотите сбросить статистику?")) return;
    let sizes = [2,3,4,5,6,9];
    let total = document.querySelector('.stat');
    for (let i of sizes) {
        document.querySelector('.stat' + i).textContent = 0;
        localStorage.removeItem('stat' + i);
    }
    localStorage.removeItem('stat');
    total.textContent = 0;
}
/* */

/* Сброс игры и настроек */
function DelGame() {
    if (!confirm("Вы уверены, что хотите сбросить текущую игру и настройки?")) return;
    localStorage.removeItem('size');
    localStorage.removeItem('dif');
    localStorage.removeItem('field');
    localStorage.removeItem('refield');
    localStorage.removeItem('hidefield');
    for (let block of document.querySelectorAll('.block')) {
        localStorage.removeItem('note'+block.id);
    }
    window.location.reload();
}
/* */

/* Меню статистики */
function showStat() {
    if (!document.querySelector('.stat-content').classList.contains('active')) {
        document.querySelector('.stat-content').classList.add('active');
        document.querySelector('.button-stat').innerHTML = '\/\\ Статистика \/\\';
    } else {
        document.querySelector('.stat-content').classList.remove('active');
        document.querySelector('.button-stat').innerHTML = '\\\/ Статистика \\\/';
    }
}
/* */

main();
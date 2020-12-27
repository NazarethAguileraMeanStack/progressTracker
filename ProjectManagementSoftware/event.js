let spans = document.getElementsByClassName('table-toggle');
console.log(spans);

Array.from(spans).forEach((element) => {
    element.addEventListener('click', function(e) {
        let table = document.getElementById(e.path[2].id + '-taskListTable');
        console.log(table);
        if (table.style.display !== 'none') {
            table.style.display = 'none';
        } else {
            table.style.display = 'table';
        }
    });
});
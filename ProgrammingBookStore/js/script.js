document.addEventListener("DOMContentLoaded", function() {

    const bookButtons = [
        {id: "payButton1", book: "book1"}, //defines books
        {id: "payButton2", book: "book2"},
        {id: "payButton3", book: "book3"},
        {id: "payButton4", book: "book4"}
    ];

    bookButtons.forEach(function(btn) {
        const element = document.getElementById(btn.id);

        if (element) {
            element.addEventListener("click", function() {
                window.location.href = "pay.html?book=" + btn.book; //changes url depending on book pay button clicked
            });
        }
    });

});



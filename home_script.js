window.addEventListener("load", function(){
    //Get the observe target
    const targetToObserve = document.getElementById("second_section");

    //Get items
    const itemsToShow = document.querySelectorAll('.section_items');
    
    //Creating an intersection observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting){
                itemsToShow.forEach(item => {
                    item.classList.remove('section_items_hidden')
                });
            }
            else{
                itemsToShow.forEach(item => {
                    item.classList.add('section_items_hidden')
                });
            }
        });
    },{threshold: 0.25});

    //Observe target
    observer.observe(targetToObserve);
})
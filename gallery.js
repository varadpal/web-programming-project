/**************************************************
    CODE FOR GALLERY WEBPAGE
 **************************************************/

// Get all the list items (li) and images (img)
// Get all the list items (li) and images (img)
const titles = document.querySelectorAll('.titles .title');
const images = document.querySelectorAll('.showcase .mainImg');

// Add an event listener to each li item
titles.forEach(title => {
    title.addEventListener('click', (e) => {
        // Prevent the default anchor link behavior
        e.preventDefault();
        
        // Remove the 'clicked' class from all titles before adding it to the clicked one
        titles.forEach(t => t.classList.remove('clicked'));
        
        // Add 'clicked' class to the clicked title
        title.classList.add('clicked');

        // Remove any previous class from images (optional)
        images.forEach(image => image.classList.remove('highlight'));

        // Get the index of the clicked li element
        const index = Array.from(titles).indexOf(title);
        
        // Add the class to the corresponding image
        if (images[index]) {
            images[index].classList.add('highlight');
        }
    });
});



// FOR LISTENING CLICKS OF CATEGORIES
const categories = document.querySelectorAll('.category .catOptions .cat');
const photoHeading = document.querySelector('.photos .picHeading');
const pictures = document.querySelectorAll('.photos .pictures .pic')

categories.forEach(cat => {
    cat.addEventListener('click', (i) => {
        
        i.preventDefault();

        categories.forEach(t => t.classList.remove('clicked'));
        cat.classList.add('clicked');

        let value = cat.getAttribute("value");
        photoHeading.innerHTML = value;

        pictures.forEach(p => p.style.display="block");
        switch (value) {
            case "memories":
                pictures[0].style.display="none";
                pictures[1].style.display="none";
                break;
            case "cinema":
                pictures[2].style.display="none";
                pictures[3].style.display="none";
                break;
            case "art":
                
                break;
            case "stories":
                pictures[3].style.display="none";
                pictures[0].style.display="none";
                break;
                
        
            default:
                break;
        }
    });
});

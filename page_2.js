//Global variables
let posts = [];
let postID = 0;
let postFinishedLoading = true;

const postContainer = document.getElementById('post_container');
const loader = document.getElementById('loading');

//Fetch data
async function fetchPost() {
    try{
        //Im fetching all posts in one go and store it for later use,
        //It might be slower the first time,
        //But I dont need to do further fetching.
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if(!response.ok){
            throw new Error('Network issues');
        }
        posts = await response.json();
    } catch (error){
        console.log("Could not fetch data: ", error);
    }
}
fetchPost();

//Event on scroll
window.addEventListener('scroll', () => {

    //Innerheight = "view port"
    //Scroll Y = "Top to top of view port"
    //OffsetHeight = whole document

    //If Top to top of view port + view port = whole document
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight){
        
        //Posts will load too fast and pop up too sudden without this
        if (postFinishedLoading){
            postFinishedLoading = false;
            loadingPosts(); //Loading animation, add animation
            setTimeout(()=> {
                for(let i = 0; i < 3; i++){
                    createPost(posts[postID].id, posts[postID].title, posts[postID].body);
                    postID++;
                }
                loadingPosts(); //Loading animation, remove animation
                postFinishedLoading = true
            }, 1500)
        }
    }

});

//Create new post elemnts
const createPost = (id,title,text) => {
    //New post container
    const newContainer = document.createElement('div');
    newContainer.className = `post post_Id_${id}`;

    //New title
    const newTitle = document.createElement('h3');
    newTitle.textContent = title
    
    //New Paragraph
    const newPara = document.createElement('p');
    newPara.textContent = text;

    //Append child to container
    newContainer.appendChild(newTitle);
    newContainer.appendChild(newPara);

    //Append post into the post container
    postContainer.appendChild(newContainer);

};

//Loading animation
const loadingPosts = () => {
    if (loader.classList.contains('hidden')){
        loader.classList.remove('hidden');
    }else{
        loader.classList.add('hidden');
    }
}
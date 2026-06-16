const cl = console.log

let postArr=[];
let updateId=null
let BASE_URL='https://jsonplaceholder.typicode.com';
let POST_URL=`${BASE_URL}/posts`;

const postsForm=document.getElementById('postsForm');
const titleControl=document.getElementById('title');
const bodyControl=document.getElementById('body');
const userIdControl=document.getElementById('userId');
const AddBtn=document.getElementById('AddBtn');
const spinner=document.getElementById('spinner');


const updatePostBtn = document.getElementById('updatePostBtn');



function snackbar (msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

function toolTips(){

  $('[data-toggle="tooltip"]').tooltip()

}
function createPostCard(arr){
    let res=''
    arr.forEach(p=> {
        res+=` <div class="col-md-3 mb-3" id="${p.id}">
                <div class="card h-100">
                    <div class="card-header" data-toggle="tooltip" data-placement="top" title="${p.title}">
                        <h3>${p.title}</h3>
                    </div>
                        <div class="card-body">
                           <p>${p.body}</p>
                        </div>
                   
                    <div class="card-footer d-flex justify-content-between">
                        <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"
                        data-toggle="tooltip" data-placement="top" title="Edit Button"></i>
                        <i onclick="onDelete(this)" class="fa-solid fa-trash-can fa-2x text-danger"
                        data-toggle="tooltip" data-placement="top" title="Remove Button"></i>
                    </div>
                </div>
            </div>`
    });
   let postContainer= document.getElementById('postContainer');
   postContainer.innerHTML=res
}

function onPostSubmit(ele){
    spinner.classList.remove('d-none')
    ele.preventDefault();
    let Post_obj={
        title:titleControl.value,
        body:bodyControl.value,
        userId:userIdControl.value
    }

    let xhr=new XMLHttpRequest();
    xhr.open('POST',POST_URL);
    xhr.setRequestHeader(
    'Content-Type',
    'application/json; charset=UTF-8'
    );
    xhr.send(JSON.stringify(Post_obj))
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status <=299){
            
            let res = JSON.parse(xhr.response)
            postsForm.reset()

            let col=document.createElement('div')
            col.className='col-md-3 mb-3'
            col.id=res.id
            col.innerHTML=`
                                 <div class="card h-100">
                                    <div class="card-header"  data-toggle="tooltip" data-placement="top" title="${Post_obj.title}">
                                        <h3>${Post_obj.title}</h3>
                                    </div>
                                        <div class="card-body">
                                        <p>${Post_obj.body}</p>
                                        </div>
                                
                                    <div class="card-footer d-flex justify-content-between">
                                        <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"
                                        data-toggle="tooltip" data-placement="top" title="Edit Button"></i>
                                        <i onclick="onDelete(this)" class="fa-solid fa-trash-can fa-2x text-danger"
                                        data-toggle="tooltip" data-placement="top" title="Remove Button"></i>
                                    </div>
                                </div>`
            const postContainer=document.getElementById('postContainer')
            postContainer.prepend(col)
            toolTips()
            spinner.classList.add('d-none')
            snackbar(`New Post with ${res.id} is created SuccessFully..`,'success')

        }
    }
}


postsForm.addEventListener('submit',onPostSubmit)


function fetchPosts(){
    spinner.classList.remove('d-none')
    let xhr=new XMLHttpRequest();
    xhr.open('GET',POST_URL);
    xhr.send(null);
    xhr.onload=function(){
          if (xhr.status >= 200 && xhr.status <= 299) {

            //>> Templating

            let data = JSON.parse(xhr.response)

            postArr = [...data]
            
            createPostCard(data.reverse())
            toolTips()
            spinner.classList.add('d-none')

        } else {

            // msg snackbar
            spinner.classList.add('d-none')
            snackbar('Something went wrong', 'error')

        }
    }

}
fetchPosts()


function onEdit(ele) {
    updateId = ele.closest('.col-md-3').id

    let EDIT_URL = `${BASE_URL}/posts/${updateId}`

    let xhr = new XMLHttpRequest()
    xhr.open('GET', EDIT_URL)
    xhr.send(null)

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            titleControl.value = res.title
            bodyControl.value = res.body
            userIdControl.value = res.userId

            postsForm.scrollIntoView({
                behavior:'smooth',
                block:'center'
            })
            AddBtn.classList.add('d-none')
            updatePostBtn.classList.remove('d-none')
        }
    }
}

function onUpdatePost() {

    let UPDATE_OBJ = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }

    spinner.classList.remove('d-none')

    let UPDATE_URL = `${BASE_URL}/posts/${updateId}`

    let xhr = new XMLHttpRequest()

    xhr.open('PATCH', UPDATE_URL)

    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')

    xhr.send(JSON.stringify(UPDATE_OBJ))

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {

            let card = document.getElementById(updateId)

            card.querySelector('h3').innerHTML = UPDATE_OBJ.title
            card.querySelector('p').innerHTML = UPDATE_OBJ.body

            postsForm.reset()
            let header = card.querySelector('.card-header');

            header.setAttribute('title', UPDATE_OBJ.title);

            $(header).tooltip('dispose');
            $(header).tooltip();

            $(card.querySelector('.card-header')).tooltip('dispose');
            $(card.querySelector('.card-header')).tooltip();

            let updatedCard=document.getElementById(updateId)
            updatedCard.scrollIntoView({
                behavior:'smooth',
                block:'center'
            })

            setTimeout(() => {
                updatedCard.classList.remove('heighlight-card')
            }, 3000);

            AddBtn.classList.remove('d-none')
            updatePostBtn.classList.add('d-none')

            spinner.classList.add('d-none')

            snackbar(`${updateId} Post updated successfully !!!`, 'success')



        } else {
            spinner.classList.add('d-none')
            snackbar('Something went wrong', 'error')
        }
    }
}

function onDelete(ele) {

    let REMOVE_ID = ele.closest('.col-md-3').id

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove this post?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove',
        cancelButtonText: 'Cancel'
    }).then(result => {

        if (result.isConfirmed) {

            spinner.classList.remove('d-none')

            let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`

            let xhr = new XMLHttpRequest()

            xhr.open('DELETE', REMOVE_URL)

            xhr.send(null)

            xhr.onload = function () {

                if (xhr.status >= 200 && xhr.status <= 299) {

                    let card = document.getElementById(REMOVE_ID)

                    card.remove()

                    spinner.classList.add('d-none')

                    snackbar(`Post with id ${REMOVE_ID} removed successfully !!!`, 'success')

                } else {
                    spinner.classList.add('d-none')
                    snackbar('Something went wrong', 'error')
                }
            }

            xhr.onerror = function () {
                spinner.classList.add('d-none')
                snackbar('Something went wrong', 'error')
            }
        }
    })
}


updatePostBtn.addEventListener('click', onUpdatePost)















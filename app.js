const modals = document.querySelectorAll('.modal');
const addBtn =document.getElementById('add-worker-btn');
const closemodal =document.querySelectorAll('.close-Modal-btn');
const addForum  = document.getElementById('addForum');
const detailsmodal = document.getElementById('details-model');



modals.forEach((mdl)=>{
    mdl.addEventListener('click',(e)=>{
        if(e.target.classList.contains('modal')){
            mdl.classList.add('hidden');
        }
    })
})

addBtn.addEventListener('click',()=>{
        addForum.classList.remove('hidden');
})
closemodal.forEach((closemdl)=>{
    closemdl.addEventListener('click',(e)=>{
        const parentModal = closemdl.closest('.modal');
        if (parentModal) {
            parentModal.classList.add('hidden');
        }
    })
})

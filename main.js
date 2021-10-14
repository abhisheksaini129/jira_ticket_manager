let addbtn =document.querySelector(".add-btn");
let removebtn =document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let addFlag=false;
let removeFlag=true;
let mainCont=document.querySelector(".main-container");
let modalText = document.querySelector(".text-area");
let colorSelected = document.querySelectorAll(".color");

let ticketsArr=[];
//checking local Storage empty or not
if(localStorage.getItem("jira_tickets")){
   //retrieving the tickets and display them on UI
ticketsArr=JSON.parse(localStorage.getItem("jira_tickets"));
ticketsArr.forEach((ticketObj,idx)=>{
   createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.id);
})
}
let colors = ["lightpink","lightblue","lightgreen","black"];
let allPriorityColor = document.querySelectorAll(".modal-col");
let modalpriorityColor = colors[0];
let islocked ="true";
// let lockbtn =document.querySelector(".locker");

colorSelected.forEach((colorElem)=>{
   colorElem.addEventListener("click",(e)=>{
     let clickedColor = colorElem.classList[1];
     //using HOD in ticketsarray
     let filteredTickets = ticketsArr.filter((ticketObj,idx)=>{
         return clickedColor === ticketObj.ticketColor;
     })
   //   remove here previous tickets
     let allticketsCont = document.querySelectorAll(".ticket-cont");
     console.log(allticketsCont);
     for(let i=0; i < allticketsCont.length; i++){
        allticketsCont[i].remove();
     }
   // document.querySelector(".main-container").innerHTML=null;
     //display now filtered tickets
     filteredTickets.forEach((ticketObj,idx)=>{
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.id);
     })
   })
   colorElem.addEventListener("dblclick",(e)=>{
    
      //   remove here previous tickets
        let allticketsCont = document.querySelectorAll(".ticket-cont");
        console.log(allticketsCont);
        for(let i=0; i < allticketsCont.length; i++){
           allticketsCont[i].remove();
        }
      // document.querySelector(".main-container").innerHTML=null;
        //display now filtered tickets
        ticketsArr.forEach((ticketObj,idx)=>{
           createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.id);
        })
      })
})
///listener for modal color selection
allPriorityColor.forEach((colorElem,idx) => {
   colorElem.addEventListener("click",(e)=>{
      allPriorityColor.forEach((priorityChanger,idx)=>{
         priorityChanger.classList.remove("border");
      })
      colorElem.classList.add("border");
      modalpriorityColor = colorElem.classList[1];
   })
})
addbtn.addEventListener('click',(e)=>{
   //display the modal
   //generate the ticket

   //addflag, true-->modal display
    //addflag, false-->modal None
   addFlag=!addFlag;
   if(addFlag){
      addbtn.children[0].style.color = "black";
      modalCont.style.display="flex";
      // addFlag=false;
   }else{
      addbtn.children[0].style.color = "red"
      modalCont.style.display="none";
   }
})
removebtn.addEventListener('click',(e)=>{
   if(removeFlag){
      removebtn.children[0].style.color = "black";
      // modalCont.style.display="flex";
      removeFlag=false;
   }else{
      removebtn.children[0].style.color = "red"
      removeFlag=true;
      // modalCont.style.display="none";
   }
})
modalCont.addEventListener("keydown",(e)=>{

   if(e.key === "Enter"){
      addbtn.children[0].style.color = "red";
      addFlag = !addFlag;
      createTicket(modalpriorityColor,modalText.value);  
      modalCont.style.display="none"
      modalText.value="";
   }
})

function createTicket(ticketColor,ticketTask,ticketId){
   let id = ticketId || shortid();
   let ticketCont = document.createElement("div");
   ticketCont.setAttribute("class","ticket-cont");
   ticketCont.innerHTML=`
   <div class="ticket-color ${ticketColor}"></div>
   <div class="ticket-id">#${id}</div>
   <div class="task-area" contenteditable="false" spellcheck="false">${ticketTask}</div>
   <div class="ticket-lock">
            <i class="fas fa-lock locker"></i> 
   </div> `;

   mainCont.appendChild(ticketCont);
   //creating object for color filtering
   if(!ticketId)
   {
    ticketsArr.push({ticketColor,ticketTask,id})
    localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
   }  
   
   ticketCont.addEventListener("click",(e)=>{
      handleRemove(ticketCont,id);
   })
   handleLockBtn(ticketCont,id);
   handleColor(ticketCont,id);
}

function handleRemove(ticket,id){
   if(!removeFlag){
      let ticketidx = getTicketIndex(id);
      ticketsArr.splice(ticketidx,1);
      localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
      ticket.remove();
   }
}

function handleLockBtn(ticket,id){
   let ticketElem = ticket.querySelector(".ticket-lock");
   let ticketText = ticket.querySelector(".task-area");
   let lockbtn = ticketElem.children[0];
   lockbtn.addEventListener("click",()=>{
      let ticketIdx = getTicketIndex(id);
      if(islocked){
         ticketText.contentEditable = "true";

         lockbtn.classList.remove("fa-lock");
         lockbtn.classList.add("fa-lock-open");
         islocked=!islocked;
      }else{
         ticketText.contentEditable = "false";
         lockbtn.classList.remove("fa-lock-open");
         lockbtn.classList.add("fa-lock");
         islocked=!islocked;
      }
      ticketsArr[ticketIdx].ticketTask = ticketText.innerText;
      localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
   })
}

function handleColor(ticket,id){
   let ticketColor = ticket.querySelector(".ticket-color");
   // console.log(ticketColor);
   ticketColor.addEventListener("click",(e)=>{
     let ticketIndx = getTicketIndex(id);
      let currentColor = ticketColor.classList[1];
      
      //   //getting ticket index
      let currentColorIndex = colors.findIndex((color)=>{
         return currentColor == color;
      })
         currentColorIndex++;

         let nextColoridx = currentColorIndex % colors.length;
         let nextColor = colors[nextColoridx];

      ticketColor.classList.remove(currentColor);
      ticketColor.classList.add(nextColor);
///modifying the local storage , to update that i changed the color
      ticketsArr[ticketIndx].ticketColor = nextColor;
      localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
   })
}
function getTicketIndex(id){
let ticketIndx = ticketsArr.findIndex((ticketObj)=>{
   return ticketObj.id == id;
})
return ticketIndx;
}


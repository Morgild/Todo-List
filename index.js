const addCard = document.querySelectorAll(".addCard");
const body = document.querySelector("body");
const addTask = document.querySelector("#addTask");
const btnAddTask = document.querySelector(".btnAddTask");
const title = document.querySelector("#title");
const labelTitle = document.querySelector("#labelTitle");
const descr = document.querySelector("#descr");
const labelDescr = document.querySelector("#labelDescr");
const todoCards = document.querySelectorAll(".todoCards");
const todoCount = document.querySelectorAll(".todoCounter");
const back = document.querySelector("#back");
const formElement = document.querySelector("form");
const cardTitleX = document.querySelectorAll(".cardTitleX");
const todoBox = document.querySelectorAll(".todoBox");
const card = document.querySelectorAll(".card");
const search = document.querySelector(".search");

let editID=0;
let data = JSON.parse(localStorage.getItem("data")) ?? [];

let searchValue = "";
// let data=[];
let count = localStorage.getItem("count") ?? 0;

const setData = (arr) => {
  data = arr;
  render();
};

const setSearchValue = (newSearchValue) => {
  searchValue = newSearchValue;
  render();
  xCounter();
};

const render = () => {
  todoCards[0].innerHTML = "";
  todoCards[1].innerHTML = "";
  todoCards[2].innerHTML = "";

  data
    .filter((item) => {
      return item.title.includes(searchValue);
    })
    .forEach((item) => {
      if (item.status == "To do") {
        todoCards[0].innerHTML += Card(item);
      }
      if (item.status == "In progress") {
        todoCards[1].innerHTML += Card(item);
      }
      if (item.status == "Completed") {
        todoCards[2].innerHTML += Card(item);
      }
    });

  // Delete card
  const cardTitleX = document.querySelectorAll(".cardTitleX");
  cardTitleX.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.id;
      
      console.log("deleteID",id)
      const newData = data.filter((el) => {
        return el.id !== id;
      });
      setData(newData);
      saveData();
      xCounter();
    });
  });
  const card = document.querySelectorAll(".card");

  // Sorting cards
  const prior = document.querySelectorAll(".priorityText");
  card.forEach((item, index) => {
    prior[index].textContent == "Low"
      ? (card[index].style.order = "3")
      : prior[index].textContent == "Mid"
      ? (card[index].style.order = "2")
      : (card[index].style.order = "1");
  });

  // Drag event

  card.forEach((item, index) => {
    item.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text", event.target.id);
    });
  });

  // Checkbox to completed state
  const check = document.querySelectorAll(".cardCheck");
  check.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      const idCheck = item.id;
      const newData = data.map((item) => {
        const userId = item.id;
        if (userId == idCheck) {
          item.status = "Completed";
        }
        return item;
      });
      setData(newData);
      saveData();
      xCounter();
    });
  });

  // Search
  search.addEventListener("input", (event) => {
    setSearchValue(event.target.value);
  });

  // Edit
  const edit = document.querySelectorAll(".imgEdit");
  edit.forEach((item) => {
    item.addEventListener("click", (event) => {
      editID = item.parentNode.parentNode.id;
      console.log(item.parentNode.parentNode.id); 
      addTask.style.display = "block";
      back.style.display = "block";
      const priorityText =
        item.parentNode.parentNode.querySelector(".priorityText").textContent;
      const statusText =
        item.parentNode.parentNode.querySelector(".statusText").textContent;
      const titleText =
        item.parentNode.parentNode.querySelector(".cardTitle").textContent;
      const descriptionText =
        item.parentNode.parentNode.querySelector(".descrText").textContent;
      formElement.elements[0].value = titleText;
      formElement.elements[1].value = descriptionText;
      formElement.elements[2].value = statusText;
      formElement.elements[3].value = priorityText;
    });
  });
  const priorityText=document.querySelectorAll(".priorityText")
  console.log(priorityText)
  priorityText.forEach((item, index)=>{
  
    if(item.textContent=="High"){
      item.style.background='#E34234'
      item.style.color="#fff"
    }
    if(item.textContent=="Mid"){
      item.style.background='#FA8128'
      item.style.color="#fff"
    }
    if(item.textContent=="Low"){
      item.style.background='#DFFE00'
      item.style.color="#000"
    }
  })
};
const Card = (props) => {
  return `
  <div class="card" draggable="true" id="${props.id1}">
    <div class="cardTitleDiv">
      <p class="cardCheck" id="${props.id}">&check;</p>
      <h3 class="cardTitle">${props.title}</h3>
      <p class="cardTitleX" id="${props.id}">&times;</p>
    </div>
    <p class="descrText">${props.descr}<img class="imgEdit" src="./editing.png"></p>
    <p class="priorityText">${props.priority}</p>
    <span class="statusText">${props.status}</span>
  </div>
  `;
};
render();

addCard.forEach((item) => {
  item.addEventListener("click", () => {
    addTask.style.display = "block";
    back.style.display = "block";
  });
});

addTask.addEventListener("submit", (event) => {
  back.style.display = "none";
  event.preventDefault();
  const { elements } = event.target;
  const title = elements["title"].value;
  const descr = elements["descr"].value;
  const priority = elements["priority"].value;
  const status = elements["status"].value;

  const newData = [
    ...data,
    {
      title,
      descr,
      priority,
      status,
      id: "id" + count,
      id1: "cid" + count,
      id2: "aid" + count,
    },
  ];
  count++;
  setData(newData);

  back.style.display = "none";
  addTask.style.display = "none";

  // Cleaning input fields after submit
  for (let k = 0; k < formElement.elements.length; k++) {
    formElement.elements[k].value = "";
  }

  // Delete after edit 
  console.log(editID)
  if(editID!=0){
    // data.id
      const newData1 = data.filter((el) => {
        console.log(el.id1)
        return el.id1 !== editID;
      });
      setData(newData1);
      editID=0;}
  saveData();
  xCounter();
});
// Drag and Drop event

todoBox.forEach((item) => {
  item.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
});
todoBox.forEach((item, index) => {
  item.addEventListener("drop", (event) => {
    const stat = item.querySelector("h3").textContent;
    const id = event.dataTransfer.getData("text");
    const newData = data.map((item) => {
      if (item.id1 === id) {
        item.status = stat;
      }
      return item;
    });
    setData(newData);
    saveData();
    xCounter();
  });
});

// Save data
const saveData = () => {
  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("count", count);
};

const xCounter = () => {
  for (let i = 0; i < todoCards.length; i++) {
    todoCount[i].innerHTML = todoCards[i].childElementCount;
  }
};
xCounter();

// Background click event
back.addEventListener("click", () => {
  addTask.style.display = "none";
  back.style.display = "none";

  for (let k = 0; k < formElement.elements.length; k++) {
    formElement.elements[k].value = "";
  }
});

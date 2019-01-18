'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],

  hideChecked: false,
  searchPressed: [],
};


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <span class="js-shopping-item-edit hidden"><input value=${item.name}></input><button class="edit-button">OK</button></span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  let count = 0;
  let filteredItems = [...STORE.items];
 
  if(STORE.hideChecked){
    filteredItems = filteredItems.filter(i => i.checked === false );
  }
  if(STORE.searchPressed.length !== 0){
    filteredItems = STORE.searchPressed[STORE.searchPressed.length -1];
  }

    

  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').on('click','button',function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    if($(this).attr('value') === 'first')
      addItemToShoppingList(newItemName);
    else
      arraySearch(newItemName);
    renderShoppingList();
  });
}


function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItem(itemIndex){
  STORE.items.splice(itemIndex,1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
}

function handleToggleCheck(){
  $('input:checkbox').click( event =>{
    STORE.hideChecked = !STORE.hideChecked;
    renderShoppingList();
  });
}

// handles search
function arraySearch(word){
  console.log(`Searching for ${word}`);
  const re = new RegExp(word, 'gi');

  STORE.searchPressed.push(STORE.items.filter(i=> i.name.match(re)));
}

function editListItem(itemIndex,replace){
  STORE.items.splice(itemIndex,1,replace);
}


//handles edit on the OKAY 
function handleEditItemClicked() {
  // we attach the event listener on the element
  $('.js-shopping-list').on('click', '.js-shopping-item', event => {

    // look for the current/clicked-on item and find the input and remove hidden
    $(event.target).closest('li').find('.js-shopping-item-edit').toggleClass('hidden');
    // look for the current item and find the `item` and hide it
    $(event.target).closest('li').find('.js-shopping-item').toggleClass('hidden');

  });
}

function saveChange(index){
  
}
// need event listener for the double click <span> and to show the hidden 

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleCheck();
  handleEditItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
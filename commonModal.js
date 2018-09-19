class Util {
  static domGenerator(tag, className){
    const dom = document.createElement(tag);
    dom.className = className;
    return dom;
  }

  static createUid(){
    let date = new Date().getTime();
    return `modal_${date}`;
  }
}


// type confirm / alert
function CommonModal(content, type='confirm', buttonOptions = []){
  this.content = content;
  this.type = type;
  this.buttonOptions = buttonOptions;
  this.uid = Util.createUid();
}

CommonModal.prototype = {
  constructor : CommonModal,
  createModal: function(){
    const modalContainer = Util.domGenerator('div', 'modal-container');
    const modalWrapper = Util.domGenerator('div', 'wrapper dimmer');
    const modalDiv = Util.domGenerator('div', 'modal ' + this.type);
    const modalTitle = Util.domGenerator('div', 'modal-title');
    const modalBody = Util.domGenerator('div', 'modal-body');
    const modalFooter = Util.domGenerator('div', 'modal-footer');

    const titleText = document.createTextNode(this.type);
    const contentText = document.createTextNode(this.content);
    
    modalTitle.appendChild(titleText);
    modalBody.appendChild(contentText);
    this.createButton(modalFooter);

    modalDiv.appendChild(modalTitle);
    modalDiv.appendChild(modalBody);
    modalDiv.appendChild(modalFooter);
    modalWrapper.appendChild(modalDiv);
    modalContainer.appendChild(modalWrapper);

    document.body.appendChild(modalContainer);
    document.body.style.overflow = 'hidden';
  },
  createButton: function(buttonContainer){
    const buttonOptions = this.buttonOptions;

    for(let i = buttonOptions.length - 1; i >=0; i--){
      const { content, type, func } = buttonOptions[i];
      const modalBtn = Util.domGenerator('button', `modal-btn ${type}`);
      const textNode = document.createTextNode(content);
      modalBtn.appendChild(textNode);
      modalBtn.onclick = func;
      buttonContainer.appendChild(modalBtn);
    }
  },
  hide:function(){
    console.log('hide' + this.uid);
  }
}


// event delegate 
let button = document.getElementById('alert-1');
button.addEventListener('click', function(e){
  let modal = new CommonModal('hehelloahelloahelloahelloahelloahelloahelloahelloahelloahelloahelloahelloahelloahelloahelloahelloahelloahelloahelloahelloahelloalloa', 'warning', [
      {
      content: 'asdf',
      type: 'normal',
      func: function(){
        console.log('hello');
      }
    },{
      content: 'popup2',
      type: 'normal',
      func: function(){
        let modal = new CommonModal('inner', 'warning', [
            {
            content: 'asdfasdfaf',
            type: 'normal',
            func: function(){
              console.log('hello');
            }
          },{
            content: 'cancel',
            type: 'normal',
            func: function(){
              // this.hide();
            }
          }
        ]);

        modal.createModal();

      }
    }
  ]);
  


  modal.createModal();
});

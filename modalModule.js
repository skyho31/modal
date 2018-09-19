/**
 * Modal Module
 * 
 * Author : Seonho Kim 
 * version : es6
 * 
 * example : 
 * modal = new Modal({
 *  content : 'contentSample',
 *  title : 'titleSample',
 *  type: 'confirm' or 'alert'           *default - alert
 *  cssClass: ['custom', 'class']        *default - [];
 *  closeLabel: 'close'                  *default - 'close'
 *  buttons : [                         
 *      {
 *        content : 'ok',
 *        cssClass : []
 *        func: function(){              *default - this.hide(); 
 *          console.log('helloworld'); 
 *          this.hide();
 *        }
 *      },
 *      {
 *        content : 'cancel',
 *        cssClass : []
 *        func: function(){              *default - this.hide(); 
 *          console.log('helloworld'); s
 *          this.hide();
 *        }
 *      }
 *    ]
 *  });
 * 
 * modal.show();
 * modal.hide();
 */

(function (global) {
  
  function domGenerator(tag, ...cssClass) {
    const dom = document.createElement(tag);
    cssClass.forEach(singleClass => {
      if(singleClass !== undefined){
        dom.classList.add(singleClass);
      }
    })

    return dom;
  }
  
  function customlog(message, type='info'){
    console.log(type)
    let logContainer;
    let logBody;

    if(document.querySelector('.log-container')){
      logContainer = document.querySelector('.log-container');
      logBody = logContainer.childNodes[0];

      logContainer.classList.add(type);
      logContainer.classList.remove('hidden');
      
    } else {
      logContainer = domGenerator('div', 'log-container', type);
      logBody = domGenerator('div', 'log-body');

      logContainer.appendChild(logBody);      
      document.body.appendChild(logContainer);
    }

    logBody.innerHTML = message;
    
    setTimeout(function(){
      logContainer.classList.add('hidden');
    }, 1000);
  }
  

  class Modal {
    constructor(options){
      this.type = options.type;
      this.content = options.content;
      this.title = options.title || 'alert';
      this.closeLabel = options.closeLabel || 'cancel';
      this.cssClass = options.cssClass || [];
      this.buttons = options.buttons || [{
        content: 'confirm'
      }];
      this.originOverflow = document.body.style.overflow;

      // function bind
      this.show = this.show.bind(this);
      this.hide = this.hide.bind(this);
    }

    show() {
      this._create();
      this._bindEvent();

      this.modalTitle.innerHTML = this.title;
      this.modalBody.innerHTML = this.content;

      document.body.style.overflow = 'hidden';
    }

    hide() {
      this.modalContainer.remove();
      if (this._isEmpty()) {
        document.body.style.overflow = this.originOverflow;
      }
    }

    // private method
    _create(){
      this.modalContainer = domGenerator('div', 'modal-container', 'show');
      this.modalWrapper = domGenerator('div', 'wrapper', 'dimmer');
      this.modalDiv = domGenerator('div', 'modal', this.title);
      this.modalTitle = domGenerator('div', 'modal-title');
      this.modalBody = domGenerator('div', 'modal-body');
      this.modalFooter = domGenerator('div', 'modal-footer');
      this.cancelBtn = domGenerator('button', 'modal-btn', 'cancel');
      this.cancelBtn.innerHTML = this.closeLabel;

      if(this.type === 'confirm' && this.buttons.length === 0){
        this.buttons.push({
          content: 'confirm',
          message: 'confirm'
        });
      }

      this.cssClass.forEach(singleClass => {
        this.modalDiv.classList.add(singleClass);
      });

      this.type === 'confirm' && this.buttons.forEach(buttonOption => {
        this.modalFooter.appendChild(this._createButton(buttonOption));
      });
      this.modalFooter.appendChild(this.cancelBtn);
      this.modalContainer.appendChild(this.modalWrapper);
      this.modalWrapper.appendChild(this.modalDiv);
      this.modalDiv.appendChild(this.modalTitle);
      this.modalDiv.appendChild(this.modalBody);
      this.modalDiv.appendChild(this.modalFooter);

      document.body.appendChild(this.modalContainer);
    }

    _bindEvent () {
      const that = this;
      this.modalDiv.addEventListener('click', function (e) {
        if (e.target.className === 'modal-btn cancel') {
          that.hide();
        }
      });
    }

    _createButton(option) {
      const { content, cssClass, func } = option;
      const button = domGenerator('button', 'modal-btn', cssClass);
      button.innerText = content;
      button.onclick = (func && func.bind(this)) || this.hide;

      return button;
    }

    _isEmpty() {
      return document.getElementsByClassName('modal-container').length === 0;
    }
  }

  global.Modal = Modal;
  global.customlog = customlog;
}(window));

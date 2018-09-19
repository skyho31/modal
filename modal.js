/**
 * Modal Module
 * 
 * Author : Seonho Kim 
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
 *        func: function(){              *default - modal.hide(); 
 *          console.log('helloworld'); 
 *        }
 *      },
 *      {
 *        content : 'cancel',
 *        cssClass : []
 *        func: function(){              *default - modal.hide(); 
 *          console.log('helloworld'); s
 *        }
 *      }
 *    ]
 *  });
 * 
 * modal.show();
 * modal.hide();
 */

(function (global) {
  function Modal(options) {
    this.content = options.content;
    this.title = options.title || 'alert';
    this.closeLabel = options.closeLabel || 'cancel';
    this.cssClass = options.cssClass || [];
    this.buttons = options.buttons || [];
    this.originOverflow = document.body.style.overflow;
  }

  Modal.prototype = {
    constructor: Modal,
    show: function () {
      this._create();
      this._bindEvent();

      this.modalTitle.innerHTML = this.title;
      this.modalBody.innerHTML = this.content;

      document.body.style.overflow = 'hidden';
    },
    hide: function () {
      this.modalContainer.remove();
      if (this._isEmpty()) {
        document.body.style.overflow = this.originOverflow;
      }
    },

    // private method
    _create: function () {
      this.modalContainer = this._domGenerator('div', 'modal-container', 'show');
      this.modalWrapper = this._domGenerator('div', 'wrapper', 'dimmer');
      this.modalDiv = this._domGenerator('div', 'modal', this.title);
      this.modalTitle = this._domGenerator('div', 'modal-title');
      this.modalBody = this._domGenerator('div', 'modal-body');
      this.modalFooter = this._domGenerator('div', 'modal-footer');
      this.cancelBtn = this._domGenerator('button', 'modal-btn', 'cancel');
      this.cancelBtn.innerHTML = this.closeLabel;

      if(this.type === 'confirm'){
        this.confirmBtn = this._domGenerator('button', 'modal-btn', 'confirm');
      }

      this.cssClass.forEach(singleClass => {
        this.modalDiv.classList.add(singleClass);
      });

      this.modalFooter.appendChild(this.cancelBtn);
      this.buttons.forEach(buttonOption => {
        this.modalFooter.appendChild(this._createButton(buttonOption));
      });

      this.modalContainer.appendChild(this.modalWrapper);
      this.modalWrapper.appendChild(this.modalDiv);
      this.modalDiv.appendChild(this.modalTitle);
      this.modalDiv.appendChild(this.modalBody);
      this.modalDiv.appendChild(this.modalFooter);

      document.body.appendChild(this.modalContainer);
    },
    _bindEvent: function () {
      const that = this;
      this.modalDiv.addEventListener('click', function (e) {
        if (e.target.className === 'modal-btn cancel') {
          console.log(e.target.className);
          that.hide();
        }
      });
    },
    _createButton: function (option) {
      const { content, cssClass, func } = option;
      const button = this._domGenerator('button', 'modal-btn', cssClass);
      button.innerText = content;
      button.onclick = func;

      return button;
    },
    _domGenerator: function (tag, ...cssClass) {
      const dom = document.createElement(tag);
      cssClass.forEach(singleClass => {
        if(singleClass !== undefined){
          dom.classList.add(singleClass);
        }
      })

      return dom;
    },
    _isEmpty: function () {
      return document.getElementsByClassName('modal-container').length === 0;
    }
  }

  global.Modal = Modal;
}(window));

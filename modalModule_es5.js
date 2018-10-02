/**
 * Modal Module
 * 
 * Author : Seonho Kim 
 * version : es5
 * date : 2018.10.2
 * 
 * 1.사용자에게 노출될 내용
 * - Modal 제목
 * - Modal 내용
 * - Button : 1 ~ n개
 * 
 * 2.기능
 * - parameter를 통해, modal 생성 가능
 * - modal의 type, content, title 등 주요 내용 이외에도 Button이나 Modal에 custom class 배열의 형태로 부여가능
 * - Modal 창의 높이는 Content에 따라 유동적으로 변화
 * - 복수 개의 Modal Overlay 지원
 * - Modal 시 Scroll 방지 지원
 * - Custom Button 지원
 *   설정한 타입 (alert, confirm)에 따라 설정할 수 있으며, 
 *   1) type이 alert일 시, 추가적인 버튼을 할당할 수  없다. 다만 closeLabel의 변경을 통해, 노출되는 버튼의 text를 변경할 수 있다. 
 *   2) type이 confirm일 경우, 추가적인 Button을 할당할 수 있다. 아무것도 할당하지 않을 시 기본적인 확인 버튼과 취소 버튼이 노출된다. 하나라도 옵션을 할당할 경우, 확인 버튼은 따로 생성되지 않는다. 
 *   3) 추가적으로 유저가 옵션에 따라 버튼에 Modal을 닫는 기능을 부여할 수 있도록 this.close()를 Button의 func 속성 내부에 부여 시 닫는 동작을 컨트롤 할 수 있다. 
 *   4) func 속성에 아무 것도 할당하지 않을 시 Button은 Modal을 닫는 용도로 사용된다.
 *  
 * 3.특이사항
 * - confirm 시 알림창을 띄우기 위해 customlog function 사용
 * 
 * 
 * 개별 function의 설명은 이하 주석 참조
 */

(function (global) {

  /**
   * @description generate dom object using tag name and className
   * 
   * @param {String} tag html tag name
   * @param  {...String} classes className Array
   * @returns {HTMLElement} 
   */
  function domGenerator(tag, ...classes) {
    const dom = document.createElement(tag);
    classes.forEach(singleClass => {
      if (singleClass !== undefined) {
        dom.classList.add(singleClass);
      }
    })

    return dom;
  }


  /**
   * @description	print log message 
   * 
   * @param {String} message log message
   * @param {String} type info || alert change border-left color
   */
  function customlog(message, type = 'info') {

    const queryContainer = document.querySelector('.log-container');
    const logBox = domGenerator('div', 'log-box', type);
    const logBody = domGenerator('div', 'log-body');
    let logContainer;

    // check isBuilt
    if (!queryContainer) {
      logContainer = domGenerator('div', 'log-container');
      document.body.appendChild(logContainer);
    } else {
      logContainer = queryContainer;
    }

    // change message
    logBody.innerHTML = message;
    logBox.appendChild(logBody);
    logContainer.appendChild(logBox);

    // disappear log
    setTimeout(function () {
      logBox.remove();
    }, 1000);
  }


  /**
   * 
   * @description modal module with overlay feature
   * 
   * @param {Object} options {
   *  type: String,
   *  content: String,
   *  title: String,
   *  confirmLabel: String,
   *  closeLabel: String,
   *  classes: Array,
   *  buttons: [
   *    {
   *      content: String,
   *      func: Function,
   *      classes: Array
   *    }
   *  ]
   * }
   * 
   */

  function Modal(options){
    options = options || {};
    this.type = options.type || 'alert';
    this.content = options.content || 'no contents';
    this.title = options.title || '';
    this.confirmLabel = options.confirmLabel || 'confirm';
    this.closeLabel = options.closeLabel || 'cancel';
    this.classes = options.classes || [];
    this.buttons = options.buttons || [];
    this.originOverflow = document.body.style.overflow;
  }

  Modal.prototype = (function(){

    _createButton = function (text, classes, idx) {
      const button = domGenerator('button', 'modal-btn');
      Array.isArray(classes) && classes.forEach(singleClass => {
        button.classList.add(singleClass);
      });

      button.innerText = text;
      button.dataset.index = idx;

      return button;
    },

    _splitButton = function(buttonOptions) {
      const buttonTexts = [];
      const buttonFuncs = [];
      const buttonClasses = [];

      if (this.type === 'confirm') {
        if (buttonOptions.length > 0) {
          buttonOptions.forEach(v => {
            buttonTexts.push(v.content || '');
            buttonFuncs.push(v.func);
            buttonClasses.push(v.classes);
          });
        } else {
          buttonTexts.push(this.confirmLabel);
          buttonFuncs.push(function () {
            customlog('confirm');
            this.hide();
          });
        }
      }

      // add cancel button
      buttonTexts.push(this.closeLabel);

      this.buttons = {
        texts: buttonTexts,
        funcs: buttonFuncs,
        classes: buttonClasses
      }
    }

    _create = function() {
      // create dom
      this.modalContainer = domGenerator('div', 'modal-container');
      var modalWrapper = domGenerator('div', 'wrapper', 'dimmer');
      var modalDiv = domGenerator('div', 'modal');
      var modalTitle = domGenerator('div', 'modal-title');
      var modalBody = domGenerator('div', 'modal-body');
      var modalFooter = domGenerator('div', 'modal-footer');

      // bind value
      modalTitle.innerHTML = this.title;
      modalBody.innerHTML = this.content;

      // apply custom css
      this.classes.forEach(singleClass => {
        modalDiv.classList.add(singleClass);
      });

      // add button group
      this.buttons.texts.forEach((buttonText, idx) => {
        var classes = this.buttons.classes[idx];
        var button = _createButton.call(this, buttonText, classes, idx);

        modalFooter.appendChild(button);
      });

      // render dom
      this.modalContainer.appendChild(modalWrapper);
      modalWrapper.appendChild(modalDiv);
      modalDiv.appendChild(modalTitle);
      modalDiv.appendChild(modalBody);
      modalDiv.appendChild(modalFooter);
      document.body.appendChild(this.modalContainer);
    },

    _isEmpty = function() {
      return document.getElementsByClassName('modal-container').length === 0;
    },

    _bindEvent = function() {
      // for bind event scope
      var that = this;

      // event delegate
      this.modalContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-btn')) {
          var index = e.target.dataset.index;
          var func = that.buttons.funcs[index];
          
          (func && func.bind(that) || hide.call(that))();
        }
      });
    }
    
    show = function(){
      _splitButton.call(this, this.buttons)
      _create.call(this);
      _bindEvent.call(this);
    },

    hide = function(){
      this.modalContainer.remove();
      if (_isEmpty()) {
        // restore origin overflow attribute
        document.body.style.overflow = this.originOverflow;
      }
    }
    
    return {
      show: show,
      hide: hide
    }
  })();

  global.Modal = Modal;
  global.customlog = customlog;
}(window));


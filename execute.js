/**
 * Modal Sample Test File
 * 
 * Author : Seonho Kim 
 * version : es6
 * date : 2018.09.20
 * 
 * description : 개별 버튼에 해당하는 모달을 생성하고 이벤트를 할당한 후, 요구 스펙의 충족여부를 확인하기 위한 실행 테스트 샘플 파일
 */

// sample string
const shortSample = `"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."`;
const mediumSample = `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.`;
const longSample = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

// 1. create modals
const alert1Modal = new Modal({
  content: longSample,
  title: 'alert-1',
  type: 'alert',
  classes: ['alert'],
  buttons: [{
    content: 'heloo'
  }]
});
const alert2Modal = new Modal({
  content: mediumSample,
  title: 'alert-2',
  type: 'alert'
});
const alert3Modal = new Modal({
  content: shortSample,
  title: 'alert-3',
  type: 'alert'
});
const confirm1Modal = new Modal({
  content: longSample,
  title: 'confirm-1',
  type: 'confirm',
  classes: ['confirm'],
  buttons: [{
      content: 'ok',
      classes: ['hello'],
      func: function () {
        customlog('confirm1 ok');
        this.hide();
      }
    },
    {
      content: 'warn',
      func: function () {
        customlog('alert', 'alert');
      }
    }
  ]
});
const confirm2Modal = new Modal({
  content: mediumSample,
  title: 'confirm-2',
  type: 'confirm',
  // className: ['hello'],
  buttons: [{
    content: 'ok',
    func: function () {
      customlog('confirm2 ok');
      this.hide();
    }
  }]
});
const confirm3Modal = new Modal({
  content: shortSample,
  title: 'confirm-3',
  type: 'confirm',
});


// 2. event bind
document.body.addEventListener('click', function (e) {
  if (e.target.classList.contains('button-test')) {
    switch (e.target.id) {
      case 'alert-1':
        alert1Modal.show();
        break;

      case 'alert-2':
        alert1Modal.show();
        alert2Modal.show();
        break;

      case 'alert-3':
        alert1Modal.show();
        alert2Modal.show();
        alert3Modal.show();
        break;

      case 'confirm-1':
        confirm1Modal.show();
        break;

      case 'confirm-2':
        confirm1Modal.show();
        confirm2Modal.show();
        break;

      case 'confirm-3':
        confirm1Modal.show();
        confirm2Modal.show();
        confirm3Modal.show();
        break;
    }
  }
})


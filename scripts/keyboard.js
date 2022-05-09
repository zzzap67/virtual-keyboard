import keys from './keys.js';

export default class Keyboard {
  constructor() {
    this.isCaps = false;
    this.isShift = false;
    this.currentLang = localStorage.getItem('currentLang') || 'en';
    this.textarea = null;
    this.mousePressedKey = null;
  }

  reDrawButtons() {
    keys.forEach((item) => {
      const key = document.querySelector(`#${item.code}`);
      if ((!this.isCaps) && (!this.isShift)) {
        key.innerHTML = item[this.currentLang].sml;
      } else if ((this.isCaps) && (!this.isShift)) {
        if (item[this.currentLang].capstyle) {
          key.innerHTML = item[this.currentLang].big;
        } else {
          key.innerHTML = item[this.currentLang].sml;
        }
      } else if ((this.isCaps) && (this.isShift)) {
        if (item[this.currentLang].capstyle) {
          key.innerHTML = item[this.currentLang].sml;
        } else {
          key.innerHTML = item[this.currentLang].big;
        }
      } else {
        key.innerHTML = item[this.currentLang].big;
      }
    });
  }

  keyDown(el) {
    this.mousePressedKey = el;
    document.dispatchEvent(new KeyboardEvent('keydown', { code: el }));
  }

  keyUp(el) {
    this.mousePressedKey = null;
    document.dispatchEvent(new KeyboardEvent('keyup', { code: el }));
  }

  init() {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    wrapper.innerHTML = '<h1>Virtual Keyboard</h1>';

    document.body.append(wrapper);

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = 'Windows keyboard. Press Ctrl + Shift to switch language (en/ru).';

    wrapper.append(info);

    const tarea = document.createElement('div');
    tarea.className = 'textarea_wrapper';

    wrapper.append(tarea);

    this.textarea = document.createElement('textarea');
    this.textarea.className = 'textarea';
    this.textarea.id = 'textarea';
    this.textarea.placeholder = 'Start typing....';

    tarea.append(this.textarea);

    const keyboardWrapper = document.createElement('div');
    keyboardWrapper.className = 'keyboard_wrapper';

    wrapper.append(keyboardWrapper);

    const keyboardLines = [];

    for (let i = 1; i <= 5; i += 1) {
      keyboardLines[i] = document.createElement('div');
      keyboardLines[i].className = 'keyboard_line';
      keyboardWrapper.append(keyboardLines[i]);
    }

    keys.forEach((item) => {
      const kbdButton = document.createElement('div');
      kbdButton.className = 'button';
      kbdButton.id = item.code;

      switch (item.code) {
        case 'Backspace':
          kbdButton.classList.add('btn_backspace');
          break;
        case 'Tab':
          kbdButton.classList.add('btn_tab');
          break;
        case 'CapsLock':
          kbdButton.classList.add('btn_capslock');
          break;
        case 'Enter':
          kbdButton.classList.add('btn_enter');
          break;
        case 'Space':
          kbdButton.classList.add('btn_space');
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          kbdButton.classList.add('btn_shift');
          break;
        default:
          break;
      }

      kbdButton.innerHTML = item[this.currentLang].sml;
      keyboardLines[item.row].append(kbdButton);
    });

    this.textarea.focus();

    document.addEventListener('keydown', (e) => {
      e.stopImmediatePropagation();
      this.textarea.focus();

      const key = document.querySelector(`#${e.code}`);
      if (key) {
        key.classList.add('button_active');
      }

      if ((
        (e.code === 'ControlLeft')
            || (e.code === 'ShiftLeft')
            || (e.code === 'ControlRight')
            || (e.code === 'ShiftRight')) && (e.ctrlKey) && (e.shiftKey)) {
        if (this.currentLang === 'en') {
          this.currentLang = 'ru';
        } else {
          this.currentLang = 'en';
        }

        localStorage.setItem('currentLang', this.currentLang);
      }

      const currKey = keys.find((item) => item.code === e.code);
      if (currKey) {
        let currposition = this.textarea.selectionStart;
        this.textarea.selectionEnd = this.textarea.selectionStart;

        if (currKey.spec) {
          switch (currKey.code) {
            case 'CapsLock':
              this.isCaps = !this.isCaps;
              break;
            case 'ShiftLeft':
            case 'ShiftRight':
              this.isShift = true;
              this.reDrawButtons();
              break;
            case 'Tab':
              this.textarea.value = `${this.textarea.value.slice(0, this.textarea.selectionStart)}\t${this.textarea.value.slice(this.textarea.selectionStart)}`;
              currposition += 1;
              break;
            case 'Space':
              this.textarea.value = `${this.textarea.value.slice(0, this.textarea.selectionStart)} ${this.textarea.value.slice(this.textarea.selectionStart)}`;
              currposition += 1;
              break;
            case 'Enter':
              this.textarea.value = `${this.textarea.value.slice(0, this.textarea.selectionStart)}\n${this.textarea.value.slice(this.textarea.selectionStart)}`;
              currposition += 1;
              break;
            case 'Backspace':
              if (currposition > 0) {
                this.textarea.value = this.textarea.value.slice(0, this.textarea.selectionStart - 1)
                    + this.textarea.value.slice(this.textarea.selectionStart);
                currposition -= 1;
              }
              break;
            case 'Delete':
              this.textarea.value = this.textarea.value.slice(0, this.textarea.selectionStart)
                + this.textarea.value.slice(this.textarea.selectionStart + 1);
              break;
            default:
              break;
          }
        } else {
          let a;

          if (this.isCaps) {
            if (this.isShift) {
              if (currKey[this.currentLang].capstyle) {
                a = currKey[this.currentLang].sml;
              } else {
                a = currKey[this.currentLang].big;
              }
            } else if (currKey[this.currentLang].capstyle) {
              a = currKey[this.currentLang].big;
            } else {
              a = currKey[this.currentLang].sml;
            }
          } else if (this.isShift) {
            a = currKey[this.currentLang].big;
          } else {
            a = currKey[this.currentLang].sml;
          }

          this.textarea.value = this.textarea.value.slice(0, this.textarea.selectionStart) + a
            + this.textarea.value.slice(this.textarea.selectionEnd);
          currposition += 1;
        }

        this.textarea.selectionStart = currposition;
        this.textarea.selectionEnd = currposition;

        e.preventDefault();
      }
    });

    document.addEventListener('mouseup', () => {
      this.textarea.focus();
      if (this.mousePressedKey) {
        this.keyUp(this.mousePressedKey);
      }
    });

    document.addEventListener('mousedown', (e) => {
      this.textarea.focus();

      const currKey = keys.find((item) => item.code === e.target.id);
      if (currKey) {
        this.keyDown(e.target.id);
      }
    });

    document.addEventListener('keyup', (e) => {
      e.stopImmediatePropagation();

      if (!((e.code === 'CapsLock') && (this.isCaps))) {
        const key = document.querySelector(`#${e.code}`);

        if (key) {
          key.classList.remove('button_active');
        }
      }

      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.isShift = false;
      }

      if ((e.code === 'CapsLock') || (e.code === 'ShiftLeft') || (e.code === 'ShiftRight')) {
        this.reDrawButtons();
      }
    });
  }
}

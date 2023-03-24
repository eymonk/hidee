(function () {
  const symbols = Array.from(new Set('tч !0"щэюя#)./1CDdЙO4G£шHI69:>ъь?}RS[\\ВГ^_`~@AеBL&\'(lСMцNPЕ5ЁЖЗQTUpqrVлWдeжXbmуфYZ*о+aйcfgCкDhijkРnЬЭЮosuvEFwxyzАМБДИ{|КЛ2бв3НОПТУ$ы%ФХЦ]ЧШ;<=ЩЪЫЯагзи7ё8мнJKрп,-стх'));
  const lastIndex = symbols.length - 1;
  const dom = {
    input: document.querySelector('.encryptor__input'),
    notification: document.querySelector('.encryptor__notification'),
    encryptBtn: document.querySelector('.encryptor__button_encrypt'),
    decryptBtn: document.querySelector('.encryptor__button_decrypt'),
    copyBtn: document.querySelector('.encryptor__button_copy'),
    clearBtn: document.querySelector('.encryptor__button_clear'),
  };


  function getRandomInRange(rangeStart, rangeEnd) {
    return Math.round(Math.random() * (rangeEnd - rangeStart)) + rangeStart;
  }


  let notificationTimeout = null;
  function notify(message) {
    if (notificationTimeout) clearTimeout(notificationTimeout);
    dom.notification.innerText = message;
    dom.notification.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    notificationTimeout = setTimeout(() => {
      dom.notification.innerText = '';
    }, 2500);
  }


  function copy() {
    const text = dom.input.value;
    navigator.clipboard.writeText(text);
    dom.input.focus();
    notify('copied');
  }


  function clear() {
    dom.input.value = '';
    dom.input.focus();
    notify('cleared');
  }


  function changeCounter(counter, step) {
    const counterRange = 100;

    counter += step;
    if (counter > counterRange) counter -= counterRange;

    return counter;
  }


  function reindex(inputSymbols, counter, step) {
    const reindexedSymbols = [];

    function findNewIndex(symbolIndex) {
      let newIndex;
      counter = changeCounter(counter, step);
      if (symbolIndex + counter > lastIndex) newIndex = (symbolIndex + counter) - lastIndex - 1;
      else newIndex = symbolIndex + counter;
      return newIndex;
    }

    for (let i = 0; i < inputSymbols.length; i++) {
      if (inputSymbols[i] === '\n') inputSymbols[i] = ' ';
      const newIndex = findNewIndex(symbols.indexOf(inputSymbols[i]));
      reindexedSymbols.push(symbols[newIndex]);
    }

    return reindexedSymbols;
  }


  function encrypt() {
    if (dom.input.value) {
      const inputSymbols = dom.input.value.split('');
      const step = getRandomInRange(2, 8);
      const counterInitialValue = getRandomInRange(1, 8);
      const deceiveSymbols = [];
      const deceiveSymbolsLength = getRandomInRange(11, 30);
      let counter = counterInitialValue;

      for(let i = deceiveSymbolsLength; i > 0; i--) {
        const randomSymbolIndex = getRandomInRange(0, symbols.length);
        deceiveSymbols.push(symbols[randomSymbolIndex]);
      };

      const newSymbols = reindex(inputSymbols, counter, step);
      let encipheredText = newSymbols.join('');
      for (let i = deceiveSymbolsLength - 1; i > 0; i--) encipheredText = `${encipheredText}${deceiveSymbols[i]}`;
      encipheredText = `${encipheredText}${counterInitialValue}${step}${deceiveSymbolsLength}`

      dom.input.value = encipheredText;
      notify('encrypted');
    } else notify('nothing to encrypt');
  }


  function decrypt() {
    if (dom.input.value) {
      const decryptedSymbols = [];
      const encryptedSymbols = [...dom.input.value];
      const deceiveSymbolsLength = parseInt([encryptedSymbols.pop(), encryptedSymbols.pop()].reverse().join(''));
      const step = parseInt(encryptedSymbols.pop());
      let counter = parseInt(encryptedSymbols.pop());

      for(let i = deceiveSymbolsLength - 1; i > 0; i--) encryptedSymbols.pop();

      encryptedSymbols.forEach((symbol) => {
        counter = changeCounter(counter, step);
        let oldIndex = symbols.indexOf(symbol) - counter;
        if (oldIndex < 0) oldIndex += lastIndex + 1;
        decryptedSymbols.push(symbols[oldIndex]);
      });

      dom.input.value = decryptedSymbols.join('');
      notify('decrypted');
    } else notify('nothing to decrypt');
  }


  dom.encryptBtn.addEventListener('click', encrypt);
  dom.decryptBtn.addEventListener('click', decrypt);
  dom.copyBtn.addEventListener('click', copy);
  dom.clearBtn.addEventListener('click', clear);

  const messageToUser = `Hello!\n   This is very simple way to encrypt your conversation with someone. All you need is just paste your message here and press "encrypt" button, then "copy" button and then send result to your interlocutor, who in it's turn goes here and decrypts the message.\n   The key thing here is that nobody knows this site, so there is practically no chances that your messages will be decrypted.\n   I understand that it's very far from a robust strategy, but it is what it is)\n   Good luck!`;
  dom.input.value = messageToUser;
  notify('qq)');
}());
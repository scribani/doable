const DOMHandler = (() => {
  return {
    render: (page) => {
      const container = document.querySelector(".js-content");
      container.innerHTML = page.render();
      page.initListeners();
    },
  };
})();

export default DOMHandler;

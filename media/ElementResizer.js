class ElementResizer {
  static get MIN_WIDTH() {
    return 64;
  }

  constructor(gitGraphView, colHeadersElem, cols, resizeClassName) {
    this.stopResizing = this.stopResizing.bind(this);
    this.makeTableFixedLayout = this.makeTableFixedLayout.bind(this);
    this.resize = this.resize.bind(this);

    this.gitGraphView = gitGraphView;
    this.colHeadersElem = colHeadersElem;
    this.cols = cols;

    this.columnWidths = gitGraphView.gitRepos[gitGraphView.currentRepo].columnWidths;

    if (this.columnWidths == null) {
      gitGraphView.tableElem.className = 'autoLayout';
      this.cols[0].style.padding =
        '0 ' +
        Math.round(
          (Math.max(gitGraphView.graph.getWidth() + 16, ElementResizer.MIN_WIDTH) - (this.cols[0].offsetWidth - 24)) / 2
        ) +
        'px';
      this.columnWidths = [
        this.cols[0].clientWidth - 24,
        this.cols[2].clientWidth - 24,
        this.cols[3].clientWidth - 24,
        this.cols[4].clientWidth - 24,
      ];
    }

    this.mouseX = -1;
    this.col = -1;
    Array.from(this.cols).forEach((col, index) => {
      if (index > 0) {
        col.innerHTML += `<span class="${resizeClassName} before" data-col="${index - 1}"></span>`;
      }
      if (index < this.cols.length - 1) {
        col.innerHTML += `<span class="${resizeClassName} after" data-col="${index}"></span>`;
      }
    });
    this.makeTableFixedLayout();

    addListenerToClass(resizeClassName, 'mousedown', e => {
      this.col = parseInt(e.target.dataset.col);
      this.mouseX = e.clientX;
      this.colHeadersElem.classList.add('resizing');
      this.colHeadersElem.addEventListener('mousemove', this.resize);
      this.colHeadersElem.addEventListener('mouseup', this.stopResizing);
      this.colHeadersElem.addEventListener('mouseleave', this.stopResizing);
    });
  }

  stopResizing() {
    this.colHeadersElem.removeEventListener('mousemove', this.resize);
    this.colHeadersElem.removeEventListener('mouseup', this.stopResizing);
    this.colHeadersElem.removeEventListener('mouseleave', this.stopResizing);
    this.col = -1;
    this.colHeadersElem.classList.remove('resizing');
    this.gitGraphView.gitRepos[this.gitGraphView.currentRepo].columnWidths = this.columnWidths;
    sendMessage({
      command: 'saveRepoState',
      repo: this.gitGraphView.currentRepo,
      state: this.gitGraphView.gitRepos[this.gitGraphView.currentRepo],
    });
  }

  makeTableFixedLayout() {
    this.cols[0].style.width = this.columnWidths[0] + 'px';
    this.cols[0].style.padding = '';
    this.cols[2].style.width = this.columnWidths[1] + 'px';
    this.cols[3].style.width = this.columnWidths[2] + 'px';
    this.cols[4].style.width = this.columnWidths[3] + 'px';
    this.gitGraphView.tableElem.className = 'fixedLayout';
  }

  resize(mouseEvent) {
    if (this.col === -1) {
      return;
    }

    let mouseDeltaX = mouseEvent.clientX - this.mouseX;
    switch (this.col) {
      case 0:
        if (this.columnWidths[0] + mouseDeltaX < 40) {
          mouseDeltaX = -this.columnWidths[0] + 40;
        }
        if (this.cols[1].clientWidth - mouseDeltaX < ElementResizer.MIN_WIDTH) {
          mouseDeltaX = this.cols[1].clientWidth - ElementResizer.MIN_WIDTH;
        }
        this.columnWidths[0] += mouseDeltaX;
        this.cols[0].style.width = this.columnWidths[0] + 'px';
        break;
      case 1:
        if (this.cols[1].clientWidth + mouseDeltaX < ElementResizer.MIN_WIDTH) {
          mouseDeltaX = -this.cols[1].clientWidth + ElementResizer.MIN_WIDTH;
        }
        if (this.columnWidths[1] - mouseDeltaX < 40) {
          mouseDeltaX = this.columnWidths[1] - 40;
        }
        this.columnWidths[1] -= mouseDeltaX;
        this.cols[2].style.width = this.columnWidths[1] + 'px';
        break;
      default:
        if (this.columnWidths[this.col - 1] + mouseDeltaX < 40) {
          mouseDeltaX = -this.columnWidths[this.col - 1] + 40;
        }
        if (this.columnWidths[this.col] - mouseDeltaX < 40) {
          mouseDeltaX = this.columnWidths[this.col] - 40;
        }
        this.columnWidths[this.col - 1] += mouseDeltaX;
        this.columnWidths[this.col] -= mouseDeltaX;
        this.cols[this.col].style.width = this.columnWidths[this.col - 1] + 'px';
        this.cols[this.col + 1].style.width = this.columnWidths[this.col] + 'px';
    }
    this.mouseX = mouseEvent.clientX;
  }
}

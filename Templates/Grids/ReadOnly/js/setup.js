$A.import("Grid", { defer: true }, function() {
  var grid = new $A.Grid("dataGridId");

  // set accessible text for screen reader users
  grid.setAccessibleText({
    // Set offscreen and tooltip text for toggle cells
    toggleButtonRole: "Toggle Button",
    toggleButtonState: "Pressed",
    disabledText: "Disabled",
    // Set the page text to be announced to screen reader users during infinite scrolling. E.G "Page 2", "Page 3", etc.
    pageRole: "Page",
    // Set the active state and help tooltip text for mouse users
    editLinkAction: "Editable",
    dblClickTitle: "Click to activate",
    // Set the title text for the edit field
    editFieldTitle: "Press Enter to save, or Escape to cancel."
  });

  grid.mapColumnNames([
    {
      id: "row-id",
      lbl: "ID",
      colClass: "gridcell-col1"
    },
    {
      id: "personal-name",
      lbl: "Name",
      colClass: "gridcell-col2"
    },
    {
      id: "personal-email",
      lbl: "Email",
      colClass: "gridcell-col3"
    },
    {
      id: "personal-city",
      lbl: "Residence",
      colClass: "gridcell-col4"
    },
    {
      id: "personal-university",
      lbl: "University",
      colClass: "gridcell-col5"
    },
    {
      id: "personal-status",
      lbl: "Attendance",
      colClass: "gridcell-col6"
    }
  ]);

  grid.enableRowHeaders(true, "row-id");
  grid.setRowMax(11);

  var pageHeaderSpan = $A.get("pTotal"),
    pageEdit = $A.get("goTo"),
    pageCurrent = 0,
    pageTotal = 0,
    firstBtn = $A.get("btnFirst"),
    prevBtn = $A.get("btnPrev"),
    nextBtn = $A.get("btnNext"),
    lastBtn = $A.get("btnLast"),
    pgn = $A.get("pgn");

  grid.setPageIndexChangeListener(function(
    currentPage,
    totalPages,
    gridInstance
  ) {
    if (pageCurrent != currentPage) {
      if (currentPage === 1) {
        firstBtn.disabled = prevBtn.disabled = true;
      } else {
        firstBtn.disabled = prevBtn.disabled = false;
      }

      if (currentPage === totalPages) {
        nextBtn.disabled = lastBtn.disabled = true;
      } else {
        nextBtn.disabled = lastBtn.disabled = false;
      }
    }
    pageTotal = totalPages;
    pageHeaderSpan.innerHTML = "Page " + currentPage + " of " + totalPages;
    pageEdit.value = pageCurrent = currentPage;
  });

  // Fires every time a grid object is opened in the DOM
  grid.setOpenListener(function(container, dc, gridInstance) {
    pgn.hidden = false;
    pageHeaderSpan.innerHTML = "Page " + pageCurrent + " of " + pageTotal;
  });

  // Fires every time a grid object is closed in the DOM
  grid.setCloseListener(function(container, dc, gridInstance) {
    pageHeaderSpan.innerHTML = "";
    pgn.hidden = true;
  });

  grid.open();

  // Load test records
  var spin = 2,
    tIndex = 0,
    dataRows = [];

  for (tIndex; tIndex <= 1071; tIndex++) {
    dataRows.push({
      id: tIndex,
      cells: {
        "row-id": {
          readonly: true,
          value: tIndex
        },
        "personal-name": {
          value:
            spin === 2
              ? "Rincewind"
              : spin === 1
              ? "Ponder Stibbons"
              : "Hrun the Barbarian"
        },
        "personal-email": {
          value:
            spin === 2
              ? "wizzard@whatsock.com"
              : spin === 1
              ? "ponder@whatsock.com"
              : "aarg@whatsock.com"
        },
        "personal-city": {
          value: "Ankh-Morpork"
        },
        "personal-university": {
          value: spin === 2 || spin === 1 ? "Unseen University" : "Gruntings"
        },
        "personal-status": {
          type: "toggle",
          name: "Active",
          value: spin === 2 ? false : true
        }
      }
    });

    if (!spin) spin = 2;
    else spin -= 1;
  }

  // Use the .add() method to import data table rows
  grid.add(dataRows);
  grid.openPage(1);

  // Set pagination bindings
  $A.on("button.paginate", "click", function(ev) {
    var o = this,
      open = false;

    if (o.id == "btnFirst" && pageCurrent > 1) {
      grid.firstPage();
      open = true;
    } else if (o.id == "btnPrev" && pageCurrent > 1) {
      grid.prevPage();
      open = true;
    } else if (o.id == "btnNext" && pageCurrent < pageTotal) {
      grid.nextPage();
      open = true;
    } else if (o.id == "btnLast" && pageCurrent < pageTotal) {
      grid.lastPage();
      open = true;
    } else if (o.id == "btnGo") {
      var val = Math.floor(pageEdit.value);

      if (val > 0 && val <= pageTotal && val !== pageCurrent) {
        grid.openPage(val);
        open = true;
      } else pageEdit.value = pageCurrent;
    }

    if (open) {
      $A.announce("Page " + pageCurrent);
      grid.focus();
    }
    ev.preventDefault();
  });
  $A.on(pageEdit, "keydown", function(ev) {
    var k = ev.which || ev.keyCode;

    if (k == 13) {
      $A.trigger("#btnGo", "click");
      ev.preventDefault();
    }
  });

  $A.on("#buv", "click", function(ev) {
    // Programmatically update a value anywhere within the grid using it's rowID/colID index
    grid.setValue(5, "personal-email", "HOOAH@whatsock.com");
    "Cell Updated".announce();
    ev.preventDefault();
  });
});

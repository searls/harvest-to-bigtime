(function() {
  var h;

  h = window.HarvestToBigtime || (window.HarvestToBigtime = {});

  (function($, _) {
    var addExpense, dialogIsVisible, getNextRow, openForm, parseCsv, perchance;
    addExpense = function() {
      var expense;
      expense = parseCsv(getNextRow());
      openForm("ProjectNm");
      return perchance({
        thisHappens: function() {
          return dialogIsVisible("Projects");
        },
        doThis: function() {
          $("#tableSection a.list-item:contains(\"" + expense.project + "\")", $("#IF_DIALOG")[0].contentWindow.document).trigger("click");
          openForm("LK_SHOW_CatSID");
          return perchance({
            thisHappens: function() {
              return dialogIsVisible("Expense Categories");
            },
            doThis: function() {
              $("#tableSection .list-item a:contains(\"" + expense.category + "\")", $("#IF_DIALOG")[0].contentWindow.document).trigger("click");
              $(":input[name=Dt]").val(expense.date);
              $(":input[name=CostIN]").val(expense.cost);
              $("textarea[name=Nt]").text(expense.notes);
              return $("#cmdGO").trigger("click");
            }
          });
        }
      });
    };
    openForm = function(name) {
      return $(":input[name=\"" + name + "\"]").siblings("img").trigger("click");
    };
    perchance = function(config) {
      var id;
      return id = setInterval(function() {
        if (config.thisHappens()) {
          config.doThis();
          return clearInterval(id);
        }
      }, 100);
    };
    getNextRow = function() {
      var csv, first, leftovers;
      csv = (sessionStorage["harvestExpenseReport"] || (prompt("Paste your Harvest CSV export:").split("\n").slice(1).join("\n"))).split("\n");
      first = csv.shift();
      leftovers = csv.join("\n");
      if (/\S/.test(leftovers)) {
        sessionStorage["harvestExpenseReport"] = leftovers;
      } else {
        delete sessionStorage["harvestExpenseReport"];
      }
      return first;
    };
    parseCsv = function(row) {
      var vals;
      vals = row.split(/,(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/);
      return {
        date: (function() {
          var d;
          d = "2011-11-28".split(/-/);
          return d[1] + "/" + d[2] + "/" + d[0];
        })(),
        project: vals[2],
        category: vals[4],
        cost: vals[9],
        notes: vals[8]
      };
    };
    dialogIsVisible = function(title) {
      return $("#tableSection .list-head:contains(\"" + title + "\")", $("#IF_DIALOG")[0].contentWindow.document).is(":visible");
    };
    return $(function() {
      $("<span class=\"quick-add-expense\">Quick Expense</span>").insertAfter("#cmdGO").css({
        display: "inline-block",
        padding: "3px",
        background: "white",
        border: "1px solid black",
        margin: "0px 15px 0px 5px",
        cursor: "hand"
      }).on("click", addExpense);
      if (sessionStorage["harvestExpenseReport"]) {
        return addExpense();
      }
    });
  })(h.$, h._);

}).call(this);

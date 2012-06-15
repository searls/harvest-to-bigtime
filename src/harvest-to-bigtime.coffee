###
harvest-to-bigtime @@VERSION@@

site: https://searls.github.com/harvest-to-bigtime

@depend ../vendor/jquery-no-conflict.js
@depend ../vendor/underscore-no-conflict.js

###

h = window.HarvestToBigtime ||= {}

( ($,_)->
  addExpense = ->
    expense = parseCsv(getNextRow())
    openForm "ProjectNm"
    perchance
      thisHappens: ->
        dialogIsVisible "Projects"

      doThis: ->
        $("#tableSection a.list-item:contains(\"" + expense.project + "\")", $("#IF_DIALOG")[0].contentWindow.document).trigger "click"
        openForm "LK_SHOW_CatSID"
        perchance
          thisHappens: ->
            dialogIsVisible "Expense Categories"

          doThis: ->
            $("#tableSection .list-item a:contains(\"" + expense.category + "\")", $("#IF_DIALOG")[0].contentWindow.document).trigger "click"
            $(":input[name=Dt]").val expense.date
            $(":input[name=CostIN]").val expense.cost
            $("textarea[name=Nt]").text expense.notes
            $("#cmdGO").trigger "click"

  openForm = (name) ->
    $(":input[name=\"" + name + "\"]").siblings("img").trigger "click"

  perchance = (config) ->
    id = setInterval(->
      if config.thisHappens()
        config.doThis()
        clearInterval id
    , 100)

  getNextRow = ->
    csv = (sessionStorage["harvestExpenseReport"] or (prompt("Paste your Harvest CSV export:").split("\n").slice(1).join("\n"))).split("\n")
    first = csv.shift()
    leftovers = csv.join("\n")
    if /\S/.test(leftovers)
      sessionStorage["harvestExpenseReport"] = leftovers
    else
      delete sessionStorage["harvestExpenseReport"]
    first

  parseCsv = (row) ->
    vals = row.split(/,(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/)
    date: (->
      d = "2011-11-28".split(/-/)
      d[1] + "/" + d[2] + "/" + d[0]
    )()
    project: vals[2]
    category: vals[4]
    cost: vals[9]
    notes: vals[8]

  dialogIsVisible = (title) ->
    $("#tableSection .list-head:contains(\"" + title + "\")", $("#IF_DIALOG")[0].contentWindow.document).is ":visible"

  $ ->
    $("<span class=\"quick-add-expense\">Quick Expense</span>").insertAfter("#cmdGO").css(
      display: "inline-block"
      padding: "3px"
      background: "white"
      border: "1px solid black"
      margin: "0px 15px 0px 5px"
      cursor: "hand"
    ).on "click", addExpense
    addExpense()  if sessionStorage["harvestExpenseReport"]
)(h.$,h._)


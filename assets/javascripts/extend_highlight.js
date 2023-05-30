window.addEventListener("DOMContentLoaded", function () {
  if (!/issues\/gantt(|\/)$/.test(location.pathname)) return;

  // config
  const highlightColor = "#ffffdd";
  const highlightHeight = $("div.gantt_subjects div.issue-subject")
    .eq(0)
    .css("height");

  // add style to the head tag
  function addStyleToHead() {
    if ($("#extend_highlight_style").length > 0) return;

    $("head").append(
      '<style type="text/css" id="extend_highlight_style">' +
        "#gantt_highlight > div.hover " +
        "{background-color: " +
        highlightColor +
        ";}" +
        "</style>"
    );
  }

  // add #gantt_highlight element
  function addElements() {
    if ($("#gantt_highlight").length > 0) return;

    // add dummy form to support collapse-expand function
    const $ganttHighlight = $("<form/>").attr("id", "gantt_highlight");
    $("#gantt_area").prepend($ganttHighlight);

    // add background highlight to each tasks
    $("div.gantt_subjects > form > div.issue-subject").each(function (
      _,
      element
    ) {
      const $element = $(element);
      const json = $element.data("collapse-expand");
      const numberOfRows = $element.data("number-of-rows");
      const $ganttHighlightTask = $("<div/>")
        .addClass("leaf gantt_highlight")
        .attr("data-collapse-expand", json.obj_id)
        .attr("data-number-of-rows", numberOfRows)
        .css({
          position: "absolute",
          top: $element.css("top"),
          width: $("#gantt_area>div.gantt_hdr:first").css("width"),
          height: highlightHeight,
          zIndex: "auto",
        });
      $ganttHighlight.append($ganttHighlightTask);
    });
  }

  // update gantt highlight state
  function updateGanttHighlightState(element, display, tag) {
    const json = $(element).data("collapse-expand");
    const numberOfRows = $(element).data("number-of-rows");
    let objId = json.obj_id;
    if (objId == undefined) {
      objId = json;
    }
    const $taskBars =
      "#gantt_highlight > div" +
      '[data-collapse-expand="' +
      objId +
      '"]' +
      '[data-number-of-rows="' +
      numberOfRows +
      '"]';
    $($taskBars).each(function (_, task) {
      const $task = $(task);
      if (display === true) {
        $task.addClass(tag);
      } else {
        $task.removeClass(tag);
      }
    });
  }

  // update highlight for issue-subject
  function updateGanttHighlightSubject(issueId, color) {
    try {
      $("#" + issueId).css("background-color", color);
    } catch (err) {
      $("div.gantt_subjects div.issue-subject").css("background-color", "");
    }
  }

  // hover event for gantt-area-object
  function hoverGanttAreaObject(element, color) {
    const objId = $(element).attr("data-collapse-expand");
    const isIssue = objId.indexOf("issue-") > -1;
    if (isIssue) {
      updateGanttHighlightSubject(objId, color);
      if (color === "") {
        updateGanttHighlightState(element, false, "hover");
      } else {
        updateGanttHighlightState(element, true, "hover");
      }
    }
  }

  function addEvents() {
    // set hover event for gantt-issue-subject
    $("div.gantt_subjects div.issue-subject")
      .on("mouseenter.extendHighlight", function () {
        updateGanttHighlightState(this, true, "hover");
      })
      .on("mouseleave.extendHighlight", function () {
        updateGanttHighlightState(this, false, "hover");
      });

    // set hover event for gantt-tooltip
    $("#gantt_area div.tooltip")
      .on("mouseenter.extendHighlight", function () {
        hoverGanttAreaObject(this, highlightColor);
      })
      .on("mouseleave.extendHighlight", function () {
        hoverGanttAreaObject(this, "");
      });
  }

  function setMutationObserver() {
    const observerSubjectSelectionChanged = new MutationObserver(function (
      mutations
    ) {
      for (let i = 0; i < mutations.length; i++) {
        const $target = $(mutations[i].target);
        updateGanttHighlightState(
          $target,
          $target.hasClass("context-menu-selection"),
          "context-menu-selection"
        );
      }
    });

    $("div.gantt_subjects > form > div.issue-subject.hascontextmenu").each(
      function () {
        observerSubjectSelectionChanged.observe(this, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }
    );

    // TODO: Support for behavior when a bar is selected
    // $('#gantt_area > form > div.tooltip.hascontextmenu').each(
    //     function () {
    //         observer_subject_selection_changed.observe(
    //             this,
    //             {
    //                 attributes: true,
    //                 attributeFilter: ['class']
    //             });
    //     }
    // )
  }

  function initialize() {
    addStyleToHead();
    addElements();
    addEvents();
    setMutationObserver();
  }

  // Initialize
  initialize();
});

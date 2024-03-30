window.addEventListener("DOMContentLoaded", function () {
  if (!/issues\/gantt(|\/)$/.test(location.pathname)) return;

  function setSubjectWidth() {
    const subjectWidth = GanttTweak["subjectWidth"];

    if (subjectWidth == null || subjectWidth <= 0) {
      return;
    }

    $("td.gantt_subjects_column").css({
      width: subjectWidth + "px",
    });

    $(
      "td.gantt_subjects_column .gantt_hdr, " +
        "td.gantt_subjects_column .gantt_subjects_container"
    ).css({
      width: subjectWidth - 1 + "px",
    });

    $(".gantt_subjects>form>div").each(function () {
      const left = parseFloat($(this).css("left"));
      $(this).css("width", subjectWidth - left);
    });
  }

  function displayTooltipNearTheMouseCursor() {
    $("#gantt_area > form > div.tooltip").on("mouseenter", function (e) {
      if ($(this).children("span.tip").length > 0) {
        let x = e.offsetX;
        if (x > 0) {
          const tipWidth = $(this).children("span.tip").width();
          const marginRight = 25;
          if (e.clientX + tipWidth > $(document).width() - marginRight) {
            x =
              $(document).width() -
              tipWidth -
              $(this).offset().left -
              marginRight;
          }
          $(this).children("span.tip").css("margin-left", x);
        }
      }
    });
  }

  function addTitleToSelectedColumn() {
    $(".gantt_selected_column_content>div").each(function () {
      if (typeof $(this).attr("title") === "undefined") {
        $(this).attr("title", $(this).text());
      }
    });
  }

  function initialize() {
    setSubjectWidth();
    displayTooltipNearTheMouseCursor();
    addTitleToSelectedColumn();
  }
  
  initialize();

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        initialize();
      }
    });
  }).observe($("table.gantt-table")[0], { childList: true });
});

	
window.addEventListener('DOMContentLoaded', function () {
    var subject_width = GanttTweak['subject_width'];
    
    if (subject_width == null || subject_width <= 0) {
        return;
    }

    $('td.gantt_subjects_column').css({
        'width': subject_width + 'px'
    });

    $(
        'td.gantt_subjects_column .gantt_hdr, ' +
        'td.gantt_subjects_column .gantt_subjects_container'
    ).css({
        'width': (subject_width - 1) + 'px'
    });

    $('.gantt_subjects>form>div').each(function (index) {
        var left = parseFloat($(this).css('left'));
        $(this).css('width', subject_width - left);
    });

    function displayTooltipNearTheMouseCursor() {
        $('#gantt_area > form > div.tooltip').on("mouseenter", function(e) {
            if($(this).children('span.tip').length > 0)
            {
                var x = e.offsetX;
                if (x > 0)
                {
                    var tipWidth = $(this).children('span.tip').width();
                    var margin_right = 25;
                    if (e.clientX + tipWidth > $(document).width() - margin_right) {
                        x = ($(document).width() - tipWidth) - $(this).offset().left - margin_right;
                    }
                    $(this).children('span.tip').css('margin-left', x);
                }
            }
        });
    }
    displayTooltipNearTheMouseCursor();

    function addTitleToSelectedColumn() {
        $('.gantt_selected_column_content>div').each(function (index) {
            if (typeof $(this).attr('title') === 'undefined') {
                $(this).attr('title', $(this).text());
            }
        });
    }
    addTitleToSelectedColumn();
});
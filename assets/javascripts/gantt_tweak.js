	
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
});
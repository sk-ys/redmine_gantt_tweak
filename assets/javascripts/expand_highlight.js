window.addEventListener('DOMContentLoaded', function () {
    // config
    var highlight_color = '#ffffdd';
    var highlight_height = $($('div.gantt_subjects div.issue-subject')[0]).css('height');

    // add gantt_highlight element
    var add_elements = function () {
        if ($('#gantt_highlight').length > 0) return;
        $('#gantt_area').prepend('<div id="gantt_highlight"></div>');
        $('#gantt_highlight').css({
            position: 'absolute',
            display: 'none',
            top: 0,
            left: 0,
            width: $('#gantt_area>div.gantt_hdr:first').css('width'),
            height: highlight_height,
            backgroundColor: highlight_color
        });
    }

    // define update highlight function for gantt_highlight
    var update_gantt_highlight_position = function(elem){
        try {
            $('#gantt_highlight').show();
            $('#gantt_highlight').css('top', $(elem).css('top'));
        } catch(err) {
            $('#gantt_highlight').hide();
        }
    }

    // define update highlight function for issue-subject
    var update_gantt_highlight_subject = function(issue_id, color){
        try {
            $('#' + issue_id).css('background-color', color);
        } catch(err) {
            $('div.gantt_subjects div.issue-subject').css('background-color', '');
        }
    }

    // define hover event function for gantt-area-object
    var hover_gantt_area_object = function(elem, color){
        var issue_id = $(elem).attr('data-collapse-expand');
        if (issue_id.indexOf('issue-')>-1) {
            update_gantt_highlight_subject(issue_id, color);
            if (color === '') {
                $('#gantt_highlight').hide();
            } else {
                update_gantt_highlight_position(elem);
            }
        } else {
            $('#gantt_highlight').hide();
            $('div.gantt_subjects div.issue-subject').css('background-color', '');
        }
    }

    // Add hover events to labels to prevent duplicate events
    var add_hover_event_to_label = function ($elem, handlerIn, handlerOut) {
        var label = 'expand_highlight';
        if ($elem.data(label)) return false;
        $elem.hover(handlerIn, handlerOut);
        $elem.data(label, 1);
        return true;
    }

    var add_events = function () {
        // チケット項目名にマウスオーバーイベントを追加
        // set hover event for gantt-issue-subject
        add_hover_event_to_label(
            $('div.gantt_subjects div.issue-subject'),
            function(){
                update_gantt_highlight_position(this);
            }, function(){  // unhover
                $('#gantt_highlight').hide();
            });

        // set hover event for gantt-tooltip
        add_hover_event_to_label(
            $('#gantt_area div.tooltip'),
            function(){
                hover_gantt_area_object(this, highlight_color);
            }, function(){  // unhover
                hover_gantt_area_object(this, '');
            });

        // set hover event for gantt-task
        $('#gantt_area div.task').css('z-index', 1);
        add_hover_event_to_label(
            $('#gantt_area div.task'),
            function(){
                hover_gantt_area_object(this, highlight_color);
            }, function(){  // unhover
                hover_gantt_area_object(this, '');
            });
    }
    add_events();

    var initialize = function () {
        add_elements();
        add_events();
    }
    
    var set_mutation_observer = function () {
        var timerId = null;
        var observer_table_child_list_change =
            new MutationObserver(function (mutations) {
                // ignore svg
                var flg = false;
                for(var i=0; i<mutations.length; i++) {
                    if (mutations[i].target.tagName !== 'svg')  {
                        flg = true;
                        break;
                    }
                }
                if (!flg) return;

                if (typeof timerId === 'number') {
                    clearTimeout(timerId);
                }
                timerId = setTimeout(function () {
                    initialize();
                }, 1000);
            });
        
        observer_table_child_list_change.observe(
        $('table.gantt-table:first')[0], {
            childList : true,
            subtree: true
        });
    }

    // initialze
    $.when()
        .then(initialize)
        .then(set_mutation_observer);
});
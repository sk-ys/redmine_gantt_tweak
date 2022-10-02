window.addEventListener('DOMContentLoaded', function () {
    // config
    let highlight_color = '#ffffdd';
    let highlight_height =
        $($('div.gantt_subjects div.issue-subject')[0]).css('height');

    // add style in head
    $('head').append(
        '<style type="text/css">' +
        '#gantt_highlight > div.hover ' +
        '{background-color: ' + highlight_color + ';}' +
        '</style>');

    // add gantt_highlight element
    let add_elements = function () {
        if ($('#gantt_highlight').length > 0) return;

        // add dummy form to support collapse-expand function
        let $gantt_highlight = $('<form id="gantt_highlight"></form>');
        $('#gantt_area').prepend($gantt_highlight);

        // add background highright to each tasks
        $('div.gantt_subjects > form > div.issue-subject')
            .each(function (i, element) {
                let el = $(element);
                let json = el.data('collapse-expand');
                let number_of_rows = el.data('number-of-rows');
                let $gantt_highlight_task =
                    $('<div class="leaf gantt_highlight"></div>')
                        .attr('data-collapse-expand', json.obj_id)
                        .attr('data-number-of-rows', number_of_rows)
                        .css({
                            position: 'absolute',
                            // display: 'none',
                            top: el.css('top'),
                            width: $('#gantt_area>div.gantt_hdr:first')
                                .css('width'),
                            height: highlight_height,
                            // backgroundColor: highlight_color,
                            zIndex: 'auto'
                        });
                $gantt_highlight.append($gantt_highlight_task);
            });
    }

    // define update highlight function for gantt_highlight
    let update_gantt_highlight_state =
        function (element, display, tag) {
            let el = $(element);
            let json = el.data('collapse-expand');
            let number_of_rows = el.data('number-of-rows');
            let obj_id = json.obj_id;
            if (obj_id == undefined) {
                obj_id = json;
            }
            let el_task_bars =
                '#gantt_highlight > div' +
                '[data-collapse-expand="' + obj_id + '"]' +
                '[data-number-of-rows="' + number_of_rows + '"]';
            $(el_task_bars).each(function (_, task) {
                let el_task = $(task);
                if (display === true) {
                    el_task.addClass(tag);
                } else {
                    el_task.removeClass(tag);
                }
            });
        }

    // define update highlight function for issue-subject
    let update_gantt_highlight_subject = function (issue_id, color) {
        try {
            $('#' + issue_id).css('background-color', color);
        } catch (err) {
            $('div.gantt_subjects div.issue-subject')
                .css('background-color', '');
        }
    }

    // define hover event function for gantt-area-object
    let hover_gantt_area_object = function (element, color) {
        let el = $(element);
        let obj_id = el.attr('data-collapse-expand');
        let is_issue = obj_id.indexOf('issue-') > -1;
        if (is_issue) {
            update_gantt_highlight_subject(obj_id, color);
            if (color === '') {
                update_gantt_highlight_state(element, false, 'hover');
            } else {
                update_gantt_highlight_state(element, true, 'hover');
            }
        }
    }

    // Add hover events to labels to prevent duplicate events
    let add_hover_event_to_label = function ($elem, handlerIn, handlerOut) {
        let label = 'expand_highlight';
        if ($elem.data(label)) return false;
        $elem.hover(handlerIn, handlerOut);
        $elem.data(label, 1);
        return true;
    }

    let add_events = function () {
        // チケット項目名にマウスオーバーイベントを追加
        // set hover event for gantt-issue-subject
        add_hover_event_to_label(
            $('div.gantt_subjects div.issue-subject'),
            function () {
                update_gantt_highlight_state(this, true, 'hover');
            },
            function () {
                update_gantt_highlight_state(this, false, 'hover');
            });

        // set hover event for gantt-tooltip
        add_hover_event_to_label(
            $('#gantt_area div.tooltip'),
            function () { hover_gantt_area_object(this, highlight_color); },
            function () { hover_gantt_area_object(this, ''); });
    }



    let initialize = function () {
        add_elements();
        add_events();
    }

    var set_mutation_observer = function () {
        var observer_subject_selection_changed =
            new MutationObserver(function (mutations) {
                for(var i=0; i<mutations.length; i++) {
                    var el = $(mutations[i].target);
                    update_gantt_highlight_state(
                        el,
                        el.hasClass('context-menu-selection'),
                        'context-menu-selection');
                }
            });

        $('div.gantt_subjects > form > div.issue-subject.hascontextmenu').each(
            function () {
                observer_subject_selection_changed.observe(
                    this,
                    {
                        attributes: true,
                        attributeFilter: ['class']
                    });
            }
        )

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

    // initialze
    $.when()
        .then(initialize)
        .then(set_mutation_observer);
});
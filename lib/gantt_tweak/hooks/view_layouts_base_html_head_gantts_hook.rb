module GanttTweak
  module Hooks
    class ViewLayoutsBaseHtmlHeadGanttsHook < Redmine::Hook::ViewListener
      def view_layouts_base_html_head(context={})
        return unless context[:controller]
        
        params = context[:controller].params
        if params[:controller] == 'gantts'
          view_layouts_base_html_head_gantts(context)
        end

        return
      end

      def view_layouts_base_html_head_gantts(context)
        project = context[:project]
        return if project.blank?
        
        settings = Setting.plugin_redmine_gantt_tweak[project.id.to_s]
        if settings.blank?
          settings = Setting.plugin_redmine_gantt_tweak['0']
        end

        subject_width = settings[:subject_width]
        if subject_width.blank?
          subject_width = Setting.plugin_redmine_gantt_tweak['0'][:subject_width]
        end
        context[:subject_width] = subject_width

        context[:hook_caller].send(:render, {
          partial: '/gantt_tweak/hooks/view_layouts_base_html_head_gantts',
          locals: context
        })
      end
    end
  end
end

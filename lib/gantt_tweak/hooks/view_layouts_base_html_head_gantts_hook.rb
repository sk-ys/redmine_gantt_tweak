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
        if project.present?
          if Setting.plugin_redmine_gantt_tweak.has_key?(project.id.to_s)
            context[:subject_width] =
              Setting.plugin_redmine_gantt_tweak[project.id.to_s][:subject_width]
          end
        end
        
        if context[:subject_width].blank?
          context[:subject_width] =
            Setting.plugin_redmine_gantt_tweak['0'][:subject_width]
        end

        context[:hook_caller].send(:render, {
          partial: '/gantt_tweak/hooks/view_layouts_base_html_head_gantts',
          locals: context
        })
      end
    end
  end
end

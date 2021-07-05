require_dependency 'projects_helper'

module GanttTweak
  module Patches
    module ProjectsHelperPatch
      def project_settings_tabs
        tabs = super
        if User.current.allowed_to?(:manage_gantt_tweak, @project) &&
          @project.module_enabled?(:gantt_tweak)
          @settings = Setting.plugin_redmine_gantt_tweak

          if @settings[@project.id.to_s].blank?
            @settings[@project.id.to_s] = Setting.plugin_redmine_gantt_tweak['0']
          end

          Setting.plugin_redmine_gantt_tweak['0'].each do |key, value|
            if (! @settings[@project.id.to_s].has_key?(key)) || @settings[@project.id.to_s][key].blank?
              @settings[@project.id.to_s][key] = Setting.plugin_redmine_gantt_tweak['0'][key]
            end
          end

          Rails.logger.info @settings

          tabs << {
            name: 'gantt_tweak',
            partial: '/gantt_tweak/form',
            label: :label_gantt_tweak
          }
        end
        tabs
      end
    end
  end
end

ProjectsController.send :helper, GanttTweak::Patches::ProjectsHelperPatch

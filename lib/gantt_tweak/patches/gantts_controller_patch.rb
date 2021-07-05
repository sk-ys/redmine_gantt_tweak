module GanttTweak
    module Patches
      module GanttsControllerPatch
        def self.included(base)
          base.send(:include, InstanceMethods)
          base.class_eval do
            alias_method :show_without_tweak, :show
            alias_method :show, :show_with_tweak
          end
        end

        module InstanceMethods
          def show_with_tweak
            if @project.blank? || (! @project.module_enabled?(:gantt_tweak))
              settings = Setting.plugin_redmine_gantt_tweak['0']
              if settings.blank?
                settings = {'month_shift': '0'}
              end
            else
              settings = Setting.plugin_redmine_gantt_tweak[@project.id.to_s]
              if settings.blank?
                settings = Setting.plugin_redmine_gantt_tweak['0']
              end
            end

            if params[:month].blank?
              month_shift = settings['month_shift'].to_i
              month_shift = month_shift.blank? ? 0 : month_shift
              month = Date.today.strftime("%m").to_i + month_shift

              params[:year] = Date.today.strftime("%Y").to_i + (month/12).floor
              params[:month] = month % 12
            end
            show_without_tweak
          end
        end
      end
    end
  end

  base = GanttsController
  patch = GanttTweak::Patches::GanttsControllerPatch
  base.send(:include, patch) unless base.included_modules.include?(patch)
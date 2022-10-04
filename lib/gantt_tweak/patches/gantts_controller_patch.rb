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
            else
              settings = Setting.plugin_redmine_gantt_tweak[@project.id.to_s]
              if settings.blank?
                settings = Setting.plugin_redmine_gantt_tweak['0']
              end
            end

            if ! params.has_key?(:months)
              months = settings[:months].to_i
              if months.present?
                params[:months] = months
              end
            end

            if !params.has_key?(:year) && !params.has_key?(:month)
              mode = settings[:mode]
              if mode == "fixed"
                year = settings[:year]
                month = settings[:month]
                if ! params.has_key?(:year) && year.present? && year.to_i > 0
                  params[:year] = year.to_i
                end
                if month.present? && month.to_i > 0 && month.to_i <= 12
                  params[:month] = month.to_i
                end
              else
                offset_months = settings[:offset_months].to_i
                if offset_months.present?
                  month = Date.today.strftime("%m").to_i + offset_months
                  params[:year] = Date.today.strftime("%Y").to_i + (month/12).floor
                  params[:month] = month % 12
                end
              end
            end

            if ! params.has_key?(:zoom)
              params[:zoom] = settings[:zoom].to_i
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
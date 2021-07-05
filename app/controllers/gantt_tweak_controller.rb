class GanttTweakController < ApplicationController

  before_action :find_project_by_project_id
  before_action :authorize

  def edit
    render partial: 'form'
  end

  def update
    Rails.logger.info params

    @settings = Setting.plugin_redmine_gantt_tweak

    project_id = params[:project_id].to_i
    month_shift = params[:month_shift].to_i

    @settings[project_id.to_s] = {'month_shift': month_shift.to_s}

    Setting.send 'plugin_redmine_gantt_tweak=', @settings

    respond_to do |format|
      format.html {
        redirect_back(fallback_location: '/')
      }
      format.js {
        render json: ''
      }
    end
  end

end

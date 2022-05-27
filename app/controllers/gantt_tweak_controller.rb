class GanttTweakController < ApplicationController

  before_action :find_project_by_project_id
  # before_action :authorize  # TODO:

  def edit
    render partial: 'form'
  end

  def update
    @settings = Setting.plugin_redmine_gantt_tweak

    project_id = params[:project_id].to_i

    if ! @settings.has_key?(:project_id.to_s)
      @settings[project_id.to_s] = {}
    end

    if params.has_key?(:months)
      months = params[:months].to_i
      @settings[project_id.to_s][:months] = months.to_s
    end

    if params.has_key?(:month_shift)
      month_shift = params[:month_shift].to_i
      @settings[project_id.to_s][:month_shift] = month_shift.to_s
    end

    Setting.send 'plugin_redmine_gantt_tweak=', @settings

    respond_to do |format|
      format.html {
        flash[:notice] = l(:notice_successful_update)
        redirect_to settings_project_path(@project, params[:tab])
      }
    end
  end

end

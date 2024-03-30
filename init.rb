paths = '/lib/gantt_tweak/{patches/*_patch,hooks/*_hook}.rb'
Dir.glob(File.dirname(__FILE__) + paths).each do |file|
  require file
end

Redmine::Plugin.register :redmine_gantt_tweak do
  name 'Redmine Gantt Tweak plugin'
  author 'sk-ys'
  description 'This is a plugin for Redmine'
  version '0.1.4'
  url 'https://github.com/sk-ys/redmine_gantt_tweak'
  author_url 'https://github.com/sk-ys'

  settings default: { "0" => {
    months: '3', offset_months: '0', subject_width: '300', zoom: '1',
    mode: 'offset', year: Date.today.strftime("%Y"),
    month: Date.today.strftime("%m")} },
           partial: 'settings/gantt_tweak/general'

  project_module :gantt_tweak do
    permission :manage_gantt_tweak , { gantt_tweak_setting: [ :edit ] }, require: :member
  end
end

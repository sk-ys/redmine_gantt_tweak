ActiveSupport::Reloader.to_prepare do
  paths = '/lib/redmine_gantt_tweak/{patches/*_patch,hooks/*_hook}.rb'
  Dir.glob(File.dirname(__FILE__) + paths).each do |file|
    require_dependency file
  end
end

Redmine::Plugin.register :redmine_gantt_tweak do
  name 'Redmine Gantt Tweak plugin'
  author 'sk-ys'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'https://github.com/sk-ys/redmine_gantt_tweak'
  author_url 'https://github.com/sk-ys'

  settings default: { 'month_shift' => 0 }, partial: 'settings/redmine_gantt_tweak/general'
end

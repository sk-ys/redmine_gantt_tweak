RedmineApp::Application.routes.draw do
  match 'gantt_tweak/update', controller: 'gantt_tweak', action: 'update', via: [:post, :put, :get]
end

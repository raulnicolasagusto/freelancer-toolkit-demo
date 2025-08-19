import { Code2, StickyNote, CheckSquare, BookOpen, TrendingUp, Clock } from 'lucide-react';
import { THEME_COLORS } from '@/lib/theme-colors';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className={`text-3xl lg:text-4xl font-bold ${THEME_COLORS.dashboard.title}`}>
            Bienvenido de vuelta
          </h1>
          <p className={`${THEME_COLORS.dashboard.subtitle} mt-2`}>
            Aquí tienes un resumen de tu actividad y herramientas disponibles
          </p>
        </div>
        <div className={`mt-4 lg:mt-0 text-sm ${THEME_COLORS.dashboard.metadata}`}>
          Última actividad: hace 2 horas
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${THEME_COLORS.dashboard.card.background} rounded-xl border ${THEME_COLORS.dashboard.card.border} p-6 ${THEME_COLORS.dashboard.card.shadow} ${THEME_COLORS.transitions.shadow}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${THEME_COLORS.dashboard.stats.label} text-sm font-medium`}>
                Snippets Guardados
              </p>
              <p className={`text-2xl font-bold ${THEME_COLORS.dashboard.stats.value} mt-1`}>
                12
              </p>
            </div>
            <div className={`${THEME_COLORS.icons.iconBackgrounds.blue} p-3 rounded-lg`}>
              <Code2 className={`h-6 w-6 ${THEME_COLORS.icons.snippets}`} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className={`h-4 w-4 ${THEME_COLORS.icons.trending} mr-1`} />
            <span className={`${THEME_COLORS.dashboard.stats.trend.positive} font-medium`}>+3</span>
            <span className={`${THEME_COLORS.dashboard.stats.trend.neutral} ml-1`}>esta semana</span>
          </div>
        </div>

        <div className={`${THEME_COLORS.dashboard.card.background} rounded-xl border ${THEME_COLORS.dashboard.card.border} p-6 ${THEME_COLORS.dashboard.card.shadow} ${THEME_COLORS.transitions.shadow}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${THEME_COLORS.dashboard.stats.label} text-sm font-medium`}>
                Notas Activas
              </p>
              <p className={`text-2xl font-bold ${THEME_COLORS.dashboard.stats.value} mt-1`}>
                8
              </p>
            </div>
            <div className={`${THEME_COLORS.icons.iconBackgrounds.yellow} p-3 rounded-lg`}>
              <StickyNote className={`h-6 w-6 ${THEME_COLORS.icons.notes}`} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <Clock className={`h-4 w-4 ${THEME_COLORS.icons.clock} mr-1`} />
            <span className={THEME_COLORS.dashboard.stats.trend.neutral}>Última: hace 1h</span>
          </div>
        </div>

        <div className={`${THEME_COLORS.dashboard.card.background} rounded-xl border ${THEME_COLORS.dashboard.card.border} p-6 ${THEME_COLORS.dashboard.card.shadow} ${THEME_COLORS.transitions.shadow}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${THEME_COLORS.dashboard.stats.label} text-sm font-medium`}>
                Tareas Pendientes
              </p>
              <p className={`text-2xl font-bold ${THEME_COLORS.dashboard.stats.value} mt-1`}>
                3
              </p>
            </div>
            <div className={`${THEME_COLORS.icons.iconBackgrounds.green} p-3 rounded-lg`}>
              <CheckSquare className={`h-6 w-6 ${THEME_COLORS.icons.productivity}`} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className={THEME_COLORS.dashboard.stats.trend.neutral}>2 completadas hoy</span>
          </div>
        </div>

        <div className={`${THEME_COLORS.dashboard.card.background} rounded-xl border ${THEME_COLORS.dashboard.card.border} p-6 ${THEME_COLORS.dashboard.card.shadow} ${THEME_COLORS.transitions.shadow}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${THEME_COLORS.dashboard.stats.label} text-sm font-medium`}>
                Recursos Guardados
              </p>
              <p className={`text-2xl font-bold ${THEME_COLORS.dashboard.stats.value} mt-1`}>
                24
              </p>
            </div>
            <div className={`${THEME_COLORS.icons.iconBackgrounds.purple} p-3 rounded-lg`}>
              <BookOpen className={`h-6 w-6 ${THEME_COLORS.icons.resources}`} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className={THEME_COLORS.dashboard.stats.trend.neutral}>5 categorías</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${THEME_COLORS.dashboard.card.background} rounded-xl border ${THEME_COLORS.dashboard.card.border} p-6`}>
        <h2 className={`text-xl font-semibold ${THEME_COLORS.dashboard.title} mb-4`}>
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className={`p-4 text-left rounded-lg border ${THEME_COLORS.buttons.quickAction.border} ${THEME_COLORS.buttons.quickAction.background} ${THEME_COLORS.transitions.default} group`}>
            <Code2 className={`h-8 w-8 ${THEME_COLORS.icons.snippets} mb-2 ${THEME_COLORS.buttons.quickAction.iconHover} ${THEME_COLORS.transitions.transform}`} />
            <h3 className={`font-medium ${THEME_COLORS.buttons.quickAction.title}`}>Nuevo Snippet</h3>
            <p className={`text-sm ${THEME_COLORS.buttons.quickAction.description} mt-1`}>
              Guarda tu código favorito
            </p>
          </button>
          
          <button className={`p-4 text-left rounded-lg border ${THEME_COLORS.buttons.quickAction.border} ${THEME_COLORS.buttons.quickAction.background} ${THEME_COLORS.transitions.default} group`}>
            <StickyNote className={`h-8 w-8 ${THEME_COLORS.icons.notes} mb-2 ${THEME_COLORS.buttons.quickAction.iconHover} ${THEME_COLORS.transitions.transform}`} />
            <h3 className={`font-medium ${THEME_COLORS.buttons.quickAction.title}`}>Nueva Nota</h3>
            <p className={`text-sm ${THEME_COLORS.buttons.quickAction.description} mt-1`}>
              Anota ideas importantes
            </p>
          </button>
          
          <button className={`p-4 text-left rounded-lg border ${THEME_COLORS.buttons.quickAction.border} ${THEME_COLORS.buttons.quickAction.background} ${THEME_COLORS.transitions.default} group`}>
            <CheckSquare className={`h-8 w-8 ${THEME_COLORS.icons.productivity} mb-2 ${THEME_COLORS.buttons.quickAction.iconHover} ${THEME_COLORS.transitions.transform}`} />
            <h3 className={`font-medium ${THEME_COLORS.buttons.quickAction.title}`}>Nueva Tarea</h3>
            <p className={`text-sm ${THEME_COLORS.buttons.quickAction.description} mt-1`}>
              Organiza tu trabajo
            </p>
          </button>
          
          <button className={`p-4 text-left rounded-lg border ${THEME_COLORS.buttons.quickAction.border} ${THEME_COLORS.buttons.quickAction.background} ${THEME_COLORS.transitions.default} group`}>
            <BookOpen className={`h-8 w-8 ${THEME_COLORS.icons.resources} mb-2 ${THEME_COLORS.buttons.quickAction.iconHover} ${THEME_COLORS.transitions.transform}`} />
            <h3 className={`font-medium ${THEME_COLORS.buttons.quickAction.title}`}>Explorar Recursos</h3>
            <p className={`text-sm ${THEME_COLORS.buttons.quickAction.description} mt-1`}>
              Encuentra herramientas útiles
            </p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`${THEME_COLORS.dashboard.card.background} rounded-xl border ${THEME_COLORS.dashboard.card.border} p-6`}>
        <h2 className={`text-xl font-semibold ${THEME_COLORS.dashboard.title} mb-4`}>
          Actividad Reciente
        </h2>
        <div className="space-y-3">
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${THEME_COLORS.activity.item.border}`}>
            <div className={`${THEME_COLORS.icons.iconBackgrounds.blue} p-2 rounded-lg`}>
              <Code2 className={`h-4 w-4 ${THEME_COLORS.icons.snippets}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${THEME_COLORS.activity.item.title}`}>
                Guardaste un nuevo snippet de React
              </p>
              <p className={`text-xs ${THEME_COLORS.activity.item.timestamp}`}>
                hace 2 horas
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${THEME_COLORS.activity.item.border}`}>
            <div className={`${THEME_COLORS.icons.iconBackgrounds.green} p-2 rounded-lg`}>
              <CheckSquare className={`h-4 w-4 ${THEME_COLORS.icons.productivity}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${THEME_COLORS.activity.item.title}`}>
                Completaste 2 tareas del proyecto
              </p>
              <p className={`text-xs ${THEME_COLORS.activity.item.timestamp}`}>
                hace 4 horas
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${THEME_COLORS.activity.item.border}`}>
            <div className={`${THEME_COLORS.icons.iconBackgrounds.yellow} p-2 rounded-lg`}>
              <StickyNote className={`h-4 w-4 ${THEME_COLORS.icons.notes}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${THEME_COLORS.activity.item.title}`}>
                Creaste una nota sobre Next.js 15
              </p>
              <p className={`text-xs ${THEME_COLORS.activity.item.timestamp}`}>
                ayer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

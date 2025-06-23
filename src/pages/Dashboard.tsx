import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Facultades",
      value: "12",
      icon: "🏛️",
      color: "bg-blue-500",
    },
    { title: "Total Materias", value: "84", icon: "📚", color: "bg-green-500" },
    {
      title: "Total Bibliografías",
      value: "256",
      icon: "📖",
      color: "bg-purple-500",
    },
    {
      title: "Total Autores",
      value: "128",
      icon: "👤",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel Administrativo
        </h1>
        <p className="text-gray-600">
          Bienvenido al sistema de gestión bibliográfica. Aquí tienes un resumen
          de la información.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/facultad/new"
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              🏛️
            </span>
            <span className="font-medium text-gray-700 group-hover:text-blue-600">
              Nueva Facultad
            </span>
          </Link>
          <Link
            to="/materia/new"
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              📚
            </span>
            <span className="font-medium text-gray-700 group-hover:text-green-600">
              Nueva Materia
            </span>
          </Link>
          <Link
            to="/bibliografia/new"
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              📖
            </span>
            <span className="font-medium text-gray-700 group-hover:text-purple-600">
              Nueva Bibliografía
            </span>
          </Link>
          <Link
            to="/autor/new"
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              👤
            </span>
            <span className="font-medium text-gray-700 group-hover:text-orange-600">
              Nuevo Autor
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">📖</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Nueva bibliografía agregada
              </p>
              <p className="text-xs text-gray-500">Hace 2 horas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Autor actualizado
              </p>
              <p className="text-xs text-gray-500">Hace 4 horas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-sm">📚</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Materia creada
              </p>
              <p className="text-xs text-gray-500">Hace 6 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

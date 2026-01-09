export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
          <p className="text-gray-500 mt-2">Ingresa a tu cuenta para continuar</p>
        </div>

        {/* Formulario */}
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="nombre@ejemplo.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <a href="#" className="text-sm text-indigo-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Registro */}
        <p className="text-center text-gray-600 mt-8">
          ¿No tienes una cuenta?{' '}
          <a href="#" className="text-indigo-600 font-semibold hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
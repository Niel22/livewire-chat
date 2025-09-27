export default function ErrorPage({ status }) {
  const code = status

  const title = {
    503: 'Service Unavailable',
    500: 'Server Error',
    404: 'Page Not Found',
    403: 'Forbidden',
  }[status] || 'Error'

  const description = {
    503: 'Sorry, we are doing some maintenance. Please check back soon.',
    500: 'Whoops, something went wrong on our servers.',
    404: 'Sorry, the page you are looking for could not be found.',
    403: 'Sorry, you are forbidden from accessing this page.',
  }[status] || 'An unexpected error occurred.'

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 h-screen flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-9xl font-extrabold text-red-600">{code}</h1>
        <h2 className="mt-4 text-3xl font-semibold">{title}</h2>
        <p className="mt-2 text-lg">{description}</p>
        <div className="mt-6">
          <a
            href="javascript:history.back()"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Go Back
          </a>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg shadow hover:bg-gray-400 dark:hover:bg-gray-600 transition ml-3"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  )
}

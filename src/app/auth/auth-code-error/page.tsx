export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p className="text-gray-600">The authentication code is invalid or has expired.</p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">Return to login</a>
    </div>
  )
}

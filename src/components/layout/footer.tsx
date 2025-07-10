export function Footer() {
  return (
    <footer className="w-full">
      <div className="border-t border-gray-800/40 bg-gray-900 backdrop-blur-md">
        <div className="relative flex items-center justify-center py-3">
          <div className="absolute left-4 sm:left-6 lg:left-8">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
          <p className="text-sm whitespace-nowrap">
            Powered by{' '}
            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
              Codec Networks
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
} 
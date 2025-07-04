export function Footer() {
  return (
    <footer className="lg:pl-72">
      <div className="border-t border-gray-200/70 dark:border-gray-800/40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} All rights reserved
            </p>
            <div className="flex items-center space-x-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Powered by{' '}
                <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300">
                  Codec Networks
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 
export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'trip-data-manager');

  return (
    <footer className="app-footer">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-6 text-sm text-muted-foreground">
          <p>© {year} Trip Data Manager. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with{' '}
            <span className="text-amber-500">♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

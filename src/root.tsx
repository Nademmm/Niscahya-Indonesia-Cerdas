import React, { useEffect } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError, useLocation } from "react-router";
import { AppProvider } from "./context/AppContext";
import MainLayout from "./components/Layout";
import "./index.css";

const fontStylesheetHref = "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap";
const boxiconsStylesheetHref = "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";
const asyncStylesheetLoader = `
(function () {
  var hrefs = [
    ${JSON.stringify(fontStylesheetHref)},
    ${JSON.stringify(boxiconsStylesheetHref)}
  ];

  hrefs.forEach(function (href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });
}());
`;

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);

  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://unpkg.com" />
        <script dangerouslySetInnerHTML={{ __html: asyncStylesheetLoader }} />
        <noscript>
          <link href={fontStylesheetHref} rel="stylesheet" />
          <link href={boxiconsStylesheetHref} rel="stylesheet" />
        </noscript>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  let { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <AppProvider>
      <MainLayout>
        {!isHome && <ScrollToHash />}
        <Outlet />
      </MainLayout>
    </AppProvider>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  console.error("ErrorBoundary caught error:", error);
  let errorMessage = "Unknown error";
  let errorDetails = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.status === 404 ? "404 - Halaman Tidak Ditemukan" : `${error.status} - ${error.statusText}`;
    errorDetails = typeof error.data === "string" ? error.data : JSON.stringify(error.data);
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = String((error as any).message);
  }

  return (
    <main className="min-h-screen bg-background text-text-main flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-black text-primary">Oops!</h1>
        <p className="text-2xl font-bold text-text-secondary">{errorMessage}</p>
        {errorDetails && <p className="text-text-secondary">{errorDetails}</p>}
        <a href="/beranda" className="inline-block px-6 py-3 bg-primary text-background rounded-xl font-bold">
          Kembali ke Beranda
        </a>
      </div>
    </main>
  );
}
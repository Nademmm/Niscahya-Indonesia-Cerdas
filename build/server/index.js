import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, useLoaderData, useLocation, useNavigate, useParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
import { createContext, memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), streamTimeout + 1e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region src/context/AppContext.jsx
var AppContext = createContext();
var AppProvider = ({ children }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [notification, setNotification] = useState(null);
	const showNotification = (message) => {
		setNotification(message);
		setTimeout(() => setNotification(null), 3e3);
	};
	return /* @__PURE__ */ jsx(AppContext.Provider, {
		value: {
			searchQuery,
			setSearchQuery,
			notification,
			showNotification
		},
		children
	});
};
var useApp = () => useContext(AppContext);
//#endregion
//#region src/components/Layout.jsx
var navLinks = [
	{
		name: "Beranda",
		path: "/"
	},
	{
		name: "Produk",
		path: "/products"
	},
	{
		name: "Blog",
		path: "/blog"
	},
	{
		name: "Kontak",
		path: "/contact"
	},
	{
		name: "Galeri",
		path: "/projects"
	}
];
var Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
	const { searchQuery, setSearchQuery } = useApp();
	const [localSearch, setLocalSearch] = useState(searchQuery);
	const location = useLocation();
	const navigate = useNavigate();
	useEffect(() => {
		setLocalSearch(searchQuery);
	}, [searchQuery]);
	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchQuery(localSearch);
		}, 300);
		return () => clearTimeout(timer);
	}, [localSearch, setSearchQuery]);
	const handleSearch = (e) => {
		setLocalSearch(e.target.value);
		if (location.pathname !== "/products" && location.pathname !== "/admin") navigate("/products");
	};
	const toggleMobileSearch = () => {
		setMobileSearchOpen(!mobileSearchOpen);
		if (mobileMenuOpen) setMobileMenuOpen(false);
	};
	return /* @__PURE__ */ jsxs("nav", {
		className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 py-4 ${scrolled ? "lg:py-4" : "lg:py-8"}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: `max-w-7xl mx-auto glass rounded-4xl px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-500 ${scrolled ? "shadow-2xl shadow-primary/10 border-black/5" : "bg-transparent border-transparent"}`,
			children: [
				!mobileSearchOpen ? /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "flex items-center gap-3 group",
					children: [/* @__PURE__ */ jsx("img", {
						src: "/logo.png",
						alt: "Niscahya Indonesia Cerdas Logo",
						className: "w-10 h-10 object-contain"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-2xl font-black tracking-tighter text-text-main uppercase",
						children: "Niscahya"
					})]
				}) }) : /* @__PURE__ */ jsx("div", {
					className: "flex-1 lg:hidden mr-2",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 px-4 py-2.5 bg-black/5 border border-black/10 rounded-2xl group transition-all",
						children: [/* @__PURE__ */ jsx("i", { className: "bx bx-search text-xl text-text-secondary" }), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Cari produk atau unit...",
							value: localSearch,
							onChange: handleSearch,
							autoFocus: true,
							className: "bg-transparent border-none outline-none text-text-main placeholder-text-secondary/50 w-full text-sm font-bold"
						})]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "hidden lg:flex items-center gap-1 bg-black/5 rounded-2xl p-1 border border-black/5",
					children: navLinks.map((link) => /* @__PURE__ */ jsx(Link, {
						to: link.path,
						className: `px-6 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-all duration-300 ${location.pathname + location.hash === link.path || location.pathname === link.path ? "bg-primary text-background shadow-lg shadow-primary/20" : "text-text-secondary hover:text-primary hover:bg-black/5"}`,
						children: link.name
					}, link.name))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 sm:gap-3 shrink-0",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "hidden sm:flex items-center gap-2 px-5 py-2.5 bg-black/5 border border-black/10 rounded-2xl text-sm font-bold group transition-all",
							children: [/* @__PURE__ */ jsx("i", { className: "bx bx-search text-xl text-text-secondary" }), /* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "Cari unit...",
								value: localSearch,
								onChange: handleSearch,
								className: "bg-transparent border-none outline-none text-text-main placeholder-text-secondary/50 w-32 md:w-48"
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": mobileSearchOpen ? "Tutup pencarian" : "Buka pencarian",
							"aria-pressed": mobileSearchOpen,
							onClick: toggleMobileSearch,
							className: `sm:hidden px-2.5 py-3 w-11 h-12 rounded-2xl border transition-all duration-300 ${mobileSearchOpen ? "bg-primary text-background border-primary shadow-lg shadow-primary/20" : "bg-black/5 text-text-main border-black/10 hover:bg-black/10"}`,
							children: /* @__PURE__ */ jsx("i", { className: `bx ${mobileSearchOpen ? "bx-x" : "bx-search"} text-xl` })
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": mobileMenuOpen ? "Tutup menu" : "Buka menu",
							"aria-expanded": mobileMenuOpen,
							"aria-controls": "mobile-navigation",
							onClick: () => {
								setMobileMenuOpen(!mobileMenuOpen);
								if (mobileSearchOpen) setMobileSearchOpen(false);
							},
							className: "lg:hidden p-2.5 bg-black/5 text-text-main rounded-2xl border border-black/10 hover:bg-black/10 transition-all",
							children: /* @__PURE__ */ jsx("i", { className: `bx ${mobileMenuOpen ? "bx-x" : "bx-menu-alt-right"} text-2xl` })
						})
					]
				})
			]
		}), mobileMenuOpen && /* @__PURE__ */ jsx("div", {
			id: "mobile-navigation",
			className: "fixed inset-0 bg-background/95 backdrop-blur-2xl z-[-1] lg:hidden flex flex-col items-center justify-center gap-8",
			children: navLinks.map((link) => /* @__PURE__ */ jsx(Link, {
				to: link.path,
				onClick: () => setMobileMenuOpen(false),
				className: "text-4xl font-black tracking-tighter hover:text-primary transition-colors uppercase",
				children: link.name
			}, link.name))
		})]
	});
};
var Layout$1 = ({ children }) => {
	const { notification } = useApp();
	const location = useLocation();
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-text-main selection:bg-primary/30 selection:text-primary relative overflow-x-hidden",
		children: [
			notification && /* @__PURE__ */ jsxs("div", {
				className: "fixed bottom-10 left-1/2 z-100 glass-bright px-8 py-4 rounded-2xl border border-primary/30 shadow-2xl shadow-primary/10 flex items-center gap-4 transform -translate-x-1/2 animate-fade-in",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-8 h-8 bg-primary rounded-lg flex items-center justify-center",
					children: /* @__PURE__ */ jsx("i", { className: "bx bx-check text-background text-xl" })
				}), /* @__PURE__ */ jsx("p", {
					className: "font-black uppercase tracking-widest text-xs",
					children: notification
				})]
			}),
			/* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-mesh -z-10 opacity-70" }),
			/* @__PURE__ */ jsx("div", { className: "fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] -z-10" }),
			/* @__PURE__ */ jsx("div", { className: "fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] -z-10" }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("main", {
				className: "pt-32 pb-20 px-6 lg:px-10 max-w-7xl mx-auto w-full relative z-10",
				children
			}, location.pathname),
			/* @__PURE__ */ jsxs("footer", {
				className: "py-32 px-6 lg:px-10 max-w-7xl mx-auto border-t border-black/5 relative z-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-16 mb-24",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "col-span-1 md:col-span-2 space-y-8",
							children: [/* @__PURE__ */ jsxs(Link, {
								to: "/",
								className: "flex items-center gap-4 group",
								children: [/* @__PURE__ */ jsx("img", {
									src: "/logo.png",
									alt: "Niscahya Indonesia Cerdas Logo",
									className: "w-14 h-14 object-contain"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-3xl font-black tracking-tighter text-text-main uppercase leading-none",
										children: "Niscahya"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-sm font-black tracking-[0.3em] text-primary uppercase mt-1",
										children: "Indonesia Cerdas"
									})]
								})]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-text-secondary font-medium text-lg max-w-md leading-relaxed",
								children: "Membangun masa depan yang berkelanjutan melalui inovasi teknologi energi surya yang cerdas, andal, dan terjangkau untuk seluruh penjuru Nusantara."
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-8",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-sm font-black uppercase tracking-[0.4em] text-text-main",
								children: "Navigasi"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-5",
								children: [
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
										to: "/",
										className: "text-base font-bold text-text-secondary hover:text-primary transition-colors",
										children: "Beranda"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
										to: "/products",
										className: "text-base font-bold text-text-secondary hover:text-primary transition-colors",
										children: "Produk"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
										to: "/blog",
										className: "text-base font-bold text-text-secondary hover:text-primary transition-colors",
										children: "Blog & Artikel"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
										to: "/projects",
										className: "text-base font-bold text-text-secondary hover:text-primary transition-colors",
										children: "Galeri Projek"
									}) })
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-8",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-sm font-black uppercase tracking-[0.4em] text-text-main",
								children: "Bantuan"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-5",
								children: [
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
										to: "/contact",
										className: "text-base font-bold text-text-secondary hover:text-primary transition-colors",
										children: "Kontak Kami"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "https://wa.me/6287853536124",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-base font-bold text-text-secondary hover:text-primary transition-colors",
										children: "+62 878 5353 6124"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "https://wa.me/6282143707398",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-base font-bold text-text-secondary hover:text-primary transition-colors",
										children: "+62 821 4370 7398"
									}) })
								]
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-black/5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-2 text-center md:text-left",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-black uppercase tracking-widest text-text-secondary",
							children: "Copyright © 2026 CV Niscahya Indonesia Cerdas."
						}), /* @__PURE__ */ jsx("p", {
							className: "text-[10px] font-bold text-text-secondary/50 uppercase tracking-[0.2em]",
							children: "Penerangan Jalan Umum Tenaga Surya & PLN Terpercaya"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-8 text-2xl text-text-secondary",
						children: [
							/* @__PURE__ */ jsx("a", {
								"aria-label": "Instagram Niscahya Indonesia Cerdas",
								href: "https://www.instagram.com/niscahya.id?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "hover:text-primary hover:scale-110 transition-all",
								children: /* @__PURE__ */ jsx("i", { className: "bx bxl-instagram" })
							}),
							/* @__PURE__ */ jsx("a", {
								"aria-label": "Facebook Niscahya Indonesia Cerdas",
								href: "https://www.facebook.com/pjutenagasuryasurabaya",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "hover:text-primary hover:scale-110 transition-all",
								children: /* @__PURE__ */ jsx("i", { className: "bx bxl-facebook-circle" })
							}),
							/* @__PURE__ */ jsx("a", {
								"aria-label": "WhatsApp Niscahya Indonesia Cerdas",
								href: "https://wa.me/6287853536124",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "hover:text-primary hover:scale-110 transition-all",
								children: /* @__PURE__ */ jsx("i", { className: "bx bxl-whatsapp" })
							})
						]
					})]
				})]
			})
		]
	});
};
//#endregion
//#region src/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default
});
var fontStylesheetHref = "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap";
var boxiconsStylesheetHref = "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";
var asyncStylesheetLoader = `
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
			const element = document.getElementById(hash.replace("#", ""));
			if (element) setTimeout(() => {
				element.scrollIntoView({ behavior: "smooth" });
			}, 100);
		} else window.scrollTo(0, 0);
	}, [hash, pathname]);
	return null;
}
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "id",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "icon",
				type: "image/png",
				href: "/logo.png"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "preconnect",
				href: "https://unpkg.com"
			}),
			/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: asyncStylesheetLoader } }),
			/* @__PURE__ */ jsxs("noscript", { children: [/* @__PURE__ */ jsx("link", {
				href: fontStylesheetHref,
				rel: "stylesheet"
			}), /* @__PURE__ */ jsx("link", {
				href: boxiconsStylesheetHref,
				rel: "stylesheet"
			})] }),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	let { pathname } = useLocation();
	return /* @__PURE__ */ jsx(AppProvider, { children: /* @__PURE__ */ jsxs(Layout$1, { children: [!(pathname === "/") && /* @__PURE__ */ jsx(ScrollToHash, {}), /* @__PURE__ */ jsx(Outlet, {})] }) });
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	console.error("ErrorBoundary caught error:", error);
	let errorMessage = "Unknown error";
	let errorDetails = "";
	if (isRouteErrorResponse(error)) {
		errorMessage = error.status === 404 ? "404 - Halaman Tidak Ditemukan" : `${error.status} - ${error.statusText}`;
		errorDetails = typeof error.data === "string" ? error.data : JSON.stringify(error.data);
	} else if (error instanceof Error) errorMessage = error.message;
	else if (error && typeof error === "object" && "message" in error) errorMessage = String(error.message);
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-background text-text-main flex items-center justify-center p-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "text-center space-y-6",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-6xl font-black text-primary",
					children: "Oops!"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-2xl font-bold text-text-secondary",
					children: errorMessage
				}),
				errorDetails && /* @__PURE__ */ jsx("p", {
					className: "text-text-secondary",
					children: errorDetails
				}),
				/* @__PURE__ */ jsx("a", {
					href: "/",
					className: "inline-block px-6 py-3 bg-primary text-background rounded-xl font-bold",
					children: "Kembali ke Beranda"
				})
			]
		})
	});
});
//#endregion
//#region src/components/ProductCard.jsx
var ProductCard = memo(({ product }) => {
	const getCategoryDisplay = (fullCategory) => {
		if (fullCategory.includes(" - ")) return fullCategory.split(" - ")[1];
		return fullCategory;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "group relative rounded-3xl md:rounded-[40px] overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-black/5 hover:border-primary/30 bg-white will-change-transform",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative aspect-square md:aspect-4/5 overflow-hidden",
			children: [
				/* @__PURE__ */ jsx("img", {
					src: product.image,
					alt: product.name,
					loading: "lazy",
					decoding: "async",
					width: "1200",
					height: "1500",
					className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
				}),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300" }),
				/* @__PURE__ */ jsx("div", {
					className: "absolute top-3 left-3 md:top-6 md:left-6 z-20",
					children: /* @__PURE__ */ jsx("span", {
						className: "px-2 py-1 md:px-4 md:py-2 bg-black/60 border border-white/10 text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white rounded-lg md:rounded-xl shadow-xl",
						children: getCategoryDisplay(product.category)
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "hidden md:block absolute top-6 right-6 -translate-y-2.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20",
					children: /* @__PURE__ */ jsx("div", {
						className: "w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40",
						children: /* @__PURE__ */ jsx("i", { className: "bx bx-arrow-to-right text-2xl" })
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute bottom-0 left-0 right-0 p-4 md:p-8 space-y-2 md:space-y-3 z-20",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-0.5 md:space-y-1",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm md:text-xl font-black tracking-tighter text-white uppercase leading-tight md:leading-[1.1] line-clamp-2 drop-shadow-lg",
							children: product.name
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 md:gap-2 pt-1 md:pt-2",
							children: [/* @__PURE__ */ jsx("div", { className: "h-0.5 w-4 md:w-8 bg-primary rounded-full" }), /* @__PURE__ */ jsx("span", {
								className: "text-[7px] md:text-[10px] font-black text-primary uppercase tracking-widest",
								children: "Detail"
							})]
						})]
					})
				})
			]
		}), /* @__PURE__ */ jsx(Link, {
			to: `/products/${product.slug || product.id}`,
			className: "absolute inset-0 z-30",
			"aria-label": `Lihat detail ${product.name}`
		})]
	});
});
//#endregion
//#region src/data/blog.js
var slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
var blogPosts = [
	{
		id: 5,
		title: "Harga Lampu Jalan Tenaga Surya 2025: Simak Dahulu Sebelum Membeli",
		date: "Agustus 25, 2025",
		category: "Panduan",
		image: "/blog1.webp",
		excerpt: "Lampu jalan tenaga surya telah menjadi pilihan populer untuk penerangan jalan di berbagai daerah. Ketahui harga dan faktor pertimbangannya.",
		content: `
      Lampu jalan tenaga surya telah menjadi pilihan populer untuk penerangan jalan di berbagai daerah, terutama karena keunggulannya dalam menghemat energi dan ramah lingkungan. Namun, sebelum membeli lampu jalan tenaga surya, ada beberapa hal yang perlu dipertimbangkan, termasuk harga, kualitas, dan fitur-fitur yang ditawarkan.

      Harga Lampu Jalan Tenaga Surya 2025
      Harga lampu jalan tenaga surya dapat bervariasi tergantung pada beberapa faktor, seperti kualitas, daya, dan fitur-fitur yang ditawarkan. Berikut adalah beberapa perkiraan harga lampu jalan tenaga surya untuk tahun 2025:
      - Daya 10-40 Watt: Rp 1.200.000 – Rp 3.000.000
      - Daya 50-80 Watt: Rp 3.500.000 – Rp 5.500.000
      - Daya 100 Watt atau Lebih: Rp 7.000.000 – Rp 15.000.000

      Faktor yang Memengaruhi Harga
      Beberapa faktor yang dapat mempengaruhi harga lampu jalan tenaga surya adalah:
      1. Kualitas Panel Surya: Panel surya yang berkualitas tinggi dapat meningkatkan efisiensi dan daya tahan lampu.
      2. Daya Lampu: Lampu dengan daya yang lebih tinggi dapat memberikan penerangan yang lebih luas dan lebih terang.
      3. Fitur-fitur Tambahan: Fitur-fitur seperti sensor gerak, pengatur waktu, dan sistem monitoring dapat meningkatkan harga lampu.
      4. Merek dan Garansi: Merek yang terkenal dan garansi yang panjang dapat meningkatkan harga lampu.

      Tips Sebelum Membeli
      Sebelum membeli lampu jalan tenaga surya, ada beberapa tips yang perlu dipertimbangkan:
      - Tentukan Kebutuhan: Tentukan kebutuhan penerangan jalan Anda dan pilih lampu yang sesuai.
      - Periksa Kualitas: Periksa kualitas panel surya, baterai, dan komponen lainnya.
      - Cek Garansi: Cek garansi yang ditawarkan oleh produsen dan pastikan Anda memahami syarat dan ketentuan garansi.
      - Bandingkan Harga: Bandingkan harga dari beberapa produsen untuk mendapatkan harga yang terbaik.

      Dengan mempertimbangkan faktor-faktor di atas dan melakukan penelitian yang cukup, Anda dapat membeli lampu jalan tenaga surya yang sesuai dengan kebutuhan dan budget Anda.
    `,
		author: "Tim Konsultan Niscahya"
	},
	{
		id: 1,
		title: "Lampu PJU Tenaga Surya Hybrid: Menggabungkan Listrik PLN dan Tenaga Surya",
		date: "Januari 13, 2026",
		category: "Teknologi",
		image: "/PJU TENAGA SURYA.webp",
		excerpt: "Apa itu sistem hybrid? Simak bagaimana penggabungan dua sumber daya ini dapat meningkatkan efisiensi dan keandalan penerangan jalan Anda.",
		content: `
      Sistem Hybrid pada PJU Tenaga Surya adalah terobosan terbaru dalam dunia energi terbarukan. Dengan menggabungkan listrik dari PLN dan panel surya, sistem ini menawarkan keandalan 100% tanpa takut kehabisan daya saat cuaca mendung berkepanjangan.

      Keunggulan Sistem Hybrid:
      1. Keandalan Total: Saat baterai surya habis, sistem otomatis beralih ke PLN.
      2. Efisiensi Biaya: Tetap menghemat tagihan listrik karena prioritas utama adalah tenaga surya.
      3. Umur Baterai Lebih Panjang: Baterai tidak akan terkuras habis karena adanya backup dari PLN.

      Sistem ini sangat cocok untuk jalan utama kota yang membutuhkan standar keamanan penerangan yang sangat ketat.
    `,
		author: "Tim Ahli Niscahya"
	},
	{
		id: 2,
		title: "Lithium vs VRLA? Pilih yang Mana untuk Sistem Solar Anda?",
		date: "Oktober 2, 2025",
		category: "Komparasi",
		image: "/blog6.webp",
		excerpt: "Masih bingung memilih jenis baterai? Kami bandingkan performa, harga, dan daya tahan antara baterai Lithium dan VRLA.",
		content: `
      Memilih baterai adalah keputusan krusial dalam membangun sistem tenaga surya. Dua jenis yang paling populer adalah Lithium (LiFePO4) dan VRLA (Lead Acid). Mana yang lebih baik?

      1. Baterai Lithium (LiFePO4):
      - Daya Tahan: Mencapai 6000+ siklus (bisa bertahan 10-15 tahun).
      - Berat: Sangat ringan (sekitar 1/3 dari VRLA).
      - Efisiensi: 95% pengisian daya terserap sempurna.
      - Harga: Lebih mahal di awal, namun termurah untuk jangka panjang.

      2. Baterai VRLA:
      - Daya Tahan: Sekitar 500-1000 siklus (2-3 tahun).
      - Berat: Sangat berat.
      - Harga: Murah di awal, namun perlu sering diganti.

      Kesimpulan: Jika Anda memiliki anggaran lebih, Lithium adalah pemenang mutlak untuk efisiensi dan ketenangan pikiran jangka panjang.
    `,
		author: "Tim Riset Niscahya"
	},
	{
		id: 3,
		title: "Jenis-Jenis Tiang Lampu Jalan Tenaga Surya dan Fungsinya",
		date: "Agustus 28, 2025",
		category: "Edukasi",
		image: "/blog5.webp",
		excerpt: "Dari tiang oktagonal hingga galvanis, ketahui jenis tiang yang paling cocok untuk kebutuhan proyek Anda.",
		content: `
      Tiang bukan sekadar penyangga. Desain dan material tiang menentukan keamanan dan estetika sistem PJU Anda.

      Jenis Tiang Populer:
      - Tiang Oktagonal: Memiliki 8 sisi, sangat kuat terhadap tekanan angin.
      - Tiang Bulat: Desain klasik yang ekonomis.
      - Tiang Hexagonal: Memiliki 6 sisi, keseimbangan antara kekuatan dan harga.

      Pastikan tiang Anda telah melalui proses Hot Dip Galvanize (HDG) agar tahan karat hingga puluhan tahun meskipun terkena hujan dan panas ekstrem.
    `,
		author: "Divisi Teknik"
	},
	{
		id: 4,
		title: "Aetheria 100W vs Nebula High-Bay: Mana yang Lebih Terang?",
		date: "Juni 2, 2025",
		category: "Produk",
		image: "/blog4.webp",
		excerpt: "Perbandingan mendalam antara dua produk unggulan kami untuk kebutuhan penerangan area luas.",
		content: `
      Banyak pelanggan bertanya, mana yang lebih baik antara Aetheria 100W dan Nebula High-Bay? Jawabannya tergantung lokasi pemasangan Anda.

      Aetheria 100W:
      - Fokus: Penerangan jalan umum (PJU).
      - Fitur: Sensor gerak AI dan desain slim.
      - Sebaran Cahaya: Memanjang mengikuti bentuk jalan.

      Nebula High-Bay:
      - Fokus: Area terbuka luas, gudang, atau lapangan olahraga.
      - Fitur: Cahaya sangat tajam (15000 Lumens).
      - Sebaran Cahaya: Melingkar 120 derajat.

      Jika Anda ingin menerangi jalan, pilih Aetheria. Jika ingin menerangi halaman parkir yang luas, Nebula adalah jawabannya.
    `,
		author: "Product Specialist"
	},
	{
		id: 6,
		title: "All-in-One vs Two-in-One vs Konvensional: Mana yang Paling Untung?",
		date: "April 10, 2026",
		category: "Hot Topic",
		image: "/blog3.webp",
		excerpt: "Bingung memilih model PJU Tenaga Surya? Simak kelebihan dan kekurangan masing-masing model untuk proyek Anda.",
		content: `
      Pasar PJU Tenaga Surya saat ini didominasi oleh tiga model utama. Memilih yang salah bisa berarti pemborosan anggaran atau biaya perawatan yang membengkak.

      1. All-in-One (AIO):
      - Desain: Panel, baterai, dan lampu dalam satu box.
      - Kelebihan: Sangat mudah dipasang (plug & play), anti-pencurian baterai.
      - Kekurangan: Kapasitas terbatas, jika satu rusak biasanya ganti unit.

      2. Two-in-One (2-in-1):
      - Desain: Panel terpisah, baterai dan lampu jadi satu.
      - Kelebihan: Panel bisa diarahkan ke matahari lebih bebas, kapasitas lebih besar dari AIO.
      - Kekurangan: Sedikit lebih rumit pemasangannya dibanding AIO.

      3. Konvensional (Split):
      - Desain: Semua komponen terpisah.
      - Kelebihan: Kapasitas raksasa, sangat mudah diperbaiki per bagian.
      - Kekurangan: Rawan pencurian baterai jika tidak dipasang di atas tiang tinggi.

      Rekomendasi: Untuk jalan perumahan pilih AIO. Untuk jalan raya utama, Two-in-One atau Konvensional adalah pilihan terbaik.
    `,
		author: "Tim Ahli Niscahya"
	},
	{
		id: 7,
		title: "5 Tips Perawatan PJU Tenaga Surya Agar Awet Hingga 10 Tahun",
		date: "Maret 15, 2026",
		category: "Tips",
		image: "/blog2.webp",
		excerpt: "Jangan biarkan investasi Anda rusak karena kurang perawatan. Ikuti langkah sederhana ini agar sistem solar Anda tetap prima.",
		content: `
      Investasi PJU Tenaga Surya tidak murah, jadi pastikan Anda merawatnya dengan benar. Sistem yang dirawat bisa bertahan 2-3 kali lebih lama.

      Langkah Perawatan Utama:
      1. Bersihkan Panel Surya: Debu dan kotoran burung bisa menurunkan efisiensi hingga 30%. Lap dengan kain basah setiap 3-6 bulan.
      2. Cek Koneksi Kabel: Pastikan tidak ada kabel yang longgar atau digigit tikus.
      3. Pantau Ketinggian Pohon: Pastikan tidak ada dahan pohon yang menghalangi matahari ke panel (shading).
      4. Perhatikan Indikator Controller: Jika lampu mulai redup lebih cepat, mungkin baterai perlu pengecekan tegangan.
      5. Bersihkan Kaca Lampu: Agar cahaya tetap maksimal dan tidak terhalang debu.

      Perawatan rutin adalah kunci penghematan jangka panjang yang sesungguhnya.
    `,
		author: "Divisi Teknik"
	},
	{
		id: 8,
		title: "Musim Hujan Tiba! Apakah PJU Tenaga Surya Tetap Bisa Menyala?",
		date: "Februari 20, 2026",
		category: "Hot Topic",
		image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1000&auto=format&fit=crop",
		excerpt: "Kekhawatiran terbesar pengguna adalah saat mendung berkepanjangan. Simak bagaimana teknologi kami menangani cuaca buruk.",
		content: `
      "Bagaimana kalau hujan terus? Apakah lampunya mati?" Ini adalah pertanyaan paling umum di Indonesia. Jawabannya: Tidak, jika sistemnya benar.

      Bagaimana Sistem Bekerja Saat Mendung:
      1. Teknologi Panel Monocrystalline: Panel kami tetap bisa mengisi daya meski cahaya matahari redup (bukan berarti butuh panas, tapi butuh radiasi cahaya).
      2. Sistem Autonomy Days: Produk Niscahya dirancang memiliki cadangan daya untuk 2-3 hari mendung total.
      3. Smart Energy Management: Controller pintar akan meredupkan cahaya secara otomatis (dimming) saat baterai rendah untuk memastikan lampu tetap menyala hingga pagi.

      Jadi, Anda tidak perlu khawatir. Dengan desain sistem yang tepat dari Niscahya, jalanan Anda akan tetap terang meski di tengah musim hujan sekalipun.
    `,
		author: "Tim Riset Niscahya"
	},
	{
		id: 9,
		title: "Cara Memilih Lampu Panel Surya Terbaik untuk Kebutuhan Anda",
		date: "April 21, 2026",
		category: "Panduan",
		image: "/blog1.webp",
		excerpt: "Jangan salah pilih! Simak panduan lengkap memilih lampu panel surya dengan efisiensi tinggi dan durabilitas jangka panjang.",
		content: `
      Memilih lampu panel surya (PJU) bukan hanya soal harga murah, tapi soal ketahanan sistem untuk penggunaan bertahun-tahun. Di pasar Indonesia yang ekstrem cuacanya, Anda butuh spesifikasi yang tepat.

      Langkah Memilih Lampu Terbaik:
      1. Periksa Tipe Panel Surya: Gunakan Monocrystalline untuk efisiensi pengisian daya lebih cepat, terutama di daerah yang sering mendung.
      2. Cek Jenis Baterai: Pastikan menggunakan Lithium LiFePO4. Baterai ini jauh lebih ringan, tahan panas, dan memiliki siklus hidup (cycle life) hingga 10 tahun.
      3. Kapasitas Lumens per Watt: Jangan hanya melihat Watt-nya, tapi lihat Lumens-nya. Lampu berkualitas tinggi memberikan cahaya lebih terang dengan daya yang lebih kecil.
      4. Kualitas Chip LED: Pilih chip LED dari brand ternama seperti Bridgelux atau Philips untuk memastikan kecerahan tidak menurun drastis setelah satu tahun penggunaan.
      5. Sertifikasi IP: Minimal IP65 atau IP66 untuk menjamin unit tahan terhadap air hujan dan debu konstruksi.

      Dengan memperhatikan detail teknis ini, investasi energi terbarukan Anda akan memberikan hasil maksimal dalam jangka panjang.
    `,
		author: "Tim Konsultan Niscahya"
	},
	{
		id: 10,
		title: "Perbandingan Lampu Tenaga Surya vs Listrik Biasa (PLN)",
		date: "April 21, 2026",
		category: "Komparasi",
		image: "/blog2.webp",
		excerpt: "Mana yang lebih hemat? Kami bedah perbandingan biaya investasi awal hingga biaya operasional antara sistem Solar dan PLN.",
		content: `
      Banyak calon pengguna ragu beralih ke tenaga surya karena investasi awal yang terlihat mahal. Mari kita bedah faktanya dibanding sistem listrik PLN konvensional.

      Lampu Listrik Biasa (PLN):
      - Investasi Awal: Murah (hanya tiang, kabel, dan lampu).
      - Operasional: Mahal (tagihan bulanan terus naik selamanya).
      - Instalasi: Rumit karena butuh penarikan kabel antar tiang yang panjang dan galian tanah.
      - Risiko: Jika PLN padam, lampu ikut mati.

      Lampu Tenaga Surya (Solar):
      - Investasi Awal: Lebih mahal di depan karena komponen panel dan baterai.
      - Operasional: Rp 0,- (Gratis dari matahari selamanya).
      - Instalasi: Sangat mudah (Plug & Play), tidak butuh kabel antar tiang dan tidak butuh galian kabel tanah.
      - Risiko: Mandiri energi, tetap menyala meski jaringan listrik kota padam.

      Kesimpulan: Tenaga surya biasanya mencapai titik impas (break-even point) dalam 2-3 tahun. Setelah itu, Anda menikmati penerangan gratis sepenuhnya.
    `,
		author: "Tim Riset Niscahya"
	},
	{
		id: 11,
		title: "Apakah Lampu Solar Cocok untuk Rumah? Ini Penjelasannya",
		date: "April 21, 2026",
		category: "Edukasi",
		image: "/blog3.webp",
		excerpt: "Tenaga surya bukan hanya untuk jalan raya. Pelajari bagaimana sistem solar dapat diaplikasikan untuk hunian pribadi Anda.",
		content: `
      Banyak yang mengira panel surya hanya untuk proyek pemerintah atau jalan raya. Faktanya, tren Solar Home System (SHS) kini sangat populer untuk hunian modern.

      Kenapa Rumah Anda Butuh Lampu Solar?
      1. Penerangan Taman & Keamanan: Lampu dinding atau lampu taman tenaga surya otomatis menyala saat malam, menjaga rumah tetap terang tanpa menambah beban listrik.
      2. Cadangan Saat Mati Lampu: Saat pemadaman listrik, sistem solar rumah Anda tetap beroperasi secara mandiri.
      3. Estetika Hunian: Tanpa kabel yang malang melintang, taman dan fasad rumah terlihat lebih bersih dan modern.
      4. Kontribusi Lingkungan: Mengurangi jejak karbon keluarga Anda dengan menggunakan energi bersih.

      Untuk rumah, Anda bisa memulai dengan lampu dinding sensor gerak atau lampu taman dekoratif yang tidak memerlukan instalasi kabel sama sekali.
    `,
		author: "Product Specialist"
	}
].map((post) => ({
	...post,
	slug: slugify(post.title)
}));
//#endregion
//#region src/utils/seo.js
/**
* Utility untuk mengelola SEO Meta Tags secara dinamis
*/
var updateSEO = ({ title, description, keywords, image = "/og-image.png", type = "website" }) => {
	if (typeof window === "undefined") return;
	const siteName = "Niscahya Indonesia Cerdas";
	const fullTitle = title ? `${title} | ${siteName}` : siteName;
	const url = window.location.href;
	document.title = fullTitle;
	const setMeta = (name, content, attr = "name") => {
		if (!content) return;
		let element = document.querySelector(`meta[${attr}="${name}"]`);
		if (!element) {
			element = document.createElement("meta");
			element.setAttribute(attr, name);
			document.head.appendChild(element);
		}
		element.setAttribute("content", content);
	};
	setMeta("description", description);
	setMeta("keywords", keywords);
	setMeta("author", siteName);
	setMeta("og:title", fullTitle, "property");
	setMeta("og:description", description, "property");
	setMeta("og:image", image.startsWith("http") ? image : window.location.origin + image, "property");
	setMeta("og:url", url, "property");
	setMeta("og:type", type, "property");
	setMeta("og:site_name", siteName, "property");
	setMeta("twitter:card", "summary_large_image");
	setMeta("twitter:title", fullTitle);
	setMeta("twitter:description", description);
	setMeta("twitter:image", image.startsWith("http") ? image : window.location.origin + image);
	let canonical = document.querySelector("link[rel=\"canonical\"]");
	if (!canonical) {
		canonical = document.createElement("link");
		canonical.setAttribute("rel", "canonical");
		document.head.appendChild(canonical);
	}
	canonical.setAttribute("href", url);
};
//#endregion
//#region src/pages/Home.jsx
var Home_exports = /* @__PURE__ */ __exportAll({
	default: () => Home_default,
	links: () => links,
	loader: () => loader$2,
	meta: () => meta$7
});
var links = () => [{
	rel: "preload",
	as: "image",
	href: "/hero-1.webp",
	type: "image/webp"
}];
var meta$7 = () => {
	return [
		{ title: "Distributor Lampu PJU Tenaga Surya Terbaik 2026 | Niscahya Indonesia Cerdas" },
		{
			name: "description",
			content: "Distributor resmi Lampu PJU Tenaga Surya (Solar Street Light) berkualitas di Indonesia. Tersedia model All In One, Two In One, dan Konvensional dengan harga kompetitif dan garansi terjamin."
		},
		{
			name: "keywords",
			content: "lampu pju tenaga surya, solar street light indonesia, harga lampu jalan tenaga surya, distributor solar panel surabaya, pju all in one, pju two in one, energi terbarukan indonesia, niscahya indonesia cerdas"
		},
		{
			property: "og:title",
			content: "Distributor Lampu PJU Tenaga Surya Terbaik 2026 | Niscahya Indonesia Cerdas"
		},
		{
			property: "og:description",
			content: "Distributor resmi Lampu PJU Tenaga Surya (Solar Street Light) berkualitas di Indonesia. Tersedia model All In One, Two In One, dan Konvensional dengan harga kompetitif dan garansi terjamin."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			property: "og:site_name",
			content: "Niscahya Indonesia Cerdas"
		}
	];
};
var HeroSlider = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [direction, setDirection] = useState(0);
	const slides = [
		{
			id: 1,
			image: "/hero-1.webp",
			title: "Infrastruktur PJU Tenaga Surya Terintegrasi"
		},
		{
			id: 2,
			image: "/hero-2.webp",
			title: "Unit Unggulan All In One Series"
		},
		{
			id: 3,
			image: "/hero-3.webp",
			title: "Solusi Energi Terbarukan Berkelanjutan"
		}
	];
	const slideVariants = {
		enter: (slideDirection) => ({
			x: slideDirection > 0 ? 1e3 : -1e3,
			opacity: 0
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1
		},
		exit: (slideDirection) => ({
			zIndex: 0,
			x: slideDirection < 0 ? 1e3 : -1e3,
			opacity: 0
		})
	};
	useEffect(() => {
		const timer = setInterval(() => {
			setDirection(1);
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 8e3);
		return () => clearInterval(timer);
	}, [slides.length]);
	const paginate = (newDirection) => {
		setDirection(newDirection);
		setCurrentSlide((prev) => (prev + newDirection + slides.length) % slides.length);
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "relative w-full aspect-video md:aspect-auto md:h-[80vh] rounded-xl md:rounded-[48px] overflow-hidden group shadow-2xl shadow-black/5 mt-4",
		children: [
			/* @__PURE__ */ jsx(AnimatePresence, {
				initial: false,
				custom: direction,
				children: /* @__PURE__ */ jsx(motion.img, {
					src: slides[currentSlide].image,
					alt: slides[currentSlide].title,
					custom: direction,
					variants: slideVariants,
					initial: "enter",
					animate: "center",
					exit: "exit",
					transition: {
						x: {
							type: "spring",
							stiffness: 300,
							damping: 30
						},
						opacity: { duration: .5 }
					},
					className: "absolute inset-0 w-full h-full object-cover"
				}, currentSlide)
			}),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent pointer-events-none" }),
			/* @__PURE__ */ jsx("div", {
				className: "absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10",
				children: slides.map((_, index) => /* @__PURE__ */ jsx("button", {
					type: "button",
					"aria-label": `Buka slide ${index + 1}`,
					"aria-pressed": currentSlide === index,
					onClick: () => {
						setDirection(index > currentSlide ? 1 : -1);
						setCurrentSlide(index);
					},
					className: `w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-primary w-6 md:w-8" : "bg-white/50 hover:bg-white"}`
				}, index))
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": "Slide sebelumnya",
				onClick: () => paginate(-1),
				className: "absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white/30 z-10",
				children: /* @__PURE__ */ jsx("i", { className: "bx bx-chevron-left text-2xl md:text-3xl" })
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": "Slide berikutnya",
				onClick: () => paginate(1),
				className: "absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white/30 z-10",
				children: /* @__PURE__ */ jsx("i", { className: "bx bx-chevron-right text-2xl md:text-3xl" })
			})
		]
	});
};
var loader$2 = async ({ request }) => {
	try {
		const url = new URL(request.url);
		const apiUrl = `${url.protocol}//${url.host}/api/products`;
		const res = await fetch(apiUrl, { timeout: 5e3 });
		if (!res.ok) throw new Error(`API responded with ${res.status}`);
		const products = await res.json();
		return { products: Array.isArray(products) ? products : [] };
	} catch (error) {
		console.error("Home loader error:", error);
		return { products: [] };
	}
};
var Home = () => {
	const { products } = useLoaderData() || { products: [] };
	useEffect(() => {
		updateSEO({
			title: "Distributor Lampu PJU Tenaga Surya Terbaik 2026",
			description: "Distributor resmi Lampu PJU Tenaga Surya (Solar Street Light) berkualitas di Indonesia. Tersedia model All In One, Two In One, dan Konvensional dengan harga kompetitif dan garansi terjamin.",
			keywords: "lampu pju tenaga surya, solar street light indonesia, harga lampu jalan tenaga surya, distributor solar panel surabaya, pju all in one, pju two in one, energi terbarukan indonesia, niscahya indonesia cerdas"
		});
	}, []);
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [loading, setLoading] = useState(!products.length);
	useEffect(() => {
		if (products.length > 0) {
			const targetIds = [
				32,
				77,
				83,
				80
			];
			const filtered = products.filter((p) => targetIds.includes(p.id)).sort((a, b) => targetIds.indexOf(a.id) - targetIds.indexOf(b.id));
			setFeaturedProducts(filtered.length > 0 ? filtered : products.slice(0, 4));
			setLoading(false);
			return;
		}
		const fetchProducts = async () => {
			try {
				const data = await (await fetch("/api/products")).json();
				if (Array.isArray(data)) {
					const targetIds = [
						32,
						77,
						83,
						80
					];
					const filtered = data.filter((p) => targetIds.includes(p.id)).sort((a, b) => targetIds.indexOf(a.id) - targetIds.indexOf(b.id));
					setFeaturedProducts(filtered.length > 0 ? filtered : data.slice(0, 4));
				} else {
					console.error("API did not return an array:", data);
					setFeaturedProducts([]);
				}
			} catch (err) {
				console.error("Failed to fetch products:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, [products]);
	const stats = [
		{
			label: "Proyek Selesai",
			value: "150+",
			unit: "Unit",
			icon: "bx bx-check-double",
			color: "text-primary"
		},
		{
			label: "Panel Terpasang",
			value: "5000+",
			unit: "Panel",
			icon: "bx bx-sun",
			color: "text-secondary"
		},
		{
			label: "Jangkauan Wilayah",
			value: "24+",
			unit: "Provinsi",
			icon: "bx bx-map-alt",
			color: "text-accent"
		}
	];
	const partners = [
		"NISCAHYA",
		"INDONESIA",
		"CERDAS"
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-10 md:space-y-24",
		children: [
			/* @__PURE__ */ jsx(HeroSlider, {}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
				children: [/* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						x: -50
					},
					whileInView: {
						opacity: 1,
						x: 0
					},
					transition: { duration: .8 },
					className: "space-y-8",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-black tracking-[0.4em] text-primary uppercase",
								children: "Tentang Niscahya"
							}), /* @__PURE__ */ jsx("h2", {
								className: "text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none",
								children: "Menerangi Masa Depan Indonesia."
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-lg text-text-secondary font-medium leading-relaxed",
							children: "CV Niscahya Indonesia Cerdas adalah mitra strategis Anda dalam distribusi lampu PJU Tenaga Surya dan PLN berkualitas tinggi. Kami menghadirkan solusi penerangan jalan umum yang mengedepankan efisiensi maksimal, penghematan energi, serta konsep ramah lingkungan yang berkelanjutan."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-lg text-text-secondary font-medium leading-relaxed",
							children: "Didukung oleh tim profesional dan produk berstandar industri, kami siap melayani kebutuhan pencahayaan proyek di seluruh skala wilayah Indonesia dari pusat perkotaan hingga pelosok daerah terpencil. Komitmen utama kami adalah memberikan akses cahaya yang aman, andal, dan inovatif bagi masyarakat Indonesia."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "pt-4 flex items-center gap-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl",
									children: /* @__PURE__ */ jsx("i", { className: "bx bx-check-shield" })
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold uppercase tracking-widest text-xs",
									children: "Kualitas Teruji"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary text-2xl",
									children: /* @__PURE__ */ jsx("i", { className: "bx bx-leaf" })
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold uppercase tracking-widest text-xs",
									children: "Ramah Lingkungan"
								})]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "pt-4",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/about",
								className: "inline-flex items-center gap-3 px-8 py-4 bg-black/5 hover:bg-primary hover:text-background transition-all rounded-xl font-bold uppercase tracking-widest text-xs group",
								children: ["Selengkapnya ", /* @__PURE__ */ jsx("i", { className: "bx bx-right-arrow-alt text-xl group-hover:translate-x-1 transition-transform" })]
							})
						})
					]
				}), /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						x: 50
					},
					whileInView: {
						opacity: 1,
						x: 0
					},
					transition: { duration: .8 },
					className: "relative h-64 md:h-125 rounded-3xl md:rounded-[48px] overflow-hidden shadow-2xl shadow-black/5",
					children: [
						/* @__PURE__ */ jsx("img", {
							src: "/PJU TENAGA SURYA.webp",
							alt: "Industri Energi Surya",
							loading: "lazy",
							decoding: "async",
							width: "1200",
							height: "900",
							className: "w-full h-full object-cover"
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-linear-to-t from-black/60 to-transparent" }),
						/* @__PURE__ */ jsx("div", {
							className: "absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 p-4 md:p-6 glass-bright rounded-2xl md:rounded-3xl border border-white/20",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex justify-around items-center",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "text-center",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "text-2xl md:text-3xl font-black text-primary",
											children: "10+"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-text-secondary mt-1",
											children: "Tahun Pengalaman"
										})]
									}),
									/* @__PURE__ */ jsx("div", { className: "w-px h-10 md:h-12 bg-black/10" }),
									/* @__PURE__ */ jsxs("div", {
										className: "text-center",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "text-2xl md:text-3xl font-black text-secondary",
											children: "500+"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-text-secondary mt-1",
											children: "Proyek Selesai"
										})]
									})
								]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "grid grid-cols-3 gap-3 md:gap-8",
				children: stats.map((stat, i) => /* @__PURE__ */ jsxs(motion.div, {
					whileInView: {
						opacity: 1,
						y: 0
					},
					initial: {
						opacity: 0,
						y: 20
					},
					transition: { delay: i * .1 },
					className: "glass p-6 md:p-10 rounded-2xl md:rounded-[48px] text-center space-y-4 md:space-y-6 border-black/5 hover:border-primary/20 transition-all group shadow-xl shadow-black/5",
					children: [/* @__PURE__ */ jsx("div", {
						className: `w-10 h-10 md:w-20 md:h-20 mx-auto bg-black/5 rounded-xl md:rounded-3xl flex items-center justify-center text-xl md:text-4xl ${stat.color} group-hover:scale-110 transition-transform`,
						children: /* @__PURE__ */ jsx("i", { className: stat.icon })
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-1 md:space-y-2",
						children: [/* @__PURE__ */ jsx("h4", {
							className: "text-2xl md:text-6xl font-black tracking-tighter uppercase",
							children: stat.value
						}), /* @__PURE__ */ jsx("p", {
							className: "text-[8px] md:text-sm font-black text-text-secondary uppercase tracking-widest md:tracking-[0.2em] leading-tight",
							children: stat.label
						})]
					})]
				}, stat.label))
			}),
			/* @__PURE__ */ jsx("section", {
				className: "overflow-hidden py-10 border-y border-black/5 -mx-6 lg:-mx-10",
				children: /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-20 animate-marquee whitespace-nowrap",
					children: [
						...partners,
						...partners,
						...partners,
						...partners
					].map((partner, i) => /* @__PURE__ */ jsx("span", {
						className: "text-4xl md:text-6xl font-black text-black/5 uppercase tracking-tighter hover:text-primary transition-colors cursor-default",
						children: partner
					}, i))
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "space-y-16",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black tracking-[0.4em] text-primary uppercase",
							children: "Produk Kami"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none",
							children: "Unggulan."
						})]
					}), /* @__PURE__ */ jsxs(Link, {
						to: "/products",
						className: "px-8 py-4 glass border border-black/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black/5 transition-all",
						children: ["Lihat Semua Produk ", /* @__PURE__ */ jsx("i", { className: "bx bx-right-arrow-alt text-lg align-middle ml-2" })]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "relative",
					children: loading ? /* @__PURE__ */ jsx("div", {
						className: "flex flex-nowrap overflow-x-auto gap-4 md:gap-8 pb-4",
						children: [
							1,
							2,
							3,
							4
						].map((i) => /* @__PURE__ */ jsx("div", { className: "min-w-70 md:min-w-0 md:flex-1 h-48 md:h-100 glass animate-pulse rounded-3xl md:rounded-[48px]" }, i))
					}) : /* @__PURE__ */ jsx("div", {
						className: "flex flex-nowrap overflow-x-auto no-scrollbar gap-4 md:gap-8 pb-4 md:grid md:grid-cols-4",
						children: featuredProducts.map((product, i) => /* @__PURE__ */ jsx(motion.div, {
							initial: {
								opacity: 0,
								y: 20
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							transition: { delay: i * .1 },
							className: "min-w-70 md:min-w-0 w-full",
							children: /* @__PURE__ */ jsx(ProductCard, { product })
						}, product.id))
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "space-y-16",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black tracking-[0.4em] text-secondary uppercase",
							children: "Wawasan & Edukasi"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none",
							children: "Blog Terbaru."
						})]
					}), /* @__PURE__ */ jsxs(Link, {
						to: "/blog",
						className: "px-8 py-4 glass border border-black/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black/5 transition-all",
						children: ["Jelajahi Semua Artikel ", /* @__PURE__ */ jsx("i", { className: "bx bx-right-arrow-alt text-lg align-middle ml-2" })]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "relative",
					children: /* @__PURE__ */ jsx("div", {
						className: "flex flex-nowrap overflow-x-auto no-scrollbar gap-6 md:gap-8 pb-6 md:grid md:grid-cols-3",
						children: [...blogPosts].sort((a, b) => b.id - a.id).slice(0, 3).map((post, i) => /* @__PURE__ */ jsxs(motion.article, {
							initial: {
								opacity: 0,
								y: 20
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							transition: { delay: i * .1 },
							className: "min-w-75 md:min-w-0 group glass rounded-[40px] overflow-hidden border-black/5 hover:border-secondary/20 transition-all flex flex-col",
							children: [/* @__PURE__ */ jsxs(Link, {
								to: `/blog/${post.slug}`,
								className: "relative aspect-video overflow-hidden block",
								children: [/* @__PURE__ */ jsx("img", {
									src: post.image,
									alt: post.title,
									loading: "lazy",
									decoding: "async",
									width: "1200",
									height: "675",
									className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
								}), /* @__PURE__ */ jsx("div", {
									className: "absolute top-4 left-4",
									children: /* @__PURE__ */ jsx("span", {
										className: "px-3 py-1.5 bg-white/90 backdrop-blur-md text-[8px] font-black uppercase tracking-widest rounded-lg text-secondary shadow-lg",
										children: post.category
									})
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-8 space-y-4 grow flex flex-col",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "text-[9px] font-black text-text-secondary uppercase tracking-widest",
										children: post.date
									}),
									/* @__PURE__ */ jsx(Link, {
										to: `/blog/${post.slug}`,
										children: /* @__PURE__ */ jsx("h3", {
											className: "text-xl font-black tracking-tight uppercase leading-tight group-hover:text-secondary transition-colors line-clamp-2",
											children: post.title
										})
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-text-secondary font-medium line-clamp-2 leading-relaxed grow",
										children: post.excerpt
									}),
									/* @__PURE__ */ jsx("div", {
										className: "pt-4",
										children: /* @__PURE__ */ jsxs(Link, {
											to: `/blog/${post.slug}`,
											className: "text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2 hover:gap-3 transition-all",
											children: ["Baca Selengkapnya ", /* @__PURE__ */ jsx("i", { className: "bx bx-right-arrow-alt text-lg" })]
										})
									})
								]
							})]
						}, post.id))
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "contact",
				className: "grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12 border-t border-black/5",
				children: [/* @__PURE__ */ jsx("div", {
					className: "glass p-10 rounded-[48px] space-y-8 flex flex-col justify-between border-black/5 shadow-xl shadow-black/5",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-black tracking-[0.4em] text-primary uppercase",
								children: "Hubungi Kami"
							}), /* @__PURE__ */ jsxs("h3", {
								className: "text-4xl font-black uppercase tracking-tighter",
								children: [
									"Siap Melayani ",
									/* @__PURE__ */ jsx("br", {}),
									"Kebutuhan Anda."
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-6",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl",
										children: /* @__PURE__ */ jsx("i", { className: "bx bxs-phone-call" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col min-w-0",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-black text-text-secondary/60 uppercase tracking-[0.2em]",
											children: "Telepon / WA"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex flex-col gap-0.5",
											children: [/* @__PURE__ */ jsx("a", {
												href: "https://wa.me/6287853536124",
												target: "_blank",
												rel: "noopener noreferrer",
												className: "text-base md:text-lg font-black tracking-tight hover:text-primary transition-colors",
												children: "+62 878 5353 6124"
											}), /* @__PURE__ */ jsx("a", {
												href: "https://wa.me/6282143707398",
												target: "_blank",
												rel: "noopener noreferrer",
												className: "text-base md:text-lg font-black tracking-tight hover:text-primary transition-colors",
												children: "+62 821 4370 7398"
											})]
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-6",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-14 h-14 shrink-0 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary text-2xl",
										children: /* @__PURE__ */ jsx("i", { className: "bx bxs-envelope" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col min-w-0 overflow-hidden",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-black text-text-secondary/60 uppercase tracking-[0.2em]",
											children: "Email"
										}), /* @__PURE__ */ jsx("a", {
											href: "https://mail.google.com/mail/?view=cm&fs=1&to=cvniscahyaindonesiacerdas@gmail.com",
											target: "_blank",
											rel: "noopener noreferrer",
											className: "text-sm md:text-base font-black tracking-tight break-all hover:text-secondary transition-colors",
											children: "cvniscahyaindonesiacerdas@gmail.com"
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-6",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl",
										children: /* @__PURE__ */ jsx("i", { className: "bx bxs-map" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-black text-text-secondary/60 uppercase tracking-[0.2em]",
											children: "Marketing Office"
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-lg font-black leading-tight tracking-tight",
											children: [
												"Wisma Juanda Permai Jl. Bouraq Blok B1 No. 15, Sedati Gede, ",
												/* @__PURE__ */ jsx("br", {}),
												"Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur"
											]
										})]
									})]
								})
							]
						})]
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "glass p-4 rounded-[48px] border-black/5 shadow-xl shadow-black/5 relative overflow-hidden h-125 lg:h-auto",
					children: /* @__PURE__ */ jsx("iframe", {
						title: "Peta lokasi marketing office Niscahya Indonesia Cerdas",
						src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.047714009534!2d112.75474949999999!3d-7.373135199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e5e072a76abf%3A0xe5803d1aaf72795b!2sLampu%20PJU%20SinarSurya%20EnergiKu!5e1!3m2!1sid!2sid!4v1776048109065!5m2!1sid!2sid",
						width: "100%",
						height: "100%",
						style: { border: 0 },
						allowFullScreen: "",
						loading: "lazy",
						referrerPolicy: "no-referrer-when-downgrade",
						className: "rounded-[36px] shadow-inner"
					})
				})]
			})
		]
	});
};
var Home_default = UNSAFE_withComponentProps(Home);
//#endregion
//#region src/pages/Products.jsx
var Products_exports = /* @__PURE__ */ __exportAll({
	default: () => Products_default,
	loader: () => loader$1,
	meta: () => meta$6
});
var meta$6 = () => {
	return [
		{ title: "Solusi PJU Tenaga Surya Terdepan | Niscahya Indonesia Cerdas" },
		{
			name: "description",
			content: "Katalog perangkat PJU Tenaga Surya standar industri. Solusi infrastruktur dengan durabilitas tinggi dan efisiensi energi teruji untuk berbagai kebutuhan proyek Anda."
		},
		{
			name: "keywords",
			content: "jual pju tenaga surya, katalog pju solar cell, pju all in one, pju two in one, lampu jalan tenaga surya surabaya, niscahya indonesia cerdas"
		},
		{
			property: "og:title",
			content: "Solusi PJU Tenaga Surya Terdepan | Niscahya Indonesia Cerdas"
		},
		{
			property: "og:description",
			content: "Katalog perangkat PJU Tenaga Surya standar industri. Solusi infrastruktur dengan durabilitas tinggi dan efisiensi energi teruji untuk berbagai kebutuhan proyek Anda."
		}
	];
};
var categoryStructure = {
	"PJU Tenaga Surya": [
		"All In One",
		"Two In One",
		"Konvensional"
	],
	"PJU PLN": [],
	"Pompa Air Tenaga Surya": [],
	"Traffic Light": [],
	"Warning Light": [],
	"Lampu Taman": [],
	"Solar Home System": [],
	"Aksesori": [
		"Solar Panel",
		"Controller",
		"Inverter",
		"Baterai"
	]
};
var categories = ["Semua", ...Object.keys(categoryStructure)];
var ProductGrid = memo(({ products, loading, searchQuery, handleReset }) => {
	if (loading) return /* @__PURE__ */ jsxs("div", {
		className: "py-40 text-center space-y-4",
		children: [/* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" }), /* @__PURE__ */ jsx("p", {
			className: "text-text-secondary font-black uppercase tracking-widest text-xs",
			children: "Menyiapkan Database..."
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8",
		children: [products.map((product) => /* @__PURE__ */ jsx("div", {
			className: "animate-in fade-in duration-300",
			children: /* @__PURE__ */ jsx(ProductCard, { product })
		}, product.id)), products.length === 0 && /* @__PURE__ */ jsxs("div", {
			className: "col-span-full py-40 glass rounded-[64px] flex flex-col items-center justify-center text-center space-y-8 shadow-2xl shadow-black/5 border-black/5 animate-in fade-in duration-500",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "w-24 h-24 bg-black/5 rounded-4xl flex items-center justify-center border border-black/5 animate-bounce-slow",
					children: /* @__PURE__ */ jsx("i", { className: "bx bx-ghost text-5xl text-text-secondary" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-3xl font-black uppercase tracking-tighter",
						children: "Tidak Ditemukan."
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-text-secondary font-medium tracking-tight",
						children: [
							"Tidak ada produk ditemukan untuk \"",
							searchQuery,
							"\""
						]
					})]
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: handleReset,
					className: "px-10 py-4 bg-primary text-background font-black rounded-2xl hover:scale-105 transition-all",
					children: "Atur Ulang Filter"
				})
			]
		})]
	});
});
var normalizeText = (text) => {
	if (!text) return "";
	return text.toLowerCase().replace(/wa+t+s?/g, "w").replace(/kilo\s*wa+t+s?/g, "kw").replace(/(\d+)\s*(w|kw|ah|v|a|wp)\b/g, "$1$2").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
};
var fuzzyMatch = (text, query) => {
	const nText = normalizeText(text);
	const nQuery = normalizeText(query);
	if (nText.includes(nQuery)) return true;
	const queryWords = nQuery.split(" ").filter((w) => w.length > 0);
	if (queryWords.length === 0) return true;
	return queryWords.every((word) => {
		if (nText.includes(word)) return true;
		if (word.length > 3) {
			if (new RegExp(word.split("").join(".?"), "i").test(nText)) return true;
		}
		return false;
	});
};
var loader$1 = async ({ request }) => {
	try {
		const url = new URL(request.url);
		const apiUrl = `${url.protocol}//${url.host}/api/products`;
		const res = await fetch(apiUrl, { timeout: 5e3 });
		if (!res.ok) throw new Error(`API responded with ${res.status}`);
		const products = await res.json();
		return { products: Array.isArray(products) ? products : [] };
	} catch (error) {
		console.error("Products loader error:", error);
		return { products: [] };
	}
};
var Products = () => {
	const { products: initialProducts } = useLoaderData() || { products: [] };
	const { searchQuery, setSearchQuery } = useApp();
	const location = useLocation();
	const [selectedCategory, setSelectedCategory] = useState("Semua");
	const [selectedSubCategory, setSelectedSubCategory] = useState("Semua");
	const [products, setProducts] = useState(initialProducts);
	const [loading, setLoading] = useState(!initialProducts.length);
	useRef(null);
	useEffect(() => {
		if (initialProducts.length > 0) {
			setProducts(initialProducts);
			setLoading(false);
			return;
		}
		const fetchProducts = async () => {
			try {
				const data = await (await fetch("/api/products")).json();
				if (Array.isArray(data)) setProducts(data);
				else {
					console.error("API did not return an array:", data);
					setProducts([]);
				}
			} catch (err) {
				console.error("Failed to fetch products:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, [initialProducts]);
	const handleReset = () => {
		setSelectedCategory("Semua");
		setSelectedSubCategory("Semua");
		setSearchQuery("");
	};
	useEffect(() => {
		const cat = new URLSearchParams(location.search).get("category");
		if (cat) {
			setSelectedCategory(cat);
			setSelectedSubCategory("Semua");
		} else {
			setSelectedCategory("Semua");
			setSelectedSubCategory("Semua");
		}
	}, [location.search]);
	const currentSubCategories = selectedCategory !== "Semua" ? categoryStructure[selectedCategory] : [];
	const filteredProducts = useMemo(() => {
		if (!products.length) return [];
		const query = searchQuery.trim().toLowerCase();
		const cat = selectedCategory;
		const subCat = selectedSubCategory;
		const filtered = products.filter((product) => {
			if (cat !== "Semua") {
				const productCat = product.category;
				const isOldPJUPLN = cat === "PJU PLN" && productCat === "PJU PLN (50-200 watt)";
				if (productCat !== cat && !productCat.startsWith(cat + " -") && !isOldPJUPLN) return false;
			}
			if (subCat !== "Semua" && !product.category.includes(subCat)) return false;
			if (query) {
				const nameMatch = fuzzyMatch(product.name, query);
				const categoryMatch = fuzzyMatch(product.category, query);
				let specs = [];
				try {
					if (Array.isArray(product.specs)) specs = product.specs;
					else if (typeof product.specs === "string" && product.specs.trim()) {
						const trimmed = product.specs.trim();
						if (trimmed.startsWith("[") || trimmed.startsWith("{")) specs = JSON.parse(trimmed);
						else specs = trimmed.split(",").map((s) => s.trim());
					}
				} catch (e) {
					console.warn("Failed to parse specs for product:", product.id, e);
					specs = [];
				}
				const specMatch = Array.isArray(specs) && specs.some((spec) => fuzzyMatch(String(spec), query));
				product._searchScore = 0;
				if (nameMatch) product._searchScore += 100;
				if (categoryMatch) product._searchScore += 50;
				if (specMatch) product._searchScore += 20;
				return nameMatch || categoryMatch || specMatch;
			}
			product._searchScore = 0;
			return true;
		});
		if (query) return [...filtered].sort((a, b) => (b._searchScore || 0) - (a._searchScore || 0));
		return filtered;
	}, [
		products,
		selectedCategory,
		selectedSubCategory,
		searchQuery
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-12 md:space-y-16",
		children: [
			/* @__PURE__ */ jsx("section", {
				className: "relative pt-6 md:pt-10 pb-4 md:pb-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-3xl space-y-4 md:space-y-6",
					children: [/* @__PURE__ */ jsxs(motion.h1, {
						initial: {
							y: 20,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						transition: { delay: .1 },
						className: "text-3xl md:text-6xl font-black tracking-tighter uppercase leading-[1.1]",
						children: [
							"Solusi ",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", {
								className: "text-gradient",
								children: "Terdepan."
							})
						]
					}), /* @__PURE__ */ jsx(motion.p, {
						initial: {
							y: 20,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						transition: { delay: .2 },
						className: "text-lg md:text-xl text-text-secondary font-medium max-w-xl",
						children: "Katalog perangkat PJU Tenaga Surya standar industri. Solusi infrastruktur dengan durabilitas tinggi dan efisiensi energi teruji untuk berbagai kebutuhan proyek Anda."
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "sticky top-28 z-40 -mx-6 lg:-mx-10 px-6 lg:px-10 py-3 bg-background/95 backdrop-blur-xl border-b border-black/5",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 mb-1",
							children: [/* @__PURE__ */ jsx("div", { className: "w-1 h-3 bg-primary rounded-full" }), /* @__PURE__ */ jsx("span", {
								className: "text-[15px] font-black uppercase tracking-widest text-text-secondary",
								children: "Pilih Kategori"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex flex-nowrap md:flex-wrap items-center gap-2 overflow-x-auto md:overflow-visible no-scrollbar scroll-smooth py-1.5 px-0.5 max-w-full lg:max-w-[90%]",
							children: categories.map((cat, idx) => /* @__PURE__ */ jsx(motion.button, {
								initial: {
									opacity: 0,
									y: 5
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: { delay: idx * .02 },
								onClick: () => {
									setSelectedCategory(cat);
									setSelectedSubCategory("Semua");
								},
								className: `px-5 py-2 rounded-full text-[10px] font-black tracking-wider uppercase transition-all whitespace-nowrap shrink-0 ${selectedCategory === cat ? "bg-primary text-white shadow-md shadow-primary/20 scale-105 mx-0.5" : "bg-black/5 text-text-secondary hover:bg-black/10"}`,
								children: cat
							}, cat))
						}),
						/* @__PURE__ */ jsx(AnimatePresence, {
							mode: "wait",
							children: currentSubCategories.length > 0 && /* @__PURE__ */ jsx(motion.div, {
								initial: {
									opacity: 0,
									y: 5
								},
								animate: {
									opacity: 1,
									y: 0
								},
								exit: {
									opacity: 0,
									y: 5
								},
								className: "flex items-center py-1.5 px-0.5",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-0.5 p-1 bg-black/5 rounded-full border border-black/5 w-full md:w-auto",
									children: [
										/* @__PURE__ */ jsx("button", {
											onClick: () => setSelectedSubCategory("Semua"),
											className: `flex-1 md:flex-none px-2 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-wider transition-all text-center whitespace-nowrap ${selectedSubCategory === "Semua" ? "bg-secondary text-white shadow-sm shadow-secondary/20" : "text-text-secondary hover:text-primary"}`,
											children: "Semua Tipe"
										}),
										/* @__PURE__ */ jsx("div", { className: "w-px h-3 bg-black/10 shrink-0 hidden md:block" }),
										currentSubCategories.map((sub) => /* @__PURE__ */ jsx("button", {
											onClick: () => setSelectedSubCategory(sub),
											className: `flex-1 md:flex-none px-2 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-wider transition-all text-center whitespace-nowrap ${selectedSubCategory === sub ? "bg-secondary text-white shadow-sm shadow-secondary/20" : "text-text-secondary hover:text-primary"}`,
											children: sub
										}, sub))
									]
								})
							}, selectedCategory)
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: searchQuery && /* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: 20
				},
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 glass rounded-4xl border-primary/10 shadow-2xl shadow-primary/5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center",
						children: /* @__PURE__ */ jsx("i", { className: "bx bx-search-alt text-2xl text-primary animate-pulse" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-[10px] font-black uppercase tracking-widest text-text-secondary",
							children: "Hasil Pencarian"
						}), /* @__PURE__ */ jsxs("h2", {
							className: "text-xl font-black tracking-tight",
							children: [
								"Menampilkan ",
								/* @__PURE__ */ jsx("span", {
									className: "text-primary",
									children: filteredProducts.length
								}),
								" produk untuk ",
								/* @__PURE__ */ jsxs("span", {
									className: "text-primary",
									children: [
										"\"",
										searchQuery,
										"\""
									]
								})
							]
						})]
					})]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: () => setSearchQuery(""),
					className: "px-6 py-3 bg-black/5 hover:bg-black/10 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 group",
					children: [/* @__PURE__ */ jsx("i", { className: "bx bx-x text-lg group-hover:rotate-90 transition-transform" }), "Hapus Pencarian"]
				})]
			}) }),
			/* @__PURE__ */ jsx(ProductGrid, {
				products: filteredProducts,
				loading,
				searchQuery,
				handleReset
			})
		]
	});
};
var Products_default = UNSAFE_withComponentProps(Products);
//#endregion
//#region src/pages/ProductDetail.jsx
var ProductDetail_exports = /* @__PURE__ */ __exportAll({
	default: () => ProductDetail_default,
	loader: () => loader,
	meta: () => meta$5
});
var meta$5 = ({ data }) => {
	if (!data || !data.product) return [{ title: "Produk Tidak Ditemukan | Niscahya Indonesia Cerdas" }];
	const { product } = data;
	return [
		{ title: `${product.name} | Niscahya Indonesia Cerdas` },
		{
			name: "description",
			content: product.description?.substring(0, 160) || ""
		},
		{
			name: "keywords",
			content: `${product.name}, ${product.category}, jual pju tenaga surya, spesifikasi ${product.name}, harga pju solar cell`
		},
		{
			property: "og:title",
			content: product.name
		},
		{
			property: "og:description",
			content: product.description?.substring(0, 160) || ""
		},
		{
			property: "og:image",
			content: product.image || "/og-image.png"
		},
		{
			property: "og:type",
			content: "product"
		}
	];
};
var normalizeImageList = (value) => {
	if (Array.isArray(value)) return value;
	if (typeof value !== "string") return [];
	const trimmed = value.trim();
	if (!trimmed) return [];
	try {
		const parsed = JSON.parse(trimmed);
		if (Array.isArray(parsed)) return parsed;
	} catch {}
	return trimmed.split(",");
};
var loader = async ({ params, request }) => {
	const { slug } = params;
	const canonicalUrl = request.url;
	try {
		const url = new URL(request.url);
		const baseUrl = `${url.protocol}//${url.host}`;
		const productUrl = `${baseUrl}/api/products/${slug}`;
		const productsUrl = `${baseUrl}/api/products`;
		const [prodRes, allRes] = await Promise.all([fetch(productUrl, { timeout: 5e3 }), fetch(productsUrl, { timeout: 5e3 })]);
		if (prodRes.ok) {
			const product = await prodRes.json();
			const allProducts = allRes.ok ? await allRes.json() : [];
			return {
				product,
				allProducts: Array.isArray(allProducts) ? allProducts : [],
				canonicalUrl
			};
		}
		return {
			product: null,
			allProducts: [],
			canonicalUrl
		};
	} catch (error) {
		console.error("ProductDetail loader error:", error);
		return {
			product: null,
			allProducts: [],
			canonicalUrl
		};
	}
};
var ProductDetail = () => {
	const { slug } = useParams();
	const { product: initialProduct, allProducts: initialAllProducts, canonicalUrl: initialCanonicalUrl } = useLoaderData() || {
		product: null,
		allProducts: [],
		canonicalUrl: ""
	};
	const [product, setProduct] = useState(initialProduct);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [loading, setLoading] = useState(!initialProduct);
	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(initialProduct?.image || null);
	useEffect(() => {
		if (product) {
			const normalizedExtras = [
				...normalizeImageList(product.images),
				product.image2,
				product.image3,
				product.image4,
				product.image5
			].filter(Boolean);
			const firstAvailableImage = product.image || normalizedExtras[0] || null;
			if (!selectedImage) setSelectedImage(firstAvailableImage);
			if (initialAllProducts.length > 0) {
				const otherProducts = initialAllProducts.filter((p) => p.id !== product.id);
				const sameCategory = otherProducts.filter((p) => p.category === product.category).sort(() => .5 - Math.random());
				const differentCategory = otherProducts.filter((p) => p.category !== product.category).sort(() => .5 - Math.random());
				setRelatedProducts([...sameCategory, ...differentCategory].slice(0, 4));
			}
		}
	}, [
		product,
		initialAllProducts,
		selectedImage
	]);
	useEffect(() => {
		if (initialProduct) {
			setProduct(initialProduct);
			setLoading(false);
			return;
		}
		const fetchData = async () => {
			try {
				const [prodRes, allRes] = await Promise.all([fetch(`/api/products/${slug}`), fetch("/api/products")]);
				if (prodRes.ok) {
					const prodData = await prodRes.json();
					const normalizedExtras = [
						...normalizeImageList(prodData.images),
						prodData.image2,
						prodData.image3,
						prodData.image4,
						prodData.image5
					].filter(Boolean);
					const firstAvailableImage = prodData.image || normalizedExtras[0] || null;
					setProduct(prodData);
					setSelectedImage(firstAvailableImage);
					updateSEO({
						title: prodData.name,
						description: prodData.description?.substring(0, 160),
						keywords: `${prodData.name}, ${prodData.category}, jual pju tenaga surya, spesifikasi ${prodData.name}, harga pju solar cell`,
						image: firstAvailableImage || "/og-image.png",
						type: "product"
					});
					if (allRes.ok) {
						const otherProducts = (await allRes.json()).filter((p) => p.id !== prodData.id);
						const sameCategory = otherProducts.filter((p) => p.category === prodData.category).sort(() => .5 - Math.random());
						const differentCategory = otherProducts.filter((p) => p.category !== prodData.category).sort(() => .5 - Math.random());
						setRelatedProducts([...sameCategory, ...differentCategory].slice(0, 4));
					}
				} else setProduct(null);
			} catch (err) {
				console.error("Failed to fetch product data:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [slug, initialProduct]);
	if (loading) return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center py-40 glass rounded-[64px] space-y-4",
		children: [/* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ jsx("p", {
			className: "text-text-secondary font-black uppercase tracking-widest text-xs",
			children: "Mengakses Inti Sistem..."
		})]
	});
	if (!product) return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center py-40 glass rounded-[64px] space-y-8",
		children: [
			/* @__PURE__ */ jsx("i", { className: "bx bx-error text-8xl text-primary animate-pulse" }),
			/* @__PURE__ */ jsx("h1", {
				className: "text-4xl font-black uppercase tracking-tighter",
				children: "Produk Tidak Ditemukan"
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/products",
				className: "px-10 py-5 bg-primary text-background font-black rounded-2xl",
				children: "Kembali ke Katalog"
			})
		]
	});
	const normalizedGalleryImages = [
		...normalizeImageList(product.images),
		product.image2,
		product.image3,
		product.image4,
		product.image5
	].filter(Boolean);
	const renderDescription = (text) => {
		if (!text) return null;
		return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
			if (part.startsWith("**") && part.endsWith("**")) return /* @__PURE__ */ jsx("strong", {
				className: "font-black text-text-main",
				children: part.slice(2, -2)
			}, index);
			return part;
		});
	};
	const handleBuyNow = () => {
		const phoneNumber = "6287853536124";
		const message = `Halo Admin Niscahya Indonesia Cerdas
  Saya ingin melakukan pembelian produk berikut:
  ${product?.name || "Produk"}
  Jumlah: ${quantity} unit
  Silakan diproses ya. Terima kasih`;
		const encodedMessage = encodeURIComponent(message);
		window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
	};
	const allImages = [product.image, ...normalizedGalleryImages].filter((img, index, self) => img && typeof img === "string" && img.trim() !== "" && self.indexOf(img) === index);
	const galleryImages = normalizedGalleryImages.filter((img, index, self) => img && typeof img === "string" && img.trim() !== "" && self.indexOf(img) === index);
	const thumbnailSlots = [allImages[0] || null, ...Array.from({ length: 4 }, (_, idx) => galleryImages[idx] || null)];
	const displayedImage = selectedImage || allImages[0] || "";
	const canonicalUrl = typeof window !== "undefined" ? window.location.href : initialCanonicalUrl;
	const jsonLd = {
		"@context": "https://schema.org/",
		"@type": "Product",
		"name": product.name,
		"image": allImages,
		"description": product.description,
		"brand": {
			"@type": "Brand",
			"name": "Niscahya"
		},
		"offers": {
			"@type": "Offer",
			"url": canonicalUrl,
			"priceCurrency": "IDR",
			"price": product.price || "0",
			"availability": "https://schema.org/InStock"
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8 md:space-y-16",
		children: [
			/* @__PURE__ */ jsx("script", {
				type: "application/ld+json",
				children: JSON.stringify(jsonLd)
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "flex flex-col lg:flex-row gap-8 md:gap-16",
				children: [/* @__PURE__ */ jsxs(motion.div, {
					initial: {
						x: -50,
						opacity: 0
					},
					animate: {
						x: 0,
						opacity: 1
					},
					className: "flex-1 space-y-4 md:space-y-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "relative aspect-square md:aspect-4/5 glass rounded-3xl md:rounded-[48px] overflow-hidden group shadow-2xl shadow-black/5",
						children: /* @__PURE__ */ jsx(AnimatePresence, {
							mode: "wait",
							children: /* @__PURE__ */ jsx(motion.img, {
								initial: {
									opacity: 0,
									scale: 1.1
								},
								animate: {
									opacity: 1,
									scale: 1
								},
								exit: {
									opacity: 0,
									scale: .95
								},
								transition: { duration: .4 },
								src: displayedImage,
								alt: `${product.name} - Lampu PJU Tenaga Surya Niscahya`,
								loading: "eager",
								fetchPriority: "high",
								decoding: "async",
								width: "1600",
								height: "1600",
								className: "w-full h-full object-cover"
							}, displayedImage)
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-5 gap-2 md:gap-3",
						children: thumbnailSlots.map((img, i) => /* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": img ? `Pilih gambar produk ${i + 1}` : `Slot gambar ${i + 1} kosong`,
							onClick: () => img && setSelectedImage(img),
							className: `aspect-square rounded-xl md:rounded-2xl overflow-hidden transition-all ${selectedImage === img ? "ring-2 md:ring-4 ring-primary" : "opacity-60 hover:opacity-100"} ${!img ? "bg-black/5" : ""}`,
							children: img && /* @__PURE__ */ jsx("img", {
								src: img,
								alt: `${product.name} Gallery ${i + 1}`,
								loading: "lazy",
								decoding: "async",
								width: "240",
								height: "240",
								className: "w-full h-full object-cover"
							})
						}, i))
					})]
				}), /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						x: 50,
						opacity: 0
					},
					animate: {
						x: 0,
						opacity: 1
					},
					className: "flex-1 flex flex-col justify-center space-y-8 md:space-y-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-4 md:space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 md:gap-4 text-[10px] md:text-xs font-black tracking-[0.3em] text-text-secondary uppercase",
								children: [
									/* @__PURE__ */ jsx(Link, {
										to: "/products",
										className: "hover:text-primary transition-colors",
										children: "Katalog"
									}),
									/* @__PURE__ */ jsx("i", { className: "bx bx-chevron-right text-base md:text-lg" }),
									/* @__PURE__ */ jsx("span", {
										className: "text-primary truncate max-w-37.5 md:max-w-none",
										children: product.name
									})
								]
							}),
							/* @__PURE__ */ jsx(motion.h1, {
								layoutId: `product-name-${product.id}`,
								className: "text-2xl md:text-5xl font-black tracking-tighter uppercase leading-tight md:leading-[1.1]",
								children: product.name
							}),
							/* @__PURE__ */ jsx("span", {
								className: "inline-flex px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 border border-primary/20 text-primary text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-lg md:rounded-xl",
								children: "Tersedia"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-6",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center glass border border-black/10 rounded-2xl overflow-hidden h-12 md:h-14",
									children: [
										/* @__PURE__ */ jsx("button", {
											type: "button",
											"aria-label": "Kurangi jumlah",
											onClick: () => setQuantity(Math.max(1, quantity - 1)),
											className: "px-4 hover:bg-black/5 transition-colors h-full",
											children: /* @__PURE__ */ jsx("i", { className: "bx bx-minus font-bold" })
										}),
										/* @__PURE__ */ jsx("span", {
											className: "w-10 md:w-12 text-center font-black text-lg md:text-xl",
											children: quantity
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											"aria-label": "Tambah jumlah",
											onClick: () => setQuantity(quantity + 1),
											className: "px-4 hover:bg-black/5 transition-colors h-full",
											children: /* @__PURE__ */ jsx("i", { className: "bx bx-plus font-bold" })
										})
									]
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex gap-4",
								children: /* @__PURE__ */ jsxs("button", {
									onClick: handleBuyNow,
									className: "flex-1 py-4 md:py-6 bg-primary text-background font-black text-base md:text-2xl rounded-2xl md:rounded-4xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-2 md:gap-4 group",
									children: [/* @__PURE__ */ jsx("i", { className: "bx bxl-whatsapp text-2xl md:text-4xl" }), /* @__PURE__ */ jsx("span", { children: "WhatsApp Admin" })]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-3 md:gap-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "glass p-4 md:p-6 rounded-2xl md:rounded-4xl flex items-center gap-3 md:gap-4 border-black/5 shadow-lg shadow-black/5",
									children: [/* @__PURE__ */ jsx("i", { className: "bx bx-shield-alt-2 text-2xl md:text-3xl text-primary" }), /* @__PURE__ */ jsx("span", {
										className: "text-[8px] md:text-xs font-black uppercase tracking-widest text-text-secondary leading-tight",
										children: "Bergaransi"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "glass p-4 md:p-6 rounded-2xl md:rounded-4xl flex items-center gap-3 md:gap-4 border-black/5 shadow-lg shadow-black/5",
									children: [/* @__PURE__ */ jsx("i", { className: "bx bx-trending-up text-2xl md:text-3xl text-secondary" }), /* @__PURE__ */ jsx("span", {
										className: "text-[8px] md:text-xs font-black uppercase tracking-widest text-text-secondary leading-tight",
										children: "Sertifikasi Eco"
									})]
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "space-y-8 md:space-y-12",
				children: /* @__PURE__ */ jsx("div", {
					className: "space-y-8 md:space-y-12",
					children: /* @__PURE__ */ jsx("div", {
						className: "glass p-6 md:p-10 rounded-3xl md:rounded-[48px] border-black/5 shadow-xl shadow-black/5 bg-linear-to-br from-white to-black/5",
						children: /* @__PURE__ */ jsx("p", {
							className: "text-sm md:text-lg text-text-secondary font-medium leading-relaxed whitespace-pre-line",
							children: renderDescription(product.description)
						})
					})
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "space-y-8 md:space-y-12",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-end justify-between",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl md:text-4xl font-black uppercase tracking-tighter",
						children: "Unit Terkait"
					}), /* @__PURE__ */ jsxs(Link, {
						to: "/products",
						className: "text-sm md:text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors flex items-center gap-2",
						children: ["Katalog ", /* @__PURE__ */ jsx("i", { className: "bx bx-right-arrow-alt text-xl md:text-2xl" })]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6",
					children: relatedProducts.slice(0, 4).map((p) => /* @__PURE__ */ jsxs(motion.div, {
						whileHover: { y: -10 },
						className: "group glass rounded-2xl md:rounded-4xl overflow-hidden hover:border-primary/30 transition-all border-black/5 shadow-xl shadow-black/5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "aspect-square relative overflow-hidden",
							children: [/* @__PURE__ */ jsx("img", {
								src: p.image,
								loading: "lazy",
								decoding: "async",
								width: "1200",
								height: "1500",
								className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
							}), /* @__PURE__ */ jsx(Link, {
								to: `/products/${p.id}`,
								className: "absolute inset-0 z-10"
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "p-4 md:p-6 space-y-1 md:space-y-2",
							children: /* @__PURE__ */ jsx("h4", {
								className: "text-[10px] md:text-sm font-black uppercase tracking-tight line-clamp-1",
								children: p.name
							})
						})]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pt-12 border-t border-black/5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "glass p-6 md:p-10 rounded-3xl md:rounded-[48px] space-y-6 md:space-y-8 flex flex-col justify-between border-black/5 shadow-xl shadow-black/5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-black tracking-[0.4em] text-primary uppercase",
								children: "Hubungi Kami"
							}), /* @__PURE__ */ jsxs("h3", {
								className: "text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight",
								children: [
									"Siap Melayani ",
									/* @__PURE__ */ jsx("br", {}),
									"Kebutuhan Anda."
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-4 md:gap-6",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl md:text-2xl",
										children: /* @__PURE__ */ jsx("i", { className: "bx bxs-phone-call" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col min-w-0",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-black text-text-secondary/60 uppercase tracking-[0.2em]",
											children: "Telepon / WA"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex flex-col gap-0.5",
											children: [/* @__PURE__ */ jsx("a", {
												href: "https://wa.me/6287853536124",
												target: "_blank",
												rel: "noopener noreferrer",
												className: "text-sm md:text-lg font-black tracking-tight hover:text-primary transition-colors",
												children: "+62 878 5353 6124"
											}), /* @__PURE__ */ jsx("a", {
												href: "https://wa.me/6282143707398",
												target: "_blank",
												rel: "noopener noreferrer",
												className: "text-sm md:text-lg font-black tracking-tight hover:text-primary transition-colors",
												children: "+62 821 4370 7398"
											})]
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-4 md:gap-6",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary text-xl md:text-2xl",
										children: /* @__PURE__ */ jsx("i", { className: "bx bxs-envelope" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col min-w-0 overflow-hidden",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-black text-text-secondary/60 uppercase tracking-[0.2em]",
											children: "Email"
										}), /* @__PURE__ */ jsx("a", {
											href: "https://mail.google.com/mail/?view=cm&fs=1&to=cvniscahyaindonesiacerdas@gmail.com",
											target: "_blank",
											rel: "noopener noreferrer",
											className: "text-xs md:text-base font-black tracking-tight break-all hover:text-secondary transition-colors",
											children: "cvniscahyaindonesiacerdas@gmail.com"
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-4 md:gap-6",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl md:text-2xl",
										children: /* @__PURE__ */ jsx("i", { className: "bx bxs-map" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-black text-text-secondary/60 uppercase tracking-[0.2em]",
											children: "Marketing Office"
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-sm md:text-lg font-black leading-tight tracking-tight",
											children: [
												"Wisma Juanda Permai Jl. Bouraq Blok B1 No. 15, Sedati Gede, ",
												/* @__PURE__ */ jsx("br", {}),
												"Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur"
											]
										})]
									})]
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: handleBuyNow,
						className: "w-full mt-6 py-4 md:py-5 bg-black/5 hover:bg-black/10 transition-colors rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3",
						children: ["Konsultasi Sekarang ", /* @__PURE__ */ jsx("i", { className: "bx bx-right-arrow-alt text-lg" })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "glass p-2 md:p-4 rounded-3xl md:rounded-[48px] border-black/5 shadow-xl shadow-black/5 relative overflow-hidden h-75 md:h-125 lg:h-auto",
					children: [/* @__PURE__ */ jsx("iframe", {
						title: "Peta lokasi showroom Niscahya Indonesia Cerdas",
						src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.047714009534!2d112.75474949999999!3d-7.373135199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e5e072a76abf%3A0xe5803d1aaf72795b!2sLampu%20PJU%20SinarSurya%20EnergiKu!5e1!3m2!1sid!2sid!4v1776048109065!5m2!1sid!2sid",
						width: "100%",
						height: "100%",
						style: { border: 0 },
						allowFullScreen: "",
						loading: "lazy",
						referrerPolicy: "no-referrer-when-downgrade",
						className: "rounded-2xl md:rounded-[36px] shadow-inner"
					}), /* @__PURE__ */ jsx("div", {
						className: "absolute top-4 right-4 md:top-8 md:right-8 pointer-events-none",
						children: /* @__PURE__ */ jsx("span", {
							className: "px-3 py-1.5 md:px-4 md:py-2 glass-bright rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-black/10 shadow-lg",
							children: "Showroom Kami"
						})
					})]
				})]
			})
		]
	});
};
var ProductDetail_default = UNSAFE_withComponentProps(ProductDetail);
//#endregion
//#region src/pages/Blog.jsx
var Blog_exports = /* @__PURE__ */ __exportAll({
	default: () => Blog_default,
	meta: () => meta$4
});
var meta$4 = () => {
	const title = "Wawasan & Edukasi Energi Terbarukan | Niscahya Indonesia Cerdas";
	const description = "Dapatkan informasi terbaru mengenai teknologi panel surya, panduan harga lampu jalan, dan tips perawatan energi terbarukan di Blog Niscahya Indonesia Cerdas.";
	return [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			name: "keywords",
			content: "blog energi terbarukan, tips lampu pju, teknologi solar panel terbaru, panduan hemat energi, niscahya indonesia cerdas"
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			property: "twitter:card",
			content: "summary_large_image"
		},
		{
			property: "twitter:title",
			content: title
		},
		{
			property: "twitter:description",
			content: description
		}
	];
};
var Blog = () => {
	const [activeCategory, setActiveCategory] = useState("Semua");
	const categories = ["Semua", ...new Set(blogPosts.map((post) => post.category))];
	const sortedPosts = [...blogPosts].sort((a, b) => b.id - a.id);
	const filteredPosts = activeCategory === "Semua" ? sortedPosts : sortedPosts.filter((post) => post.category === activeCategory);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8 md:space-y-12",
		children: [
			/* @__PURE__ */ jsx("section", {
				className: "relative pt-6 md:pt-10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-3xl space-y-4 md:space-y-6",
					children: [/* @__PURE__ */ jsx(motion.h1, {
						initial: {
							y: 20,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						transition: { delay: .1 },
						className: "text-3xl md:text-6xl font-black tracking-tighter uppercase leading-[1.1]",
						children: "Wawasan Energi Terbarukan."
					}), /* @__PURE__ */ jsx(motion.p, {
						initial: {
							y: 20,
							opacity: 0
						},
						animate: {
							y: 0,
							opacity: 1
						},
						transition: { delay: .2 },
						className: "text-lg md:text-xl text-text-secondary font-medium max-w-xl",
						children: "Jelajahi artikel terbaru kami tentang teknologi PJU tenaga surya, tips efisiensi, dan fakta unik dunia energi."
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "flex flex-wrap gap-2 md:gap-3",
				children: categories.map((cat, idx) => /* @__PURE__ */ jsx(motion.button, {
					type: "button",
					initial: {
						opacity: 0,
						scale: .9
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					transition: { delay: .3 + idx * .05 },
					onClick: () => setActiveCategory(cat),
					"aria-pressed": activeCategory === cat,
					className: `px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${activeCategory === cat ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-black/5 text-text-secondary hover:bg-black/10"}`,
					children: cat
				}, cat))
			}),
			/* @__PURE__ */ jsx("section", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-10",
				children: filteredPosts.map((post, idx) => /* @__PURE__ */ jsxs(motion.article, {
					initial: {
						opacity: 0,
						y: 30
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .4 + idx * .1 },
					className: "group glass rounded-[48px] overflow-hidden border-black/5 hover:border-primary/20 transition-all flex flex-col h-full",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: `/blog/${post.slug}`,
						className: "relative aspect-video overflow-hidden block",
						children: [/* @__PURE__ */ jsx("img", {
							src: post.image,
							alt: post.title,
							loading: "lazy",
							decoding: "async",
							width: "1200",
							height: "675",
							className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
						}), /* @__PURE__ */ jsx("div", {
							className: "absolute top-6 left-6",
							children: /* @__PURE__ */ jsx("span", {
								className: "px-4 py-2 bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest rounded-xl text-primary shadow-lg",
								children: post.category
							})
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-10 flex flex-col grow space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 text-[10px] font-black text-text-secondary uppercase tracking-widest",
								children: [
									/* @__PURE__ */ jsx("span", { children: post.date }),
									/* @__PURE__ */ jsx("div", { className: "w-1 h-1 bg-primary rounded-full" }),
									/* @__PURE__ */ jsxs("span", { children: ["Oleh ", post.author] })
								]
							}),
							/* @__PURE__ */ jsx(Link, {
								to: `/blog/${post.slug}`,
								children: /* @__PURE__ */ jsx("h2", {
									className: "text-2xl md:text-3xl font-black tracking-tighter uppercase leading-[1.1] group-hover:text-primary transition-colors line-clamp-2",
									children: post.title
								})
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-text-secondary font-medium line-clamp-3 leading-relaxed",
								children: post.excerpt
							}),
							/* @__PURE__ */ jsx("div", {
								className: "pt-6 mt-auto",
								children: /* @__PURE__ */ jsxs(Link, {
									to: `/blog/${post.slug}`,
									className: "inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20",
									children: ["Baca Selengkapnya", /* @__PURE__ */ jsx("i", { className: "bx bx-right-arrow-alt text-lg" })]
								})
							})
						]
					})]
				}, post.id))
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "bg-primary p-12 md:p-20 rounded-[64px] relative overflow-hidden text-center space-y-8",
				children: [/* @__PURE__ */ jsx("div", {
					className: "absolute top-0 right-0 p-10 opacity-20 rotate-12",
					children: /* @__PURE__ */ jsx("i", { className: "bx bx-news text-[200px] text-white" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "max-w-2xl mx-auto space-y-4 relative z-10",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight",
							children: "Ingin Tahu Lebih Banyak Tentang Energi Surya?"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-white/80 font-medium text-lg",
							children: "Hubungi tim ahli kami untuk konsultasi gratis mengenai kebutuhan sistem energi Anda."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "pt-4 flex flex-col sm:flex-row justify-center gap-4",
							children: [/* @__PURE__ */ jsx("a", {
								href: "https://wa.me/6287853536124",
								"aria-label": "Konsultasi via WhatsApp",
								className: "px-10 py-4 bg-white text-primary font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs",
								children: "Konsultasi via WhatsApp"
							}), /* @__PURE__ */ jsx(Link, {
								to: "/products",
								"aria-label": "Lihat katalog produk",
								className: "px-10 py-4 bg-primary-dark/20 border border-white/20 text-white font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs",
								children: "Lihat Katalog Produk"
							})]
						})
					]
				})]
			})
		]
	});
};
var Blog_default = UNSAFE_withComponentProps(Blog);
//#endregion
//#region src/pages/BlogDetail.jsx
var BlogDetail_exports = /* @__PURE__ */ __exportAll({
	default: () => BlogDetail_default,
	meta: () => meta$3
});
var meta$3 = ({ params }) => {
	const slug = params?.slug;
	const post = blogPosts.find((p) => p.slug === slug) || blogPosts.find((p) => p.id === Number(slug));
	if (!post) return [{ title: "Blog Tidak Ditemukan | Niscahya Indonesia Cerdas" }, {
		name: "robots",
		content: "noindex, follow"
	}];
	const title = `${post.title} | Blog Niscahya Indonesia Cerdas`;
	const description = post.excerpt;
	return [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			name: "keywords",
			content: `${post.title}, ${post.category}, edukasi pju tenaga surya, tips solar panel, niscahya blog`
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "article"
		},
		{
			property: "og:image",
			content: post.image || "/og-image.png"
		},
		{
			property: "twitter:card",
			content: "summary_large_image"
		},
		{
			property: "twitter:title",
			content: title
		},
		{
			property: "twitter:description",
			content: description
		},
		{
			property: "twitter:image",
			content: post.image || "/og-image.png"
		}
	];
};
var BlogDetail = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const post = blogPosts.find((p) => p.slug === slug) || blogPosts.find((p) => p.id === parseInt(slug));
	useEffect(() => {
		if (!post) navigate("/blog");
		else if (post.slug !== slug) navigate(`/blog/${post.slug}`, { replace: true });
	}, [
		post,
		navigate,
		slug
	]);
	if (!post) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-12 md:space-y-16",
		children: [
			/* @__PURE__ */ jsx(motion.div, {
				initial: {
					x: -20,
					opacity: 0
				},
				animate: {
					x: 0,
					opacity: 1
				},
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/blog",
					className: "inline-flex items-center gap-3 px-6 py-3 bg-black/5 hover:bg-black/10 text-text-secondary font-black text-[10px] uppercase tracking-widest rounded-xl transition-all",
					children: [/* @__PURE__ */ jsx("i", { className: "bx bx-left-arrow-alt text-xl" }), "Kembali ke Blog"]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "relative space-y-8 md:space-y-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "max-w-4xl space-y-6 md:space-y-8",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 md:gap-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: "px-4 py-2 md:px-5 md:py-2.5 bg-primary/10 border border-primary/20 text-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] rounded-xl md:rounded-2xl",
								children: post.category
							}), /* @__PURE__ */ jsx("span", {
								className: "text-text-secondary font-black text-[8px] md:text-[10px] uppercase tracking-widest",
								children: post.date
							})]
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-3xl md:text-7xl font-black tracking-tighter uppercase leading-tight md:leading-none text-text-main drop-shadow-sm",
							children: post.title
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white text-lg md:text-xl font-black",
								children: post.author[0]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary leading-none",
									children: "Ditulis Oleh"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-sm md:text-base font-black uppercase tracking-tight text-text-main",
									children: post.author
								})]
							})]
						})
					]
				}), /* @__PURE__ */ jsx(motion.div, {
					initial: {
						scale: .95,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					transition: { duration: .8 },
					className: "aspect-video md:aspect-21/9 rounded-3xl md:rounded-[64px] overflow-hidden shadow-2xl shadow-black/10 border-4 md:border-8 border-white/50",
					children: /* @__PURE__ */ jsx("img", {
						src: post.image,
						alt: post.title,
						loading: "eager",
						fetchPriority: "high",
						decoding: "async",
						width: "1600",
						height: "900",
						className: "w-full h-full object-cover"
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16",
				children: [/* @__PURE__ */ jsx("div", {
					className: "lg:col-span-8 space-y-8 md:space-y-12",
					children: /* @__PURE__ */ jsx("div", {
						className: "glass p-6 md:p-16 rounded-3xl md:rounded-[64px] border-black/5 space-y-6 md:space-y-8",
						children: /* @__PURE__ */ jsx("div", {
							className: "prose prose-lg md:prose-xl prose-primary max-w-none text-text-secondary font-medium leading-relaxed",
							children: post.content.split("\n").map((para, i) => para.trim() && /* @__PURE__ */ jsx("p", {
								className: "mb-6 whitespace-pre-line",
								children: para.trim()
							}, i))
						})
					})
				}), /* @__PURE__ */ jsx("aside", {
					className: "lg:col-span-4 space-y-8 md:space-y-10",
					children: /* @__PURE__ */ jsxs("div", {
						className: "glass p-6 md:p-10 rounded-3xl md:rounded-[48px] border-black/5 space-y-6 md:space-y-8 sticky top-32",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-lg md:text-xl font-black uppercase tracking-tighter",
							children: "Artikel Terkait"
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-6 md:space-y-8",
							children: blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3).map((related) => /* @__PURE__ */ jsxs(Link, {
								to: `/blog/${related.slug}`,
								className: "group flex gap-4",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-black/5",
									children: /* @__PURE__ */ jsx("img", {
										src: related.image,
										alt: related.title,
										loading: "lazy",
										decoding: "async",
										width: "240",
										height: "240",
										className: "w-full h-full object-cover transition-transform group-hover:scale-110"
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5 md:space-y-2",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary leading-none",
										children: related.category
									}), /* @__PURE__ */ jsx("h4", {
										className: "text-xs md:text-sm font-black uppercase tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2",
										children: related.title
									})]
								})]
							}, related.id))
						})]
					})
				})]
			})
		]
	});
};
var BlogDetail_default = UNSAFE_withComponentProps(BlogDetail);
//#endregion
//#region src/pages/About.jsx
var About_exports = /* @__PURE__ */ __exportAll({
	default: () => About_default,
	meta: () => meta$2
});
var meta$2 = () => {
	return [
		{ title: "Cerita Kami | Niscahya Indonesia Cerdas" },
		{
			name: "description",
			content: "Mengenal CV Niscahya Indonesia Cerdas, penggerak utama transformasi energi terbarukan di Indonesia melalui penyediaan infrastruktur PJU tenaga surya yang inovatif."
		},
		{
			name: "keywords",
			content: "profil niscahya indonesia cerdas, visi misi niscahya, distributor pju tenaga surya, energi terbarukan indonesia"
		}
	];
};
var PageHero$2 = ({ title, subtitle, icon }) => /* @__PURE__ */ jsxs("section", {
	className: "relative pt-6 md:pt-10 pb-4 md:pb-6",
	children: [/* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			scale: .8
		},
		animate: {
			opacity: .05,
			scale: 1
		},
		className: "absolute top-0 right-0 p-10 md:p-20 -z-10",
		children: /* @__PURE__ */ jsx("i", { className: `bx ${icon} text-[150px] md:text-[300px]` })
	}), /* @__PURE__ */ jsxs("div", {
		className: "max-w-3xl space-y-4 md:space-y-6",
		children: [/* @__PURE__ */ jsxs(motion.h1, {
			initial: {
				y: 20,
				opacity: 0
			},
			animate: {
				y: 0,
				opacity: 1
			},
			transition: { delay: .1 },
			className: "text-3xl md:text-6xl font-black tracking-tighter uppercase leading-[1.1]",
			children: [
				title.split(" ").slice(0, -1).join(" "),
				" ",
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("span", {
					className: "text-gradient",
					children: title.split(" ").slice(-1)
				})
			]
		}), subtitle && /* @__PURE__ */ jsx(motion.p, {
			initial: {
				y: 20,
				opacity: 0
			},
			animate: {
				y: 0,
				opacity: 1
			},
			transition: { delay: .2 },
			className: "text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-xl",
			children: subtitle
		})]
	})]
});
var About_default = UNSAFE_withComponentProps(function AboutPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-10 md:space-y-16",
		children: [
			/* @__PURE__ */ jsx(PageHero$2, { title: "Cerita Kami" }),
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-6 md:space-y-8",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-lg md:text-xl text-text-secondary font-medium leading-relaxed",
						children: "CV Niscahya Indonesia Cerdas hadir sebagai jawaban atas tantangan energi masa depan. Kami bukan sekadar distributor, melainkan partner strategis dalam menghadirkan teknologi penerangan yang efisien untuk setiap sudut Indonesia."
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-4 md:space-y-6 pt-2 md:pt-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex gap-4 md:gap-6",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 md:w-12 md:h-12 shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl md:text-2xl",
								children: /* @__PURE__ */ jsx("i", { className: "bx bx-check-double" })
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("h4", {
									className: "text-base md:text-lg font-black uppercase tracking-tight",
									children: "Kualitas Premium"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs md:text-sm text-text-secondary font-medium",
									children: "Hanya menyediakan komponen dengan standar industri tertinggi."
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-4 md:gap-6",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 md:w-12 md:h-12 shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl md:text-2xl",
								children: /* @__PURE__ */ jsx("i", { className: "bx bx-leaf" })
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("h4", {
									className: "text-base md:text-lg font-black uppercase tracking-tight",
									children: "Ramah Lingkungan"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs md:text-sm text-text-secondary font-medium",
									children: "Mendukung penuh target Net Zero Emission Indonesia."
								})]
							})]
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx("div", { className: "absolute -inset-4 bg-primary/20 rounded-[64px] blur-3xl -z-10 animate-pulse" }), /* @__PURE__ */ jsxs("div", {
						className: "glass p-8 md:p-12 rounded-3xl md:rounded-[64px] border-black/5 shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-4 md:space-y-6",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-xl md:text-2xl font-black uppercase tracking-tighter border-b border-black/5 pb-2 md:pb-4",
								children: "Visi Kami"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-base md:text-lg font-bold text-text-main italic leading-relaxed",
								children: "\"Menjadi penggerak utama transformasi energi terbarukan di Indonesia melalui penyediaan infrastruktur PJU Tenaga Surya yang inovatif, andal, dan dapat diakses oleh seluruh lapisan masyarakat.\""
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4 md:space-y-6",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-xl md:text-2xl font-black uppercase tracking-tighter border-b border-black/5 pb-2 md:pb-4",
								children: "Misi Kami"
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-3 md:space-y-4",
								children: [
									"Memberikan solusi energi yang disesuaikan dengan kebutuhan geografis Indonesia.",
									"Menjamin ketersediaan stok dan layanan purna jual yang profesional.",
									"Mendukung program pemerintah dalam percepatan kemandirian energi desa."
								].map((misi, i) => /* @__PURE__ */ jsxs("li", {
									className: "flex gap-3 md:gap-4 text-xs md:text-sm font-medium text-text-secondary",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-primary font-black",
										children: [
											"0",
											i + 1,
											"."
										]
									}), misi]
								}, i))
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "space-y-8 md:space-y-16",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center space-y-2 md:space-y-4",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[8px] md:text-[10px] font-black tracking-[0.4em] text-primary uppercase",
						children: "Nilai Kami"
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-3xl md:text-5xl font-black uppercase tracking-tighter",
						children: "Prinsip Kerja."
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8",
					children: [
						{
							title: "Integritas",
							desc: "Kejujuran dalam spesifikasi produk dan transparansi harga adalah kunci kepercayaan mitra kami.",
							icon: "bx-shield-quarter"
						},
						{
							title: "Inovasi",
							desc: "Terus mengadopsi teknologi panel surya dan baterai lithium terbaru untuk efisiensi maksimal.",
							icon: "bx-bolt-circle"
						},
						{
							title: "Responsif",
							desc: "Tim teknis dan admin kami siap memberikan solusi cepat untuk setiap kendala di lapangan.",
							icon: "bx-support"
						}
					].map((value, i) => /* @__PURE__ */ jsxs(motion.div, {
						whileHover: { y: -10 },
						className: "glass p-8 md:p-10 rounded-3xl md:rounded-[48px] border-black/5 shadow-xl text-center space-y-4 md:space-y-6",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-16 h-16 md:w-20 md:h-20 mx-auto bg-primary/10 text-primary rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl shadow-inner",
								children: /* @__PURE__ */ jsx("i", { className: `bx ${value.icon}` })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-xl md:text-2xl font-black uppercase tracking-tighter",
								children: value.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs md:text-sm text-text-secondary font-medium leading-relaxed",
								children: value.desc
							})
						]
					}, i))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "bg-accent p-8 md:p-20 rounded-3xl md:rounded-[64px] relative overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "absolute top-0 left-0 p-10 opacity-10 -rotate-12",
					children: /* @__PURE__ */ jsx("i", { className: "bx bx-certification text-[150px] md:text-[250px] text-white" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-4 md:space-y-6",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none",
							children: [
								"Mitra Energi ",
								/* @__PURE__ */ jsx("br", {}),
								"Terpercaya."
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-white/80 font-medium text-base md:text-lg leading-relaxed",
							children: "Dengan pengalaman bertahun-tahun dalam menangani berbagai skala proyek, CV Niscahya Indonesia Cerdas telah membuktikan dedikasinya dalam menjaga kualitas setiap unit yang terpasang."
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4 md:gap-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "glass-bright p-6 md:p-8 rounded-2xl md:rounded-4xl text-center space-y-2 border-white/20 shadow-2xl",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-2xl md:text-4xl font-black text-accent tracking-tighter",
								children: "100%"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary",
								children: "Original Produk"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "glass-bright p-6 md:p-8 rounded-2xl md:rounded-4xl text-center space-y-2 border-white/20 shadow-2xl",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-2xl md:text-4xl font-black text-accent tracking-tighter",
								children: "Garansi"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary",
								children: "Layanan"
							})]
						})]
					})]
				})]
			})
		]
	});
});
//#endregion
//#region src/pages/Projects.jsx
var Projects_exports = /* @__PURE__ */ __exportAll({
	default: () => Projects_default,
	meta: () => meta$1
});
var meta$1 = () => {
	return [
		{ title: "Galeri Projek PJU Tenaga Surya | Niscahya Indonesia Cerdas" },
		{
			name: "description",
			content: "Lihat dokumentasi implementasi nyata sistem energi surya Niscahya di berbagai wilayah Indonesia. Bukti kualitas dan kepercayaan mitra kami."
		},
		{
			name: "keywords",
			content: "proyek pju tenaga surya, galeri pju solar panel, portofolio niscahya, instalasi lampu jalan tenaga surya"
		}
	];
};
var PageHero$1 = ({ title, subtitle, icon }) => /* @__PURE__ */ jsxs("section", {
	className: "relative pt-6 md:pt-10 pb-4 md:pb-6",
	children: [/* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			scale: .8
		},
		animate: {
			opacity: .05,
			scale: 1
		},
		className: "absolute top-0 right-0 p-10 md:p-20 -z-10",
		children: /* @__PURE__ */ jsx("i", { className: `bx ${icon} text-[150px] md:text-[300px]` })
	}), /* @__PURE__ */ jsxs("div", {
		className: "max-w-3xl space-y-4 md:space-y-6",
		children: [/* @__PURE__ */ jsxs(motion.h1, {
			initial: {
				y: 20,
				opacity: 0
			},
			animate: {
				y: 0,
				opacity: 1
			},
			transition: { delay: .1 },
			className: "text-3xl md:text-6xl font-black tracking-tighter uppercase leading-[1.1]",
			children: [
				title.split(" ").slice(0, -1).join(" "),
				" ",
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("span", {
					className: "text-gradient",
					children: title.split(" ").slice(-1)
				})
			]
		}), subtitle && /* @__PURE__ */ jsx(motion.p, {
			initial: {
				y: 20,
				opacity: 0
			},
			animate: {
				y: 0,
				opacity: 1
			},
			transition: { delay: .2 },
			className: "text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-xl",
			children: subtitle
		})]
	})]
});
var Projects_default = UNSAFE_withComponentProps(function ProjectsPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-12 md:space-y-16",
		children: [/* @__PURE__ */ jsx(PageHero$1, {
			title: "Galeri Projek",
			subtitle: "Dokumentasi implementasi nyata sistem energi surya Niscahya di berbagai wilayah Indonesia."
		}), /* @__PURE__ */ jsx("section", {
			className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
			children: [
				{ img: "/galeri/galeri1.webp" },
				{ img: "/galeri/galeri2.webp" },
				{ img: "/galeri/galeri3.webp" },
				{ img: "/galeri/galeri4.webp" },
				{ img: "/galeri/galeri5.webp" },
				{ img: "/galeri/galeri6.webp" },
				{ img: "/galeri/galeri7.webp" },
				{ img: "/galeri/galeri8.webp" },
				{ img: "/galeri/galeri9.webp" },
				{ img: "/galeri/galeri10.webp" },
				{ img: "/galeri/galeri11.webp" },
				{ img: "/galeri/galeri12.webp" }
			].map((proj, i) => /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					scale: .9
				},
				whileInView: {
					opacity: 1,
					scale: 1
				},
				transition: { delay: i * .05 },
				className: "group relative aspect-9/16 glass rounded-3xl md:rounded-[40px] overflow-hidden border-black/5",
				children: /* @__PURE__ */ jsx("img", {
					src: proj.img,
					alt: `Project ${i + 1}`,
					loading: "lazy",
					decoding: "async",
					width: "900",
					height: "1600",
					className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
				})
			}, i))
		})]
	});
});
//#endregion
//#region src/pages/Contact.jsx
var Contact_exports = /* @__PURE__ */ __exportAll({
	default: () => Contact_default,
	meta: () => meta
});
var meta = () => {
	return [
		{ title: "Hubungi Kami | Niscahya Indonesia Cerdas" },
		{
			name: "description",
			content: "Hubungi CV Niscahya Indonesia Cerdas untuk konsultasi PJU tenaga surya, penawaran proyek, dan kerjasama resmi. Marketing office Sidoarjo, Jawa Timur."
		},
		{
			name: "keywords",
			content: "kontak niscahya, pju surabaya, pju sidoarjo, konsultasi pju tenaga surya, alamat niscahya indonesia cerdas"
		}
	];
};
var PageHero = ({ title, subtitle, icon }) => /* @__PURE__ */ jsxs("section", {
	className: "relative pt-6 md:pt-10 pb-4 md:pb-6",
	children: [/* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			scale: .8
		},
		animate: {
			opacity: .05,
			scale: 1
		},
		className: "absolute top-0 right-0 p-10 md:p-20 -z-10",
		children: /* @__PURE__ */ jsx("i", { className: `bx ${icon} text-[150px] md:text-[300px]` })
	}), /* @__PURE__ */ jsxs("div", {
		className: "max-w-3xl space-y-4 md:space-y-6",
		children: [/* @__PURE__ */ jsxs(motion.h1, {
			initial: {
				y: 20,
				opacity: 0
			},
			animate: {
				y: 0,
				opacity: 1
			},
			transition: { delay: .1 },
			className: "text-3xl md:text-6xl font-black tracking-tighter uppercase leading-[1.1]",
			children: [
				title.split(" ").slice(0, -1).join(" "),
				" ",
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("span", {
					className: "text-gradient",
					children: title.split(" ").slice(-1)
				})
			]
		}), subtitle && /* @__PURE__ */ jsx(motion.p, {
			initial: {
				y: 20,
				opacity: 0
			},
			animate: {
				y: 0,
				opacity: 1
			},
			transition: { delay: .2 },
			className: "text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-xl",
			children: subtitle
		})]
	})]
});
var Contact_default = UNSAFE_withComponentProps(function ContactPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-12 md:space-y-16",
		children: [
			/* @__PURE__ */ jsx(PageHero, {
				title: "Hubungi Kami",
				subtitle: "Kami siap membantu mewujudkan solusi energi terbaik untuk Anda. Hubungi kami melalui berbagai saluran komunikasi."
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8",
				children: [
					/* @__PURE__ */ jsxs(motion.div, {
						whileHover: { y: -10 },
						className: "glass p-8 md:p-10 rounded-3xl md:rounded-[48px] space-y-4 md:space-y-6 border-black/5 shadow-xl shadow-black/5 flex flex-col",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-12 h-12 md:w-16 md:h-16 bg-green-500/10 text-green-500 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg",
								children: /* @__PURE__ */ jsx("i", { className: "bx bxl-whatsapp" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1 md:space-y-2",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-xl md:text-2xl font-black uppercase tracking-tighter",
									children: "WhatsApp"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs md:text-sm text-text-secondary font-medium",
									children: "Respon cepat untuk konsultasi produk & teknis."
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2 md:space-y-3 mt-auto",
								children: [/* @__PURE__ */ jsx("a", {
									href: "https://wa.me/6287853536124",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "block text-base md:text-lg font-black tracking-tight text-text-main hover:text-green-500 transition-colors",
									children: "+62 878 5353 6124"
								}), /* @__PURE__ */ jsx("a", {
									href: "https://wa.me/6282143707398",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "block text-base md:text-lg font-black tracking-tight text-text-main hover:text-green-500 transition-colors",
									children: "+62 821 4370 7398"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs(motion.a, {
						href: "https://mail.google.com/mail/?view=cm&fs=1&to=cvniscahyaindonesiacerdas@gmail.com",
						target: "_blank",
						rel: "noopener noreferrer",
						whileHover: { y: -10 },
						className: "glass p-8 md:p-10 rounded-3xl md:rounded-[48px] space-y-4 md:space-y-6 border-black/5 shadow-xl shadow-black/5 block",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-12 h-12 md:w-16 md:h-16 bg-blue-500/10 text-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg",
								children: /* @__PURE__ */ jsx("i", { className: "bx bx-envelope" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1 md:space-y-2",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-xl md:text-2xl font-black uppercase tracking-tighter",
									children: "Email"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs md:text-sm text-text-secondary font-medium",
									children: "Untuk penawaran proyek dan kerjasama resmi."
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm md:text-lg font-black tracking-tight text-text-main break-all",
								children: "cvniscahyaindonesiacerdas@gmail.com"
							})
						]
					}),
					/* @__PURE__ */ jsxs(motion.a, {
						href: "https://instagram.com/niscahya.id",
						target: "_blank",
						rel: "noopener noreferrer",
						whileHover: { y: -10 },
						className: "glass p-8 md:p-10 rounded-3xl md:rounded-[48px] space-y-4 md:space-y-6 border-black/5 shadow-xl shadow-black/5 block",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-12 h-12 md:w-16 md:h-16 bg-pink-500/10 text-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg",
								children: /* @__PURE__ */ jsx("i", { className: "bx bxl-instagram" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1 md:space-y-2",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-xl md:text-2xl font-black uppercase tracking-tighter",
									children: "Instagram"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs md:text-sm text-text-secondary font-medium",
									children: "Update proyek terbaru dan edukasi."
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-base md:text-lg font-black tracking-tight text-text-main break-all",
								children: "@niscahya.id"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "flex justify-center",
				children: /* @__PURE__ */ jsx("div", {
					className: "w-full max-w-4xl",
					children: /* @__PURE__ */ jsx("div", {
						className: "space-y-8 md:space-y-12 text-center flex flex-col items-center",
						children: /* @__PURE__ */ jsxs("div", {
							className: "space-y-6 md:space-y-8 w-full",
							children: [/* @__PURE__ */ jsxs("h2", {
								className: "text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]",
								children: [
									"Marketing ",
									/* @__PURE__ */ jsx("br", {}),
									/* @__PURE__ */ jsx("span", {
										className: "text-gradient",
										children: "Office."
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "glass p-6 md:p-10 rounded-3xl md:rounded-[48px] border-black/5 shadow-xl shadow-black/5 flex flex-col md:flex-row gap-8 md:gap-4 justify-around items-stretch",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-4 md:gap-6 text-left max-w-sm flex-1",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 md:w-12 md:h-12 shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl md:text-2xl",
											children: /* @__PURE__ */ jsx("i", { className: "bx bxs-map" })
										}), /* @__PURE__ */ jsxs("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[8px] md:text-xs font-black uppercase tracking-[0.2em] text-text-secondary",
												children: "Alamat"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-base md:text-xl font-black leading-tight tracking-tight",
												children: "Wisma Juanda Permai Jl. Bouraq Blok B1 No. 15, Sedati Gede, Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur"
											})]
										})]
									}),
									/* @__PURE__ */ jsx("div", { className: "w-full md:w-px h-px md:h-auto bg-black/5 self-stretch" }),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-4 md:gap-6 text-left max-w-xs flex-1",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 md:w-12 md:h-12 shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl md:text-2xl",
											children: /* @__PURE__ */ jsx("i", { className: "bx bxs-time" })
										}), /* @__PURE__ */ jsxs("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[8px] md:text-xs font-black uppercase tracking-[0.2em] text-text-secondary",
												children: "Jam Operasional"
											}), /* @__PURE__ */ jsxs("p", {
												className: "text-base md:text-xl font-black leading-tight tracking-tight",
												children: [
													"Senin - Jumat: 09:00 - 17:00 ",
													/* @__PURE__ */ jsx("br", {}),
													"Sabtu: 09:00 - 12:00"
												]
											})]
										})]
									})
								]
							})]
						})
					})
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "space-y-6 md:space-y-10",
				children: /* @__PURE__ */ jsx("div", {
					className: "glass p-2 md:p-4 rounded-3xl md:rounded-[64px] border-black/5 shadow-xl shadow-black/5 relative overflow-hidden h-75 md:h-125",
					children: /* @__PURE__ */ jsx("iframe", {
						title: "Peta lokasi marketing office Niscahya Indonesia Cerdas",
						src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.047714009534!2d112.75474949999999!3d-7.373135199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e5e072a76abf%3A0xe5803d1aaf72795b!2sLampu%20PJU%20SinarSurya%20EnergiKu!5e1!3m2!1sid!2sid!4v1776048109065!5m2!1sid!2sid",
						width: "100%",
						height: "100%",
						style: { border: 0 },
						allowFullScreen: "",
						loading: "lazy",
						referrerPolicy: "no-referrer-when-downgrade",
						className: "rounded-2xl md:rounded-[48px] shadow-inner"
					})
				})
			})
		]
	});
});
//#endregion
//#region src/pages/Admin.jsx
var Admin_exports = /* @__PURE__ */ __exportAll({ default: () => Admin_default });
var Admin = () => {
	const { searchQuery } = useApp();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [products, setProducts] = useState([]);
	const [editingProduct, setEditingProduct] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		category: "",
		image: "",
		images: [
			"",
			"",
			"",
			""
		],
		description: ""
	});
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState({
		primary: false,
		gallery0: false,
		gallery1: false,
		gallery2: false,
		gallery3: false
	});
	const [error, setError] = useState("");
	const [selectedMainCategory, setSelectedMainCategory] = useState("");
	const categoryStructure = {
		"PJU Tenaga Surya": [
			"All In One",
			"Two In One",
			"Konvensional"
		],
		"PJU PLN": [],
		"Pompa Air Tenaga Surya": [],
		"Traffic Light": [],
		"Warning Light": [],
		"Lampu Taman": [],
		"Solar Home System": [],
		"Aksesori": [
			"Solar Panel",
			"Controller",
			"Inverter",
			"Baterai"
		]
	};
	const mainCategories = Object.keys(categoryStructure);
	useEffect(() => {
		if (isLoggedIn) fetchProducts();
	}, [isLoggedIn]);
	const handleFileUpload = async (e, type, index = null) => {
		const file = e.target.files[0];
		if (!file) return;
		const localPreview = URL.createObjectURL(file);
		if (type === "primary") {
			setFormData((prev) => ({
				...prev,
				image: localPreview
			}));
			setUploading((prev) => ({
				...prev,
				primary: true
			}));
		} else {
			setFormData((prev) => {
				const updatedImages = [...prev.images];
				updatedImages[index] = localPreview;
				return {
					...prev,
					images: updatedImages
				};
			});
			setUploading((prev) => ({
				...prev,
				[`gallery${index}`]: true
			}));
		}
		setError("");
		const formDataUpload = new FormData();
		formDataUpload.append("image", file);
		try {
			const res = await fetch("/api/upload", {
				method: "POST",
				body: formDataUpload
			});
			const data = await res.json();
			if (res.ok && data.imageUrl) if (type === "primary") setFormData((prev) => ({
				...prev,
				image: data.imageUrl
			}));
			else setFormData((prev) => {
				const updatedImages = [...prev.images];
				updatedImages[index] = data.imageUrl;
				return {
					...prev,
					images: updatedImages
				};
			});
			else setError(data.error || "Gagal mengunggah gambar ke server");
		} catch (err) {
			setError("Error koneksi: Pastikan server sedang berjalan");
		} finally {
			if (type === "primary") setUploading((prev) => ({
				...prev,
				primary: false
			}));
			else setUploading((prev) => ({
				...prev,
				[`gallery${index}`]: false
			}));
		}
	};
	const fetchProducts = async () => {
		setLoading(true);
		try {
			setProducts(await (await fetch("/api/products")).json());
		} catch (err) {
			setError("Gagal memuat produk");
		} finally {
			setLoading(false);
		}
	};
	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const data = await (await fetch("/api/admin-auth", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password
				})
			})).json();
			if (data.success) setIsLoggedIn(true);
			else setError(data.message);
		} catch (err) {
			setError("Gagal login. Pastikan server berjalan.");
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (Object.values(uploading).some(Boolean)) {
			setError("Upload gambar masih berjalan. Tunggu sampai selesai, lalu simpan lagi.");
			return;
		}
		if (formData.image.startsWith("blob:") || formData.images.some((img) => img && img.startsWith("blob:"))) {
			setError("Harap tunggu sampai semua proses upload selesai sebelum menyimpan.");
			return;
		}
		const payload = {
			...formData,
			price: 0,
			images: formData.images.filter((img) => typeof img === "string" && img.trim() !== "" && !img.startsWith("blob:"))
		};
		if (!payload.image) {
			setError("Gambar utama wajib diunggah.");
			return;
		}
		const method = editingProduct ? "PUT" : "POST";
		const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
		try {
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});
			if (res.ok) {
				fetchProducts();
				setEditingProduct(null);
				setSelectedMainCategory("");
				setFormData({
					name: "",
					category: "",
					image: "",
					images: [
						"",
						"",
						"",
						""
					],
					description: ""
				});
			} else {
				const data = await res.json().catch(() => ({}));
				setError(data.error || data.message || "Gagal menyimpan produk");
			}
		} catch (err) {
			setError("Gagal menyimpan produk");
		}
	};
	const handleEdit = (product) => {
		setEditingProduct(product);
		const gallery = [...product.images || []];
		while (gallery.length < 4) gallery.push("");
		setSelectedMainCategory(product.category.includes(" - ") ? product.category.split(" - ")[0] : product.category);
		setFormData({
			name: product.name,
			category: product.category,
			image: product.image,
			images: gallery.slice(0, 4),
			description: product.description
		});
	};
	const handleDelete = async (id) => {
		if (window.confirm("Hapus produk ini?")) try {
			const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				setError(data.error || data.message || "Gagal menghapus produk");
				return;
			}
			fetchProducts();
		} catch (err) {
			setError("Gagal menghapus produk");
		}
	};
	const descriptionRef = useRef(null);
	const applyBold = () => {
		const textarea = descriptionRef.current;
		if (!textarea) return;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = formData.description.substring(start, end);
		if (!selectedText) {
			alert("Pilih teks terlebih dahulu untuk di-bold");
			return;
		}
		const newText = formData.description.substring(0, start) + `**${selectedText}**` + formData.description.substring(end);
		setFormData({
			...formData,
			description: newText
		});
		setTimeout(() => {
			textarea.focus();
			textarea.setSelectionRange(start + 2, end + 2);
		}, 0);
	};
	const handleKeyDown = (e) => {
		if (e.ctrlKey && e.key === "b") {
			e.preventDefault();
			applyBold();
		}
	};
	const filteredProducts = useMemo(() => {
		const normalizedSearch = searchQuery.trim().toLowerCase();
		if (!normalizedSearch) return products;
		return products.filter((product) => {
			return [
				product.name,
				product.category,
				product.description
			].filter(Boolean).some((field) => String(field).toLowerCase().includes(normalizedSearch));
		});
	}, [products, searchQuery]);
	if (!isLoggedIn) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center pt-20",
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			className: "glass p-8 rounded-[32px] w-full max-w-md border-black/5",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "text-3xl font-black mb-6",
					children: "Login Admin"
				}),
				error && /* @__PURE__ */ jsx("p", {
					className: "text-red-500 mb-4 font-medium",
					children: error
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleLogin,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block",
							children: "Email Admin"
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							className: "w-full p-4 rounded-2xl bg-black/5 border border-black/5 focus:border-secondary outline-none transition-all",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true,
							autoComplete: "email"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block",
							children: "Kata Sandi"
						}), /* @__PURE__ */ jsx("input", {
							type: "password",
							placeholder: "••••••••",
							className: "w-full p-4 rounded-2xl bg-black/5 border border-black/5 focus:border-secondary outline-none transition-all",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true,
							autoComplete: "current-password"
						})] }),
						/* @__PURE__ */ jsx("button", {
							className: "w-full py-4 bg-secondary text-white rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all",
							children: "Login"
						})
					]
				})
			]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "pt-20 pb-40 space-y-12",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "flex justify-between items-end",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-5xl font-black tracking-tighter uppercase",
				children: "Panel Admin"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-text-secondary font-medium",
				children: "Kelola katalog produk Anda"
			})] }), /* @__PURE__ */ jsx("button", {
				onClick: () => setIsLoggedIn(false),
				className: "px-6 py-2 bg-black/5 rounded-xl font-bold hover:bg-black/10 transition-colors",
				children: "Keluar"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid lg:grid-cols-3 gap-12",
			children: [/* @__PURE__ */ jsx("div", {
				className: "lg:col-span-1",
				children: /* @__PURE__ */ jsxs(motion.div, {
					layout: true,
					className: "glass p-8 rounded-[32px] border-black/5 sticky top-32",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-black mb-6",
							children: editingProduct ? "Edit Produk" : "Tambah Produk Baru"
						}),
						error && /* @__PURE__ */ jsx("p", {
							className: "mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm font-bold text-red-600",
							children: error
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleSubmit,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block",
									children: "Nama Produk"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									required: true,
									className: "w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none",
									value: formData.name,
									onChange: (e) => setFormData({
										...formData,
										name: e.target.value
									})
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block",
									children: "Kategori Utama"
								}), /* @__PURE__ */ jsxs("select", {
									className: "w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none appearance-none",
									value: selectedMainCategory,
									onChange: (e) => {
										setSelectedMainCategory(e.target.value);
										setFormData({
											...formData,
											category: e.target.value
										});
									},
									required: true,
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "Pilih Kategori Utama"
									}), mainCategories.map((c) => /* @__PURE__ */ jsx("option", {
										value: c,
										children: c
									}, c))]
								})] }),
								selectedMainCategory && categoryStructure[selectedMainCategory]?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block",
									children: "Sub-Kategori"
								}), /* @__PURE__ */ jsxs("select", {
									className: "w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none appearance-none",
									value: formData.category.includes(" - ") ? formData.category.split(" - ")[1] : "",
									onChange: (e) => {
										const fullCategory = `${selectedMainCategory} - ${e.target.value}`;
										setFormData({
											...formData,
											category: fullCategory
										});
									},
									required: true,
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "Pilih Sub-Kategori"
									}), categoryStructure[selectedMainCategory].map((sub) => /* @__PURE__ */ jsx("option", {
										value: sub,
										children: sub
									}, sub))]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block",
									children: "Gambar Utama"
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ jsx("input", {
											type: "file",
											accept: "image/*",
											className: "w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 cursor-pointer",
											onChange: (e) => handleFileUpload(e, "primary")
										}),
										uploading.primary && /* @__PURE__ */ jsx("p", {
											className: "text-xs font-bold text-secondary animate-pulse ml-1",
											children: "Mengunggah Utama..."
										}),
										formData.image && /* @__PURE__ */ jsx("div", {
											className: "relative group aspect-video rounded-xl overflow-hidden bg-black/5 border border-black/5",
											children: /* @__PURE__ */ jsx("img", {
												src: formData.image,
												alt: "Preview",
												className: "w-full h-full object-cover"
											})
										})
									]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block",
									children: "Gambar Galeri (4 Slot Terpisah)"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-2 gap-4",
									children: [
										0,
										1,
										2,
										3
									].map((idx) => /* @__PURE__ */ jsxs("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "relative aspect-video rounded-xl overflow-hidden bg-black/5 border border-black/5",
											children: [formData.images[idx] ? /* @__PURE__ */ jsx("img", {
												src: formData.images[idx],
												alt: `Gallery ${idx}`,
												className: "w-full h-full object-cover"
											}) : /* @__PURE__ */ jsxs("div", {
												className: "w-full h-full flex items-center justify-center text-[10px] font-black uppercase text-text-secondary/30",
												children: ["Slot ", idx + 1]
											}), uploading[`gallery${idx}`] && /* @__PURE__ */ jsx("div", {
												className: "absolute inset-0 bg-black/20 flex items-center justify-center",
												children: /* @__PURE__ */ jsx("i", { className: "bx bx-loader-alt animate-spin text-white text-xl" })
											})]
										}), /* @__PURE__ */ jsx("input", {
											type: "file",
											accept: "image/*",
											className: "w-full text-[10px] file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-black/5 file:text-text-secondary hover:file:bg-black/10 cursor-pointer",
											onChange: (e) => handleFileUpload(e, "gallery", idx)
										})]
									}, idx))
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between ml-1 mb-1",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-black uppercase tracking-widest text-text-secondary",
										children: "Deskripsi"
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[9px] text-text-secondary/50",
											children: "Ctrl+B bold"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: applyBold,
											className: "w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors",
											title: "Bold (Ctrl+B)",
											children: /* @__PURE__ */ jsx("i", { className: "bx bx-bold text-xs" })
										})]
									})]
								}), /* @__PURE__ */ jsx("textarea", {
									ref: descriptionRef,
									rows: "3",
									onKeyDown: handleKeyDown,
									className: "w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none",
									value: formData.description,
									onChange: (e) => setFormData({
										...formData,
										description: e.target.value
									}),
									placeholder: "Gunakan Ctrl+B untuk memilih teks dan membuat judul/sub-judul bold. Contoh: **Nama Produk**"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-3 pt-2",
									children: [/* @__PURE__ */ jsx("button", {
										type: "submit",
										className: "flex-1 py-4 bg-secondary text-white rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all",
										children: editingProduct ? "Update" : "Simpan"
									}), editingProduct && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => {
											setEditingProduct(null);
											setSelectedMainCategory("");
											setFormData({
												name: "",
												category: "",
												image: "",
												images: [
													"",
													"",
													"",
													""
												],
												description: ""
											});
										},
										className: "px-6 py-4 bg-black/5 rounded-2xl font-bold",
										children: "Batal"
									})]
								})
							]
						})
					]
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "lg:col-span-2 space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between px-2",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-black uppercase tracking-tighter",
							children: "Daftar Produk"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs font-black uppercase tracking-widest text-text-secondary",
							children: [
								filteredProducts.length,
								searchQuery.trim() ? ` / ${products.length}` : "",
								" Unit Terdaftar"
							]
						})]
					}),
					searchQuery.trim() && /* @__PURE__ */ jsxs("p", {
						className: "px-2 text-xs font-bold tracking-wide text-text-secondary",
						children: [
							"Hasil pencarian admin untuk \"",
							searchQuery,
							"\"."
						]
					}),
					loading ? /* @__PURE__ */ jsx("div", {
						className: "py-20 text-center text-text-secondary font-medium animate-pulse",
						children: "Memuat produk..."
					}) : /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4",
						children: [filteredProducts.map((product) => /* @__PURE__ */ jsxs(motion.div, {
							layout: true,
							className: "glass p-6 rounded-[24px] border-black/5 flex items-center gap-6",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: product.image,
									alt: product.name,
									className: "w-20 h-20 object-cover rounded-2xl bg-black/5"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex items-center gap-2 mb-1",
										children: /* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-0.5 rounded-full",
											children: product.category
										})
									}), /* @__PURE__ */ jsx("h3", {
										className: "font-bold truncate",
										children: product.name
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx("button", {
										onClick: () => handleEdit(product),
										className: "p-3 bg-secondary/10 text-secondary rounded-xl hover:bg-secondary hover:text-white transition-all",
										children: /* @__PURE__ */ jsx("i", { className: "bx bx-edit-alt text-xl" })
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => handleDelete(product.id),
										className: "p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all",
										children: /* @__PURE__ */ jsx("i", { className: "bx bx-trash text-xl" })
									})]
								})
							]
						}, product.id)), filteredProducts.length === 0 && /* @__PURE__ */ jsx("div", {
							className: "glass p-8 rounded-[24px] border-black/5 text-center",
							children: /* @__PURE__ */ jsx("p", {
								className: "font-bold text-text-secondary",
								children: "Produk tidak ditemukan. Coba kata kunci lain untuk edit produk."
							})
						})]
					})
				]
			})]
		})]
	});
};
var Admin_default = UNSAFE_withComponentProps(Admin);
//#endregion
//#region src/pages/NotFound.jsx
var NotFound_exports = /* @__PURE__ */ __exportAll({ default: () => NotFound_default });
var NotFound = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-[60vh] flex flex-col items-center justify-center text-center space-y-12",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx(motion.h1, {
					initial: {
						opacity: 0,
						scale: .5
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					className: "text-[150px] md:text-[250px] font-black tracking-tighter leading-none text-black/5 uppercase",
					children: "404"
				}), /* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center space-y-4",
					children: /* @__PURE__ */ jsx("h2", {
						className: "text-4xl md:text-6xl font-black uppercase tracking-tighter",
						children: "Sistem Offline."
					})
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xl text-text-secondary max-w-md mx-auto font-medium",
				children: "Halaman yang Anda cari tidak ditemukan atau telah terputus dari jaringan."
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/",
				className: "px-5 py-5 bg-primary text-background font-black text-2xl rounded-2xl hover:scale-105 transition-all shadow-2xl ",
				children: /* @__PURE__ */ jsxs("span", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("i", { className: "bx bx-left-arrow-alt text-3xl group-hover:-translate-x-2 transition-transform" }), "Kembali ke Beranda"]
				})
			})
		]
	});
};
var NotFound_default = UNSAFE_withComponentProps(NotFound);
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-B14fTpha.js",
		"imports": ["/assets/jsx-runtime-iNLlZvXa.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-DsS5SEc_.js",
			"imports": ["/assets/jsx-runtime-iNLlZvXa.js", "/assets/AppContext-CclEYKsb.js"],
			"css": ["/assets/root-Bshtkg9p.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"pages/Home": {
			"id": "pages/Home",
			"parentId": "root",
			"path": "/",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/Home-CraX1LP_.js",
			"imports": [
				"/assets/jsx-runtime-iNLlZvXa.js",
				"/assets/AnimatePresence-Bfk2ZeFT.js",
				"/assets/proxy-B-hc-kX8.js",
				"/assets/ProductCard-TyPWBkI_.js",
				"/assets/blog-CnsOiMos.js",
				"/assets/seo-CYuARZcg.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"pages/Products": {
			"id": "pages/Products",
			"parentId": "root",
			"path": "/products",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/Products-CjzxgSEh.js",
			"imports": [
				"/assets/jsx-runtime-iNLlZvXa.js",
				"/assets/AnimatePresence-Bfk2ZeFT.js",
				"/assets/proxy-B-hc-kX8.js",
				"/assets/ProductCard-TyPWBkI_.js",
				"/assets/AppContext-CclEYKsb.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"pages/ProductDetail": {
			"id": "pages/ProductDetail",
			"parentId": "root",
			"path": "/products/:slug",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/ProductDetail-B3IMHQdc.js",
			"imports": [
				"/assets/jsx-runtime-iNLlZvXa.js",
				"/assets/AnimatePresence-Bfk2ZeFT.js",
				"/assets/proxy-B-hc-kX8.js",
				"/assets/seo-CYuARZcg.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"pages/Blog": {
			"id": "pages/Blog",
			"parentId": "root",
			"path": "/blog",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/Blog-DDBzwNpw.js",
			"imports": [
				"/assets/jsx-runtime-iNLlZvXa.js",
				"/assets/proxy-B-hc-kX8.js",
				"/assets/blog-CnsOiMos.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"pages/BlogDetail": {
			"id": "pages/BlogDetail",
			"parentId": "root",
			"path": "/blog/:slug",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/BlogDetail-Di8UOOAg.js",
			"imports": [
				"/assets/jsx-runtime-iNLlZvXa.js",
				"/assets/proxy-B-hc-kX8.js",
				"/assets/blog-CnsOiMos.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"pages/About": {
			"id": "pages/About",
			"parentId": "root",
			"path": "/about",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/About-DwEchD9N.js",
			"imports": ["/assets/jsx-runtime-iNLlZvXa.js", "/assets/proxy-B-hc-kX8.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"pages/Projects": {
			"id": "pages/Projects",
			"parentId": "root",
			"path": "/projects",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/Projects-OHf_UmnQ.js",
			"imports": ["/assets/jsx-runtime-iNLlZvXa.js", "/assets/proxy-B-hc-kX8.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"pages/Contact": {
			"id": "pages/Contact",
			"parentId": "root",
			"path": "/contact",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/Contact-C171H-a_.js",
			"imports": ["/assets/jsx-runtime-iNLlZvXa.js", "/assets/proxy-B-hc-kX8.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"pages/Admin": {
			"id": "pages/Admin",
			"parentId": "root",
			"path": "/nsc-admin-panel-x9k2",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/Admin-DOi-2Xx4.js",
			"imports": [
				"/assets/jsx-runtime-iNLlZvXa.js",
				"/assets/proxy-B-hc-kX8.js",
				"/assets/AppContext-CclEYKsb.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"pages/NotFound": {
			"id": "pages/NotFound",
			"parentId": "root",
			"path": "*",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/NotFound-B7dUbNSA.js",
			"imports": ["/assets/jsx-runtime-iNLlZvXa.js", "/assets/proxy-B-hc-kX8.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-e7f8d513.js",
	"version": "e7f8d513",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"unstable_passThroughRequests": false,
	"unstable_subResourceIntegrity": false,
	"unstable_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"pages/Home": {
		id: "pages/Home",
		parentId: "root",
		path: "/",
		index: void 0,
		caseSensitive: void 0,
		module: Home_exports
	},
	"pages/Products": {
		id: "pages/Products",
		parentId: "root",
		path: "/products",
		index: void 0,
		caseSensitive: void 0,
		module: Products_exports
	},
	"pages/ProductDetail": {
		id: "pages/ProductDetail",
		parentId: "root",
		path: "/products/:slug",
		index: void 0,
		caseSensitive: void 0,
		module: ProductDetail_exports
	},
	"pages/Blog": {
		id: "pages/Blog",
		parentId: "root",
		path: "/blog",
		index: void 0,
		caseSensitive: void 0,
		module: Blog_exports
	},
	"pages/BlogDetail": {
		id: "pages/BlogDetail",
		parentId: "root",
		path: "/blog/:slug",
		index: void 0,
		caseSensitive: void 0,
		module: BlogDetail_exports
	},
	"pages/About": {
		id: "pages/About",
		parentId: "root",
		path: "/about",
		index: void 0,
		caseSensitive: void 0,
		module: About_exports
	},
	"pages/Projects": {
		id: "pages/Projects",
		parentId: "root",
		path: "/projects",
		index: void 0,
		caseSensitive: void 0,
		module: Projects_exports
	},
	"pages/Contact": {
		id: "pages/Contact",
		parentId: "root",
		path: "/contact",
		index: void 0,
		caseSensitive: void 0,
		module: Contact_exports
	},
	"pages/Admin": {
		id: "pages/Admin",
		parentId: "root",
		path: "/nsc-admin-panel-x9k2",
		index: void 0,
		caseSensitive: void 0,
		module: Admin_exports
	},
	"pages/NotFound": {
		id: "pages/NotFound",
		parentId: "root",
		path: "*",
		index: void 0,
		caseSensitive: void 0,
		module: NotFound_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };

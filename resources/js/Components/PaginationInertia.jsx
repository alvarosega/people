// resources/js/Components/PaginationInertia.jsx
import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Pagination({ links }) {
    if (!links || links.length === 0) return null;

    // Filtrar solo los links de paginación (excluir null y undefined)
    const validLinks = links.filter(link => link && link.label);

    if (validLinks.length <= 3) return null; // Solo mostrar si hay más de página anterior/siguiente

    const currentPage = getCurrentPage(validLinks);
    const totalPages = getTotalPages(validLinks);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-4 sm:px-0">
            {/* Información de página - Solo en desktop */}
            <div className="hidden sm:block text-sm text-text-secondary">
                Mostrando página {currentPage} de {totalPages}
            </div>

            {/* Navegación de paginación */}
            <div className="flex items-center justify-center space-x-1">
                {/* Botón Anterior */}
                {validLinks[0] && (
                    <PaginationLink 
                        link={validLinks[0]} 
                        isMobile={true}
                        title="Página anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </PaginationLink>
                )}

                {/* Números de página - Ocultos en móvil, visibles en tablet/desktop */}
                <div className="hidden xs:flex items-center space-x-1">
                    {renderPaginationLinks(validLinks, currentPage, totalPages)}
                </div>

                {/* Indicador móvil de página */}
                <div className="xs:hidden flex items-center space-x-2 text-sm text-text-secondary px-3 py-2">
                    <span>{currentPage}</span>
                    <span className="text-text-secondary/50">de</span>
                    <span>{totalPages}</span>
                </div>

                {/* Botón Siguiente */}
                {validLinks[validLinks.length - 1] && (
                    <PaginationLink 
                        link={validLinks[validLinks.length - 1]} 
                        isMobile={true}
                        title="Página siguiente"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </PaginationLink>
                )}
            </div>

            {/* Información móvil */}
            <div className="sm:hidden text-xs text-text-secondary/70 text-center">
                Total de páginas: {totalPages}
            </div>
        </div>
    );
}

// Componente para cada link de paginación
function PaginationLink({ link, children, isMobile = false, title = "" }) {
    const baseClasses = `
        flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-soft
        transition-all duration-200 border border-transparent
        disabled:opacity-40 disabled:cursor-not-allowed
    `;

    const activeClasses = `
        bg-gradient-to-r from-accent to-accent-gold text-black border-yellow-400
        shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40
    `;

    const inactiveClasses = `
        bg-white/5 backdrop-blur-sm border-white/10 text-text-primary 
        hover:bg-white/10 hover:border-white/20 hover:scale-105
    `;

    const disabledClasses = `
        bg-white/2 border-white/5 text-text-secondary/40
        cursor-not-allowed hover:scale-100
    `;

    if (!link.url) {
        return (
            <span
                className={`${baseClasses} ${disabledClasses}`}
                title={title}
            >
                {children || link.label}
            </span>
        );
    }

    return (
        <Link
            href={link.url}
            preserveScroll
            preserveState
            className={`${baseClasses} ${
                link.active ? activeClasses : inactiveClasses
            } ${isMobile ? 'min-w-[50px]' : ''}`}
            title={title}
        >
            {children || link.label}
        </Link>
    );
}

// Renderizar los links de paginación con ellipsis
function renderPaginationLinks(links, currentPage, totalPages) {
    const elements = [];

    // Siempre mostrar primera página si no es la actual
    if (currentPage > 1) {
        elements.push(
            <PaginationLink key="first" link={links[0]} />
        );
    }

    // Determinar rango de páginas a mostrar
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Ajustar para mostrar siempre 3 items cuando sea posible
    if (totalPages > 5) {
        if (currentPage <= 3) {
            endPage = 4;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - 3;
        }
    } else {
        // Para menos páginas, mostrar todas
        startPage = 2;
        endPage = totalPages - 1;
    }

    // Agregar ellipsis al inicio si es necesario
    if (startPage > 2) {
        elements.push(
            <span key="ellipsis-start" className="px-2 text-text-secondary/50">
                <MoreHorizontal className="h-4 w-4" />
            </span>
        );
    }

    // Agregar páginas intermedias
    for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
            elements.push(
                <PaginationLink key={i} link={links[i]} />
            );
        }
    }

    // Agregar ellipsis al final si es necesario
    if (endPage < totalPages - 1) {
        elements.push(
            <span key="ellipsis-end" className="px-2 text-text-secondary/50">
                <MoreHorizontal className="h-4 w-4" />
            </span>
        );
    }

    // Siempre mostrar última página si no es la actual y hay más de 1 página
    if (currentPage < totalPages && totalPages > 1) {
        elements.push(
            <PaginationLink key="last" link={links[links.length - 1]} />
        );
    }

    return elements;
}

// Helper functions CORREGIDAS
function getCurrentPage(links) {
    const activeLink = links.find(link => link.active);
    if (!activeLink) return 1;
    
    // Buscar el índice del link activo - los links están ordenados por página
    const activeIndex = links.findIndex(link => link.active);
    
    // El primer link es "Previous", el último es "Next", así que ajustamos
    if (activeIndex === 0) return 1; // Primer página
    if (activeIndex === links.length - 1) return links.length - 2; // Última página
    
    // Para páginas intermedias, el índice corresponde a la página
    return activeIndex;
}

function getTotalPages(links) {
    // El total de páginas es el número de links menos 2 (previous y next)
    return Math.max(1, links.length - 2);
}
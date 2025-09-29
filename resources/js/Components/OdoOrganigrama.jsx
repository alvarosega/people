import React, { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    Plus,
    Edit,
    Trash2,
    User,
    Users,
    Shield,
    Briefcase,
    MoreVertical,
    Star,
    MapPin
} from 'lucide-react';

/**
 * Renderiza un nodo del organigrama y sus hijos con diseño Apple + AB InBev
 */
const OdoOrganigrama = ({ node, onAddChild, onEdit, onDelete, level = 0 }) => {
    const { id, name, title, vacante, children = [], nivel_jerarquico = 0, legajo } = node;
    const [expanded, setExpanded] = useState(true);
    const [showActions, setShowActions] = useState(false);

    // Colores por nivel jerárquico
    const getLevelColor = () => {
        const colors = [
            'from-purple-500 to-purple-600',     // Nivel 0 - Director
            'from-blue-500 to-blue-600',         // Nivel 1 - Gerente
            'from-green-500 to-green-600',       // Nivel 2 - Supervisor
            'from-yellow-500 to-yellow-600',     // Nivel 3 - Líder
            'from-orange-500 to-orange-600',     // Nivel 4 - Coordinador
            'from-gray-500 to-gray-600',         // Nivel 5+ - Colaborador
        ];
        return colors[Math.min(nivel_jerarquico, colors.length - 1)];
    };

    // Icono por nivel jerárquico
    const getLevelIcon = () => {
        const icons = [
            <Shield className="h-3 w-3" />,      // Nivel 0 - Director
            <Star className="h-3 w-3" />,        // Nivel 1 - Gerente
            <Users className="h-3 w-3" />,       // Nivel 2 - Supervisor
            <User className="h-3 w-3" />,        // Nivel 3 - Líder
            <Briefcase className="h-3 w-3" />,   // Nivel 4 - Coordinador
            <User className="h-3 w-3" />,        // Nivel 5+ - Colaborador
        ];
        return icons[Math.min(nivel_jerarquico, icons.length - 1)];
    };

    const canAddChildren = true;

    return (
        <div className={`group relative ${level > 0 ? 'ml-8' : ''}`}>
            {/* Línea de conexión */}
            {level > 0 && (
                <div className="absolute -left-4 top-6 w-4 h-0.5 bg-white/20"></div>
            )}
            
            {/* Nodo principal */}
            <div className={`
                relative bg-primary/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-3
                transition-all duration-300 hover:border-white/20 hover:bg-primary/90 hover:shadow-2xl
                ${vacante ? 'border-dashed border-yellow-500/50' : ''}
            `}>
                {/* Indicador de nivel */}
                <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-gradient-to-b ${getLevelColor()}`}></div>

                {/* Header del nodo */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Avatar/Icono */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${getLevelColor()} flex items-center justify-center`}>
                            {vacante ? (
                                <User className="h-5 w-5 text-white/80" />
                            ) : (
                                getLevelIcon()
                            )}
                        </div>

                        {/* Información */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-text-primary truncate text-sm">
                                    {name || "Posición Vacante"}
                                </h4>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                                    bg-gradient-to-r ${getLevelColor()} text-white`}>
                                    {getLevelIcon()}
                                    N{nivel_jerarquico}
                                </span>
                                {vacante && (
                                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                        Vacante
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-text-secondary text-xs truncate mb-1">
                                {title || "Sin descripción"}
                            </p>
                            
                            {legajo && (
                                <p className="text-text-secondary/70 text-xs">
                                    Legajo: {legajo}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="p-1 rounded-soft text-text-secondary hover:text-text-primary hover:bg-white/10 
                                transition-all duration-200"
                            title={expanded ? "Contraer" : "Expandir"}
                        >
                            {expanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </button>
                        
                        <div className="relative">
                            <button
                                onClick={() => setShowActions(!showActions)}
                                className="p-1 rounded-soft text-text-secondary hover:text-text-primary hover:bg-white/10 
                                    transition-all duration-200"
                                title="Más acciones"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </button>

                            {/* Menú de acciones */}
                            {showActions && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setShowActions(false)}
                                    ></div>
                                    <div className="absolute right-0 top-8 z-50 bg-primary/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl min-w-40">
                                        <button
                                            onClick={() => {
                                                onEdit(node);
                                                setShowActions(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-soft text-text-primary 
                                                hover:bg-white/10 transition-all duration-200 text-sm"
                                        >
                                            <Edit className="h-3 w-3" />
                                            Editar
                                        </button>
                                        
                                        {canAddChildren && (
                                            <button
                                                onClick={() => {
                                                    onAddChild(node);
                                                    setShowActions(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-soft text-text-primary 
                                                    hover:bg-white/10 transition-all duration-200 text-sm"
                                            >
                                                <Plus className="h-3 w-3" />
                                                Agregar Subordinado
                                            </button>
                                        )}
                                        
                                        <button
                                            onClick={() => {
                                                onDelete(node);
                                                setShowActions(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-soft text-red-400 
                                                hover:bg-red-500/10 transition-all duration-200 text-sm"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Eliminar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contador de hijos */}
                {children.length > 0 && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 text-text-secondary/70 text-xs">
                            <Users className="h-3 w-3" />
                            <span>{children.length} subordinado{children.length !== 1 ? 's' : ''}</span>
                        </div>
                        
                        {/* Acciones rápidas */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                onClick={() => onAddChild(node)}
                                className="p-1 rounded-soft text-text-secondary hover:text-accent hover:bg-accent/10 
                                    transition-all duration-200"
                                title="Agregar subordinado"
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Hijos */}
            {expanded && children.length > 0 && (
                <div className="space-y-2 border-l-2 border-white/10 ml-4 pl-4">
                    {children.map((child) => (
                        <OdoOrganigrama
                            key={child.id}
                            node={child}
                            onAddChild={onAddChild}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OdoOrganigrama;
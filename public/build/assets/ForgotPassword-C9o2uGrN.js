import{u as F,r as c,j as e,H as V}from"./app-wHq-iQ3F.js";import{I as v,T as y,a as N}from"./TextInput-B89HFYTw.js";import{P as f}from"./PrimaryButton-BVox6gzk.js";import{G as $}from"./GuestLayout-CABnblqj.js";import{S as h,M as z}from"./shield-CE_thuzi.js";import{C as o}from"./circle-check-big-CXr80bBs.js";import{U as L}from"./user-BwF28Ao-.js";import{C as E}from"./clock-DUGUO98W.js";import{A as R}from"./arrow-left-Z9bS713_.js";import"./ThemeToggle-CmOVN8g3.js";import"./createLucideIcon-B2Q_C61x.js";function q({status:p}){const{data:n,setData:m,post:x,processing:b,errors:l,reset:k}=F({legajo:"",code:"",email:""}),[t,u]=c.useState(1),[i,s]=c.useState(!1),[a,d]=c.useState(0);c.useEffect(()=>{if(a>0){const r=setTimeout(()=>d(a-1),1e3);return()=>clearTimeout(r)}},[a]);const C=r=>{r.preventDefault(),s(!0),x(route("password.email"),{onSuccess:j=>{var w;u(2),d(60),(w=j.props.flash)!=null&&w.email&&m("email",j.props.flash.email),s(!1)},onError:()=>{s(!1)}})},I=r=>{r.preventDefault(),s(!0),x("/verify-reset-code",{onSuccess:()=>{u(3),s(!1)},onError:()=>{s(!1)}})},S=()=>{a>0||x(route("password.email"),{data:{legajo:n.legajo},onSuccess:()=>{d(60)}})},g=()=>{u(1),k("code","email"),d(0)};return e.jsxs($,{children:[e.jsx(V,{title:"Recuperar Contraseña"}),e.jsx("div",{className:`animate-scale-in mx-auto mt-6 sm:mt-12 lg:mt-16 min-h-screen 
    px-3 sm:px-6 lg:px-8`,children:e.jsx("div",{className:`mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 
    transform transition-all duration-500`,children:e.jsxs("div",{className:`rounded-2xl border border-white/10 bg-primary/95 backdrop-blur-xl shadow-2xl 
    p-6 sm:p-8 lg:p-10 relative overflow-hidden`,children:[e.jsx("div",{className:"absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full"}),e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("div",{className:"inline-flex items-center justify-center p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-4",children:e.jsx(h,{className:"h-8 w-8 text-yellow-500"})}),e.jsxs("h1",{className:"text-2xl font-bold bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent",children:[t===1&&"Recuperar Contraseña",t===2&&"Verificar Identidad",t===3&&"Código Verificado"]}),e.jsxs("p",{className:"mt-2 text-text-secondary text-sm",children:[t===1&&"Ingresa tu legajo para comenzar el proceso",t===2&&"Hemos enviado un código a tu correo",t===3&&"¡Código verificado correctamente!"]})]}),e.jsx("div",{className:"flex items-center justify-center mb-8",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:`flex items-center justify-center w-8 h-8 rounded-full border-2 ${t>=1?"bg-accent border-accent text-black":"border-text-secondary text-text-secondary"} transition-all duration-300`,children:t>1?e.jsx(o,{size:16}):"1"}),e.jsx("div",{className:`w-16 h-0.5 mx-2 ${t>=2?"bg-accent":"bg-text-secondary/30"} transition-all duration-300`}),e.jsx("div",{className:`flex items-center justify-center w-8 h-8 rounded-full border-2 ${t>=2?"bg-accent border-accent text-black":"border-text-secondary text-text-secondary"} transition-all duration-300`,children:t>2?e.jsx(o,{size:16}):"2"}),e.jsx("div",{className:`w-16 h-0.5 mx-2 ${t>=3?"bg-accent":"bg-text-secondary/30"} transition-all duration-300`}),e.jsx("div",{className:`flex items-center justify-center w-8 h-8 rounded-full border-2 ${t>=3?"bg-accent border-accent text-black":"border-text-secondary text-text-secondary"} transition-all duration-300`,children:"3"})]})}),p&&e.jsx("div",{className:"animate-slide-up mb-6 rounded-soft bg-green-500/10 border border-green-500/20 p-3",children:e.jsxs("div",{className:"flex items-center gap-2 text-sm font-medium text-green-400",children:[e.jsx(o,{size:16}),p]})}),t===1&&e.jsxs("form",{onSubmit:C,className:"animate-fade-in space-y-6",children:[e.jsxs("div",{children:[e.jsx(v,{htmlFor:"legajo",value:"Número de Legajo",className:"text-text-primary font-medium mb-2"}),e.jsxs("div",{className:"relative group",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(L,{className:"h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors duration-200"})}),e.jsx(y,{id:"legajo",type:"text",name:"legajo",value:n.legajo,className:`pl-10 pr-4 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                                text-text-primary placeholder-text-secondary/60
                                                transition-all duration-200
                                                focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-white/10
                                                group-hover:border-white/30
                                                ${l.legajo?"border-red-400/50 focus:border-red-400 focus:ring-red-400/20":""}`,autoComplete:"username",isFocused:!0,placeholder:"Ingresa tu legajo",onChange:r=>m("legajo",r.target.value)})]}),e.jsx(N,{message:l.legajo,className:"mt-2"})]}),e.jsxs(f,{className:`w-full justify-center rounded-soft py-4 font-semibold text-black
                                        bg-gradient-to-r from-accent to-accent-gold
                                        shadow-lg shadow-yellow-500/25
                                        transition-all duration-300
                                        hover:from-accent-yellow hover:to-accent
                                        hover:shadow-xl hover:shadow-yellow-500/40
                                        hover:scale-[1.02]
                                        active:scale-95
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                        relative overflow-hidden group`,disabled:b||i,children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"}),e.jsx("span",{className:"relative flex items-center justify-center gap-2",children:i?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"}),"Verificando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(h,{className:"h-4 w-4"}),"Continuar"]})})]})]}),t===2&&e.jsxs("form",{onSubmit:I,className:"animate-fade-in space-y-6",children:[e.jsx("div",{className:"bg-blue-500/10 border border-blue-500/20 rounded-soft p-4 mb-4",children:e.jsxs("div",{className:"flex items-center gap-2 text-sm text-blue-300",children:[e.jsx(z,{size:16}),"Código enviado a: ",e.jsx("strong",{className:"text-white",children:n.email||"tu correo corporativo"})]})}),e.jsxs("div",{children:[e.jsx(v,{htmlFor:"code",value:"Código de Verificación",className:"text-text-primary font-medium mb-2"}),e.jsxs("div",{className:"relative group",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(h,{className:"h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors duration-200"})}),e.jsx(y,{id:"code",type:"text",name:"code",value:n.code,className:`pl-10 pr-4 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                                text-text-primary placeholder-text-secondary/60
                                                transition-all duration-200
                                                focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-white/10
                                                group-hover:border-white/30
                                                ${l.code?"border-red-400/50 focus:border-red-400 focus:ring-red-400/20":""}`,autoComplete:"one-time-code",isFocused:!0,placeholder:"Ingresa el código de 6 dígitos",onChange:r=>m("code",r.target.value)})]}),e.jsx(N,{message:l.code,className:"mt-2"})]}),e.jsx("div",{className:"text-center",children:e.jsx("button",{type:"button",onClick:S,disabled:a>0,className:`text-sm transition-all duration-200 ${a>0?"text-text-secondary/50 cursor-not-allowed":"text-accent hover:text-accent-yellow hover:glow-text"}`,children:a>0?e.jsxs("span",{className:"flex items-center justify-center gap-1",children:[e.jsx(E,{size:14}),"Reenviar código en ",a,"s"]}):"¿No recibiste el código? Reenviar"})}),e.jsxs("div",{className:"flex gap-3",children:[e.jsxs("button",{type:"button",onClick:g,className:`flex-1 py-3 px-4 rounded-soft border border-white/20 text-text-primary 
                                            transition-all duration-200 hover:bg-white/10 hover:border-white/30
                                            flex items-center justify-center gap-2`,children:[e.jsx(R,{size:16}),"Atrás"]}),e.jsxs(f,{className:`flex-1 justify-center rounded-soft py-3 font-semibold text-black
                                            bg-gradient-to-r from-accent to-accent-gold
                                            shadow-lg shadow-yellow-500/25
                                            transition-all duration-300
                                            hover:from-accent-yellow hover:to-accent
                                            hover:shadow-xl hover:shadow-yellow-500/40
                                            hover:scale-[1.02]
                                            active:scale-95
                                            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                            relative overflow-hidden group`,disabled:b||i,children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"}),e.jsx("span",{className:"relative flex items-center justify-center gap-2",children:i?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"}),"Verificando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(o,{className:"h-4 w-4"}),"Verificar"]})})]})]})]}),t===3&&e.jsxs("div",{className:"animate-fade-in text-center space-y-6",children:[e.jsxs("div",{className:"bg-green-500/10 border border-green-500/20 rounded-2xl p-6",children:[e.jsx(o,{className:"h-16 w-16 text-green-400 mx-auto mb-4"}),e.jsx("h3",{className:"text-lg font-semibold text-green-400 mb-2",children:"¡Código Verificado!"}),e.jsx("p",{className:"text-text-secondary text-sm",children:"Tu identidad ha sido verificada correctamente. Ahora puedes restablecer tu contraseña."})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{type:"button",onClick:g,className:`flex-1 py-3 px-4 rounded-soft border border-white/20 text-text-primary 
                                            transition-all duration-200 hover:bg-white/10 hover:border-white/30`,children:"Volver al inicio"}),e.jsx(f,{className:`flex-1 justify-center rounded-soft py-3 font-semibold text-black
                                            bg-gradient-to-r from-accent to-accent-gold
                                            shadow-lg shadow-yellow-500/25
                                            transition-all duration-300
                                            hover:from-accent-yellow hover:to-accent
                                            hover:shadow-xl hover:shadow-yellow-500/40`,onClick:()=>window.location.href="/reset-password",children:"Restablecer Contraseña"})]})]}),e.jsx("div",{className:"animate-fade-in mt-8 pt-6 border-t border-white/10 text-center",children:e.jsx("p",{className:"text-xs text-text-secondary/70",children:"© 2025 • Sistema de recuperación"})})]})})}),e.jsx("style",{jsx:!0,children:`
                .login-background {
                    background: linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%);
                }
                
                .animate-scale-in {
                    animation: scaleIn 0.6s ease-out forwards;
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.4s ease-out forwards;
                }
                
                .glow-text {
                    text-shadow: 0 0 10px rgba(245, 224, 3, 0.5);
                }
                
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `})]})}export{q as default};

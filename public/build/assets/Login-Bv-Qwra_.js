import{j as e,u as y,r as d,H as j,L as v}from"./app-wHq-iQ3F.js";import{I as m,T as x,a as u}from"./TextInput-B89HFYTw.js";import{P as N}from"./PrimaryButton-BVox6gzk.js";import{G as k}from"./GuestLayout-CABnblqj.js";import{c as I}from"./createLucideIcon-B2Q_C61x.js";import{U as p}from"./user-BwF28Ao-.js";import{L,E as C,a as E}from"./lock-5Ume0uD6.js";import"./ThemeToggle-CmOVN8g3.js";/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],F=I("sparkles",D);function P({className:s="",...r}){return e.jsx("input",{...r,type:"checkbox",className:"rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 "+s})}function q({status:s,canResetPassword:r}){const{data:o,setData:n,post:f,processing:h,errors:t,reset:g}=y({legajo:"",password:"",remember:!1}),[l,b]=d.useState(!1),[c,i]=d.useState(!1),w=a=>{a.preventDefault(),i(!0),f(route("login"),{onFinish:()=>{g("password"),i(!1)},onError:()=>i(!1)})};return d.useEffect(()=>{document.body.classList.add("loaded")},[]),e.jsxs(k,{children:[e.jsx(j,{title:"Iniciar sesión"}),e.jsx("div",{className:"absolute inset-0 -z-10 bg-transparent"}),e.jsx("div",{className:`mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 
    transform transition-all duration-500 hover:transform-gpu hover:scale-[1.01]`,children:e.jsxs("div",{className:`rounded-2xl border border-white/10 bg-primary/95 backdrop-blur-xl shadow-2xl 
    p-6 sm:p-8 lg:p-10 relative overflow-hidden`,children:[e.jsx("div",{className:"absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full"}),e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("div",{className:"inline-flex items-center justify-center p-2 rounded-2xl bg-white border border-gray-200 shadow-md",children:e.jsx("img",{src:"/logo.jpg",alt:"AB InBev",className:"h-12 sm:h-14 md:h-16 lg:h-20 w-auto transition-all duration-300 hover:scale-105"})}),e.jsxs("div",{className:"mt-2 flex items-center justify-center gap-2",children:[e.jsx(F,{className:"h-4 w-4 text-yellow-500"}),e.jsx("span",{className:"text-xs font-medium text-text-secondary tracking-widest uppercase",children:"People"})]})]}),s&&e.jsx("div",{className:"animate-slide-up mb-6 rounded-soft bg-green-500/10 border border-green-500/20 p-3 text-center",children:e.jsx("div",{className:"text-sm font-medium text-green-400",children:s})}),e.jsxs("form",{onSubmit:w,className:"space-y-6",children:[e.jsxs("div",{className:"animate-fade-in",style:{animationDelay:"0.1s"},children:[e.jsx(m,{htmlFor:"legajo",value:"Legajo",className:"text-text-primary font-medium mb-2"}),e.jsxs("div",{className:"relative group",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(p,{className:"h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors duration-200"})}),e.jsx(x,{id:"legajo",type:"text",name:"legajo",value:o.legajo,className:`pl-10 pr-4 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                            text-text-primary placeholder-text-secondary/60
                                            transition-all duration-200
                                            focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-white/10
                                            group-hover:border-white/30
                                            ${t.legajo?"border-red-400/50 focus:border-red-400 focus:ring-red-400/20":""}`,autoComplete:"username",isFocused:!0,placeholder:"Ingresa tu legajo",onChange:a=>n("legajo",a.target.value)})]}),e.jsx(u,{message:t.legajo,className:"mt-2 animate-fade-in"})]}),e.jsxs("div",{className:"animate-fade-in",style:{animationDelay:"0.2s"},children:[e.jsx(m,{htmlFor:"password",value:"Contraseña",className:"text-text-primary font-medium mb-2"}),e.jsxs("div",{className:"relative group",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(L,{className:"h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors duration-200"})}),e.jsx(x,{id:"password",type:l?"text":"password",name:"password",value:o.password,className:`pl-10 pr-12 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                            text-text-primary placeholder-text-secondary/60
                                            transition-all duration-200
                                            focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-white/10
                                            group-hover:border-white/30
                                            ${t.password?"border-red-400/50 focus:border-red-400 focus:ring-red-400/20":""}`,autoComplete:"current-password",placeholder:"Ingresa tu contraseña",onChange:a=>n("password",a.target.value)}),e.jsx("button",{type:"button",onClick:()=>b(!l),className:`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-soft 
                                            text-text-secondary hover:text-text-primary hover:bg-white/10 
                                            transition-all duration-200 transform hover:scale-110`,children:l?e.jsx(C,{size:18,className:"transition-transform duration-200"}):e.jsx(E,{size:18,className:"transition-transform duration-200"})})]}),e.jsx(u,{message:t.password,className:"mt-2 animate-fade-in"})]}),e.jsxs("div",{className:"animate-fade-in flex items-center justify-between",style:{animationDelay:"0.3s"},children:[e.jsx("label",{className:"flex items-center text-sm text-text-secondary cursor-pointer group",children:e.jsx(P,{name:"remember",checked:o.remember,onChange:a=>n("remember",a.target.checked),className:"accent-accent border-white/20 bg-white/5"})}),r&&e.jsx(v,{href:route("password.request"),className:`text-sm text-text-secondary underline transition-all duration-200 
                                            hover:text-accent hover:no-underline hover:glow-text`,children:"¿Olvidaste tu contraseña?"})]}),e.jsx("div",{className:"animate-fade-in pt-4",style:{animationDelay:"0.4s"},children:e.jsxs(N,{className:`w-full justify-center rounded-soft py-3 sm:py-4 font-semibold text-black
                                        bg-gradient-to-r from-accent to-accent-gold
                                        shadow-lg shadow-yellow-500/25
                                        transition-all duration-300
                                        hover:from-accent-yellow hover:to-accent
                                        hover:shadow-xl hover:shadow-yellow-500/40
                                        hover:scale-[1.02]
                                        active:scale-95
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                        relative overflow-hidden group`,disabled:h||c,children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"}),e.jsx("span",{className:"relative flex items-center justify-center gap-2",children:c?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"}),"Ingresando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(p,{className:"h-4 w-4"}),"Ingresar"]})})]})})]}),e.jsx("div",{className:"animate-fade-in mt-8 pt-6 border-t border-white/10 text-center",style:{animationDelay:"0.5s"},children:e.jsx("p",{className:"text-xs text-text-secondary/70",children:"© 2025 Todos los derechos reservados"})})]})}),e.jsx("style",{jsx:!0,children:`

                
                body:not(.loaded) .animate-scale-in {
                    opacity: 0;
                    transform: scale(0.95);
                }
                
                .animate-scale-in {
                    animation: scaleIn 0.6s ease-out forwards;
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.5s ease-out forwards;
                }
                
                .hover-glow {
                    transition: all 0.3s ease;
                }
                
                .hover-glow:hover {
                    box-shadow: 0 0 30px rgba(245, 224, 3, 0.3);
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

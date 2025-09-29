import{u as $,r,j as e,H as B}from"./app-wHq-iQ3F.js";import{I as d,T as c,a as m}from"./TextInput-B89HFYTw.js";import{P as D}from"./PrimaryButton-BVox6gzk.js";import{G as R}from"./GuestLayout-CABnblqj.js";import{S as g,M as U}from"./shield-CE_thuzi.js";import{L as b,E as y,a as j}from"./lock-5Ume0uD6.js";import{C as v}from"./circle-check-big-CXr80bBs.js";import"./ThemeToggle-CmOVN8g3.js";import"./createLucideIcon-B2Q_C61x.js";function J({token:N,email:k}){const{data:s,setData:p,post:C,processing:S,errors:n,reset:_}=$({token:N,email:k,password:"",password_confirmation:""}),[o,I]=r.useState(!1),[i,P]=r.useState(!1),[x,l]=r.useState(!1),[t,u]=r.useState(0),[f,h]=r.useState({length:!1,uppercase:!1,lowercase:!1,number:!1,special:!1});r.useEffect(()=>{const a=()=>{const w={length:s.password.length>=8,uppercase:/[A-Z]/.test(s.password),lowercase:/[a-z]/.test(s.password),number:/[0-9]/.test(s.password),special:/[!@#$%^&*(),.?":{}|<>]/.test(s.password)};h(w);const z=Object.values(w).filter(Boolean).length*20;u(z)};s.password?a():(u(0),h({length:!1,uppercase:!1,lowercase:!1,number:!1,special:!1}))},[s.password]);const E=a=>{a.preventDefault(),l(!0),C(route("password.store"),{onFinish:()=>{_("password","password_confirmation"),l(!1)},onError:()=>{l(!1)}})},F=()=>t>=80?"bg-green-500":t>=60?"bg-yellow-500":t>=40?"bg-orange-500":"bg-red-500",L=()=>t>=80?"Fuerte":t>=60?"Buena":t>=40?"Regular":"Débil";return e.jsxs(R,{children:[e.jsx(B,{title:"Restablecer Contraseña"}),e.jsx("div",{className:"animate-scale-in mx-auto mt-8 min-h-screen px-4 sm:mt-16 sm:px-6 lg:px-8",children:e.jsx("div",{className:"mx-auto max-w-md transform transition-all duration-500",children:e.jsxs("div",{className:"rounded-2xl border border-white/10 bg-primary/95 backdrop-blur-xl shadow-2xl p-8 relative overflow-hidden",children:[e.jsx("div",{className:"absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full"}),e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("div",{className:"inline-flex items-center justify-center p-3 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4",children:e.jsx(g,{className:"h-8 w-8 text-green-500"})}),e.jsx("h1",{className:"text-2xl font-bold bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent",children:"Nueva Contraseña"}),e.jsx("p",{className:"mt-2 text-text-secondary text-sm",children:"Crea una nueva contraseña segura para tu cuenta"})]}),e.jsxs("form",{onSubmit:E,className:"space-y-6",children:[e.jsxs("div",{className:"animate-fade-in",children:[e.jsx(d,{htmlFor:"email",value:"Correo Electrónico",className:"text-text-primary font-medium mb-2"}),e.jsxs("div",{className:"relative group",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(U,{className:"h-5 w-5 text-text-secondary"})}),e.jsx(c,{id:"email",type:"email",name:"email",value:s.email,className:`pl-10 pr-4 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                            text-text-primary opacity-80 cursor-not-allowed`,autoComplete:"username",readOnly:!0})]}),e.jsx(m,{message:n.email,className:"mt-2"})]}),e.jsxs("div",{className:"animate-fade-in",style:{animationDelay:"0.1s"},children:[e.jsx(d,{htmlFor:"password",value:"Nueva Contraseña",className:"text-text-primary font-medium mb-2"}),e.jsxs("div",{className:"relative group",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(b,{className:"h-5 w-5 text-text-secondary group-focus-within:text-green-500 transition-colors duration-200"})}),e.jsx(c,{id:"password",type:o?"text":"password",name:"password",value:s.password,className:`pl-10 pr-12 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                            text-text-primary placeholder-text-secondary/60
                                            transition-all duration-200
                                            focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white/10
                                            group-hover:border-white/30
                                            ${n.password?"border-red-400/50 focus:border-red-400 focus:ring-red-400/20":""}`,autoComplete:"new-password",isFocused:!0,placeholder:"Ingresa tu nueva contraseña",onChange:a=>p("password",a.target.value)}),e.jsx("button",{type:"button",onClick:()=>I(!o),className:`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-soft 
                                            text-text-secondary hover:text-text-primary hover:bg-white/10 
                                            transition-all duration-200 transform hover:scale-110`,children:o?e.jsx(y,{size:18,className:"transition-transform duration-200"}):e.jsx(j,{size:18,className:"transition-transform duration-200"})})]}),s.password&&e.jsxs("div",{className:"mt-3 space-y-2 animate-slide-up",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs",children:[e.jsx("span",{className:"text-text-secondary",children:"Seguridad de la contraseña:"}),e.jsx("span",{className:`font-medium ${t>=80?"text-green-400":t>=60?"text-yellow-400":t>=40?"text-orange-400":"text-red-400"}`,children:L()})]}),e.jsx("div",{className:"w-full bg-white/10 rounded-full h-2",children:e.jsx("div",{className:`h-2 rounded-full transition-all duration-300 ${F()}`,style:{width:`${t}%`}})})]}),s.password&&e.jsxs("div",{className:"mt-3 space-y-1 animate-slide-up",children:[e.jsx("div",{className:"text-xs text-text-secondary mb-2",children:"La contraseña debe contener:"}),[{key:"length",text:"Mínimo 8 caracteres"},{key:"uppercase",text:"Una letra mayúscula"},{key:"lowercase",text:"Una letra minúscula"},{key:"number",text:"Un número"},{key:"special",text:"Un carácter especial"}].map(a=>e.jsxs("div",{className:"flex items-center gap-2 text-xs",children:[e.jsx(v,{size:12,className:f[a.key]?"text-green-500":"text-text-secondary/50"}),e.jsx("span",{className:f[a.key]?"text-green-400":"text-text-secondary/70",children:a.text})]},a.key))]}),e.jsx(m,{message:n.password,className:"mt-2"})]}),e.jsxs("div",{className:"animate-fade-in",style:{animationDelay:"0.2s"},children:[e.jsx(d,{htmlFor:"password_confirmation",value:"Confirmar Nueva Contraseña",className:"text-text-primary font-medium mb-2"}),e.jsxs("div",{className:"relative group",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(b,{className:"h-5 w-5 text-text-secondary group-focus-within:text-green-500 transition-colors duration-200"})}),e.jsx(c,{type:i?"text":"password",id:"password_confirmation",name:"password_confirmation",value:s.password_confirmation,className:`pl-10 pr-12 py-3 w-full rounded-soft border border-white/20 bg-white/5 backdrop-blur-sm 
                                            text-text-primary placeholder-text-secondary/60
                                            transition-all duration-200
                                            focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white/10
                                            group-hover:border-white/30
                                            ${n.password_confirmation?"border-red-400/50 focus:border-red-400 focus:ring-red-400/20":""}`,autoComplete:"new-password",placeholder:"Confirma tu nueva contraseña",onChange:a=>p("password_confirmation",a.target.value)}),e.jsx("button",{type:"button",onClick:()=>P(!i),className:`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-soft 
                                            text-text-secondary hover:text-text-primary hover:bg-white/10 
                                            transition-all duration-200 transform hover:scale-110`,children:i?e.jsx(y,{size:18,className:"transition-transform duration-200"}):e.jsx(j,{size:18,className:"transition-transform duration-200"})})]}),s.password_confirmation&&e.jsx("div",{className:"mt-2 animate-slide-up",children:e.jsxs("div",{className:`flex items-center gap-2 text-xs ${s.password===s.password_confirmation&&s.password?"text-green-400":"text-red-400"}`,children:[e.jsx(v,{size:12}),s.password===s.password_confirmation&&s.password?"Las contraseñas coinciden":"Las contraseñas no coinciden"]})}),e.jsx(m,{message:n.password_confirmation,className:"mt-2"})]}),e.jsx("div",{className:"animate-fade-in pt-4",style:{animationDelay:"0.3s"},children:e.jsxs(D,{className:`w-full justify-center rounded-soft py-4 font-semibold text-black
                                        bg-gradient-to-r from-green-500 to-green-600
                                        shadow-lg shadow-green-500/25
                                        transition-all duration-300
                                        hover:from-green-400 hover:to-green-500
                                        hover:shadow-xl hover:shadow-green-500/40
                                        hover:scale-[1.02]
                                        active:scale-95
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                        relative overflow-hidden group`,disabled:S||x||s.password!==s.password_confirmation||t<40,children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"}),e.jsx("span",{className:"relative flex items-center justify-center gap-2",children:x?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"}),"Restableciendo..."]}):e.jsxs(e.Fragment,{children:[e.jsx(g,{className:"h-4 w-4"}),"Restablecer Contraseña"]})})]})})]}),e.jsx("div",{className:"animate-fade-in mt-8 pt-6 border-t border-white/10 text-center",children:e.jsx("p",{className:"text-xs text-text-secondary/70",children:"© 2024 AB InBev • Sistema de seguridad certificado"})})]})})}),e.jsx("style",{jsx:!0,children:`
                .login-background {
                    background: linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%);
                }
                
                .animate-scale-in {
                    animation: scaleIn 0.6s ease-out forwards;
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.4s ease-out forwards;
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
            `})]})}export{J as default};

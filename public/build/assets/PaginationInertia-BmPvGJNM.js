import{c as o}from"./createLucideIcon-B1zq_IZJ.js";import{j as e,L as h}from"./app-C9xUaY8j.js";import{C as m,a as p}from"./chevron-right-CF9tP9cu.js";/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]],d=o("ellipsis",f);/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],M=o("search",u);/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],L=o("square-pen",j);/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],_=o("trash-2",y);function C({links:t}){if(!t||t.length===0)return null;const s=t.filter(r=>r&&r.label);if(s.length<=3)return null;const a=b(s),n=w(s);return e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-4 sm:px-0",children:[e.jsxs("div",{className:"hidden sm:block text-sm text-text-secondary",children:["Mostrando página ",a," de ",n]}),e.jsxs("div",{className:"flex items-center justify-center space-x-1",children:[s[0]&&e.jsx(l,{link:s[0],isMobile:!0,title:"Página anterior",children:e.jsx(m,{className:"h-4 w-4"})}),e.jsx("div",{className:"hidden xs:flex items-center space-x-1",children:v(s,a,n)}),e.jsxs("div",{className:"xs:hidden flex items-center space-x-2 text-sm text-text-secondary px-3 py-2",children:[e.jsx("span",{children:a}),e.jsx("span",{className:"text-text-secondary/50",children:"de"}),e.jsx("span",{children:n})]}),s[s.length-1]&&e.jsx(l,{link:s[s.length-1],isMobile:!0,title:"Página siguiente",children:e.jsx(p,{className:"h-4 w-4"})})]}),e.jsxs("div",{className:"sm:hidden text-xs text-text-secondary/70 text-center",children:["Total de páginas: ",n]})]})}function l({link:t,children:s,isMobile:a=!1,title:n=""}){const r=`
        flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-soft
        transition-all duration-200 border border-transparent
        disabled:opacity-40 disabled:cursor-not-allowed
    `,c=`
        bg-gradient-to-r from-accent to-accent-gold text-black border-yellow-400
        shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40
    `,i=`
        bg-white/5 backdrop-blur-sm border-white/10 text-text-primary 
        hover:bg-white/10 hover:border-white/20 hover:scale-105
    `,x=`
        bg-white/2 border-white/5 text-text-secondary/40
        cursor-not-allowed hover:scale-100
    `;return t.url?e.jsx(h,{href:t.url,preserveScroll:!0,preserveState:!0,className:`${r} ${t.active?c:i} ${a?"min-w-[50px]":""}`,title:n,children:s||t.label}):e.jsx("span",{className:`${r} ${x}`,title:n,children:s||t.label})}function v(t,s,a){const n=[];s>1&&n.push(e.jsx(l,{link:t[0]},"first"));let r=Math.max(2,s-1),c=Math.min(a-1,s+1);a>5?s<=3?c=4:s>=a-2&&(r=a-3):(r=2,c=a-1),r>2&&n.push(e.jsx("span",{className:"px-2 text-text-secondary/50",children:e.jsx(d,{className:"h-4 w-4"})},"ellipsis-start"));for(let i=r;i<=c;i++)i>1&&i<a&&n.push(e.jsx(l,{link:t[i]},i));return c<a-1&&n.push(e.jsx("span",{className:"px-2 text-text-secondary/50",children:e.jsx(d,{className:"h-4 w-4"})},"ellipsis-end")),s<a&&a>1&&n.push(e.jsx(l,{link:t[t.length-1]},"last")),n}function b(t){if(!t.find(n=>n.active))return 1;const a=t.findIndex(n=>n.active);return a===0?1:a===t.length-1?t.length-2:a}function w(t){return Math.max(1,t.length-2)}export{C as P,M as S,_ as T,L as a};
